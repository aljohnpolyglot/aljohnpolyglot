document.addEventListener('DOMContentLoaded', () => {
    const modalSCV = document.getElementById('imageModalSCV');
    const modalImgSCV = document.getElementById('modalImageSCV');
    const captionTextSCV = document.getElementById('caption-scv');
    const galleryTriggersSCV = Array.from(document.querySelectorAll('#scvCrepeGalleryGrid .gallery-item-scv'));
    const closeBtnModalSCV = document.querySelector('.modal-scv .close-scv');
    const prevBtnModalSCV = document.querySelector('.modal-scv .prev-scv');
    const nextBtnModalSCV = document.querySelector('.modal-scv .next-scv');
    const modalSCVImagesData = galleryTriggersSCV.map(trigger => {
        const image = trigger.querySelector('img');
        return {
            src: image?.src || '',
            alt: image?.alt || '',
            caption: image?.dataset.caption || image?.alt || '',
        };
    });

    let currentSCVModalImageIndex = 0;
    let lastSCVModalTrigger = null;

    function updateSCVModalContent(index) {
        if (!modalImgSCV || !captionTextSCV || index < 0 || index >= modalSCVImagesData.length) return;
        const image = modalSCVImagesData[index];
        modalImgSCV.src = image.src;
        modalImgSCV.alt = image.alt;
        captionTextSCV.textContent = image.caption;
        currentSCVModalImageIndex = index;
    }

    function openSCVModal(index, trigger) {
        if (!modalSCV || !closeBtnModalSCV) return;
        lastSCVModalTrigger = trigger;
        updateSCVModalContent(index);
        modalSCV.style.display = 'block';
        modalSCV.setAttribute('aria-hidden', 'false');
        document.body.classList.add('scv-modal-open');
        closeBtnModalSCV.focus();
    }

    function closeSCVModal() {
        if (!modalSCV) return;
        modalSCV.style.display = 'none';
        modalSCV.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('scv-modal-open');
        lastSCVModalTrigger?.focus();
        lastSCVModalTrigger = null;
    }

    function changeSCVModalImage(direction) {
        if (!modalSCVImagesData.length) return;
        const nextIndex = (currentSCVModalImageIndex + direction + modalSCVImagesData.length) % modalSCVImagesData.length;
        updateSCVModalContent(nextIndex);
    }

    galleryTriggersSCV.forEach((trigger, index) => {
        trigger.addEventListener('click', () => openSCVModal(index, trigger));
    });
    closeBtnModalSCV?.addEventListener('click', closeSCVModal);
    prevBtnModalSCV?.addEventListener('click', () => changeSCVModalImage(-1));
    nextBtnModalSCV?.addEventListener('click', () => changeSCVModalImage(1));
    modalSCV?.addEventListener('click', event => {
        if (event.target === modalSCV) closeSCVModal();
    });

    document.addEventListener('keydown', event => {
        if (!modalSCV || modalSCV.getAttribute('aria-hidden') !== 'false') return;
        if (event.key === 'ArrowLeft') changeSCVModalImage(-1);
        else if (event.key === 'ArrowRight') changeSCVModalImage(1);
        else if (event.key === 'Escape') closeSCVModal();
        else if (event.key === 'Tab') {
            const controls = [closeBtnModalSCV, prevBtnModalSCV, nextBtnModalSCV].filter(Boolean);
            const firstControl = controls[0];
            const lastControl = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === firstControl) {
                event.preventDefault();
                lastControl.focus();
            } else if (!event.shiftKey && document.activeElement === lastControl) {
                event.preventDefault();
                firstControl.focus();
            }
        }
    });

    // One-photo community carousel. The same ordered collection opens in the full-screen modal.
    const crepeGalleryGrid = document.getElementById('scvCrepeGalleryGrid');
    const crepeGalleryWrapper = document.getElementById('scvCrepeGalleryWrapper');
    const crepePrevGridBtn = document.getElementById('scvPrevCrepeBtn');
    const crepeNextGridBtn = document.getElementById('scvNextCrepeBtn');
    const crepeGalleryStatus = document.getElementById('scvGalleryStatus');

    if (crepeGalleryGrid && crepeGalleryWrapper && crepePrevGridBtn && crepeNextGridBtn) {
        const crepeGalleryItems = Array.from(crepeGalleryGrid.children);
        const crepeTotalItems = crepeGalleryItems.length;
        let currentCrepeIndex = 0;

        function showCrepePhoto(index) {
            if (!crepeTotalItems) return;
            currentCrepeIndex = (index + crepeTotalItems) % crepeTotalItems;
            crepeGalleryGrid.style.transform = `translateX(-${currentCrepeIndex * 100}%)`;
            if (crepeGalleryStatus) {
                crepeGalleryStatus.textContent = `Photo ${currentCrepeIndex + 1} sur ${crepeTotalItems}`;
            }
        }

        crepePrevGridBtn.addEventListener('click', () => {
            showCrepePhoto(currentCrepeIndex - 1);
        });

        crepeNextGridBtn.addEventListener('click', () => {
            showCrepePhoto(currentCrepeIndex + 1);
        });

        showCrepePhoto(0);
    }
});
