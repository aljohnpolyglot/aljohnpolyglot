// js/sessions/session_state_manager.js
// Manages common state for modal sessions (ID, connector, type, transcript).

window.sessionStateManager = (() => {
    'use strict';

    const getDeps = () => ({ // Only what's needed for basic state & recap modal
        domElements: window.domElements,
        modalHandler: window.modalHandler,
        uiUpdater: window.uiUpdater,
        polyglotHelpers: window.polyglotHelpers,
        geminiService: window.geminiService, // For recap generation
        sessionHistoryManager: window.sessionHistoryManager // For saving completed session
    });

    let currentSession = {
        connector: null,
        sessionType: null, // "direct_modal", "voiceChat_modal"
        sessionId: null,
        startTime: null,
        transcript: [] // For text-based parts and recap generation
    };

    function initializeBaseSession(connector, sessionType) {
        console.log("sessionStateManager: initializeBaseSession for", connector?.id, "Type:", sessionType);
        const { uiUpdater, domElements, modalHandler } = getDeps();

        if (!connector || !sessionType) {
            console.error("sessionStateManager: Connector or sessionType missing for initialization.");
            return false;
        }
        if (currentSession.sessionId) {
            console.warn("sessionStateManager: Attempted to initialize base session while one is active:", currentSession.sessionId);
            // It's up to the caller (e.g., main session_manager facade) to prevent this.
            return false;
        }

        currentSession.connector = connector;
        currentSession.sessionType = sessionType;
        currentSession.sessionId = `${connector.id}_${sessionType}_${Date.now()}`;
        currentSession.transcript = [];
        currentSession.startTime = null; // Will be set when virtual calling screen closes

        if (uiUpdater && domElements?.virtualCallingScreen && modalHandler) {
            uiUpdater.updateVirtualCallingScreen(connector, sessionType);
            modalHandler.open(domElements.virtualCallingScreen);
        } else {
            console.error("sessionStateManager: Missing UI deps for virtual calling screen.");
            return false;
        }
        return true;
    }

    function markSessionAsStarted() { // Called when virtual calling is done
        currentSession.startTime = new Date();
        console.log("sessionStateManager: Session marked as started at", currentSession.startTime);
    }

    function addTurnToTranscript(sender, text, type = 'message') {
        if (!currentSession.sessionId) return;
        currentSession.transcript.push({
            sender: sender, // e.g., "user-typed", "user-audio-transcript", "connector", "connector-audio-transcript"
            text: text,
            type: type,
            timestamp: Date.now()
        });
        // console.debug("sessionStateManager: Turn added to transcript:", currentSession.transcript.slice(-1)[0]);
    }

    function getCurrentTranscript() {
        return [...currentSession.transcript];
    }
    function getCurrentSessionDetails() {
        if (!currentSession.sessionId) return null;
        return { ...currentSession };
    }

    async function finalizeBaseSession(generateRecap = true) {
        console.log("sessionStateManager: finalizeBaseSession. Recap:", generateRecap, "SessionID:", currentSession.sessionId);
        const { uiUpdater, domElements, modalHandler, geminiService, sessionHistoryManager } = getDeps();

        if (!currentSession.connector || !currentSession.sessionId) {
            console.warn("sessionStateManager: No active session to finalize.");
            resetBaseSessionState();
            return;
        }

        if (generateRecap && currentSession.transcript.length > 0 && geminiService && uiUpdater && modalHandler && domElements?.sessionRecapScreen && sessionHistoryManager) {
            const callEndTime = new Date();
            const durationMs = currentSession.startTime ? callEndTime - currentSession.startTime : 0;
            const durationFormatted = `${Math.floor(durationMs / 60000)}m ${Math.floor((durationMs % 60000) / 1000)}s`;

            const recapDataForApi = {
                sessionId: currentSession.sessionId,
                connectorName: currentSession.connector.profileName,
                connector: { ...currentSession.connector }, // Send a copy
                date: currentSession.startTime?.toLocaleDateString() || new Date().toLocaleDateString(),
                duration: durationFormatted,
                rawTranscript: [...currentSession.transcript],
                sessionType: currentSession.sessionType
            };

            uiUpdater.populateRecapModal({ ...recapDataForApi, topics: ["Generating..."], vocabulary: [], focusAreas: [] });
            modalHandler.open(domElements.sessionRecapScreen);

            try {
                const geminiRecap = await geminiService.generateSessionRecap(currentSession.transcript, currentSession.connector);
                const fullRecap = { ...recapDataForApi, ...geminiRecap };
                sessionHistoryManager.addCompletedSession(fullRecap); // Save to history
                uiUpdater.populateRecapModal(fullRecap); // Update UI with full recap
            } catch (err) {
                console.error("sessionStateManager: Recap generation error:", err);
                const errRecap = { ...recapDataForApi, topics: [`Debrief failed: ${err.message.substring(0,40)}...`], vocabulary:[], focusAreas:[] };
                sessionHistoryManager.addCompletedSession(errRecap);
                uiUpdater.populateRecapModal(errRecap);
            }
        }
        resetBaseSessionState();
    }

    function resetBaseSessionState() {
        console.log("sessionStateManager: resetBaseSessionState.");
        currentSession.connector = null;
        currentSession.sessionType = null;
        currentSession.sessionId = null;
        currentSession.startTime = null;
        currentSession.transcript = [];
    }

    function isSessionActive() {
        return !!currentSession.sessionId;
    }

    console.log("js/sessions/session_state_manager.js loaded.");
    return {
        initializeBaseSession,
        markSessionAsStarted,
        addTurnToTranscript,
        getCurrentTranscript,
        getCurrentSessionDetails,
        finalizeBaseSession,
        resetBaseSessionState, // Might be called by facade on cancel
        isSessionActive
    };
})();