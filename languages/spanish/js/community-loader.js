
document.addEventListener('DOMContentLoaded', () => {

    const cervantesContainer = document.getElementById('cervantes-feature-container');
    const groupsContainer = document.getElementById('groups-container');

    if (!cervantesContainer || !groupsContainer || typeof communityData === 'undefined') {
        console.error('Faltan contenedores o el archivo community-data.js');
        return;
    }

    // --- FUNCIÓN PARA RENDERIZAR EL FEATURE DE CERVANTES CON SU PALETA ---
    function renderCervantesFeature() {
        const cervantes = communityData.find(item => item.id === 'cervantes-manila');
        if (!cervantes) return;
    
        // --- 1. Construir el HTML de la galería ---
        const slidesHTML = cervantes.photoGallery.map(photo => `
            <div class="carousel-slide"><img src="${photo.src}" alt="${photo.caption}"></div>
        `).join('');
        
        const galleryHTML = `
            <div class="cervantes-gallery">
                <h4 class="gallery-title">Galería de Fotos</h4>
                <div class="carousel-container">
                    <div class="carousel-track">${slidesHTML}</div>
                    <button class="carousel-button prev">&lt;</button>
                    <button class="carousel-button next">&gt;</button>
                </div>
                <p class="carousel-caption"></p>
            </div>
        `;
    
        // --- 2. Construir el HTML de los detalles ---
        const offeringsHTML = cervantes.keyOfferings.map(offer => `<li>${offer}</li>`).join('');
        const detailsHTML = `
            <div class="cervantes-details-column">
                <div class="cervantes-logo-container">
                    <img src="${cervantes.logo}" alt="Logo de ${cervantes.name}">
                </div>
                <h3>${cervantes.name}</h3>
                <p class="subtitle" style="color: ${cervantes.brandPalette.accent};">Aprende español en el centro cultural oficial de España</p>
                <p>${cervantes.longDesc}</p>
                <ul class="key-offerings">${offeringsHTML}</ul>
                <div class="cervantes-buttons">
                  <a href="${cervantes.website}" target="_blank" class="button-link">
  <i class="fas fa-globe"></i> Sitio Web
</a>

<a href="${cervantes.facebook}" target="_blank" class="button-link">
  <i class="fab fa-facebook"></i> Facebook
</a>

<a href="${cervantes.link}" class="button-link">
  <i class="fas fa-info-circle"></i> Detalles
</a>

                </div>
            </div>
        `;
    
        // --- 3. Unir todo en la tarjeta principal ---
        cervantesContainer.innerHTML = `<article class="cervantes-card">${detailsHTML}${galleryHTML}</article>`;
    
        // --- 4. Lógica del Carrusel ---
        const track = cervantesContainer.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const nextButton = cervantesContainer.querySelector('.carousel-button.next');
        const prevButton = cervantesContainer.querySelector('.carousel-button.prev');
        const captionElement = cervantesContainer.querySelector('.carousel-caption');
        let currentIndex = 0;
    
        const updateCarousel = (targetIndex) => {
            track.style.transform = 'translateX(-' + targetIndex * 100 + '%)';
            captionElement.textContent = cervantes.photoGallery[targetIndex].caption;
            currentIndex = targetIndex;
        };
        nextButton.addEventListener('click', () => updateCarousel((currentIndex + 1) % slides.length));
        prevButton.addEventListener('click', () => updateCarousel((currentIndex - 1 + slides.length) % slides.length));
        updateCarousel(0);
    
        // --- 5. Aplicar estilos de la paleta ---
// Aplicar estilos dinámicamente (esta parte se mantiene igual)
const cardElement = cervantesContainer.querySelector('.cervantes-card');
cardElement.style.backgroundColor = cervantes.brandPalette.background;
cardElement.style.color = cervantes.brandPalette.text;

const buttons = cardElement.querySelectorAll('.button-link');
buttons.forEach(button => {
    // Aplicar estilos primarios
    if (!button.classList.contains('secondary')) {
        button.style.backgroundColor = cervantes.brandPalette.buttonBg;
        button.style.color = cervantes.brandPalette.buttonText;
    }
    // Aplicar estilos secundarios
    else {
        button.style.backgroundColor = 'transparent';
        button.style.color = cervantes.brandPalette.accent;
        button.style.border = `2px solid ${cervantes.brandPalette.accent}`;
    }
});
    }

    // --- FUNCIÓN PARA RENDERIZAR LA ESTANTERÍA DE GRUPOS CON SUS PALETAS ---
    function renderGroupsShelf() {
        const groups = communityData.filter(item => item.type === 'group');
        
        groupsContainer.innerHTML = groups.map(group => `
           <div class="card group-card" 
     style="background-color: ${group.brandPalette.background}; color: ${group.brandPalette.text};">
    
    <img src="${group.logo}" alt="Logo de ${group.name}" class="card-image">
    
    <div class="card-content">
        <h4 class="card-title" style="color: ${group.brandPalette.text};">${group.name}</h4>
        <p class="card-subtitle" style="color: ${group.brandPalette.text}B3;">${group.shortDesc}</p>
    </div>

    <a href="${group.link}" class="button-link secondary" 
       style="color: ${group.brandPalette.accent}; border: 2px solid ${group.brandPalette.accent};">
       <i class="fas fa-info-circle" style="margin-right: 0.4em;"></i> Detalles
    </a>
</div>

        `).join('');
    }
    // --- EJECUCIÓN ---
    renderCervantesFeature();
    renderGroupsShelf();
});