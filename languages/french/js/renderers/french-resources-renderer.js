function renderFrenchResources() {
    const data = window.frenchResourcesData;
    const spotlightContainer = document.getElementById('resource-stack-fr');
    const photoModal = document.getElementById('photo-lightbox-fr');
    const photoModalDialog = photoModal?.querySelector('.photo-lightbox-dialog-fr');
    const photoModalImage = document.getElementById('photo-lightbox-image-fr');
    const photoModalCaption = document.getElementById('photo-lightbox-caption-fr');
    const photoModalCounter = document.getElementById('photo-lightbox-counter-fr');
    const photoModalClose = document.getElementById('photo-lightbox-close-fr');
    const photoModalPrevious = document.getElementById('photo-lightbox-prev-fr');
    const photoModalNext = document.getElementById('photo-lightbox-next-fr');

    if (
        !data
        || !spotlightContainer
        || !photoModal
        || !photoModalDialog
        || !photoModalImage
        || !photoModalCaption
        || !photoModalCounter
        || !photoModalClose
        || !photoModalPrevious
        || !photoModalNext
    ) {
        return;
    }

    const lightboxState = {
        photos: [],
        activeIndex: 0,
        trigger: null,
    };

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

    const hasGallery = spotlight => Array.isArray(spotlight.gallery) && spotlight.gallery.length > 0;

    const renderSpotlightVisual = spotlight => {
        if (!hasGallery(spotlight)) {
            return `<img src="${escapeHtml(spotlight.imageSrc)}" alt="${escapeHtml(spotlight.imageAlt)}" loading="lazy" decoding="async">`;
        }

        return `
            <div class="spotlight-album-fr" data-spotlight-id="${escapeHtml(spotlight.id)}" data-active-index="0" role="group" aria-roledescription="carrousel" aria-label="Album photo — ${escapeHtml(spotlight.name)}">
                <div class="spotlight-album-viewport-fr">
                    ${spotlight.gallery
                        .map(
                            (photo, index) => `
                                <figure class="spotlight-album-photo-fr${index === 0 ? ' is-active' : ''}" data-photo-index="${index}"${index === 0 ? '' : ' hidden'} aria-hidden="${index === 0 ? 'false' : 'true'}">
                                    <button class="spotlight-album-trigger-fr" type="button" data-spotlight-id="${escapeHtml(spotlight.id)}" data-photo-index="${index}" aria-label="Agrandir : ${escapeHtml(photo.caption)}">
                                        <img src="${escapeHtml(photo.src)}" alt="${escapeHtml(photo.alt)}" loading="lazy" decoding="async">
                                    </button>
                                    <figcaption aria-hidden="true">${escapeHtml(photo.caption)}</figcaption>
                                </figure>
                            `,
                        )
                        .join('')}
                </div>
                <button class="spotlight-album-nav-fr previous" type="button" data-carousel-direction="-1" aria-label="Photo précédente de ${escapeHtml(spotlight.name)}">
                    <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
                </button>
                <button class="spotlight-album-nav-fr next" type="button" data-carousel-direction="1" aria-label="Photo suivante de ${escapeHtml(spotlight.name)}">
                    <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                </button>
                <p class="spotlight-album-status-fr" aria-live="polite">Photo 1 sur ${spotlight.gallery.length}</p>
            </div>
        `;
    };

    spotlightContainer.innerHTML = data.spotlights
        .map(
            spotlight => `
                <article class="glass-card spotlight-fr${spotlight.reverse ? ' reverse' : ''}" id="${escapeHtml(spotlight.id)}">
                    <div class="spotlight-visual${hasGallery(spotlight) ? ' has-album' : ''}">
                        ${renderSpotlightVisual(spotlight)}
                        <div class="spotlight-logo-pill">
                            ${renderSpotlightBadge(spotlight)}
                            <span>${escapeHtml(spotlight.name)}</span>
                        </div>
                    </div>
                    <div class="spotlight-copy">
                        <h3>${escapeHtml(spotlight.name)}</h3>
                        ${spotlight.paragraphs.map(paragraph => `<p>${escapeHtml(paragraph)}</p>`).join('')}
                        <div class="action-row">
                            ${spotlight.actions.map(renderAction).join('')}
                        </div>
                    </div>
                </article>
            `,
        )
        .join('');

    const getFocusableModalElements = () =>
        Array.from(photoModalDialog.querySelectorAll('button:not([disabled]), [tabindex]:not([tabindex="-1"])'));

    const renderActivePhoto = () => {
        const photo = lightboxState.photos[lightboxState.activeIndex];
        if (!photo) return;

        photoModalImage.src = photo.src;
        photoModalImage.alt = photo.alt;
        photoModalCaption.textContent = photo.caption;
        photoModalCounter.textContent = `Photo ${lightboxState.activeIndex + 1} sur ${lightboxState.photos.length}`;
        const hasMultiplePhotos = lightboxState.photos.length > 1;
        photoModalPrevious.hidden = !hasMultiplePhotos;
        photoModalNext.hidden = !hasMultiplePhotos;
    };

    const changePhoto = direction => {
        const photoCount = lightboxState.photos.length;
        if (photoCount < 2) return;

        lightboxState.activeIndex = (lightboxState.activeIndex + direction + photoCount) % photoCount;
        renderActivePhoto();
    };

    const openPhotoModal = (spotlight, photoIndex, trigger) => {
        if (!hasGallery(spotlight)) return;

        lightboxState.photos = [...spotlight.gallery];
        lightboxState.activeIndex = Math.max(0, Math.min(photoIndex, lightboxState.photos.length - 1));
        lightboxState.trigger = trigger;
        renderActivePhoto();
        photoModal.hidden = false;
        photoModal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('photo-lightbox-open-fr');
        requestAnimationFrame(() => {
            photoModal.classList.add('open');
            photoModalClose.focus();
        });
    };

    const closePhotoModal = () => {
        photoModal.classList.remove('open');
        photoModal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('photo-lightbox-open-fr');

        window.setTimeout(() => {
            photoModal.hidden = true;
            photoModalImage.src = '';
            lightboxState.trigger?.focus();
            lightboxState.photos = [];
            lightboxState.activeIndex = 0;
            lightboxState.trigger = null;
        }, 180);
    };

    const changeCarouselPhoto = (album, direction) => {
        const photos = Array.from(album.querySelectorAll('.spotlight-album-photo-fr'));
        if (photos.length < 2) return;

        const currentIndex = Number.parseInt(album.dataset.activeIndex || '0', 10);
        const nextIndex = (currentIndex + direction + photos.length) % photos.length;
        photos.forEach((photo, index) => {
            const isActive = index === nextIndex;
            photo.hidden = !isActive;
            photo.classList.toggle('is-active', isActive);
            photo.setAttribute('aria-hidden', String(!isActive));
        });
        album.dataset.activeIndex = String(nextIndex);
        const status = album.querySelector('.spotlight-album-status-fr');
        if (status) status.textContent = `Photo ${nextIndex + 1} sur ${photos.length}`;
    };

    spotlightContainer.addEventListener('click', event => {
        const carouselButton = event.target.closest('.spotlight-album-nav-fr');
        if (carouselButton && spotlightContainer.contains(carouselButton)) {
            const album = carouselButton.closest('.spotlight-album-fr');
            const direction = Number.parseInt(carouselButton.dataset.carouselDirection || '1', 10);
            if (album) changeCarouselPhoto(album, direction);
            return;
        }

        const trigger = event.target.closest('.spotlight-album-trigger-fr');
        if (!trigger || !spotlightContainer.contains(trigger)) return;

        const spotlight = data.spotlights.find(item => item.id === trigger.dataset.spotlightId);
        const photoIndex = Number.parseInt(trigger.dataset.photoIndex || '0', 10);
        if (spotlight) openPhotoModal(spotlight, photoIndex, trigger);
    });

    photoModal.addEventListener('click', event => {
        if (event.target.closest('[data-photo-lightbox-close]')) closePhotoModal();
    });
    photoModalClose.addEventListener('click', closePhotoModal);
    photoModalPrevious.addEventListener('click', () => changePhoto(-1));
    photoModalNext.addEventListener('click', () => changePhoto(1));

    document.addEventListener('keydown', event => {
        if (photoModal.hidden) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            closePhotoModal();
            return;
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            changePhoto(-1);
            return;
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            changePhoto(1);
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

}

window.renderFrenchResources = renderFrenchResources;
