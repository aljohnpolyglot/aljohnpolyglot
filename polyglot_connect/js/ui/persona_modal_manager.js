// js/ui/persona_modal_manager.js
// Manages the detailed persona modal: opening, populating, actions, and cleanup.

window.personaModalManager = (() => {
    const getDeps = () => ({
        domElements: window.domElements,
        modalHandler: window.modalHandler,         // For opening/closing the generic modal
        polyglotHelpers: window.polyglotHelpers,
        activityManager: window.activityManager,   // For checking active status
        // polyglotApp: window.polyglotApp,        // For initiating sessions
        // We don't need viewManager here directly, app.js will handle view switches if needed.
    });

    // This function is called once, perhaps by app.js or it could be self-invoked
    // if it only sets up listeners on elements already in the HTML.
    // For now, let's assume app.js might call an init if needed, or we set up listeners when modal is opened.
    // Simpler: set up listeners on static modal elements when this module loads.
    function initializePersonaModalControls() {
        const { domElements, modalHandler } = getDeps();
        console.log("personaModalManager: initializePersonaModalControls - Setting up listeners.");

        if (!domElements || !modalHandler) {
            console.warn("personaModalManager: initializePersonaModalControls - domElements or modalHandler not available.");
            return;
        }

        // Close button on the modal itself
        if (domElements.closePersonaModalBtn) {
            domElements.closePersonaModalBtn.addEventListener('click', () => {
                cleanupModalData();
                modalHandler.close(domElements.detailedPersonaModal);
            });
        } else {
            console.warn("personaModalManager: 'closePersonaModalBtn' not found.");
        }

        // Backdrop click to close (if not handled by generic modalHandler already for this specific modal)
        // The generic modalHandler in your setup doesn't handle this for detailedPersonaModal to allow specific cleanup.
        if (domElements.detailedPersonaModal) {
            domElements.detailedPersonaModal.addEventListener('click', (event) => {
                if (event.target === domElements.detailedPersonaModal) { // Click on overlay
                    cleanupModalData();
                    modalHandler.close(domElements.detailedPersonaModal);
                }
            });
        }

        // Action buttons within the modal
        if (domElements.personaModalMessageBtn) {
            domElements.personaModalMessageBtn.addEventListener('click', () => handlePersonaModalAction('message_modal'));
        } else {
            console.warn("personaModalManager: 'personaModalMessageBtn' not found.");
        }

        if (domElements.personaModalVoiceChatBtn) {
            domElements.personaModalVoiceChatBtn.addEventListener('click', () => handlePersonaModalAction('voiceChat_modal'));
        } else {
            console.warn("personaModalManager: 'personaModalVoiceChatBtn' not found.");
        }

        if (domElements.personaModalDirectCallBtn) {
            domElements.personaModalDirectCallBtn.addEventListener('click', () => handlePersonaModalAction('direct_modal'));
        } else {
            console.warn("personaModalManager: 'personaModalDirectCallBtn' not found.");
        }
        console.log("personaModalManager: Persona modal control listeners attached.");
    }


    function openDetailedPersonaModal(connector) {
        const { domElements, modalHandler, polyglotHelpers, activityManager } = getDeps();
        console.log("personaModalManager: openDetailedPersonaModal - Called for connector:", connector?.id);

        if (!connector?.id || !domElements?.detailedPersonaModal || !modalHandler || !polyglotHelpers || !activityManager) {
            console.error("personaModalManager: openDetailedPersonaModal - Cannot open modal. Missing critical dependencies or connector ID.", {
                connectorId: connector?.id,
                hasModalElement: !!domElements?.detailedPersonaModal,
                hasModalHandler: !!modalHandler,
                hasHelpers: !!polyglotHelpers,
                hasActivityManager: !!activityManager
            });
            return;
        }

        try {
            // Populate Avatar, Name, Location/Age, Status
            domElements.personaModalAvatar.src = connector.avatarModern || 'images/placeholder_avatar.png';
            domElements.personaModalAvatar.onerror = () => { domElements.personaModalAvatar.src = 'images/placeholder_avatar.png'; };
            domElements.personaModalName.textContent = polyglotHelpers.sanitizeTextForDisplay(connector.profileName || connector.name || 'Unknown Persona');

            const ageText = connector.age && connector.age !== "N/A" ? `${connector.age} yrs` : 'Age N/A';
            const locationText = `${polyglotHelpers.sanitizeTextForDisplay(connector.city || 'City N/A')}, ${polyglotHelpers.sanitizeTextForDisplay(connector.country || 'Country N/A')}`;
            domElements.personaModalLocationAge.textContent = `${locationText} | ${ageText}`;

            const isActive = activityManager.isConnectorActive(connector);
            domElements.personaModalActiveStatus.classList.toggle('active', isActive);
            domElements.personaModalActiveStatus.title = isActive ? "This person is currently active" : "This person is currently inactive";
            // If you want text with the dot:
            // domElements.personaModalActiveStatus.innerHTML = `<span class="status-indicator-dot"></span> ${isActive ? "Active" : "Inactive"}`;


            // Populate Bio
            domElements.personaModalBio.textContent = polyglotHelpers.sanitizeTextForDisplay(connector.bioModern || "This user hasn't written a bio yet.");

            // Populate Languages (delegated to modalHandler - ensure modalHandler is correctly passed)
            if (modalHandler.renderLanguageSection) {
                modalHandler.renderLanguageSection(connector);
            } else {
                console.warn("personaModalManager: modalHandler.renderLanguageSection not found. Language section will not be rendered.");
                if (domElements.personaModalLanguagesUl) domElements.personaModalLanguagesUl.innerHTML = "<p>Language info unavailable.</p>";
            }

            // Populate Interests
            domElements.personaModalInterestsUl.innerHTML = ''; // Clear previous
            if (connector.interests && connector.interests.length > 0) {
                connector.interests.forEach(interest => {
                    const li = document.createElement('li');
                    li.className = 'interest-tag';
                    li.textContent = polyglotHelpers.sanitizeTextForDisplay(interest.charAt(0).toUpperCase() + interest.slice(1));
                    domElements.personaModalInterestsUl.appendChild(li);
                });
            } else {
                domElements.personaModalInterestsUl.innerHTML = "<li class='interest-tag-none'>No interests listed.</li>";
            }

            // Populate Gallery (placeholder)
            if (connector.galleryImageFiles?.length > 0) {
                domElements.personaModalGallery.innerHTML = `<p>${connector.galleryImageFiles.length} photos (gallery display feature coming soon).</p>`;
            } else {
                domElements.personaModalGallery.innerHTML = `<div class="gallery-placeholder-content"><i class="fas fa-images"></i><p>No photos shared yet.</p></div>`;
            }

            // Store connector ID on the modal for action handlers
            domElements.detailedPersonaModal.dataset.connectorId = connector.id;

            modalHandler.open(domElements.detailedPersonaModal);
            console.log("personaModalManager: Detailed persona modal opened for", connector.id);

        } catch (error) {
            console.error("personaModalManager: Error populating persona modal:", error, "Connector data:", connector);
            modalHandler.close(domElements.detailedPersonaModal); // Ensure modal is closed on error
            cleanupModalData();
        }
    }

    function cleanupModalData() {
        const { domElements } = getDeps();
        if (domElements?.detailedPersonaModal) {
            domElements.detailedPersonaModal.dataset.connectorId = '';
            console.log("personaModalManager: Modal data (connectorId) cleaned up.");
        }
        // Optionally reset other fields like avatar src, text contents if they don't get overwritten on open.
        // if (domElements?.personaModalAvatar) domElements.personaModalAvatar.src = 'images/placeholder_avatar.png';
        // if (domElements?.personaModalName) domElements.personaModalName.textContent = 'Persona Name';
    }

    function handlePersonaModalAction(actionType) {
        const { domElements, modalHandler } = getDeps();
        console.log("personaModalManager: handlePersonaModalAction - Action type:", actionType);

        if (!domElements?.detailedPersonaModal || !modalHandler) {
            console.error("personaModalManager: handlePersonaModalAction - Missing domElements.detailedPersonaModal or modalHandler.");
            return;
        }
        const connectorId = domElements.detailedPersonaModal.dataset.connectorId;
        if (!connectorId) {
            console.error("personaModalManager: handlePersonaModalAction - No connector ID found on persona modal.");
            return;
        }

        const connector = (window.polyglotConnectors || []).find(c => c.id === connectorId);
        if (!connector) {
            console.error(`personaModalManager: handlePersonaModalAction - Connector with ID '${connectorId}' not found.`);
            cleanupModalData(); // Clean up even if connector not found
            modalHandler.close(domElements.detailedPersonaModal);
            return;
        }

        // Close modal and cleanup data BEFORE initiating the session
        modalHandler.close(domElements.detailedPersonaModal);
        cleanupModalData();

        // Log the state of window.polyglotApp and its initiateSession method
        console.log("personaModalManager: In handlePersonaModalAction. window.polyglotApp object IS:", window.polyglotApp);
        console.log("personaModalManager: In handlePersonaModalAction. typeof window.polyglotApp?.initiateSession IS:", typeof window.polyglotApp?.initiateSession);

        // Call the global polyglotApp function to initiate the session
        if (window.polyglotApp?.initiateSession) {
            console.log("personaModalManager: Calling polyglotApp.initiateSession for", connector.id, "type:", actionType);
            window.polyglotApp.initiateSession(connector, actionType);
        } else {
            console.error("personaModalManager: handlePersonaModalAction - window.polyglotApp.initiateSession is not available.");
        }
    }

    // Initialize listeners when the module loads, as modal elements are static in HTML
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializePersonaModalControls);
    } else {
        initializePersonaModalControls();
    }

    console.log("js/ui/persona_modal_manager.js loaded.");
    return {
        openDetailedPersonaModal
        // initializePersonaModalControls is internal setup
        // cleanupModalData and handlePersonaModalAction are internal to this manager, triggered by events.
    };
})();