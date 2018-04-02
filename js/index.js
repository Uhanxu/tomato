//mui初始化
mui.init();
var detailPage = mui.preload({
	id: 'myTomato.html',
	url: 'myTomato.html',
	styles: {
		top: '45px',
		bottom: '51px'
	} //窗口参数
});
var detailPage1 = mui.preload({
	id: 'myData.html',
	url: 'myData.html',
	styles: {
		top: '45px',
		bottom: '51px'
	} //窗口参数
});

var detailPage2 = mui.preload({
	id: 'myCenter.html',
	url: 'myCenter.html',
	styles: {
		top: '45px',
		bottom: '51px'
	} //窗口参数
});

var subpages = ['myTomato.html', 'myData.html', 'myCenter.html'];
var subpage_style = {
	top: '45px',
	bottom: '51px'
};

var aniShow = {};

//创建子页面，首个选项卡页面显示，其它均隐藏；
mui.plusReady(function() {
	var self = plus.webview.currentWebview();
	for(var i = 0; i < 3; i++) {
		var temp = {};
		var sub = plus.webview.create(subpages[i], subpages[i], subpage_style);
		if(i > 0) {
			sub.hide();
		} else {
			temp[subpages[i]] = "true";
			mui.extend(aniShow, temp);
		}
		var flag = localStorage.getItem("lauchFlag");
		self.append(sub);
//				localStorage.clear();
		if(flag !== "true") {
			mui.openWindow({
				id: "guid.html",
				url: "guid.html",
				show: {
					aniShow: 'slide-in-right'
				}
			});
		} else {
			document.getElementById("isShow").style.display = "block";
		}

	}
	mui.back = function() {
		var btnArray = ['是', '否'];
		mui.confirm('是否退出应用', ' ', btnArray, function(e) {
			if(e.index == 0) {
				plus.runtime.quit();
			}
		})
	}

});
//当前激活选项
var activeTab = subpages[0];
var title = document.getElementById("title");
//选项卡点击事件
mui('.mui-bar-tab').on('tap', 'a', function(e) {
	var targetTab = this.getAttribute('href');
	if(targetTab == activeTab) {
		return;
	}
	//更换标题
	title.innerHTML = this.querySelector('.mui-tab-label').innerHTML;
	switch(this.querySelector('.mui-tab-label').innerHTML) {
		case "首页":
			if(!detailPage) {
				detailPage = plus.webview.getWebviewById('myTomato.html');
			}
			mui.fire(detailPage, 'send', {
				temp: true
			});
			break;
		case "数据分析":
			if(!detailPage1) {
				detailPage1 = plus.webview.getWebviewById('myData.html');
			}
			mui.fire(detailPage1, 'send', {
				temp: true
			});
			break;
		case "我的":
			if(!detailPage2) {
				detailPage2 = plus.webview.getWebviewById('myCenter.html');
			}
			mui.fire(detailPage2, 'send', {
				temp: true
			});
			break;
		default:
			if(!detailPage) {
				detailPage = plus.webview.getWebviewById('myTomato.html');
			}
			mui.fire(detailPage, 'send', {
				temp: true
			});
			break;
	}

	//显示目标选项卡
	//若为iOS平台或非首次显示，则直接显示
	if(mui.os.ios || aniShow[targetTab]) {
		plus.webview.show(targetTab);
	} else {
		//否则，使用fade-in动画，且保存变量
		var temp = {};
		temp[targetTab] = "true";
		mui.extend(aniShow, temp);
		plus.webview.show(targetTab, "fade-in", 300);
	}
	//隐藏当前;
	plus.webview.hide(activeTab);
	//更改当前活跃的选项卡
	activeTab = targetTab;
});
//			 //自定义事件，模拟点击“首页选项卡”
//			document.addEventListener('gohome', function() {
//				var defaultTab = document.getElementById("defaultTab");
//				//模拟首页点击 
//				mui.trigger(defaultTab, 'tap');
//				//切换选项卡高亮
//				var current = document.querySelector(".mui-bar-tab>.mui-tab-item.mui-active");
//				if (defaultTab !== current) {
//					current.classList.remove('mui-active');
//					defaultTab.classList.add('mui-active');
//				}
//			});