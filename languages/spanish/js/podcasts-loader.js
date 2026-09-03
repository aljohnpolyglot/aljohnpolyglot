/* Compact Spanish podcast shelf + accessible details dialog. */
document.addEventListener('DOMContentLoaded', () => {
    const shelf = document.getElementById('shelf-podcasts');
    const modal = document.getElementById('podcast-modal');
    const content = document.getElementById('podcast-modal-content');
    if (!shelf || !modal || !content || !Array.isArray(window.spanishPodcasts) || typeof creatorsData === 'undefined') return;

    const records = window.spanishPodcasts.map(meta => {
        const source = creatorsData.find(creator => creator.id === meta.id);
        if (!source) return null;
        return { ...source, ...meta, title: source.name, image: source.profilePic, levels: source.cefr || [] };
    }).filter(Boolean);
    if (!records.length) return;

    let activeTrigger = null;
    let previousOverflow = '';
    const focusables = () => [...modal.querySelectorAll('button, a[href], iframe, [tabindex]:not([tabindex="-1"])')].filter(el => !el.disabled && el.offsetParent !== null);

    const makeCard = record => {
        const item = document.createElement('article');
        item.className = 'podcast-card';
        item.setAttribute('role', 'listitem');
        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'podcast-card-trigger';
        trigger.setAttribute('aria-label', `Ver detalles de ${record.title}`);
        trigger.setAttribute('aria-haspopup', 'dialog');
        trigger.setAttribute('aria-controls', 'podcast-modal');
        const image = document.createElement('img');
        image.src = record.image;
        image.alt = `Portada de ${record.title}`;
        image.width = 480;
        image.height = 480;
        image.loading = 'lazy';
        image.decoding = 'async';
        image.addEventListener('error', () => { image.onerror = null; image.src = 'images/creators/creator-fallback.svg'; });
        const body = document.createElement('span');
        body.className = 'podcast-card-body';
        const title = document.createElement('strong');
        title.className = 'podcast-card-title';
        title.textContent = record.title;
        const metaLine = document.createElement('span');
        metaLine.className = 'podcast-card-meta';
        const levels = Array.isArray(record.levels) ? record.levels : String(record.cefr || '').split(/[–—,\s]+/).filter(Boolean);
        metaLine.textContent = `${record.publisher || record.type} · ${levels.join('–')}`;
        const format = document.createElement('span');
        format.className = 'podcast-card-format';
        format.textContent = record.format || record.type;
        const action = document.createElement('span');
        action.className = 'podcast-card-action';
        action.textContent = 'Ver detalles →';
        body.append(title, metaLine, format, action);
        trigger.append(image, body);
        trigger.addEventListener('click', () => openModal(record, trigger));
        item.append(trigger);
        return item;
    };

    const openModal = (record, trigger) => {
        activeTrigger = trigger;
        content.replaceChildren();
        const layout = document.createElement('div');
        layout.className = 'podcast-modal-layout';
        const image = document.createElement('img');
        image.src = record.image;
        image.alt = `Portada de ${record.title}`;
        image.width = 640;
        image.height = 640;
        image.loading = 'eager';
        image.addEventListener('error', () => { image.onerror = null; image.src = 'images/creators/creator-fallback.svg'; });
        const detail = document.createElement('div');
        detail.className = 'podcast-modal-details';
        const title = document.createElement('h2');
        title.id = 'podcast-modal-title';
        title.textContent = record.title;
        const meta = document.createElement('p');
        meta.className = 'podcast-modal-meta';
        const levels = Array.isArray(record.levels) ? record.levels : String(record.cefr || '').split(/[–—,\s]+/).filter(Boolean);
        meta.textContent = `${record.publisher || record.type} · ${record.format || record.type} · ${levels.join('–')}`;
        const description = document.createElement('p');
        description.id = 'podcast-modal-description';
        description.textContent = record.longDesc || record.shortDesc || '';
        const guidanceHeading = document.createElement('h3');
        guidanceHeading.textContent = 'Guía de escucha';
        const guidance = document.createElement('p');
        guidance.id = 'podcast-modal-guidance';
        guidance.textContent = record.guidance || 'Escucha un episodio sobre un tema conocido y ajusta la velocidad según necesites.';
        detail.append(title, meta, description, guidanceHeading, guidance);
        if (record.aljohnsComment) {
            const note = document.createElement('p');
            note.className = 'podcast-modal-note';
            note.textContent = record.aljohnsComment;
            detail.append(note);
        }
        const links = document.createElement('div');
        links.className = 'podcast-modal-links';
        const linkData = Array.isArray(record.links) ? record.links : Object.entries(record.socialLinks || {}).map(([platform, url]) => ({ label: platform, url }));
        linkData.filter(link => link && link.url).forEach(link => {
            const anchor = document.createElement('a');
            anchor.href = link.url;
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            anchor.textContent = `${link.label || 'Escuchar'} ↗`;
            links.append(anchor);
        });
        if (links.children.length) detail.append(links);
        const media = document.createElement('div');
        media.className = 'podcast-modal-media';
        if (record.embeddedId) {
            const iframe = document.createElement('iframe');
            iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(record.embeddedId)}`;
            iframe.title = `Muestra de ${record.title}`;
            iframe.loading = 'lazy';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            media.append(iframe);
        } else {
            const unavailable = document.createElement('p');
            unavailable.textContent = 'No hay una muestra pública verificada para este podcast.';
            media.append(unavailable);
        }
        layout.append(image, detail, media);
        content.append(layout);
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        previousOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        modal.querySelector('.podcast-modal-close').focus();
    };

    const closeModal = () => {
        if (modal.classList.contains('hidden')) return;
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = previousOverflow;
        activeTrigger?.focus();
        activeTrigger = null;
    };

    records.forEach(record => shelf.append(makeCard(record)));
    modal.querySelectorAll('[data-podcast-modal-close]').forEach(button => button.addEventListener('click', closeModal));
    document.addEventListener('keydown', event => {
        if (modal.classList.contains('hidden')) return;
        if (event.key === 'Escape') closeModal();
        if (event.key === 'Tab') {
            const items = focusables();
            if (!items.length) return;
            const first = items[0], last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    });
    shelf.addEventListener('keydown', event => {
        if (event.key === 'Home' || event.key === 'End') {
            event.preventDefault();
            shelf.scrollTo({ left: event.key === 'Home' ? 0 : shelf.scrollWidth, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
        }
    });
});
