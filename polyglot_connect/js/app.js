// js/app.js
// Main application entry point and orchestrator.

document.addEventListener('DOMContentLoaded', () => {
    console.log('app.js: DOM fully loaded. Initializing Polyglot Connect...');
    window.polyglotApp = {};

    // --- Module Loading Checks ---
    const criticalModules = [
        // Config & Utils
        { name: 'GEMINI_API_KEY', obj: window.GEMINI_API_KEY, isKey: true },
        { name: 'polyglotHelpers', obj: window.polyglotHelpers },
        { name: 'flagLoader', obj: window.flagLoader },
        // Data
        { name: 'polyglotConnectors', obj: window.polyglotConnectors },
        { name: 'polyglotGroupsData', obj: window.polyglotGroupsData },
        { name: 'polyglotFilterLanguages', obj: window.polyglotFilterLanguages },
        { name: 'polyglotFilterRoles', obj: window.polyglotFilterRoles },
        { name: 'polyglotMinigamesData', obj: window.polyglotMinigamesData },
        { name: 'polyglotSharedContent', obj: window.polyglotSharedContent },
        // Services
        { name: 'geminiService', obj: window.geminiService },
        // Core Logic Managers
        { name: 'activityManager', obj: window.activityManager, keyFn: 'isConnectorActive' },
        { name: 'sessionManager', obj: window.sessionManager, keyFn: 'initialize' },
        { name: 'chatManager', obj: window.chatManager, keyFn: 'initialize' },
        { name: 'groupManager', obj: window.groupManager, keyFn: 'initialize' },
        // UI Modules - All are now considered critical for full functionality
        { name: 'domElements', obj: window.domElements },
        { name: 'modalHandler', obj: window.modalHandler, keyFn: 'open' },
        { name: 'uiUpdater', obj: window.uiUpdater, keyFn: 'appendToVoiceChatLog' },
        { name: 'cardRenderer', obj: window.cardRenderer, keyFn: 'renderCards' },
        { name: 'listRenderer', obj: window.listRenderer, keyFn: 'renderActiveChatList' },
        { name: 'shellSetup', obj: window.shellSetup, keyFn: 'initializeAppCore' },
        { name: 'viewManager', obj: window.viewManager, keyFn: 'switchView' },
        { name: 'filterController', obj: window.filterController, keyFn: 'initializeFilters' },
        { name: 'personaModalManager', obj: window.personaModalManager, keyFn: 'openDetailedPersonaModal' },
        { name: 'chatUiManager', obj: window.chatUiManager, keyFn: 'showEmbeddedChatInterface' },
    ];

    for (const mod of criticalModules) {
        const isInvalidKey = mod.isKey && (!mod.obj || mod.obj === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE');
        const isInvalidObject = !mod.isKey && (!mod.obj || (mod.keyFn && typeof mod.obj[mod.keyFn] !== 'function'));

        // All modules in this list are now considered critical. No 'optional' flag needed.
        if (isInvalidKey || isInvalidObject) {
            const errorMsg = `APP INIT CRITICAL ERROR: Module or Config '${mod.name}' not loaded, misconfigured, or key function missing! Halting app.js.`;
            console.error(errorMsg, mod.obj);
            document.body.innerHTML = `<p style='padding:20px; text-align:center; font-size:1.2em; color:red;'>Application Initialization Error. Check console. Error with: ${mod.name}</p>`;
            return; // Stop further execution within DOMContentLoaded
        }
    }
    console.log("app.js: All critical module checks passed.");

    // Define polyglotApp.initiateSession
    polyglotApp.initiateSession = (connector, sessionTypeWithContext) => {
        console.log(`app.js: polyglotApp.initiateSession CALLED for ${connector?.id || 'UnknownConnector'}, type: ${sessionTypeWithContext}`);
        const viewManager = window.viewManager;

        if (!connector || !connector.id) {
            console.error("app.js: initiateSession called with invalid connector object:", connector);
            return;
        }

        switch (sessionTypeWithContext) {
            case "message": // From persona card, for embedded view in "Messages" tab
                window.chatManager?.openConversation(connector); // chatManager now uses chatUiManager to show the UI
                viewManager?.switchView('messages');              // Switch to the messages tab
                break;
            case "message_modal": // Explicitly open modal message window
                window.chatManager?.openMessageModal(connector);
                break;
            case "direct_modal":    // For Direct Call modal
            case "voiceChat_modal": // For Voice Chat modal
                window.sessionManager?.startModalSession(connector, sessionTypeWithContext);
                break;
            default:
                console.warn("app.js: Unknown sessionType:", sessionTypeWithContext);
        }
    };
    console.log("app.js: polyglotApp.initiateSession assignment complete. typeof is:", typeof window.polyglotApp?.initiateSession);
    if (typeof window.polyglotApp?.initiateSession !== 'function') {
        // This should not happen if the above assignment is correct.
        console.error("app.js: CRITICAL - polyglotApp.initiateSession is NOT a function after assignment!");
    }


    // Define setupGlobalModalButtonListeners
    // This function attaches listeners to STATIC buttons within your modal HTML structures.
    function setupGlobalModalButtonListeners() {
        console.log("app.js: setupGlobalModalButtonListeners - Function STARTING.");
        const { domElements, sessionManager, chatManager, modalHandler } = window;

        if (!domElements) { console.error("App.js setupGlobalListeners: domElements is missing! Cannot attach modal button listeners."); return; }
        if (!sessionManager) { console.error("App.js setupGlobalListeners: sessionManager is missing! Some modal buttons may not work."); }
        if (!chatManager) { console.error("App.js setupGlobalListeners: chatManager is missing! Some modal buttons may not work."); }
        if (!modalHandler) { console.error("App.js setupGlobalListeners: modalHandler is missing! Some modal buttons may not work."); }

        // Virtual Calling Screen
        if (domElements.cancelCallBtn) domElements.cancelCallBtn.addEventListener('click', () => sessionManager?.cancelModalCallAttempt());
        else console.warn("app.js: domElements.cancelCallBtn not found for listener attachment.");

        // Voice Chat Modal
        if (domElements.endVoiceChatBtn) domElements.endVoiceChatBtn.addEventListener('click', () => sessionManager?.endCurrentModalSession(true));
        else console.warn("app.js: domElements.endVoiceChatBtn not found.");
        if (domElements.toggleVoiceChatTTSBtn) domElements.toggleVoiceChatTTSBtn.addEventListener('click', () => sessionManager?.toggleVoiceChatTTS());
        else console.warn("app.js: domElements.toggleVoiceChatTTSBtn not found.");
        if (domElements.voiceChatTapToSpeakBtn) domElements.voiceChatTapToSpeakBtn.addEventListener('click', () => sessionManager?.handleVoiceChatTapToSpeak());
        else console.warn("app.js: domElements.voiceChatTapToSpeakBtn not found.");
        if (domElements.voiceChatTextInput && domElements.voiceChatSendTextBtn) {
            domElements.voiceChatTextInput.addEventListener('input', () => {
                if(domElements.voiceChatTextInput && domElements.voiceChatSendTextBtn) { // Re-check for safety
                    domElements.voiceChatSendTextBtn.style.display = domElements.voiceChatTextInput.value.trim() !== '' ? 'inline-block' : 'none';
                }
            });
            const sendTypedVoiceChatMessage = () => sessionManager?.sendVoiceChatTypedText();
            domElements.voiceChatSendTextBtn.addEventListener('click', sendTypedVoiceChatMessage);
            domElements.voiceChatTextInput.addEventListener('keypress', e => {
                if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTypedVoiceChatMessage(); }
            });
        } else { console.warn("app.js: voiceChatTextInput or voiceChatSendTextBtn not found for listener attachment."); }

        // Direct Call Modal
        if (domElements.directCallEndBtn) domElements.directCallEndBtn.addEventListener('click', () => sessionManager?.endCurrentModalSession(true));
        else console.warn("app.js: domElements.directCallEndBtn not found.");
        if (domElements.directCallSpeakerToggleBtn) domElements.directCallSpeakerToggleBtn.addEventListener('click', () => sessionManager?.toggleDirectCallSpeaker());
        else console.warn("app.js: domElements.directCallSpeakerToggleBtn not found.");
        if (domElements.directCallMuteBtn) domElements.directCallMuteBtn.addEventListener('click', () => sessionManager?.handleDirectCallMicToggle());
        else console.warn("app.js: domElements.directCallMuteBtn not found.");
        if (domElements.directCallActivityBtn) domElements.directCallActivityBtn.addEventListener('click', () => sessionManager?.handleDirectCallActivityRequest());
        else console.warn("app.js: domElements.directCallActivityBtn not found.");

        // Messaging Modal
        if (domElements.closeMessagingModalBtn) domElements.closeMessagingModalBtn.addEventListener('click', () => chatManager?.endModalMessagingSession());
        else console.warn("app.js: domElements.closeMessagingModalBtn not found.");
        if (domElements.toggleMessageTTSBtn) domElements.toggleMessageTTSBtn.addEventListener('click', () => chatManager?.toggleMessageModalTTS());
        else console.warn("app.js: domElements.toggleMessageTTSBtn not found.");
        if (domElements.messageSendBtn && domElements.messageTextInput) {
            const sendModalTextMessage = () => {
                if(domElements.messageTextInput) chatManager?.sendModalTextMessage(domElements.messageTextInput.value);
            };
            domElements.messageSendBtn.addEventListener('click', sendModalTextMessage);
            domElements.messageTextInput.addEventListener('keypress', e => {
                 if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendModalTextMessage(); }
            });
        } else { console.warn("app.js: messageSendBtn or messageTextInput not found for listener attachment."); }

        // Recap Modal
        if (domElements.closeRecapBtn) domElements.closeRecapBtn.addEventListener('click', () => modalHandler?.close(domElements.sessionRecapScreen));
        else console.warn("app.js: domElements.closeRecapBtn not found.");
        if (domElements.downloadTranscriptBtn) {
            domElements.downloadTranscriptBtn.addEventListener('click', () => {
                const sessionId = domElements.sessionRecapScreen?.dataset.sessionIdForDownload;
                if (sessionId) sessionManager?.downloadTranscriptForSession(sessionId);
                else alert("No session ID for transcript download.");
            });
        } else { console.warn("app.js: domElements.downloadTranscriptBtn not found."); }

        // Modal Overlay Clicks to Close/End Session
        [domElements.voiceEnabledChatInterface, domElements.directCallInterface].forEach(modalElement => {
            if (modalElement) {
                modalElement.addEventListener('click', (event) => {
                    if (event.target === modalElement) sessionManager?.endCurrentModalSession(true);
                });
            }
        });
        if (domElements.messagingInterface) {
            domElements.messagingInterface.addEventListener('click', (event) => {
                 if (event.target === domElements.messagingInterface) chatManager?.endModalMessagingSession();
            });
        }
        console.log("app.js: Global modal button listeners setup process finished.");
    } // END OF setupGlobalModalButtonListeners DEFINITION


    // --- Final Application Initialization Steps ---
    console.log("app.js: Initializing core managers...");
    if (window.chatManager?.initialize) window.chatManager.initialize(); else console.warn("app.js: chatManager.initialize not found for call.");
    if (window.sessionManager?.initialize) window.sessionManager.initialize(); else console.warn("app.js: sessionManager.initialize not found for call.");
    if (window.groupManager?.initialize) window.groupManager.initialize(); else console.warn("app.js: groupManager.initialize not found for call.");
    console.log("app.js: Core managers initialization attempt complete.");

    console.log("app.js: Initializing core UI (shellSetup)...");
    let uiCoreInitialized = false;
    if (window.shellSetup?.initializeAppCore) {
        uiCoreInitialized = window.shellSetup.initializeAppCore();
    } else {
        console.error("app.js: CRITICAL - shellSetup.initializeAppCore is not defined! Core UI cannot initialize.");
        document.body.innerHTML = "<p style='padding:20px; text-align:center; font-size:1.2em; color:red;'>Application Core UI Initialization Error. shellSetup missing. Check console.</p>";
        return; // Halt further execution
    }
    if (!uiCoreInitialized) {
        console.error("app.js: Core UI initialization (shellSetup) reported failure. Halting further UI setup.");
        return; // Halt further execution
    }
    console.log("app.js: Core UI (shellSetup) initialization complete.");

    console.log("app.js: Initializing filterController...");
    if (window.filterController?.initializeFilters) {
        window.filterController.initializeFilters();
    } else {
        console.error("app.js: CRITICAL - filterController.initializeFilters not defined! Filter functionality will be broken.");
    }
    console.log("app.js: filterController initialization attempt complete.");

    console.log("app.js: Initializing viewManager...");
    if (window.viewManager?.initializeAndSwitchToInitialView) {
        window.viewManager.initializeAndSwitchToInitialView();
    } else {
        console.error("app.js: CRITICAL - viewManager.initializeAndSwitchToInitialView not defined! Tab functionality will be broken.");
    }
    console.log("app.js: viewManager initialization attempt complete.");

    // Call setupGlobalModalButtonListeners
    console.log("app.js: About to call setupGlobalModalButtonListeners. Typeof is:", typeof setupGlobalModalButtonListeners);
    if (typeof setupGlobalModalButtonListeners === 'function') {
        setupGlobalModalButtonListeners();
    } else {
        // This error means the function definition itself has a problem or is not in scope.
        console.error("app.js: CRITICAL - setupGlobalModalButtonListeners is NOT a function just before calling it! Check its definition and scope.");
        // Not using alert here as the app might still be partially functional
    }

    console.log("Polyglot Connect Application Initialized and Ready!");
    console.log("%cAPP.JS DOMCONTENTLOADED FULLY COMPLETED. polyglotApp.initiateSession is: " + (typeof window.polyglotApp?.initiateSession), "color: green; font-size: 1.2em; font-weight: bold;");

}); // End DOMContentLoaded