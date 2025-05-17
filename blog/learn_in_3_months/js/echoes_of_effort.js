// js/learn_in_3_months_page.js
document.addEventListener('DOMContentLoaded', function() {
    // ... (your existing Mastery Levels and Footer Year code) ...

    // --- Voices of Mastery Modal Logic ---
    const openModalButtons = document.querySelectorAll('.open-mastery-modal');
    const closeModalButtons = document.querySelectorAll('.mastery-modal-close');
    const modalContainer = document.getElementById('masteryModalContainer'); // Optional, if you need to interact with it

    openModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.dataset.modalTarget;
            const modal = document.querySelector(modalId);
            if (modal) {
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
                modal.classList.add('active');
            } else {
                console.warn("Modal with ID " + modalId + " not found.");
            }
        });
    });

    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.mastery-modal');
            if (modal) {
                closeMasteryModal(modal);
            }
        });
    });

    // Close modal if user clicks outside of the modal content
    window.addEventListener('click', (event) => {
        const activeModal = document.querySelector('.mastery-modal.active');
        if (activeModal && event.target === activeModal) { // Check if the click is on the modal overlay itself
            closeMasteryModal(activeModal);
        }
    });

    // Close modal with Escape key
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            const activeModal = document.querySelector('.mastery-modal.active');
            if (activeModal) {
                closeMasteryModal(activeModal);
            }
        }
    });

    function closeMasteryModal(modal) {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = ''; // Restore background scrolling
        }
    }
    console.log("Voices of Mastery Modals: Initialized.");

    // ... (your existing Native Comparison Graph initialization call) ...
});