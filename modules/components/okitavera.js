window.lazyLoadOptions = {
  threshold: 0
};
new LazyLoad({elements_selector: ".---ll"});

var overlayButton = document.querySelector("#ovm--btn");
var overlayMenu = document.querySelector(".overlay-menu");
overlayMenu.style.display = "none";
overlayButton.onclick = function(){
  if (overlayMenu.style.display === "none") {
    overlayMenu.style.display = "block";
    overlayButton.classList.add("opened");
  } else {
    overlayMenu.style.display = "none";
    overlayButton.classList.remove("opened");
  }
};

var navs = document.querySelector(".nav");
var alternav = document.querySelector('#alternavTrigger');
window.onscroll = function() {
  "use strict";
  var point = alternav.offsetTop;
  if (document.body.scrollTop > point || document.documentElement.scrollTop > point) {
    navs.classList.remove("clears");
    navs.classList.remove("big");
    navs.classList.add("alter");
  } else {
    navs.classList.add("clears");
    navs.classList.add("big");
    navs.classList.remove("alter");
  }
};

disqusLoader('.disqus',{ scriptUrl: '//'+DISQUSNAME+'.disqus.com/embed.js' });
