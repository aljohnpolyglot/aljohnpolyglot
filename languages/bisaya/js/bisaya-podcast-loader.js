// Compact podcast shelf shared by the Bisaya and Cebuano routes.
function initializePodcastSection() {
    const shelf = document.getElementById('podcast-scroll-wrapper');
    if (!shelf || typeof bisayaPodcasts === 'undefined') return;
    shelf.setAttribute('role', 'list');
    shelf.setAttribute('aria-label', 'Mga podcast nga Bisaya');
    shelf.innerHTML = bisayaPodcasts.filter(Boolean).map((podcast) => `
        <article class="podcast-shelf-item" role="listitem">
            <button class="podcast-card-spotify" type="button" data-id="${podcast.id}" aria-label="Tan-awa ang detalye sa ${podcast.title}" aria-haspopup="dialog" aria-controls="bisaya-item-modal">
                <img class="podcast-card-cover" src="${podcast.coverSrc || 'images/podcasts/bisaya_podcasts_ph_cover.jpg'}" alt="${podcast.altText || `Sampol sa ${podcast.title}`}" width="640" height="640" loading="lazy" onerror="this.onerror=null;this.src='images/podcasts/bisaya_podcasts_ph_cover.jpg';">
                <span class="podcast-card-copy">
                    <strong>${podcast.title}</strong>
                    <span>${podcast.publisher || podcast.format || 'Podcast Bisaya'}</span>
                    <span class="podcast-card-cefr">${podcast.cefr || 'B1–C1'}</span>
                    <span class="podcast-card-details">Tan-awa detalye <span aria-hidden="true">→</span></span>
                </span>
            </button>
        </article>`).join('');

    const previous = document.getElementById('podcast-previous');
    const next = document.getElementById('podcast-next');
    const scrollByCard = (direction) => shelf.scrollBy({ left: direction * Math.max(240, shelf.clientWidth * 0.8), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    previous?.addEventListener('click', () => scrollByCard(-1));
    next?.addEventListener('click', () => scrollByCard(1));
    shelf.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight') { event.preventDefault(); scrollByCard(1); }
        if (event.key === 'ArrowLeft') { event.preventDefault(); scrollByCard(-1); }
        if (event.key === 'Home') { event.preventDefault(); shelf.scrollTo({ left: 0, behavior: 'auto' }); }
        if (event.key === 'End') { event.preventDefault(); shelf.scrollTo({ left: shelf.scrollWidth, behavior: 'auto' }); }
    });
}
