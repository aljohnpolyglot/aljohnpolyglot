// --- js/guild-strategy-interactions-MOCKUP.js ---

document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements first.
    cacheDOMElements_MOCKUP(); // Defined in guild-strategy-ui-MOCKUP.js

    // Verify that essential cached elements AND CONFIG DATA are available
    if (!mapRegionButtonElements || mapRegionButtonElements.length === 0 ||
        !prevPhaseButtonEl || !nextPhaseButtonEl ||
        typeof phaseOrder === 'undefined' || !Array.isArray(phaseOrder) || phaseOrder.length === 0 ||
        typeof toolsData === 'undefined' || Object.keys(toolsData).length === 0) {
        console.error("CRITICAL ERROR: Essential interactive elements or configuration data (phaseOrder, toolsData) not found/loaded. Check HTML IDs, script loading order, and guild-strategy-config.js. Interactions will not proceed.");
        const errorDisplay = document.getElementById('active-quest-display-panel') || document.body;
        if(errorDisplay) errorDisplay.innerHTML = '<div style="padding: 20px; text-align: center; color: red;"><strong>Configuration Error:</strong> The learning pathway data could not be loaded. Please check console and contact support.</div>';
        return; // Stop further execution
    }
    // Ensure toolModalEl is checked for existence IF it's considered essential here,
    // or handle its absence gracefully in functions that use it.
    if (!toolModalEl) {
        console.warn("Tool modal element (#guild-tool-modal) not found. Modal functionality will be disabled.");
    }


    let currentPhaseIndex = -1; // -1 indicates placeholder or no phase selected

    function setActivePhase(phaseId) {
        if (phaseId === null) {
            currentPhaseIndex = -1;
        } else {
            currentPhaseIndex = phaseOrder.indexOf(phaseId);
            if (currentPhaseIndex === -1) {
                console.warn(`Phase ID "${phaseId}" not found in phaseOrder. Defaulting to placeholder.`);
                phaseId = null;
                currentPhaseIndex = -1;
            }
        }

        let mapImageToSet = null;
        let bgImageToSet = null;

        if (phaseId !== null) { // Only try to get specific images if not placeholder
            const targetButton = Array.from(mapRegionButtonElements).find(btn => btn.dataset.phaseId === phaseId);
            if (targetButton && targetButton.dataset.mapImage && targetButton.dataset.bgImage) {
                mapImageToSet = targetButton.dataset.mapImage;
                bgImageToSet = targetButton.dataset.bgImage;
            }
            // Add specific backgrounds for non-button phases like wisdom/warning if desired:
            // else if (phaseId === 'phase-wisdom') { bgImageToSet = 'path/to/wisdom-bg.jpg'; }
        }

        // UI update functions are from guild-strategy-ui-MOCKUP.js
        updateProgressionMapImage_MOCKUP(mapImageToSet);
        updatePageBackground_MOCKUP(bgImageToSet);
        updateActiveMapButton_MOCKUP(phaseId);
        showQuestPhaseContent_MOCKUP(phaseId); // This handles showing/hiding phase containers

        if (phaseId !== null && phaseContentElements[phaseId]) {
            initializeTabsForPhaseUI_MOCKUP(phaseContentElements[phaseId]); // Initialize tabs for the new phase
        }
        updateNavigationButtons_MOCKUP(currentPhaseIndex, phaseOrder);
    }

    mapRegionButtonElements.forEach(button => {
        button.addEventListener('click', function() {
            setActivePhase(this.dataset.phaseId);
        });
    });

    if (prevPhaseButtonEl) {
        prevPhaseButtonEl.addEventListener('click', () => {
            if (currentPhaseIndex > 0) {
                setActivePhase(phaseOrder[currentPhaseIndex - 1]);
            }
        });
    }

    if (nextPhaseButtonEl) {
        nextPhaseButtonEl.addEventListener('click', () => {
            if (currentPhaseIndex === -1 && phaseOrder.length > 0) { // From placeholder to first
                setActivePhase(phaseOrder[0]);
            } else if (currentPhaseIndex < phaseOrder.length - 1) { // Not last
                setActivePhase(phaseOrder[currentPhaseIndex + 1]);
            }
        });
    }

    // Tool Card Modal Listeners
    const activeQuestDisplayPanel = document.getElementById('active-quest-display-panel');
    if (activeQuestDisplayPanel && toolModalEl) { // Only add if panel and modal exist
        activeQuestDisplayPanel.addEventListener('click', function(event) {
            const card = event.target.closest('.tool-card-MOCKUP');
            if (card) {
                const toolId = card.dataset.toolId;
                if (toolsData[toolId]) {
                    populateToolModal_MOCKUP(toolsData[toolId]);
                    openToolModal_MOCKUP();
                } else {
                    console.warn("No data found for tool ID:", toolId);
                    // Optionally, show a generic "details not found" modal or message
                }
            }
        });
    }

    if (toolModalEl) {
        const toolModalCloseButton = toolModalEl.querySelector('.tool-modal-close');
        if (toolModalCloseButton) {
            toolModalCloseButton.addEventListener('click', closeToolModal_MOCKUP);
        }
        toolModalEl.addEventListener('click', (event) => {
            if (event.target === toolModalEl) { // Click on dimmer background
                closeToolModal_MOCKUP();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && toolModalEl.classList.contains('visible')) {
                closeToolModal_MOCKUP();
            }
        });
    }

    // Initial Setup
    animateStaticFadeInElements_MOCKUP(); // For #master-nav-panel
    setActivePhase(null); // Default to showing the placeholder content on load

    // --- Basic Navbar Scroll & Mobile Menu Example (Adjust selectors to your actual navbar HTML) ---
    const header = document.querySelector('header#main-header-placeholder');
    if (header) {
        let lastScrollTop = 0;
        window.addEventListener("scroll", function() {
           let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
           if (currentScroll > 50) {
              header.classList.add("scrolled");
           } else {
              header.classList.remove("scrolled");
           }
           lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
        }, { passive: true });
    }

    const menuToggle = document.querySelector('.menu-toggle'); // e.g., your hamburger button
    const navLinks = document.querySelector('.nav-links');     // e.g., your ul of nav links
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active'); // For showing/hiding nav links
            menuToggle.classList.toggle('active'); // For animating the hamburger icon
        });
    }
});