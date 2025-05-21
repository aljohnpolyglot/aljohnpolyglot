// js/bisaya-music-artist-modal-handler.js - Handles the modal for individual music artists

function initializeMusicArtistModalHandler() {
    console.log("BISAYA MUSIC ARTIST MODAL HANDLER: Initializing...");

    if (!window.BisayaModalCore) {
        console.error("BISAYA MUSIC ARTIST MODAL HANDLER: BisayaModalCore is not available. Load order issue?");
        return;
    }

    const modal = window.BisayaModalCore.getModalElement();
    const modalItemImage = document.getElementById('modal-item-image'); // For artist cover art
    const modalItemName = document.getElementById('modal-item-name'); // For artist name
    const modalItemTags = modal.querySelector('.modal-item-tags'); // For location tag
    const modalItemLongDesc = document.getElementById('modal-item-long-desc'); // For artist long description

    // Video Section for featured song
    const videoEmbedsContainer = document.getElementById('modal-video-embeds-container'); // Main container
    const videoEmbedsHeader = document.getElementById('modal-video-embeds-header'); // Heading for featured song
    const singleVideoEmbedContainer = document.getElementById('modal-video-embed-1'); // Use this for featured song
    // Ensure tabs container is hidden for music artists if it exists
    const videoTabsContainer = modal.querySelector('.video-tabs-container');


    // Footer CTAs
    const modalItemCta = document.getElementById('modal-item-cta'); // Main CTA button (will hide)
    const socialLinksContainer = document.getElementById('modal-creator-social-actions'); // Re-using this container for music artist socials


    // --- Helper to get YouTube Embed URL ---
    function getYouTubeEmbedUrl(videoId) {
        // Corrected to accept full YouTube URL and extract ID, ensuring consistent embed behavior
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = videoId.match(regExp);
        const actualVideoId = (match && match[1]) ? match[1] : videoId; // If already an ID, use it

        return `https://www.youtube.com/embed/${actualVideoId}?rel=0&autoplay=0&modestbranding=1`;
    }

    // --- Helper to get Facebook Embed URL ---
    function getFacebookEmbedUrl(videoUrl) {
        // Facebook video embed URLs need to be specifically formatted.
        // If the URL is a direct video link (watch?v= or /videos/), convert it to an embed URL.
        // This is crucial for proper embedding.
        let embedSrc = videoUrl;
        if (!videoUrl.includes('plugins/video.php')) {
            // Attempt to extract video ID from various FB URL types
            const videoIdMatch = videoUrl.match(/(?:videos\/|watch\/\?v=|reel\/)(\d+)/);
            if (videoIdMatch && videoIdMatch[1]) {
                 const originalVideoUrl = `https://www.facebook.com/watch/?v=${videoIdMatch[1]}`;
                 embedSrc = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(originalVideoUrl)}&show_text=false&width=560&height=315&autoplay=0`;
            } else {
                // Fallback for general FB link, might not work if it's not a direct video link.
                embedSrc = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false&width=560&height=315&autoplay=0`;
            }
        }
        return embedSrc;
    }

    /**
     * Creates the full HTML string for a video iframe.
     * @param {object} embedData - An object containing video 'type' ('youtube' or 'facebook') and 'url'.
     * @param {string} creatorName - The name of the creator for the iframe title.
     * @returns {string} The HTML string for the iframe.
     */
    function createVideoIframeHtml(embedData, creatorName) {
        if (!embedData || !embedData.url || !embedData.type) return '';
        
        let iframeSrc = '';
        const videoTitle = embedData.title || creatorName || 'Featured Video';

        if (embedData.type === 'youtube') {
            iframeSrc = getYouTubeEmbedUrl(embedData.url);
        } else if (embedData.type === 'facebook') {
            iframeSrc = getFacebookEmbedUrl(embedData.url);
        } else {
            return ''; // Unsupported video type
        }

        if (iframeSrc) {
            // Ensure the iframe has 100% width/height and no border
            return `<iframe src="${iframeSrc}" width="100%" height="100%" style="border:none;overflow:hidden;" scrolling="no" frameborder="0" allowfullscreen="true" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" title="${videoTitle}"></iframe>`;
        }
        return '';
    }

    // --- Helper to get Platform Icon Class ---
    function getPlatformIconClass(platformKey) {
        const lowerKey = platformKey.toLowerCase().replace('_channel', '').replace('_playlist', '');
        const iconMap = {
            youtube: 'fab fa-youtube', facebook: 'fab fa-facebook', instagram: 'fab fa-instagram',
            tiktok: 'fab fa-tiktok', spotify: 'fab fa-spotify', website: 'fas fa-globe',
            twitter: 'fab fa-twitter', kofi: 'fas fa-mug-hot'
        };
        return iconMap[lowerKey] || 'fas fa-external-link-alt';
    }


    function populateMusicArtistModal(artist) {
        if (!artist) {
            console.warn("BISAYA MUSIC ARTIST MODAL HANDLER: No artist data provided. Clearing modal.");
            window.BisayaModalCore.clear();
            return;
        }

        window.BisayaModalCore.clear(); // Clear all previous content and theme
        window.BisayaModalCore.applyTheme('music-artist-modal-theme'); // Apply specific theme for music artists

        // 1. Populate Header: Artist Cover Art, Name, Location Tag
        if (modalItemImage && artist.coverArt) {
            modalItemImage.src = artist.coverArt;
            modalItemImage.alt = artist.name + " Cover Art";
        }
        if (modalItemName && artist.name) {
            modalItemName.textContent = artist.name;
        }
        // Display location as a tag (similar to Creator modal's region tag)
        if (modalItemTags && artist.location) {
            modalItemTags.innerHTML = `<span class="tag-eyebrow region-eyebrow"><i class="fas fa-map-marker-alt"></i> ${artist.location}</span>`;
            modalItemTags.style.display = 'flex'; // Show tag container
        } else if (modalItemTags) {
            modalItemTags.innerHTML = '';
            modalItemTags.style.display = 'none'; // Hide if no location
        }

        // 2. Populate Long Description
        if (modalItemLongDesc && artist.longDesc) {
            modalItemLongDesc.innerHTML = `<p>${artist.longDesc.replace(/\n/g, '</p><p>')}</p>`;
        } else if (modalItemLongDesc) {
            modalItemLongDesc.innerHTML = "<p>Wala pay dugang detalye para aning artist.</p>";
        }

        // 3. Populate Featured Bisaya Song Video (if artist.bisayaSongs exists and has at least one song)
        if (videoEmbedsContainer && singleVideoEmbedContainer && artist.bisayaSongs && artist.bisayaSongs.length > 0) {
            const featuredSong = artist.bisayaSongs[0]; // Take the first Bisaya song as featured for modal
            
            // Show heading for the featured song
            if (videoEmbedsHeader) { 
                videoEmbedsHeader.textContent = `Bisaya Featured Song: ${featuredSong.title}`;
                videoEmbedsHeader.style.display = 'block'; // Ensure heading is visible
            }
            
            // Generate iframe HTML for the featured song
            singleVideoEmbedContainer.innerHTML = createVideoIframeHtml(
                { type: 'youtube', url: featuredSong.videoId }, // Assume YouTube for now, refine if needed
                artist.name
            );
            singleVideoEmbedContainer.style.display = 'block'; // Show single video wrapper

            if (videoEmbedsContainer) videoEmbedsContainer.style.display = 'block'; // Show main container
            if (videoTabsContainer) videoTabsContainer.style.display = 'none'; // Ensure tabs are hidden
            const embed2 = document.getElementById('modal-video-embed-2'); // Hide second generic embed
            if (embed2) embed2.style.display = 'none'; // Ensure it's hidden
        } else if (videoEmbedsContainer) {
            videoEmbedsContainer.style.display = 'none'; // Hide video section if no songs
        }

        // 4. Populate Footer CTAs (Spotify Logo Only + Other Social Icons)
        if (modalItemCta) modalItemCta.style.display = 'none'; // Hide default text CTA

        if (socialLinksContainer) {
            socialLinksContainer.innerHTML = ''; // Clear previous icon buttons
            let hasLinks = false;

            // Add Spotify CTA (primary) - LOGO ONLY
            if (artist.spotifyLink) {
                hasLinks = true;
                const spotifyButton = document.createElement('a');
                spotifyButton.href = artist.spotifyLink;
                spotifyButton.target = '_blank';
                spotifyButton.className = 'btn-social-icon-cta spotify-primary-logo-only'; // Class for logo-only CTA
                spotifyButton.setAttribute('aria-label', `Paminaw sa Spotify: ${artist.name}`);
                spotifyButton.title = `Paminaw sa Spotify`; // Tooltip
                spotifyButton.innerHTML = `<i class="${getPlatformIconClass('spotify')}"></i>`; // Spotify icon only
                socialLinksContainer.appendChild(spotifyButton);
            }

            // Add other social links (secondary, icon-only)
            const otherSocialPlatforms = ['youtube', 'facebook', 'instagram', 'tiktok', 'website']; 
            otherSocialPlatforms.forEach(platform => {
                if (artist.socialLinks && artist.socialLinks[platform]) { // Check if link exists
                    hasLinks = true;
                    const iconClass = getPlatformIconClass(platform);
                    
                    const socialButton = document.createElement('a');
                    socialButton.href = artist.socialLinks[platform];
                    socialButton.target = '_blank';
                    socialButton.className = `btn-social-icon-cta ${platform}`; // Add platform class
                    socialButton.setAttribute('aria-label', `Bisitaha ang ${artist.name} sa ${platform.charAt(0).toUpperCase() + platform.slice(1)}`);
                    socialButton.title = platform.charAt(0).toUpperCase() + platform.slice(1);
                    socialButton.innerHTML = `<i class="${iconClass}"></i>`; // Icon only
                    socialLinksContainer.appendChild(socialButton);
                }
            });

            if (hasLinks) {
                socialLinksContainer.style.display = 'flex'; // Show container
            } else {
                socialLinksContainer.style.display = 'none'; // Hide if no links
            }
        }

        window.BisayaModalCore.open();
    }

    // Expose the populate function
    window.BisayaMusicArtistModal = {
        populateAndShow: populateMusicArtistModal
    };
}

// Initialize when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeMusicArtistModalHandler);
} else {
    initializeMusicArtistModalHandler();
}