document.querySelectorAll("[data-image-switcher]").forEach((switcher) => {
  const track = switcher.querySelector("[data-switcher-track]");
  const caption = switcher.querySelector("[data-switcher-caption]");
  const previousButton = switcher.querySelector("[data-switcher-prev]");
  const nextButton = switcher.querySelector("[data-switcher-next]");
  const fullscreenButton = switcher.querySelector("[data-fullscreen-button]");
  const slides = track ? Array.from(track.querySelectorAll("img")) : [];
  const captions = slides.map((slide) => slide.dataset.caption || slide.alt);
  let activeIndex = 0;

  if (!track || slides.length === 0) return;

  const updateSlide = () => {
    track.style.transform = `translateX(-${activeIndex * 100}%)`;
    if (caption) caption.textContent = captions[activeIndex];
  };

  previousButton?.addEventListener("click", () => {
    activeIndex = activeIndex === 0 ? captions.length - 1 : activeIndex - 1;
    updateSlide();
  });

  nextButton?.addEventListener("click", () => {
    activeIndex = activeIndex === captions.length - 1 ? 0 : activeIndex + 1;
    updateSlide();
  });

  fullscreenButton?.addEventListener("click", () => {
    const images = slides.map((slide) => ({
      src: slide.currentSrc || slide.src,
      alt: slide.alt,
      caption: slide.dataset.caption || slide.alt,
    }));

    window.openImageModal({
      images,
      activeIndex,
      label: "Project Preview",
      title: fullscreenButton.closest("article")?.querySelector("h3")?.textContent || "Project image",
      onChange: (nextIndex) => {
        activeIndex = nextIndex;
        updateSlide();
      },
    });
  });
});
