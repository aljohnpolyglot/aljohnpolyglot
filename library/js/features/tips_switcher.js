'use strict';

function initializeTipsSwitcher() {
    const tipContainer = $('.tip-card-container'); // Cache the container
    if (!tipContainer) {
        // console.log("Tip container not found, tips switcher not initialized."); // Optional: less noisy log
        return;
    }

    const tipCards = Array.from(tipContainer.querySelectorAll('.tip-card')); // Use Array.from for array methods
    const tipDotsContainer = $('.tip-dots-container'); // Assuming dots are in a container
    const tipDots = tipDotsContainer ? Array.from(tipDotsContainer.querySelectorAll('.tip-dot')) : [];

    let currentTipIndex = 0;
    let tipInterval;
    const AUTOPLAY_DELAY = 7000; // 7 seconds

    if (tipCards.length === 0) {
        // console.log("No tip cards found, tips switcher not initialized.");
        return;
    }
    // If there are cards but no dots, it can still function, just without manual dot control.
    if (tipDots.length > 0 && tipCards.length !== tipDots.length) {
        console.warn("Tip Switcher: Mismatch between number of tip cards and tip dots. Dots may not work correctly.");
    }


    function showTip(index) {
        if (index < 0 || index >= tipCards.length) {
            console.warn(`Tip Switcher: Invalid tip index ${index}`);
            return;
        }

        tipCards.forEach((card, i) => {
            card.classList.toggle('current-tip', i === index);
            card.setAttribute('aria-hidden', i !== index);
        });

        if (tipDots.length === tipCards.length) {
            tipDots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
                dot.setAttribute('aria-selected', i === index);
            });
        }
        currentTipIndex = index;
    }

    function nextTip() {
        let nextIndex = (currentTipIndex + 1) % tipCards.length;
        showTip(nextIndex);
    }

    function startTipAutoplay() {
        stopTipAutoplay(); // Clear existing interval
        if (tipCards.length > 1) { // Only autoplay if there's more than one tip
            tipInterval = setInterval(nextTip, AUTOPLAY_DELAY);
        }
    }

    function stopTipAutoplay() {
        clearInterval(tipInterval);
    }

    if (tipDots.length === tipCards.length) {
        tipDots.forEach((dot, index) => {
            dot.setAttribute('role', 'tab'); // ARIA for dots
            dot.setAttribute('aria-controls', tipCards[index].id || `tip-card-${index}`); // Link dot to card
            if (!tipCards[index].id) tipCards[index].id = `tip-card-${index}`;

            dot.addEventListener('click', () => {
                showTip(index);
                startTipAutoplay(); // Restart autoplay on manual switch
            });
        });
    }

    // Initialize first tip and ARIA roles for cards
    tipCards.forEach((card, index) => {
        card.setAttribute('role', 'tabpanel');
        if(!card.id) card.id = `tip-card-${index}`;
    });

    showTip(0);
    startTipAutoplay();

    tipContainer.addEventListener('mouseenter', stopTipAutoplay);
    tipContainer.addEventListener('mouseleave', startTipAutoplay);
}