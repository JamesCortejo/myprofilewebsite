const imageModal = document.createElement("div");
imageModal.className = "image-modal";
imageModal.setAttribute("aria-hidden", "true");
imageModal.innerHTML = `
  <div class="image-modal-backdrop" data-modal-close></div>
  <div class="image-modal-panel" role="dialog" aria-modal="true" aria-label="Image preview" tabindex="-1">
    <div class="image-modal-header">
      <div>
        <span class="image-modal-label">Project Preview</span>
        <p class="image-modal-title"></p>
      </div>
      <button class="image-modal-close" type="button" data-modal-close aria-label="Close image preview">
        <span aria-hidden="true">&times;</span>
        <span>Close</span>
      </button>
    </div>
    <div class="image-modal-stage">
      <img class="image-modal-image" alt="" />
    </div>
    <div class="image-modal-footer">
      <p class="image-modal-caption"></p>
      <div class="image-modal-footer-actions">
        <span class="image-modal-count"></span>
        <button class="image-modal-next" type="button" aria-label="Show next image">
          <span>Next</span>
          <span aria-hidden="true">&#8594;</span>
        </button>
      </div>
    </div>
  </div>
`;
document.body.appendChild(imageModal);

const modalPanel = imageModal.querySelector(".image-modal-panel");
const modalImage = imageModal.querySelector(".image-modal-image");
const modalLabel = imageModal.querySelector(".image-modal-label");
const modalTitle = imageModal.querySelector(".image-modal-title");
const modalCaption = imageModal.querySelector(".image-modal-caption");
const modalCount = imageModal.querySelector(".image-modal-count");
const modalNextButton = imageModal.querySelector(".image-modal-next");
const modalFooterActions = imageModal.querySelector(".image-modal-footer-actions");
const modalCloseButtons = imageModal.querySelectorAll("[data-modal-close]");
const focusableSelector = [
  "a[href]",
  "button:not([disabled]):not([hidden])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(", ");
let modalState = null;
let lastFocusedElement = null;

const getFocusableElements = () =>
  Array.from(imageModal.querySelectorAll(focusableSelector)).filter(
    (element) => element.offsetParent !== null
  );

const updateModalIndex = (nextIndex) => {
  if (!modalState || !modalState.showNext) return;

  modalState.activeIndex =
    (nextIndex + modalState.images.length) % modalState.images.length;
  modalState.onChange(modalState.activeIndex);
  renderModalImage();
};

const renderModalImage = () => {
  if (!modalState) return;

  const activeImage = modalState.images[modalState.activeIndex];
  modalImage.src = activeImage.src;
  modalImage.alt = activeImage.alt;
  modalLabel.textContent = modalState.label;
  modalTitle.textContent = modalState.title || "";
  modalCaption.textContent = activeImage.caption;
  modalNextButton.hidden = !modalState.showNext;
  modalCount.hidden = !modalState.showNext;
  modalFooterActions.hidden = !modalState.showNext;
  modalCount.textContent = modalState.showNext
    ? `${modalState.activeIndex + 1} / ${modalState.images.length}`
    : "";
};

const closeImageModal = () => {
  imageModal.classList.remove("is-open");
  imageModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  modalState = null;

  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }

  lastFocusedElement = null;
};

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeImageModal);
});

modalNextButton.addEventListener("click", () => {
  if (!modalState) return;
  updateModalIndex(modalState.activeIndex + 1);
});

document.addEventListener("keydown", (event) => {
  if (!modalState) return;

  if (event.key === "Escape") {
    closeImageModal();
    return;
  }

  if (event.key === "ArrowRight" && modalState.showNext) {
    event.preventDefault();
    updateModalIndex(modalState.activeIndex + 1);
    return;
  }

  if (event.key === "ArrowLeft" && modalState.showNext) {
    event.preventDefault();
    updateModalIndex(modalState.activeIndex - 1);
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = getFocusableElements();
  if (focusableElements.length === 0) {
    event.preventDefault();
    modalPanel.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
});

window.openImageModal = ({
  images,
  activeIndex = 0,
  onChange = () => {},
  label = "Project Preview",
  title = "",
  showNext = images.length > 1,
}) => {
  lastFocusedElement = document.activeElement;
  modalState = { images, activeIndex, onChange, label, title, showNext };
  renderModalImage();
  imageModal.classList.add("is-open");
  imageModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  requestAnimationFrame(() => {
    const focusTarget = imageModal.querySelector(".image-modal-close") || modalPanel;
    focusTarget.focus();
  });
};