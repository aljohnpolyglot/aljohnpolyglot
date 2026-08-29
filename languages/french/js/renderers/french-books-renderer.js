function renderFrenchBooks() {
    const books = window.frenchBooksData;
    const shelf = document.getElementById('french-books-shelf-fr');
    const previousButton = document.getElementById('french-books-prev-fr');
    const nextButton = document.getElementById('french-books-next-fr');
    const modal = document.getElementById('french-book-modal-fr');
    const modalDialog = modal?.querySelector('.french-book-modal-dialog-fr');
    const modalClose = document.getElementById('french-book-modal-close-fr');
    const modalCover = document.getElementById('french-book-modal-cover-fr');
    const modalCoverFallback = document.getElementById('french-book-modal-cover-fallback-fr');
    const modalSource = document.getElementById('french-book-modal-source-fr');
    const modalCategory = document.getElementById('french-book-modal-category-fr');
    const modalTitle = document.getElementById('french-book-modal-title-fr');
    const modalAuthor = document.getElementById('french-book-modal-author-fr');
    const modalLevel = document.getElementById('french-book-modal-level-fr');
    const modalDescription = document.getElementById('french-book-modal-description-fr');
    const modalGuidance = document.getElementById('french-book-modal-guidance-fr');
    const modalLinks = document.getElementById('french-book-modal-links-fr');

    if (
        !shelf
        || !previousButton
        || !nextButton
        || !modal
        || !modalDialog
        || !modalClose
        || !modalCover
        || !modalCoverFallback
        || !modalSource
        || !modalCategory
        || !modalTitle
        || !modalAuthor
        || !modalLevel
        || !modalDescription
        || !modalGuidance
        || !modalLinks
    ) {
        return;
    }

    const escapeHtml = value =>
        String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

    if (!Array.isArray(books) || books.length === 0) {
        shelf.innerHTML = `
            <li class="french-books-empty-fr">
                <i class="fa-solid fa-book-open" aria-hidden="true"></i>
                <p>Le rayon est vide pour le moment. Recharge la page ou visite directement Project Gutenberg.</p>
            </li>
        `;
        previousButton.disabled = true;
        nextButton.disabled = true;
        return;
    }

    const state = {
        activeBook: null,
        lastFocusedCard: null,
        closeTimer: null,
    };

    shelf.innerHTML = books
        .map(
            book => `
                <li class="french-book-item-fr">
                    <button
                        class="french-book-card-fr"
                        type="button"
                        data-french-book-id="${escapeHtml(book.id)}"
                        aria-haspopup="dialog"
                        aria-controls="french-book-modal-fr"
                        aria-label="Ouvrir la fiche de ${escapeHtml(book.title)}, niveau ${escapeHtml(book.levels.join(' à '))}"
                    >
                        <span class="french-book-cover-fr">
                            <img src="${escapeHtml(book.coverImage)}" alt="${escapeHtml(book.coverAlt)}" loading="lazy" decoding="async">
                            <span class="french-book-cover-fallback-fr" hidden aria-hidden="true">${escapeHtml(book.title)}</span>
                        </span>
                        <span class="french-book-card-copy-fr">
                            <span class="french-book-category-fr">${escapeHtml(book.category)}</span>
                            <strong>${escapeHtml(book.title)}</strong>
                            <span class="french-book-author-fr">${escapeHtml(book.author)}</span>
                            <span class="french-book-level-fr">CECR · ${escapeHtml(book.levels.join('–'))}</span>
                            <span class="french-book-short-fr">${escapeHtml(book.shortDescription)}</span>
                        </span>
                    </button>
                </li>
            `,
        )
        .join('');

    const showCoverFallback = (image, fallback, title) => {
        image.hidden = true;
        fallback.hidden = false;
        fallback.textContent = title;
    };

    shelf.querySelectorAll('.french-book-cover-fr').forEach(cover => {
        const image = cover.querySelector('img');
        const fallback = cover.querySelector('.french-book-cover-fallback-fr');
        const card = cover.closest('[data-french-book-id]');
        const book = books.find(item => item.id === card?.dataset.frenchBookId);

        if (image && fallback && book) {
            image.addEventListener('error', () => showCoverFallback(image, fallback, book.title));
            if (image.complete && image.naturalWidth === 0) {
                showCoverFallback(image, fallback, book.title);
            }
        }
    });

    const renderModalLinks = book => {
        modalLinks.innerHTML = book.links
            .map(
                link => `
                    <a class="btn-fr ${link.variant === 'secondary' ? 'secondary' : 'primary'}" href="${escapeHtml(link.href)}"${link.external === false ? '' : ' target="_blank" rel="noopener noreferrer"'}>
                        <i class="${escapeHtml(link.icon)}" aria-hidden="true"></i>
                        ${escapeHtml(link.label)}
                    </a>
                `,
            )
            .join('');
    };

    const getFocusableModalElements = () =>
        Array.from(
            modalDialog.querySelectorAll(
                'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
            ),
        );

    const openBookModal = (book, trigger) => {
        if (state.closeTimer) {
            window.clearTimeout(state.closeTimer);
            state.closeTimer = null;
        }

        state.activeBook = book;
        state.lastFocusedCard = trigger;

        modalCover.hidden = false;
        modalCoverFallback.hidden = true;
        modalCover.src = book.coverImage;
        modalCover.alt = book.coverAlt;
        modalCoverFallback.textContent = book.title;
        if (modalCover.complete && modalCover.naturalWidth === 0) {
            showCoverFallback(modalCover, modalCoverFallback, book.title);
        }
        modalSource.textContent = book.sourceLabel;
        modalCategory.textContent = book.category;
        modalTitle.textContent = book.title;
        modalAuthor.textContent = book.author;
        modalLevel.textContent = `Niveau conseillé · ${book.levels.join('–')}`;
        modalDescription.textContent = book.longDescription;
        modalGuidance.textContent = book.guidance;
        renderModalLinks(book);

        modal.hidden = false;
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('french-book-modal-open-fr');

        window.requestAnimationFrame(() => {
            modal.classList.add('open');
            modalClose.focus();
        });
    };

    const closeBookModal = () => {
        if (modal.hidden) return;

        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('french-book-modal-open-fr');

        state.closeTimer = window.setTimeout(() => {
            modal.hidden = true;
            modalCover.src = books[0].coverImage;
            modalCover.alt = books[0].coverAlt;
            modalLinks.innerHTML = '';
            state.lastFocusedCard?.focus();
            state.activeBook = null;
            state.lastFocusedCard = null;
            state.closeTimer = null;
        }, 180);
    };

    modalCover.addEventListener('error', () => {
        showCoverFallback(modalCover, modalCoverFallback, state.activeBook?.title || 'Livre');
    });

    shelf.addEventListener('click', event => {
        const card = event.target.closest('[data-french-book-id]');
        if (!card || !shelf.contains(card)) return;

        const book = books.find(item => item.id === card.dataset.frenchBookId);
        if (book) openBookModal(book, card);
    });

    modal.addEventListener('click', event => {
        if (event.target.closest('[data-french-book-modal-close]')) closeBookModal();
    });
    modalClose.addEventListener('click', closeBookModal);

    document.addEventListener('keydown', event => {
        if (modal.hidden) return;

        if (event.key === 'Escape') {
            event.preventDefault();
            closeBookModal();
            return;
        }

        if (event.key !== 'Tab') return;

        const focusableElements = getFocusableModalElements();
        if (focusableElements.length === 0) {
            event.preventDefault();
            modalDialog.focus();
            return;
        }

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

    const updateShelfControls = () => {
        const maximumScroll = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
        previousButton.disabled = shelf.scrollLeft <= 4;
        nextButton.disabled = shelf.scrollLeft >= maximumScroll - 4;
    };

    const scrollShelf = direction => {
        shelf.scrollBy({
            left: direction * Math.max(240, shelf.clientWidth * 0.78),
            behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
    };

    previousButton.addEventListener('click', () => scrollShelf(-1));
    nextButton.addEventListener('click', () => scrollShelf(1));
    shelf.addEventListener('scroll', updateShelfControls, { passive: true });
    window.addEventListener('resize', updateShelfControls, { passive: true });
    window.requestAnimationFrame(updateShelfControls);
}

window.renderFrenchBooks = renderFrenchBooks;
