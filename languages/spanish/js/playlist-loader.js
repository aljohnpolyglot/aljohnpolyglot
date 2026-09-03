// D:\website\languages\spanish\js\playlist-loader.js

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. DEFINICIÓN DE ELEMENTOS DEL DOM ---
    const featuredVideoPlayer = document.getElementById('featured-video-player');
    const playlistItemsContainer = document.getElementById('playlist-items-container');
    const playlistTitle = document.getElementById('playlist-title');

    // Salir si los elementos esenciales o los datos no existen
    if (!featuredVideoPlayer || !playlistItemsContainer || !playlistTitle || typeof aljohnsPlaylistData === 'undefined' || aljohnsPlaylistData.length === 0) {
        console.error("Faltan elementos de la playlist o el archivo de datos (playlist-data.js).");
        return;
    }


    // --- 2. FUNCIÓN PARA CARGAR LA PLAYLIST ---
    function loadPlaylist() {
        // Establecer el primer vídeo como el destacado por defecto
        const firstVideoId = aljohnsPlaylistData[0].id;
        featuredVideoPlayer.src = `https://www.youtube.com/embed/${firstVideoId}`;
        playlistTitle.textContent = aljohnsPlaylistData[0].title;
        
        // Limpiar el contenedor de la playlist
        playlistItemsContainer.innerHTML = '';

        // Crear y añadir cada vídeo a la lista vertical
        aljohnsPlaylistData.forEach((video, index) => {
            const playlistItem = document.createElement('div');
            playlistItem.className = 'playlist-item';
            playlistItem.dataset.videoId = video.id; // Guardamos el ID para el click
         

            // Añadir clase 'active-video' al primer elemento
            if (index === 0) {
                playlistItem.classList.add('active-video');
            }

            playlistItem.innerHTML = `
                <img src="https://i.ytimg.com/vi/${video.id}/mqdefault.jpg" alt="${video.title}" class="playlist-thumbnail">
                <div class="playlist-text">
                    <h4 class="playlist-item-title">${video.title}</h4>
                
                </div>
            `;
            playlistItemsContainer.appendChild(playlistItem);
        });
    }


    // --- 3. FUNCIÓN PARA CAMBIAR EL VÍDEO DESTACADO ---
    function switchFeaturedVideo(videoId, videoTitle) {
        featuredVideoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        playlistTitle.textContent = videoTitle;
    }


    // --- 4. EVENT LISTENER PARA CLICS EN LA PLAYLIST ---
    playlistItemsContainer.addEventListener('click', (event) => {
        const clickedItem = event.target.closest('.playlist-item');
        
        if (clickedItem) {
            // No hacer nada si ya es el vídeo activo
            if (clickedItem.classList.contains('active-video')) {
                return;
            }

            const videoId = clickedItem.dataset.videoId;
            const videoTitle = clickedItem.dataset.videoTitle;
            
            // Cambiar el vídeo en el reproductor principal
            switchFeaturedVideo(videoId, videoTitle);

            // Actualizar la clase 'active-video'
            // Primero, quitarla del elemento que la tuviera
            const currentActive = playlistItemsContainer.querySelector('.active-video');
            if (currentActive) {
                currentActive.classList.remove('active-video');
            }
            // Luego, añadirla al elemento clickeado
            clickedItem.classList.add('active-video');
        }
    });


    // --- 5. INICIALIZACIÓN ---
    loadPlaylist();

});