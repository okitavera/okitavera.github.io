((win, doc) => {
  const visible = (el, state) => {
    el.style.visibility = state === 1 ? "visible" : "hidden";
    el.style.opacity = state;
  };
  const overlaylink = doc.querySelectorAll("#ovm--btn,.overlay-menu a");
  const overlayMenu = doc.querySelector(".overlay-menu");
  visible(overlayMenu, 0);
  overlaylink.forEach((el) => {
    el.onclick = () => {
      const overlayButton = doc.querySelector("#ovm--btn");
      const state = overlayMenu.style.visibility === "hidden" ? 1 : 0;
      visible(overlayMenu, state);
      state
        ? overlayButton.classList.add("opened")
        : overlayButton.classList.remove("opened");
    };
  });

  const body = doc.documentElement || doc.body;
  win.onscroll = () =>
    visible(
      doc.querySelector(".backtotop"),
      body.scrollTop > body.clientHeight ? 1 : 0
    );
})(window, document);
