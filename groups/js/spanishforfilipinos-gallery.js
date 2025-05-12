document.addEventListener('DOMContentLoaded', () => {
    // --- SFF MODAL FUNCTIONALITY ---
    const modalSFF = document.getElementById("imageModalSFF");
    const modalImgSFF = document.getElementById("modalImageSFF");
    const captionTextSFF = document.getElementById("caption-sff");
    const galleryItemsForModalSFF = document.querySelectorAll("#gallery .gallery-item-sff img"); // Specific to SFF gallery
    const closeBtnModalSFF = document.querySelector(".modal-sff .close-sff");
    const prevBtnModalSFF = document.querySelector(".modal-sff .prev-sff");
    const nextBtnModalSFF = document.querySelector(".modal-sff .next-sff");

    let currentSFFModalImageIndex;
    const modalSFFImagesData = [];

    galleryItemsForModalSFF.forEach((img, index) => {
        modalSFFImagesData.push({
            src: img.src,
            alt: img.alt,
            caption: img.dataset.caption || img.alt
        });

        img.onclick = function() {
            if (modalSFF) {
                modalSFF.style.display = "block";
                updateSFFModalContent(index);
            }
        }
    });

    function updateSFFModalContent(index) {
        if (modalImgSFF && captionTextSFF && index >= 0 && index < modalSFFImagesData.length) {
            modalImgSFF.src = modalSFFImagesData[index].src;
            modalImgSFF.alt = modalSFFImagesData[index].alt;
            captionTextSFF.innerHTML = modalSFFImagesData[index].caption;
            currentSFFModalImageIndex = index;
        }
    }

    if (closeBtnModalSFF) {
        closeBtnModalSFF.onclick = function() {
            if (modalSFF) modalSFF.style.display = "none";
        }
    }
    if (prevBtnModalSFF) {
        prevBtnModalSFF.onclick = function() {
            currentSFFModalImageIndex = (currentSFFModalImageIndex - 1 + modalSFFImagesData.length) % modalSFFImagesData.length;
            updateSFFModalContent(currentSFFModalImageIndex);
        }
    }
    if (nextBtnModalSFF) {
        nextBtnModalSFF.onclick = function() {
            currentSFFModalImageIndex = (currentSFFModalImageIndex + 1) % modalSFFImagesData.length;
            updateSFFModalContent(currentSFFModalImageIndex);
        }
    }
    window.onclick = function(event) {
        if (event.target == modalSFF) {
            if (modalSFF) modalSFF.style.display = "none";
        }
    }
    document.addEventListener('keydown', function(event) {
        if (modalSFF && modalSFF.style.display === "block") {
            if (event.key === "ArrowLeft" && prevBtnModalSFF) prevBtnModalSFF.click();
            else if (event.key === "ArrowRight" && nextBtnModalSFF) nextBtnModalSFF.click();
            else if (event.key === "Escape" && closeBtnModalSFF) closeBtnModalSFF.click();
        }
    });

    // --- SFF GALLERY SLIDER FUNCTIONALITY ---
    const sffGalleryGrid = document.getElementById('sffGalleryGrid');
    const sffGalleryWrapper = document.getElementById('sffGalleryGridWrapper');
    const sffPrevGridBtn = document.getElementById('sffPrevGridBtn');
    const sffNextGridBtn = document.getElementById('sffNextGridBtn');

    if (sffGalleryGrid && sffGalleryWrapper && sffPrevGridBtn && sffNextGridBtn) {
        let sffScrollAmount = 0;
        let sffItemWidth = 0;
        let sffItemsPerPage = 4; 
        const sffGalleryItems = Array.from(sffGalleryGrid.children);
        const sffTotalItems = sffGalleryItems.length;

        function sffCalculateDimensions() {
            if (sffGalleryItems.length === 0) return;
            const firstItem = sffGalleryItems[0];
            sffItemWidth = firstItem.offsetWidth;
            const wrapperWidth = sffGalleryWrapper.offsetWidth;
            const gapValue = parseFloat(window.getComputedStyle(sffGalleryGrid).gap) || 16;
            
            sffItemsPerPage = Math.floor((wrapperWidth + gapValue) / (sffItemWidth + gapValue));
            sffItemsPerPage = Math.max(1, sffItemsPerPage);

            sffGalleryGrid.style.width = `${sffTotalItems * (sffItemWidth + gapValue) - gapValue}px`;
        }

        function sffUpdateArrowStates() {
            sffPrevGridBtn.classList.toggle('disabled', sffScrollAmount === 0);
            const maxScroll = sffGalleryGrid.scrollWidth - sffGalleryWrapper.clientWidth;
            sffNextGridBtn.classList.toggle('disabled', sffScrollAmount >= maxScroll -1 );
        }

        function sffScrollToPosition() {
            sffGalleryGrid.style.transform = `translateX(-${sffScrollAmount}px)`;
            sffUpdateArrowStates();
        }

        sffPrevGridBtn.addEventListener('click', () => {
            const scrollStep = sffItemsPerPage * (sffItemWidth + (parseFloat(window.getComputedStyle(sffGalleryGrid).gap) || 16));
            sffScrollAmount = Math.max(0, sffScrollAmount - scrollStep);
            sffScrollToPosition();
        });

        sffNextGridBtn.addEventListener('click', () => {
            const scrollStep = sffItemsPerPage * (sffItemWidth + (parseFloat(window.getComputedStyle(sffGalleryGrid).gap) || 16));
            const maxScroll = sffGalleryGrid.scrollWidth - sffGalleryWrapper.clientWidth;
            sffScrollAmount = Math.min(maxScroll, sffScrollAmount + scrollStep);
            sffScrollToPosition();
        });

        if (sffTotalItems > 0) {
            sffCalculateDimensions();
            sffUpdateArrowStates();
        }

        let sffResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(sffResizeTimeout);
            sffResizeTimeout = setTimeout(() => {
                if (sffTotalItems > 0) {
                    sffScrollAmount = 0; 
                    sffScrollToPosition();
                    sffCalculateDimensions();
                    sffUpdateArrowStates();
                }
            }, 250);
        });
    }
});