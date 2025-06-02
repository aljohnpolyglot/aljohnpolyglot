'use strict';

// js/features/navigational_aids_display.js

function displayNavigationalAids() {
    const shelfContainer = $('#navigational-aids-shelf'); // This is the .bookshelf-container in CSS

    if (!shelfContainer) {
        console.error("Navigational aids shelf container (#navigational-aids-shelf) not found.");
        return;
    }
    // Ensure window.philosophyBooks is the correct data source name from your data file
    if (!window.philosophyBooks || !Array.isArray(window.philosophyBooks) || window.philosophyBooks.length === 0) {
        console.warn("`window.philosophyBooks` (Navigational Aids) data not found or empty.");
        shelfContainer.innerHTML = "<p style='color: var(--text-color-dark, #333); padding: 20px; text-align: center;'>Captain Aljohn's recommended charts are currently off exploring the seven seas themselves!</p>";
        return;
    }

    clearChildren(shelfContainer);

    window.philosophyBooks.forEach(book => {
        if (!book || typeof book !== 'object' || !book.id || !book.title) {
            console.warn("Skipping invalid or incomplete book data in Navigational Aids:", book);
            return;
        }

        const card = createElement('div', 'nav-aid-book-card', {'data-book-id': book.id});

        // 1. Cover Image
        const coverContainer = createElement('div', 'book-cover-container');
        const coverImg = createElement('img', 'book-cover-img', {
            src: book.coverImg || 'images/assets/open_book_flipping_icon.png',
            alt: `Cover of ${book.title}` // Alt text still uses title for accessibility
        });
        coverImg.onerror = function() { 
            this.src = 'images/assets/open_book_flipping_icon.png'; 
            this.alt = 'Fallback book cover';
            console.warn(`Failed to load cover for: ${book.title}. Using fallback.`);
        };
        coverContainer.appendChild(coverImg);
        card.appendChild(coverContainer);

        // 2. Title - Will be created but hidden by CSS on the card
        const titleEl = createElement('h3', 'book-title', {}, book.title);
        card.appendChild(titleEl);

        // 3. Author - Will be created but hidden by CSS on the card
        if (book.author) {
            const authorEl = createElement('p', 'philosophy-book-author', {}, `by ${book.author}`);
            card.appendChild(authorEl);
        }

        shelfContainer.appendChild(card);

        // Event listener for the entire card to open the modal
        card.addEventListener('click', () => openNavAidModal(book));
    });
    // console.log(`${window.philosophyBooks.length} navigational aids displayed.`);
}

// Function to open and populate the modal
function openNavAidModal(bookData) {
    const modal = $('#content-info-modal');
    const modalBody = $('#content-modal-body');
    const closeModalBtn = $('#close-content-modal');

    if (!modal || !modalBody || !closeModalBtn) {
        console.error("Generic content modal elements (#content-info-modal, #content-modal-body, or #close-content-modal) not found!");
        return;
    }
    if (!bookData || !bookData.id) { 
        console.error("Invalid bookData passed to openNavAidModal", bookData);
        return;
    }

    clearChildren(modalBody);

    const layout = createElement('div', ['modal-book-layout', 'philosophy-modal-layout']);

    // Modal Cover
    const modalCoverContainer = createElement('div', 'modal-cover-container');
    const modalCoverImg = createElement('img', [], { // ID 'modal-content-cover-img' will be set if needed
        src: bookData.coverImg || 'images/assets/open_book_flipping_icon.png',
        alt: `Cover of ${bookData.title}`
    });
    modalCoverImg.id = 'modal-content-cover-img'; // Keep ID for CSS targeting
    modalCoverContainer.appendChild(modalCoverImg);
    layout.appendChild(modalCoverContainer);

    // Modal Details
    const detailsContainer = createElement('div', 'modal-details-container');
    
    const titleEl = createElement('h2', [], {}, bookData.title);
    titleEl.id = 'modal-content-title-text'; // Keep ID for CSS targeting
    detailsContainer.appendChild(titleEl);

    if (bookData.author) {
        const authorEl = createElement('p', 'modal-author-text');
        authorEl.textContent = `by ${bookData.author}`;
        detailsContainer.appendChild(authorEl);
    }

    // Book Description
    if (bookData.description) {
        const descTitle = createElement('h4', [], {}, 'Book Description:');
        const descScroll = createElement('div', 'modal-description-scroll');
        const descText = createElement('p', [], {}, bookData.description);
        descScroll.appendChild(descText);
        detailsContainer.appendChild(descTitle);
        detailsContainer.appendChild(descScroll);
    }

    // Aljohn's Notes
    if (bookData.aljohnsNotes) {
        const notesTitle = createElement('h4', [], {}, "Captain Aljohn's Log: Why This Chart Matters");
        const notesScroll = createElement('div', ['modal-description-scroll', 'aljohns-notes-scroll']);
        const notesText = createElement('p', [], {}, bookData.aljohnsNotes);
        notesScroll.appendChild(notesText);
        detailsContainer.appendChild(notesTitle);
        detailsContainer.appendChild(notesScroll);
    }

    // External Actions (e.g., Amazon Link)
    const externalActions = createElement('div', 'modal-external-actions');
    if (bookData.amazonLink) {
        const amazonLink = createElement('a', ['button-like-link', 'amazon-link'], {
            href: bookData.amazonLink,
            target: '_blank',
            rel: 'noopener noreferrer'
        });
        amazonLink.innerHTML = `View on Amazon <i class="fab fa-amazon"></i>`;
        externalActions.appendChild(amazonLink);
    }
    if (externalActions.hasChildNodes()) {
        detailsContainer.appendChild(externalActions);
    }
    
    layout.appendChild(detailsContainer);
    modalBody.appendChild(layout);

    modal.style.display = 'flex'; // Show the modal

    // Named functions for event listeners for clarity and removal
    const handleCloseButtonClick = () => {
        modal.style.display = 'none';
        closeModalBtn.removeEventListener('click', handleCloseButtonClick);
        modal.removeEventListener('click', handleOverlayClick);
    };

    const handleOverlayClick = (event) => {
        if (event.target === modal) { // Only close if overlay (modal background) itself is clicked
            handleCloseButtonClick();
        }
    };
    
    // Add event listeners with { once: true } to auto-remove after first execution
    closeModalBtn.addEventListener('click', handleCloseButtonClick, { once: true });
    modal.addEventListener('click', handleOverlayClick, { once: true });
}

// Make sure this is called in main_app.js after DOM is loaded and data (window.philosophyBooks) is available:
// if (window.philosophyBooks && window.philosophyBooks.length > 0) {
//     displayNavigationalAids();
// }