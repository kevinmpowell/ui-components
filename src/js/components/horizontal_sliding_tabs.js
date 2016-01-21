var namespace = "ui-",
    tab_width_data_attribute = "data-" + namespace + "tabs-horizontal-sliding-single-line-width",
    sliding_tab_active_class = namespace + "tabs__sliding-tab-label--active",
    allow_scrolling_class = namespace + "tabs--allow-scrolling",
    scroll_button_min_width = "40";


function tab_scroll(direction, $tabset) {
    var distance = 30,
        current_scroll_position = $tabset.scrollLeft(),
        max_scroll = $tabset[0].scrollWidth - ($tabset.closest("." + namespace + "tabs").outerWidth()),
        new_scroll_position;

    if (direction == 'left') {
        distance = -(distance);
        new_scroll_position = current_scroll_position + distance;
        if (new_scroll_position <= 0) {
          new_scroll_position = 0;
        }
    }
    else {
        new_scroll_position = current_scroll_position + distance;
        if (new_scroll_position >= max_scroll) {
          new_scroll_position = max_scroll; 
        }
    }

    $tabset.scrollLeft(new_scroll_position);
    set_scroll_button_visibility($tabset);
}

function set_scroll_button_visibility($tabset) {
  var current_scroll_position = $tabset.scrollLeft(),
      max_scroll = $tabset[0].scrollWidth - ($tabset.closest("." + namespace + "tabs").outerWidth()),
      $tabs = $tabset.closest("." + namespace + "tabs");

  $tabs.removeClass(namespace + "tabs__sliding-tabs--show-prev-button " + namespace + "tabs__sliding-tabs--show-next-button");
  if (current_scroll_position > 0) {
    $tabs.addClass(namespace + "tabs__sliding-tabs--show-prev-button");
  }

  if (current_scroll_position < max_scroll) {
    $tabs.addClass(namespace + "tabs__sliding-tabs--show-next-button");
  }
}

function scroll_active_tab_into_view($tabset, animate) {
  var animate = animate == undefined ? false : animate,
      $active_tab = $tabset.find("." + sliding_tab_active_class),
      active_tab_left = $active_tab.position().left,
      active_tab_width = $active_tab.outerWidth(),
      active_tab_right = active_tab_left + active_tab_width,
      $tabs = $tabset.closest("." + namespace + "tabs"),
      prev_btn_width = $tabs.find("." + namespace + "tabs__sliding-tabs-scroll-button--prev").outerWidth(),
      max_scroll = $tabset[0].scrollWidth - ($tabset.closest("." + namespace + "tabs").outerWidth()) + prev_btn_width,
      prev_btn_width = prev_btn_width < scroll_button_min_width ? scroll_button_min_width : prev_btn_width,
      scroll_position;

  if (active_tab_left < prev_btn_width) {
    // $tabs.removeClass(namespace + "tabs__sliding-tabs--show-prev-button");
    scroll_position = 0;
  }
  else if ((active_tab_left - prev_btn_width) > max_scroll) {
    // Scroll the whole way and hide the next btn
    // $tabs.removeClass(namespace + "tabs__sliding-tabs--show-next-button");
    scroll_position = max_scroll;
  }
  else {
    scroll_position = active_tab_left - prev_btn_width;
  }

  if (animate) {
    $tabset.animate({scrollLeft:scroll_position}, 1000, function(){
      set_scroll_button_visibility($tabset);
    });
  }
  else {
    $tabset.scrollLeft(scroll_position);
  }
}

function get_aggregate_width($objects) {
  var width = 0;
  $objects.each(function(){
    width += $(this).outerWidth() + parseInt($(this).css("margin-left")) + parseInt($(this).css("margin-right"));
  });
  return width;
}

function set_horizontal_tab_state($tabset, animate) {
  var animate = animate == undefined ? false : animate,
      single_line_tab_width = $tabset.attr(tab_width_data_attribute),
      tabset_width = $tabset.outerWidth(),
      margin_of_error = 5;

  if (single_line_tab_width > (tabset_width - margin_of_error)) {
    // Yes horizontal scrolling
    $tabset.addClass(namespace + "tabs--horizontal-sliding-active");
    $tabset.find("." + sliding_tab_active_class).removeClass(sliding_tab_active_class);

    var $sliding_tabset_inner = $tabset.find("." + namespace + "tabs__sliding-tabs-inner"),
        active_tab_id = $tabset.find("input[type='radio']:checked").attr("id");

    $sliding_tabset_inner.find("label[for='" + active_tab_id + "']").addClass(sliding_tab_active_class);
    set_scroll_button_visibility($sliding_tabset_inner);
    scroll_active_tab_into_view($sliding_tabset_inner, animate);
  }
  else {
    // No horizontal scrolling
    $tabset.removeClass(namespace + "tabs--horizontal-sliding-active");
  }
}

