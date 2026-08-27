function renderFrenchCuratedChannels() {
    const data = window.frenchCuratedChannelsData;
    const shelvesContainer = document.getElementById('curated-channel-shelves-fr');
    const filterContainer = document.getElementById('curated-filter-chips-fr');
    const searchInput = document.getElementById('curated-search-input-fr');
    const levelSelect = document.getElementById('curated-level-select-fr');
    const resultsStatus = document.getElementById('curated-results-status-fr');
    const emptyState = document.getElementById('curated-empty-state-fr');
    const resetButton = document.getElementById('curated-reset-fr');
    const modal = document.getElementById('curated-channel-modal-fr');
    const modalDialog = modal?.querySelector('.curated-channel-modal-dialog-fr');
    const modalCloseButton = document.getElementById('curated-modal-close-fr');

    if (
        !data
        || !Array.isArray(data.categories)
        || !Array.isArray(data.channels)
        || !shelvesContainer
        || !filterContainer
        || !searchInput
        || !levelSelect
        || !resultsStatus
        || !emptyState
        || !modal
        || !modalDialog
        || !modalCloseButton
    ) {
        return;
    }

    const categoryById = new Map(data.categories.map(category => [category.id, category]));
    const channelById = new Map(data.channels.map(channel => [channel.id, channel]));
    const cefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const state = {
        activeCategory: 'all',
        activeLevel: 'all',
        query: '',
        modalTrigger: null,
    };

    const normalise = value =>
        String(value ?? '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .trim();

    const getLevelRange = levels => {
        if (!Array.isArray(levels) || levels.length === 0) return 'Tous niveaux';
        if (levels.length === 1) return levels[0];
        return `${levels[0]}–${levels[levels.length - 1]}`;
    };

    const getLevelGuidance = levels => {
        if (levels.includes('A1')) {
            return 'Bon point de départ : appuie-toi sur les images, les répétitions et les sous-titres français.';
        }
        if (levels.includes('A2')) {
            return 'Idéal pour consolider l’écoute : cherche d’abord l’idée générale, puis relève quelques expressions.';
        }
        if (levels.includes('B1')) {
            return 'À ce niveau, utilise la chaîne comme immersion régulière et réduis progressivement les sous-titres.';
        }
        return 'Contenu natif exigeant : parfait pour travailler le débit, les nuances, l’argot et les références culturelles.';
    };

    const getProfilePlatform = channel => {
        if (channel.profilePlatform === 'instagram') {
            return { icon: 'fa-brands fa-instagram', label: 'Profil Instagram', className: 'instagram' };
        }
        return { icon: 'fa-brands fa-youtube', label: 'Chaîne YouTube', className: 'youtube' };
    };

    const matchesFilters = channel => {
        const queryTokens = normalise(state.query).split(/\s+/).filter(Boolean);
        const categoryText = channel.categories
            .map(categoryId => categoryById.get(categoryId)?.title || '')
            .join(' ');
        const searchText = normalise(
            `${channel.name} ${channel.shortDescription} ${channel.longDescription} ${categoryText}`,
        );
        const matchesQuery = queryTokens.length === 0
            || queryTokens.every(token => searchText.includes(token));
        const matchesLevel = state.activeLevel === 'all'
            || channel.levels.includes(state.activeLevel);
        const matchesCategory = state.activeCategory === 'all'
            || channel.categories.includes(state.activeCategory);

        return matchesQuery && matchesLevel && matchesCategory;
    };

    const renderFilters = () => {
        const filters = [
            { id: 'all', title: 'Tous les rayons', icon: 'fa-solid fa-border-all' },
            ...data.categories,
        ];

        filterContainer.replaceChildren();

        filters.forEach(filter => {
            const button = document.createElement('button');
            const isActive = filter.id === state.activeCategory;

            button.type = 'button';
            button.className = 'curated-filter-chip-fr';
            button.dataset.category = filter.id;
            button.setAttribute('aria-pressed', String(isActive));
            button.classList.toggle('active', isActive);
            button.innerHTML = `
                <i class="${filter.icon}" aria-hidden="true"></i>
                <span>${filter.title}</span>
            `;
            filterContainer.appendChild(button);
        });
    };

    const createChannelCard = channel => {
        const card = document.createElement('button');
        const visual = document.createElement('span');
        const image = document.createElement('img');
        const platform = document.createElement('span');
        const body = document.createElement('span');
        const meta = document.createElement('span');
        const category = document.createElement('span');
        const level = document.createElement('span');
        const title = document.createElement('strong');
        const description = document.createElement('span');
        const action = document.createElement('span');
        const primaryCategory = categoryById.get(channel.categories[0]);
        const profilePlatform = getProfilePlatform(channel);

        card.type = 'button';
        card.className = 'curated-channel-card-fr';
        card.dataset.channelId = channel.id;
        card.setAttribute('aria-haspopup', 'dialog');
        card.setAttribute('aria-label', `Voir la fiche de ${channel.name}`);

        visual.className = 'curated-channel-visual-fr';
        image.src = channel.profilePic;
        image.alt = channel.imageAlt || `Photo de la chaîne ${channel.name}`;
        image.loading = 'lazy';
        image.decoding = 'async';
        image.width = 220;
        image.height = 220;
        platform.className = 'curated-channel-platform-fr';
        platform.classList.add(profilePlatform.className);
        platform.setAttribute('aria-label', profilePlatform.label);
        platform.innerHTML = `<i class="${profilePlatform.icon}" aria-hidden="true"></i>`;
        visual.append(image, platform);

        body.className = 'curated-channel-card-body-fr';
        meta.className = 'curated-channel-card-meta-fr';
        category.className = 'curated-channel-category-fr';
        category.textContent = primaryCategory?.title || 'Créateur francophone';
        level.className = 'curated-channel-level-fr';
        level.textContent = getLevelRange(channel.levels);
        meta.append(category, level);
        title.className = 'curated-channel-name-fr';
        title.textContent = channel.name;
        description.className = 'curated-channel-description-fr';
        description.textContent = channel.shortDescription;
        action.className = 'curated-channel-action-fr';
        action.innerHTML = 'Voir la fiche <span aria-hidden="true">→</span>';
        body.append(meta, title, description, action);
        card.append(visual, body);

        return card;
    };

    const createShelf = (category, channels) => {
        const shelf = document.createElement('article');
        const header = document.createElement('header');
        const icon = document.createElement('span');
        const headingGroup = document.createElement('div');
        const title = document.createElement('h3');
        const description = document.createElement('p');
        const row = document.createElement('div');

        shelf.className = 'curated-channel-shelf-fr';
        shelf.id = `chaines-${category.id}`;
        header.className = 'curated-channel-shelf-header-fr';
        icon.className = 'curated-channel-shelf-icon-fr';
        icon.innerHTML = `<i class="${category.icon}" aria-hidden="true"></i>`;
        title.textContent = category.title;
        description.textContent = category.description;
        headingGroup.append(title, description);
        header.append(icon, headingGroup);
        row.className = 'curated-channel-row-fr';
        row.setAttribute('role', 'list');
        row.setAttribute('aria-label', category.title);

        channels.forEach(channel => {
            const item = document.createElement('div');
            item.className = 'curated-channel-row-item-fr';
            item.setAttribute('role', 'listitem');
            item.appendChild(createChannelCard(channel));
            row.appendChild(item);
        });

        shelf.append(header, row);
        return shelf;
    };

    const renderShelves = () => {
        const filteredChannels = data.channels.filter(matchesFilters);
        const fragment = document.createDocumentFragment();
        const visibleCategories = state.activeCategory === 'all'
            ? data.categories
            : data.categories.filter(category => category.id === state.activeCategory);
        let renderedShelfCount = 0;

        visibleCategories.forEach(category => {
            const shelfChannels = filteredChannels.filter(channel => channel.categories.includes(category.id));
            if (shelfChannels.length === 0) return;

            fragment.appendChild(createShelf(category, shelfChannels));
            renderedShelfCount += 1;
        });

        shelvesContainer.replaceChildren(fragment);
        const hasResults = renderedShelfCount > 0;
        shelvesContainer.hidden = !hasResults;
        emptyState.hidden = hasResults;

        if (!hasResults) {
            resultsStatus.textContent = 'Aucun rayon ne correspond à cette recherche.';
        } else if (state.query) {
            resultsStatus.textContent = `Créateurs correspondant à « ${state.query.trim()} ».`;
        } else if (state.activeLevel !== 'all') {
            resultsStatus.textContent = `Chaînes conseillées pour le niveau ${state.activeLevel}.`;
        } else if (state.activeCategory !== 'all') {
            resultsStatus.textContent = categoryById.get(state.activeCategory)?.title || '';
        } else {
            resultsStatus.textContent = 'Choisis une carte pour lire ma note et regarder une vidéo d’exemple.';
        }
    };

    const renderModalLevels = channel => {
        const levelsContainer = document.getElementById('curated-modal-levels-fr');
        const guidance = document.getElementById('curated-modal-level-guidance-fr');
        if (!levelsContainer || !guidance) return;

        levelsContainer.replaceChildren();
        cefrLevels.forEach(level => {
            const marker = document.createElement('span');
            const isRecommended = channel.levels.includes(level);
            marker.className = 'curated-channel-level-dot-fr';
            marker.classList.toggle('recommended', isRecommended);
            marker.textContent = level;
            marker.setAttribute('aria-label', `${level}${isRecommended ? ' conseillé' : ' non conseillé'}`);
            levelsContainer.appendChild(marker);
        });
        guidance.textContent = getLevelGuidance(channel.levels);
    };

    const renderModalLinks = channel => {
        const linksContainer = document.getElementById('curated-modal-links-fr');
        if (!linksContainer) return;

        const linkLabels = {
            youtube: { label: 'Ouvrir la chaîne', icon: 'fa-brands fa-youtube' },
            instagram: { label: 'Instagram', icon: 'fa-brands fa-instagram' },
            website: { label: 'Site officiel', icon: 'fa-solid fa-globe' },
            spotify: { label: 'Spotify', icon: 'fa-brands fa-spotify' },
        };

        linksContainer.replaceChildren();
        Object.entries(channel.links || {}).forEach(([platformName, href]) => {
            if (!href) return;

            const config = linkLabels[platformName] || {
                label: platformName,
                icon: 'fa-solid fa-arrow-up-right-from-square',
            };
            const link = document.createElement('a');
            link.className = `btn-fr ${platformName === 'youtube' ? 'primary' : 'secondary'}`;
            link.href = href;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.innerHTML = `<i class="${config.icon}" aria-hidden="true"></i> ${config.label}`;
            linksContainer.appendChild(link);
        });
    };

    const getFocusableModalElements = () =>
        Array.from(
            modalDialog.querySelectorAll(
                'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
            ),
        );

    const openModal = (channel, trigger) => {
        const image = document.getElementById('curated-modal-image-fr');
        const name = document.getElementById('curated-modal-name-fr');
        const description = document.getElementById('curated-modal-description-fr');
        const longDescription = document.getElementById('curated-modal-long-description-fr');
        const comment = document.getElementById('curated-modal-comment-fr');
        const video = document.getElementById('curated-modal-video-fr');
        const videoTitle = document.getElementById('curated-modal-video-title-fr');
        const platform = document.getElementById('curated-modal-platform-fr');

        if (!image || !name || !description || !longDescription || !comment || !video || !videoTitle || !platform) return;

        state.modalTrigger = trigger;
        const profilePlatform = getProfilePlatform(channel);
        image.src = channel.profilePic;
        image.alt = channel.imageAlt || `Photo de la chaîne ${channel.name}`;
        platform.className = `curated-channel-modal-platform-fr ${profilePlatform.className}`;
        platform.setAttribute('aria-label', profilePlatform.label);
        platform.innerHTML = `<i class="${profilePlatform.icon}" aria-hidden="true"></i>`;
        name.textContent = channel.name;
        description.textContent = channel.shortDescription;
        longDescription.textContent = channel.longDescription;
        comment.textContent = channel.aljohnComment;
        video.src = `https://www.youtube.com/embed/${channel.sampleVideo.id}?rel=0`;
        video.title = channel.sampleVideo.title;
        videoTitle.textContent = channel.sampleVideo.title;
        renderModalLevels(channel);
        renderModalLinks(channel);

        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('curated-modal-open-fr');
        requestAnimationFrame(() => {
            modal.classList.add('open');
            modalCloseButton.focus();
        });
    };

    const closeModal = () => {
        const video = document.getElementById('curated-modal-video-fr');
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('curated-modal-open-fr');
        if (video) video.src = 'about:blank';

        window.setTimeout(() => {
            modal.hidden = true;
            state.modalTrigger?.focus();
            state.modalTrigger = null;
        }, 180);
    };

    filterContainer.addEventListener('click', event => {
        const button = event.target.closest('.curated-filter-chip-fr');
        if (!button || !filterContainer.contains(button)) return;

        state.activeCategory = button.dataset.category || 'all';
        renderFilters();
        renderShelves();
    });

    searchInput.addEventListener('input', () => {
        state.query = searchInput.value;
        renderShelves();
    });

    levelSelect.addEventListener('change', () => {
        state.activeLevel = levelSelect.value;
        renderShelves();
    });

    shelvesContainer.addEventListener('click', event => {
        const card = event.target.closest('.curated-channel-card-fr');
        if (!card || !shelvesContainer.contains(card)) return;

        const channel = channelById.get(card.dataset.channelId);
        if (channel) openModal(channel, card);
    });

    resetButton?.addEventListener('click', () => {
        state.activeCategory = 'all';
        state.activeLevel = 'all';
        state.query = '';
        searchInput.value = '';
        levelSelect.value = 'all';
        renderFilters();
        renderShelves();
        searchInput.focus();
    });

    modal.addEventListener('click', event => {
        if (event.target.closest('[data-curated-modal-close]')) closeModal();
    });
    modalCloseButton.addEventListener('click', closeModal);

    document.addEventListener('keydown', event => {
        if (modal.hidden) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            closeModal();
            return;
        }

        if (event.key !== 'Tab') return;
        const focusableElements = getFocusableModalElements();
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
        }
    });

    renderFilters();
    renderShelves();
}

window.renderFrenchCuratedChannels = renderFrenchCuratedChannels;
