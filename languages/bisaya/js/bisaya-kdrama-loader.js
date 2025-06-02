// js/bisaya-kdrama-loader.js

function initializeKDramaSection() {
    console.log("BISAYA KDRAMA LOADER (vFinal_Rev1 - Click Activate, Platform Tag Hidden, Commented WhyBisaya & Platform): Initializing...");

    // --- DOM Element Selectors ---
    const kdramaWrapperEl = document.getElementById('kdrama-scroll-wrapper');
    const detailPanelDimmer = document.getElementById('kdrama-detail-panel-dimmer');
    const detailPanel = document.getElementById('kdrama-detail-panel');

    // Elements within the detail panel
    const detailVideoIframe = document.getElementById('kdrama-detail-video-iframe');
    const detailTitleEl = document.getElementById('kdrama-detail-title');
    const detailViuLink = document.getElementById('kdrama-detail-viu-link'); // CTA still needed
    const detailSynopsisEl = document.getElementById('kdrama-detail-synopsis');
    const detailCloseBtn = document.getElementById('kdrama-detail-close');

    // Meta/info elements
    const detailPlatformTagEl = document.getElementById('kdrama-detail-platform-tag'); // Still get ref to hide it
    // const detailPlatformNameTextEl = detailPlatformTagEl ? detailPlatformTagEl.querySelector('.platform-name-text') : null; // Not strictly needed if always hidden
    const detailGenreTagsEl = document.getElementById('kdrama-detail-genre-tags');
    
    // Commented out: "Why Watch in Bisaya" elements
    // const detailWhyBisayaSectionEl = document.getElementById('kdrama-why-bisaya');
    // const detailWhyBisayaTextEl = document.getElementById('kdrama-why-bisaya-text');
    
    const detailStarringInfoEl = document.getElementById('kdrama-starring-info');
    const detailStarringTextEl = document.getElementById('kdrama-starring-text');

    // --- Basic HTML Element Checks ---
    // We'll make detailPlatformTagEl optional in the check if we are always hiding it,
    // but it's better if the HTML element exists and we control its display via JS.
    // For this version, we assume the HTML element for platform tag *exists* but will be hidden.
    if (!kdramaWrapperEl || !detailPanelDimmer || !detailPanel || !detailVideoIframe ||
        !detailTitleEl || !detailViuLink || !detailSynopsisEl || !detailCloseBtn ||
        !detailPlatformTagEl || /* detailPlatformNameTextEl check removed as it depends on parent */
        !detailGenreTagsEl || !detailStarringInfoEl || !detailStarringTextEl) {
        console.error("BISAYA KDRAMA LOADER: One or more essential HTML elements for the K-Drama detail view are missing. Please check your HTML structure. Aborting K-Drama section initialization.");
        if (kdramaWrapperEl) {
            kdramaWrapperEl.innerHTML = "<p class='text-center full-width-message'>Error: Could not load K-Drama details component.</p>";
        }
        return;
    }

    // --- State Variable ---
    let detailPanelOpen = false;

    // --- Helper Functions for Embed URLs ---
    function getYouTubeEmbedUrl(youtubeUrl) {
        if (!youtubeUrl) return '';
        let videoId;
        if (youtubeUrl.includes('embed/')) {
            videoId = youtubeUrl.split('embed/')[1].split(/[?&]/)[0];
        } else if (youtubeUrl.includes('watch?v=')) {
            videoId = youtubeUrl.split('v=')[1].split('&')[0];
        } else if (youtubeUrl.includes('youtu.be/')) {
            videoId = youtubeUrl.split('youtu.be/')[1].split(/[?&]/)[0];
        }
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3` : '';
    }

    function getFacebookEmbedUrl(facebookUrl) {
        if (!facebookUrl) return '';
        return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(facebookUrl)}&autoplay=1&mute=1&show-text=false&width=560&playsinline=1&allowfullscreen=true&show_captions=false`;
    }

    // --- Show/Hide Detail Panel Logic ---
    function showKDramaDetailPanel(showData) {
        if (!showData || detailPanelOpen) return;

        // Populate main content
        detailTitleEl.textContent = showData.title || 'Show Title';
        detailViuLink.href = showData.platformLink || '#';
        const viuButtonTextSpan = detailViuLink.querySelector('span');
        if (viuButtonTextSpan) {
            viuButtonTextSpan.textContent = `Tan-awa Karon sa ${showData.platformName || 'Viu'}`;
        }
        detailSynopsisEl.textContent = showData.longSynopsis || 'Wala pay dugang detalye.';

        // --- Platform Tag Handling ---
        // Always hide the platform tag in this version, but keep structure for future
        if (detailPlatformTagEl) {
            detailPlatformTagEl.style.display = 'none';
        }
        /*
        // Future logic if you want to show it conditionally:
        const detailPlatformNameTextEl = detailPlatformTagEl ? detailPlatformTagEl.querySelector('.platform-name-text') : null;
        if (detailPlatformTagEl && showData.platformName) {
            if (showData.platformName.toLowerCase() === 'viu' && viuButtonTextSpan) { // Example: Hide if Viu and CTA mentions Viu
                detailPlatformTagEl.style.display = 'none';
            } else if (detailPlatformNameTextEl) {
                detailPlatformNameTextEl.textContent = showData.platformName;
                detailPlatformTagEl.innerHTML = `<i class="fas fa-tv"></i> ${showData.platformName}`; // Reconstruct if needed
                detailPlatformTagEl.style.display = 'inline-flex';
            } else {
                detailPlatformTagEl.style.display = 'none';
            }
        } else if (detailPlatformTagEl) {
            detailPlatformTagEl.style.display = 'none';
        }
        */


        // Genre Tags
        if (showData.genres && showData.genres.length > 0) {
            detailGenreTagsEl.innerHTML = `<i class="fas fa-tags"></i> ${showData.genres.join(', ')}`;
            detailGenreTagsEl.style.display = 'inline-flex';
        } else {
            detailGenreTagsEl.style.display = 'none';
        }
        
        // Commented out: "Why Watch in Bisaya" section logic
        /*
        const whyBisayaSection = document.getElementById('kdrama-why-bisaya');
        const whyBisayaText = document.getElementById('kdrama-why-bisaya-text');
        if (whyBisayaSection && whyBisayaText) {
            if (showData.whyBisaya) {
                whyBisayaText.textContent = showData.whyBisaya;
                whyBisayaSection.style.display = 'block';
            } else {
                whyBisayaText.textContent = "Perfect ni para ma-practice imong Bisaya listening skills...";
                whyBisayaSection.style.display = 'block';
            }
        }
        */

        // "Starring" section
        if (showData.starring) {
            detailStarringTextEl.textContent = showData.starring;
            detailStarringInfoEl.style.display = 'block';
        } else {
            detailStarringInfoEl.style.display = 'none';
        }

        // Prepare video embed URL
        let embedUrl = '';
        if (showData.videoPreview) {
            if (showData.videoPreview.includes('youtube.com') || showData.videoPreview.includes('youtu.be')) {
                embedUrl = getYouTubeEmbedUrl(showData.videoPreview);
            } else if (showData.videoPreview.includes('facebook.com')) {
                embedUrl = getFacebookEmbedUrl(showData.videoPreview);
            }
        }
        
        setTimeout(() => {
            if (detailPanelOpen) {
                 detailVideoIframe.src = embedUrl || 'about:blank';
            }
        }, 50);

        detailPanelDimmer.classList.add('active');
        detailPanel.classList.add('active');
        detailPanelOpen = true;
        document.body.style.overflow = 'hidden';

        const contentArea = detailPanel.querySelector('.immersive-content-area');
        if(contentArea) contentArea.scrollTop = 0;
    }

    function hideKDramaDetailPanel() {
        if (!detailPanelOpen) return;
        detailVideoIframe.src = 'about:blank';
        detailPanelDimmer.classList.remove('active');
        detailPanel.classList.remove('active');
        detailPanelOpen = false;
        document.body.style.overflow = '';
    }

    // --- Event Listeners for Closing the Panel ---
    detailCloseBtn.addEventListener('click', hideKDramaDetailPanel);
    detailPanelDimmer.addEventListener('click', hideKDramaDetailPanel);
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && detailPanelOpen) {
            hideKDramaDetailPanel();
        }
    });

    // --- Render K-Drama Cards in the Carousel ---
    function renderKDramaCards() {
        if (typeof bisayaKDramas === 'undefined' || !Array.isArray(bisayaKDramas)) {
            console.error("BISAYA KDRAMA LOADER: 'bisayaKDramas' data array is not available.");
            if (kdramaWrapperEl) kdramaWrapperEl.innerHTML = "<p class='text-center full-width-message'>Error: K-Drama data not found.</p>";
            return;
        }

        if (bisayaKDramas.length > 0) {
            let kdramaHTML = '';
            bisayaKDramas.forEach(show => {
                if (!show || !show.id) {
                    console.warn("BISAYA KDRAMA LOADER: Skipping invalid K-Drama data object:", show);
                    return;
                }
                kdramaHTML += `
                    <article class="kdrama-card-revamped"
                             tabindex="0" 
                             role="button"
                             data-show-id="${show.id}" 
                             aria-label="Tan-awa ang detalye para sa ${show.title || 'K-Drama'}">
                        <div class="card-revamped-poster" 
                             style="background-image: url('${show.posterSrc || 'images/shows/placeholder_poster.jpg'}');"
                             aria-hidden="true"> 
                        </div>
                        <div class="card-revamped-title-overlay">
                            <h4>${show.title || 'Show Title'}</h4>
                        </div>
                    </article>`;
            });
            kdramaWrapperEl.innerHTML = kdramaHTML;

            kdramaWrapperEl.querySelectorAll('.kdrama-card-revamped').forEach(card => {
                card.addEventListener('click', () => {
                    const showId = card.dataset.showId;
                    const showData = bisayaKDramas.find(s => s.id === showId);
                    if (showData) {
                        showKDramaDetailPanel(showData);
                    } else {
                        console.warn(`BISAYA KDRAMA LOADER: No data found for show ID: ${showId}`);
                    }
                });
                card.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault();
                        card.click();
                    }
                });
            });
            console.log("BISAYA KDRAMA LOADER: K-Drama cards rendered.");
        } else {
            kdramaWrapperEl.innerHTML = "<p class='text-center full-width-message'>Wala pay K-Drama nga Bisaya-dubbed nga ma-display karon. Atangi!</p>";
        }
    }

    // --- Initial Call to Render Cards ---
    renderKDramaCards();
}