document.addEventListener('DOMContentLoaded', () => {
    const storyToggle = document.getElementById('story-toggle');
    const storyHidden = document.getElementById('story-hidden');

    if (storyToggle && storyHidden) {
        storyToggle.addEventListener('click', () => {
            const isOpen = storyHidden.classList.toggle('open');
            storyToggle.textContent = isOpen ? 'Lire moins' : 'Lire plus';
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

    if (typeof renderFrenchPlaylists === 'function') {
        renderFrenchPlaylists();
    }
});
