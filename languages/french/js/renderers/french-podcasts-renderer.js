function renderFrenchPodcasts() {
    const podcasts = window.frenchPodcastsData;
    const shelf = document.getElementById('french-podcasts-shelf-fr');
    const previousButton = document.getElementById('french-podcasts-prev-fr');
    const nextButton = document.getElementById('french-podcasts-next-fr');

    if (!shelf || !previousButton || !nextButton) return;

    const escapeHtml = value =>
        String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    if (!Array.isArray(podcasts) || podcasts.length === 0) {
        shelf.innerHTML = '<li class="french-podcasts-empty-fr">Le rayon audio est momentanément indisponible.</li>';
        previousButton.disabled = true;
        nextButton.disabled = true;
        return;
    }

    shelf.innerHTML = podcasts
        .map(
            podcast => `
                <li class="french-podcast-item-fr">
                    <article class="french-podcast-fiche-fr" aria-labelledby="french-podcast-${escapeHtml(podcast.id)}-title">
                        <div class="french-podcast-cover-fr">
                            <img src="${escapeHtml(podcast.coverImage)}" alt="${escapeHtml(podcast.coverAlt)}" width="480" height="480" loading="lazy" decoding="async">
                            <span class="french-podcast-cover-fallback-fr" hidden aria-hidden="true">${escapeHtml(podcast.title)}</span>
                        </div>
                        <div class="french-podcast-copy-fr">
                            <p class="french-podcast-format-fr">${escapeHtml(podcast.format)}</p>
                            <h3 id="french-podcast-${escapeHtml(podcast.id)}-title">${escapeHtml(podcast.title)}</h3>
                            <p class="french-podcast-publisher-fr">${escapeHtml(podcast.publisher)}</p>
                            <p class="french-podcast-level-fr">CECR · ${escapeHtml(podcast.levels.join('–'))}</p>
                            <p class="french-podcast-description-fr">${escapeHtml(podcast.description)}</p>
                            <div class="french-podcast-guidance-fr">
                                <strong>Repère d’écoute</strong>
                                <p>${escapeHtml(podcast.guidance)}</p>
                            </div>
                            <div class="french-podcast-links-fr">
                                ${podcast.links
                                    .map(
                                        link => `
                                            <a href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer">
                                                <i class="${escapeHtml(link.icon)}" aria-hidden="true"></i>
                                                <span>${escapeHtml(link.label)}</span>
                                            </a>
                                        `,
                                    )
                                    .join('')}
                            </div>
                        </div>
                    </article>
                </li>
            `,
        )
        .join('');

    shelf.querySelectorAll('.french-podcast-cover-fr').forEach(cover => {
        const image = cover.querySelector('img');
        const fallback = cover.querySelector('.french-podcast-cover-fallback-fr');
        if (!image || !fallback) return;

        const revealFallback = () => {
            image.hidden = true;
            fallback.hidden = false;
        };

        image.addEventListener('error', revealFallback, { once: true });
        if (image.complete && image.naturalWidth === 0) revealFallback();
    });

    const updateControls = () => {
        const maximumScroll = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
        previousButton.disabled = shelf.scrollLeft <= 4;
        nextButton.disabled = shelf.scrollLeft >= maximumScroll - 4;
    };

    const scrollShelf = direction => {
        const firstCard = shelf.querySelector('.french-podcast-item-fr');
        const gap = Number.parseFloat(window.getComputedStyle(shelf).columnGap) || 16;
        const step = firstCard ? firstCard.getBoundingClientRect().width + gap : shelf.clientWidth * 0.82;
        shelf.scrollBy({
            left: direction * step,
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
    };

    previousButton.addEventListener('click', () => scrollShelf(-1));
    nextButton.addEventListener('click', () => scrollShelf(1));
    shelf.addEventListener('scroll', updateControls, { passive: true });
    window.addEventListener('resize', updateControls, { passive: true });
    window.requestAnimationFrame(updateControls);
}

window.renderFrenchPodcasts = renderFrenchPodcasts;
