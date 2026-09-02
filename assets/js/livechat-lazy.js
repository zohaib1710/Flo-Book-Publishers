(function (window, document) {
  "use strict";

  window.__lc = window.__lc || {};
  window.__lc.license = 19778423;
  window.__lc.integration_name = "manual_onboarding";
  window.__lc.product_name = "livechat";

  var loaded = false;
  var queue = [];
  var widget = window.LiveChatWidget || {
    _q: queue,
    _h: null,
    _v: "2.0",
    on: function () { queue.push(["on", arguments]); },
    once: function () { queue.push(["once", arguments]); },
    off: function () { queue.push(["off", arguments]); },
    get: function () { queue.push(["get", arguments]); },
    call: function () { queue.push(["call", arguments]); }
  };
  window.LiveChatWidget = widget;

  function loadLiveChat() {
    if (loaded) return;
    loaded = true;
    var script = document.createElement("script");
    script.async = true;
    script.src = "https://cdn.livechatinc.com/tracking.js";
    document.head.appendChild(script);
  }

  document.addEventListener("pointerdown", function (event) {
    if (event.target.closest("[onclick*='LiveChatWidget'], [data-livechat-trigger]")) {
      loadLiveChat();
    }
  }, true);

  window.addEventListener("load", function () {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadLiveChat, { timeout: 6000 });
    } else {
      window.setTimeout(loadLiveChat, 6000);
    }
  });
})(window, document);
