//使用单列模式开发
let loadingModel = (function(){
	let $loadingBox = $(".loading"),
		$run = $loadingBox.find(".run");
		//获取图片的数组
		let imgList = ["imges/zf_course.png","imges/zf_course1.png","imges/zf_course2.png",
        "imges/zf_course3.png","imges/zf_course4.png","imges/zf_course5.png",
        "imges/zf_course6.png","imges/zf_messageLogo.png","imges/zf_messageStudent.png","imges/zf_phoneLogo.png"];
        //获取图片的长度
        let total = imgList.length;
        //定义初始值
        let cur = 0;
        //计算加载图片长度
        let commep = function(){
        	
        	//遍历每个图片
        	imgList.forEach(function(item){
        		
        		let tmpImage = new Image;
        		tmpImage.src = item;
        		//每次图片加载的时候cur ++
        		tmpImage.onload = function(){
        			//清空临时图片
        			tmpImage = null;
        			cur++;
        			runFn();
        			//加载完成 延迟一点五秒 使用户看见加载条
        			if(cur>=total){
        				let setTimers = setTimeout(function(){
        					$loadingBox.remove();
        					phoneModel.init();
        					clearTimeout(setTimers);
        				},1500)
        				
        				
        			}
        		}
        	})
        	
        }
        //计算滚动的长度
        let runFn = function(){
 
        	$run.css("width",cur/total*100+"%");
        }
		
	return {
		init:function(){
			$loadingBox.css("display","block");
			commep();
		}
	}
	
})();



//phone区域
let phoneModel = (function(){
	let $phone = $(".phone");
	let $time = $phone.find(".time");
	let $phoneItem = $phone.find(".phoneItem");
	let $phoneTouch = $phoneItem.find(".touch");
	let $details = $phone.find(".details");
	let $detailsTouch = $details.find(".touch");
	let listenMusic = $("#listenMusic")[0];
	let detailMusic = $("#detailMusic")[0];
	//发布订阅模式
	//let $phonePlan = $.Callbacks();
	//$phonePlan.add(function(){
		//console.log(11)
	//})
	//点击跳转到 detail 并播放
	let detailShows = function(){
		
		$phoneTouch.tap(function(){
			//移除上一層的
			$phoneItem.remove();
			//播放音樂 停止音樂
			listenMusic.pause();
			//播放音樂
			detailMusic.play();
			//顯示時間	
			$time.css("display","block");
			$details.css("transform","translateY(0)");
			//時間跟著聲音内容變化
			console.dir(detailMusic)
			let timerPlay = setInterval(()=>{
				//獲取音頻縂時間duration
				let musicDuration = detailMusic.duration;
				//獲取已經播放的時間currentTime
				let musicCurrentTime = detailMusic.currentTime;
				//獲取分鐘
				let minute = Math.floor(musicCurrentTime/60);
				//獲取秒
				let second = Math.floor(musicCurrentTime - minute *60 );
				minute<10?minute = '0'+minute:null;
				second<10?second = '0'+second:null;
				//放上去
				$time.html(`${minute}:${second}`)
				//時間加載完成
				if(musicCurrentTime>=musicDuration){
					clearInterval(timerPlay);
					//進入下一個區域
					detailsNext();
				}
			},1000);
			
		
		})
	}
	let detailsNext = function(){
		detailMusic.pause();
		$phone.remove();
		messageModel.init();
	}
	//detailtouch
    let detailTouch = function(){
        $detailsTouch.tap(function () {
            return detailsNext();
        });
    };
	return {
		init:function(){
			$phone.css("display","block");
			detailTouch();
			//播放音乐
			listenMusic.play();
			//
			//$phoneTouch.tap($phonePlan.fire());
			detailShows();
		}
	}
})();

//message

