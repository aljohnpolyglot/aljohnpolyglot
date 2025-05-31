// js/core/session_manager.js
// Manages state and lifecycle for MODAL-based sessions: Direct Call, Voice Chat.
// Also handles storage and retrieval of completed session summaries.

window.sessionManager = (() => {
    const getDeps = () => ({ // Lazy load dependencies
        domElements: window.domElements,
        modalHandler: window.modalHandler,
        uiUpdater: window.uiUpdater,
        geminiService: window.geminiService,
        polyglotHelpers: window.polyglotHelpers,
        polyglotSharedContent: window.polyglotSharedContent,
        polyglotMinigamesData: window.polyglotMinigamesData,
        listRenderer: window.listRenderer
    });

    let currentModalConnector = null;
    let currentModalSessionType = null;
    let currentModalSessionId = null;
    let modalCallStartTime = null;
    let modalSessionTranscript = [];

    let isDirectCallMicMuted = true;
    let isDirectCallSpeakerMuted = false;
    let isVoiceChatTTSMuted = false;

    let activeMicrophoneStream = null;
    let mediaRecorder = null;
    let audioChunks = [];

    let completedSessions = {};

    function initialize() {
        const { polyglotHelpers } = getDeps();
        if (!polyglotHelpers) {
            console.error("SessionManager: polyglotHelpers not available at initialization.");
            return;
        }
        const saved = polyglotHelpers.loadFromLocalStorage('polyglotCompletedSessions');
        if (saved) completedSessions = saved;
    }

    function saveCompletedSessionsToStorage() {
        getDeps().polyglotHelpers?.saveToLocalStorage('polyglotCompletedSessions', completedSessions);
    }

    async function startModalSession(connector, sessionType) {
        const { modalHandler, uiUpdater, polyglotHelpers } = getDeps();
        if (!modalHandler || !uiUpdater || !polyglotHelpers || !connector) {
            console.error("startModalSession: Missing critical dependencies or connector.");
            alert("Error: Could not start session. Required components missing.");
            return;
        }
        if (currentModalSessionId) {
            alert("Another call or voice chat is already in progress. Please end it first."); return;
        }

        currentModalConnector = connector;
        currentModalSessionType = sessionType;
        currentModalSessionId = `${connector.id}_${sessionType}_${Date.now()}`;
        modalSessionTranscript = [];

        uiUpdater.updateVirtualCallingScreen(connector, sessionType);
        modalHandler.open(getDeps().domElements.virtualCallingScreen);

        try {
            if (!activeMicrophoneStream || !activeMicrophoneStream.active) {
                activeMicrophoneStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            }

            setTimeout(() => {
                modalHandler.close(getDeps().domElements.virtualCallingScreen);
                modalCallStartTime = new Date();
                let modalToOpen;
                let langCodeToUse = connector.languageCode; // Default to primary
                let voiceNameToUse = connector.voiceName;

                // Determine specific language context for the session if applicable
                // connector.language is the name (e.g. "French")
                // connector.languageRoles[connector.language] is the array ["tutor", "native"]
                // We need to ensure connector itself has languageCode and voiceName properties populated correctly
                // by the personas.js processing block.

                if (connector.languageCode) langCodeToUse = connector.languageCode;
                if (connector.voiceName) voiceNameToUse = connector.voiceName;


                if (sessionType === "direct_modal") {
                    modalToOpen = getDeps().domElements.directCallInterface;
                    uiUpdater.updateDirectCallHeader(connector);
                    uiUpdater.clearDirectCallActivityArea();
                    uiUpdater.updateDirectCallStatus("Connected", false);
                    isDirectCallMicMuted = true;
                    uiUpdater.updateDirectCallMicButtonVisual(isDirectCallMicMuted);
                    isDirectCallSpeakerMuted = false;
                    uiUpdater.updateDirectCallSpeakerButtonVisual(isDirectCallSpeakerMuted);
                } else if (sessionType === "voiceChat_modal") {
                    modalToOpen = getDeps().domElements.voiceEnabledChatInterface;
                    uiUpdater.updateVoiceChatHeader(connector);
                    uiUpdater.clearVoiceChatLog();
                    uiUpdater.resetVoiceChatInput();
                    isVoiceChatTTSMuted = false;
                    uiUpdater.updateTTSToggleButtonVisual(getDeps().domElements.toggleVoiceChatTTSBtn, isVoiceChatTTSMuted);
                    if(getDeps().domElements.voiceChatTextInput) getDeps().domElements.voiceChatTextInput.focus();
                }

                if (modalToOpen) {
                    modalHandler.open(modalToOpen);
                    if (connector.greetingCall) {
                        const greetingText = connector.greetingCall;
                        modalSessionTranscript.push({ sender: 'connector', text: greetingText, type: 'greeting', timestamp: Date.now() });
                        if (sessionType === "voiceChat_modal") {
                            uiUpdater.appendToVoiceChatLog(greetingText, 'connector');
                            if (!isVoiceChatTTSMuted && polyglotHelpers.speakText) {
                                polyglotHelpers.speakText(greetingText, langCodeToUse, voiceNameToUse);
                            }
                        } else if (sessionType === "direct_modal") {
                            if (!isDirectCallSpeakerMuted && polyglotHelpers.speakText) {
                                polyglotHelpers.speakText(greetingText, langCodeToUse, voiceNameToUse);
                            }
                        }
                    }
                }
            }, 1500);

        } catch (err) {
            console.error(`sessionManager: Error starting modal ${sessionType}:`, err);
            modalHandler.close(getDeps().domElements.virtualCallingScreen);
            alert(`Could not start ${sessionType.replace('_modal','')}. Ensure microphone permission. (Error: ${err.message || err.name})`);
            resetAndClearSessionState(); // Simplified reset, no recap
        }
    }

    function endCurrentModalSession(generateRecap = true) {
        const { modalHandler, uiUpdater, geminiService, listRenderer } = getDeps();
        if (!currentModalSessionId && !currentModalConnector) {
            stopMicrophoneStream(); return;
        }
        if (mediaRecorder?.state === "recording") mediaRecorder.stop();
        stopMicrophoneStream();

        if (currentModalSessionType === "direct_modal") modalHandler.close(getDeps().domElements.directCallInterface);
        else if (currentModalSessionType === "voiceChat_modal") modalHandler.close(getDeps().domElements.voiceEnabledChatInterface);

        if (generateRecap && currentModalConnector && modalSessionTranscript.length > 0) {
            const callEndTime = new Date();
            const durationMs = modalCallStartTime ? callEndTime - modalCallStartTime : 0;
            const durationFormatted = `${Math.floor(durationMs / 60000)}m ${Math.floor((durationMs % 60000) / 1000)}s`;
            const recapBase = {
                sessionId: currentModalSessionId, connectorName: currentModalConnector.profileName,
                connector: { ...currentModalConnector }, date: modalCallStartTime?.toLocaleDateString() || new Date().toLocaleDateString(),
                duration: durationFormatted, rawTranscript: [...modalSessionTranscript], sessionType: currentModalSessionType
            };
            uiUpdater.populateRecapModal({...recapBase, topics: ["Generating..."], vocabulary: [], focusAreas: []});
            modalHandler.open(getDeps().domElements.sessionRecapScreen);

            geminiService.generateSessionRecap(modalSessionTranscript, currentModalConnector)
                .then(geminiRecap => {
                    const fullRecap = { ...recapBase, ...geminiRecap };
                    completedSessions[currentModalSessionId] = fullRecap;
                    uiUpdater.populateRecapModal(fullRecap);
                    saveCompletedSessionsToStorage();
                    if (listRenderer) listRenderer.renderSummaryList(Object.values(completedSessions), showSessionRecapInView);
                }).catch(err => {
                    console.error("Recap generation error:", err);
                    const errRecap = { ...recapBase, topics: [`Debrief failed: ${err.message}`], vocabulary:[], focusAreas:[] };
                    completedSessions[currentModalSessionId] = errRecap;
                    uiUpdater.populateRecapModal(errRecap);
                    saveCompletedSessionsToStorage();
                    if (listRenderer) listRenderer.renderSummaryList(Object.values(completedSessions), showSessionRecapInView);
                });
        }
        resetAndClearSessionState();
    }

    function resetAndClearSessionState() {
        currentModalConnector = null; currentModalSessionType = null; currentModalSessionId = null;
        modalCallStartTime = null; modalSessionTranscript = [];
        isDirectCallMicMuted = true; isDirectCallSpeakerMuted = false; isVoiceChatTTSMuted = false;
    }

    function cancelModalCallAttempt() {
        getDeps().modalHandler?.close(getDeps().domElements.virtualCallingScreen);
        resetAndClearSessionState(); stopMicrophoneStream();
    }

    function stopMicrophoneStream() {
        activeMicrophoneStream?.getTracks().forEach(track => track.stop());
        activeMicrophoneStream = null;
        if (mediaRecorder?.state !== "inactive") mediaRecorder?.stop();
        mediaRecorder = null; audioChunks = [];
        getDeps().uiUpdater?.resetVoiceChatInput();
        getDeps().uiUpdater?.updateDirectCallMicButtonVisual(true);
    }

    async function startModalAudioRecording(onStopCallback, uiContext) {
        const { uiUpdater } = getDeps();
        if (!currentModalConnector || !activeMicrophoneStream?.active) {
            alert("Microphone not ready.");
            if (uiContext === 'voiceChat') uiUpdater.updateVoiceChatTapToSpeakButton('idle');
            else if (uiContext === 'directCall') uiUpdater.updateDirectCallMicButtonVisual(true);
            return;
        }
        if (uiContext === 'voiceChat') uiUpdater.updateVoiceChatTapToSpeakButton('listening');
        else if (uiContext === 'directCall') uiUpdater.updateDirectCallStatus("Listening...", false);

        try {
            const mimeType = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/webm'].find(MediaRecorder.isTypeSupported) || 'audio/webm';
            mediaRecorder = new MediaRecorder(activeMicrophoneStream, { mimeType });
            audioChunks = [];
            mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
            mediaRecorder.onstop = async () => {
                if (uiContext === 'voiceChat') uiUpdater.updateVoiceChatTapToSpeakButton('processing');
                else if (uiContext === 'directCall') uiUpdater.updateDirectCallStatus("Processing audio...", false);
                if (audioChunks.length === 0) {
                    if (uiContext === 'voiceChat') uiUpdater.updateVoiceChatTapToSpeakButton('idle');
                    else if (uiContext === 'directCall') uiUpdater.updateDirectCallStatus("Mic Muted. No audio.", false);
                    return;
                }
                const audioBlob = new Blob(audioChunks, { type: mimeType });
                audioChunks = [];
                if (typeof onStopCallback === 'function') onStopCallback(audioBlob);
            };
            mediaRecorder.start();
            if (uiContext === 'voiceChat' && getDeps().domElements.voiceChatTapToSpeakBtn) getDeps().domElements.voiceChatTapToSpeakBtn.disabled = false;
        } catch (err) {
            console.error("startModalAudioRecording error:", err);
            if (uiContext === 'voiceChat') uiUpdater.updateVoiceChatTapToSpeakButton('idle');
            else if (uiContext === 'directCall') { uiUpdater.updateDirectCallMicButtonVisual(true); uiUpdater.updateDirectCallStatus("Recording error.", true); }
            alert(`Recording error: ${err.message}`);
        }
    }

    function stopModalAudioRecording() {
        if (mediaRecorder?.state === "recording") mediaRecorder.stop();
    }

    async function handleVoiceChatModalAudioStop(audioBlob) {
        const { uiUpdater, geminiService, polyglotHelpers } = getDeps();
        const userAudioPlaceholder = "[User Audio Segment]";
        uiUpdater.appendToVoiceChatLog(userAudioPlaceholder, 'user-audio');
        modalSessionTranscript.push({ sender: 'user-audio', text: userAudioPlaceholder, type:'audio', timestamp: Date.now() });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
            const base64Audio = reader.result.split(',')[1];
            let thinkingMsg = uiUpdater.appendToVoiceChatLog(`${currentModalConnector.profileName.split(' ')[0]} is thinking...`, 'connector-thinking');
            try {
                if (!currentModalConnector) throw new Error("Session context lost.");
                let langCodeToUse = currentModalConnector.languageCode;
                let voiceNameToUse = currentModalConnector.voiceName;
                // No need to re-check languageRoles here, languageCode/voiceName should be on connector.

                const aiResponse = await geminiService.generateTextFromAudioForCallModal(base64Audio, audioBlob.type, currentModalConnector, modalSessionTranscript.slice(0, -1));
                if(thinkingMsg?.remove) thinkingMsg.remove();
                uiUpdater.appendToVoiceChatLog(aiResponse, 'connector');
                modalSessionTranscript.push({ sender: 'connector', text: aiResponse, timestamp: Date.now() });
                if(!isVoiceChatTTSMuted && polyglotHelpers.speakText && aiResponse) {
                    polyglotHelpers.speakText(aiResponse, langCodeToUse, voiceNameToUse);
                }
            } catch (e) {
                if(thinkingMsg?.remove) thinkingMsg.remove();
                uiUpdater.appendToVoiceChatLog(`Audio Error: ${e.message}`, 'connector-error', {isError: true});
            } finally {
                uiUpdater.updateVoiceChatTapToSpeakButton('idle');
            }
        };
        reader.onerror = () => {
            uiUpdater.appendToVoiceChatLog(`File Read Error.`, 'connector-error', {isError: true});
            uiUpdater.updateVoiceChatTapToSpeakButton('idle');
        };
    }

    async function handleDirectCallModalAudioStop(audioBlob) {
        const { uiUpdater, geminiService, polyglotHelpers } = getDeps();
        modalSessionTranscript.push({ sender: 'user-audio', text: "[User Spoke]", type:'audio', timestamp: Date.now() });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
            const base64Audio = reader.result.split(',')[1];
            try {
                if (!currentModalConnector) { uiUpdater.updateDirectCallStatus("Error: Session context lost.", true); return; }
                let langCodeToUse = currentModalConnector.languageCode;
                let voiceNameToUse = currentModalConnector.voiceName;
                // No need to re-check languageRoles here.

                const aiResponse = await geminiService.generateTextFromAudioForCallModal(base64Audio, audioBlob.type, currentModalConnector, modalSessionTranscript.slice(0, -1));
                modalSessionTranscript.push({ sender: 'connector', text: aiResponse, timestamp: Date.now() });
                if (!isDirectCallSpeakerMuted && polyglotHelpers.speakText && aiResponse) {
                    polyglotHelpers.speakText(aiResponse, langCodeToUse, voiceNameToUse);
                }
                uiUpdater.updateDirectCallStatus("AI Responded. Mic Muted.", false);
            } catch (e) { uiUpdater.updateDirectCallStatus(`AI Error: ${e.message.substring(0,30)}...`, true); }
        };
        reader.onerror = (err) => uiUpdater.updateDirectCallStatus(`Audio read error: ${err.message}`, true);
    }

    function getCompletedSessions() { return Object.values(completedSessions).sort((a,b) => (new Date(b.date + " " + (b.rawTranscript?.[0]?.timestamp ? new Date(b.rawTranscript[0].timestamp).toLocaleTimeString() : "00:00:00")).getTime() || 0) - (new Date(a.date + " " + (a.rawTranscript?.[0]?.timestamp ? new Date(a.rawTranscript[0].timestamp).toLocaleTimeString() : "00:00:00")).getTime() || 0)); }
    function showSessionRecapInView(sessionOrId) {
        const { uiUpdater } = getDeps();
        const sessionData = typeof sessionOrId === 'string' ? completedSessions[sessionOrId] : sessionOrId;
        if (sessionData && uiUpdater.displaySummaryInView) uiUpdater.displaySummaryInView(sessionData);
        else if (uiUpdater.displaySummaryInView) uiUpdater.displaySummaryInView(null);
    }
    function downloadTranscriptForSession(sessionId) {
        const sessionData = completedSessions[sessionId];
        if (sessionData?.rawTranscript) {
            let transcriptText = `Session with ${sessionData.connectorName} on ${sessionData.date}\nType: ${sessionData.sessionType || 'N/A'}\nDuration: ${sessionData.duration}\n\n`;
            sessionData.rawTranscript.forEach(msg => {
                transcriptText += `${msg.sender.startsWith('user') ? 'You' : sessionData.connectorName.split(' ')[0]}: ${typeof msg.text === 'string' ? msg.text : `[${msg.type || 'Non-text'}]`}\n`;
            });
            transcriptText += `\n--- Debrief ---\nTopics: ${sessionData.topics?.join('; ') || 'N/A'}\nVocabulary: ${sessionData.vocabulary?.join('; ') || 'N/A'}\nFocus: ${sessionData.focusAreas?.join('; ') || 'N/A'}\n`;
            const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
            const a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `PolyglotDebrief_${sessionData.connectorName.replace(/\s+/g, '_')}_${sessionData.date.replace(/\//g, '-')}.txt`;
            a.click(); URL.revokeObjectURL(a.href);
        } else alert("No transcript data for this session.");
    }

    console.log("core/session_manager.js loaded.");
    return {
        initialize, startModalSession, endCurrentModalSession, cancelModalCallAttempt, getCompletedSessions,
        showSessionRecapInView, downloadTranscriptForSession,
        handleDirectCallMicToggle: () => {
            const { uiUpdater } = getDeps();
            isDirectCallMicMuted = !isDirectCallMicMuted;
            uiUpdater.updateDirectCallMicButtonVisual(isDirectCallMicMuted);
            if (!isDirectCallMicMuted) startModalAudioRecording(handleDirectCallModalAudioStop, 'directCall');
            else stopModalAudioRecording();
        },
        handleVoiceChatTapToSpeak: () => {
            if (mediaRecorder?.state === "recording") stopModalAudioRecording();
            else startModalAudioRecording(handleVoiceChatModalAudioStop, 'voiceChat');
        },
        handleDirectCallActivityRequest: async () => {
            const { uiUpdater, polyglotHelpers, polyglotSharedContent, polyglotMinigamesData } = getDeps();
            const connector = currentModalConnector;
            if (!connector || !(connector.languageRoles && connector.languageRoles[connector.language]?.includes('tutor')) || !connector.tutorMinigameImageFiles?.length) {
                 // Corrected: check if roles array includes 'tutor'
                uiUpdater.updateDirectCallStatus("No activities for this tutor.", true); return;
            }
            const filename = connector.tutorMinigameImageFiles[Math.floor(Math.random() * connector.tutorMinigameImageFiles.length)];
            const imgInfo = polyglotSharedContent.tutorImages.find(img => img.file === filename);
            if (!imgInfo) { uiUpdater.updateDirectCallStatus("Activity image error.", true); return;}
            uiUpdater.showImageInDirectCall(`images/tutor_games/${imgInfo.file}`);
            const game = polyglotMinigamesData.find(mg => imgInfo.suitableGames.includes(mg.id)) || polyglotMinigamesData.find(g=>g.id==="describe_scene") || {title:"Describe", instruction:"Describe this."};
            const instruction = game.instruction.replace("[target_language]", connector.language);
            uiUpdater.updateDirectCallStatus(`Activity: ${game.title}`, false);
            modalSessionTranscript.push({ sender: 'connector', text: instruction, type: 'activity_prompt', timestamp: Date.now() });
            if (!isDirectCallSpeakerMuted && polyglotHelpers.speakText) {
                let langCodeToUse = connector.languageCode;
                let voiceNameToUse = connector.voiceName;
                // No need to re-check languageRoles here
                polyglotHelpers.speakText(instruction, langCodeToUse, voiceNameToUse);
            }
        },
        toggleDirectCallSpeaker: () => {
            const { uiUpdater } = getDeps();
            isDirectCallSpeakerMuted = !isDirectCallSpeakerMuted;
            uiUpdater.updateDirectCallSpeakerButtonVisual(isDirectCallSpeakerMuted);
            if (isDirectCallSpeakerMuted && window.speechSynthesis) window.speechSynthesis.cancel();
        },
        toggleVoiceChatTTS: () => {
            const { uiUpdater, domElements } = getDeps();
            isVoiceChatTTSMuted = !isVoiceChatTTSMuted;
            uiUpdater.updateTTSToggleButtonVisual(domElements.toggleVoiceChatTTSBtn, isVoiceChatTTSMuted);
            if (isVoiceChatTTSMuted && window.speechSynthesis) window.speechSynthesis.cancel();
        },
        sendVoiceChatTypedText: async () => {
            const { domElements, uiUpdater, geminiService, polyglotHelpers } = getDeps();
            if (!currentModalConnector || !domElements?.voiceChatTextInput) return;
            const text = domElements.voiceChatTextInput.value.trim();
            if (!text) return;
            uiUpdater.appendToVoiceChatLog(text, 'user');
            modalSessionTranscript.push({ sender: 'user', text: text, timestamp: Date.now() });
            uiUpdater.resetVoiceChatInput();
            let thinkingMsg = uiUpdater.appendToVoiceChatLog(`${currentModalConnector.profileName.split(' ')[0]} is thinking...`, 'connector-thinking');
            try {
                let langCodeToUse = currentModalConnector.languageCode;
                let voiceNameToUse = currentModalConnector.voiceName;
                 // No need to re-check languageRoles here

                const aiResponse = await geminiService.generateTextForCallModal(text, currentModalConnector, modalSessionTranscript.slice(0, -1));
                if(thinkingMsg?.remove) thinkingMsg.remove();
                uiUpdater.appendToVoiceChatLog(aiResponse, 'connector');
                modalSessionTranscript.push({ sender: 'connector', text: aiResponse, timestamp: Date.now() });
                if (!isVoiceChatTTSMuted && polyglotHelpers.speakText) {
                    polyglotHelpers.speakText(aiResponse, langCodeToUse, voiceNameToUse);
                }
            } catch (e) {
                if(thinkingMsg?.remove) thinkingMsg.remove();
                uiUpdater.appendToVoiceChatLog(`Text input error: ${e.message}`, 'connector-error', {isError: true});
            }
        }
    };
})();

console.log("core/session_manager.js loaded. window.sessionManager object:", window.sessionManager);