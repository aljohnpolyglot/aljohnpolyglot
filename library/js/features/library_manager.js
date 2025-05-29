'use strict';

// --- Global variables for filters and pagination ---
let currentFilters = {
    language: "",
    genre: "",
    filetype: "",
    cefr: ""
};

let currentPage = 1;
const BOOKS_PER_PAGE = 6; // Or your preferred number
let totalFilteredBooks = []; // Stores all books matching current filters before pagination

// --- Initialization Function ---
function initializeLibraryManager() {
    // DOM Element Selectors
    const libraryGrid = $('#library-grid');
    const mainMessageArea = $('#library-main-message-area'); // Renamed from initial-library-message
    const languageFilterSelect = $('#language-filter');
    const genreFilterSelect = $('#genre-filter');
    const filetypeFilterSelect = $('#filetype-filter');
    const cefrFilterSelect = $('#cefr-filter');
    const resetFiltersBtn = $('#reset-filters-btn');
    const prevPageBtn = $('#prev-page-btn');
    const nextPageBtn = $('#next-page-btn');

    // Check if all essential elements are present
    if (!libraryGrid || !mainMessageArea || !languageFilterSelect || !genreFilterSelect ||
        !filetypeFilterSelect || !cefrFilterSelect || !resetFiltersBtn ||
        !prevPageBtn || !nextPageBtn) {
        console.error("Library Manager: One or more essential DOM elements are missing. Functionality will be impaired.");
        // Optionally disable all filter controls
        [languageFilterSelect, genreFilterSelect, filetypeFilterSelect, cefrFilterSelect, resetFiltersBtn, prevPageBtn, nextPageBtn].forEach(el => {
            if (el) el.disabled = true;
        });
        return;
    }

    // Initial state for dependent filters: disabled and empty
    genreFilterSelect.disabled = true;
    filetypeFilterSelect.disabled = true;
    cefrFilterSelect.disabled = true;
    while (genreFilterSelect.options.length > 1) genreFilterSelect.remove(1);
    while (cefrFilterSelect.options.length > 1) cefrFilterSelect.remove(1);

    // Set up the initial view
    updateLibraryMessageArea(); // Show default welcome message with group photo
    renderBooks(); // This will initially show no books as no language is selected

    // --- Event Listeners for Filters ---
    languageFilterSelect.addEventListener('change', (e) => {
        currentFilters.language = e.target.value;
        // Reset dependent filters when language changes
        currentFilters.genre = "";
        currentFilters.filetype = "";
        currentFilters.cefr = "";
        genreFilterSelect.value = "";
        filetypeFilterSelect.value = "";
        cefrFilterSelect.value = "";
        currentPage = 1; // Reset pagination

        if (currentFilters.language) {
            // Populate and enable dependent filters
            populateGenreFilter(currentFilters.language);
            populateCEFRFilter(currentFilters.language); // Assuming populateCEFRFilter is defined elsewhere
            genreFilterSelect.disabled = genreFilterSelect.options.length <= 1;
            filetypeFilterSelect.disabled = false; // Filetype choices are static
            cefrFilterSelect.disabled = cefrFilterSelect.options.length <= 1;
        } else {
            // No language selected, disable and clear dependent filters
            genreFilterSelect.disabled = true;
            filetypeFilterSelect.disabled = true;
            cefrFilterSelect.disabled = true;
            while (genreFilterSelect.options.length > 1) genreFilterSelect.remove(1);
            while (cefrFilterSelect.options.length > 1) cefrFilterSelect.remove(1);
        }
        updateLibraryMessageArea(currentFilters.language); // Update the message/hook area
        renderBooks();
        document.dispatchEvent(new CustomEvent('languageFilterChanged', {
            detail: { languageCode: e.target.value }
        }));
    });

    genreFilterSelect.addEventListener('change', (e) => {
        currentFilters.genre = e.target.value;
        currentPage = 1;
        renderBooks();
    });

    filetypeFilterSelect.addEventListener('change', (e) => {
        currentFilters.filetype = e.target.value;
        currentPage = 1;
        renderBooks();
    });

    cefrFilterSelect.addEventListener('change', (e) => {
        currentFilters.cefr = e.target.value;
        currentPage = 1;
        renderBooks();
    });

    resetFiltersBtn.addEventListener('click', () => {
        // Reset all filter select elements
        languageFilterSelect.value = "";
        genreFilterSelect.value = "";
        filetypeFilterSelect.value = "";
        cefrFilterSelect.value = "";

        // Reset internal filter state
        currentFilters = { language: "", genre: "", filetype: "", cefr: "" };
        currentPage = 1;

        // Reset and disable dependent filters
        genreFilterSelect.disabled = true;
        filetypeFilterSelect.disabled = true;
        cefrFilterSelect.disabled = true;
        while (genreFilterSelect.options.length > 1) genreFilterSelect.remove(1);
        while (cefrFilterSelect.options.length > 1) cefrFilterSelect.remove(1);

        updateLibraryMessageArea(); // Show default welcome message
        renderBooks();
        document.dispatchEvent(new CustomEvent('languageFilterChanged', {
            detail: { languageCode: "" }
        }));
    });

    // --- Event Listeners for Pagination ---
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBooks(false); // Pass false to indicate only pagination change, not re-filtering
        }
    });

    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(totalFilteredBooks.length / BOOKS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderBooks(false); // Pass false for pagination change
        }
    });
}