$(document).ready(function(){
  $("." + namespace + "tabs--horizontal-sliding").each(function(){
    var single_line_tab_width = get_aggregate_width($(this).find("." + namespace + "tabs__label"));
    $(this).attr(tab_width_data_attribute, single_line_tab_width);

    set_horizontal_tab_state($(this), true);
    set_scroll_button_visibility($(this).find("." + namespace + "tabs__sliding-tabs-inner"));

    if (Modernizr.touchevents) {
      $(this).addClass(allow_scrolling_class);
    }
  });

  $(window).resize(function(){
    console.log("CHECKING");
    $("." + namespace + "tabs--horizontal-sliding").each(function(){
      set_horizontal_tab_state($(this));
    });
  });

  $("." + namespace + "tabs__sliding-tab-label").on("click", function(){
    $(this).siblings("." + sliding_tab_active_class).removeClass(sliding_tab_active_class).end().addClass(sliding_tab_active_class);
  });

  var mouseDownInterval;
  $("." + namespace + "tabs__sliding-tabs-scroll-button--prev").on('mousedown', function(e){
    e.preventDefault();
    var $tabset = $(this).siblings("." + namespace + "tabs__sliding-tabs-inner");
    mouseDownInterval = setInterval(function() {
        tab_scroll("left", $tabset);
    },100); 
  });

  $("." + namespace + "tabs__sliding-tabs-scroll-button--prev").on('touchstart', function(e){
    e.preventDefault();
    var $tabset = $(this).siblings("." + namespace + "tabs__sliding-tabs-inner");
    mouseDownInterval = setInterval(function() {
        tab_scroll("left", $tabset);
    },100); 
  });

  $("." + namespace + "tabs__sliding-tabs-scroll-button--next").on('mousedown', function(e){
    e.preventDefault();
    var $tabset = $(this).siblings("." + namespace + "tabs__sliding-tabs-inner");
    mouseDownInterval = setInterval(function() {
        tab_scroll("right", $tabset);
    },100); 
  });

  $("." + namespace + "tabs__sliding-tabs-scroll-button--next").on('touchstart', function(e){
    e.preventDefault();
    var $tabset = $(this).siblings("." + namespace + "tabs__sliding-tabs-inner");
    mouseDownInterval = setInterval(function() {
        tab_scroll("right", $tabset);
    },100); 
  });

  $("body").on('mouseup', function(){
    clearInterval(mouseDownInterval);
  });

  $("body").on('touchend', function(){
    clearInterval(mouseDownInterval);
  });
});


(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize 
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');

/*! modernizr 3.3.1 (Custom Build) | MIT *
 * http://modernizr.com/download/?-touchevents-setclasses !*/
!function(e,n,t){function o(e,n){return typeof e===n}function s(){var e,n,t,s,a,i,r;for(var l in c)if(c.hasOwnProperty(l)){if(e=[],n=c[l],n.name&&(e.push(n.name.toLowerCase()),n.options&&n.options.aliases&&n.options.aliases.length))for(t=0;t<n.options.aliases.length;t++)e.push(n.options.aliases[t].toLowerCase());for(s=o(n.fn,"function")?n.fn():n.fn,a=0;a<e.length;a++)i=e[a],r=i.split("."),1===r.length?Modernizr[r[0]]=s:(!Modernizr[r[0]]||Modernizr[r[0]]instanceof Boolean||(Modernizr[r[0]]=new Boolean(Modernizr[r[0]])),Modernizr[r[0]][r[1]]=s),f.push((s?"":"no-")+r.join("-"))}}function a(e){var n=u.className,t=Modernizr._config.classPrefix||"";if(p&&(n=n.baseVal),Modernizr._config.enableJSClass){var o=new RegExp("(^|\\s)"+t+"no-js(\\s|$)");n=n.replace(o,"$1"+t+"js$2")}Modernizr._config.enableClasses&&(n+=" "+t+e.join(" "+t),p?u.className.baseVal=n:u.className=n)}function i(){return"function"!=typeof n.createElement?n.createElement(arguments[0]):p?n.createElementNS.call(n,"http://www.w3.org/2000/svg",arguments[0]):n.createElement.apply(n,arguments)}function r(){var e=n.body;return e||(e=i(p?"svg":"body"),e.fake=!0),e}function l(e,t,o,s){var a,l,f,c,d="modernizr",p=i("div"),h=r();if(parseInt(o,10))for(;o--;)f=i("div"),f.id=s?s[o]:d+(o+1),p.appendChild(f);return a=i("style"),a.type="text/css",a.id="s"+d,(h.fake?h:p).appendChild(a),h.appendChild(p),a.styleSheet?a.styleSheet.cssText=e:a.appendChild(n.createTextNode(e)),p.id=d,h.fake&&(h.style.background="",h.style.overflow="hidden",c=u.style.overflow,u.style.overflow="hidden",u.appendChild(h)),l=t(p,e),h.fake?(h.parentNode.removeChild(h),u.style.overflow=c,u.offsetHeight):p.parentNode.removeChild(p),!!l}var f=[],c=[],d={_version:"3.3.1",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,n){var t=this;setTimeout(function(){n(t[e])},0)},addTest:function(e,n,t){c.push({name:e,fn:n,options:t})},addAsyncTest:function(e){c.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=d,Modernizr=new Modernizr;var u=n.documentElement,p="svg"===u.nodeName.toLowerCase(),h=d._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):[];d._prefixes=h;var m=d.testStyles=l;Modernizr.addTest("touchevents",function(){var t;if("ontouchstart"in e||e.DocumentTouch&&n instanceof DocumentTouch)t=!0;else{var o=["@media (",h.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");m(o,function(e){t=9===e.offsetTop})}return t}),s(),a(f),delete d.addTest,delete d.addAsyncTest;for(var v=0;v<Modernizr._q.length;v++)Modernizr._q[v]();e.Modernizr=Modernizr}(window,document);
