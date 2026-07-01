
  window.addEventListener("load", () => {
    const loader = document.getElementById("page-loader");
    if (!loader) return;

    setTimeout(() => {
      loader.classList.add("hidden");

      loader.addEventListener(
        "transitionend",
        () => loader.remove(),
        { once: true }
      );
    }, 1000);
  });