// --- Function to Update the Main Message Area (Welcome or Language Hook) ---
function updateLibraryMessageArea(languageCode = "") {
    const messageArea = $('#library-main-message-area');
    if (!messageArea) {
        console.error("#library-main-message-area not found for updating!");
        return;
    }
    clearChildren(messageArea); // Clear any previous content

    if (languageCode && window.libraryCharacters && window.availableLanguages) {
        const character = Object.values(window.libraryCharacters).find(c => c.languageCode === languageCode);
        const langInfo = window.availableLanguages.find(l => l.code === languageCode);

        if (character && langInfo) {
            // Language is selected - show the language-specific hook
            const hookContainer = createElement('div', 'language-hook-container');
            
            // Ensure languageToFlagCode is available (from flag_cdn_helper.js)
            const langCodeForFlag = (typeof languageToFlagCode !== 'undefined' && languageToFlagCode[langInfo.code.toLowerCase()])
                                    ? languageToFlagCode[langInfo.code.toLowerCase()]
                                    : langInfo.code.toLowerCase();
            const flagImg = createFlagImg(langCodeForFlag, `${langInfo.name} flag`, 'w40', ['language-hook-flag']);
            
            if (flagImg) {
                hookContainer.appendChild(flagImg);
            }
            
          
const textDiv = createElement('div', 'language-hook-text');
            const titleEl = createElement('h3', [], {}, `${langInfo.name} Library`);
            
            const narrativeText = `Discover public domain books in ${langInfo.name}, selected by ${character.name}.`;
            const narrativeEl = createElement('p', [], {}, narrativeText);
            
            textDiv.appendChild(titleEl);
            textDiv.appendChild(narrativeEl);
            hookContainer.appendChild(textDiv);
            messageArea.appendChild(hookContainer);
            messageArea.style.textAlign = 'left'; // Adjust alignment for hook
            return;
        }
    }
    
    // Default state (no language selected) - Show group photo and welcome
    const libraryTitleEl = createElement('h1', 'library-main-title', {}, "The Crew's Collection"); // Or <h2>
    messageArea.appendChild(libraryTitleEl);
    const welcomeText = createElement('p', 'initial-welcome-message', {}, 
        "Our dedicated crew has scoured the globe, each member a champion of their tongue, to bring you these literary treasures. Select a language, and meet the specialist ready to guide your linguistic voyage!"
    );
    const crewPhoto = createElement('img', [], {
        src: 'images/characters/library_characters_group.png',
        alt: 'The Esteemed Crew of the Aljohn Polyglot Library',
        id: 'crew-group-photo'
    });
    
    messageArea.appendChild(welcomeText);
    messageArea.appendChild(crewPhoto);
    messageArea.style.textAlign = 'center'; // Center default message
}

