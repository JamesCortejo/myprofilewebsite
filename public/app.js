const currentPath = window.location.pathname;

document.querySelectorAll("[data-nav]").forEach((link) => {
  const target = link.getAttribute("href");
  if (target === currentPath || (target === "/" && currentPath === "/index.html")) {
    link.classList.add("active");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  observer.observe(element);
});
