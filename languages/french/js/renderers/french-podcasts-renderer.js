function renderFrenchPodcasts() {
    const podcasts = window.frenchPodcastsData;
    const shelf = document.getElementById('french-podcasts-shelf-fr');
    const previousButton = document.getElementById('french-podcasts-prev-fr');
    const nextButton = document.getElementById('french-podcasts-next-fr');
    const modal = document.getElementById('french-podcast-modal-fr');
    const dialog = modal?.querySelector('.french-podcast-modal-dialog-fr');
    const closeButton = document.getElementById('french-podcast-modal-close-fr');
    const content = document.getElementById('french-podcast-modal-content-fr');

    if (!shelf || !previousButton || !nextButton || !modal || !dialog || !closeButton || !content) return;

    const escapeHtml = value => String(value ?? '')
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

    const state = { trigger: null, active: null };
    shelf.innerHTML = podcasts.map(podcast => `
        <li class="french-podcast-item-fr">
            <button class="french-podcast-card-fr" type="button" data-french-podcast-id="${escapeHtml(podcast.id)}" aria-haspopup="dialog" aria-controls="french-podcast-modal-fr" aria-label="Ouvrir la fiche de ${escapeHtml(podcast.title)}">
                <span class="french-podcast-cover-fr">
                    <img src="${escapeHtml(podcast.coverImage)}" alt="${escapeHtml(podcast.coverAlt)}" width="480" height="480" loading="lazy" decoding="async">
                    <span class="french-podcast-cover-fallback-fr" hidden aria-hidden="true">${escapeHtml(podcast.title)}</span>
                </span>
                <span class="french-podcast-copy-fr">
                    <span class="french-podcast-publisher-fr">${escapeHtml(podcast.publisher)}</span>
                    <strong>${escapeHtml(podcast.title)}</strong>
                    <span class="french-podcast-format-fr">${escapeHtml(podcast.format)}</span>
                    <span class="french-podcast-level-fr">CECR · ${escapeHtml((podcast.levels || []).join('–'))}</span>
                    <span class="french-podcast-details-fr">Voir la fiche <span aria-hidden="true">→</span></span>
                </span>
            </button>
        </li>
    `).join('');

    shelf.querySelectorAll('.french-podcast-cover-fr').forEach(cover => {
        const image = cover.querySelector('img');
        const fallback = cover.querySelector('.french-podcast-cover-fallback-fr');
        if (!image || !fallback) return;
        const fallbackImage = () => { image.hidden = true; fallback.hidden = false; };
        image.addEventListener('error', fallbackImage, { once: true });
        if (image.complete && image.naturalWidth === 0) fallbackImage();
    });

    const renderModal = podcast => {
        const personalNote = podcast.personalComment || podcast.aljohnComment;
        content.innerHTML = `
            <div class="french-podcast-modal-layout-fr">
                <div class="french-podcast-modal-cover-fr">
                    <img src="${escapeHtml(podcast.coverImage)}" alt="${escapeHtml(podcast.coverAlt)}" width="480" height="480" loading="lazy" decoding="async">
                    <span class="french-podcast-cover-fallback-fr" hidden aria-hidden="true">${escapeHtml(podcast.title)}</span>
                </div>
                <div class="french-podcast-modal-copy-fr">
                    <p class="french-podcast-modal-kicker-fr">${escapeHtml(podcast.format)}</p>
                    <h2 id="french-podcast-modal-title-fr">${escapeHtml(podcast.title)}</h2>
                    <p class="french-podcast-modal-publisher-fr">${escapeHtml(podcast.publisher)}</p>
                    <p class="french-podcast-modal-level-fr">Niveau conseillé · ${escapeHtml((podcast.levels || []).join('–'))}</p>
                    <p id="french-podcast-modal-description-fr" class="french-podcast-modal-description-fr">${escapeHtml(podcast.description)}</p>
                    <div class="french-podcast-modal-guidance-fr">
                        <h3>Repère d’écoute</h3>
                        <p id="french-podcast-modal-guidance-fr">${escapeHtml(podcast.guidance)}</p>
                    </div>
                    ${personalNote ? `<aside class="french-podcast-modal-note-fr"><h3>Ma note</h3><p>${escapeHtml(personalNote)}</p></aside>` : ''}
                    <div class="french-podcast-modal-links-fr">
                        ${(podcast.links || []).map(link => `<a class="btn-fr primary" href="${escapeHtml(link.href)}" target="_blank" rel="noopener noreferrer"><i class="${escapeHtml(link.icon || 'fa-solid fa-arrow-up-right-from-square')}" aria-hidden="true"></i>${escapeHtml(link.label)}</a>`).join('')}
                    </div>
                </div>
            </div>
        `;
        const modalImage = content.querySelector('img');
        const modalFallback = content.querySelector('.french-podcast-cover-fallback-fr');
        if (modalImage && modalFallback) {
            const fallbackImage = () => { modalImage.hidden = true; modalFallback.hidden = false; };
            modalImage.addEventListener('error', fallbackImage, { once: true });
            if (modalImage.complete && modalImage.naturalWidth === 0) fallbackImage();
        }
    };

    const focusable = () => Array.from(dialog.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    const closeModal = () => {
        if (modal.hidden) return;
        modal.classList.remove('open');
        modal.hidden = true;
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('french-podcast-modal-open-fr');
        state.trigger?.focus();
        state.trigger = null;
        state.active = null;
    };
    const openModal = (podcast, trigger) => {
        state.trigger = trigger;
        state.active = podcast;
        renderModal(podcast);
        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('french-podcast-modal-open-fr');
        window.requestAnimationFrame(() => { modal.classList.add('open'); closeButton.focus(); });
    };

    shelf.addEventListener('click', event => {
        const trigger = event.target.closest('[data-french-podcast-id]');
        if (!trigger) return;
        const podcast = podcasts.find(item => item.id === trigger.dataset.frenchPodcastId);
        if (podcast) openModal(podcast, trigger);
    });
    modal.addEventListener('click', event => { if (event.target.closest('[data-french-podcast-modal-close]')) closeModal(); });
    closeButton.addEventListener('click', closeModal);
    document.addEventListener('keydown', event => {
        if (modal.hidden) return;
        if (event.key === 'Escape') { event.preventDefault(); closeModal(); return; }
        if (event.key !== 'Tab') return;
        const elements = focusable();
        if (!elements.length) { event.preventDefault(); dialog.focus(); return; }
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });

    const scrollShelf = direction => {
        const item = shelf.querySelector('.french-podcast-item-fr');
        const gap = Number.parseFloat(window.getComputedStyle(shelf).columnGap || window.getComputedStyle(shelf).gap) || 16;
        const step = item ? item.getBoundingClientRect().width + gap : shelf.clientWidth * 0.8;
        shelf.scrollBy({ left: direction * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    const updateControls = () => {
        const max = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
        previousButton.disabled = shelf.scrollLeft <= 4;
        nextButton.disabled = shelf.scrollLeft >= max - 4;
    };
    previousButton.addEventListener('click', () => scrollShelf(-1));
    nextButton.addEventListener('click', () => scrollShelf(1));
    shelf.addEventListener('scroll', updateControls, { passive: true });
    shelf.addEventListener('keydown', event => {
        if (event.key === 'ArrowLeft') { event.preventDefault(); scrollShelf(-1); }
        if (event.key === 'ArrowRight') { event.preventDefault(); scrollShelf(1); }
        if (event.key === 'Home') { event.preventDefault(); shelf.scrollTo({ left: 0, behavior: 'auto' }); }
        if (event.key === 'End') { event.preventDefault(); shelf.scrollTo({ left: shelf.scrollWidth, behavior: 'auto' }); }
    });
    window.addEventListener('resize', updateControls, { passive: true });
    window.requestAnimationFrame(updateControls);
}

window.renderFrenchPodcasts = renderFrenchPodcasts;