// --- Function to Render Books (with Filtering and Pagination) ---
function renderBooks(refilter = true) {
    const libraryGrid = $('#library-grid');
    const mainMessageArea = $('#library-main-message-area'); // Used for "no match" message
    const paginationControls = $('#pagination-controls');
    const pageInfoSpan = $('#page-info');
    const prevPageBtn = $('#prev-page-btn');
    const nextPageBtn = $('#next-page-btn');

    if (!libraryGrid || !mainMessageArea || !paginationControls || !pageInfoSpan || !prevPageBtn || !nextPageBtn) {
        console.error("RenderBooks: One or more DOM elements for book display or pagination are missing.");
        return;
    }
    clearChildren(libraryGrid); // Always clear the grid before re-rendering

    if (refilter) {
        // This block executes when filters change, requiring a new list of totalFilteredBooks
        if (!window.publicDomainBooks || !Array.isArray(window.publicDomainBooks)) {
            console.error("RenderBooks: `publicDomainBooks` data is not available.");
            clearChildren(mainMessageArea);
            mainMessageArea.appendChild(createElement('p', [], {}, "Shiver me timbers! The book data seems to be lost at sea."));
            libraryGrid.style.display = 'none';
            paginationControls.style.display = 'none';
            return;
        }

        // If no language is selected, the message area is handled by updateLibraryMessageArea.
        // We just ensure the grid and pagination are hidden.
        if (!currentFilters.language) {
            libraryGrid.style.display = 'none';
            paginationControls.style.display = 'none';
            return; 
        }

        // Apply all filters to get the full list
        totalFilteredBooks = window.publicDomainBooks.filter(book => {
            if (!book || typeof book !== 'object') return false;

            // Language MUST match if selected
            const langMatch = book.language === currentFilters.language;

            const bookGenresNormalized = Array.isArray(book.genres) ?
                book.genres.map(g => String(g).toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')) : [];
            const genreMatch = !currentFilters.genre || bookGenresNormalized.includes(currentFilters.genre);

            let cefrMatch = true;
            if (currentFilters.cefr) { // Only apply CEFR filter if a level is selected
                if (book.recommendedCEFR) {
                    const bookCEFRLevels = (Array.isArray(book.recommendedCEFR) ? book.recommendedCEFR : [book.recommendedCEFR]).map(l => l.toLowerCase());
                    cefrMatch = bookCEFRLevels.includes(currentFilters.cefr);
                } else {
                    cefrMatch = false; // Book has no CEFR data, so it doesn't match an active CEFR filter
                }
            }

            let filetypeMatch = true;
            if (currentFilters.filetype === "pdf") filetypeMatch = !!book.pdfLink;
            else if (currentFilters.filetype === "epub") filetypeMatch = !!book.epubLink;

            return langMatch && genreMatch && filetypeMatch && cefrMatch;
        });
    }

    // --- Display Logic based on totalFilteredBooks ---
    if (totalFilteredBooks.length === 0 && currentFilters.language) {
        // Filters are active (language is selected), but no books match
        clearChildren(mainMessageArea); // Clear previous message (e.g., language hook)
        const noMatchText = createElement('p', 'initial-welcome-message', {}, // Re-use class for styling
         "Avast! No tomes match yer current charts. Try a different course, or reset the filters!"
        );
        mainMessageArea.appendChild(noMatchText);
        mainMessageArea.style.textAlign = 'center';
        libraryGrid.style.display = 'none';
        paginationControls.style.display = 'none';
    } else if (totalFilteredBooks.length > 0) {
        // Books found, proceed with pagination and display
        // The mainMessageArea should already be showing the correct language hook (or default)
        // So, we don't need to touch it here, unless it was showing "no match".
        // If it was showing "no match", updateLibraryMessageArea() would have been called on filter change.
        libraryGrid.style.display = 'grid';
        
        const totalPages = Math.ceil(totalFilteredBooks.length / BOOKS_PER_PAGE);
        // Ensure currentPage is within valid bounds after refiltering
        if (refilter || currentPage > totalPages) currentPage = 1; 
        currentPage = Math.max(1, currentPage); // Should not be less than 1

        const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
        const endIndex = startIndex + BOOKS_PER_PAGE;
        const booksToDisplay = totalFilteredBooks.slice(startIndex, endIndex);

        booksToDisplay.forEach(book => {
            const bookCard = createBookCard(book); // createBookCard must be defined
            if (bookCard) libraryGrid.appendChild(bookCard);
        });

        paginationControls.style.display = 'block';
        pageInfoSpan.textContent = `Page ${currentPage} of ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    } else {
        // No language selected (initial state) or some other edge case.
        // updateLibraryMessageArea handles the default message.
        libraryGrid.style.display = 'none';
        paginationControls.style.display = 'none';
    }
}

// --- Function to Create a Single Book Card ---
function createBookCard(book) {
    if (!book || typeof book.id === 'undefined' || !book.title) {
        console.warn("Skipping creation of book card due to invalid book data:", book);
        return null;
    }

    const card = createElement('div', ['book-card'], { 'data-book-id': book.id });

    const coverContainer = createElement('div', 'book-cover-container');
    const coverImg = createElement('img', 'book-cover-img', {
        src: book.coverImg || 'images/assets/open_book_flipping_icon.png',
        alt: `Cover of ${book.title}`
    });
    coverImg.onerror = function() {
        this.src = 'images/assets/open_book_flipping_icon.png';
        this.alt = 'Fallback book cover image';
    };
    coverContainer.appendChild(coverImg);

    const titleEl = createElement('h3', 'book-title', {}, book.title);

    const langDisplay = createElement('div', 'book-language-display');
    if (book.language && book.languageName) {
        const langCodeForFlag = (typeof languageToFlagCode !== 'undefined' && languageToFlagCode[book.language.toLowerCase()])
                                ? languageToFlagCode[book.language.toLowerCase()]
                                : book.language.toLowerCase();
        const flagImg = createFlagImg(langCodeForFlag, `${book.languageName} flag`);
        if (flagImg) langDisplay.appendChild(flagImg);
        langDisplay.appendChild(document.createTextNode(` ${book.languageName}`));
    } else {
        langDisplay.appendChild(document.createTextNode("Language N/A"));
    }

    const firstGenre = Array.isArray(book.genres) && book.genres.length > 0 ? book.genres[0] : "General";
    const genreEyebrow = createElement('span', 'book-genre-eyebrow', {}, String(firstGenre));

    let cefrDisplay = null;
    if (book.recommendedCEFR) {
        const levels = Array.isArray(book.recommendedCEFR) ? book.recommendedCEFR : [book.recommendedCEFR];
        const cefrText = levels.map(l => l.toUpperCase()).join('/');
        cefrDisplay = createElement('span', ['book-cefr-level'], {}, cefrText);
        if (levels.length > 0) {
             cefrDisplay.classList.add(`cefr-${levels[0].toLowerCase()}`); // For color styling
        }
    }

    const actionsDiv = createElement('div', 'book-actions');
    let hasActions = false;
    if (book.epubLink) {
        const epubBtn = createElement('button', ['download-btn', 'epub-btn'], { 'data-format': 'epub', title: `Download EPUB for ${book.title}` });
        epubBtn.innerHTML = `<i class="fas fa-book-reader"></i> EPUB`;
        actionsDiv.appendChild(epubBtn);
        hasActions = true;
    }
    if (book.pdfLink) {
        const pdfBtn = createElement('button', ['download-btn', 'pdf-btn'], { 'data-format': 'pdf', title: `Download PDF for ${book.title}` });
        pdfBtn.innerHTML = `<i class="fas fa-file-pdf"></i> PDF`;
        actionsDiv.appendChild(pdfBtn);
        hasActions = true;
    }
    if (!hasActions) {
        const noDownloadsText = createElement('p', 'no-downloads-text', {}, "No download links available.");
        actionsDiv.appendChild(noDownloadsText);
    }

    card.appendChild(coverContainer);
    card.appendChild(titleEl);
    card.appendChild(langDisplay);
    card.appendChild(genreEyebrow);
    if (cefrDisplay) card.appendChild(cefrDisplay);
    card.appendChild(actionsDiv);

    card.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('.download-btn');
        if (clickedButton) {
            const format = clickedButton.dataset.format;
            let downloadUrl = null;
            if (format === 'epub' && book.epubLink) downloadUrl = book.epubLink;
            if (format === 'pdf' && book.pdfLink) downloadUrl = book.pdfLink;

            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            } else {
                console.warn(`No ${format} link found for book ID ${book.id}`);
            }
        } else {
            if (typeof openBookModal === 'function') { // Ensure openBookModal is defined
                openBookModal(book.id);
            } else {
                console.warn("`openBookModal` function not found. Cannot open book details.");
            }
        }
    });
    return card;
}