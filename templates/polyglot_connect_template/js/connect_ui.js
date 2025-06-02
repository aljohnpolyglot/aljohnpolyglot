// js/connect_ui.js

// --- DOM Element Selectors (Assume these are mostly correct from your version) ---
const virtualCallingScreen = document.getElementById('virtual-calling-screen');
const callingAvatar = document.getElementById('calling-avatar');
const callingName = document.getElementById('calling-name');
const callingStatus = document.getElementById('calling-status');
const cancelCallBtn = document.getElementById('cancel-call-btn');

const voiceEnabledChatInterface = document.getElementById('voice-enabled-chat-interface');
const voiceChatActiveAvatar = document.getElementById('voice-chat-active-avatar');
const voiceChatActiveName = document.getElementById('voice-chat-active-name');
const voiceChatLog = document.getElementById('voice-chat-log');
const voiceChatActivityArea = document.getElementById('voice-chat-activity-area');
const voiceChatActivityImageDisplay = document.getElementById('voice-chat-activity-image-display');
const voiceChatTextInput = document.getElementById('voice-chat-text-input');
const voiceChatTapToSpeakBtn = document.getElementById('voice-chat-tap-to-speak-btn');
const voiceChatSendTextBtn = document.getElementById('voice-chat-send-text-btn');
const endVoiceChatBtn = document.getElementById('end-voice-chat-btn');
const toggleVoiceChatTTSBtn = document.getElementById('toggle-voice-chat-tts-btn');

const directCallInterface = document.getElementById('direct-call-interface');
const directCallActiveAvatar = document.getElementById('direct-call-active-avatar');
const directCallActiveName = document.getElementById('direct-call-active-name');
const directCallStatusIndicator = document.getElementById('direct-call-status-indicator');
const directCallMuteBtn = document.getElementById('direct-call-mute-btn');
const directCallEndBtn = document.getElementById('direct-call-end-btn');
const directCallActivityArea = document.getElementById('direct-call-activity-area');
const directCallActivityImageDisplay = document.getElementById('direct-call-activity-image-display');
const directCallSpeakerToggleBtn = document.getElementById('direct-call-speaker-toggle-btn');
const directCallActivityBtn = document.getElementById('direct-call-activity-btn');


const messagingInterface = document.getElementById('messaging-interface');
const messageActiveAvatar = document.getElementById('message-active-avatar');
const messageActiveName = document.getElementById('message-active-name');
const messageChatLog = document.getElementById('message-chat-log');
const messageActivityArea = document.getElementById('message-activity-area');
const messageActivityImageDisplay = document.getElementById('message-activity-image-display');
const messageTextInput = document.getElementById('message-text-input');
const messageSendBtn = document.getElementById('message-send-btn');
const closeMessagingModalBtn = document.getElementById('close-messaging-modal-btn'); // Updated ID
const toggleMessageTTSBtn = document.getElementById('toggle-message-tts-btn');


const sessionRecapScreen = document.getElementById('session-recap-screen');
const recapConnectorName = document.getElementById('recap-connector-name');
const recapDate = document.getElementById('recap-date');
const recapDuration = document.getElementById('recap-duration');
const recapTopicsList = document.getElementById('recap-topics');
const recapVocabularyList = document.getElementById('recap-vocabulary');
const recapFocusAreasList = document.getElementById('recap-focus-areas');
const closeRecapBtn = document.getElementById('close-recap-btn');
const downloadTranscriptBtn = document.getElementById('recap-download-transcript-btn');

const detailedPersonaModalElement = document.getElementById('detailed-persona-modal');


// --- Global UI State Variables ---
window.polyglotConnectUIState = {
    isMessageTTSMuted: false,
    isVoiceChatTTSMuted: false,
    isDirectCallSpeakerMuted: false,
    isDirectCallMicMuted: true,
};

// --- General Modal Management (Exposed globally) ---
window.openModal = function(modalElement) {
    if (modalElement) {
        [virtualCallingScreen, voiceEnabledChatInterface, directCallInterface, messagingInterface, sessionRecapScreen, detailedPersonaModalElement].forEach(m => {
            if (m && m !== modalElement && m.style.display !== 'none' && m.classList.contains('active')) {
                 window.closeModal(m);
            }
        });
        modalElement.style.opacity = '0';
        modalElement.style.display = 'flex';
        modalElement.offsetHeight;
        modalElement.classList.add('active');
        modalElement.style.opacity = '1';
    }
};
window.closeModal = function(modalElement) {
    if (modalElement && modalElement.classList.contains('active')) {
        modalElement.style.opacity = '0';
        setTimeout(() => {
            modalElement.classList.remove('active');
            modalElement.style.display = 'none';
        }, 300);
    }
};

