document.addEventListener('DOMContentLoaded', () => {
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
