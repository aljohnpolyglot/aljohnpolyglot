document.addEventListener('DOMContentLoaded', () => {
    // --- MODAL FUNCTIONALITY for Saging Ca Va Page ---
    const modalSCV = document.getElementById("imageModalSCV");
    const modalImgSCV = document.getElementById("modalImageSCV");
    const captionTextSCV = document.getElementById("caption-scv");
    // Target images within the crepe gallery specifically for its modal
    const galleryItemsForModalSCV = document.querySelectorAll("#scvCrepeGalleryGrid .gallery-item-scv img");
    const closeBtnModalSCV = document.querySelector(".modal-scv .close-scv");
    const prevBtnModalSCV = document.querySelector(".modal-scv .prev-scv");
    const nextBtnModalSCV = document.querySelector(".modal-scv .next-scv");

    let currentSCVModalImageIndex;
    const modalSCVImagesData = [];

    galleryItemsForModalSCV.forEach((img, index) => {
        modalSCVImagesData.push({
            src: img.src,
            alt: img.alt,
            caption: img.dataset.caption || img.alt
        });

        img.onclick = function() {
            if (modalSCV) {
                modalSCV.style.display = "block";
                updateSCVModalContent(index);
            }
        }
    });

    function updateSCVModalContent(index) {
        if (modalImgSCV && captionTextSCV && index >= 0 && index < modalSCVImagesData.length) {
            modalImgSCV.src = modalSCVImagesData[index].src;
            modalImgSCV.alt = modalSCVImagesData[index].alt;
            captionTextSCV.innerHTML = modalSCVImagesData[index].caption;
            currentSCVModalImageIndex = index;
        }
    }

    if (closeBtnModalSCV) {
        closeBtnModalSCV.onclick = function() { if (modalSCV) modalSCV.style.display = "none"; }
    }
    if (prevBtnModalSCV) {
        prevBtnModalSCV.onclick = function() {
            currentSCVModalImageIndex = (currentSCVModalImageIndex - 1 + modalSCVImagesData.length) % modalSCVImagesData.length;
            updateSCVModalContent(currentSCVModalImageIndex);
        }
    }
    if (nextBtnModalSCV) {
        nextBtnModalSCV.onclick = function() {
            currentSCVModalImageIndex = (currentSCVModalImageIndex + 1) % modalSCVImagesData.length;
            updateSCVModalContent(currentSCVModalImageIndex);
        }
    }
    window.onclick = function(event) {
        if (event.target == modalSCV) { if (modalSCV) modalSCV.style.display = "none"; }
    }
    document.addEventListener('keydown', function(event) {
        if (modalSCV && modalSCV.style.display === "block") {
            if (event.key === "ArrowLeft" && prevBtnModalSCV) prevBtnModalSCV.click();
            else if (event.key === "ArrowRight" && nextBtnModalSCV) nextBtnModalSCV.click();
            else if (event.key === "Escape" && closeBtnModalSCV) closeBtnModalSCV.click();
        }
    });

    // --- GALLERY SLIDER FUNCTIONALITY for "But I'M A CRÊPE" Meetup ---
    const crepeGalleryGrid = document.getElementById('scvCrepeGalleryGrid');
    const crepeGalleryWrapper = document.getElementById('scvCrepeGalleryWrapper');
    const crepePrevGridBtn = document.getElementById('scvPrevCrepeBtn');
    const crepeNextGridBtn = document.getElementById('scvNextCrepeBtn');

    if (crepeGalleryGrid && crepeGalleryWrapper && crepePrevGridBtn && crepeNextGridBtn) {
        let crepeScrollAmount = 0;
        let crepeItemWidth = 0;
        let crepeItemsPerPage = 3; // Default for this gallery, can be adjusted
        const crepeGalleryItems = Array.from(crepeGalleryGrid.children);
        const crepeTotalItems = crepeGalleryItems.length;

        function crepeCalculateDimensions() {
            if (crepeGalleryItems.length === 0) return;
            const firstItem = crepeGalleryItems[0];
            crepeItemWidth = firstItem.offsetWidth;
            const wrapperWidth = crepeGalleryWrapper.offsetWidth;
            const gapValue = parseFloat(window.getComputedStyle(crepeGalleryGrid).gap) || 16;
            
            crepeItemsPerPage = Math.floor((wrapperWidth + gapValue) / (crepeItemWidth + gapValue));
            crepeItemsPerPage = Math.max(1, crepeItemsPerPage);

            crepeGalleryGrid.style.width = `${crepeTotalItems * (crepeItemWidth + gapValue) - gapValue}px`;
        }

        function crepeUpdateArrowStates() {
            crepePrevGridBtn.classList.toggle('disabled', crepeScrollAmount === 0);
            const maxScroll = crepeGalleryGrid.scrollWidth - crepeGalleryWrapper.clientWidth;
            // Add a small tolerance for floating point inaccuracies
            crepeNextGridBtn.classList.toggle('disabled', crepeScrollAmount >= maxScroll - 5); 
        }

        function crepeScrollToPosition() {
            crepeGalleryGrid.style.transform = `translateX(-${crepeScrollAmount}px)`;
            crepeUpdateArrowStates();
        }

        crepePrevGridBtn.addEventListener('click', () => {
            const scrollStep = crepeItemsPerPage * (crepeItemWidth + (parseFloat(window.getComputedStyle(crepeGalleryGrid).gap) || 16));
            crepeScrollAmount = Math.max(0, crepeScrollAmount - scrollStep);
            crepeScrollToPosition();
        });

        crepeNextGridBtn.addEventListener('click', () => {
            const scrollStep = crepeItemsPerPage * (crepeItemWidth + (parseFloat(window.getComputedStyle(crepeGalleryGrid).gap) || 16));
            const maxScroll = crepeGalleryGrid.scrollWidth - crepeGalleryWrapper.clientWidth;
            crepeScrollAmount = Math.min(maxScroll, crepeScrollAmount + scrollStep);
            crepeScrollToPosition();
        });

        if (crepeTotalItems > 0) {
            crepeCalculateDimensions();
            crepeUpdateArrowStates();
        }

        let crepeResizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(crepeResizeTimeout);
            crepeResizeTimeout = setTimeout(() => {
                if (crepeTotalItems > 0) {
                    crepeScrollAmount = 0; 
                    crepeScrollToPosition();
                    crepeCalculateDimensions();
                    crepeUpdateArrowStates();
                }
            }, 250);
        });
    }
});