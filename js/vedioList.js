	var jqprocess;
	var audios = $('.audios').eq(0); //当前的audio标签
	var Domaudios = $('.audios')[0];
	var oLiSrc;

	function onLiBox(e, _this) {

		/* 点击购买 */
		if(e.target.className === 'buy') {
			if($(e.target).html() === '已下载') {
				return;
			} else {
				var oli = $(e.target).parent();
				oLiSrc = oli.attr('data-src');
				var proStr = '<p id="progrs" class="mui-progressbar mui-progressbar-royal"><span></span></p>'
				var proLink = $(proStr);
				oli.append(proLink);
				jqprocess = $('#progrs'); // 进度条元素
				mui.plusReady(function() {
					var dtask = plus.downloader.createDownload(oli.attr('data-src'));
					dtask.addEventListener("statechanged", onStateChanged, false);
					dtask.start();
				})
				return;
			}
		}
		/* 如果点击到音乐名 获取他父级下的audio*/
		if(e.target.className === 'aName') {
			var oli = $(e.target).parent();
			oLiSrc = oli.attr('data-src');
		}

		if(e.target.className === 'seting') {
			var oli = $(e.target).parent();
			oLiSrc = oli.attr('data-src');
			localStorage.setItem('bgMusic', oLiSrc);
			$(".seting").html("设为背景乐");
			$(e.target).html("✔");
			return;
		}

		oLiSrc = $(e.target).attr('data-src');
		if(Domaudios.paused) {
			audios.attr('src', oLiSrc)
			Domaudios.play();
		} else {
			if(oLiSrc === audios.attr('src')) {
				Domaudios.pause();
			} else {
				audios.attr('src', oLiSrc)
				Domaudios.play();
			}

		}
		//	audios[0].play(); //播放当前audio标签
	}

	/* 进度条 */
	var process = document.getElementById("process");
	var downArr = [];

	function onStateChanged(download, status) {

		if(downArr.indexOf(download.url) === -1) {
			var proValue = ((download.downloadedSize / download.totalSize) * 100).toFixed(0);
			mui('#progrs').progressbar().setProgress(proValue);
			if(download.state == 4 && status == 200) {
				mui('#progrs').progressbar().setProgress(100);
				var oli = jqprocess.parent().find('span');
				oli.html('已下载');
				jqprocess.remove();
				downArr.push(download.url); //下载的文件名添加到数组；			
				mui.toast("success");
			}
		} else {
			jqprocess.remove();
		}

	}

	/*切换本地与线上事件*/
	$('.local').click(function() {
		$(this).addClass('active');
		$('.onLine').removeClass('active');
		$('.onLinecontentBox').css({
			'display': 'none'
		});
		$('.localcontentBox').css({
			'display': 'block'
		});
		$('.addBox').html('');
		plus.io.requestFileSystem(plus.io.PUBLIC_DOWNLOADS, function(fs) {
			var directoryReader = fs.root.createReader();
			directoryReader.readEntries(function(entries) {
				var i;
				var str = '';
				for(i = 0; i < entries.length; i++) {
					entries[i].remove(function(entry) {
						plus.console.log("Remove succeeded");
					}, function(e) {
						alert(e.message);
					});

					if(entries[i].name.split('.')[1] === 'mp3') {
						str += '<li class="mui-table-view-cell li" data-src="' + entries[i].fullPath + '">' +
							'<div class="aName">' + entries[i].name + '</div>' +
							'<span class="seting" >设为背景乐</span>' +
							'</li>'
					}
				}
				var link = $(str)
				$('.addBox').append(link)
			}, function(e) {
				alert("Read entries failed: " + e.message);
			});
		});

	})
	$('.onLine').click(function() {
		$(this).addClass('active');
		$('.local').removeClass('active');
		$('.onLinecontentBox').css({
			'display': 'block'
		})
		$('.localcontentBox').css({
			'display': 'none'
		})
	})