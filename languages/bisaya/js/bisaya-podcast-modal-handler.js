// js/bisaya-podcast-modal-handler.js

function initializePodcastModalHandler() {
    console.log("BISAYA PODCAST MODAL HANDLER (Spotify Theme): Initializing...");

    if (!window.BisayaModalCore) {
        console.error("BISAYA PODCAST MODAL HANDLER: BisayaModalCore is not available.");
        return;
    }

    const modal = window.BisayaModalCore.getModalElement();
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemInfoContainer = modal.querySelector('.modal-item-info-header'); // To set data-host
    const modalItemLongDesc = document.getElementById('modal-item-long-desc');
    const modalItemCta = document.getElementById('modal-item-cta'); // This is THE button now for Spotify

    // Elements to explicitly HIDE for this specific podcast modal theme
    const modalVideoEmbedsContainer = document.getElementById('modal-video-embeds-container');
    const modalItemTags = modal.querySelector('.modal-item-tags');
    const creatorSocialActionsContainer = document.getElementById('modal-creator-social-actions');


    function populatePodcastModalSpotify(podcast) {
        if (!podcast) {
            console.warn("BISAYA PODCAST MODAL HANDLER: No podcast data provided.");
            window.BisayaModalCore.clear(); // Clear to show default loading state
            return;
        }

        window.BisayaModalCore.clear(); // Start with a clean slate from core
        window.BisayaModalCore.applyTheme('podcast-spotify-modal-theme'); // Apply Spotify-like theme

        // Populate Podcast Specific Content
        if (modalItemImage && podcast.coverSrc) {
            modalItemImage.src = podcast.coverSrc;
            modalItemImage.alt = podcast.altText || podcast.title;
        }
        if (modalItemName && podcast.title) {
            modalItemName.textContent = podcast.title;
        }
        // For the "Podcast by Host Name" subtitle in CSS
        if (modalItemInfoContainer && podcast.hosts) { // Assuming podcast data has a 'hosts' string
            modalItemInfoContainer.setAttribute('data-host', ` by ${podcast.hosts}`);
        } else if (modalItemInfoContainer) {
            modalItemInfoContainer.removeAttribute('data-host');
        }
        
        if (modalItemLongDesc) {
            if (podcast.longDesc) {
                modalItemLongDesc.innerHTML = `<p>${podcast.longDesc.replace(/\n/g, '</p><p>')}</p>`;
            } else {
                modalItemLongDesc.innerHTML = "<p>Wala pay dugang detalye para aning podcast.</p>";
            }
        }

        // Explicitly hide elements not used in this Spotify podcast modal theme
        if (modalVideoEmbedsContainer) modalVideoEmbedsContainer.style.display = 'none';
        if (modalItemTags) modalItemTags.style.display = 'none';
        if (creatorSocialActionsContainer) creatorSocialActionsContainer.style.display = 'none';

        // Setup the single "Listen on Spotify" CTA using the #modal-item-cta element
        if (modalItemCta) {
            if (podcast.platformLinks && podcast.platformLinks.spotify) {
                modalItemCta.href = podcast.platformLinks.spotify;
                modalItemCta.target = '_blank';
                modalItemCta.innerHTML = `<i class="fab fa-spotify"></i> Paminaw sa Spotify`;
                modalItemCta.className = 'btn-spotify-listen'; // CSS class for Spotify green button styling
                modalItemCta.style.display = 'inline-flex';
            } else {
                modalItemCta.style.display = 'none'; // Hide CTA if no Spotify link
            }
        }
        window.BisayaModalCore.open();
    }

    // Expose the function
    window.BisayaPodcastModal = {
        populateAndShow: populatePodcastModalSpotify
    };
}

// Initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePodcastModalHandler);
} else {
    initializePodcastModalHandler();
}