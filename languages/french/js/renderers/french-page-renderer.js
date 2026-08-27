document.addEventListener('DOMContentLoaded', () => {
    const main = document.getElementById('main-content');
    const creatorLibrary = document.getElementById('bibliotheque');
    const frenchPlaylist = document.getElementById('playlist-francais');
    if (main && creatorLibrary && frenchPlaylist) {
        main.insertBefore(creatorLibrary, frenchPlaylist);
    }

    const creatorContainer = creatorLibrary?.querySelector('.container-fr');
    const creatorBrowser = creatorLibrary?.querySelector('.curated-channel-browser-fr');
    const creatorHeading = creatorLibrary?.querySelector('.curated-library-heading-fr');
    if (creatorContainer && creatorBrowser && creatorHeading) {
        creatorContainer.insertBefore(creatorBrowser, creatorHeading);
    }

    if (window.location.hash) {
        const anchorId = decodeURIComponent(window.location.hash.slice(1));
        window.requestAnimationFrame(() => {
            document.getElementById(anchorId)?.scrollIntoView({ block: 'start' });
        });
    }

    const extraHeading = document.getElementById('extra-heading-fr');
    const extraSummary = document.getElementById('extra-summary-copy-fr');
    if (window.extraFrenchPlaylistData) {
        if (extraHeading) {
            extraHeading.textContent = window.extraFrenchPlaylistData.title;
        }

        if (extraSummary) {
            extraSummary.textContent = window.extraFrenchPlaylistData.summary;
        }
    }

    if (typeof window.renderFrenchCuratedChannels === 'function') {
        window.renderFrenchCuratedChannels();
    }

    if (typeof window.renderFrenchResources === 'function') {
        window.renderFrenchResources();
    }

    if (typeof window.renderFrenchPlaylists === 'function') {
        window.renderFrenchPlaylists();
    }
});