let messageModel = (function(){
	let $message = $(".message");
	let $talkList = $message.find(".talkList");
	let $talkListLi = $talkList.find("li");
	let $keyBoard = $message.find(".keyBoard");
	let $span = $keyBoard.find("span");
	let $submit = $keyBoard.find(".submit");
	//逐條顯示當前聊天框
	//定義當前索引
		let step = -1;
		let timersn = null;
		let btomTop = 0;
		let total = $talkListLi.length;
	function chaseShow(){
		timersn = setInterval(()=>{
			step++;
			//開始顯示動畫消息
			let $cur = $talkListLi.eq(step);
			$cur.css({
				opacity : 1,
				transform:"translateY(0)"
			})
			//儅到第二條的時候 顯示鍵盤 並停止計時器 並開始文字打印效果
			if(step === 2){
				clearInterval(timersn);
				//儅前動畫結束的時候開始文字打印效果
				$cur.one("transitionend",()=>{
					
					$keyBoard.css("transform","translateY(0)")
					.one("transitionend",textMove);
			
				})
				return;
			}
			//
			
			if(step>=4){
				 btomTop += -$cur[0].offsetHeight;
				 //console.log($cur[0])
				$talkList.css("transform","translateY("+btomTop+"px)");
				
			}
			
			if(step>=total-1){
				clearInterval(timersn);
				let timesd = setTimeout(()=>{
					clearInterval(timersn);
					$message.remove();
					cubeModel.init()
				},1000)
				
				
			}
			
			
		},1000)
	
	}
	//文字打印效果
	let textMove = function(){
		//獲取當前文本信息
		let text = $span.html();
		//先清空在加載
		$span.css("display","block").html('');
		//設置當前索引值
		let n = -1;
		let timer = null;
		timer = setInterval(()=>{
			n++;
			//把内容放入 charAt 如果最後一位出現undeind 用這個
		$span[0].innerHTML +=text.charAt(n);
		if(n>=text.length){
			clearInterval(timer);
			//顯示發送按鈕
			$submit.css("display","block").tap(talkListMove);
		}
		},200);
	}
	//使整個ul往上移動 并且隱藏鍵盤和文字
	let talkListMove = function(){
		$keyBoard.css("transform","translateY(3.7rem)");
		$span.css("display","none");
		//再次执行li动画
		chaseShow();	
	}
	return {
		init:function(){
			$message.css("display","block");
			chaseShow();
		}
	}
})();
//阻止默认行为
$(document).on('touchstart touchmove touchend',function(e){
	e.preventDefault();
})

let cubeModel = (function(){
	let $cude = $(".cube");
	let $box = $cude.find(".box");
	//触摸开始，多点触控，
	let touchstartFn = function(e){
		//储存当前的触摸坐标
		//console.log(e.changedTouches[0])
		//获取当前坐标值
		let point = e.changedTouches[0];
		//储存当前的触摸坐标
		console.log(point)
		let $this = $(this);
		$this.attr({
			atrX:point.clientX,
			atrY:point.clientY,
			isMove:false,
			changeX:0,
			changeY:0
		})
		
	}
	//接触点改变，滑动时
	let touchmoveFn = function(e){
		//获取当前坐标值
		let point = e.changedTouches[0];
		let $this = $(this);
		//获取移动的值
		let changeX = point.clientX - $this.attr("atrX");
		let changeY = point.clientY - $this.attr("atrY");
		if(Math.abs(changeX)>10 || Math.abs(changeY)>10){
			$this.attr({
				isMove:true,
				changeX:changeX,
				changeY:changeY
			})
		}
	}
	//触摸结束，手指离开屏幕时
	let touchendFn = function(e){
		//获取当前坐标值
		let point = e.changedTouches[0];
		let $this = $(this);
		//获取上移动过程的值
		let isMove = $this.attr('isMove'),
            changeX = parseFloat($this.attr('changeX')),
            changeY = parseFloat($this.attr('changeY')),
            rotateX = parseFloat($this.attr('rotateX')),
            rotateY = parseFloat($this.attr('rotateY'));
            //如果不移动
            if(isMove === 'false') return;
            //开始移动 然后在储存
            rotateX = rotateX - changeX / 3;
        	rotateY = rotateY - changeY / 3;
            $this.css(`transform`,`scale(.6) rotateX(${rotateY}deg) rotateY(${rotateX}deg)`).attr({
            rotateX:rotateX,
            rotateY: rotateY
        });
	}
	return {
		init:function(){
			$cude.css("display","block");
			//绑定事件使他们移动
			$box.attr({
				 rotateX:-30,
             	 rotateY:45
			}).on({
				touchstart:touchstartFn,
				touchmove:touchmoveFn,
				touchend:touchendFn
			})
			//点击每一个li
			$box.find('li').tap(function () {
            let index = $(this).index();//获取索引
            $cude.css('display','none');
            detailRender.init(index);
         });
		}
	}
})();

/*DETAIL*/
let detailRender = (function ($) {
    let $detailBox = $('.swiper');
    let swiperExample = null;
    let $returndatail = $('.returndatail');
    let $cude = $(".cube");
    return {
        init:function (index) {
           $detailBox.css('display','block');
            //returndatail点击返回
           if (!swiperExample){
               $returndatail.tap(function () {
                       $detailBox.css('display','none');
                       $cude.css('display','block');
               });
               //初始化swiper
               swiperExample = new Swiper('.swiper-container',{
                   //loop:true 如果我们采用的切换效果是3D 最好不设置loop true 在部分安卓级下 会出现BUG
                   effect:'coverflow'
               });
           }
            index = index > 5 ? 5 : index;
            //指定到那个silde
            swiperExample.slideTo(index,0);
        }
    }
})(Zepto);

loadingModel.init();