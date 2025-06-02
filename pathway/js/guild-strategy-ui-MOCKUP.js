// --- js/guild-strategy-ui-MOCKUP.js ---

// DOM Element References - these are assigned by cacheDOMElements_MOCKUP
let pageDynamicBackgroundEl, progressionMapImageEl, questContentPlaceholderEl;
let phaseContentElements = {}; // Object to store references to each phase's content div
let toolModalEl, toolModalTitleEl, toolModalIconEl, toolModalBodyEl, toolModalAljohnNoteEl;
let mapRegionButtonElements; // NodeList
let prevPhaseButtonEl, nextPhaseButtonEl;

const DEFAULT_PAGE_BACKGROUND_UI = 'assets/pathway_epic_journey_montage.png';
const DEFAULT_MAP_IMAGE_UI = 'assets/roadmap_map_bg_notext.png';
const UI_ANIMATION_DURATION = 400; // ms - Match with CSS for .quest-phase-content-MOCKUP
const UI_TAB_ANIMATION_DURATION = 350; // ms - Match with CSS for .tab-content-MOCKUP
const UI_MODAL_ANIMATION_DURATION = 300; // ms - Match with CSS for #guild-tool-modal

/**
 * Caches references to frequently used DOM elements.
 */
function cacheDOMElements_MOCKUP() {
    pageDynamicBackgroundEl = document.getElementById('page-dynamic-background-MOCKUP');
    progressionMapImageEl = document.getElementById('progression-map-image-MOCKUP');
    questContentPlaceholderEl = document.getElementById('quest-content-placeholder-MOCKUP');

    if (typeof phaseOrder !== 'undefined' && Array.isArray(phaseOrder)) {
        phaseOrder.forEach(phaseId => {
            const elementId = `${phaseId}-content-MOCKUP`;
            const element = document.getElementById(elementId);
            if (element) {
                phaseContentElements[phaseId] = element;
            }
        });
    } else {
        console.error("UI Cache: phaseOrder is not defined or not an array. Phase content elements not cached.");
    }

    toolModalEl = document.getElementById('guild-tool-modal');
    if (toolModalEl) {
        toolModalTitleEl = document.getElementById('tool-modal-title');
        toolModalIconEl = document.getElementById('tool-modal-icon');
        toolModalBodyEl = document.getElementById('tool-modal-body');
        toolModalAljohnNoteEl = document.getElementById('tool-modal-aljohn-note');
    }
    mapRegionButtonElements = document.querySelectorAll('.map-region-button-MOCKUP');
    prevPhaseButtonEl = document.getElementById('prev-phase-btn-MOCKUP');
    nextPhaseButtonEl = document.getElementById('next-phase-btn-MOCKUP');
}

/**
 * Updates the main page background image with a fade transition.
 */
function updatePageBackground_MOCKUP(imageSrc) {
    if (!pageDynamicBackgroundEl) return;
    const targetImage = imageSrc || DEFAULT_PAGE_BACKGROUND_UI;
    const newBgStyle = `url("${targetImage}")`;

    if (pageDynamicBackgroundEl.style.backgroundImage !== newBgStyle || !pageDynamicBackgroundEl.classList.contains('visible')) {
        pageDynamicBackgroundEl.classList.remove('visible');
        setTimeout(() => {
            pageDynamicBackgroundEl.style.backgroundImage = newBgStyle;
            pageDynamicBackgroundEl.classList.add('visible');
        }, 350);
    }
}

/**
 * Updates the main progression map image in the left panel.
 */
function updateProgressionMapImage_MOCKUP(newImageSrc) {
    if (!progressionMapImageEl) return;

    const finalMapSrc = newImageSrc || DEFAULT_MAP_IMAGE_UI;

    // Get just the filename for comparison to avoid issues with full paths if base URL changes
    const currentSrcFilename = progressionMapImageEl.src.substring(progressionMapImageEl.src.lastIndexOf('/') + 1);
    const targetSrcFilename = finalMapSrc.substring(finalMapSrc.lastIndexOf('/') + 1);

    if (currentSrcFilename !== targetSrcFilename) {
        // 1. Start fading out the current image (if it's fully opaque)
        //    If it's already partially transparent, we might skip this or adjust.
        if (parseFloat(progressionMapImageEl.style.opacity || 1) === 1) {
            progressionMapImageEl.style.opacity = 0; // Start fade out
        }

        // 2. After a short delay (enough for the fade-out to begin visually but not complete),
        //    change the src and then fade it back in.
        //    The key is that the element itself doesn't go to display:none.
        setTimeout(() => {
            progressionMapImageEl.src = finalMapSrc;
            // The 'load' event ensures the new image is loaded before we make it opaque again.
            // This prevents a flash of the old image or an empty space if the new image takes time to load.
            progressionMapImageEl.onload = () => {
                progressionMapImageEl.style.opacity = 1; // Fade in the new image
                progressionMapImageEl.onload = null; // Clean up the event listener
            };
            // Fallback if onload doesn't fire quickly or for cached images
            // (though modern browsers are good, this is a safety net)
            // If the image is already cached, onload might not fire.
            // So, if it's the same src that was just set, we can assume it's ready.
            if (progressionMapImageEl.src === finalMapSrc && parseFloat(progressionMapImageEl.style.opacity) === 0) {
                 setTimeout(() => { progressionMapImageEl.style.opacity = 1; }, 20); // Tiny delay then fade in
            }

        }, 150); // Half of the opacity transition duration (0.3s / 2 = 150ms)
                 // Adjust this timeout. Shorter = more of a direct switch feel.
                 // Longer = more noticeable fade out before switch.
    } else if (parseFloat(progressionMapImageEl.style.opacity || 1) < 1 && progressionMapImageEl.src === finalMapSrc) {
        // If it's the correct image but somehow hidden, just fade it in.
        progressionMapImageEl.style.opacity = 1;
    }
}

