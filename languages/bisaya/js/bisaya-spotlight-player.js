// js/bisaya-spotlight-player.js
function setupSpotlightPlayer(spotlightIdPrefix, creatorData) {
    const mainVideoPlayerEl = document.getElementById(`${spotlightIdPrefix}-featured-video-player`);
    const mainVideoTitleEl = document.getElementById(`${spotlightIdPrefix}-featured-video-title`);
    const miniPlaylistEl = document.getElementById(`${spotlightIdPrefix}-mini-playlist`);
    const fullPlaylistLinkEl = document.getElementById(`${spotlightIdPrefix}-full-playlist-link`);
    const spotlightArticleEl = document.getElementById(`${spotlightIdPrefix}-samontina-spotlight`) || document.getElementById(`${spotlightIdPrefix}-spotlight`); // For fallback

    if (!mainVideoPlayerEl || !mainVideoTitleEl || !miniPlaylistEl || !fullPlaylistLinkEl || !creatorData) {
        console.warn(`BISAYA SPOTLIGHT: Missing elements or data for spotlight: ${spotlightIdPrefix}`);
        if (spotlightArticleEl) {
            spotlightArticleEl.innerHTML = `<p class="text-center full-width-message">${creatorData ? (creatorData.name || "Spotlight") : 'Spotlight'} content coming soon.</p>`;
        }
        return;
    }

    let currentPlaylistItems = [...(creatorData.playlistHighlights || [])];
    let currentlyPlayingInMain = creatorData.mainFeaturedVideo ? { ...creatorData.mainFeaturedVideo } : null;

    function updateMainPlayer(video) {
        if (video && video.videoId) {
            mainVideoPlayerEl.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0" title="${video.title || 'Featured Video'}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
            mainVideoTitleEl.textContent = video.title || 'Video Title';
            currentlyPlayingInMain = { ...video };
        } else {
             mainVideoPlayerEl.innerHTML = "<p class='text-center full-width-message'>Wala pay video nga ma-feature para diri.</p>";
             mainVideoTitleEl.textContent = "Video Not Available";
        }
    }

    function renderMiniPlaylist() {
        miniPlaylistEl.innerHTML = ''; // Clear existing items
        const playlistIdParam = creatorData.fullPlaylistUrl ? creatorData.fullPlaylistUrl.split('list=')[1] : '';
        let itemsRendered = 0;

        currentPlaylistItems.forEach(vid => {
            if (itemsRendered >= 4) return; // Limit to 4 items
            if (!vid || !vid.videoId || (currentlyPlayingInMain && vid.videoId === currentlyPlayingInMain.videoId)) return; // Don't show currently playing in sidebar

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

        if (itemsRendered === 0 && miniPlaylistEl.innerHTML === '') {
            miniPlaylistEl.innerHTML = "<p class='text-center full-width-message' style='font-size:0.8rem;'>No other videos in preview.</p>";
        }

        // Add event listeners to newly rendered playlist items
        miniPlaylistEl.querySelectorAll('.mini-playlist-item-sidebar').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const newVideoId = item.dataset.videoId;
                const newVideoTitle = item.dataset.videoTitle;
                const newVideoThumbnail = item.dataset.thumbnailUrl;

                if (!newVideoId) return;

                const videoToPlay = { videoId: newVideoId, title: newVideoTitle, thumbnailUrl: newVideoThumbnail };
                const videoThatWasPlaying = currentlyPlayingInMain ? { ...currentlyPlayingInMain } : null;

                updateMainPlayer(videoToPlay);

                // Update playlist: remove played, add old main video back if it existed
                currentPlaylistItems = currentPlaylistItems.filter(v => v.videoId !== newVideoId);
                if (videoThatWasPlaying && videoThatWasPlaying.videoId) {
                    // Add to top only if it's not already in the first 4-5 (to avoid quick duplication)
                    if (!currentPlaylistItems.slice(0,5).find(v => v.videoId === videoThatWasPlaying.videoId)) {
                         currentPlaylistItems.unshift(videoThatWasPlaying);
                    }
                }
                renderMiniPlaylist(); // Re-render sidebar playlist
            });
        });
    }

    // Initial setup
    if (currentlyPlayingInMain && currentlyPlayingInMain.videoId) {
        updateMainPlayer(currentlyPlayingInMain);
    } else if (Array.isArray(creatorData.playlistHighlights) && creatorData.playlistHighlights.length > 0) {
        // Play first from highlights if no specific main featured video
        updateMainPlayer(creatorData.playlistHighlights[0]);
        // Remove the played one from the start of the list for initial sidebar render
        currentPlaylistItems = creatorData.playlistHighlights.slice(1);
    } else {
        updateMainPlayer(null); // Show "video not available"
    }

    renderMiniPlaylist();

    if (fullPlaylistLinkEl && creatorData.fullPlaylistUrl) {
        fullPlaylistLinkEl.href = creatorData.fullPlaylistUrl;
    } else if (fullPlaylistLinkEl) {
        fullPlaylistLinkEl.style.display = 'none'; // Hide if no URL
    }
    console.log(`BISAYA SPOTLIGHT: ${creatorData.name || spotlightIdPrefix} spotlight populated and player initialized.`);
}