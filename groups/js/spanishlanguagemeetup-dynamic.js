document.addEventListener('DOMContentLoaded', () => {
    // --- NEXT MEETUP DATE CALCULATION ---
    const nextMeetupDateElement = document.getElementById('next-meetup-date');
    if (nextMeetupDateElement) {
        function getNextSecondSaturday(today) {
            let year = today.getFullYear();
            let month = today.getMonth();
            function findSecondSaturday(currentYear, currentMonth) {
                let date = new Date(currentYear, currentMonth, 1);
                let firstDay = date.getDay();
                let firstSaturdayOffset = (6 - firstDay + 7) % 7;
                let secondSaturdayDate = 1 + firstSaturdayOffset + 7;
                return new Date(currentYear, currentMonth, secondSaturdayDate);
            }
            let nextMeetup = findSecondSaturday(year, month);
            if (nextMeetup < today || (nextMeetup.toDateString() === today.toDateString() && today.getHours() >= 18)) {
                month++;
                if (month > 11) { month = 0; year++; }
                nextMeetup = findSecondSaturday(year, month);
            }
            return nextMeetup;
        }
        const today = new Date();
        const nextMeetup = getNextSecondSaturday(today);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        nextMeetupDateElement.textContent = nextMeetup.toLocaleDateString('en-US', options);
    }

    // --- SLM MODAL FUNCTIONALITY ---
    const modalSLM = document.getElementById("imageModalSLM");
    const modalImgSLM = document.getElementById("modalImageSLM");
    const captionTextSLM = document.getElementById("caption-slm");
    const galleryItemsForModalSLM = document.querySelectorAll("#slmGalleryGrid .gallery-item-slm img");
    const closeBtnModalSLM = document.querySelector(".modal-slm .close-slm");
    const prevBtnModalSLM = document.querySelector(".modal-slm .prev-slm");
    const nextBtnModalSLM = document.querySelector(".modal-slm .next-slm");
    let currentSLMModalImageIndex;
    const modalSLMImagesData = [];

    galleryItemsForModalSLM.forEach((img, index) => {
        modalSLMImagesData.push({ src: img.src, alt: img.alt, caption: img.dataset.caption || img.alt });
        img.onclick = function() {
            if (modalSLM) { modalSLM.style.display = "block"; updateSLMModalContent(index); }
        }
    });
    function updateSLMModalContent(index) {
        if (modalImgSLM && captionTextSLM && index >= 0 && index < modalSLMImagesData.length) {
            modalImgSLM.src = modalSLMImagesData[index].src;
            modalImgSLM.alt = modalSLMImagesData[index].alt;
            captionTextSLM.innerHTML = modalSLMImagesData[index].caption;
            currentSLMModalImageIndex = index;
        }
    }
    if (closeBtnModalSLM) { closeBtnModalSLM.onclick = function() { if (modalSLM) modalSLM.style.display = "none"; }}
    if (prevBtnModalSLM) { prevBtnModalSLM.onclick = function() { currentSLMModalImageIndex = (currentSLMModalImageIndex - 1 + modalSLMImagesData.length) % modalSLMImagesData.length; updateSLMModalContent(currentSLMModalImageIndex); }}
    if (nextBtnModalSLM) { nextBtnModalSLM.onclick = function() { currentSLMModalImageIndex = (currentSLMModalImageIndex + 1) % modalSLMImagesData.length; updateSLMModalContent(currentSLMModalImageIndex); }}
    window.onclick = function(event) { if (event.target == modalSLM) { if (modalSLM) modalSLM.style.display = "none"; }}
    document.addEventListener('keydown', function(event) {
        if (modalSLM && modalSLM.style.display === "block") {
            if (event.key === "ArrowLeft" && prevBtnModalSLM) prevBtnModalSLM.click();
            else if (event.key === "ArrowRight" && nextBtnModalSLM) nextBtnModalSLM.click();
            else if (event.key === "Escape" && closeBtnModalSLM) closeBtnModalSLM.click();
        }
    });

    // --- SLM GALLERY SLIDER FUNCTIONALITY ---
    const slmGalleryGrid = document.getElementById('slmGalleryGrid');
    const slmGalleryWrapper = document.getElementById('slmGalleryGridWrapper');
    const slmPrevGridBtn = document.getElementById('slmPrevGridBtn');
    const slmNextGridBtn = document.getElementById('slmNextGridBtn');
    if (slmGalleryGrid && slmGalleryWrapper && slmPrevGridBtn && slmNextGridBtn) {
        let slmScrollAmount = 0, slmItemWidth = 0, slmItemsPerPage = 4;
        const slmGalleryItems = Array.from(slmGalleryGrid.children);
        const slmTotalItems = slmGalleryItems.length;
        function slmCalculateDimensions() {
            if (slmGalleryItems.length === 0) return;
            slmItemWidth = slmGalleryItems[0].offsetWidth;
            const wrapperWidth = slmGalleryWrapper.offsetWidth;
            const gapValue = parseFloat(window.getComputedStyle(slmGalleryGrid).gap) || 16;
            slmItemsPerPage = Math.max(1, Math.floor((wrapperWidth + gapValue) / (slmItemWidth + gapValue)));
            slmGalleryGrid.style.width = `${slmTotalItems * (slmItemWidth + gapValue) - gapValue}px`;
        }
        function slmUpdateArrowStates() {
            slmPrevGridBtn.classList.toggle('disabled', slmScrollAmount === 0);
            const maxScroll = slmGalleryGrid.scrollWidth - slmGalleryWrapper.clientWidth;
            slmNextGridBtn.classList.toggle('disabled', slmScrollAmount >= maxScroll - 5);
        }
        function slmScrollToPosition() { slmGalleryGrid.style.transform = `translateX(-${slmScrollAmount}px)`; slmUpdateArrowStates(); }
        slmPrevGridBtn.addEventListener('click', () => { const scrollStep = slmItemsPerPage * (slmItemWidth + (parseFloat(window.getComputedStyle(slmGalleryGrid).gap) || 16)); slmScrollAmount = Math.max(0, slmScrollAmount - scrollStep); slmScrollToPosition(); });
        slmNextGridBtn.addEventListener('click', () => { const scrollStep = slmItemsPerPage * (slmItemWidth + (parseFloat(window.getComputedStyle(slmGalleryGrid).gap) || 16)); const maxScroll = slmGalleryGrid.scrollWidth - slmGalleryWrapper.clientWidth; slmScrollAmount = Math.min(maxScroll, slmScrollAmount + scrollStep); slmScrollToPosition(); });
        if (slmTotalItems > 0) { slmCalculateDimensions(); slmUpdateArrowStates(); }
        let slmResizeTimeout;
        window.addEventListener('resize', () => { clearTimeout(slmResizeTimeout); slmResizeTimeout = setTimeout(() => { if (slmTotalItems > 0) { slmScrollAmount = 0; slmScrollToPosition(); slmCalculateDimensions(); slmUpdateArrowStates();}}, 250);});
    }

    // --- SLM REVEAL ON SCROLL FUNCTIONALITY ---
    const slmRevealOnScroll = (entries, observer) => { entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('slm-visible'); observer.unobserve(entry.target); }});};
    const slmRevealOptions = { root: null, threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const slmScrollObserver = new IntersectionObserver(slmRevealOnScroll, slmRevealOptions);
    const slmElementsToReveal = document.querySelectorAll('.slm-reveal-on-scroll');
    if (slmElementsToReveal.length > 0) { slmElementsToReveal.forEach(element => { slmScrollObserver.observe(element); }); }
    else { document.querySelectorAll('.slm-reveal-on-scroll-fallback').forEach(el => { el.classList.add('slm-visible'); }); }
});