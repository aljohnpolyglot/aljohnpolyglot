'use strict';

// --- Global variables for filters and pagination ---
let currentFilters = {
    language: "",
    genre: "",
    filetype: "",
    cefr: "",       // Filter is present, though CEFR level not shown on card
    searchTerm: ""
};

let currentPage = 1;
const BOOKS_PER_PAGE = 6; // Or your preferred number for pagination
let totalFilteredBooks = []; // Stores all books matching current filters, before pagination

// --- Helper function for "Choose Language" notification ---
function showChooseLanguageNotification() {
    alert("Avast! Please select a language first to use this filter or search.");
    // Optional: focus back on the language select
    // const languageFilterSelect = $('#language-filter');
    // if (languageFilterSelect) languageFilterSelect.focus();
}

// --- Initialization Function ---
function initializeLibraryManager() {
    // DOM Element Selectors
    const libraryGrid = $('#library-grid');
    const mainMessageArea = $('#library-main-message-area');
    const languageFilterSelect = $('#language-filter');
    const searchBarInput = $('#search-bar-input');
    const searchBarBtn = $('#search-bar-btn');
    const genreFilterSelect = $('#genre-filter');
    const filetypeFilterSelect = $('#filetype-filter');
    const cefrFilterSelect = $('#cefr-filter');
    const resetFiltersBtn = $('#reset-filters-btn');
    const prevPageBtn = $('#prev-page-btn');
    const nextPageBtn = $('#next-page-btn');

    // Check if all essential elements are present
    if (!libraryGrid || !mainMessageArea || !languageFilterSelect || !searchBarInput || !searchBarBtn ||
        !genreFilterSelect || !filetypeFilterSelect || !cefrFilterSelect || !resetFiltersBtn ||
        !prevPageBtn || !nextPageBtn) {
        console.error("Library Manager: One or more essential DOM elements are missing. Functionality will be impaired.");
        [languageFilterSelect, searchBarInput, searchBarBtn, genreFilterSelect, filetypeFilterSelect, cefrFilterSelect, resetFiltersBtn, prevPageBtn, nextPageBtn].forEach(el => {
            if (el) el.disabled = true;
        });
        return;
    }

    // Initial state for dependent filters: disabled and empty
    searchBarInput.disabled = true;
    searchBarBtn.disabled = true;
    genreFilterSelect.disabled = true;
    filetypeFilterSelect.disabled = true;
    cefrFilterSelect.disabled = true;
    while (genreFilterSelect.options.length > 1) genreFilterSelect.remove(1);
    while (cefrFilterSelect.options.length > 1) cefrFilterSelect.remove(1);

    updateLibraryMessageArea(); // Show default welcome message
    renderBooks(); // Initial render

    // --- Event Listeners for Filters ---
    languageFilterSelect.addEventListener('change', (e) => {
        currentFilters.language = e.target.value;
        currentFilters.searchTerm = ""; 
        searchBarInput.value = "";      
        currentFilters.genre = "";
        currentFilters.filetype = "";
        currentFilters.cefr = "";
        genreFilterSelect.value = "";
        filetypeFilterSelect.value = "";
        cefrFilterSelect.value = "";
        currentPage = 1;

        const languageSelected = !!currentFilters.language;
        searchBarInput.disabled = !languageSelected;
        searchBarBtn.disabled = !languageSelected;
        filetypeFilterSelect.disabled = !languageSelected;

        if (languageSelected) {
            populateGenreFilter(currentFilters.language); 
            populateCEFRFilter(currentFilters.language);  
            genreFilterSelect.disabled = genreFilterSelect.options.length <= 1;
            cefrFilterSelect.disabled = cefrFilterSelect.options.length <= 1;
        } else {
            genreFilterSelect.disabled = true;
            cefrFilterSelect.disabled = true;
            while (genreFilterSelect.options.length > 1) genreFilterSelect.remove(1);
            while (cefrFilterSelect.options.length > 1) cefrFilterSelect.remove(1);
        }
        updateLibraryMessageArea(currentFilters.language);
        renderBooks();
        document.dispatchEvent(new CustomEvent('languageFilterChanged', {
            detail: { languageCode: e.target.value }
        }));
    });

    const performSearch = () => {
        if (!currentFilters.language) {
            showChooseLanguageNotification();
            searchBarInput.value = ""; 
            return; 
        }
        currentFilters.searchTerm = searchBarInput.value.trim().toLowerCase();
        currentPage = 1;
        renderBooks();
    };

    searchBarBtn.addEventListener('click', performSearch);
    searchBarInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            performSearch(); // Will correctly show notification if no lang
        }
    });
    searchBarInput.addEventListener('search', () => { 
        if (searchBarInput.value.trim() === '') { // If input is cleared
             // performSearch will handle if language is not selected
            performSearch();
        }
    });

    genreFilterSelect.addEventListener('change', (e) => {
        if (!currentFilters.language) {
            showChooseLanguageNotification();
            e.target.value = ""; 
            return; 
        }
        currentFilters.genre = e.target.value;
        currentPage = 1; renderBooks();
    });

    filetypeFilterSelect.addEventListener('change', (e) => {
        if (!currentFilters.language) {
            showChooseLanguageNotification();
            e.target.value = ""; 
            return; 
        }
        currentFilters.filetype = e.target.value;
        currentPage = 1; renderBooks();
    });

    cefrFilterSelect.addEventListener('change', (e) => {
        if (!currentFilters.language) {
            showChooseLanguageNotification();
            e.target.value = ""; 
            return; 
        }
        currentFilters.cefr = e.target.value;
        currentPage = 1; renderBooks();
    });

    resetFiltersBtn.addEventListener('click', () => {
        languageFilterSelect.value = "";
        searchBarInput.value = ""; 
        genreFilterSelect.value = "";
        filetypeFilterSelect.value = "";
        cefrFilterSelect.value = "";
        currentFilters = { language: "", searchTerm: "", genre: "", filetype: "", cefr: "" };
        currentPage = 1;

        searchBarInput.disabled = true; 
        searchBarBtn.disabled = true;
        genreFilterSelect.disabled = true;
        filetypeFilterSelect.disabled = true;
        cefrFilterSelect.disabled = true;
        while (genreFilterSelect.options.length > 1) genreFilterSelect.remove(1);
        while (cefrFilterSelect.options.length > 1) cefrFilterSelect.remove(1);
        
        updateLibraryMessageArea();
        renderBooks();
        document.dispatchEvent(new CustomEvent('languageFilterChanged', {
            detail: { languageCode: "" }
        }));
    });

    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBooks(false); 
        }
    });
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(totalFilteredBooks.length / BOOKS_PER_PAGE);
        if (currentPage < totalPages) {
            currentPage++;
            renderBooks(false); 
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
    clearChildren(messageArea);

    if (languageCode && window.libraryCharacters && window.availableLanguages) {
        const character = Object.values(window.libraryCharacters).find(c => c.languageCode === languageCode);
        const langInfo = window.availableLanguages.find(l => l.code === languageCode);

        if (character && langInfo) {
            const hookContainer = createElement('div', 'language-hook-container');
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
            messageArea.style.textAlign = 'left'; 
            return;
        }
    }
    
    const libraryTitleEl = createElement('h1', 'library-main-title', {}, "The Crew's Collection: Choose Your Tongue");
    messageArea.appendChild(libraryTitleEl);
    const welcomeParagraphContent = "Our dedicated crew, champions of many tongues, have gathered these literary treasures. Select a language using the filters aport, and let its guardian steer your voyage into a world of stories!";
    const welcomeTextEl = createElement('p', 'initial-welcome-message', {}, welcomeParagraphContent);
    const crewPhoto = createElement('img', [], {
        src: 'images/characters/library_characters_group.png',
        alt: 'The Esteemed Crew of the Aljohn Polyglot Library',
        id: 'crew-group-photo'
    });
    messageArea.appendChild(welcomeTextEl);
    messageArea.appendChild(crewPhoto);
    messageArea.style.textAlign = 'center';
}

