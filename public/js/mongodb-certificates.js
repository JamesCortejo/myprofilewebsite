document.querySelectorAll("[data-mongodb-carousel]").forEach((carousel) => {
  const slides = Array.from(carousel.querySelectorAll("[data-carousel-slide]"));
  const previousButton = carousel.querySelector("[data-carousel-previous]");
  const nextButton = carousel.querySelector("[data-carousel-next]");
  const count = carousel.querySelector("[data-carousel-count]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let activeIndex = 0;
  let isAnimating = false;

  const updateCount = () => {
    count.textContent = `${activeIndex + 1} / ${slides.length}`;
  };

  const showImmediately = (nextIndex) => {
    activeIndex = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const isActive = index === activeIndex;
      slide.hidden = !isActive;
      slide.classList.toggle("is-active", isActive);
      slide.classList.remove(
        "is-entering-from-left",
        "is-entering-from-right",
        "is-leaving-to-left",
        "is-leaving-to-right"
      );
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    updateCount();
  };

  const showSlide = (nextIndex, direction) => {
    if (isAnimating) return;

    const normalizedIndex = (nextIndex + slides.length) % slides.length;
    if (normalizedIndex === activeIndex || reducedMotion.matches) {
      showImmediately(normalizedIndex);
      return;
    }

    isAnimating = true;
    const outgoingSlide = slides[activeIndex];
    const incomingSlide = slides[normalizedIndex];
    const enteringClass =
      direction > 0 ? "is-entering-from-right" : "is-entering-from-left";
    const leavingClass =
      direction > 0 ? "is-leaving-to-left" : "is-leaving-to-right";

    incomingSlide.hidden = false;
    incomingSlide.setAttribute("aria-hidden", "false");
    incomingSlide.classList.add(enteringClass);
    outgoingSlide.setAttribute("aria-hidden", "true");

    // Commit the starting position before transitioning both slides.
    incomingSlide.getBoundingClientRect();
    requestAnimationFrame(() => {
      outgoingSlide.classList.remove("is-active");
      outgoingSlide.classList.add(leavingClass);
      incomingSlide.classList.add("is-active");
      incomingSlide.classList.remove(enteringClass);
    });

    activeIndex = normalizedIndex;
    updateCount();

    window.setTimeout(() => {
      outgoingSlide.hidden = true;
      outgoingSlide.classList.remove(leavingClass);
      isAnimating = false;
    }, 460);
  };

  previousButton.addEventListener("click", () =>
    showSlide(activeIndex - 1, -1)
  );
  nextButton.addEventListener("click", () => showSlide(activeIndex + 1, 1));

  showImmediately(0);
});