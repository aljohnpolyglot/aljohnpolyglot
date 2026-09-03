(function () {
    "use strict";

    const gallery = document.querySelector("[data-community-gallery]");
    const modal = document.querySelector("[data-community-image-modal]");
    if (!gallery || !modal) return;

    const image = gallery.querySelector("[data-gallery-image]");
    const caption = gallery.querySelector("[data-gallery-caption]");
    const position = gallery.querySelector("[data-gallery-position]");
    const stage = gallery.querySelector("[data-gallery-open]");
    const previous = gallery.querySelector("[data-gallery-previous]");
    const next = gallery.querySelector("[data-gallery-next]");
    const thumbs = Array.from(gallery.querySelectorAll("[data-gallery-thumb]"));
    const modalImage = modal.querySelector("[data-image-modal-image]");
    const modalCaption = modal.querySelector("[data-image-modal-caption]");
    const closeButtons = Array.from(modal.querySelectorAll("[data-image-modal-close]"));
    const closeButton = closeButtons.find((element) => element.tagName === "BUTTON");

    if (!image || !caption || !position || !stage || !previous || !next || !thumbs.length || !closeButton) return;

    let currentIndex = 0;
    let returnFocus = null;

    function show(index) {
        currentIndex = (index + thumbs.length) % thumbs.length;
        const thumb = thumbs[currentIndex];
        image.src = thumb.dataset.src;
        image.alt = thumb.dataset.alt;
        caption.textContent = thumb.dataset.caption;
        position.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(thumbs.length).padStart(2, "0")}`;
        stage.setAttribute("aria-label", `Open photograph ${currentIndex + 1}: ${thumb.dataset.caption}`);
        thumbs.forEach((button, buttonIndex) => button.setAttribute("aria-pressed", String(buttonIndex === currentIndex)));
    }

    function openModal() {
        returnFocus = stage;
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalCaption.textContent = caption.textContent;
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("is-modal-open");
        requestAnimationFrame(() => closeButton.focus());
    }

    function closeModal() {
        if (modal.hidden) return;
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("is-modal-open");
        if (returnFocus && document.contains(returnFocus)) returnFocus.focus();
    }

    thumbs.forEach((thumb, index) => thumb.addEventListener("click", () => show(index)));
    previous.addEventListener("click", () => show(currentIndex - 1));
    next.addEventListener("click", () => show(currentIndex + 1));
    stage.addEventListener("click", openModal);
    gallery.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            show(currentIndex - 1);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            show(currentIndex + 1);
        }
    });

    closeButtons.forEach((button) => button.addEventListener("click", closeModal));
    modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
        } else if (event.key === "Tab") {
            event.preventDefault();
            closeButton.focus();
        }
    });

    show(0);
})();