// --- Specific Interface Management Functions (Callable by connect_main.js) ---
// These prepare the modal's content before window.openModal is called.

window.showVirtualCallingScreen = function(connector, callType = "direct") {
    if (!connector || !virtualCallingScreen) return;
    if (callingAvatar) callingAvatar.src = connector.avatarModern;
    if (callingAvatar) callingAvatar.alt = `Calling ${connector.profileName || connector.name}`;
    if (callingName) callingName.textContent = `Connecting to ${connector.profileName || connector.name}...`;
    if (callingStatus) callingStatus.textContent = callType === "direct" ? "Direct Call - Ringing..." : "Voice Chat - Ringing...";
    virtualCallingScreen.dataset.callType = callType;
    window.openModal(virtualCallingScreen);
};
window.closeVirtualCallingScreen = function() { window.closeModal(virtualCallingScreen); };

window.openVoiceEnabledChatInterface = function(connector) {
    if (!connector || !voiceEnabledChatInterface) return;
    if (voiceChatActiveAvatar) voiceChatActiveAvatar.src = connector.avatarModern;
    if (voiceChatActiveName) voiceChatActiveName.textContent = connector.profileName || connector.name;
    if (voiceChatLog) voiceChatLog.innerHTML = '';
    if (voiceChatTextInput) voiceChatTextInput.value = '';
    if (voiceChatActivityArea) voiceChatActivityArea.style.display = 'none';
    if (voiceChatTapToSpeakBtn) {
        voiceChatTapToSpeakBtn.classList.remove('listening', 'processing');
        voiceChatTapToSpeakBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceChatTapToSpeakBtn.disabled = false;
    }
    if (voiceChatSendTextBtn) voiceChatSendTextBtn.style.display = 'none';
    updateTTSToggleButton(toggleVoiceChatTTSBtn, window.polyglotConnectUIState.isVoiceChatTTSMuted);

    if (connector.greetingCall) {
        window.appendMessageToVoiceChatLog(connector.greetingCall, 'connector');
        if (!window.polyglotConnectUIState.isVoiceChatTTSMuted && window.speakText) {
            window.speakText(connector.greetingCall, connector.languageCode, connector.voiceName);
        }
    }
    window.openModal(voiceEnabledChatInterface);
};
window.closeVoiceEnabledChatInterface = function() { window.closeModal(voiceEnabledChatInterface); };

window.appendMessageToVoiceChatLog = function(text, senderCssClass, messageId = null) { // Exposed
    if (!voiceChatLog) return null;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message-ui', senderCssClass);
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
    messageDiv.innerHTML = text;
    if (messageId) messageDiv.dataset.messageId = messageId;
    voiceChatLog.appendChild(messageDiv);
    voiceChatLog.scrollTop = voiceChatLog.scrollHeight;
    return messageDiv;
};
window.showImageInVoiceChatActivity = function(imageUrl) { // Exposed
    if (!voiceChatActivityImageDisplay || !voiceChatActivityArea || !voiceChatLog) return;
    if (imageUrl) {
        voiceChatActivityImageDisplay.src = imageUrl;
        voiceChatActivityArea.style.display = 'block';
        voiceChatLog.scrollTop = voiceChatLog.scrollHeight;
    } else {
        voiceChatActivityImageDisplay.src = '';
        voiceChatActivityArea.style.display = 'none';
    }
};

window.openDirectCallInterface = function(connector) {
    if (!connector || !directCallInterface) return;
    window.polyglotConnectUIState.isDirectCallMicMuted = true;
    window.polyglotConnectUIState.isDirectCallSpeakerMuted = false;

    if (directCallActiveAvatar) directCallActiveAvatar.src = connector.avatarModern;
    if (directCallActiveName) directCallActiveName.textContent = connector.profileName || connector.name;
    if (directCallStatusIndicator) directCallStatusIndicator.textContent = "Connected";
    if (directCallActivityArea) directCallActivityArea.style.display = 'none';
    if (directCallActivityBtn) directCallActivityBtn.style.display = connector.tutorMinigameImages && connector.tutorMinigameImages.length > 0 ? 'flex' : 'none';

    updateDirectCallMuteButton();
    updateDirectCallSpeakerButton();
    if (connector.greetingCall && !window.polyglotConnectUIState.isDirectCallSpeakerMuted && window.speakText) {
        window.speakText(connector.greetingCall, connector.languageCode, connector.voiceName);
    }
    window.openModal(directCallInterface);
};
window.closeDirectCallInterface = function() { window.closeModal(directCallInterface); };

