// D:\website\languages\spanish\js\friends-loader.js

document.addEventListener('DOMContentLoaded', () => {

    const friendsGrid = document.getElementById('friends-grid-container');
    const modal = document.getElementById('friends-modal');

    if (!friendsGrid || !modal || typeof friendsData === 'undefined') {
        console.error("Faltan elementos de la sección 'Amigos' o el archivo de datos.");
        return;
    }

    // --- 1. CARGAR LAS TARJETAS DE AMIGOS ---
    function loadFriendsGrid() {
        friendsGrid.innerHTML = friendsData.map(friend => {
            // Generar los logos de países
            const logosHTML = friend.countryLogos.map(code => 
                `<img src="https://flagcdn.com/w40/${code}.png" alt="${code.toUpperCase()} Flag" class="country-logo">`
            ).join('');

            return `
                <div class="friend-card" data-friend-id="${friend.id}">
                    <img src="${friend.profilePic}" alt="Foto de ${friend.name}" class="friend-image">
                    <h4 class="friend-name">${friend.name}</h4>
                    <p class="friend-desc">${friend.shortDesc}</p>
                    <div class="country-logos-container">${logosHTML}</div>
                </div>
            `;
        }).join('');
    }

    // --- 2. MANEJAR EL MODAL ---
   // Reemplaza la función openFriendsModal completa con esta:
function openFriendsModal(friend) {
    // Poblar Header
    document.getElementById('modal-friend-img').src = friend.profilePic;
    document.getElementById('modal-friend-name').textContent = friend.name;
    
    // Poblar Logos de Países
    const logosContainer = document.getElementById('modal-friend-logos');
    logosContainer.innerHTML = friend.countryLogos.map(code => 
        `<img src="https://flagcdn.com/w40/${code}.png" alt="${code.toUpperCase()} Flag" class="country-logo">`
    ).join('');

    // Poblar Vídeo
    document.getElementById('modal-friend-embed').innerHTML = `
        <div class="embed-responsive">
            <iframe src="https://www.youtube.com/embed/${friend.videoId}?autoplay=1" title="Video de ${friend.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        </div>
    `;

    // Poblar Descripción y Enlace
    document.getElementById('modal-friend-long-desc').textContent = friend.longDesc;
    document.getElementById('modal-friend-link').href = friend.link;

    // Mostrar Modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

    function closeFriendsModal() {
        // Pausar el vídeo al cerrar para que no siga sonando
        const iframe = document.querySelector('#modal-friend-embed iframe');
        if (iframe) {
            iframe.src = iframe.src; // Esto detiene la reproducción
        }
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // --- 3. EVENT LISTENERS ---
    friendsGrid.addEventListener('click', (event) => {
        const card = event.target.closest('.friend-card');
        if (card) {
            const friendId = card.dataset.friendId;
            const selectedFriend = friendsData.find(f => f.id === friendId);
            if (selectedFriend) {
                openFriendsModal(selectedFriend);
            }
        }
    });

    document.getElementById('friends-modal-close-btn').addEventListener('click', closeFriendsModal);
    document.getElementById('friends-modal-overlay').addEventListener('click', closeFriendsModal);

    // --- 4. INICIALIZACIÓN ---
    loadFriendsGrid();
});