// js/features/hero_animations.js

function initializeHeroAnimations() {
    const flagsContainer = $('#floating-flags-container');
    const shipIcon = $('#library-ship-icon');

    // console.log("Flags container:", flagsContainer);
    // console.log("Ship icon:", shipIcon);
    // console.log("Available languages for hero animations:", window.availableLanguages);


    if (!flagsContainer || !shipIcon) {
        console.warn("Hero animation critical elements (flags container or ship icon) not found. Skipping flag animation.");
        return;
    }
    if (!window.availableLanguages || window.availableLanguages.length === 0) {
        console.warn("`availableLanguages` data not found or empty. Skipping flag animation.");
        return;
    }


    // Languages Aljohn speaks (for the flags)
    const aljohnsLanguages = window.availableLanguages.map(lang => lang.code);

    // Clear existing flags before adding new ones (important for resize)
    clearChildren(flagsContainer);


    aljohnsLanguages.forEach((langCode, index) => {
        const countryCode = languageToFlagCode[langCode] || langCode;
        const langData = window.availableLanguages.find(l => l.code === langCode);
        const flagAlt = `${langData ? langData.name : langCode.toUpperCase()} Flag`;
        const flagImg = createFlagImg(countryCode, flagAlt, 'w40', ['floating-flag']);

        if (flagImg) {
            const angle = (index / aljohnsLanguages.length) * 2 * Math.PI + (Math.PI / 4); // Stagger start angle
            const radiusHorizontal = shipIcon.offsetWidth * 0.55 + Math.random() * 25;
            const radiusVertical = shipIcon.offsetHeight * 0.3 + Math.random() * 20;

            const shipRect = shipIcon.getBoundingClientRect();
            const containerRect = flagsContainer.getBoundingClientRect();

            const shipCenterXInContainer = (shipRect.left - containerRect.left) + shipRect.width / 2;
            const shipCenterYInContainer = (shipRect.top - containerRect.top) + shipRect.height / 2.5; // Slightly above ship's visual center

            let x = shipCenterXInContainer + radiusHorizontal * Math.cos(angle) - (flagImg.width || 40) / 2; // Use default if width not yet known
            let y = shipCenterYInContainer + radiusVertical * Math.sin(angle) - (flagImg.height || 27) / 2; // Use default

            // Clamp positions to be within the flagsContainer, with some padding
            const padding = 5;
            x = Math.max(padding, Math.min(x, flagsContainer.offsetWidth - (flagImg.width || 40) - padding));
            y = Math.max(padding, Math.min(y, flagsContainer.offsetHeight - (flagImg.height || 27) - padding));

            flagImg.style.left = `${x}px`;
            flagImg.style.top = `${y}px`;
            flagImg.style.animationDelay = `${Math.random() * 1.5}s`;

            flagsContainer.appendChild(flagImg);
        }
    });
}

// Debounced resize handler
let resizeTimeoutHero;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeoutHero);
    resizeTimeoutHero = setTimeout(() => {
        // console.log("Resizing, re-initializing hero flags.");
        initializeHeroAnimations();
    }, 250);
});