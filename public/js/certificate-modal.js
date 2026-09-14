document.querySelectorAll("[data-certificate-modal]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    event.preventDefault();

    const title = trigger.dataset.certificateTitle || "Certificate";
    window.openImageModal({
      images: [
        {
          src: trigger.href,
          alt: `${title} certificate`,
          caption: title,
        },
      ],
      label: "Certificate Preview",
      title,
      showNext: false,
    });
  });
});
