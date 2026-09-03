// Accessible podcast details for the shared Bisaya/Cebuano modal.
function initializePodcastModalHandler() {
    const modal = document.getElementById('bisaya-item-modal');
    const content = modal?.querySelector('.modal-content-bisaya');
    const closeButton = modal?.querySelector('.close-modal-bisaya');
    const image = document.getElementById('modal-item-image');
    const title = document.getElementById('modal-item-name');
    const body = document.getElementById('modal-item-long-desc');
    const cta = document.getElementById('modal-item-cta');
    const social = document.getElementById('modal-creator-social-actions');
    if (!modal || !content || !closeButton || !image || !title || !body) return;

    let previousFocus = null;
    const focusables = () => [...modal.querySelectorAll('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')];
    const close = () => {
        modal.style.display = 'none';
        modal.setAttribute('hidden', '');
        content.classList.remove('podcast-spotify-modal-theme');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
        if (previousFocus?.isConnected) previousFocus.focus();
    };
    const open = (podcast) => {
        if (!podcast) return;
        previousFocus = document.activeElement;
        content.classList.remove('creator-modal-theme');
        content.classList.add('podcast-spotify-modal-theme');
        image.src = podcast.coverSrc || 'images/podcasts/bisaya_podcasts_ph_cover.jpg';
        image.alt = podcast.altText || podcast.title;
        image.width = 640; image.height = 640;
        title.textContent = podcast.title;
        const platformLabels = {
            spotify: 'Paminaw sa Spotify',
            apple: 'Paminaw sa Apple Podcasts',
            youtube: 'Tan-awa sa YouTube',
            pocketcasts: 'Paminaw sa Pocket Casts',
            pocketCasts: 'Paminaw sa Pocket Casts',
            website: 'Bisitaha ang opisyal nga website'
        };
        const links = Object.entries(podcast.platformLinks || {}).filter(([, href]) => href).map(([platform, href]) => {
            const label = platformLabels[platform] || `Opisyal nga ${platform}`;
            return `<a class="podcast-modal-link" href="${href}" target="_blank" rel="noopener noreferrer" aria-label="${label} para sa ${podcast.title}">${label} ↗</a>`;
        }).join('');
        body.innerHTML = `<p>${podcast.longDesc || podcast.shortDesc || ''}</p>${podcast.guidance ? `<h4>Giunsa pagpaminaw</h4><p>${podcast.guidance}</p>` : ''}${links ? `<div class="podcast-modal-links" aria-label="Mga opisyal nga link">${links}</div>` : '<p class="podcast-modal-unavailable">Wala pay nakumpirmang opisyal nga link sa pagpaminaw.</p>'}`;
        if (cta) cta.style.display = 'none';
        if (social) social.style.display = 'none';
        modal.removeAttribute('hidden');
        modal.style.display = 'flex';
        document.body.classList.add('modal-open');
        document.body.style.overflow = 'hidden';
        closeButton.focus();
    };

    closeButton.addEventListener('click', close);
    modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
    modal.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') { event.preventDefault(); close(); return; }
        if (event.key !== 'Tab') return;
        const items = focusables(); if (!items.length) return;
        const first = items[0]; const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
    window.BisayaPodcastModal = { populateAndShow: open, close };
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializePodcastModalHandler);
else initializePodcastModalHandler();
