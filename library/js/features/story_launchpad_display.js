// js/features/story_launchpad_display.js
'use strict';

function displayOllyRichardsStories() {
    const carouselContainer = $('#olly-stories-carousel');
    const prevBtn = $('#olly-carousel-prev');
    const nextBtn = $('#olly-carousel-next');

    if (!carouselContainer) {
        console.error("#olly-stories-carousel container not found.");
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    // Filter books for your 8 supported languages
    const supportedLanguageCodes = window.availableLanguages ? window.availableLanguages.map(l => l.code) : [];
    const storiesToDisplay = window.ollyRichardsBeginnerStories ? window.ollyRichardsBeginnerStories.filter(book => 
        supportedLanguageCodes.includes(book.languageCode)
    ) : [];


    if (!storiesToDisplay || storiesToDisplay.length === 0) {
        console.warn("No Olly Richards beginner stories found for the supported languages or data is missing.");
        carouselContainer.innerHTML = "<p style='padding:10px; color: var(--ink-on-parchment);'>The Captain's special beginner charts are currently being updated!</p>";
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    clearChildren(carouselContainer);

    storiesToDisplay.forEach(book => {
        // Each book is an anchor tag linking to Amazon
        const bookLink = createElement('a', 'story-book-item', {
            href: book.amazonLink,
            target: '_blank',
            rel: 'noopener noreferrer',
            title: `Order "${book.title}" on Amazon`
        });
        bookLink.dataset.bookId = book.id; // For potential future use

        const coverImg = createElement('img', 'story-cover-img', {
            src: book.coverImg || 'images/assets/open_book_flipping_icon.png',
            alt: `Cover of ${book.title || "Beginner Story Book"}`
        });
        coverImg.onerror = function() { this.src = 'images/assets/open_book_flipping_icon.png'; };
        
        const langInfoDiv = createElement('div', 'story-language-info');
        
        // Ensure flag_cdn_helper.js is loaded and languageToFlagCode is available
        const langCodeForFlag = (typeof languageToFlagCode !== 'undefined' && languageToFlagCode[book.languageCode.toLowerCase()])
                                ? languageToFlagCode[book.languageCode.toLowerCase()]
                                : book.languageCode.toLowerCase();
        const flagImg = createFlagImg(langCodeForFlag, `${book.languageName} flag`, 'w20'); // w20 for small flag
        
        if (flagImg) {
            langInfoDiv.appendChild(flagImg);
        }
        langInfoDiv.appendChild(document.createTextNode(book.languageName || book.languageCode.toUpperCase()));

        bookLink.appendChild(coverImg);
        bookLink.appendChild(langInfoDiv);
        carouselContainer.appendChild(bookLink);
    });

    // Basic Carousel Arrow Functionality
    if (prevBtn && nextBtn && storiesToDisplay.length > 3) { // Only show arrows if enough items for scrolling
        prevBtn.style.display = 'block';
        nextBtn.style.display = 'block';

        const scrollAmount = carouselContainer.querySelector('.story-book-item')?.offsetWidth * 2 || 280; // Scroll by approx 2 items

        prevBtn.addEventListener('click', () => {
            carouselContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        nextBtn.addEventListener('click', () => {
            carouselContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    } else {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    }
}

// In main_app.js, call this function
// document.addEventListener('DOMContentLoaded', () => {
//     // ...
//     if (window.ollyRichardsBeginnerStories) { // Check if data is loaded
//          displayOllyRichardsStories();
//     }
//     // ...
// });