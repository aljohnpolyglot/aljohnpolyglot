// js/bisaya-modal-core.js

function initializeModalCore() {
    console.log("BISAYA MODAL CORE: Initializing...");

    const modalElement = document.getElementById('bisaya-item-modal');
    if (!modalElement) { /* ... error ... */ return; }
    const modalContentElement = modalElement.querySelector('.modal-content-bisaya');
    const closeModalButton = modalElement.querySelector('.close-modal-bisaya');

    if (!modalContentElement || !closeModalButton) { /* ... error ... */ return; }

    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemNameContainer = modalElement.querySelector('.modal-item-info-header');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemLongDesc = document.getElementById('modal-item-long-desc');
    
    // Video related elements for clearing
    const videoEmbedsContainer = document.getElementById('modal-video-embeds-container');
    const videoEmbedsHeader = document.getElementById('modal-video-embeds-header');
    const videoTabsContainer = modalElement.querySelector('.video-tabs-container');
    const videoTabsNav = document.getElementById('modal-video-tabs-nav');
    const videoTabsContent = document.getElementById('modal-video-tabs-content');
    // Fallback single video divs (might still be used by a simpler creator modal initially)
    const embed1Div = document.getElementById('modal-video-embed-1'); 
    const embed2Div = document.getElementById('modal-video-embed-2');

    const modalItemTags = modalElement.querySelector('.modal-item-tags');
    
    // Footer elements for clearing
    const modalFooter = modalElement.querySelector('.modal-footer-bisaya');
    const modalItemCta = document.getElementById('modal-item-cta'); // Default/Podcast CTA
    const creatorSocialActionsContainer = document.getElementById('modal-creator-social-actions');


    function openModal() {
        modalElement.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modalElement.style.display = 'none';
        document.body.style.overflow = '';
        clearModalContent();
    }

    function clearModalContent() {
        modalContentElement.classList.remove('podcast-spotify-modal-theme', 'creator-modal-theme');

        if (modalItemImage) {
            modalItemImage.src = "images/placeholder_modal_image.png";
            modalItemImage.alt = "Loading content...";
            modalItemImage.style.width = '120px'; modalItemImage.style.height = '120px';
            modalItemImage.style.borderRadius = '50%';
            modalItemImage.style.border = '4px solid var(--sinulog-deep-blue)'; // Default border
            modalItemImage.style.boxShadow = 'none';
        }

        if (modalItemName) modalItemName.textContent = "Loading...";
        if (modalItemTags) {
            modalItemTags.innerHTML = '';
            modalItemTags.style.display = 'none'; // Hide tags by default, handlers will show if needed
        }
        if (modalItemLongDesc) modalItemLongDesc.innerHTML = "<p>Loading description...</p>";

        // Clear video tab content
        if (videoTabsNav) videoTabsNav.innerHTML = '';
        if (videoTabsContent) videoTabsContent.innerHTML = '';
        if (videoTabsContainer) videoTabsContainer.style.display = 'none'; // Hide tabs by default
        if (videoEmbedsHeader) videoEmbedsHeader.textContent = "Girekomenda ni Aljohn:"; // Reset header
        
        // Clear fallback video divs
        if (embed1Div) { embed1Div.innerHTML = ''; embed1Div.style.display = 'none';}
        if (embed2Div) { embed2Div.innerHTML = ''; embed2Div.style.display = 'none';}
        if (videoEmbedsContainer) videoEmbedsContainer.style.display = 'none'; // Hide main video container

        // Reset default CTA button (used by podcast)
        if (modalItemCta) {
            modalItemCta.href = "#";
            modalItemCta.innerHTML = "Visit <i class='fas fa-external-link-alt'></i>";
            modalItemCta.className = 'btn-sinulog-style btn-primary-sinulog'; // Default classes
            modalItemCta.style.display = 'none'; // Hide by default, handlers will show
            modalItemCta.target = '_self';
            modalItemCta.onclick = null;
        }
        // Clear creator-specific social action buttons
        if (creatorSocialActionsContainer) {
            creatorSocialActionsContainer.innerHTML = '';
            creatorSocialActionsContainer.style.display = 'none'; // Hide by default
        }
        // Ensure footer is visible if any CTA is shown (handlers will manage specific CTA visibility)
        if(modalFooter) modalFooter.style.display = 'block';


        // Remove .modal-social-links if it was added directly to .modal-body-bisaya (legacy)
        const legacySocialLinks = modalElement.querySelector('.modal-body-bisaya .modal-social-links');
        if (legacySocialLinks) legacySocialLinks.remove();

        console.log("BISAYA MODAL CORE: Modal content cleared.");
    }

    function applyModalTheme(themeClassName) {
        modalContentElement.classList.remove('podcast-spotify-modal-theme', 'creator-modal-theme');
        if (themeClassName) {
            modalContentElement.classList.add(themeClassName);
        }
    }

    closeModalButton.addEventListener('click', closeModal);
    modalElement.addEventListener('click', (event) => { /* ... same ... */ });
    document.addEventListener('keydown', (event) => { /* ... same ... */ });

    console.log("BISAYA MODAL CORE: Generic modal listeners attached.");

    window.BisayaModalCore = {
        open: openModal,
        close: closeModal,
        clear: clearModalContent,
        applyTheme: applyModalTheme,
        getModalElement: () => modalElement
        // getModalContentElement: () => modalContentElement // Not really needed externally now
    };
}

// Call initialization when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModalCore);
} else {
    initializeModalCore();
}