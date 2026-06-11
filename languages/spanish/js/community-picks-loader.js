
document.addEventListener('DOMContentLoaded', () => {

    const picksContainer = document.getElementById('community-carousel');
    const modal = document.getElementById('picks-modal');

    if (!picksContainer || !modal || typeof communityPicksData === 'undefined') {
        console.error("Faltan elementos de 'Community Picks' o el archivo de datos.");
        return;
    }

    // --- 1. CARGAR LA ESTANTERÍA DE SUGERENCIAS ---
    function loadCommunityPicks() {
        picksContainer.innerHTML = communityPicksData.map(pick => `
            <div class="card pick-card" data-pick-id="${pick.id}">
                <img src="${pick.profilePic}" alt="Logo de ${pick.name}" class="card-image">
                <div class="card-content">
                    <span class="cefr-badge">${pick.cefr.join('-')}</span>
                    <h4 class="card-title">${pick.name}</h4>
                    <p class="card-subtitle">${pick.type}</p>
                </div>
            </div>
        `).join('');
    }

    // --- 2. MANEJAR EL MODAL ---
    function openPicksModal(pick) {
        document.getElementById('modal-pick-img').src = pick.profilePic;
        document.getElementById('modal-pick-name').textContent = pick.name;
        document.getElementById('modal-pick-type').textContent = pick.type;
        document.getElementById('modal-pick-desc').textContent = pick.description;
        document.getElementById('modal-pick-recommended-by').textContent = `Recomendado por: ${pick.recommendedBy}`;
        document.getElementById('modal-pick-link').href = pick.link;
    
       // Inside openPicksModal:
const embedContainer = document.getElementById('modal-pick-embed');
const videoWrapper = document.querySelector('.video-wrapper');
const topSeparator = document.querySelector('.video-separator-top');
const bottomSeparator = document.querySelector('.video-separator-bottom');

embedContainer.innerHTML = ''; // Clear previous video

if (pick.embeddedId) {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${pick.embeddedId}`;
    iframe.title = "YouTube video player";
    iframe.frameBorder = "0";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    
    embedContainer.appendChild(iframe);

    // Show the video section and separators
    videoWrapper.style.display = 'block'; // Or 'flex' if you want to make it flex in future
    topSeparator.style.display = 'block';
    bottomSeparator.style.display = 'block';

} else {
    // Hide the video section and separators
    videoWrapper.style.display = 'none';
    topSeparator.style.display = 'none';
    bottomSeparator.style.display = 'none';
}
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closePicksModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    // --- 3. EVENT LISTENERS ---
    picksContainer.addEventListener('click', (event) => {
        const card = event.target.closest('.pick-card');
        if (card) {
            const pickId = card.dataset.pickId;
            const selectedPick = communityPicksData.find(p => p.id === pickId);
            if (selectedPick) {
                openPicksModal(selectedPick);
            }
        }
    });

    document.getElementById('picks-modal-close-btn').addEventListener('click', closePicksModal);
    document.getElementById('picks-modal-overlay').addEventListener('click', closePicksModal);

    // --- 4. INICIALIZACIÓN ---
    loadCommunityPicks();
});