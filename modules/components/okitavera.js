
(function(window, document, index) {
  "use strict";

var overlayButton = document.querySelector("#ovm--btn");
var overlayMenu = document.querySelector(".overlay-menu");
overlayMenu.style.visibility = "hidden";
overlayMenu.style.opacity = "0";
overlayButton.onclick = function(){
  if (overlayMenu.style.visibility === "hidden") {
    overlayMenu.style.visibility = "visible";
    overlayMenu.style.opacity = "1";
    overlayButton.classList.add("opened");
  } else {
    overlayMenu.style.opacity = "0";
    overlayMenu.style.visibility = "hidden";
    overlayButton.classList.remove("opened");
  }
};

})(window, document, 0);