/**
 * Updates the 'active' class on the map region selector buttons.
 */
function updateActiveMapButton_MOCKUP(activePhaseId) {
    if (!mapRegionButtonElements) return;
    mapRegionButtonElements.forEach(btn => {
        const isMainLearningPhaseButton = ['phase-beginner', 'phase-intermediate', 'phase-advanced'].includes(btn.dataset.phaseId);
        btn.classList.toggle('active', isMainLearningPhaseButton && btn.dataset.phaseId === activePhaseId);
    });
}

/**
 * Shows the content for the selected phase in the right panel and hides others.
 */
function showQuestPhaseContent_MOCKUP(phaseIdToShow) {
    Object.values(phaseContentElements).forEach(contentEl => {
        if (contentEl) {
            contentEl.classList.remove('visible');
            contentEl.style.display = 'none';
        }
    });

    if (questContentPlaceholderEl) {
        const shouldShowPlaceholder = !phaseIdToShow || !phaseContentElements[phaseIdToShow];
        if (shouldShowPlaceholder) {
            questContentPlaceholderEl.style.display = 'flex';
            questContentPlaceholderEl.classList.add('placeholder-active-MOCKUP');
            questContentPlaceholderEl.classList.remove('visible');
            void questContentPlaceholderEl.offsetWidth;
            questContentPlaceholderEl.classList.add('visible');
        } else {
            questContentPlaceholderEl.style.display = 'none';
            questContentPlaceholderEl.classList.remove('placeholder-active-MOCKUP');
            questContentPlaceholderEl.classList.remove('visible');
        }
    }

    if (phaseIdToShow && phaseContentElements[phaseIdToShow]) {
        const targetEl = phaseContentElements[phaseIdToShow];
        targetEl.style.display = 'flex';
        void targetEl.offsetWidth;
        targetEl.classList.add('visible');
    }
}


/**
 * Populates the tool modal with data for the selected tool.
 */
function populateToolModal_MOCKUP(toolData) {
    if (!toolModalEl || !toolData || !toolModalTitleEl || !toolModalBodyEl || !toolModalAljohnNoteEl) {
        console.error("Tool modal elements or toolData missing for populating.");
        return;
    }
    let currentIconEl = document.getElementById('tool-modal-icon');

    toolModalTitleEl.textContent = toolData.name || "Tool Details";

    if (toolData.icon && currentIconEl) {
        const isFaIcon = toolData.icon.startsWith('fas ') || toolData.icon.startsWith('fab ');
        if (isFaIcon) {
            if (currentIconEl.tagName !== 'I') {
                const i = document.createElement('i'); i.id = 'tool-modal-icon';
                currentIconEl.parentNode.replaceChild(i, currentIconEl);
                toolModalIconEl = i; currentIconEl = i;
            }
            currentIconEl.className = ''; currentIconEl.classList.add('tool-modal-icon-fa', ...toolData.icon.split(' '));
            if(currentIconEl.hasAttribute('src')) currentIconEl.removeAttribute('src');
            if(currentIconEl.hasAttribute('alt')) currentIconEl.removeAttribute('alt');
        } else {
             if (currentIconEl.tagName !== 'IMG') {
                const img = document.createElement('img'); img.id = 'tool-modal-icon';
                currentIconEl.parentNode.replaceChild(img, currentIconEl);
                toolModalIconEl = img; currentIconEl = img;
            }
            currentIconEl.src = toolData.icon; currentIconEl.alt = (toolData.name || "Tool") + " Icon";
            currentIconEl.className = 'tool-modal-icon-img';
        }
        currentIconEl.style.display = '';
    } else if (currentIconEl) {
        currentIconEl.style.display = 'none';
    }

    let bodyHTML = '';
    if (toolData.rating) {
        const ratingClass = toolData.rating.toLowerCase().replace(/[^a-z0-9\s]+/g, '').replace(/\s+/g, '-').replace(/-+$/, '');
        bodyHTML += `<p class="tool-rating-wrapper"><strong>Guild Rating:</strong> <span class="rating rating-${ratingClass}">${toolData.rating}</span></p>`;
    }
    bodyHTML += toolData.description || "<p>No specific details available.</p>";
    if (toolData.url) {
        bodyHTML += `<p class="tool-link-wrapper"><a href="${toolData.url}" target="_blank" class="btn btn-guild-primary">Visit Tool Shrine</a></p>`;
    }
    toolModalBodyEl.innerHTML = bodyHTML;

    if (toolData.aljohnNote) {
        toolModalAljohnNoteEl.innerHTML = `<strong>Aljohn's Scroll Notes:</strong><p>${toolData.aljohnNote}</p>`;
        toolModalAljohnNoteEl.style.display = 'block';
    } else {
        toolModalAljohnNoteEl.style.display = 'none';
    }
}

