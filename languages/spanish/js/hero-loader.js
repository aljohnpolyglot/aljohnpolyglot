document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('hero-carousel-track');
    const carousel = document.getElementById('hero-carousel-container');
    const nextButton = document.getElementById('hero-next-btn');
    const prevButton = document.getElementById('hero-prev-btn');
    const countLabel = document.getElementById('hero-carousel-count');
    const currentCaption = document.getElementById('hero-current-caption');
    const carouselStatus = document.getElementById('hero-carousel-status');
    const modal = document.getElementById('hero-modal');
    const modalImage = document.getElementById('hero-modal-img');
    const modalCaption = document.getElementById('hero-modal-caption');
    const modalCloseButton = document.getElementById('hero-modal-close-btn');
    const modalBackdrop = document.getElementById('hero-modal-backdrop');
    const modalNextButton = document.getElementById('hero-modal-next-btn');
    const modalPrevButton = document.getElementById('hero-modal-prev-btn');

    if (!track || !carousel || !modal || typeof heroGalleryData === 'undefined' || heroGalleryData.length === 0) {
        console.error('Faltan elementos del carrusel del hero o el archivo hero-data.js');
        return;
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let currentIndex = 0;
    let modalIndex = 0;
    let lastFocusedElement = null;
    let previousBodyOverflow = '';

    function slides() {
        return Array.from(track.children);
    }

    function loadCarousel() {
        track.innerHTML = heroGalleryData.map((photo, index) => `
            <button
                class="carousel-slide"
                type="button"
                data-index="${index}"
                aria-label="Abrir foto: ${photo.alt}"
                ${index === 0 ? '' : 'tabindex="-1" aria-hidden="true"'}
            >
                <img
                    src="${photo.src}"
                    alt="${photo.alt}"
                    width="${photo.width}"
                    height="${photo.height}"
                    decoding="async"
                    ${index === 0 ? 'loading="eager" fetchpriority="high"' : 'loading="lazy"'}
                >
            </button>
        `).join('');
    }

    function updateCurrentMeta(index, announce = false) {
        const photo = heroGalleryData[index];
        const total = String(heroGalleryData.length).padStart(2, '0');

        countLabel.textContent = `${String(index + 1).padStart(2, '0')} / ${total}`;
        currentCaption.textContent = photo.alt;

        if (announce) {
            carouselStatus.textContent = `Foto ${index + 1} de ${heroGalleryData.length}: ${photo.alt}`;
        }

        slides().forEach((slide, slideIndex) => {
            const isCurrent = slideIndex === index;
            slide.tabIndex = isCurrent ? 0 : -1;
            slide.setAttribute('aria-hidden', String(!isCurrent));
        });
    }

    function moveToSlide(targetIndex, announce = false) {
        const normalizedIndex = (targetIndex + heroGalleryData.length) % heroGalleryData.length;
        track.style.transition = reducedMotion.matches
            ? 'none'
            : 'transform 560ms cubic-bezier(0.22, 1, 0.36, 1)';
        track.style.transform = `translateX(-${normalizedIndex * 100}%)`;
        currentIndex = normalizedIndex;
        updateCurrentMeta(currentIndex, announce);
    }

    function updateModalPhoto(index) {
        const photo = heroGalleryData[index];
        modalImage.src = photo.src;
        modalImage.alt = photo.alt;
        modalCaption.textContent = photo.description;
    }

    function openHeroModal(index) {
        modalIndex = index;
        lastFocusedElement = document.activeElement;
        previousBodyOverflow = document.body.style.overflow;
        updateModalPhoto(modalIndex);
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        window.requestAnimationFrame(() => modalCloseButton.focus());
    }

    function closeHeroModal() {
        if (modal.classList.contains('hidden')) {
            return;
        }

        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = previousBodyOverflow;

        if (lastFocusedElement && document.contains(lastFocusedElement)) {
            lastFocusedElement.focus();
        }
    }

    function showNextModalPhoto(direction) {
        modalIndex = (modalIndex + direction + heroGalleryData.length) % heroGalleryData.length;
        updateModalPhoto(modalIndex);
    }

    function trapModalFocus(event) {
        if (event.key !== 'Tab' || modal.classList.contains('hidden')) {
            return;
        }

        const focusableElements = [modalCloseButton, modalPrevButton, modalNextButton];
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    }

    nextButton.addEventListener('click', () => {
        moveToSlide(currentIndex + 1, true);
    });

    prevButton.addEventListener('click', () => {
        moveToSlide(currentIndex - 1, true);
    });

    track.addEventListener('click', (event) => {
        const slide = event.target.closest('.carousel-slide');
        if (slide) {
            openHeroModal(Number.parseInt(slide.dataset.index, 10));
        }
    });

    modalCloseButton.addEventListener('click', closeHeroModal);
    modalBackdrop.addEventListener('click', closeHeroModal);
    modalNextButton.addEventListener('click', () => showNextModalPhoto(1));
    modalPrevButton.addEventListener('click', () => showNextModalPhoto(-1));

    document.addEventListener('keydown', (event) => {
        if (modal.classList.contains('hidden')) {
            return;
        }

        if (event.key === 'ArrowRight') {
            showNextModalPhoto(1);
        } else if (event.key === 'ArrowLeft') {
            showNextModalPhoto(-1);
        } else if (event.key === 'Escape') {
            closeHeroModal();
        }

        trapModalFocus(event);
    });

    loadCarousel();
    updateCurrentMeta(0);
});
