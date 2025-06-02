// js/bisaya-podcast-loader.js

function initializePodcastSection() {
    console.log("BISAYA PODCAST LOADER (Spotify Revamp): Initializing...");

    const podcastWrapperEl = document.getElementById('podcast-scroll-wrapper');

    if (!podcastWrapperEl) {
        console.error("BISAYA PODCAST LOADER: Podcast wrapper element #podcast-scroll-wrapper not found. Aborting.");
        return;
    }

    function renderPodcastCards() {
        if (typeof bisayaPodcasts !== 'undefined' && Array.isArray(bisayaPodcasts) && bisayaPodcasts.length > 0) {
            let podcastHTML = '';
            bisayaPodcasts.forEach(podcast => {
                if (!podcast || !podcast.id) {
                    console.warn("BISAYA PODCAST: Skipping invalid Podcast data:", podcast);
                    return;
                }

                // Determine the primary "Listen Now" link for the card hover. Prioritize Spotify.
                let primaryListenLink = '#'; // Default to modal trigger if no direct link
                let opensModalDirectly = true; // If true, listen button also opens modal
                
                if (podcast.platformLinks) {
                    if (podcast.platformLinks.spotify) {
                        primaryListenLink = podcast.platformLinks.spotify;
                        opensModalDirectly = false; // Spotify link is direct, no modal needed for this button
                    } else if (Object.values(podcast.platformLinks).find(link => link)) {
                        // If no Spotify, take the first available link for hover button (optional)
                        // For simplicity, let's make "Listen Now" on card always open modal if no Spotify,
                        // or you could make it link to the first available platform.
                        // primaryListenLink = Object.values(podcast.platformLinks).find(link => link);
                        // opensModalDirectly = false;
                    }
                }

                podcastHTML += `
                    <article class="podcast-card-spotify"
                             data-modal-target="modal-${podcast.id}" 
                             data-id="${podcast.id}" 
                             aria-label="Mga detalye para sa ${podcast.title || 'Podcast'}">
                        <div class="podcast-card-spotify-art" style="background-image: url('${podcast.coverSrc || 'images/podcasts/placeholder_cover.jpg'}');">
                            <div class="podcast-card-spotify-overlay">
                                <div class="podcast-card-spotify-actions">
                                    ${!opensModalDirectly ? 
                                        `<a href="${primaryListenLink}" target="_blank" class="btn-spotify-action listen" aria-label="Paminaw sa ${podcast.title}">
                                            <i class="fab fa-spotify"></i> Paminaw Karon 
                                         </a>` :
                                        `<button class="btn-spotify-action listen modal-trigger-podcast-card" aria-label="Paminaw sa ${podcast.title}">
                                            <i class="fas fa-play"></i> Paminaw Karon
                                         </button>`
                                    }
                                    <button class="btn-spotify-action details modal-trigger-podcast-card" aria-label="Dugang detalye para sa ${podcast.title}">
                                        <i class="fas fa-info-circle"></i> Detalye
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="podcast-card-spotify-info">
                            <h4>${podcast.title || 'Podcast Title'}</h4>
                        </div>
                    </article>`;
            });
            podcastWrapperEl.innerHTML = podcastHTML;

            // Add event listeners for modal triggers on new buttons if necessary
            // The main modal listener on document.body should catch `data-modal-target` on the article
            // but if buttons inside need to specifically trigger, they'd need `data-id` or similar.
            // For simplicity, let's assume clicking the card article itself (or a specific modal trigger button) works.
            // The `modal-trigger-podcast-card` class can be targeted by bisaya-modals.js if needed.
            // For example, if `.btn-spotify-action.details` or `.listen` (when it's a button) should open modal:
            podcastWrapperEl.querySelectorAll('.modal-trigger-podcast-card').forEach(button => {
                button.addEventListener('click', (e) => {
                    const card = e.target.closest('.podcast-card-spotify');
                    if (card && card.dataset.id) {
                        // Manually trigger the modal opening logic from bisaya-modals.js
                        // This requires bisaya-modals.js to expose a function or for the main listener to be robust
                        // For now, we rely on the card's data-modal-target.
                        // This is just to show how specific buttons could be handled.
                        // The global modal listener in bisaya-modals.js might need refinement to catch these.
                        console.log("Podcast card button clicked, should open modal for ID:", card.dataset.id);
                    }
                });
            });

            console.log("BISAYA PODCAST: Spotify-style Podcast cards rendered.");
        } else {
            podcastWrapperEl.innerHTML = "<p class='text-center full-width-message'>Wala pay podcasts nga ma-display.</p>";
        }
    }
    renderPodcastCards();
}