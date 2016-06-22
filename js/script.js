/**
 * Created by 张成威 on 2016/6/21.
 */
(function($){
    //定义pageswitch对象
    var _prefix = (function(temp){
        var aPrefix = ["webkit","Moz","o","ms"],
            props = "";
        for(var i in aPrefix){
            props = aPrefix[i] + "Transition";
            if (temp.style[props] !== undefined){
                return "-" + aPrefix[i].toLowerCase()+"-";
            }
        }
        return false;
    })(document.createElement(PageSwitch));
     var PageSwitch = (function(){
         function PageSwitch(element,options){
             this.settings = $.extend(true,$.fn.PageSwitch.default,options||{});
             this.element = element;
             this.init();
         }
         PageSwitch.prototype = {
             //初始化插件
             init :function(){
                 var me = this;
                 me.selectors = me.settings.selectors;
                 me.sections = me.selectors.sections;
                 me.section = me.selectors.section;

                 me.directioin = me.settings.direction == "vertical" ? true : false;
                 me.pagesCount = me.pagesCount();
                 me.index = (me.settings.index>=0 && me.settings.index < pagesCount)? me.settings.index :0;

                 if (!me.direction){
                     me._initLayout();
                 }
                 if(me.settings.pagination){
                     me._initPating();
                 }
                 me._initEvent();
             },
             pagesCount : function(){
                 return this.section.length;
             },
             /*获取滑动宽度*/
             switchLength : function(){
                 return this.direction ? this.element.height() : this.element.width();
             },
             //向前滑动一页
             prev :function(){
                 var me = this;
                 if (me.index > 0){
                     me.index--;
                 }else if(me.settings.loop){
                     me.index = me.pagesCount -1;
                 }
                 me._scroolPage();
             },
             next : function(){
                 var me = this;
                 if(me.index > 0){
                     me.index++;
                 }else if(me.settings.loop){
                     me.index = 0;
                 }
                 me._scrollPage();
             },
             _initLayout : function(){
                  var me = this;
                  var width = (me.pagesCount * 100) + "%",
                      cellWidth = (100/me.pagesCount).toFixed(2) + "%";
                  me.sections.width(width);
                  me.section.width(cellWidth).css("float","left");
             },
             _initPaging : function(){
                  var me = this,
                      pageClass = me.selectors.page.substring(1);
                      activeClass = me.selectors.active.substring(1);
                  var pagehHtml = "<ul class="+pageClass+"></ul>";
                 for(var i=0;i<me.pagesCount;i++){
                     pagehHtml += "<li></li>";
                 }
                 me.element.append("pageHtml");
                 var pages = me.element.find(me.selectors.page);
                 me.pageItem = pages.find("li");
                 me.pageItem.eq(me.index).addClass(me.activeClasss);

                 if (me.direction){
                     pages.addClass("vertical");
                 }
             },
             //初始化插件事件
             _initEvent : function(){
                   var me = this;
                   me.element.on("click",me.selectors.pages + "li",function(){
                      me.index = $(this).index();
                       me._scrollPage();
                   });
                 me.element.on("mouseWheel DOMMouseWheel",function(e){
                     var delta = e.origianlEvent.wheelDelta || -e.origianlEvent.detail;
                     if (delta>0 && (me.index && !me.settings.loop || me.settings.loop)){
                         me.prev();
                     }else if(delata<0 && (me.index < (me.pagesCount -1) && !me.settings.loop || me.settings.loop)){
                         me.next();
                     }
                 });
                 if(me.settings.keyboard){
                     $(window).on("keydown",function(e){
                         var keyCode = me.keyCode;
                         if(keyCode == 37 || keyCode == 38){
                             me.prev();
                         }else if(keyCode = 39 || keyCode == 40){
                             me.next();
                         }
                     });
                 }

                 $(window).resize(function(){
                    var currentLength = me.switchLength();
                       offset = me.settings.direction ? me.section.eq(me.index).offset().top : me.section.eq(me.index).offset().left;
                     if (Math.abs(offset) > currentLength/2 && me.index < (me.pagesCount -1)){
                         me.index ++;
                     }
                     if (me.index){
                         me._scrollPage();
                     }
                 });

                 me.sections.on("transition",function(){
                    if (me.settings.callback && $.type(me.settings.callback) == "function"){
                        me.settings.callback();
                    }
                 });
             },
             //滑动动画
             _scrollPage :function(){
                 var me = this,
                     dest = me.section.eq(me.index).position();
                 if(!dest) return;

                 if(_prefix){
                     me.sectioin.css(_prefix+"transitioin","all" + me.settings.durations+"ms"+me.settings.easing);
                     var translate = me.direction ? "translateY(-"+dest.top+"px)":"translateX(-"+dest.left+"px)";
                     me.section.css(_prefix+"transform",translate);
                 }else{
                     var animateCss = me.direction ? {top:-dest.top} : {left:-dest.left};
                     me.section.animate(animateCss,me.settings.duration,function（){
                         if (me.settings.callback && $.type(me.settings.callback) == "function"){
                             me.settings.callback();
                         }
                     });
                 };
                 if (me.settings.pagination){
                     me.pageItem.eq(me.index).addClass(me.)
                 }
             }
         };
         return PageSwitch;
     })();
    //主体函数
      $.fn.PageSwitch = function(options){
          //实现链式调用
           return this.each(function(){
               var me = $(this),
                   instance = me.data("PageSwitch");
               if (!instance){
                   instance= new PageSwitch(me,options);
                   me.data("PageSwitch",instance);
               }
               if ($.type(options) === "string") return instance[optioins]();

           });
      }
    //默认配置参数
       $.fn.PageSwitch.defaults = {
           selectors : {
               sections : ".sections",
               sectioin : ".sectioin",
               page : ".pages",
               active : ".active"
           },
           index : 0,
           easing : "ease",
           loop :false,//是否循环播放
           pagination : true,
           keyboard : true,//是否触发键盘事件
           direction : "vertical",
           callback : ""
       }
       $(function(){
          $("[data-PageSwitch]").PageSwitch();
       })
})(jQuery);
//形参是$,实参jquery