var drawCan = function(canvas, longTime) { //番茄钟的canvas
	var ctx = canvas.getContext('2d');
	var mW = canvas.width = 300; //画板宽度
	var mH = canvas.height = 300; //画板高度
	var lineWidth = 1; //line宽度
	var r = mW / 2; //中间位置
	var longtime = parseInt(longTime) * 60; //换算成秒数
	var cR = 80; //圆半径 
	var startAngle = -(1 / 2 * Math.PI); //开始角度
	var endAngle = startAngle + 2 * Math.PI; //结束角度
	//var xAngle = 1 * (Math.PI /1024); //偏移角度量		
	var xAngle = (endAngle - startAngle) / longtime; //偏移角度量			
	var fontSize = 40; //字号大小 
	var tmpAngle = startAngle; //临时角度变量
	var currentType = "";

	//渲染函数
	var rander = function(msg) {
		if(tmpAngle >= endAngle) {
			return;
		} else if(tmpAngle + xAngle > endAngle) {
			tmpAngle = endAngle;
		} else {
			tmpAngle += xAngle;
		}
		ctx.clearRect(0, 0, mW, mH);
		//画圈
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = '#9ce5ef';
		ctx.translate(r, r); //重定义圆点
		ctx.rotate(-Math.PI); //最上方为起点

		for(var i = 0; i <= tmpAngle - startAngle; i += xAngle) { //绘图
			ctx.moveTo(0, 150);
			ctx.lineTo(0, cR);
			ctx.rotate(xAngle); //通过旋转角度和画点的方式绘制圆
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		//写字
		ctx.fillStyle = '#FFFFFF';
		ctx.font = fontSize + 'px Microsoft Yahei';
		ctx.textAlign = 'center';
		ctx.fillText(msg, r, r + fontSize / 2);

		//requestAnimationFrame(rander);//这个是页面渲染的最佳工具 但是没有时间间隔				
	};

	function timer(optype, callback) {
		currentType = optype;
		setTimeout(function() {
			if(longtime > 0) {
				var minutes = Math.floor((longtime - 1) / 60);
				var seconds = Math.floor((longtime - 1) % 60);
				var msg = ((minutes < 10) ? "0" + minutes : minutes) + ":" + ((seconds < 10) ? "0" + seconds : seconds);
				switch(currentType) {
					case "pause":
						break;
					case "done":
						var keepTime = keepTimes(longTime * 60 - longtime);
						callback(keepTime);
						break;
					default:
						--longtime;
						rander(msg);
						setTimeout(arguments.callee, 1000);
						break;
				}
			} else {
				clearTimeout(timer);
				timer = null;
			}
		}, 10);
	}

	return {
		timer: timer
	}
}

var accumulateCan = function(canvas) { //累计的canvas
	var ctx = canvas.getContext('2d');
	var mW = canvas.width = 300; //画板宽度
	var mH = canvas.height = 300; //画板高度
	var lineWidth = 5; //line宽度
	var r = mW / 2; //中间位置
	var longtime = 360; //换算成秒数 
	var second = 0;
	var cR = 100; //圆半径 
	var startAngle = -(1 / 2 * Math.PI); //开始角度
	var endAngle = startAngle + 2 * Math.PI; //结束角度
	//var xAngle = 1 * (Math.PI /1024); //偏移角度量		
	var xAngle = (endAngle - startAngle) / longtime; //偏移角度量	
	var fontSize = 40; //字号大小 
	var tmpAngle = startAngle; //临时角度变量
	var currentType = "";

	//渲染函数
	var rander = function(msg) {
		if(tmpAngle >= endAngle) {
			tmpAngle = startAngle;
		} else if(tmpAngle + xAngle > endAngle) {
			tmpAngle = endAngle;
		} else {
			tmpAngle += xAngle;
		}
		ctx.clearRect(0, 0, mW, mH);
		//画圈
		ctx.save();
		ctx.beginPath();
		ctx.lineWidth = lineWidth;
		ctx.strokeStyle = '#9ce5ef';
		ctx.translate(r, r); //重定义圆点
		ctx.rotate(-Math.PI); //最上方为起点

		for(var i = 0; i <= tmpAngle - startAngle; i += xAngle) { //绘图
			ctx.moveTo(0, 150);
			ctx.lineTo(0, cR);
			ctx.rotate(xAngle); //通过旋转角度和画点的方式绘制圆
		}
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		//写字
		ctx.fillStyle = '#FFFFFF';
		ctx.font = fontSize + 'px Microsoft Yahei';
		ctx.textAlign = 'center';
		ctx.fillText(msg, r, r + fontSize / 2);

		//requestAnimationFrame(rander);//这个是页面渲染的最佳工具 但是没有时间间隔				
	};

	function timers(optype) {
		currentType = optype;

		setTimeout(function() {
			var msg = changeNumToTime(second);
			//			second++;
			//			rander(msg); 

			switch(currentType) {
				case "pause":
					return;
					break;
				case "done":
					clearTimeout(timers);
					timer = null;;
					break;
				default:
					second++;
					rander(msg);
					setTimeout(arguments.callee, 1000);
					break;
			}

		}, 0.001)
	};
	return {
		timer: timers
	}
}

function keepTimes(fTime) {
	if(fTime == 0) {
		return "00";
	}
	var result = fTime;
	var m = (result / 60).toFixed(2);

	return m;
}

function changeNumToTime(fTime) {
	if(fTime == 0) {
		return "00:00:00";
	}
	var result = fTime;
	var h = checkTime(Math.floor(result / 3600));
	var m = checkTime(Math.floor((result / 60 % 60)));
	var s = checkTime(Math.floor((result % 60)));
	return result = h + ":" + m + ":" + s;
}

function checkTime(i) {
	if(i < 10) return "0" + i;
	return i;
}

//封装audio属性
var playAu = function() {
	var whichMusic = (typeof localStorage.getItem("bgMusic") !== "string");
	var url = "data/morning.mp3";
	alert(localStorage.getItem("bgMusic"))
	whichMusic == true ? url = "data/morning.mp3" : url = localStorage.getItem("bgMusic");

	var p = plus.audio.createPlayer(url);

	function play() {
		p.play(function() {
			replay();
		}, function(e) {
			mui.toast("Audio play failed: " + e.message);
		})
	};

	function replay() {
		var audioUrl = url; //url
		var ps = plus.audio.createPlayer(audioUrl);
		ps.play(function() {
			replay();
		}, function(e) {
			mui.toast("Audio play failed: " + e.message);
		})
	}

	function pause() {
		p.pause();
	}
	return {
		play: play,
		pause: pause
	}
};

function initLoginMode(callback) { //登陆模块
	var auths = [];
	plus.oauth.getServices(function(services) { //获取登陆的列表
		for(var i = 0, len = services.length; i < len; i++) {
			if(services[i].id === "weixin") { //目前只判断微信
				auths = services[i];
				callback(true);
			}
		}
	}, function(e) {
		callback("获取登陆模块失败!");
	});

	function login(callback) { //微信登陆
		var s = auths;
		var isInstall = isInstalled(s.id);
		if(!isInstall) {
			mui.toast("您尚未安装微信客户端！");
			callback(false);
			return;
		}
		if(!s.authResult) {
			s.login(function(e) {
				s.getUserInfo(function(e) {
					var result = e.target.authResult;
					localStorage.setItem("login", JSON.stringify(result));//授权成功
					localStorage.setItem("wxUser", JSON.stringify(s.userInfo)); //保存微信用户的数据
					callback(true);
				}, function(e) {
					mui.toast("获取用户信息失败：" + e.message + " - " + e.code)
					//					callback("获取用户信息失败：" + e.message + " - " + e.code);
				})
			})
		} else {
			callback(false);
		}
	};

	function loginouts(callback) { //注销退出登陆	
		var s = auths;
		if(s.authResult) {
			s.logout(function(e) {
				localStorage.removeItem("wxUser");
				callback(true);
			}, function(e) {
				callback(false);
			});
		} else {
			mui.toast("当前账号已退出!");
		}
	};

	function loginout(callback) { //注销退出登陆	
		var s = auths;
		if(localStorage.getItem("login") != {}) { //授权和注销不在一个页内调用；			
			s.logout(function(e) {	
				localStorage.removeItem("login");
				localStorage.removeItem("wxUser");
				callback(true);
			}, function(e) {
				callback(false);
			});
		} else {
			mui.toast("当前账号已退出!");
		}
	};

	function isInstalled(id) {
		if(id === 'qihoo' && mui.os.plus) {
			return true;
		}
		if(mui.os.android) {
			var main = plus.android.runtimeMainActivity();
			var packageManager = main.getPackageManager();
			var PackageManager = plus.android.importClass(packageManager)
			var packageName = {
				"qq": "com.tencent.mobileqq",
				"weixin": "com.tencent.mm",
				"sinaweibo": "com.sina.weibo"
			}
			try {
				return packageManager.getPackageInfo(packageName[id], PackageManager.GET_ACTIVITIES);
			} catch(e) {}
		} else {
			switch(id) {
				case "qq":
					var TencentOAuth = plus.ios.import("TencentOAuth");
					return TencentOAuth.iphoneQQInstalled();
				case "weixin":
					var WXApi = plus.ios.import("WXApi");
					return WXApi.isWXAppInstalled();
				case "sinaweibo":
					var SinaAPI = plus.ios.import("WeiboSDK");
					return SinaAPI.isWeiboAppInstalled();
				default:
					break;
			}
		}
	}

	return {
		login: login,
		loginout: loginout,
		isInstalled: isInstalled
	}
}