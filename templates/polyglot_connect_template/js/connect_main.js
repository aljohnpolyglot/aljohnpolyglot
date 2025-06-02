// js/connect_main.js (Complete, Refactored for Shell Integration and All Features)

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    // Hub for "Find Someone"
    const connectorHubGrid = document.getElementById('connector-hub');

    // Messages Tab - Embedded Chat UI
    const messagesViewContent = document.getElementById('messages-view-content');
    const messagesTabHeader = document.getElementById('active-chat-partner-name'); // Header in Messages Tab
    const messagesPlaceholder = document.getElementById('messages-placeholder');
    const embeddedChatContainer = document.getElementById('embedded-chat-container');
    const embeddedChatLog = document.getElementById('embedded-chat-log');
    const embeddedMessageActivityArea = document.getElementById('embedded-message-activity-area');
    const embeddedMessageActivityImage = document.getElementById('embedded-message-activity-image-display');
    const embeddedMessageAttachBtn = document.getElementById('embedded-message-attach-btn');
    const embeddedMessageImageUpload = document.getElementById('embedded-message-image-upload');
    const embeddedMessageTextInput = document.getElementById('embedded-message-text-input');
    const embeddedMessageSendBtn = document.getElementById('embedded-message-send-btn');

    // Summary Tab
    const summaryViewContent = document.getElementById('summary-view-content');
    const summaryTabHeader = document.getElementById('summary-for-partner-name');
    const summaryPlaceholder = document.getElementById('summary-placeholder');


    // --- Global Main State (accessible via window.polyglotConnectMain) ---
    window.polyglotConnectMain = {
        // For MODAL-based sessions (Direct Call, Voice Chat, Modal Messaging)
        currentModalConnector: null,      // AI persona for the active MODAL session
        currentModalSessionType: null,    // "direct", "voiceChat", "message" (for modal sessions)
        currentModalSessionId: null,      // Unique ID for modal session
        modalCallStartTime: null,
        modalSessionTranscript: [],       // For current modal call/voiceChat session

        // For persistent 1-on-1 text chats (managed via EMBEDDED UI in Messages Tab)
        activeConversations: {},     // { connectorId: { connector:{}, messages:[], lastActivity:timestamp, geminiHistory:[] } }
        currentEmbeddedChatTargetId: null, // connectorId of the chat shown in Messages tab's embedded UI

        // For completed sessions for recap
        completedSessions: {},       // { sessionId: { connectorName, date, duration, ..., rawTranscript, connector:{} } }

        // Microphone & MediaRecorder state (shared by modal calls/voicechat)
        activeMicrophoneStream: null,
        mediaRecorder: null,
        audioChunks: [],

        // --- Utility: Is Connector Active? ---
        isConnectorActive: (connector) => {
            return window.polyglotUtils ? window.polyglotUtils.isConnectorCurrentlyActive(connector) : true;
        },
        // ... (other methods will be added below)
    };
    const mainState = window.polyglotConnectMain; // Local alias

    // =================================================================================
    // INITIALIZATION & DATA PERSISTENCE
    // =================================================================================
    function initializeMainConnect() {
        loadPersistentData(); // Load conversations and summaries
        updateActiveChatListUI(); // Initial render of chat lists in right sidebar
        updateSummaryListUI();    // Initial render of summary list in right sidebar

        if (window.populateConnectorHub && connectorHubGrid) {
            const connectorsWithInitialStatus = (window.polyglotConnectors || []).map(c => ({
                ...c,
                isActive: mainState.isConnectorActive(c)
            }));
            window.populateConnectorHub(connectorsWithInitialStatus);
        }
        setupGlobalInteractionListeners(); // Event listeners for embedded chat, etc.
        // Set up interval to refresh connector active status on cards (e.g., every minute)
        setInterval(refreshConnectorStatusesInHub, 60000); // 60 seconds
        console.log("Polyglot Connect Main JS Initialized (Shell Version with Features).");
    }

    function loadPersistentData() {
        const savedConversations = window.polyglotUtils.loadFromLocalStorage('polyglotActiveConversations');
        if (savedConversations) {
            mainState.activeConversations = savedConversations;
            Object.values(mainState.activeConversations).forEach(convo => {
                if (!convo.geminiHistory) { // Initialize if old data without it
                    convo.geminiHistory = [];
                    const connector = convo.connector;
                    if (connector) { // Ensure connector data is present
                        const systemPrompt = `You are ${connector.name}, a ${connector.modernTitle} for ${connector.language}. User is messaging for language practice. Respond ONLY in ${connector.language}. Keep responses concise, conversational for chat. No AI mentions or character breaks.`;
                        addMessageToGeminiHistory(convo.geminiHistory, 'user', systemPrompt);
                        addMessageToGeminiHistory(convo.geminiHistory, 'model', `Okay, I am ${connector.name}. I will respond in ${connector.language}.`);
                    }
                }
            });
        }
        const savedSessions = window.polyglotUtils.loadFromLocalStorage('polyglotCompletedSessions');
        if (savedSessions) mainState.completedSessions = savedSessions;
    }

    function saveActiveConversations() {
        window.polyglotUtils.saveToLocalStorage('polyglotActiveConversations', mainState.activeConversations);
    }
    function saveCompletedSessions() {
        window.polyglotUtils.saveToLocalStorage('polyglotCompletedSessions', mainState.completedSessions);
    }

    function refreshConnectorStatusesInHub() {
        if (document.getElementById('find-view')?.classList.contains('active-view') && window.populateConnectorHub) {
            // This assumes populateConnectorHub can re-render with updated isActive states
            // Or, more efficiently, iterate over existing cards and update their status dot
            const cards = connectorHubGrid.querySelectorAll('.connector-card');
            cards.forEach(cardElement => {
                const connectorId = cardElement.querySelector('.view-profile-btn')?.dataset.connectorId;
                const connector = window.polyglotConnectors.find(c => c.id === connectorId);
                if (connector) {
                    const isActive = mainState.isConnectorActive(connector);
                    const statusDot = cardElement.querySelector('.connector-status');
                    if (statusDot) {
                        statusDot.classList.toggle('active', isActive);
                        statusDot.title = isActive ? 'Active' : 'Inactive';
                    }
                }
            });
        }
        // Also refresh status in chat list if Messages tab is active
        if (document.getElementById('messages-view')?.classList.contains('active-view')) {
            updateActiveChatListUI();
        }
    }

    // =================================================================================
    // CONNECTOR HUB & FILTERING (Called by app_shell_controller)
    // =================================================================================
    window.populateConnectorHub = function(connectorsToDisplay = window.polyglotConnectors) {
        if (!connectorHubGrid) return;
        connectorHubGrid.innerHTML = '';
        if (!connectorsToDisplay || connectorsToDisplay.length === 0) {
            connectorHubGrid.innerHTML = "<p class='loading-message'>No AI connectors match your criteria.</p>";
            return;
        }
        connectorsToDisplay.forEach(connector => {
            const card = document.createElement('div');
            card.className = 'connector-card';
            connector.isActive = mainState.isConnectorActive(connector); // Ensure status is current

            card.innerHTML = `
                <div class="connector-card-bg"></div>
                <img src="${connector.avatarModern}" alt="${connector.profileName || connector.name}" class="connector-avatar">
                <div class="connector-status ${connector.isActive ? 'active' : ''}" title="${connector.isActive ? 'Active' : 'Inactive'}"></div>
                <h3 class="connector-name">${connector.profileName || connector.name}</h3>
                <p class="connector-language">${connector.role.charAt(0).toUpperCase() + connector.role.slice(1)} (${connector.language})</p>
                <p class="connector-bio">${connector.bioModern.substring(0, 100)}${connector.bioModern.length > 100 ? '...' : ''}</p>
                <div class="connector-actions">
                    <button class="view-profile-btn" data-connector-id="${connector.id}">
                        <i class="fas fa-user-circle"></i> View Profile & Connect
                    </button>
                </div>`;
            card.querySelector('.view-profile-btn').addEventListener('click', () => {
                if (window.appShellController && window.appShellController.openDetailedPersonaModal) {
                    window.appShellController.openDetailedPersonaModal(connector);
                }
            });
            connectorHubGrid.appendChild(card);
        });
    };

    window.filterAndDisplayConnectors = function(filters) {
        if (!window.polyglotConnectors) return;
        let filtered = window.polyglotConnectors.map(c => ({...c, isActive: mainState.isConnectorActive(c)}));

        if (filters.language && filters.language !== 'all') {
            filtered = filtered.filter(c => c.language.toLowerCase() === filters.language.toLowerCase());
        }
        if (filters.role && filters.role !== 'all') {
            filtered = filtered.filter(c => c.role.toLowerCase() === filters.role.toLowerCase());
        }
        if (filters.levelTag && filters.levelTag !== 'all') {
            filtered = filtered.filter(c =>
                c.profileLanguages.some(pl => pl.lang === c.language && pl.levelTag.toLowerCase() === filters.levelTag.toLowerCase())
            );
        }
        window.populateConnectorHub(filtered);
    };

    // =================================================================================
    // SESSION INITIATION (Called from Persona Modal via app_shell_controller)
    // =================================================================================
    mainState.handleInitiateSessionFromShell = async function(connector, sessionType) {
        if (!connector) { alert("Error: Connector data missing."); return; }

        // --- For MODAL sessions (Direct Call, Voice Chat, or Modal Message) ---
        if (sessionType === "direct" || sessionType === "voiceChat" || sessionType === "message_modal") { // Added 'message_modal'
            mainState.currentModalConnector = connector;
            mainState.currentModalSessionType = sessionType === "message_modal" ? "message" : sessionType;
            mainState.currentModalSessionId = `${connector.id}_modal_${Date.now()}`;
            mainState.modalSessionTranscript = []; // Reset for new call/voicechat

            console.log(`Main: Initiating MODAL ${mainState.currentModalSessionType} with ${connector.profileName}`);

            if (sessionType === "direct" || sessionType === "voiceChat") {
                window.showVirtualCallingScreen(connector, sessionType); // from connect_ui.js
                try {
                    if (!mainState.activeMicrophoneStream || !mainState.activeMicrophoneStream.active) {
                        mainState.activeMicrophoneStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
                    }
                    console.log("Microphone access permitted for modal session.");
                    setTimeout(() => {
                        window.closeVirtualCallingScreen();
                        mainState.modalCallStartTime = new Date();
                        if (sessionType === "direct") window.openDirectCallInterface(connector);
                        else if (sessionType === "voiceChat") window.openVoiceEnabledChatInterface(connector);
                        if (connector.greetingCall) mainState.modalSessionTranscript.push({ sender: 'connector', text: connector.greetingCall, type: 'greeting' });
                         if(sessionType === "voiceChat" && voiceChatTextInput) voiceChatTextInput.focus();
                    }, 1500);
                } catch (err) { handleSessionStartError(err, sessionType); }
            } else if (sessionType === "message_modal") {
                ensureConversationRecord(connector.id, connector); // Still manage persistent history
                window.openMessagingInterface(connector); // from connect_ui.js
                // Load history into MODAL chat log
                if (messageChatLog) messageChatLog.innerHTML = '';
                mainState.activeConversations[connector.id].messages.forEach(msg => {
                    window.appendMessageToMessageLog(msg.text, msg.sender.startsWith('user') ? 'user' : 'connector');
                });
                if (connector.greetingMessage && mainState.activeConversations[connector.id].messages.length === 0) {
                     mainState.activeConversations[connector.id].messages.push({ sender: 'connector', text: connector.greetingMessage, timestamp: Date.now() });
                     addMessageToGeminiHistory(mainState.activeConversations[connector.id].geminiHistory, 'model', connector.greetingMessage);
                     window.appendMessageToMessageLog(connector.greetingMessage, 'connector');
                }
                if (messageTextInput) messageTextInput.focus();
            }
        }
        // --- For EMBEDDED Message session (in Messages Tab) ---
        else if (sessionType === "message") { // This implies embedded chat now
            mainState.currentEmbeddedChatTargetId = connector.id;
            ensureConversationRecord(connector.id, connector);

            // Switch to Messages Tab UI (app_shell_controller handles this via item.click())
            const messagesNavItem = document.querySelector('.nav-item[data-tab="messages"]');
            if (messagesNavItem && !messagesNavItem.classList.contains('active')) messagesNavItem.click();

            // Show the embedded chat UI for this connector
            if (window.appShellController && window.appShellController.showEmbeddedChat) {
                window.appShellController.showEmbeddedChat(connector);
                // Load existing messages
                if (embeddedChatLog) embeddedChatLog.innerHTML = '';
                mainState.activeConversations[connector.id].messages.forEach(msg => {
                    if (msg.type === 'image' && msg.content_url) { // Handle image messages
                        if(window.appShellController.showImageInEmbeddedChat) window.appShellController.showImageInEmbeddedChat(msg.content_url);
                    } else if (msg.text) {
                        if(window.appShellController.appendMessageToEmbeddedChat) window.appShellController.appendMessageToEmbeddedChat(msg.text, msg.sender.startsWith('user') ? 'user' : 'connector');
                    }
                });
                if(embeddedChatLog) embeddedChatLog.scrollTop = embeddedChatLog.scrollHeight;

                // Send greeting if it's a new chat session for this connector (no prior messages)
                if (connector.greetingMessage && mainState.activeConversations[connector.id].messages.length === 0) {
                     if(window.appShellController.appendMessageToEmbeddedChat) window.appShellController.appendMessageToEmbeddedChat(connector.greetingMessage, 'connector');
                     mainState.activeConversations[connector.id].messages.push({ sender: 'connector', text: connector.greetingMessage, timestamp: Date.now() });
                     addMessageToGeminiHistory(mainState.activeConversations[connector.id].geminiHistory, 'model', connector.greetingMessage);
                }
            }
            if (embeddedMessageTextInput) embeddedMessageTextInput.focus();
            updateActiveChatListUI(); // Update right sidebar
        }
    };

    function ensureConversationRecord(connectorId, connector) {
        if (!mainState.activeConversations[connectorId]) {
            mainState.activeConversations[connectorId] = {
                connector: connector, messages: [], lastActivity: Date.now(), geminiHistory: []
            };
            const systemPrompt = `You are ${connector.name}, a ${connector.modernTitle} for ${connector.language}. User is messaging for language practice. Respond ONLY in ${connector.language}. Keep responses concise, conversational for chat. No AI mentions or character breaks.`;
            addMessageToGeminiHistory(mainState.activeConversations[connectorId].geminiHistory, 'user', systemPrompt);
            addMessageToGeminiHistory(mainState.activeConversations[connectorId].geminiHistory, 'model', `Okay, I am ${connector.name}. I will respond in ${connector.language}.`);
        } else {
            mainState.activeConversations[connectorId].lastActivity = Date.now();
        }
    }

    function handleSessionStartError(err, sessionType) {
        console.error(`Error starting modal ${sessionType}:`, err);
        window.closeVirtualCallingScreen(); // from connect_ui.js
        let alertMessage = `Could not start ${sessionType}. Ensure microphone permission.`;
        if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') alertMessage = "No microphone found.";
        else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') alertMessage = "Microphone access denied.";
        else alertMessage += ` (Error: ${err.message || err.name || 'Unknown'})`;
        alert(alertMessage);
        resetModalSessionState();
    }

    // =================================================================================
    // ENDING SESSIONS / CLEANUP
    // =================================================================================
    mainState.handleEndCallSystem = function(endedSessionType) { // For MODAL sessions
        if (!mainState.currentModalConnector && !mainState.modalCallStartTime && !mainState.currentModalSessionType) {
            console.log("handleEndCallSystem: No active modal session for ending.");
            if (endedSessionType === "direct") window.closeDirectCallInterface();
            else if (endedSessionType === "voiceChat") window.closeVoiceEnabledChatInterface();
            else if (endedSessionType === "message") window.closeMessagingInterface(); // For modal message
            stopMicrophoneStreamIfNeeded(); return;
        }
        const endedType = endedSessionType || mainState.currentModalSessionType;
        console.log(`Ending MODAL ${endedType} with ${mainState.currentModalConnector?.profileName || 'Unknown'}`);

        if (mainState.mediaRecorder && mainState.mediaRecorder.state === "recording") mainState.mediaRecorder.stop();
        stopMicrophoneStreamIfNeeded();

        if (endedType === "direct") window.closeDirectCallInterface();
        else if (endedType === "voiceChat") window.closeVoiceEnabledChatInterface();
        else if (endedType === "message") window.closeMessagingInterface(); // Modal message session

        if ((endedType === "direct" || endedType === "voiceChat") && mainState.modalSessionTranscript.length > 0) {
            const callEndTime = new Date();
            const durationMs = mainState.modalCallStartTime ? callEndTime - mainState.modalCallStartTime : 0;
            const durationMinutes = Math.floor(durationMs / 60000);
            const durationSeconds = Math.floor((durationMs % 60000) / 1000);
            const callDurationFormatted = `${durationMinutes}m ${durationSeconds}s`;

            const recapData = {
                sessionId: mainState.currentModalSessionId,
                connectorName: mainState.currentModalConnector.profileName,
                connector: mainState.currentModalConnector,
                date: mainState.modalCallStartTime.toLocaleDateString(),
                duration: callDurationFormatted,
                topics: ["Generating debrief..."], vocabulary: [], focusAreas: [],
                rawTranscript: [...mainState.modalSessionTranscript]
            };
            mainState.completedSessions[mainState.currentModalSessionId] = { ...recapData, topics:[], vocabulary:[], focusAreas:[] }; // Store basic
            if (window.getGeminiSessionRecap) {
                window.openSessionRecap(recapData); // Open with placeholder
                window.getGeminiSessionRecap(mainState.modalSessionTranscript, mainState.currentModalConnector)
                    .then(geminiRecap => {
                        const fullRecap = { ...recapData, ...geminiRecap };
                        mainState.completedSessions[mainState.currentModalSessionId] = fullRecap;
                        window.openSessionRecap(fullRecap); updateSummaryListUI(); saveCompletedSessions();
                    }).catch(error => { console.error("Recap error:", error); /* ... */ });
            } else { window.openSessionRecap(recapData); updateSummaryListUI(); saveCompletedSessions(); }
        }
        resetModalSessionState();
    };

    mainState.endMessagingSession = function() { // Called when MODAL messaging is closed
        if (mainState.currentModalConnector && mainState.currentModalSessionType === 'message') {
            console.log(`MODAL Messaging session with ${mainState.currentModalConnector.profileName} ended.`);
            if (mainState.activeConversations[mainState.currentModalConnector.id]) {
                mainState.activeConversations[mainState.currentModalConnector.id].lastActivity = Date.now();
            }
            saveActiveConversations(); updateActiveChatListUI();
            resetModalSessionState(); // Clears modal-specific state
        }
        window.closeMessagingInterface();
    };

    function resetModalSessionState() { // For modal-based calls/chats
        mainState.currentModalConnector = null; mainState.currentModalSessionType = null; mainState.currentModalSessionId = null;
        mainState.modalCallStartTime = null; mainState.modalSessionTranscript = [];
        stopMicrophoneStreamIfNeeded();
    }
    mainState.cancelCallAttempt = function() { console.log("Modal Call attempt cancelled."); resetModalSessionState(); };

    function stopMicrophoneStreamIfNeeded() {
        if (mainState.activeMicrophoneStream) {
            mainState.activeMicrophoneStream.getTracks().forEach(track => track.stop());
            mainState.activeMicrophoneStream = null; console.log("Microphone stream stopped.");
        }
        if(voiceChatTapToSpeakBtn) {
            voiceChatTapToSpeakBtn.classList.remove('listening', 'processing');
            voiceChatTapToSpeakBtn.innerHTML = '<i class="fas fa-microphone"></i>'; voiceChatTapToSpeakBtn.disabled = false;
        }
        if(directCallMuteBtn){
            window.polyglotConnectUIState.isDirectCallMicMuted = true;
            if(window.updateDirectCallMuteButton) window.updateDirectCallMuteButton();
        }
    }

    // =================================================================================
    // TEXT & AUDIO PROCESSING (Adapting existing modal handlers)
    // =================================================================================
    async function startVoiceChatAudioRecording_Shell(buttonElement) {
        if (!mainState.currentModalConnector || !mainState.activeMicrophoneStream || !mainState.activeMicrophoneStream.active) {
            alert("Microphone not ready for Voice Chat."); return;
        }
        buttonElement.classList.remove('processing'); buttonElement.classList.add('listening');
        buttonElement.innerHTML = '<i class="fas fa-stop"></i> Listening...'; buttonElement.disabled = true;
        try {
            const mimeTypes = ['audio/ogg; codecs=opus', 'audio/webm; codecs=opus', 'audio/webm', 'audio/ogg'];
            let MimeTypeForRecording = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/ogg';
            mainState.mediaRecorder = new MediaRecorder(mainState.activeMicrophoneStream, { mimeType: MimeTypeForRecording });
            mainState.audioChunks = [];
            mainState.mediaRecorder.ondataavailable = event => mainState.audioChunks.push(event.data);
            mainState.mediaRecorder.onstop = async () => {
                buttonElement.classList.remove('listening'); buttonElement.classList.add('processing');
                buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                if (mainState.audioChunks.length === 0) { /* reset button */ buttonElement.classList.remove('processing'); buttonElement.innerHTML = '<i class="fas fa-microphone"></i>'; buttonElement.disabled = false; return; }
                const audioBlob = new Blob(mainState.audioChunks, { type: MimeTypeForRecording || mainState.audioChunks[0]?.type });
                mainState.audioChunks = [];
                window.appendMessageToVoiceChatLog("You (audio)", 'user-audio');
                mainState.modalSessionTranscript.push({ sender: 'user-audio', text: "[User Audio Segment]" });
                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = reader.result.split(',')[1];
                    let thinkingMsg = window.appendMessageToVoiceChatLog(`${mainState.currentModalConnector.profileName.split(' ')[0]} is thinking...`, 'connector-thinking');
                    try {
                        if (window.sendAudioDataToGeminiForCall) {
                            const aiResponse = await window.sendAudioDataToGeminiForCall(base64Audio, audioBlob.type, mainState.currentModalConnector, mainState.modalSessionTranscript.slice(0, -1));
                            if(thinkingMsg) thinkingMsg.remove();
                            window.appendMessageToVoiceChatLog(aiResponse, 'connector');
                            mainState.modalSessionTranscript.push({ sender: 'connector', text: aiResponse });
                            if(!window.polyglotConnectUIState.isVoiceChatTTSMuted && window.speakText && aiResponse) {
                                window.speakText(aiResponse, mainState.currentModalConnector.languageCode, mainState.currentModalConnector.voiceName);
                            }
                        }
                    } catch (e) { if(thinkingMsg) thinkingMsg.remove(); window.appendMessageToVoiceChatLog(`Audio Error: ${e.message}`, 'user-audio-error');}
                    finally { buttonElement.classList.remove('processing'); buttonElement.innerHTML = '<i class="fas fa-microphone"></i>'; buttonElement.disabled = false; }
                };
                reader.onerror = () => { /* reset button, error msg */ buttonElement.classList.remove('processing'); buttonElement.innerHTML = '<i class="fas fa-microphone"></i>'; buttonElement.disabled = false; window.appendMessageToVoiceChatLog(`File Read Error`, 'user-audio-error');};
            };
            mainState.mediaRecorder.start(); buttonElement.disabled = false;
        } catch (err) { /* reset button, alert */ buttonElement.classList.remove('listening', 'processing'); buttonElement.innerHTML = '<i class="fas fa-microphone"></i>'; buttonElement.disabled = false; alert(`Recording error: ${err.message}`);}
    }
    function stopVoiceChatAudioRecording_Shell(buttonElement) {
        if (mainState.mediaRecorder && mainState.mediaRecorder.state === "recording") mainState.mediaRecorder.stop();
        else { buttonElement.classList.remove('listening', 'processing'); buttonElement.innerHTML = '<i class="fas fa-microphone"></i>'; buttonElement.disabled = false; }
    }
    async function handleDirectCallMicToggle_Shell() { // For MODAL Direct Call
        const uiState = window.polyglotConnectUIState;
        if (!mainState.currentModalConnector) return;
        uiState.isDirectCallMicMuted = !uiState.isDirectCallMicMuted;
        window.updateDirectCallMuteButton();
        if (!uiState.isDirectCallMicMuted) { // Mic UNMUTED
            if (!mainState.activeMicrophoneStream || !mainState.activeMicrophoneStream.active) {
                try { mainState.activeMicrophoneStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false }); }
                catch (err) { alert(`Mic Error: ${err.message}`); uiState.isDirectCallMicMuted = true; window.updateDirectCallMuteButton(); return; }
            }
            if(directCallMuteBtn) directCallMuteBtn.disabled = true; window.updateDirectCallStatus("Listening...", false);
            const mimeTypes = ['audio/ogg; codecs=opus', 'audio/webm; codecs=opus', 'audio/webm', 'audio/ogg'];
            let MimeTypeForRecording = mimeTypes.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/ogg';
            mainState.mediaRecorder = new MediaRecorder(mainState.activeMicrophoneStream, { mimeType: MimeTypeForRecording });
            mainState.audioChunks = [];
            mainState.mediaRecorder.ondataavailable = event => mainState.audioChunks.push(event.data);
            mainState.mediaRecorder.start(); if(directCallMuteBtn) directCallMuteBtn.disabled = false;
        } else { // Mic MUTED
            if (mainState.mediaRecorder && mainState.mediaRecorder.state === "recording") {
                window.updateDirectCallStatus("Processing audio...", false); if(directCallMuteBtn) directCallMuteBtn.disabled = true;
                mainState.mediaRecorder.onstop = async () => {
                    if(directCallMuteBtn) directCallMuteBtn.disabled = false;
                    if (mainState.audioChunks.length === 0) { window.updateDirectCallStatus("Mic Muted. No audio.", false); return; }
                    const audioBlob = new Blob(mainState.audioChunks, { type: MimeTypeForRecording || mainState.audioChunks[0]?.type });
                    mainState.audioChunks = []; mainState.modalSessionTranscript.push({ sender: 'user-audio', text: "[User Spoke]" });
                    const reader = new FileReader(); reader.readAsDataURL(audioBlob);
                    reader.onloadend = async () => {
                        const base64Audio = reader.result.split(',')[1];
                        try {
                            if (!mainState.currentModalConnector) { window.updateDirectCallStatus("Error: Session context lost.", true); return; }
                            if (window.sendAudioDataToGeminiForCall) {
                                const aiResponse = await window.sendAudioDataToGeminiForCall(base64Audio, audioBlob.type, mainState.currentModalConnector, mainState.modalSessionTranscript.slice(0, -1));
                                mainState.modalSessionTranscript.push({ sender: 'connector', text: aiResponse });
                                if (!uiState.isDirectCallSpeakerMuted && window.speakText && aiResponse) {
                                    window.speakText(aiResponse, mainState.currentModalConnector.languageCode, mainState.currentModalConnector.voiceName);
                                }
                                window.updateDirectCallStatus("Mic Muted. AI Responded.", false);
                            }
                        } catch (e) { window.updateDirectCallStatus(`AI Error: ${e.message.substring(0,30)}...`, true); }
                    };
                    reader.onerror = (err) => { window.updateDirectCallStatus(`Audio read error: ${err.message}`, true); };
                };
                mainState.mediaRecorder.stop();
            } else { window.updateDirectCallStatus("Mic Muted", false); }
        }
    }
    async function sendTextMessage_VoiceChat_Shell() { // For MODAL Voice Chat
        const text = voiceChatTextInput.value.trim();
        const uiState = window.polyglotConnectUIState;
        if (text && mainState.currentModalConnector) {
            window.appendMessageToVoiceChatLog(text, 'user');
            mainState.modalSessionTranscript.push({ sender: 'user', text: text });
            voiceChatTextInput.value = ''; voiceChatSendTextBtn.style.display = 'none';
            if (voiceChatTapToSpeakBtn) voiceChatTapToSpeakBtn.disabled = true;
            let thinkingMsg = window.appendMessageToVoiceChatLog(`${mainState.currentModalConnector.profileName.split(' ')[0]} is thinking...`, 'connector-thinking');
            try {
                if (window.sendTextToGeminiForCall) {
                    const response = await window.sendTextToGeminiForCall(text, mainState.currentModalConnector, mainState.modalSessionTranscript.slice(0, -1));
                    if(thinkingMsg) thinkingMsg.remove();
                    window.appendMessageToVoiceChatLog(response, 'connector');
                    mainState.modalSessionTranscript.push({ sender: 'connector', text: response });
                    if(!uiState.isVoiceChatTTSMuted && window.speakText && response) {
                        window.speakText(response, mainState.currentModalConnector.languageCode, mainState.currentModalConnector.voiceName);
                    }
                }
            } catch (e) { if(thinkingMsg) thinkingMsg.remove(); window.appendMessageToVoiceChatLog(`Error: ${e.message}`, 'connector-error');}
            finally { if (voiceChatTapToSpeakBtn) voiceChatTapToSpeakBtn.disabled = false; }
        }
    }
    async function sendTextMessage_Messaging_Modal_Shell() { // For MODAL Messaging
        const text = messageTextInput.value.trim(); // Modal input
        const connector = mainState.currentModalConnector; // Modal session connector
        const uiState = window.polyglotConnectUIState;
        if (text && connector && mainState.activeConversations[connector.id]) {
            const convo = mainState.activeConversations[connector.id];
            window.appendMessageToMessageLog(text, 'user'); // To MODAL log
            convo.messages.push({ sender: 'user', text: text, timestamp: Date.now() });
            convo.lastActivity = Date.now();
            addMessageToGeminiHistory(convo.geminiHistory, 'user', text);
            messageTextInput.value = ''; if(messageSendBtn) messageSendBtn.disabled = true;
            let thinkingMsg = window.appendMessageToMessageLog(`${connector.profileName.split(' ')[0]} is typing...`, 'connector-thinking');
            try {
                if (window.sendTextToGeminiForMessage_Shell) {
                    const response = await window.sendTextToGeminiForMessage_Shell(text, connector, convo.geminiHistory);
                    if(thinkingMsg) thinkingMsg.remove();
                    window.appendMessageToMessageLog(response, 'connector');
                    convo.messages.push({ sender: 'connector', text: response, timestamp: Date.now() });
                    addMessageToGeminiHistory(convo.geminiHistory, 'model', response);
                    convo.lastActivity = Date.now();
                    if(!uiState.isMessageTTSMuted && window.speakText && response) {
                        window.speakText(response, connector.languageCode, connector.voiceName);
                    }
                }
            } catch (e) { if(thinkingMsg) thinkingMsg.remove(); window.appendMessageToMessageLog(`Error: ${e.message}`, 'connector-error');}
            finally { if(messageSendBtn) messageSendBtn.disabled = false; saveActiveConversations(); updateActiveChatListUI(); }
        }
    }

    // --- Text for EMBEDDED Messaging (Messages Tab) ---
    mainState.sendEmbeddedTextMessage = async function(textFromInput) {
        const text = textFromInput.trim(); // Already got from input
        const connectorId = mainState.currentEmbeddedChatTargetId;
        const uiState = window.polyglotConnectUIState;
        if (text && connectorId && mainState.activeConversations[connectorId]) {
            const convo = mainState.activeConversations[connectorId];
            if(window.appShellController.appendMessageToEmbeddedChat) window.appShellController.appendMessageToEmbeddedChat(text, 'user');
            convo.messages.push({ sender: 'user', text: text, timestamp: Date.now() });
            convo.lastActivity = Date.now();
            addMessageToGeminiHistory(convo.geminiHistory, 'user', text);
            if (embeddedMessageTextInput) embeddedMessageTextInput.value = ''; // Clear input
            if (embeddedMessageSendBtn) embeddedMessageSendBtn.disabled = true;

            const typingIndicatorText = `${convo.connector.profileName.split(' ')[0]} is typing...`;
            let thinkingMsgElement; // To remove it later
            if(window.appShellController.appendMessageToEmbeddedChat) { // Temporarily show typing
                 thinkingMsgElement = window.appShellController.appendMessageToEmbeddedChat(typingIndicatorText, 'connector-thinking embedded-thinking');
            }

            try {
                if (window.sendTextToGeminiForMessage_Shell) {
                    const response = await window.sendTextToGeminiForMessage_Shell(text, convo.connector, convo.geminiHistory);
                    if (thinkingMsgElement) thinkingMsgElement.remove();
                    if(window.appShellController.appendMessageToEmbeddedChat) window.appShellController.appendMessageToEmbeddedChat(response, 'connector');
                    convo.messages.push({ sender: 'connector', text: response, timestamp: Date.now() });
                    addMessageToGeminiHistory(convo.geminiHistory, 'model', response);
                    convo.lastActivity = Date.now();
                    if(!uiState.isMessageTTSMuted && window.speakText && response) { // Assumes embedded uses message TTS state
                        window.speakText(response, convo.connector.languageCode, convo.connector.voiceName);
                    }
                }
            } catch (e) {
                if (thinkingMsgElement) thinkingMsgElement.remove();
                if(window.appShellController.appendMessageToEmbeddedChat) window.appShellController.appendMessageToEmbeddedChat(`Error: ${e.message}`, 'connector-error');
            } finally {
                if(embeddedMessageSendBtn) embeddedMessageSendBtn.disabled = false;
                saveActiveConversations(); updateActiveChatListUI();
            }
        }
    };
    // Helper for Gemini history array for 1-on-1 text chats
    function addMessageToGeminiHistory(historyArray, role, text) {
        // Prevent re-adding identical system prompt if already first
        if (role === "user" && historyArray.length > 0 && historyArray[0].role === "user" && historyArray[0].parts[0].text === text && text.startsWith("You are")) {
            return;
        }
        historyArray.push({ role: role, parts: [{ text: text }] });
        const MAX_GEMINI_HISTORY_TURNS = 10;
        if (historyArray.length > (MAX_GEMINI_HISTORY_TURNS * 2 + 2)) {
            const systemPrompts = historyArray.slice(0, 2);
            const recentTurns = historyArray.slice(-(MAX_GEMINI_HISTORY_TURNS * 2));
            historyArray.length = 0; // Clear array while preserving reference
            historyArray.push(...systemPrompts, ...recentTurns);
        }
    }

    // --- User Image Submission (EMBEDDED chat with Tutor) ---
    mainState.handleEmbeddedImageUpload = async function(event) {
        const file = event.target.files[0];
        if (!file || !mainState.currentEmbeddedChatTargetId) return;
        const connectorId = mainState.currentEmbeddedChatTargetId;
        const convo = mainState.activeConversations[connectorId];
        if (!convo || convo.connector.role !== 'tutor') {
            alert("Image sharing is available with Tutors only in this chat."); return;
        }
        if (file.size > 4 * 1024 * 1024) { alert("Image too large (max 4MB)."); return; }

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64ImageString = reader.result.split(',')[1];
            const mimeType = file.type;

            if (window.appShellController && window.appShellController.showImageInEmbeddedChat) {
                window.appShellController.showImageInEmbeddedChat(reader.result); // Show local preview
            }
            convo.messages.push({ sender: 'user', type: 'image', content_url: reader.result, timestamp: Date.now(), text: "[User sent an image]" });
            convo.lastActivity = Date.now();
            addMessageToGeminiHistory(convo.geminiHistory, 'user', "[User sent an image. Describe it or ask about it.]"); // Add text placeholder for history

            // Simulate AI looking at image
            const typingIndicatorText = `${convo.connector.profileName.split(' ')[0]} is looking at the image...`;
            let thinkingMsgElement;
            if(window.appShellController.appendMessageToEmbeddedChat) {
                 thinkingMsgElement = window.appShellController.appendMessageToEmbeddedChat(typingIndicatorText, 'connector-thinking embedded-thinking');
            }

            if (window.sendImageToGeminiForChat_Shell) {
                try {
                    const aiResponseText = await window.sendImageToGeminiForChat_Shell(base64ImageString, mimeType, convo.connector, convo.geminiHistory, "User sent this image. What are your thoughts on it in " + convo.connector.language + "?");
                    if (thinkingMsgElement) thinkingMsgElement.remove();
                    if(window.appShellController.appendMessageToEmbeddedChat) window.appShellController.appendMessageToEmbeddedChat(aiResponseText, 'connector');
                    convo.messages.push({ sender: 'connector', text: aiResponseText, timestamp: Date.now() });
                    addMessageToGeminiHistory(convo.geminiHistory, 'model', aiResponseText);
                    convo.lastActivity = Date.now();
                    // TTS, save, update UI
                    saveActiveConversations(); updateActiveChatListUI();
                } catch (e) {
                    if (thinkingMsgElement) thinkingMsgElement.remove();
                    if(window.appShellController.appendMessageToEmbeddedChat) window.appShellController.appendMessageToEmbeddedChat(`Sorry, I had trouble with that image. ${e.message}`, 'connector-error');
                }
            }
        };
        reader.readAsDataURL(file);
        if(embeddedMessageImageUpload) embeddedMessageImageUpload.value = ''; // Reset file input
    };

    // =================================================================================
    // UI LIST UPDATES (Right Sidebar for Messages & Summary)
    // =================================================================================
    function updateActiveChatListUI() { // For Messages Tab's right sidebar
        if (window.appShellController && window.appShellController.renderChatList) {
            const convosToDisplay = Object.values(mainState.activeConversations)
                .filter(convo => convo.messages && convo.messages.length > 0)
                .map(convo => ({...convo, connector: {...convo.connector, isActive: mainState.isConnectorActive(convo.connector)}})) // Add current isActive
                .sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
            window.appShellController.renderChatList(convosToDisplay);
        }
    }
    function updateSummaryListUI() { // For Summary Tab's right sidebar
         if (window.appShellController && window.appShellController.renderSummaryList) {
            const sessionsArray = Object.values(mainState.completedSessions)
                .sort((a,b) => {
                    const dateA = new Date( (a.date || "1/1/1970") + " " + (a.rawTranscript && a.rawTranscript.length > 0 && a.rawTranscript[0].timestamp ? new Date(a.rawTranscript[0].timestamp).toLocaleTimeString() : "00:00:00"));
                    const dateB = new Date( (b.date || "1/1/1970") + " " + (b.rawTranscript && b.rawTranscript.length > 0 && b.rawTranscript[0].timestamp ? new Date(b.rawTranscript[0].timestamp).toLocaleTimeString() : "00:00:00"));
                    return dateB - dateA;
                });
            window.appShellController.renderSummaryList(sessionsArray);
        }
    }
    mainState.setActiveOneOnOneChat = function(connectorId) { // Called when user clicks a chat in Messages right sidebar
        const convo = mainState.activeConversations[connectorId];
        if (convo && window.appShellController && window.appShellController.showEmbeddedChat) {
            mainState.currentEmbeddedChatTargetId = connectorId;
            window.appShellController.showEmbeddedChat(convo.connector);
            if (embeddedChatLog) embeddedChatLog.innerHTML = ''; // Clear previous
            convo.messages.forEach(msg => {
                 if(msg.type === 'image' && msg.content_url) {
                    if(window.appShellController.showImageInEmbeddedChat) window.appShellController.showImageInEmbeddedChat(msg.content_url);
                 } else if (msg.text) {
                    if(window.appShellController.appendMessageToEmbeddedChat) window.appShellController.appendMessageToEmbeddedChat(msg.text, msg.sender.startsWith('user') ? 'user' : 'connector');
                 }
            });
            if(embeddedChatLog) embeddedChatLog.scrollTop = embeddedChatLog.scrollHeight;
            if(embeddedMessageTextInput) embeddedMessageTextInput.focus();
            // Mark as "read" or update UI if needed
            convo.lastActivity = Date.now(); // Can be used to visually indicate unread later
            saveActiveConversations(); // Save in case activity changes sorting
            updateActiveChatListUI(); // Re-render list to reflect potential order change
        } else {
            console.warn(`Conversation with ${connectorId} not found or UI not ready for embedded chat.`);
             if(window.appShellController.hideEmbeddedChat) window.appShellController.hideEmbeddedChat();
        }
    };
    mainState.showSessionRecapById = function(sessionId) { // Called from Summary right sidebar
        const sessionData = mainState.completedSessions[sessionId];
        if (sessionData && window.openSessionRecap) { // openSessionRecap is from connect_ui.js
            // If we want to display recap in main container instead of modal:
            // 1. Get summary-view-content element.
            // 2. Clear it.
            // 3. Populate it with recapData (similar to how openSessionRecap populates its modal).
            // For now, using the existing modal:
            window.openSessionRecap(sessionData);
            if(summaryTabHeader && sessionData.connectorName) summaryTabHeader.textContent = `Summary: ${sessionData.connectorName} (${sessionData.date})`;
            if(summaryPlaceholder) summaryPlaceholder.style.display = 'none';

            // Logic to actually display the recap in the summary-view-content
            if (summaryViewContent) {
                summaryViewContent.innerHTML = `
                    <div class="recap-modal-content-embedded"> <!-- Style this class -->
                        <h3>Debrief: ${sessionData.connectorName}</h3>
                        <p><strong>Date:</strong> ${sessionData.date}</p>
                        <p><strong>Duration:</strong> ${sessionData.duration}</p>
                        <div class="recap-section"><h4><i class="fas fa-list-alt"></i> Topics:</h4><ul id="emb-recap-topics"></ul></div>
                        <div class="recap-section"><h4><i class="fas fa-book-open"></i> Vocabulary:</h4><ul id="emb-recap-vocab"></ul></div>
                        <div class="recap-section"><h4><i class="fas fa-bullseye"></i> Focus Areas:</h4><ul id="emb-recap-focus"></ul></div>
                        <!-- Add download button if desired here -->
                    </div>
                `;
                const populateEmbList = (ulId, items) => {
                    const ul = document.getElementById(ulId);
                    if(ul) {
                        ul.innerHTML = '';
                        if(items && items.length > 0) items.forEach(item => ul.innerHTML += `<li>${item}</li>`);
                        else ul.innerHTML = '<li>N/A</li>';
                    }
                };
                populateEmbList('emb-recap-topics', sessionData.topics);
                populateEmbList('emb-recap-vocab', sessionData.vocabulary);
                populateEmbList('emb-recap-focus', sessionData.focusAreas);
            }


        } else {
            alert("Could not find summary for this session.");
            if(summaryTabHeader) summaryTabHeader.textContent = "Learning Summary";
            if(summaryPlaceholder) summaryPlaceholder.style.display = 'block';
            if (summaryViewContent) summaryViewContent.innerHTML = summaryPlaceholder.outerHTML;

        }
    };

    // =================================================================================
    // MINIGAME / ACTIVITY HANDLING (Direct Call MODAL Example)
    // =================================================================================
    async function handleDirectCallActivityRequest() { // For MODAL Direct Call
        const connector = mainState.currentModalConnector;
        if (!connector || !connector.tutorMinigameImages || connector.tutorMinigameImages.length === 0) {
            window.updateDirectCallStatus("No activities available.", true); return;
        }
        const randomImageFile = connector.tutorMinigameImages[Math.floor(Math.random() * connector.tutorMinigameImages.length)];
        const gameImageInfo = window.tutorSharedImages.find(img => img.file.includes(randomImageFile)); // Find full info
        if (!gameImageInfo) { window.updateDirectCallStatus("Activity image error.", true); return;}

        const fullImagePath = gameImageInfo.file; // Already has path
        window.showImageInDirectCallActivity(fullImagePath);

        // Pick a random suitable game (from minigame definitions)
        const suitableGames = window.polyglotMinigames.filter(mg => gameImageInfo.suitableGames.includes(mg.id));
        const game = suitableGames.length > 0 ? suitableGames[Math.floor(Math.random() * suitableGames.length)] : window.polyglotMinigames[0]; // Fallback
        const gameInstruction = game.instruction.replace("[target_language]", connector.language);

        window.updateDirectCallStatus(`Activity: ${game.title}`, false);
        mainState.modalSessionTranscript.push({ sender: 'connector', text: gameInstruction, type: 'activity_prompt' });
        if (!window.polyglotConnectUIState.isDirectCallSpeakerMuted && window.speakText) {
            window.speakText(gameInstruction, connector.languageCode, connector.voiceName);
        }
    }

    // =================================================================================
    // GLOBAL EVENT LISTENERS & INITIALIZATION
    // =================================================================================
    function setupGlobalInteractionListeners() {
        // Embedded Chat (Messages Tab)
        if (embeddedMessageSendBtn) embeddedMessageSendBtn.addEventListener('click', mainState.sendEmbeddedTextMessage.bind(null, () => embeddedMessageTextInput.value)); // Pass input value getter
        if (embeddedMessageTextInput) {
            embeddedMessageTextInput.addEventListener('keypress', e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    mainState.sendEmbeddedTextMessage(embeddedMessageTextInput.value);
                }
            });
        }
        // User Image Upload for Embedded Chat
        if (embeddedMessageAttachBtn && embeddedMessageImageUpload) {
            // Listener already in app_shell_controller, which calls mainState.handleEmbeddedImageUpload
        }

        // Modal UI listeners (buttons inside modals) are set up once here.
        // Voice-Enabled Chat (Modal)
        if (endVoiceChatBtn) endVoiceChatBtn.addEventListener('click', () => mainState.handleEndCallSystem("voiceChat"));
        if (voiceChatTapToSpeakBtn) {
            voiceChatTapToSpeakBtn.addEventListener('click', () => {
                if (mainState.mediaRecorder && mainState.mediaRecorder.state === "recording") stopVoiceChatAudioRecording_Shell(voiceChatTapToSpeakBtn);
                else startVoiceChatAudioRecording_Shell(voiceChatTapToSpeakBtn);
            });
        }
        if (voiceChatTextInput && voiceChatSendTextBtn) {
            voiceChatTextInput.addEventListener('input', () => voiceChatSendTextBtn.style.display = voiceChatTextInput.value.trim() !== '' ? 'inline-block' : 'none');
            voiceChatSendTextBtn.addEventListener('click', sendTextMessage_VoiceChat_Shell);
            voiceChatTextInput.addEventListener('keypress', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTextMessage_VoiceChat_Shell(); }});
        }

        // Direct Call (Modal)
        if (directCallMuteBtn) directCallMuteBtn.addEventListener('click', handleDirectCallMicToggle_Shell);
        if (directCallEndBtn) directCallEndBtn.addEventListener('click', () => mainState.handleEndCallSystem("direct"));
        if (directCallActivityBtn) directCallActivityBtn.addEventListener('click', handleDirectCallActivityRequest);

        // Messaging (Modal) - if still used
        if (messageSendBtn && messageTextInput && messagingInterface) { // Check messagingInterface to ensure these are for modal
            messageSendBtn.addEventListener('click', sendTextMessage_Messaging_Modal_Shell);
            messageTextInput.addEventListener('keypress', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendTextMessage_Messaging_Modal_Shell(); }});
        }

        // Recap Download
        if (downloadTranscriptBtn && sessionRecapScreen) {
            downloadTranscriptBtn.addEventListener('click', () => {
                const sessionId = sessionRecapScreen.dataset.sessionIdForDownload;
                const sessionData = mainState.completedSessions[sessionId];
                if (sessionData && sessionData.rawTranscript) {
                    let transcriptText = `Session with ${sessionData.connectorName} on ${sessionData.date}\nDuration: ${sessionData.duration}\n\n`;
                    sessionData.rawTranscript.forEach(msg => {
                        let speaker = msg.sender.startsWith('user') ? 'You' : sessionData.connectorName.split(' ')[0];
                        transcriptText += `${speaker}: ${msg.text}\n`;
                    });
                    transcriptText += "\n--- Call Debrief ---\n";
                    transcriptText += "Topics: " + (sessionData.topics?.join('; ') || 'N/A') + "\n";
                    transcriptText += "Vocabulary: " + (sessionData.vocabulary?.join('; ') || 'N/A') + "\n";
                    transcriptText += "Focus Areas: " + (sessionData.focusAreas?.join('; ') || 'N/A') + "\n";
                    const blob = new Blob([transcriptText], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a'); a.href = url;
                    const fName = `PolyglotConnect_Debrief_${sessionData.connectorName.replace(/\s+/g, '_')}_${sessionData.date.replace(/\//g, '-')}.txt`;
                    a.download = fName; document.body.appendChild(a); a.click(); document.body.removeChild(a); URL.revokeObjectURL(url);
                } else { alert("No transcript data for download."); }
            });
        }

        // Call the UI setup from connect_ui.js for its global listeners (TTS toggles, modal overlay clicks)
        if (typeof window.setupPolyglotUIGlobalActions === 'function') {
            window.setupPolyglotUIGlobalActions();
        }
    }

    // START THE MAIN LOGIC
    initializeMainConnect();

}); // End DOMContentLoaded