// js/bisaya-top-picks-loader.js

function initializeTopPicks() { // This is the main function called by page-loader
    console.log("BISAYA TOP PICKS LOADER: Initializing Top Picks and Spotlights...");

    const collabsGridEl = document.getElementById('chito-melai-collabs-grid');

    // --- 1. Populate Chito & Melai Collabs ---
    function populateCollabsSection() {
        if (!collabsGridEl) {
            console.warn("BISAYA TOP PICKS: Collabs grid element #chito-melai-collabs-grid not found.");
            return;
        }
        if (typeof chitoMelaiCollabs !== 'undefined' && Array.isArray(chitoMelaiCollabs) && chitoMelaiCollabs.length > 0) {
            let collabsHTML = '';
            chitoMelaiCollabs.forEach(collab => {
                if (!collab || !collab.videoId) {
                    console.warn("BISAYA TOP PICKS: Skipping invalid collab data:", collab);
                    return;
                }
                collabsHTML += `
                    <a href="https://www.youtube.com/watch?v=${collab.videoId}" target="_blank" class="collab-video-card" title="Watch: ${collab.title || 'Collaboration Video'}">
                        <img src="${collab.thumbnailUrl || 'images/placeholder_youtube.jpg'}" alt="${collab.title || 'Collaboration Video Thumbnail'}" class="collab-thumbnail">
                        <div class="collab-video-info">
                            <div><div class="collab-title">${collab.title || 'Collaboration Title'}</div><div class="collab-platform">On: ${collab.platform || 'YouTube'}</div></div>
                            <div class="collab-duration"><i class="fas fa-clock"></i> ${collab.duration || ''}</div>
                        </div>
                    </a>`;
            });
            collabsGridEl.innerHTML = collabsHTML;
            console.log("BISAYA TOP PICKS: Chito & Melai collabs rendered.");
        } else {
            if (collabsGridEl) collabsGridEl.innerHTML = "<p class='text-center full-width-message'>Wala pay collab videos nga ma-display.</p>";
            console.warn("BISAYA TOP PICKS: chitoMelaiCollabs data not found or empty.");
        }
    }

    // --- 2. Function to Setup Individual Spotlight Player & Playlist ---
    function setupSpotlightPlayer(spotlightIdPrefix, creatorData) {
        const mainVideoPlayerEl = document.getElementById(`${spotlightIdPrefix}-featured-video-player`);
        const mainVideoTitleEl = document.getElementById(`${spotlightIdPrefix}-featured-video-title`);
        const miniPlaylistEl = document.getElementById(`${spotlightIdPrefix}-mini-playlist`);
        const fullPlaylistLinkEl = document.getElementById(`${spotlightIdPrefix}-full-playlist-link`);
        const spotlightArticleEl = document.getElementById(`${spotlightIdPrefix}-samontina-spotlight`) || document.getElementById(`${spotlightIdPrefix}-spotlight`);

        if (!mainVideoPlayerEl || !mainVideoTitleEl || !miniPlaylistEl || !fullPlaylistLinkEl) {
            console.warn(`BISAYA SPOTLIGHT: Missing HTML elements for spotlight: ${spotlightIdPrefix}. Check IDs like '${spotlightIdPrefix}-featured-video-player'.`);
            if(spotlightArticleEl && !creatorData) spotlightArticleEl.innerHTML = `<p class="text-center full-width-message">Spotlight content for ${spotlightIdPrefix} coming soon.</p>`;
            return;
        }
        if (!creatorData) {
             console.warn(`BISAYA SPOTLIGHT: Missing creator data for spotlight: ${spotlightIdPrefix}`);
             if (spotlightArticleEl) spotlightArticleEl.innerHTML = `<p class="text-center full-width-message">Spotlight data for ${spotlightIdPrefix} not available.</p>`;
             return;
        }

        let currentPlaylistItems = [...(creatorData.playlistHighlights || [])];
        let currentlyPlayingInMain = creatorData.mainFeaturedVideo ? { ...creatorData.mainFeaturedVideo } : null;

        function updateMainPlayer(video) {
            if (video && video.videoId) {
                // --- CRITICAL CHANGE HERE: autoplay=0 ---
                mainVideoPlayerEl.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${video.videoId}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1&controls=1" title="${video.title || 'Featured Video'}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
                mainVideoTitleEl.textContent = video.title || 'Video Title';
                currentlyPlayingInMain = { ...video };
            } else {
                 mainVideoPlayerEl.innerHTML = "<p class='text-center full-width-message'>Wala pay video nga ma-feature para diri.</p>";
                 mainVideoTitleEl.textContent = "Video Not Available";
            }
        }

        function renderMiniPlaylist() {
            if (!miniPlaylistEl) return; // Guard against missing element
            miniPlaylistEl.innerHTML = ''; 
            // const playlistIdParam = creatorData.fullPlaylistUrl ? creatorData.fullPlaylistUrl.split('list=')[1] : ''; // Not strictly needed if links are direct
            let itemsRendered = 0;

            currentPlaylistItems.forEach(vid => {
                if (itemsRendered >= 4) return; 
                if (!vid || !vid.videoId || (currentlyPlayingInMain && vid.videoId === currentlyPlayingInMain.videoId)) return; 

                const itemHTML = `
                    <a href="#" data-video-id="${vid.videoId}" data-video-title="${vid.title || 'Video Title'}" data-thumbnail-url="${vid.thumbnailUrl || 'images/placeholder_youtube_thumb.jpg'}" class="mini-playlist-item-sidebar" title="Play: ${vid.title || 'Video Title'}">
                        <img src="${vid.thumbnailUrl || 'images/placeholder_youtube_thumb.jpg'}" alt="${vid.title || 'Video Thumbnail'}" class="playlist-item-thumbnail">
                        <div class="playlist-item-details">
                            <span class="playlist-item-title">${vid.title || 'Video Title'}</span>
                            <span class="playlist-item-creator">${creatorData.name || 'Creator'}</span>
                        </div>
                    </a>
                `;
                miniPlaylistEl.insertAdjacentHTML('beforeend', itemHTML);
                itemsRendered++;
            });

             if(itemsRendered === 0 && miniPlaylistEl.innerHTML === '') {
                miniPlaylistEl.innerHTML = "<p class='text-center full-width-message' style='font-size:0.8rem;'>No other videos in preview.</p>";
            }

            miniPlaylistEl.querySelectorAll('.mini-playlist-item-sidebar').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    const newVideoId = item.dataset.videoId;
                    const newVideoTitle = item.dataset.videoTitle;
                    const newVideoThumbnail = item.dataset.thumbnailUrl;
                    if (!newVideoId) return;

                    const videoToPlay = { videoId: newVideoId, title: newVideoTitle, thumbnailUrl: newVideoThumbnail };
                    const videoThatWasPlaying = currentlyPlayingInMain ? { ...currentlyPlayingInMain } : null;
                    updateMainPlayer(videoToPlay); // This will now load with autoplay=0

                    currentPlaylistItems = currentPlaylistItems.filter(v => v.videoId !== newVideoId);
                    if (videoThatWasPlaying && videoThatWasPlaying.videoId) {
                        if (!currentPlaylistItems.slice(0,5).find(v => v.videoId === videoThatWasPlaying.videoId)) {
                             currentPlaylistItems.unshift(videoThatWasPlaying);
                        }
                    }
                    renderMiniPlaylist(); 
                });
            });
        }

        // Initial setup
        if (currentlyPlayingInMain && currentlyPlayingInMain.videoId) {
            updateMainPlayer(currentlyPlayingInMain); // Loads initial video with autoplay=0
        } else if (Array.isArray(creatorData.playlistHighlights) && creatorData.playlistHighlights.length > 0) {
            updateMainPlayer(creatorData.playlistHighlights[0]); // Loads initial video with autoplay=0
            currentPlaylistItems = creatorData.playlistHighlights.slice(1);
        } else {
            updateMainPlayer(null); 
        }
        renderMiniPlaylist();

        if (fullPlaylistLinkEl && creatorData.fullPlaylistUrl) {
            fullPlaylistLinkEl.href = creatorData.fullPlaylistUrl;
        } else if (fullPlaylistLinkEl) {
            fullPlaylistLinkEl.style.display = 'none'; 
        }
        console.log(`BISAYA SPOTLIGHT: ${creatorData.name || spotlightIdPrefix} spotlight populated and player initialized (autoplay disabled).`);
    }


    // --- Initialize Top Picks Sections ---
    populateCollabsSection();

    if (typeof bisayaCreators !== 'undefined' && Array.isArray(bisayaCreators)) {
        const chitoData = bisayaCreators.find(c => c.id === 'chito-samontina');
        const melaiData = bisayaCreators.find(c => c.id === 'kuan-on-one-melai');

        if (chitoData) setupSpotlightPlayer('chito', chitoData);
        else console.warn("BISAYA TOP PICKS: Chito Samontina data not found for spotlight.");

        if (melaiData) setupSpotlightPlayer('melai', melaiData);
        else console.warn("BISAYA TOP PICKS: Kuan on One (Melai) data not found for spotlight.");
    } else {
        console.error("BISAYA TOP PICKS: bisayaCreators array not found. Spotlights cannot be initialized.");
    }
}

// This function initializeTopPicks() will be called by bisaya-page-loader.js