// --- Function to Render Books (with Filtering and Pagination) ---
function renderBooks(refilter = true) {
    const libraryGrid = $('#library-grid');
    const mainMessageArea = $('#library-main-message-area'); 
    const paginationControls = $('#pagination-controls');
    const pageInfoSpan = $('#page-info');
    const prevPageBtn = $('#prev-page-btn');
    const nextPageBtn = $('#next-page-btn');

    if (!libraryGrid || !mainMessageArea || !paginationControls || !pageInfoSpan || !prevPageBtn || !nextPageBtn) {
        console.error("RenderBooks: One or more DOM elements for book display or pagination are missing.");
        return;
    }
    clearChildren(libraryGrid);

    if (refilter) {
        if (!window.publicDomainBooks || !Array.isArray(window.publicDomainBooks)) {
            clearChildren(mainMessageArea);
            mainMessageArea.appendChild(createElement('p', ['initial-welcome-message'], {}, "Shiver me timbers! The book data seems to be lost at sea. Refresh the page or check back later."));
            mainMessageArea.style.textAlign = 'center';
            libraryGrid.style.display = 'none';
            paginationControls.style.display = 'none';
            return;
        }

        if (!currentFilters.language) {
            libraryGrid.style.display = 'none';
            paginationControls.style.display = 'none';
            return; 
        }

        totalFilteredBooks = window.publicDomainBooks.filter(book => {
            if (!book || typeof book !== 'object') return false;
            const langMatch = book.language === currentFilters.language;
            const bookGenresNormalized = Array.isArray(book.genres) ?
                book.genres.map(g => String(g).toLowerCase().replace(/\s+/g, '-').replace(/'/g, '')) : [];
            const genreMatch = !currentFilters.genre || bookGenresNormalized.includes(currentFilters.genre);
            let cefrMatch = true;
            if (currentFilters.cefr) { 
                if (book.recommendedCEFR) {
                    const bookCEFRLevels = (Array.isArray(book.recommendedCEFR) ? book.recommendedCEFR : [book.recommendedCEFR]).map(l => String(l).toLowerCase());
                    cefrMatch = bookCEFRLevels.includes(String(currentFilters.cefr).toLowerCase());
                } else {
                    cefrMatch = false; 
                }
            }
            let filetypeMatch = true;
            if (currentFilters.filetype === "pdf") filetypeMatch = !!book.pdfLink;
            else if (currentFilters.filetype === "epub") filetypeMatch = !!book.epubLink;
            let searchMatch = true;
            if (currentFilters.searchTerm) {
                const searchTermVal = currentFilters.searchTerm; 
                const titleMatch = book.title && book.title.toLowerCase().includes(searchTermVal);
                const authorMatch = book.author && book.author.toLowerCase().includes(searchTermVal);
                searchMatch = titleMatch || authorMatch;
            }
            return langMatch && searchMatch && genreMatch && filetypeMatch && cefrMatch;
        });
    }

    if (totalFilteredBooks.length === 0 && currentFilters.language) {
        clearChildren(mainMessageArea); 
        let noResultsMessage = "Avast! No tomes match yer current charts. Try a different course or reset the filters!";
        // Get the search input element, but check if it exists first
        const searchBarElement = $('#search-bar-input');
        const currentSearchValue = searchBarElement ? searchBarElement.value : currentFilters.searchTerm;

        if (currentFilters.searchTerm) {
            noResultsMessage = `Shiver me timbers! No books found for "${currentSearchValue}" in this language. Try widening yer search!`;
        }
        const noMatchText = createElement('p', 'initial-welcome-message', {}, noResultsMessage);
        mainMessageArea.appendChild(noMatchText);
        mainMessageArea.style.textAlign = 'center';
        libraryGrid.style.display = 'none';
        paginationControls.style.display = 'none';
    } else if (totalFilteredBooks.length > 0) {
        if (currentFilters.language && (refilter || mainMessageArea.querySelector('.initial-welcome-message'))) {
            updateLibraryMessageArea(currentFilters.language);
        }
        libraryGrid.style.display = 'grid'; 
        
        const totalPages = Math.ceil(totalFilteredBooks.length / BOOKS_PER_PAGE);
        if (refilter || currentPage > totalPages) { 
             if (totalPages > 0) { currentPage = 1; } else { currentPage = 0; } 
        }
        currentPage = Math.max(1, currentPage); 

        const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
        const endIndex = startIndex + BOOKS_PER_PAGE;
        const booksToDisplay = totalFilteredBooks.slice(startIndex, endIndex);

        booksToDisplay.forEach(book => {
            const bookCard = createBookCard(book); 
            if (bookCard) libraryGrid.appendChild(bookCard);
        });

        if (totalPages > 0) {
            paginationControls.style.display = 'block';
            pageInfoSpan.textContent = `Page ${currentPage} of ${totalPages}`;
            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;
        } else {
            paginationControls.style.display = 'none';
        }
    } else {
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
    coverContainer.style.position = 'relative'; 

    if (book.language) {
        const langCodeForFlag = (typeof languageToFlagCode !== 'undefined' && languageToFlagCode[book.language.toLowerCase()])
                                ? languageToFlagCode[book.language.toLowerCase()]
                                : book.language.toLowerCase();
        const flagImg = createFlagImg(langCodeForFlag, `${book.languageName || book.language} flag`, 'w20', ['card-cover-flag-icon']); 
        if (flagImg) {
            coverContainer.appendChild(flagImg);
        }
    }

    const coverImg = createElement('img', 'book-cover-img', {
        src: book.coverImg || 'images/assets/open_book_flipping_icon.png',
        alt: `Cover of ${book.title}`
    });
    coverImg.onerror = function() {
        this.src = 'images/assets/open_book_flipping_icon.png';
        this.alt = 'Fallback book cover image';
    };
    coverContainer.appendChild(coverImg);
    card.appendChild(coverContainer);

    const titleEl = createElement('h3', 'book-title', {}, book.title);
    card.appendChild(titleEl);

    if (book.author) {
         const authorEl = createElement('p', 'book-author-card', {}, `by ${book.author}`);
         card.appendChild(authorEl);
    }

    const firstGenre = Array.isArray(book.genres) && book.genres.length > 0 ? book.genres[0] : "General";
    const genreEyebrow = createElement('span', 'book-genre-eyebrow', {}, String(firstGenre));
    card.appendChild(genreEyebrow);

    // CEFR display is NOT on the card

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
    if (!hasActions && actionsDiv.children.length === 0) {
        const noDownloadsText = createElement('p', 'no-downloads-text', {}, "No download links.");
        actionsDiv.appendChild(noDownloadsText);
    }
    card.appendChild(actionsDiv);

    card.addEventListener('click', (event) => {
        const clickedButton = event.target.closest('.download-btn');
        if (clickedButton) {
            event.stopPropagation(); 
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
            if (typeof openBookModal === 'function') {
                openBookModal(book.id);
            } else {
                console.warn("`openBookModal` function not found.");
            }
        }
    });
    return card;
}