window.updateDirectCallStatus = function(statusText, isError = false) { // Exposed
    if (directCallStatusIndicator) {
        directCallStatusIndicator.textContent = statusText;
        directCallStatusIndicator.style.color = isError ? (document.body.classList.contains('dark-mode') ? '#ff8080' :'#dc3545') : 'inherit';
    }
};
window.updateDirectCallMuteButton = function() { // Exposed
    if (directCallMuteBtn) {
        const isMuted = window.polyglotConnectUIState.isDirectCallMicMuted;
        directCallMuteBtn.classList.toggle('mic-active', !isMuted);
        directCallMuteBtn.innerHTML = isMuted ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
        directCallMuteBtn.title = isMuted ? "Mic Off (Click to Unmute & Record)" : "Mic On (Click to Mute & Send)";
    }
};
window.updateDirectCallSpeakerButton = function() { // Exposed
    if(directCallSpeakerToggleBtn) {
        const isMuted = window.polyglotConnectUIState.isDirectCallSpeakerMuted;
        directCallSpeakerToggleBtn.classList.toggle('speaker-active', !isMuted);
        directCallSpeakerToggleBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        directCallSpeakerToggleBtn.title = isMuted ? "AI Voice Off (Click to Enable)" : "AI Voice On (Click to Disable)";
    }
};
window.showImageInDirectCallActivity = function(imageUrl) { // Exposed
    if (!directCallActivityImageDisplay || !directCallActivityArea) return;
     if (imageUrl) {
        directCallActivityImageDisplay.src = imageUrl;
        directCallActivityArea.style.display = 'block';
    } else {
        directCallActivityImageDisplay.src = '';
        directCallActivityArea.style.display = 'none';
    }
};

window.openMessagingInterface = function(connector) { // For Modal version of messaging
    if (!connector || !messagingInterface) return;
    if (messageActiveAvatar) messageActiveAvatar.src = connector.avatarModern;
    if (messageActiveName) messageActiveName.textContent = `Chat with ${connector.profileName || connector.name}`;
    if (messageChatLog) messageChatLog.innerHTML = '';
    if (messageTextInput) messageTextInput.value = '';
    if (messageActivityArea) messageActivityArea.style.display = 'none';
    updateTTSToggleButton(toggleMessageTTSBtn, window.polyglotConnectUIState.isMessageTTSMuted);

    if (connector.greetingMessage) {
        window.appendMessageToMessageLog(connector.greetingMessage, 'connector');
        if (!window.polyglotConnectUIState.isMessageTTSMuted && window.speakText) {
            window.speakText(connector.greetingMessage, connector.languageCode, connector.voiceName);
        }
    }
    window.openModal(messagingInterface);
};
window.closeMessagingInterface = function() { window.closeModal(messagingInterface); };

window.appendMessageToMessageLog = function(text, senderCssClass, messageId = null) { // Exposed for modal
    if (!messageChatLog) return null;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message-ui', senderCssClass);
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
    messageDiv.innerHTML = text;
    if (messageId) messageDiv.dataset.messageId = messageId;
    messageChatLog.appendChild(messageDiv);
    messageChatLog.scrollTop = messageChatLog.scrollHeight;
    return messageDiv;
};
window.showImageInMessageActivity = function(imageUrl) { // Exposed for modal
    if(!messageActivityImageDisplay || !messageActivityArea || !messageChatLog) return;
    if (imageUrl) {
        messageActivityImageDisplay.src = imageUrl;
        messageActivityArea.style.display = 'block';
        messageChatLog.scrollTop = messageChatLog.scrollHeight;
    } else {
        messageActivityImageDisplay.src = '';
        messageActivityArea.style.display = 'none';
    }
};

window.openSessionRecap = function(recapData) { // Exposed
    if (!recapData || !sessionRecapScreen) return;
    if (recapConnectorName) recapConnectorName.textContent = `With ${recapData.connectorName || 'your Connector'}`;
    if (recapDate) recapDate.textContent = recapData.date || new Date().toLocaleDateString();
    if (recapDuration) recapDuration.textContent = recapData.duration || 'N/A';
    if (recapTopicsList) populateList(recapTopicsList, recapData.topics);
    if (recapVocabularyList) populateList(recapVocabularyList, recapData.vocabulary);
    if (recapFocusAreasList) populateList(recapFocusAreasList, recapData.focusAreas);
    sessionRecapScreen.dataset.rawTranscript = recapData.rawTranscript ? JSON.stringify(recapData.rawTranscript) : '';
    sessionRecapScreen.dataset.connectorNameForFile = recapData.connectorName || "Session";
    sessionRecapScreen.dataset.sessionDateForFile = recapData.date || new Date().toISOString().split('T')[0];
    sessionRecapScreen.dataset.sessionIdForDownload = recapData.sessionId || ''; // Used by connect_main.js

    window.openModal(sessionRecapScreen);
};
window.closeSessionRecap = function() { window.closeModal(sessionRecapScreen); };

