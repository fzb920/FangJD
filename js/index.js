window.onload = function(){
    /*搜索*/
    search();
    /*轮播图*/
    banner();
    /*倒计时*/
    downTime();
}
/*搜索*/
function search(){
    /*
    * 1.顶部固定浮动   css
    * 2.顶部颜色完全透明  css rgba
    * 3.当滚动的时候  透明度逐渐的加深  onscroll 透明度和滚动的距离成正比
    * 4.当滚动到一定的高度的时候  透明度是不变的  轮播图的高度
    * */

    /*获取dom元素*/
    /*搜索盒子*/
    var searchBox = document.querySelector('.jd_header_box');
    /*轮播图*/
    var bannerBox = document.querySelector('.jd_banner');
    /*一定的高度*/
    var height = bannerBox.offsetHeight;

    /*监听页面滚动*/
    window.onscroll = function(){
        /*?怎么获取到当前页面滚动的距离*/
        //console.log(document.body.scrollTop);
        //console.log(document.documentElement.scrollTop); IE
        var top = document.body.scrollTop;
        /*计算当前的搜索盒子的透明度*/
        /*最大的透明度 0.85*/

        var opacity = 0;

        if(top < height){
            opacity = top/height*0.85;
        }else{
            opacity = 0.85;
        }

        /*把透明度设置到搜索盒子*/
        searchBox.style.background = 'rgba(201,21,35,'+opacity+')';
    }
}
/*轮播图*/
function banner(){
    /*
    * 1.自动轮播   定时器  过渡  过渡结束的时候（动画执行完的回调函数）  需要做无缝衔接
    * 2.点会随着图片的轮播 而改变当前样式对应这当前图片   监听当前是第几章图片
    * 3.让图片滑动起来    touch事件  监听起始触摸点和结束触摸点的改变  translateX
    * 4.当滑动的时候不超过一定的距离需要吸附回去  回到言来的位置    过渡
    * 5.当滑动的时候超过的一定的距离  上一张  下一张   ？怎么判断上一张还是下一张  （定下一定的距离到底是多少三分之）
    *
    * http://www.swiper.com.cn/  swiper
    * */

    /*轮播图*/
    var banner = document.querySelector('.jd_banner');
    /*当前轮播图宽度*/
    var width = banner.offsetWidth;
    /*图片盒子*/
    var imageBox = banner.querySelector('ul:first-child');
    /*点盒子*/
    var pointBox = banner.querySelector('ul:last-child');
    /*所有的点*/
    var points = pointBox.querySelectorAll('li');

    /*公用的方法*/
    /*加过渡*/
    var addTransition = function(){
        /*加上过渡属性*/
        imageBox.style.transition = 'all 0.2s';/*注意：过渡的时间一定不要大于或定于定时器的时间*/
        imageBox.style.webkitTransition = 'all 0.2s';/*做兼容*/
    };

    /*清过渡*/
    var clearTransition = function(){
        /*清除过渡*/
        imageBox.style.transition = 'none';
        imageBox.style.webkitTransition = 'none';
    };

    /*定位*/
    var setTranslateX = function(translateX){
        imageBox.style.transform = 'translateX('+translateX+'px)';
        imageBox.style.webkitTransform = 'translateX('+translateX+'px)';
    };

    /*1.自动轮播 */
    /*当前轮播图的索引  重要*/
    var index = 1;
    /*定时器*/
    var timer = setInterval(function(){
        /*下一张*/
        index ++;
        /*动画的移动下一张*/
        /*加上过渡属性*/
        addTransition();
        /*改变当前的定位*/
        setTranslateX(-index*width);
    },4000);

    itcast.transitionEnd(imageBox,function(){
        //console.log('自己封装的transitionEnd');
        //TODO 处理无缝衔接的逻辑
        if(index >= 9){
            /*自动轮播时候的无缝衔接*/
            index = 1;
            /*还能以过渡的形式定位过去吗  动画*/
            /*清除过渡*/
            clearTransition();
            /*在定位 瞬间*/
            setTranslateX(-index*width);
        }else if(index <= 0){
            /*滑动时候的无缝衔接*/
            index = 8;
            /*还能以过渡的形式定位过去吗  动画*/
            /*清除过渡*/
            clearTransition();
            /*在定位 瞬间*/
            setTranslateX(-index*width);
        }
        /*其他情况不需要操作*/
        /*到这一步 index 值的范围  1-8  永远保证*/
        /*设置对应的点*/
        setPoint();
    });


    /*2.点会随着图片的轮播*/
    /*知道当期图片的序号*/
    var setPoint = function(){
        /*清除上一次的当前样式*/
        for(var i = 0 ; i < points.length; i++){
            points[i].className = " ";
        }
        /*给当前对应的点加上当前样式*/
        points[index-1].className = "current";
    }

    /*3.让图片滑动起来 */

    /*记录起始滑动的时候的x坐标*/
    var startX = 0;
    /*记录滑动的时候的X坐标*/
    var moveX =0;
    /*计算两个点的位子的改变*/
    var distanceX = 0;
    /*是否滑动过*/
    var isMove = false;


    /*只有执行了三个事件才算是滑动过了*/
    imageBox.addEventListener('touchstart',function(e){
        startX = e.touches[0].clientX;
        /*清除定时器*/
        clearInterval(timer);
    });
    imageBox.addEventListener('touchmove',function(e){
        moveX = e.touches[0].clientX;
        distanceX = moveX - startX;
        console.log(distanceX);
        /*滑动起来  原理不停的定位*/
        clearTransition();
        /*随着手指做定位*/
        /*计算当前图片的定位*/
        var translateX = -index*width + distanceX;
        setTranslateX(translateX);
        isMove = true;
    });
    /*在模拟器试用touchend的是可能会丢失*/
    /*始终在window是可以捕捉到*/
    window.addEventListener('touchend',function(e){

        /*5.当滑动的时候超过的一定的距离  上一张  下一张*/
        /*一定滑动过*/
        if(isMove && Math.abs(distanceX) > width/3){
            /*上一张*/
            if(distanceX>0){
                index --;
            }
            /*下一张*/
            else{
                index ++;
            }
            /*加过渡*/
            addTransition();
            /*定位*/
            setTranslateX(-index*width);
        }
        /*4.当滑动的时候不超过一定的距离需要吸附回去*/
        else{
            /*回到原来的位子*/
            /*加过渡*/
            addTransition();
            /*定位*/
            setTranslateX(-index*width);
        }

        /*重置记录的参数*/
        startX = 0;
        moveX = 0;
        distanceX =0;
        isMove = false;

        /*离开时候再加上*/
        /*保证只加一次 严谨考虑*/
        clearInterval(timer);
        timer = setInterval(function(){
            /*下一张*/
            index ++;
            /*动画的移动下一张*/
            /*加上过渡属性*/
            addTransition();
            /*改变当前的定位*/
            setTranslateX(-index*width);
        },4000);
    });

    /*/!*怎么样监听到动画结束  并且索引是9*!/
    imageBox.addEventListener('transitionEnd',function(){
        console.log('transitionEnd');
        //TODO 处理无缝衔接的逻辑
        if(index >= 9){
            /!*自动轮播时候的无缝衔接*!/
            index = 1;
            /!*还能以过渡的形式定位过去吗  动画*!/
            /!*清除过渡*!/
            clearTransition();
            /!*在定位 瞬间*!/
            setTranslateX(-index*width);
        }else if(index <= 0){
            /!*滑动时候的无缝衔接*!/
            index = 8;
            /!*还能以过渡的形式定位过去吗  动画*!/
            /!*清除过渡*!/
            clearTransition();
            /!*在定位 瞬间*!/
            setTranslateX(-index*width);
        }
        /!*其他情况不需要操作*!/
        /!*到这一步 index 值的范围  1-8  永远保证*!/
    });
    imageBox.addEventListener('webkitTransitionEnd',function(){
        console.log('webkitTransitionEnd');
        //TODO 处理无缝衔接的逻辑
        if(index >= 9){
            /!*自动轮播时候的无缝衔接*!/
            index = 1;
            /!*还能以过渡的形式定位过去吗  动画*!/
            /!*清除过渡*!/
            clearTransition();
            /!*在定位 瞬间*!/
            setTranslateX(-index*width);
        }else if(index <= 0){
            /!*滑动时候的无缝衔接*!/
            index = 8;
            /!*还能以过渡的形式定位过去吗  动画*!/
            /!*清除过渡*!/
            clearTransition();
            /!*在定位 瞬间*!/
            setTranslateX(-index*width);
        }
        /!*其他情况不需要操作*!/
        /!*到这一步 index 值的范围  1-8  永远保证*!/
    });
*/





}
/*倒计时*/
function downTime(){
    /*
    * 1.准备 需要到计时的时间   后台给的  假设一个  倒计时3个小时
    * 2.要按照每一秒改变一次盒子的内容
    * 2.1 获取dom元素
    * 2.2 设置一个定时器  操作一次dom
    * */

    var skTime = document.querySelector('.sk_time');
    /*所有的span*/
    var spans = skTime.querySelectorAll('span');

    /*假设了一个时间*/
    var time = 3 * 60 * 60 ;

    /*定时器*/
    var timer = setInterval(function(){
        time --;

        if(time<0){
            clearInterval(timer);
            return false;
        }

        /*转格式*/
        var h = Math.floor(time/3600);/*小时*/
        var m = Math.floor(time%3600/60);/*分钟*/
        var s = time%60;

        spans[0].innerHTML = Math.floor(h/10);
        spans[1].innerHTML = h%10;

        spans[3].innerHTML = Math.floor(m/10);
        spans[4].innerHTML = m%10;

        spans[6].innerHTML = Math.floor(s/10);
        spans[7].innerHTML = s%10;

    },1000);

}

