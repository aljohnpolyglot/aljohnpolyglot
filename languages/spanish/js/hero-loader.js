// D:\website\languages\spanish\js\hero-loader.js

document.addEventListener('DOMContentLoaded', () => {

    const track = document.getElementById('hero-carousel-track');
    const nextButton = document.getElementById('hero-next-btn');
    const prevButton = document.getElementById('hero-prev-btn');
    const modal = document.getElementById('hero-modal');

    if (!track || typeof heroGalleryData === 'undefined' || heroGalleryData.length === 0) {
        console.error("Faltan elementos del carrusel del hero o el archivo hero-data.js");
        return;
    }

    let currentIndex = 0;
    let autoPlayInterval;

    // --- 1. Cargar las imágenes en el carrusel ---
    function loadCarousel() {
        track.innerHTML = heroGalleryData.map((photo, index) => `
            <div class="carousel-slide" data-index="${index}">
                <img src="${photo.src}" alt="${photo.alt}">
            </div>
        `).join('');
    }

    // --- 2. Lógica del movimiento del carrusel ---
    const slides = () => Array.from(track.children);
    
    function moveToSlide(targetIndex) {
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.transform = 'translateX(-' + targetIndex * 100 + '%)';
        currentIndex = targetIndex;
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            const nextIndex = (currentIndex + 1) % slides().length;
            moveToSlide(nextIndex);
        }, 5000); // Cambia de foto cada 5 segundos
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    let modalIndex = 0; // track which image is open
    // --- 3. Lógica del Modal ---
 
function openHeroModal(index) {
    modalIndex = index;
    const photo = heroGalleryData[modalIndex];
    document.getElementById('hero-modal-img').src = photo.src;
    document.getElementById('hero-modal-img').alt = photo.alt;
    document.getElementById('hero-modal-caption').textContent = photo.description;
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    stopAutoPlay();
    
}
    function closeHeroModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
        startAutoPlay();
    }

    // --- 4. Event Listeners ---
    nextButton.addEventListener('click', () => {
        moveToSlide((currentIndex + 1) % slides().length);
        stopAutoPlay();
        startAutoPlay();
    });

    prevButton.addEventListener('click', () => {
        moveToSlide((currentIndex - 1 + slides().length) % slides().length);
        stopAutoPlay();
        startAutoPlay();
    });

    track.addEventListener('click', (event) => {
        const slide = event.target.closest('.carousel-slide');
        if (slide) {
            openHeroModal(parseInt(slide.dataset.index));
        }
    });
    
    document.getElementById('hero-modal-close-btn').addEventListener('click', closeHeroModal);
    document.getElementById('hero-modal-overlay').addEventListener('click', closeHeroModal);
    document.getElementById('hero-modal-next-btn').addEventListener('click', () => {
        modalIndex = (modalIndex + 1) % heroGalleryData.length;
        openHeroModal(modalIndex);
    });
    
    document.getElementById('hero-modal-prev-btn').addEventListener('click', () => {
        modalIndex = (modalIndex - 1 + heroGalleryData.length) % heroGalleryData.length;
        openHeroModal(modalIndex);
    });
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('hidden')) return;
    
        if (e.key === 'ArrowRight') {
            modalIndex = (modalIndex + 1) % heroGalleryData.length;
            openHeroModal(modalIndex);
        } else if (e.key === 'ArrowLeft') {
            modalIndex = (modalIndex - 1 + heroGalleryData.length) % heroGalleryData.length;
            openHeroModal(modalIndex);
        } else if (e.key === 'Escape') {
            closeHeroModal();
        }
    });
    
    // --- 5. Inicialización ---
    loadCarousel();
    startAutoPlay();
});