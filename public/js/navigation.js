const currentPath = window.location.pathname;

document.querySelectorAll("[data-nav]").forEach((link) => {
  const target = link.getAttribute("href");
  const isHome = target === "/" && (currentPath === "/" || currentPath === "/index.html");

  if (target === currentPath || isHome) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});