function populateList(ulElement, itemsArray) {
    if (!ulElement) return;
    ulElement.innerHTML = '';
    if (itemsArray && itemsArray.length > 0) {
        itemsArray.forEach(itemText => {
            const li = document.createElement('li');
            li.textContent = itemText;
            ulElement.appendChild(li);
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'None noted for this session.';
        li.style.fontStyle = 'italic';
        ulElement.appendChild(li);
    }
}

function updateTTSToggleButton(button, isMuted) {
    if (button) {
        button.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
        button.title = isMuted ? "AI Voice Off (Click to Enable)" : "AI Voice On (Click to Disable)";
    }
}

// --- Global UI Action Setup (Called once by connect_main.js) ---
window.setupPolyglotUIGlobalActions = function() {
    if (cancelCallBtn) cancelCallBtn.addEventListener('click', () => {
        if (window.polyglotConnectMain && window.polyglotConnectMain.cancelCallAttempt) {
            window.polyglotConnectMain.cancelCallAttempt();
        }
        window.closeVirtualCallingScreen();
    });

    if (closeMessagingModalBtn) closeMessagingModalBtn.addEventListener('click', () => {
        if (window.polyglotConnectMain && window.polyglotConnectMain.endMessagingSession) {
            window.polyglotConnectMain.endMessagingSession(); // Handles modal specific logic
        } else {
            window.closeMessagingInterface();
        }
    });

    if (closeRecapBtn) closeRecapBtn.addEventListener('click', window.closeSessionRecap);

    if (toggleMessageTTSBtn) {
        toggleMessageTTSBtn.addEventListener('click', () => {
            window.polyglotConnectUIState.isMessageTTSMuted = !window.polyglotConnectUIState.isMessageTTSMuted;
            updateTTSToggleButton(toggleMessageTTSBtn, window.polyglotConnectUIState.isMessageTTSMuted);
            if (window.polyglotConnectUIState.isMessageTTSMuted && window.speechSynthesis) window.speechSynthesis.cancel();
        });
    }
    if (toggleVoiceChatTTSBtn) {
        toggleVoiceChatTTSBtn.addEventListener('click', () => {
            window.polyglotConnectUIState.isVoiceChatTTSMuted = !window.polyglotConnectUIState.isVoiceChatTTSMuted;
            updateTTSToggleButton(toggleVoiceChatTTSBtn, window.polyglotConnectUIState.isVoiceChatTTSMuted);
            if (window.polyglotConnectUIState.isVoiceChatTTSMuted && window.speechSynthesis) window.speechSynthesis.cancel();
        });
    }
    if (directCallSpeakerToggleBtn) {
        directCallSpeakerToggleBtn.addEventListener('click', () => {
            window.polyglotConnectUIState.isDirectCallSpeakerMuted = !window.polyglotConnectUIState.isDirectCallSpeakerMuted;
            window.updateDirectCallSpeakerButton(); // Use exposed function
            if (window.polyglotConnectUIState.isDirectCallSpeakerMuted && window.speechSynthesis) window.speechSynthesis.cancel();
        });
    }

    // Overlay clicks for non-chat/call modals
    [virtualCallingScreen, sessionRecapScreen, detailedPersonaModalElement].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) window.closeModal(modal);
            });
        }
    });

    // Overlay clicks for chat/call modals (usually end session)
    [voiceEnabledChatInterface, directCallInterface, messagingInterface].forEach(modal => {
        if (modal) {
            modal.addEventListener('click', (event) => {
                if (event.target === modal) {
                    if (window.polyglotConnectMain && typeof window.polyglotConnectMain.handleEndCallSystem === 'function') {
                        let callType;
                        if (modal === voiceEnabledChatInterface) callType = 'voiceChat';
                        else if (modal === directCallInterface) callType = 'direct';
                        else if (modal === messagingInterface) callType = 'message'; // Modal message session
                        if (callType) window.polyglotConnectMain.handleEndCallSystem(callType); else window.closeModal(modal);
                    } else { window.closeModal(modal); }
                }
            });
        }
    });
    console.log("connect_ui.js: Global UI actions setup.");
};

console.log("connect_ui.js loaded (Shell Integration Version, Exposed Functions).");