var urls = "http://192.168.1.28/api/WuMi/";
Array.prototype.remove = function(index) {
//	alert(val)
//	var index = this.indexOf(val);
	if(index > -1) {
		this.splice(index, 1);
	}
};

function exceptionlog() {
	//后期完善
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
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

function currentTime(dt) {
	var d = new Date(dt);
	var current = '';
	current += d.getFullYear() + '.';
	var month = d.getMonth() + 1;
	current += (month < 10 ? "0" + month : month) + '.';
	current += (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
	current += " ";
	current += d.getHours() + ':';
	current += (d.getMinutes() < 10 ? ("0" + d.getMinutes()) : d.getMinutes()) + ':';
	current += (d.getSeconds() < 10 ? ("0" + d.getSeconds()) : d.getSeconds());
	return current;
}

//获取时间（时分秒）
function currentHours() {
	var d = new Date();
	var hourstr = "";
	hourstr += d.getHours() + ':';
	hourstr += (d.getMinutes() < 10 ? ("0" + d.getMinutes()) : d.getMinutes()) + ':';
	hourstr += (d.getSeconds() < 10 ? ("0" + d.getSeconds()) : d.getSeconds());
	return hourstr;
}

//获取当前日期和周期
function currentDays() {
	var d = new Date();
	var yearstr = '';
	yearstr += d.getFullYear() + '.';
	var month = d.getMonth() + 1;
	yearstr += (month < 10 ? "0" + month : month) + '.';
	yearstr += (d.getDate() < 10 ? "0" + d.getDate() : d.getDate());
	var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
	var week = today[d.getDay()];
	return week + ',' + yearstr;
}

function formatterTime(startTime, endTime) { //两个时间先后比较
	var sTime = new Date(startTime);
	var eTime = new Date(endTime);
	var secondsTotal = eTime.getTime() - sTime.getTime();
	//计算出相差天数
	var days = Math.floor(secondsTotal / (24 * 3600 * 1000));
	//计算出小时数
	var leave1 = secondsTotal % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
	var hours = Math.floor(leave1 / (3600 * 1000));
	//计算相差分钟数
	var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
	var minutes = Math.floor(leave2 / (60 * 1000));
	//计算相差秒数
	var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
	var seconds = Math.round(leave3 / 1000);

	var result = hours + (minutes / 60);
	result = result.toFixed(2);
	return result;
}

function getFirstTime(fTime) {
	var fTime = new Date(fTime);

	var result = fTime.getHours() + (fTime.getMinutes() / 60);
	result = result.toFixed(2);

	//	alert(result)
	return result;
}

function changeNumToTime(fTime) {
	if(fTime == null || fTime == "") {
		return "00:00";
	}

	var time = fTime.toString().split('.');
	var result = "";
	time[1] = (time[1] * 6 / 10).toFixed(0);
	if(time[1] < 10) {
		time[1] = "0" + time[1];
	}

	if(time[0] < 10) {
		time[0] = "0" + time[0] + ":";
		if(time[1] == "0") {
			time[1] = (time[1] * 6 / 10).toFixed(0) + "0";
		}
	} else {
		time[0] = time[0] + ":";
		if(time[1] == "0") {
			time[1] = (time[1] * 6 / 10).toFixed(0) + "0";
		}
	}
	return time[0] + time[1];
}

//通过key获取url中传递的值
function GetQueryString(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);

	if(r != null) return unescape(r[2]);
	return null;
}

//实现数据的总计通过函数柯里华（currying）比如月底求总计、年底求总和；

//实现函数节流,减少性能消耗，onresize、mousemove;upload
var throttle = function(fn, inteval) {
	var _self = fn, //保存当前执行的函数
		timer, //定时器
		firstTime = true; //是否是第一次执行
	return function() {
		var args = arguments,
			_me = this;
		if(firstTime) {
			_self.apply(_me, args);
			return firstTime = false;
		}
		if(timer) { //定时器还在，说明上次函数还没执行完毕
			return false;
		}
		timer = setTimeout(function() { //延迟一段时间执行
			clearTimeout(timer);
			timer = null;
			_self.apply(_me, args);
		}, inteval || 500)
	}
};

//比如动态绑定1000节点，如何不一下全部绑定完毕，考虑到性能问题
//通过自己方式进行的实现，通过定时器和callee
var timeChucks = function(arry, fn, count, interval) {
	var timer;
	timer = setTimeout(function() {
		if(arry.length != 0) {
			for(var i = 0; i < Math.min(count, arry.length + 1); i++) {
				var obj = arry.shift();
				fn(obj)
			}
			setTimeout(arguments.callee, interval || 500);
		} else {
			clearInterval(timer);
			timer = null;
		}
	}, 500)
};

//设计模式上给的例子；
var timeChuck = function(arry, fn, count) {
	var obj, timers;
	var start = function() {
		for(var i = 0; i < Math.min(count || 1, arry.length); i++) {
			var obj = arry.shift();
			fn(obj);
		}
	};
	return function() {
		timers = setInterval(function() {
			if(arry.length === 0) {
				return clearInterval(timers);
			}
			start();
		}, 200);
	}
}

//策略模式之-表单验证
var strategyForm = {
	isNonEmpty: function(value, errorMsg) { //不为空
		if(value == "") {
			return errorMsg;
		}
	},
	minLength: function(value, length, errorMsg) { //最小长度
		console.log(value.length)
		console.log(length)
		if(value.length < length) {
			return errorMsg;
		}
	},
	isMobile: function(value, errorMsg) { //手机号码
		if(!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
			return errorMsg;
		}
	},
	isEmail: function(value, errorMsg) {
		var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
		if(!reg.test(value)) {
			return errorMsg;
		}
	}
};

var Validator = function() {
	this.cach = [];
};

Validator.prototype.add = function(value, rules) {
	var self = this;
	for(var i = 0, rule; rule = rules[i++];) {
		(function(rule) {
			var strategyAry = rule.stratery.split(':');
			var errorMsg = rule.errorMsg;
			self.cach.push(function() {
				var strategy = strategyAry.shift();
				strategyAry.unshift(value);
				strategyAry.push(errorMsg);
				return strategyForm[strategy].apply(value, strategyAry);
			})
		})(rule)
	}
};

Validator.prototype.start = function() {
	for(var i = 0, validatorFunc; validatorFunc = this.cach[i++];) {
		var msg = validatorFunc();
		if(msg) {
			return msg;
		}
	}
};

var validatorFunc = function() {
	var validator = new Validator();
	validator.add("2", 'isNonEmpty', '用户 名 不 能为 空'); // 改成： 
	validator.add("", 'minLength:10', '用户 名 长度 不能 小于 10 位');
	var errorMsg = validator.start();
	return errorMsg;
};