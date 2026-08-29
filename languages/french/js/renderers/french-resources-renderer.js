function renderFrenchResources() {
    const data = window.frenchResourcesData;
    const spotlightContainer = document.getElementById('resource-stack-fr');
    const photoModal = document.getElementById('photo-lightbox-fr');
    const photoModalDialog = photoModal?.querySelector('.photo-lightbox-dialog-fr');
    const photoModalImage = document.getElementById('photo-lightbox-image-fr');
    const photoModalVideo = document.getElementById('photo-lightbox-video-fr');
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
        || !photoModalVideo
        || !photoModalCaption
        || !photoModalCounter
        || !photoModalClose
        || !photoModalPrevious
        || !photoModalNext
    ) {
        return;
    }

    const lightboxState = {
        items: [],
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

    const isFacebookReel = item => item?.type === 'facebookReel';

    const getFacebookEmbedUrl = sourceUrl =>
        `https://www.facebook.com/plugins/video.php?height=476&href=${encodeURIComponent(sourceUrl)}&show_text=false&width=267&t=0`;

    const renderGalleryItem = (spotlight, item, index) => {
        const activeClass = index === 0 ? ' is-active' : '';
        const hiddenAttributes = index === 0 ? '' : ' hidden';
        const ariaHidden = index === 0 ? 'false' : 'true';

        if (isFacebookReel(item)) {
            const embedUrl = getFacebookEmbedUrl(item.sourceUrl);

            return `
                <figure class="spotlight-album-photo-fr spotlight-album-reel-fr${activeClass}" data-gallery-index="${index}"${hiddenAttributes} aria-hidden="${ariaHidden}">
                    <div class="spotlight-album-reel-frame-fr">
                        <iframe src="${index === 0 ? escapeHtml(embedUrl) : 'about:blank'}" data-embed-src="${escapeHtml(embedUrl)}" title="${escapeHtml(item.title)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowfullscreen></iframe>
                    </div>
                    <figcaption>
                        <span>${escapeHtml(item.caption)}</span>
                        <a class="spotlight-album-reel-source-fr" href="${escapeHtml(item.sourceUrl)}" target="_blank" rel="noopener noreferrer">Ouvrir sur Facebook <span aria-hidden="true">↗</span></a>
                    </figcaption>
                </figure>
            `;
        }

        return `
            <figure class="spotlight-album-photo-fr${activeClass}" data-gallery-index="${index}"${hiddenAttributes} aria-hidden="${ariaHidden}">
                <button class="spotlight-album-trigger-fr" type="button" data-spotlight-id="${escapeHtml(spotlight.id)}" data-gallery-index="${index}" aria-label="Agrandir : ${escapeHtml(item.caption)}">
                    <img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy" decoding="async">
                </button>
                <figcaption aria-hidden="true">${escapeHtml(item.caption)}</figcaption>
            </figure>
        `;
    };

    const renderSpotlightVisual = spotlight => {
        if (!hasGallery(spotlight)) {
            return `<img src="${escapeHtml(spotlight.imageSrc)}" alt="${escapeHtml(spotlight.imageAlt)}" loading="lazy" decoding="async">`;
        }

        const hasMixedMedia = spotlight.gallery.some(isFacebookReel);
        const itemLabel = hasMixedMedia ? 'Élément' : 'Photo';
        const navigationLabel = hasMixedMedia ? 'Média' : 'Photo';

        return `
            <div class="spotlight-album-fr" data-spotlight-id="${escapeHtml(spotlight.id)}" data-active-index="0" data-item-label="${itemLabel}" role="group" aria-roledescription="carrousel" aria-label="Galerie — ${escapeHtml(spotlight.name)}">
                <div class="spotlight-album-viewport-fr">
                    ${spotlight.gallery
                        .map((item, index) => renderGalleryItem(spotlight, item, index))
                        .join('')}
                </div>
                <button class="spotlight-album-nav-fr previous" type="button" data-carousel-direction="-1" aria-label="${navigationLabel} précédent de ${escapeHtml(spotlight.name)}">
                    <i class="fa-solid fa-chevron-left" aria-hidden="true"></i>
                </button>
                <button class="spotlight-album-nav-fr next" type="button" data-carousel-direction="1" aria-label="${navigationLabel} suivant de ${escapeHtml(spotlight.name)}">
                    <i class="fa-solid fa-chevron-right" aria-hidden="true"></i>
                </button>
                <p class="spotlight-album-status-fr" aria-live="polite">${itemLabel} 1 sur ${spotlight.gallery.length}</p>
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
        Array.from(
            photoModalDialog.querySelectorAll(
                'button:not([disabled]):not([hidden]), iframe:not([hidden]), [tabindex]:not([tabindex="-1"]):not([hidden])',
            ),
        );

    const renderActiveMedia = () => {
        const item = lightboxState.items[lightboxState.activeIndex];
        if (!item) return;

        if (isFacebookReel(item)) {
            photoModalImage.hidden = true;
            photoModalImage.src = '';
            photoModalVideo.hidden = false;
            photoModalVideo.title = item.title;
            photoModalVideo.src = getFacebookEmbedUrl(item.sourceUrl);
        } else {
            photoModalVideo.hidden = true;
            photoModalVideo.src = 'about:blank';
            photoModalImage.hidden = false;
            photoModalImage.src = item.src;
            photoModalImage.alt = item.alt;
        }

        photoModalCaption.textContent = item.caption;
        const itemLabel = lightboxState.items.some(isFacebookReel) ? 'Élément' : 'Photo';
        photoModalCounter.textContent = `${itemLabel} ${lightboxState.activeIndex + 1} sur ${lightboxState.items.length}`;
        const hasMultipleItems = lightboxState.items.length > 1;
        photoModalPrevious.hidden = !hasMultipleItems;
        photoModalNext.hidden = !hasMultipleItems;
    };

    const changeMedia = direction => {
        const itemCount = lightboxState.items.length;
        if (itemCount < 2) return;

        lightboxState.activeIndex = (lightboxState.activeIndex + direction + itemCount) % itemCount;
        renderActiveMedia();
    };

    const openPhotoModal = (spotlight, galleryIndex, trigger) => {
        if (!hasGallery(spotlight)) return;

        lightboxState.items = [...spotlight.gallery];
        lightboxState.activeIndex = Math.max(0, Math.min(galleryIndex, lightboxState.items.length - 1));
        lightboxState.trigger = trigger;
        renderActiveMedia();
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
            photoModalVideo.src = 'about:blank';
            photoModalVideo.hidden = true;
            photoModalImage.hidden = false;
            lightboxState.trigger?.focus();
            lightboxState.items = [];
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
            const embeddedVideo = photo.querySelector('iframe[data-embed-src]');
            photo.hidden = !isActive;
            photo.classList.toggle('is-active', isActive);
            photo.setAttribute('aria-hidden', String(!isActive));

            if (embeddedVideo) {
                embeddedVideo.src = isActive ? embeddedVideo.dataset.embedSrc : 'about:blank';
            }
        });
        album.dataset.activeIndex = String(nextIndex);
        const status = album.querySelector('.spotlight-album-status-fr');
        const itemLabel = album.dataset.itemLabel || 'Photo';
        if (status) status.textContent = `${itemLabel} ${nextIndex + 1} sur ${photos.length}`;
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
        const galleryIndex = Number.parseInt(trigger.dataset.galleryIndex || '0', 10);
        if (spotlight) openPhotoModal(spotlight, galleryIndex, trigger);
    });

    photoModal.addEventListener('click', event => {
        if (event.target.closest('[data-photo-lightbox-close]')) closePhotoModal();
    });
    photoModalClose.addEventListener('click', closePhotoModal);
    photoModalPrevious.addEventListener('click', () => changeMedia(-1));
    photoModalNext.addEventListener('click', () => changeMedia(1));

    document.addEventListener('keydown', event => {
        if (photoModal.hidden) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            closePhotoModal();
            return;
        }
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            changeMedia(-1);
            return;
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            changeMedia(1);
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
