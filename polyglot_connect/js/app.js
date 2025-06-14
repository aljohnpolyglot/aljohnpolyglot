// js/app.js
// Main application entry point and orchestrator.

document.addEventListener('DOMContentLoaded', () => {
    console.log('app.js: DOM fully loaded. Initializing...');
    window.polyglotApp = {};

    // Critical module checks including API keys
    const criticalModules = [
        { name: 'GEMINI_API_KEY', obj: window.GEMINI_API_KEY, isKey: true },
        { name: 'GROQ_API_KEY', obj: window.GROQ_API_KEY, isKey: true },
        { name: 'TOGETHER_API_KEY', obj: window.TOGETHER_API_KEY, isKey: true },

        // Core Services & Utilities
        { name: 'polyglotHelpers', obj: window.polyglotHelpers },
        { name: 'flagLoader', obj: window.flagLoader },
        { name: 'polyglotConnectors', obj: window.polyglotConnectors },
        { name: 'polyglotGroupsData', obj: window.polyglotGroupsData },
        { name: 'polyglotFilterLanguages', obj: window.polyglotFilterLanguages },
        { name: 'polyglotFilterRoles', obj: window.polyglotFilterRoles },
        { name: 'polyglotMinigamesData', obj: window.polyglotMinigamesData },
        { name: 'polyglotSharedContent', obj: window.polyglotSharedContent },
        { name: 'aiService', obj: window.aiService, keyFn: 'generateTextMessage' },
        { name: 'geminiLiveApiService', obj: window.geminiLiveApiService, keyFn: 'connect' },

        // Core Logic Managers
        { name: 'activityManager', obj: window.activityManager, keyFn: 'isConnectorActive' },
        { name: 'groupManager', obj: window.groupManager, keyFn: 'initialize' },

        // NEW Chatting Sub-Modules
        { name: 'conversationManager', obj: window.conversationManager, keyFn: 'initialize' },
        { name: 'textMessageHandler', obj: window.textMessageHandler, keyFn: 'sendEmbeddedTextMessage' },
        { name: 'voiceMemoHandler', obj: window.voiceMemoHandler, keyFn: 'handleNewVoiceMemoInteraction' },
        { name: 'chatOrchestrator', obj: window.chatOrchestrator, keyFn: 'initialize' }, // This will become window.chatManager

        // Session Management Modules
        { name: 'sessionStateManager', obj: window.sessionStateManager, keyFn: 'initializeBaseSession' },
        { name: 'liveCallHandler', obj: window.liveCallHandler, keyFn: 'startLiveCall' },
        { name: 'sessionHistoryManager', obj: window.sessionHistoryManager, keyFn: 'initializeHistory' },
        { name: 'sessionManager', obj: window.sessionManager, keyFn: 'initialize' }, // Facade

        // UI Modules
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
        if (mod.isKey) {
            if (!mod.obj || mod.obj.includes('YOUR_') || mod.obj.includes('gsk_YOUR_')) {
                const errorMsg = `APP INIT ERROR: API Key '${mod.name}' is missing or invalid.`;
                console.error(errorMsg);
                document.body.innerHTML = `<p style='padding:20px; text-align:center;'>
                    Application Error: Required API Key (${mod.name}) is invalid. 
                    Check console for details.</p>`;
                return;
            }
        } else {
            // Non-key module checks remain strict
            const isInvalidModule = !mod.obj || (mod.keyFn && typeof mod.obj[mod.keyFn] !== 'function');
            if (isInvalidModule) {
                const errorMsg = `APP INIT ERROR: Module '${mod.name}' missing/invalid. Halting.`;
                console.error(errorMsg, mod.obj);
                document.body.innerHTML = `
                    <p style='padding:20px; text-align:center; color:red;'>
                        Application Error: Module ${mod.name} is invalid or missing.
                        Check console for details.
                    </p>`;
                return;
            }
        }
    }

    console.log(`app.js: Module checks complete.`);

    // Assign the orchestrator to the global chatManager name
    if (window.chatOrchestrator) {
        window.chatManager = window.chatOrchestrator; // Facade pattern
        console.log("app.js: window.chatManager is now aliased to window.chatOrchestrator.");
    } else {
        console.error("app.js: CRITICAL - chatOrchestrator not found! Chat functionality will fail.");
        return;
    }

    polyglotApp.initiateSession = (connector, sessionTypeWithContext) => {
        console.log(`app.js: polyglotApp.initiateSession CALLED for ${connector?.id || 'UnknownConnector'}, type: ${sessionTypeWithContext}`);
        const viewManager = window.viewManager;

        if (!connector || !connector.id) {
            console.error("app.js: initiateSession - invalid connector");
            return;
        }

        switch (sessionTypeWithContext) {
            case "message":
                window.chatManager?.openConversation(connector);
                viewManager?.switchView('messages');
                break;
            case "message_modal":
                window.chatManager?.openMessageModal(connector);
                break;
            case "direct_modal":
                window.sessionManager?.startModalSession(connector, sessionTypeWithContext);
                break;
            default:
                console.warn("app.js: Unknown sessionType:", sessionTypeWithContext);
        }
    };
    console.log("app.js: polyglotApp.initiateSession assignment complete.");

    function setupGlobalModalButtonListeners() {
        console.log("app.js: setupGlobalModalButtonListeners - STARTING.");
        const { domElements, sessionManager, chatManager, modalHandler } = window;

        if (!domElements) {
            console.error("App.js setupGlobalListeners: domElements MISSING!");
            return;
        }

        // Recap Modal
        if (domElements.closeRecapBtn) {
            domElements.closeRecapBtn.addEventListener('click', () => {
                console.log("Close Recap Button CLICKED!");
                modalHandler?.close(domElements.sessionRecapScreen);
            });
        } else {
            console.warn("app.js: domElements.closeRecapBtn not found.");
        }

        if (domElements.downloadTranscriptBtn) {
            domElements.downloadTranscriptBtn.addEventListener('click', () => {
                console.log("Download Transcript Button (Modal) CLICKED!");
                const sessionId = domElements.sessionRecapScreen?.dataset.sessionIdForDownload;
                if (sessionId) {
                    sessionManager?.downloadTranscriptForSession(sessionId); // sessionManager is the facade
                } else {
                    alert("No session ID found on recap modal for transcript download.");
                    console.warn("app.js: No session ID on recap-download-transcript-btn for sessionRecapScreen:", domElements.sessionRecapScreen?.dataset);
                }
            });
        } else {
            console.warn("app.js: domElements.downloadTranscriptBtn not found.");
        }

        // Direct Call Modal
        if (domElements.cancelCallBtn) domElements.cancelCallBtn.addEventListener('click', () => sessionManager?.cancelModalCallAttempt());
        if (domElements.directCallEndBtn) domElements.directCallEndBtn.addEventListener('click', () => sessionManager?.endCurrentModalSession(true));
        if (domElements.directCallSpeakerToggleBtn) domElements.directCallSpeakerToggleBtn.addEventListener('click', () => sessionManager?.toggleDirectCallSpeaker());
        if (domElements.directCallMuteBtn) domElements.directCallMuteBtn.addEventListener('click', () => sessionManager?.handleDirectCallMicToggle());
        if (domElements.directCallActivityBtn) domElements.directCallActivityBtn.addEventListener('click', () => sessionManager?.handleDirectCallActivityRequest());

        // Messaging Modal
        if (domElements.closeMessagingModalBtn) domElements.closeMessagingModalBtn.addEventListener('click', () => chatManager?.endModalMessagingSession());
        if (domElements.messageSendBtn && domElements.messageTextInput) {
            const sendModalTextMessage = () => {
                if (domElements.messageTextInput && chatManager?.getTextMessageHandler) {
                    chatManager.getTextMessageHandler().sendModalTextMessage(domElements.messageTextInput.value, chatManager.getCurrentModalMessageTarget());
                }
            };
            domElements.messageSendBtn.addEventListener('click', sendModalTextMessage);
            domElements.messageTextInput.addEventListener('keypress', e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendModalTextMessage();
                }
            });
        }

        console.log("app.js: Global modal button listeners setup process finished.");
    }

    console.log("app.js: Initializing core managers...");

    // Initialize core managers in dependency order
    if (window.conversationManager?.initialize) {
        console.log("app.js: Initializing conversationManager...");
        window.conversationManager.initialize();
    }

    if (window.chatManager?.initialize) {
        console.log("app.js: Initializing chatManager (chatOrchestrator)...");
        window.chatManager.initialize();
    }

    if (window.sessionManager?.initialize) {
        console.log("app.js: Initializing sessionManager...");
        window.sessionManager.initialize();
    }

    if (window.groupManager?.initialize) {
        console.log("app.js: Initializing groupManager...");
        window.groupManager.initialize();
    }

    console.log("app.js: Core managers initialization complete.");

    console.log("app.js: Initializing core UI...");
    let uiCoreInitialized = false;
    if (window.shellSetup?.initializeAppCore) {
        uiCoreInitialized = window.shellSetup.initializeAppCore();
    }
    if (!uiCoreInitialized) {
        console.error("app.js: Core UI initialization reported failure.");
        return;
    }
    console.log("app.js: Core UI initialization complete.");

    if (window.filterController?.initializeFilters) window.filterController.initializeFilters();
    if (window.viewManager?.initializeAndSwitchToInitialView) window.viewManager.initializeAndSwitchToInitialView();

    setupGlobalModalButtonListeners();

    console.log("Polyglot Connect Application Initialized!");
});