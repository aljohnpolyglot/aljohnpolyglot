'use strict';

function populateLanguageFilter() {
    const languageFilterSelect = $('#language-filter');

    if (!languageFilterSelect) {
        console.error("Language filter select element (#language-filter) not found. Cannot populate.");
        return;
    }
    if (!window.availableLanguages || !Array.isArray(window.availableLanguages) || window.availableLanguages.length === 0) {
        console.error("`window.availableLanguages` data is missing, not an array, or empty. Cannot populate language filter.");
        languageFilterSelect.disabled = true;
        return;
    }
    languageFilterSelect.disabled = false;

    while (languageFilterSelect.options.length > 1) {
        languageFilterSelect.remove(1);
    }

    window.availableLanguages.forEach(lang => {
        if (lang && typeof lang.code === 'string' && typeof lang.name === 'string') {
            const option = createElement('option', [], { value: lang.code }, lang.name);
            languageFilterSelect.appendChild(option);
        } else {
            console.warn("Skipping invalid language data for filter:", lang);
        }
    });
}

function populateGenreFilter(languageCode = "") {
    const genreFilterSelect = $('#genre-filter');

    if (!genreFilterSelect) {
        console.error("Genre filter select element (#genre-filter) not found. Cannot populate.");
        return;
    }

    while (genreFilterSelect.options.length > 1) {
        genreFilterSelect.remove(1);
    }

    if (!window.publicDomainBooks || !Array.isArray(window.publicDomainBooks)) {
        console.error("`publicDomainBooks` data is missing or not an array. Cannot determine genres.");
        genreFilterSelect.disabled = true;
        return;
    }

    let relevantBooks = window.publicDomainBooks;
    if (languageCode) {
        relevantBooks = window.publicDomainBooks.filter(book => book.language === languageCode);
    }

    if (relevantBooks.length === 0 && languageCode) {
        genreFilterSelect.disabled = true;
        return;
    }

    const uniqueGenres = new Set();
    relevantBooks.forEach(book => {
        if (Array.isArray(book.genres)) {
            book.genres.forEach(genre => {
                if (typeof genre === 'string' && genre.trim() !== '') {
                    uniqueGenres.add(genre.trim());
                }
            });
        }
    });

    if (uniqueGenres.size === 0) {
        genreFilterSelect.disabled = true;
        return;
    }
    genreFilterSelect.disabled = false;

    const sortedGenres = Array.from(uniqueGenres).sort();
    sortedGenres.forEach(genre => {
        const optionValue = genre.toLowerCase().replace(/\s+/g, '-').replace(/'/g, '');
        const option = createElement('option', [], { value: optionValue }, genre);
        genreFilterSelect.appendChild(option);
    });
}

/**
 * Populates the CEFR filter based on available CEFR levels in books for a given language.
 * @param {string} [languageCode=""] - The language code to filter CEFR levels by.
 */
function populateCEFRFilter(languageCode = "") {
    const cefrFilterSelect = $('#cefr-filter');

    if (!cefrFilterSelect) {
        console.error("CEFR filter select element (#cefr-filter) not found.");
        return;
    }

    while (cefrFilterSelect.options.length > 1) { // Clear existing except "All Levels"
        cefrFilterSelect.remove(1);
    }

    // Ensure necessary global data is available
    if (!window.publicDomainBooks || !Array.isArray(window.publicDomainBooks) ||
        !window.availableCEFRLevels || !Array.isArray(window.availableCEFRLevels)) {
        console.error("Book data or `window.availableCEFRLevels` is missing or invalid for CEFR filter population.");
        cefrFilterSelect.disabled = true;
        return;
    }

    let relevantBooks = window.publicDomainBooks;
    if (languageCode) {
        relevantBooks = window.publicDomainBooks.filter(book => book.language === languageCode);
    }
    
    const uniqueCEFRForLang = new Set();
    relevantBooks.forEach(book => {
        if (book.recommendedCEFR) {
            if (Array.isArray(book.recommendedCEFR)) {
                book.recommendedCEFR.forEach(level => {
                    if (typeof level === 'string' && level.trim() !== '') {
                        uniqueCEFRForLang.add(level.trim().toUpperCase());
                    }
                });
            } else if (typeof book.recommendedCEFR === 'string' && book.recommendedCEFR.trim() !== '') {
                uniqueCEFRForLang.add(book.recommendedCEFR.trim().toUpperCase());
            }
        }
    });

    if (uniqueCEFRForLang.size === 0) {
        // console.log(`No specific CEFR levels found in books for language ${languageCode}.`);
        cefrFilterSelect.disabled = true; // Disable if no books for this lang have CEFR data.
        return;
    }
    
    cefrFilterSelect.disabled = false;

    // Filter the standard CEFR levels list to only those present for the current language selection
    // and maintain the standard A1-C2 order.
    const sortedCEFRForFilter = window.availableCEFRLevels.filter(standardLevel =>
        uniqueCEFRForLang.has(standardLevel.toUpperCase())
    );

    sortedCEFRForFilter.forEach(level => {
        // Value for the option should be lowercase for consistency if currentFilters.cefr expects lowercase
        const option = createElement('option', [], { value: level.toLowerCase() }, level.toUpperCase());
        cefrFilterSelect.appendChild(option);
    });
}