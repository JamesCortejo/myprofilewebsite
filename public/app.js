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

const imageModal = document.createElement("div");
imageModal.className = "image-modal";
imageModal.setAttribute("aria-hidden", "true");
imageModal.innerHTML = `
  <div class="image-modal-backdrop" data-modal-close></div>
  <div class="image-modal-panel" role="dialog" aria-modal="true" aria-label="Project image preview">
    <button class="image-modal-close" type="button" data-modal-close aria-label="Close image preview">X</button>
    <div class="image-modal-stage">
      <img class="image-modal-image" alt="" />
      <button class="image-modal-next" type="button" aria-label="Show next project image">
        <span>Next</span>
        <span aria-hidden="true">&#8594;</span>
      </button>
    </div>
    <div class="image-modal-footer">
      <div>
        <span class="image-modal-label">Project Preview</span>
        <p class="image-modal-caption"></p>
      </div>
      <span class="image-modal-count"></span>
    </div>
  </div>
`;
document.body.appendChild(imageModal);

const modalImage = imageModal.querySelector(".image-modal-image");
const modalCaption = imageModal.querySelector(".image-modal-caption");
const modalCount = imageModal.querySelector(".image-modal-count");
const modalNextButton = imageModal.querySelector(".image-modal-next");
const modalCloseButtons = imageModal.querySelectorAll("[data-modal-close]");
let modalState = null;

const renderModalImage = () => {
  if (!modalState) return;

  const activeSlide = modalState.slides[modalState.activeIndex];
  modalImage.src = activeSlide.currentSrc || activeSlide.src;
  modalImage.alt = activeSlide.alt;
  modalCaption.textContent = modalState.captions[modalState.activeIndex];
  modalCount.textContent = `${modalState.activeIndex + 1} / ${modalState.slides.length}`;
};

const closeImageModal = () => {
  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalState = null;
};

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeImageModal);
});

modalNextButton.addEventListener("click", () => {
  if (!modalState) return;

  modalState.activeIndex =
    modalState.activeIndex === modalState.slides.length - 1
      ? 0
      : modalState.activeIndex + 1;
  modalState.onChange(modalState.activeIndex);
  renderModalImage();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modalState) {
    closeImageModal();
  }
});

const openImageModal = (slides, captions, activeIndex, onChange) => {
  modalState = { slides, captions, activeIndex, onChange };
  renderModalImage();
  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
};

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
    fullscreenButton.addEventListener("click", () => {
      openImageModal(slides, captions, activeIndex, (nextIndex) => {
        activeIndex = nextIndex;
        updateSlide();
      });
    });
  }
});

