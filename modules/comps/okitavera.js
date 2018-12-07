
(function(window, document, index) {
"use strict";

var visible = function(el, state){
  el.style.visibility = (state == 1) && "visible" || "hidden";
  el.style.opacity = state;  
}

var overlaylink = document.querySelectorAll("#ovm--btn,.overlay-menu a");
var overlayMenu = document.querySelector(".overlay-menu");
visible(overlayMenu, 0);
Array.prototype.forEach.call(overlaylink, function(el){
  el.onclick = function(){
    var overlayButton = document.querySelector("#ovm--btn");
    if (overlayMenu.style.visibility === "hidden") {
      visible(overlayMenu, 1);
      overlayButton.classList.add("opened");
    } else {
      visible(overlayMenu, 0);
      overlayButton.classList.remove("opened");
    }
  }  
});

var backtotop = document.querySelector(".backtotop");
window.onscroll = function(){
  var body = document.documentElement || document.body;
  if (body.scrollTop > body.clientHeight) {
    visible(backtotop, 1);
  } else {
    visible(backtotop, 0);
  }
}

})(window, document, 0);