/**
 * Opens the tool modal.
 */
function openToolModal_MOCKUP() {
    if (toolModalEl) {
        toolModalEl.style.display = 'flex';
        setTimeout(() => {
            toolModalEl.classList.add('visible');
        }, 10);
    }
}

/**
 * Closes the tool modal.
 */
function closeToolModal_MOCKUP() {
    if (toolModalEl) {
        toolModalEl.classList.remove('visible');
        setTimeout(() => {
            if (!toolModalEl.classList.contains('visible')) {
                toolModalEl.style.display = 'none';
            }
        }, UI_MODAL_ANIMATION_DURATION);
    }
}

/**
 * Updates the enabled/disabled state of Previous/Next phase navigation buttons.
 */
function updateNavigationButtons_MOCKUP(currentIndex, currentPhaseOrderArray) {
    if (!currentPhaseOrderArray || typeof currentIndex === 'undefined') return;
    if (prevPhaseButtonEl) prevPhaseButtonEl.disabled = currentIndex <= 0;
    if (nextPhaseButtonEl) nextPhaseButtonEl.disabled = currentIndex >= currentPhaseOrderArray.length - 1;
}

/**
 * Initializes tab functionality for a given phase content element.
 * @param {HTMLElement} phaseContentElement - The container div for the phase's content.
 */
function initializeTabsForPhaseUI_MOCKUP(phaseContentElement) {
    if (!phaseContentElement) { return; }
    const tabNav = phaseContentElement.querySelector('.tab-nav-MOCKUP');
    if (!tabNav) { return; }

    // Get live collections of buttons and content panes within this specific phase
    const tabButtonsInPhase = phaseContentElement.querySelectorAll('.tab-button-MOCKUP');
    const tabContentsInPhase = phaseContentElement.querySelectorAll('.tab-content-MOCKUP');

    if (tabButtonsInPhase.length === 0) { return; }

    const handleTabClick = (event) => {
        const clickedButton = event.currentTarget;

        // 1. Deactivate all buttons within this specific phase's tab set
        tabButtonsInPhase.forEach(btn => btn.classList.remove('active'));
        //    Hide all content panes within this specific phase's tab set
        tabContentsInPhase.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none'; // Explicitly hide
        });

        // 2. Activate the clicked button
        clickedButton.classList.add('active');

        // 3. Identify and show the target content pane
        const targetTabId = clickedButton.dataset.tab;
        const targetContent = phaseContentElement.querySelector(`#${targetTabId}`); // Query within this phase

        if (targetContent) {
            targetContent.style.display = 'block'; // Or 'flex' if its internal layout needs it
            void targetContent.offsetWidth;        // Force reflow for CSS transition
            targetContent.classList.add('active');  // Add class to trigger CSS transition
        }
    };

    // Add event listeners to the buttons currently in the DOM for this phase
    tabButtonsInPhase.forEach(button => {
        // If listeners might be added multiple times, a more robust removal or flagging system is needed.
        // For now, this simple addition assumes initializeTabs is called when a phase becomes newly visible.
        // To be absolutely safe from duplicate listeners on the *same physical button elements* if this
        // function is called repeatedly without DOM changes, you'd remove old before adding.
        // However, if you *clone* buttons (as in some previous versions), this isn't an issue for the cloned copy.
        // Let's stick to adding to the existing buttons for now, assuming clean setup.
        button.removeEventListener('click', handleTabClick); // Remove old listener if any
        button.addEventListener('click', handleTabClick);
    });

    // Default tab activation logic
    let activeTabButtonInHTML = phaseContentElement.querySelector('.tab-button-MOCKUP.active');

    if (activeTabButtonInHTML) {
        // If an 'active' class was already on a button (e.g. set by HTML), simulate a click
        // to ensure its content is displayed and transitions run.
        activeTabButtonInHTML.click();
    } else if (tabButtonsInPhase.length > 0) {
        // If no button is marked active, activate the first one.
        tabButtonsInPhase[0].click();
    }
}


/**
 * Initializes Intersection Observer for static fade-in elements.
 */
function animateStaticFadeInElements_MOCKUP() {
    const staticFadeElements = document.querySelectorAll('#master-nav-panel.fade-in-element');
    if (staticFadeElements.length === 0) return;
    const observerOptions = { root: null, threshold: 0.05, rootMargin: "0px 0px -10px 0px" };
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observerInstance.unobserve(entry.target);
            }
        });
    }, observerOptions);
    staticFadeElements.forEach(el => { if (el) observer.observe(el); });
}