'use strict';

document.addEventListener('DOMContentLoaded', () => {
    console.log("Aljohn Polyglot Library - High Seas Edition: DOM Loaded, Hoisting the Colors!");

    // Ensure data is available before populating UI elements that depend on it.
    // These functions rely on window.availableLanguages, window.availableGenres, window.philosophyBooks
    if (window.availableLanguages && window.availableLanguages.length > 0) {
        populateLanguageFilter();
    } else {
        console.error("Main App: `availableLanguages` data not ready or empty. Language filter may not populate.");
    }

    if (window.availableGenres && window.availableGenres.length > 0) {
        populateGenreFilter();
    } else {
        console.error("Main App: `availableGenres` data not ready or empty. Genre filter may not populate.");
    }

  if (window.philosophyBooks && window.philosophyBooks.length > 0) { // Check if data is loaded
        displayNavigationalAids(); // NEW function call
    } else {
        console.warn("Main App: Navigational Aids (philosophyBooks) data not ready or empty.");
    }
// Initialize Olly Richards Story Launchpad
    if (window.ollyRichardsBeginnerStories && typeof displayOllyRichardsStories === 'function') {
        console.log("Main App: Initializing Story Launchpad...");
        displayOllyRichardsStories();
    } else {
        console.warn("Main App: Olly Richards stories data or display function not ready.");
    }
    // Initialize other features
 initializeTipsSwitcher();
    initializeHeroAnimations();
    initializeLibraryManager(); // This will now handle initial state of genre/filetype filters
    initializeModalController();
    initializeCharacterManager(); // This should be called after libraryCharacters is available
    initializeChatbot();
    initializeAljohnsCove();

    // --- DEBUG: Log loaded data (Remove or comment out in production) ---
    if (window.publicDomainBooks) {
        console.log(`DEBUG: Loaded ${window.publicDomainBooks.length} public domain books.`);
    } else {
        console.warn("DEBUG: `publicDomainBooks` not found on window object.");
    }
    if (window.libraryCharacters) {
        console.log(`DEBUG: Loaded ${Object.keys(window.libraryCharacters).length} characters.`);
    } else {
        console.warn("DEBUG: `libraryCharacters` not found on window object.");
    }
    if (window.philosophyBooks) {
        console.log(`DEBUG: Loaded ${window.philosophyBooks.length} philosophy books.`);
    } else {
        console.warn("DEBUG: `philosophyBooks` not found on window object.");
    }
    if (window.availableLanguages) {
        console.log("DEBUG: Available languages for filter:", window.availableLanguages.map(l => l.name));
    } else {
        console.warn("DEBUG: `availableLanguages` not found on window object.");
    }
    if (window.availableGenres) {
        console.log("DEBUG: Available genres for filter:", window.availableGenres);
    } else {
        console.warn("DEBUG: `availableGenres` not found on window object.");
    }
    // --- END DEBUG ---
});