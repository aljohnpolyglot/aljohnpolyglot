// js/bisaya-page-loader.js (Main Orchestrator for Bisaya Page)

document.addEventListener('DOMContentLoaded', () => {
    console.log("BISAYA PAGE LOADER (Main Orchestrator): DOM fully loaded. Initializing modules...");

    // --- 0. Ensure Data Arrays are Available ---
    // This check ensures that 'bisaya-data.js' has loaded before other scripts try to access the data.
    if (typeof bisayaCreators === 'undefined' || typeof bisayaPodcasts === 'undefined' ||
        typeof bisayaKDramas === 'undefined' || typeof chitoMelaiCollabs === 'undefined' || typeof bisayaMusicArtists === 'undefined') { // ADDED bisayaMusicArtists check
        console.error("BISAYA PAGE LOADER: Essential data arrays (from bisaya-data.js) are not defined. Please check script load order. Page functionality will be limited.");
        const body = document.querySelector('body');
        if (body) {
            const errorMsg = document.createElement('div');
            errorMsg.innerHTML = '<p style="color:red; text-align:center; padding:20px; background:white; border:1px solid red; margin:10px;">Critical Error: Page data could not be loaded. Please refresh the page.</p>';
            if (body.firstChild) {
                body.insertBefore(errorMsg, body.firstChild);
            } else {
                body.appendChild(errorMsg);
            }
        }
    }

    // --- 1. Initialize Core Modal Functionality FIRST ---
    // This sets up the basic open/close/clear logic for the universal modal.
    if (typeof initializeModalCore === 'function') {
        initializeModalCore(); // Function defined in js/bisaya-modal-core.js
        console.log("BISAYA PAGE LOADER: BisayaModalCore initialized.");
    } else {
        console.error("BISAYA PAGE LOADER: 'initializeModalCore' function NOT FOUND. Modals will not work correctly.");
    }

    // --- 2. Initialize Specific Modal Handlers (These depend on BisayaModalCore) ---
    // These handlers know how to populate the modal with specific content for Creators and Podcasts.
    if (typeof initializeCreatorModalHandler === 'function') {
        initializeCreatorModalHandler(); // Function defined in js/bisaya-creator-modal-handler.js
    } else {
        console.warn("BISAYA PAGE LOADER: 'initializeCreatorModalHandler' function not found.");
    }

    if (typeof initializePodcastModalHandler === 'function') {
        initializePodcastModalHandler(); // Function defined in js/bisaya-podcast-modal-handler.js
    } else {
        console.warn("BISAYA PAGE LOADER: 'initializePodcastModalHandler' function not found.");
    }

    // --- 3. Initialize Content Loaders / Section Renderers ---
    // These functions are responsible for rendering the main content sections of the page.
    
    if (typeof initializeTopPicks === 'function') {
        initializeTopPicks(); // Function defined in js/bisaya-top-picks-loader.js
    } else {
        console.warn("BISAYA PAGE LOADER: 'initializeTopPicks' function not found.");
    }

    if (typeof initializeKDramaSection === 'function') {
        initializeKDramaSection(); // Function defined in js/bisaya-kdrama-loader.js
    } else {
        console.warn("BISAYA PAGE LOADER: 'initializeKDramaSection' function not found.");
    }

    if (typeof initializePodcastSection === 'function') {
        initializePodcastSection(); // Function defined in js/bisaya-podcast-loader.js (renders podcast cards)
    } else {
        console.warn("BISAYA PAGE LOADER: 'initializePodcastSection' function not found.");
    }
    
    if (typeof initializeMusicSection === 'function') { // This call is correct.
        initializeMusicSection(); // Function defined in js/bisaya-music-loader.js
    } else {
        console.warn("BISAYA PAGE LOADER: 'initializeMusicSection' function not found.");
    }

    // --- IMPORTANT: Initialize Hero Background Slideshow ---
    // This function is defined in js/hero-slideshow.js.
    if (typeof initializeHeroSlideshow === 'function') {
        initializeHeroSlideshow();
        console.log("BISAYA PAGE LOADER: Hero Slideshow initialized.");
    } else {
        console.warn("BISAYA PAGE LOADER: 'initializeHeroSlideshow' function NOT FOUND. Hero background will remain static.");
    }

    // --- 4. Initialize Filters and Creator Grid Rendering ---
    // This sets up the filter UI and triggers the initial rendering of creator cards.
    if (typeof initializeBisayaFilters === 'function') {
        initializeBisayaFilters(); // Function defined in js/bisaya-filters.js (sets up listeners)
        // 'window.initializeAndRenderCreators' is exposed by bisaya-filters.js for initial rendering.
        if (typeof window.initializeAndRenderCreators === 'function') {
            window.initializeAndRenderCreators();
            console.log("BISAYA PAGE LOADER: Creator grid rendering initiated via filters.js.");
        } else {
            console.warn("BISAYA PAGE LOADER: 'window.initializeAndRenderCreators' (from filters.js) not found. Creator cards may not appear.");
        }
    } else {
        console.warn("BISAYA PAGE LOADER: 'initializeBisayaFilters' function not found.");
    }

    // --- 5. Initialize General Carousel Logic (if applicable) ---
    // This is for any general carousel functionality not specific to K-Drama or Podcast sections.
    if (typeof initializeBisayaCarousels === 'function') {
        initializeBisayaCarousels(); // Function defined in js/bisaya-carousel.js
    } else {
        // This is often optional if carousel behavior is handled by other modules or CSS only.
        // console.log("BISAYA PAGE LOADER: 'initializeBisayaCarousels' function not found (this may be optional).");
    }

    // --- 6. Centralized Event Listener for Modal Triggers ---
    // This listener decides which modal handler to call based on the clicked item's type.
    // It relies on specific modal handlers exposing their methods on the `window` object.
    document.body.addEventListener('click', (event) => {
        let sourceCardElement;

        // Prioritize specific buttons within cards that are designated as modal triggers
        let triggerButton = event.target.closest(
            '.podcast-card-spotify .btn-spotify-action.details, ' +                 // Podcast "Details" button
            '.podcast-card-spotify .btn-spotify-action.listen:not([href]), ' +      // Podcast "Listen Now" if it's a button (not a direct link)
            '.creator-card .btn-view-more, ' +                                      // Creator card's "View More" button
            '.btn-modal-trigger, ' +                                                // A generic class for any other modal triggers
            '.music-artist-card' // NEW: Music artist cards also trigger modals
        );

        if (triggerButton) {
            sourceCardElement = triggerButton.closest('[data-id], [data-artist-id]'); // Find nearest ancestor with data-id or data-artist-id
        } else {
            // Fallback: if the click was directly on the card area itself (for types that use modals)
            const directCardClick = event.target.closest(
                '.podcast-card-spotify[data-id], .creator-card[data-id], .music-artist-card[data-artist-id]' 
            );
            // Ensure it's NOT a K-Drama panel, as they have their own panel logic and don't use this modal system
            if (directCardClick && !directCardClick.classList.contains('kdrama-card-revamped')) {
                sourceCardElement = directCardClick;
            }
        }
        
        if (sourceCardElement) {
            // Get ID, checking both data-id and data-artist-id
            const itemId = sourceCardElement.dataset.id || sourceCardElement.dataset.artistId;
            if (!itemId) {
                console.warn("BISAYA PAGE LOADER: Modal trigger has no 'data-id' or 'data-artist-id' attribute:", sourceCardElement);
                return;
            }

            // Determine item type and call the appropriate handler
            if ((sourceCardElement.classList.contains('podcast-card-spotify') || sourceCardElement.closest('.podcast-card-spotify')) && 
                window.BisayaPodcastModal && typeof window.BisayaPodcastModal.populateAndShow === 'function') {
                
                const podcastData = (typeof bisayaPodcasts !== 'undefined') ? bisayaPodcasts.find(p => p.id === itemId) : null;
                if (podcastData) {
                    console.log("BISAYA PAGE LOADER: Triggering Podcast Modal for ID:", itemId);
                    window.BisayaPodcastModal.populateAndShow(podcastData);
                } else {
                    console.warn("BISAYA PAGE LOADER: Podcast data not found for ID:", itemId, ". Cannot open modal.");
                }

            } else if ((sourceCardElement.classList.contains('creator-card') || sourceCardElement.closest('.creator-card')) && 
                       window.BisayaCreatorModal && typeof window.BisayaCreatorModal.populateAndShow === 'function') {
                
                const creatorData = (typeof bisayaCreators !== 'undefined') ? bisayaCreators.find(c => c.id === itemId) : null;
                if (creatorData) {
                    console.log("BISAYA PAGE LOADER: Triggering Creator Modal for ID:", itemId);
                    window.BisayaCreatorModal.populateAndShow(creatorData);
                } else {
                    console.warn("BISAYA PAGE LOADER: Creator data not found for ID:", itemId, ". Cannot open modal.");
                }
            } else if (sourceCardElement.classList.contains('music-artist-card') && // NEW: Music Artist Card trigger
                       window.BisayaMusicArtistModal && typeof window.BisayaMusicArtistModal.populateAndShow === 'function') {
                
                const artistData = (typeof bisayaMusicArtists !== 'undefined') ? bisayaMusicArtists.find(a => a.id === itemId) : null;
                if (artistData) {
                    console.log("BISAYA PAGE LOADER: Triggering Music Artist Modal for ID:", itemId);
                    window.BisayaMusicArtistModal.populateAndShow(artistData);
                } else {
                    console.warn("BISAYA PAGE LOADER: Music Artist data not found for ID:", itemId, ". Cannot open modal.");
                }
            } else {
                console.log("BISAYA PAGE LOADER: Modal trigger clicked for an unhandled card type or missing handler. ID:", itemId, "Element:", sourceCardElement);
            }
        }
    });

    console.log("BISAYA PAGE LOADER: All Bisaya page modules initialization sequence complete.");
});