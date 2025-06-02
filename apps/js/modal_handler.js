// D:\website\apps\js\modal_handler.js

function openModal(appId) {
    const appData = allAppData.find(app => app.id === appId); // Assumes allAppData is global
    const modal = document.getElementById('app-modal');

    if (appData && modal) {
        populateModal(appData); // Assumes populateModal is globally available from ui_renderer.js
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    } else {
        console.error("App data not found for ID:", appId, "or modal element missing.");
    }
}

function closeModal() {
    const modal = document.getElementById('app-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function setupModalEventListeners() {
    const modal = document.getElementById('app-modal');
    const modalCloseBtn = document.querySelector('.modal-close-btn');

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        // Close modal if clicked outside the modal-content
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }

    // Close modal with Escape key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });
}