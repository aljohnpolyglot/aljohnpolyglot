// js/features/modal_controller.js

const modalOverlay = $('#book-info-modal');
const closeModalBtn = $('.close-modal-button', modalOverlay);
const modalBookCover = $('#modal-book-cover-img', modalOverlay);
const modalBookTitle = $('#modal-book-title-text', modalOverlay);
const modalGenreEyebrow = $('.modal-genre-eyebrow-text', modalOverlay);
const modalBookLanguage = $('#modal-book-language-display', modalOverlay);
const modalBookDescription = $('#modal-book-description-text', modalOverlay);
const modalAljohnsNotes = $('#modal-aljohns-notes-text', modalOverlay);
const modalEpubBtn = $('#modal-epub-download-btn', modalOverlay);
const modalPdfBtn = $('#modal-pdf-download-btn', modalOverlay);
const modalLanguagePageLink = $('#modal-language-page-link', modalOverlay);
let modalReturnFocus = null;

function initializeModalController() {
    if (!modalOverlay || !closeModalBtn) {
        console.error("Modal elements not found.");
        return;
    }

    closeModalBtn.addEventListener('click', closeBookModal);
    modalBookCover.addEventListener('error', () => {
        modalBookCover.src = '/library/images/assets/open_book_flipping_icon.png';
        modalBookCover.alt = 'Book cover unavailable';
    }, { once: true });
    modalOverlay.addEventListener('click', (event) => {
        // Close modal if clicked outside the content box
        if (event.target === modalOverlay) {
            closeBookModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('active')) {
            closeBookModal();
            return;
        }

        if (event.key === 'Tab' && modalOverlay.classList.contains('active')) {
            const focusable = Array.from(modalOverlay.querySelectorAll(
                'button:not([disabled]), a[href]:not([style*="display:none"]), [tabindex]:not([tabindex="-1"])'
            )).filter((element) => element.offsetParent !== null);
            if (!focusable.length) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        }
    });
}

function openBookModal(bookId) {
    const book = publicDomainBooks.find(b => b.id === bookId);
    if (!book) {
        console.error(`Book with ID ${bookId} not found for modal.`);
        return;
    }

    modalBookCover.src = book.coverImg || 'images/assets/open_book_flipping_icon.png';
    modalBookCover.alt = `Cover of ${book.title}`;
    modalBookTitle.textContent = book.title;
    modalGenreEyebrow.textContent = book.genres.join(', ') || "General Information";

    clearChildren(modalBookLanguage); // Clear previous flag/text
    const langCodeForFlag = languageToFlagCode[book.language] || book.language;
    const flagImg = createFlagImg(langCodeForFlag, `${book.languageName} flag`, 'w20');
    if (flagImg) modalBookLanguage.appendChild(flagImg);
    modalBookLanguage.appendChild(document.createTextNode(` ${book.languageName}`));


    modalBookDescription.textContent = book.description || "No description available for this tome.";
    modalAljohnsNotes.textContent = book.aljohnsNotes || "(The Captain hasn't scribbled any notes here... yet!)";

    if (book.epubLink) {
        modalEpubBtn.href = book.epubLink;
        modalEpubBtn.style.display = 'inline-block';
    } else {
        modalEpubBtn.style.display = 'none';
    }

    if (book.pdfLink) {
        modalPdfBtn.href = book.pdfLink;
        modalPdfBtn.style.display = 'inline-block';
    } else {
        modalPdfBtn.style.display = 'none';
    }

    if (modalLanguagePageLink && book.languagePageLink) {
        modalLanguagePageLink.href = book.languagePageLink;
        modalLanguagePageLink.style.display = 'inline-block';
    } else if (modalLanguagePageLink) {
        modalLanguagePageLink.style.display = 'none';
    }

    modalReturnFocus = document.activeElement;
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    window.requestAnimationFrame(() => closeModalBtn.focus());
}

function closeBookModal() {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scroll
    if (modalReturnFocus && typeof modalReturnFocus.focus === 'function') {
        modalReturnFocus.focus();
    }
    modalReturnFocus = null;
}
