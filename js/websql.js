function initData() {
	var db = openDatabase('tomatoData', '2.0', 'LocalData', 50 * 1024 * 1024);

	function createTable() { //创建表，默认初始化就创建
		db.transaction(function(tx) {
			tx.executeSql("CREATE TABLE IF NOT EXISTS TaskMode (id unique, userId,nameType,clockType,createtime)");
			tx.executeSql("CREATE TABLE IF NOT EXISTS TaskList (id unique, belongTask,taskName,createtime,keepTime,mark,orderTime)");
		});
		db.transaction(function(tx) {
			var userId = localStorage.getItem("uuid");
			var time = new Date().Format("yyyy-MM-dd");
			var ordertime = new Date().Format("yyyy-MM-dd hh:mm:ss");
			tx.executeSql('INSERT INTO TaskMode (id, userId,nameType,clockType,createtime) VALUES (?,?,?,?,?)', [1, userId, "工作", "番茄钟", time]);
			tx.executeSql('INSERT INTO TaskMode (id, userId,nameType,clockType,createtime) VALUES (?,?,?,?,?)', [2, userId, "学习", "时间累计", time]);
			tx.executeSql('INSERT INTO TaskMode (id, userId,nameType,clockType,createtime) VALUES (?,?,?,?,?)', [3, userId, "运动", "倒计时", time]);
			tx.executeSql('INSERT INTO TaskMode (id, userId,nameType,clockType,createtime) VALUES (?,?,?,?,?)', [4, userId, "左滑显示多功能菜单", "倒计时", time]);

//						tx.executeSql('INSERT INTO TaskList (id, belongTask,taskName,createtime,keepTime,mark,orderTime) VALUES (?,?,?,?,?,?,?)', [1, "1", "编程", "2018-03-31", "20", "20分钟", ordertime]);
//						tx.executeSql('INSERT INTO TaskList (id, belongTask,taskName,createtime,keepTime,mark,orderTime) VALUES (?,?,?,?,?,?,?)', [2, "2", "编程2", "2018-03-31", "50", "50分钟", ordertime]);
//						tx.executeSql('INSERT INTO TaskList (id, belongTask,taskName,createtime,keepTime,mark,orderTime) VALUES (?,?,?,?,?,?,?)', [3, "3", "编程3",  "2018-03-30", "40", "40分钟", ordertime]);
//						tx.executeSql('INSERT INTO TaskList (id, belongTask,taskName,createtime,keepTime,mark,orderTime) VALUES (?,?,?,?,?,?,?)', [4, "1", "编程4", "2018-03-28", "60", "60分钟", ordertime]);
//						tx.executeSql('INSERT INTO TaskList (id, belongTask,taskName,createtime,keepTime,mark,orderTime) VALUES (?,?,?,?,?,?,?)', [5, "1", "编程5", "2018-03-31", "10", "10分钟", ordertime]);
//						tx.executeSql('INSERT INTO TaskList (id, belongTask,taskName,createtime,keepTime,mark,orderTime) VALUES (?,?,?,?,?,?,?)', [6, "4", "编程6",  "2018-03-28", "25", "25分钟", ordertime]);
//						tx.executeSql('INSERT INTO TaskList (id, belongTask,taskName,createtime,keepTime,mark,orderTime) VALUES (?,?,?,?,?,?,?)', [7, "4", "编程7", "2018-03-30", "20", "20分钟", ordertime]);
//						tx.executeSql('INSERT INTO TaskList (id, belongTask,taskName,createtime,keepTime,mark,orderTime) VALUES (?,?,?,?,?,?,?)', [8, "2", "编程8",  "2018-03-31", "30", "30分钟", ordertime]);
		});
	}

	function selectData(tabelName, condition, orderBy, callback) { //查询语句(表名,查询条件,排序方式)因为是异步的所以需要无法进行封装，在页面进行调用；
		var result = false;
		db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM ' + tabelName + '  ' + condition + '  ' + orderBy + '', [], function(tx, results) {
				var len = results.rows.length;
				for(var i = 0; i < len; i++) {
//					console.log(JSON.stringify(results.rows.item(i)))
				}
				if(len > 0) {
					callback(results);
					return;
				}
				callback(result)
			})
		})
	}

	function stasticDataByDay(startTime, endTime, callback) { //按时间段来统计结果；可以是一天、一周、一个月甚至更久
		var result = false;
		var staResult = [];
		db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM TaskMode Group by id', [], function(tx, results) {
				var len = results.rows.length;
				var count = 0;
				for(let i = 0; i < len; i++) {
					var child = [];
					var belongId = results.rows.item(i).id;
//					console.log(JSON.stringify(results.rows.item(i)))
					stasticDataByModeId(belongId, startTime, endTime, function(callData, total) {
						staResult.push({ 
							id:results.rows.item(i).id,
							name: results.rows.item(i).nameType,
							time: startTime == endTime ? startTime : (startTime + "至" + endTime),
							total: total,
							data: callData
						});
						if(len == staResult.length) {
							callback(staResult)
						}
					})
				}
			})
		})
	}

	function stasticDataByModeId(modeId, startTime, endTime, callback) { //根据类型筛选出执行的时间；
		db.transaction(function(tx) {
			var searchS = new Date(startTime);
			searchS.setDate((searchS.getDate() - 1));
			searchS = searchS.Format("yyyy-MM-dd");

			var searchE = new Date(endTime);
			searchE.setDate((searchE.getDate() + 1));
			searchE = searchE.Format("yyyy-MM-dd");
			tx.executeSql('SELECT * FROM TaskList WHERE belongTask = "' + modeId + '" AND createtime between "' + searchS + ' 00:00" AND "' + searchE + ' 23:59" ORDER BY createtime', [], function(tx, listResult) {
				var child = [];
				var total = 0;
				var listLen = listResult.rows.length;
				for(var j = 0; j < listLen; j++) {
//					console.log(modeId + "的" + JSON.stringify(listResult.rows.item(j)))
					var listData = listResult.rows.item(j);
					child.push({
						belongTask: listData.belongTask,
						taskName: listData.taskName,
						createtime: listData.createtime,
						keepTime: listData.keepTime,
						orderTime: listData.orderTime,
						mark: listData.mark
					});
					total = total + parseInt(listData.keepTime);
				}
				callback(child, total)
			})
		})
	}

	function stasticWeekDataByDay(startTime, endTime, callback) { //统计时间区间的返回区间的数据集合
		var result = false;
		var staResult = [];
		db.transaction(function(tx) {
			tx.executeSql('SELECT * FROM TaskMode Group by nameType', [], function(tx, results) {
				var len = results.rows.length;
				var count = 0;
				for(let i = 0; i < len; i++) {
					var child = [];
					var belongId = results.rows.item(i).id;
					stasticWeekDataByModeId(belongId, startTime, endTime, function(callData) {
						staResult.push({
							name: results.rows.item(i).nameType,
							time: startTime + "&&" + endTime,
							data: callData
						});
						if(len == staResult.length) {
							callback(staResult)
						}
					})
				}
			})
		})
	}

	function stasticWeekDataByModeId(modeId, startTime, endTime, callback) { //根据类型筛选出执行的时间；
		db.transaction(function(tx) {
			var searchS = new Date(startTime);
			searchS.setDate((searchS.getDate() - 1));
			searchS = searchS.Format("yyyy-MM-dd");

			var searchE = new Date(endTime);
			searchE.setDate((searchE.getDate() + 1));
			searchE = searchE.Format("yyyy-MM-dd");

			tx.executeSql('SELECT sum(keepTime) as keepTime,createtime FROM TaskList WHERE belongTask = "' + modeId + '" AND createtime between "' + searchS + ' 00:00" AND "' + searchE + ' 23:59" GROUP BY createtime', [], function(tx, listResult) {
				var child = [];
				var total = 0;
				var listLen = listResult.rows.length;
				var currentTime = "";
				var timeLen = getDays(startTime, endTime);
				var starTime = new Date(startTime).Format("yyyy-MM-dd");

				for(let i = 0; i <= timeLen; i++) {
					starTime = new Date(startTime).Format("yyyy-MM-dd");
					var count = 0;
					for(var j = 0; j < listLen; j++) {
						var listData = listResult.rows.item(j);
						if(starTime == listData.createtime) {

							child.push({
								createtime: listData.createtime,
								total: listData.keepTime,
								mark: listData.keepTime + "分钟"
							});
						} else {
							count++
						}
					}
					if(count == listLen) {
						child.push({
							createtime: starTime,
							total: 0,
							mark: 0 + "分钟"
						})
					}
					starTime = new Date(starTime);
					starTime.setDate((starTime.getDate() + 1));
					startTime = starTime.Format("yyyy-MM-dd");
				}
				callback(child)
			})
		})
	}

	function addData(tableName, data, callback) { //添加数据
		var result = false;
		var tName = tableName;
		db.transaction(function(tx) {
			var idIndex = 0;
			var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
			var uuid = localStorage.getItem("uuid");
			tx.executeSql("SELECT * FROM " + tName + " ORDER BY id desc", [], function(tx, results) {
				var len = results.rows.length;
				if(len > 0) {
					idIndex = results.rows.item(0).id;
				}
				data.insert(0, (idIndex + 1)); //防止id重复导致数据添加不进去，每次最大ID+1

				data.push(time); //队尾加入时间
				switch(tableName) {
					case "TaskMode":
						data.insert(1, uuid);
						
						tx.executeSql('INSERT INTO TaskMode (id, userId,nameType,clockType,createtime) VALUES (?,?,?,?,?,?)', data);
						result = true;
						break;
					case "TaskList":
					
					data.push(new Date().Format("yyyy-MM-dd")); //队尾加入时间
						tx.executeSql('INSERT INTO TaskList (id, belongTask,taskName,keepTime,mark,ordertime,createtime) VALUES (?,?,?,?,?,?,?)', data);
						result = true;
						break;
				}
				callback(result);
			})
		})
	}

	function updateData(tableName, data, callback) { //更新数据
		var result = false;
		var time = new Date().Format("yyyy-MM-dd hh:mm:ss");
		data.insert(2, time);
		db.transaction(function(tx) {
			switch(tableName) {
				case "TaskMode":
					tx.executeSql("UPDATE TaskMode SET nameType=? , clockType=? , createtime=?  WHERE id=?", data);
					result = true;
					break;
				case "TaskList":
					tx.executeSql('UPDATE TaskList SET belongTask=? ,taskName=? ,startTime=? ,endTime=? ,breakTime=? ,PeriodTime=? WHERE id=?', data);
					result = true;
					break;
			}
			callback(result);
		});
	}

	function deleteData(tableName, data, callback) { //删除数据 一条条的删除
		var result = false;
		db.transaction(function(tx) {
			switch(tableName) {
				case "TaskMode":
					tx.executeSql('DELETE FROM TaskMode WHERE id=?', data);
					result = true;
					break;
				case "TaskList":
					tx.executeSql('DELETE FROM TaskList WHERE id=?', data);
					result = true;
					break;
			}
			callback(result);
		})
	}

	return {
		createTable: createTable,
		selectData: selectData,
		stasticDataByDay: stasticDataByDay,
		stasticDataByModeId:stasticDataByModeId,
		addData: addData,
		updateData: updateData,
		deleteData: deleteData,
		db: db,
		stasticWeekDataByDay: stasticWeekDataByDay
	}
}

// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function(fmt) { //author: meizz 
	var o = {
		"M+": this.getMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for(var k in o)
		if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}

function getDays(strDateStart, strDateEnd) {
	var strSeparator = "-"; //日期分隔符
	var oDate1;
	var oDate2;
	var iDays;
	oDate1 = strDateStart.split(strSeparator);
	oDate2 = strDateEnd.split(strSeparator);
	var strDateS = new Date(oDate1[0], oDate1[1] - 1, oDate1[2]);
	var strDateE = new Date(oDate2[0], oDate2[1] - 1, oDate2[2]);
	iDays = parseInt(Math.abs(strDateS - strDateE) / 1000 / 60 / 60 / 24) //把相差的毫秒数转换为天数 
	return iDays;
}

Array.prototype.insert = function(index, item) {
	this.splice(index, 0, item);
};