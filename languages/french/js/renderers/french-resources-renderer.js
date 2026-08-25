function renderFrenchResources() {
    const data = window.frenchResourcesData;
    const spotlightContainer = document.getElementById('resource-stack-fr');
    const shelfContainer = document.getElementById('shelf-zone-fr');

    if (!data || !spotlightContainer || !shelfContainer) {
        return;
    }

    const escapeHtml = value =>
        String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    const isExternalLink = href => /^https?:\/\//i.test(href);

    const renderAction = action => {
        const externalAttributes = isExternalLink(action.href)
            ? ' target="_blank" rel="noopener noreferrer"'
            : '';
        const variant = action.variant === 'secondary' ? 'secondary' : 'primary';

        return `<a class="btn-fr ${variant}" href="${escapeHtml(action.href)}"${externalAttributes}>${escapeHtml(action.label)}</a>`;
    };

    const renderSpotlightBadge = spotlight => {
        if (spotlight.logoSrc) {
            return `<img src="${escapeHtml(spotlight.logoSrc)}" alt="${escapeHtml(spotlight.logoAlt)}" loading="lazy" decoding="async">`;
        }

        if (spotlight.flagBadge) {
            return '<span class="spotlight-logo-mark flag-fr-mark" aria-hidden="true"></span>';
        }

        return `<span class="spotlight-logo-mark" aria-hidden="true">${escapeHtml(spotlight.badge)}</span>`;
    };

    spotlightContainer.innerHTML = data.spotlights
        .map(
            spotlight => `
                <article class="glass-card spotlight-fr${spotlight.reverse ? ' reverse' : ''}" id="${escapeHtml(spotlight.id)}">
                    <div class="spotlight-visual">
                        <img src="${escapeHtml(spotlight.imageSrc)}" alt="${escapeHtml(spotlight.imageAlt)}" loading="lazy" decoding="async">
                        <div class="spotlight-logo-pill">
                            ${renderSpotlightBadge(spotlight)}
                            <span>${escapeHtml(spotlight.name)}</span>
                        </div>
                    </div>
                    <div class="spotlight-copy">
                        <h3>${escapeHtml(spotlight.name)}</h3>
                        ${spotlight.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}
                        <div class="offering-list" role="group" aria-label="Points forts">
                            ${spotlight.tags.map(tag => `<span class="offering-chip">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                        <div class="action-row">
                            ${spotlight.actions.map(renderAction).join('')}
                        </div>
                    </div>
                </article>
            `,
        )
        .join('');

    shelfContainer.innerHTML = data.shelves
        .map(
            shelf => `
                <article class="glass-card content-shelf-fr" id="${escapeHtml(shelf.id)}">
                    <h3><i class="${escapeHtml(shelf.icon)}" aria-hidden="true"></i> ${escapeHtml(shelf.title)}</h3>
                    <div class="shelf-container-fr" role="group" aria-label="${escapeHtml(shelf.title)}">
                        ${shelf.cards
                            .map(card => {
                                const externalAttributes = isExternalLink(card.href)
                                    ? ' target="_blank" rel="noopener noreferrer"'
                                    : '';

                                return `
                                    <article class="shelf-card-fr">
                                        <img src="${escapeHtml(card.imageSrc)}" alt="${escapeHtml(card.imageAlt)}" loading="lazy" decoding="async">
                                        <div class="shelf-card-body">
                                            <span class="shelf-badge">${escapeHtml(card.badge)}</span>
                                            <h4>${escapeHtml(card.title)}</h4>
                                            <p>${escapeHtml(card.description)}</p>
                                            <a class="mini-link" href="${escapeHtml(card.href)}"${externalAttributes}>${escapeHtml(card.linkLabel)} <span aria-hidden="true">→</span></a>
                                        </div>
                                    </article>
                                `;
                            })
                            .join('')}
                    </div>
                </article>
            `,
        )
        .join('');
}

window.renderFrenchResources = renderFrenchResources;
