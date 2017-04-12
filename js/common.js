/*定义一个空间 专门来定义公用的方法*/

/*挂一个全局变量在window下面*/
window.itcast = {}; /*var itcast = {}*/

/*命名空间  防止变量污染*/

/*封装一个兼容的transitionEnd事件的方法*/
itcast.transitionEnd = function(dom,callback){
    /*
    * 1.给谁绑定   dom
    * 2.处理什么逻辑  callback  方法块（）  调用
    * */

    if(dom && typeof dom == 'object'){
        dom.addEventListener('webkitTransitionEnd',function(){
            /*同一个逻辑*/
            callback && callback();
        });
        dom.addEventListener('transitionEnd',function(){
            /*同一个逻辑*/
            callback && callback();
        });
    }

}



