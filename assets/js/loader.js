(function () {
  "use strict";

  var loader = document.getElementById("page-loader");
  if (!loader) return;

  var minimumDisplayTime = 350;
  var startedAt = window.performance && performance.now ? performance.now() : Date.now();

  function dismissLoader() {
    var now = window.performance && performance.now ? performance.now() : Date.now();
    var remaining = Math.max(0, minimumDisplayTime - (now - startedAt));

    window.setTimeout(function () {
      window.requestAnimationFrame(function () {
        loader.classList.add("hidden");
        window.setTimeout(function () {
          if (loader.parentNode) loader.parentNode.removeChild(loader);
        }, 450);
      });
    }, remaining);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", dismissLoader, { once: true });
  } else {
    dismissLoader();
  }
})();
