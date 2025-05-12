document.addEventListener('DOMContentLoaded', () => {
    // --- MODAL FUNCTIONALITY ---
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const captionText = document.getElementById("caption-chf");
    const galleryItemsForModal = document.querySelectorAll(".gallery-item-chf img"); // For modal
    const closeBtnModal = document.querySelector(".modal-chf .close-chf");
    const prevBtnModal = document.querySelector(".modal-chf .prev-chf");
    const nextBtnModal = document.querySelector(".modal-chf .next-chf");

    let currentModalImageIndex;
    const modalImagesData = [];

    galleryItemsForModal.forEach((img, index) => {
        modalImagesData.push({
            src: img.src,
            alt: img.alt,
            caption: img.dataset.caption || img.alt
        });

        img.onclick = function() {
            if (modal) { // Check if modal exists
                modal.style.display = "block";
                updateModalContent(index);
            }
        }
    });

    function updateModalContent(index) {
        if (modalImg && captionText && index >= 0 && index < modalImagesData.length) {
            modalImg.src = modalImagesData[index].src;
            modalImg.alt = modalImagesData[index].alt;
            captionText.innerHTML = modalImagesData[index].caption;
            currentModalImageIndex = index;
        }
    }

    if (closeBtnModal) {
        closeBtnModal.onclick = function() {
            if (modal) modal.style.display = "none";
        }
    }

    if (prevBtnModal) {
        prevBtnModal.onclick = function() {
            currentModalImageIndex = (currentModalImageIndex - 1 + modalImagesData.length) % modalImagesData.length;
            updateModalContent(currentModalImageIndex);
        }
    }

    if (nextBtnModal) {
        nextBtnModal.onclick = function() {
            currentModalImageIndex = (currentModalImageIndex + 1) % modalImagesData.length;
            updateModalContent(currentModalImageIndex);
        }
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            if (modal) modal.style.display = "none";
        }
    }

    document.addEventListener('keydown', function(event) {
        if (modal && modal.style.display === "block") {
            if (event.key === "ArrowLeft" && prevBtnModal) {
                prevBtnModal.click();
            } else if (event.key === "ArrowRight" && nextBtnModal) {
                nextBtnModal.click();
            } else if (event.key === "Escape" && closeBtnModal) {
                closeBtnModal.click();
            }
        }
    });

    // --- GALLERY SLIDER FUNCTIONALITY ---
    const galleryGrid = document.getElementById('chfGalleryGrid');
    const galleryWrapper = document.getElementById('galleryGridWrapper');
    const prevGridBtn = document.getElementById('prevGridBtn');
    const nextGridBtn = document.getElementById('nextGridBtn');

    if (galleryGrid && galleryWrapper && prevGridBtn && nextGridBtn) {
        let scrollAmount = 0;
        let itemWidth = 0; // Will be calculated
        let itemsPerPage = 4; // Default, will be adjusted
        const galleryItems = Array.from(galleryGrid.children);
        const totalItems = galleryItems.length;

        function calculateDimensions() {
            if (galleryItems.length === 0) return;
            
            // Get first item's full width (including margin/gap if any defined by CSS directly on item)
            const firstItem = galleryItems[0];
            const itemStyle = window.getComputedStyle(firstItem);
            // itemWidth = firstItem.offsetWidth + parseFloat(itemStyle.marginLeft) + parseFloat(itemStyle.marginRight); 
            // Simplified: assume gap is handled by grid-gap, so just use offsetWidth of the item itself.
            itemWidth = firstItem.offsetWidth;

            const wrapperWidth = galleryWrapper.offsetWidth;
            
            // Calculate how many items fit based on the first item's width and the grid gap
            const gapValue = parseFloat(window.getComputedStyle(galleryGrid).gap) || 16; // Default to 16px if not found
            
            itemsPerPage = Math.floor((wrapperWidth + gapValue) / (itemWidth + gapValue));
            itemsPerPage = Math.max(1, itemsPerPage); // Ensure at least 1

            // Set the grid's total width to allow horizontal scrolling of all items
            // This makes all items sit in one long row
            galleryGrid.style.width = `${totalItems * (itemWidth + gapValue) - gapValue}px`; 
        }

        function updateArrowStates() {
            prevGridBtn.classList.toggle('disabled', scrollAmount === 0);
            // To check if at the end:
            // Max scroll is total width of grid items minus the visible width of the wrapper
            const maxScroll = galleryGrid.scrollWidth - galleryWrapper.clientWidth;
            nextGridBtn.classList.toggle('disabled', scrollAmount >= maxScroll -1); // -1 for potential float inaccuracies
        }

        function scrollToPosition() {
            galleryGrid.style.transform = `translateX(-${scrollAmount}px)`;
            updateArrowStates();
        }

        prevGridBtn.addEventListener('click', () => {
            const scrollStep = itemsPerPage * (itemWidth + (parseFloat(window.getComputedStyle(galleryGrid).gap) || 16));
            scrollAmount = Math.max(0, scrollAmount - scrollStep);
            scrollToPosition();
        });

        nextGridBtn.addEventListener('click', () => {
            const scrollStep = itemsPerPage * (itemWidth + (parseFloat(window.getComputedStyle(galleryGrid).gap) || 16));
            const maxScroll = galleryGrid.scrollWidth - galleryWrapper.clientWidth;
            scrollAmount = Math.min(maxScroll, scrollAmount + scrollStep);
            scrollToPosition();
        });

        // Initial setup
        if (totalItems > 0) {
            calculateDimensions();
            updateArrowStates(); // Set initial state of arrows
        }

        // Recalculate on resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (totalItems > 0) {
                    // Reset scroll before recalculating to avoid weird positioning
                    scrollAmount = 0; 
                    scrollToPosition(); // Apply reset
                    calculateDimensions();
                    updateArrowStates();
                }
            }, 250);
        });
    }
});