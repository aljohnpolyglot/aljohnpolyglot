// D:\website\languages\spanish\js\extra-loader.js

document.addEventListener('DOMContentLoaded', () => {
    const spotlight = document.getElementById('extra-spotlight');
    const player = document.getElementById('extra-player');
    const playlistContainer = document.getElementById('extra-playlist');

    if (!spotlight || typeof extraSpotlightData === 'undefined') {
        console.error("Faltan elementos del spotlight 'Extr@' o su archivo de datos.");
        return;
    }

    // --- 1. CARGAR EL SPOTLIGHT COMPLETO ---
    function loadExtraSpotlight() {
        const data = extraSpotlightData;

        // Aplicar la paleta de colores
        spotlight.style.backgroundColor = data.brandPalette.background;
        spotlight.style.color = data.brandPalette.textDark;

        // Poblar detalles de la izquierda
        document.getElementById('extra-image').src = data.image;
        document.getElementById('extra-title').textContent = data.title;
        document.getElementById('extra-summary').textContent = data.summary;
        const fbLink = document.getElementById('extra-fb-link');
        fbLink.href = data.fullReviewLink;
        fbLink.style.backgroundColor = data.brandPalette.accent;
        fbLink.style.color = data.brandPalette.textDark;

        // Poblar reproductor y playlist de la derecha
        player.src = `https://www.youtube.com/embed/${data.episodes[0].id}`;
        playlistContainer.innerHTML = data.episodes.map((ep, index) => `
            <div class="playlist-item ${index === 0 ? 'active-video' : ''}" data-video-id="${ep.id}">
                <span class="ep-number" style="background-color: ${data.brandPalette.accent}; color: ${data.brandPalette.textDark};">${index + 1}</span>
                <h4 class="playlist-item-title">${ep.title}</h4>
            </div>
        `).join('');

        // Añadir estilos dinámicos a los elementos activos de la playlist
        updateActiveItemStyle(playlistContainer.querySelector('.active-video'));
    }

    // --- 2. MANEJAR CLICS EN LA PLAYLIST ---
    playlistContainer.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('.playlist-item');
        if (clickedItem && !clickedItem.classList.contains('active-video')) {
            player.src = `https://www.youtube.com/embed/${clickedItem.dataset.videoId}?autoplay=1`;
            
            const currentActive = playlistContainer.querySelector('.active-video');
            if (currentActive) {
                currentActive.classList.remove('active-video');
                resetItemStyle(currentActive);
            }
            clickedItem.classList.add('active-video');
            updateActiveItemStyle(clickedItem);
        }
    });
    
    // --- 3. FUNCIONES DE AYUDA PARA ESTILOS ---
    function updateActiveItemStyle(item) {
        if(item) {
            item.style.borderColor = extraSpotlightData.brandPalette.accent;
        }
    }
    function resetItemStyle(item) {
        if(item) {
            item.style.borderColor = 'transparent';
        }
    }

    // --- 4. INICIALIZACIÓN ---
    loadExtraSpotlight();
});