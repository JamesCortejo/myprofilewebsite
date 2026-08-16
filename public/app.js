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

document.querySelectorAll("[data-image-switcher]").forEach((switcher) => {
  const track = switcher.querySelector("[data-switcher-track]");
  const caption = switcher.querySelector("[data-switcher-caption]");
  const previousButton = switcher.querySelector("[data-switcher-prev]");
  const nextButton = switcher.querySelector("[data-switcher-next]");
  const fullscreenButton = switcher.querySelector("[data-fullscreen-button]");
  const slides = track.querySelectorAll("img");
  const captions = Array.from(slides).map((slide) => slide.dataset.caption || slide.alt);
  let activeIndex = 0;

  const updateSlide = () => {
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    caption.textContent = captions[activeIndex];
  };

  previousButton.addEventListener("click", () => {
    activeIndex = activeIndex === 0 ? captions.length - 1 : activeIndex - 1;
    updateSlide();
  });

  nextButton.addEventListener("click", () => {
    activeIndex = activeIndex === captions.length - 1 ? 0 : activeIndex + 1;
    updateSlide();
  });

  if (fullscreenButton) {
    fullscreenButton.addEventListener("click", async () => {
      const activeSlide = slides[activeIndex];

      if (activeSlide.requestFullscreen) {
        try {
          await activeSlide.requestFullscreen();
          return;
        } catch (_error) {
          // Fall back to opening the image if fullscreen is blocked.
        }
      }

      window.open(activeSlide.currentSrc || activeSlide.src, "_blank", "noopener,noreferrer");
    });
  }
});
