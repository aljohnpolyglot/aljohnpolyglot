// js/core/chat_manager.js
window.chatManager = (() => {
    const getDeps = () => ({
        domElements: window.domElements,
        uiUpdater: window.uiUpdater,
        geminiService: window.geminiService,
        polyglotHelpers: window.polyglotHelpers,
        activityManager: window.activityManager,
        modalHandler: window.modalHandler,
        listRenderer: window.listRenderer,
        cardRenderer: window.cardRenderer,
        chatUiManager: window.chatUiManager // ADDED chatUiManager
    });

    let activeConversations = {};
    let currentEmbeddedChatTargetId = null;
    let currentModalMessageTarget = null;
    let isMessageModalTTSMuted = false;
    const MAX_GEMINI_HISTORY_TURNS = 10;

    function initialize() {
        const { polyglotHelpers } = getDeps();
        if (!polyglotHelpers) { console.error("ChatManager: polyglotHelpers missing."); return; }
        const saved = polyglotHelpers.loadFromLocalStorage('polyglotActiveConversations');
        if (saved) {
            activeConversations = saved;
            Object.values(activeConversations).forEach(convo => {
                if (!convo.geminiHistory) convo.geminiHistory = [];
                const liveConnector = (window.polyglotConnectors || []).find(c => c.id === convo.connector?.id);
                if (liveConnector) convo.connector = { ...liveConnector };
                if (convo.connector && (convo.geminiHistory.length < 2 || !convo.geminiHistory[0]?.parts[0]?.text?.includes(convo.connector.profileName))) {
                    initializeGeminiHistory(convo.geminiHistory, convo.connector);
                }
            });
        }
        console.log("ChatManager: Initialized. Active conversations loaded:", Object.keys(activeConversations).length);
    }

    function saveConversationsToStorage() {
        getDeps().polyglotHelpers?.saveToLocalStorage('polyglotActiveConversations', activeConversations);
    }

    function initializeGeminiHistory(historyArray, connector) {
        if (!connector?.profileName || !connector.modernTitle || !connector.language) {
            console.error("ChatManager: Incomplete connector for Gemini history initialization.", connector);
            return;
        }
        historyArray.length = 0;
        const systemPromptLanguage = connector.language;
        const systemPrompt = `You are ${connector.profileName}, a ${connector.modernTitle}. User is messaging for language practice. Respond ONLY in ${systemPromptLanguage}. Keep responses concise, conversational for chat. No AI mentions or character breaks.`;
        addMessageToGeminiHistoryInternal(historyArray, 'user', systemPrompt);
        addMessageToGeminiHistoryInternal(historyArray, 'model', `Okay, I am ${connector.profileName}. I will respond in ${systemPromptLanguage}.`);
    }

    function addMessageToGeminiHistoryInternal(historyArray, role, text, imageParts = null) {
        if (!text && !imageParts) {
            return;
        }
        const parts = [];
        if (imageParts) parts.push(...imageParts);
        if (text) parts.push({ text });
        historyArray.push({ role: role, parts: parts });
        const maxTurnsLength = 2 + (MAX_GEMINI_HISTORY_TURNS * 2);
        if (historyArray.length > maxTurnsLength) {
            const systemPrompts = historyArray.slice(0, 2);
            const recentTurns = historyArray.slice(-MAX_GEMINI_HISTORY_TURNS * 2);
            historyArray.length = 0;
            historyArray.push(...systemPrompts, ...recentTurns);
        }
    }

    function ensureConversationRecord(connectorId, connectorData = null) {
        // console.log("ChatManager: ensureConversationRecord - Called with ID:", connectorId, "Provided data:", connectorData);
        if (!activeConversations[connectorId]) {
            const connector = connectorData || (window.polyglotConnectors || []).find(c => c.id === connectorId);
            // console.log("ChatManager: ensureConversationRecord - Connector lookup for new record:", connector);
            if (!connector) {
                console.error("ChatManager: ensureConversationRecord - Connector not found for ID:", connectorId);
                return false;
            }
            activeConversations[connectorId] = {
                connector: { ...connector },
                messages: [],
                lastActivity: Date.now(),
                geminiHistory: []
            };
            // console.log("ChatManager: ensureConversationRecord - Created new conversation record:", activeConversations[connectorId]);
            initializeGeminiHistory(activeConversations[connectorId].geminiHistory, connector);
            return true;
        }
        activeConversations[connectorId].lastActivity = Date.now();
        const liveConnector = connectorData || (window.polyglotConnectors || []).find(c => c.id === connectorId);
        if (liveConnector) {
            activeConversations[connectorId].connector = { ...liveConnector };
        }
        // console.log("ChatManager: ensureConversationRecord - Updated existing conversation record:", activeConversations[connectorId]);
        return false;
    }

    async function sendEmbeddedTextMessage(textFromInput) {
        const { uiUpdater, geminiService, activityManager, listRenderer, polyglotHelpers } = getDeps();
        const text = textFromInput?.trim();
        if (!text || !currentEmbeddedChatTargetId || !uiUpdater || !geminiService || !activityManager || !polyglotHelpers) {
            console.error("ChatManager.sendEmbeddedTextMessage: Missing dependencies or data. TargetID:", currentEmbeddedChatTargetId);
            return;
        }
        const convo = activeConversations[currentEmbeddedChatTargetId];
        if (!convo?.connector) {
            console.error("ChatManager: Invalid conversation for embedded chat. Target ID:", currentEmbeddedChatTargetId, "Convo:", convo);
            return;
        }
        uiUpdater.appendToEmbeddedChatLog(text, 'user');
        convo.messages.push({ sender: 'user', text: text, timestamp: Date.now() });
        convo.lastActivity = Date.now();
        addMessageToGeminiHistoryInternal(convo.geminiHistory, 'user', text);
        uiUpdater.clearEmbeddedChatInput();
        uiUpdater.toggleEmbeddedSendButton(false);
        const thinkingMsg = uiUpdater.appendToEmbeddedChatLog(
            `${polyglotHelpers.sanitizeTextForDisplay(convo.connector.profileName.split(' ')[0])} is typing...`,
            'connector-thinking'
        );
        try {
            const response = await geminiService.generateTextMessage(text, convo.connector, convo.geminiHistory);
            if (thinkingMsg?.remove) thinkingMsg.remove();
            uiUpdater.appendToEmbeddedChatLog(response, 'connector');
            convo.messages.push({ sender: 'connector', text: response, timestamp: Date.now() });
            addMessageToGeminiHistoryInternal(convo.geminiHistory, 'model', response);
            convo.lastActivity = Date.now();
        } catch (e) {
            console.error("ChatManager.sendEmbeddedTextMessage Error:", e);
            if (thinkingMsg?.remove) thinkingMsg.remove();
            uiUpdater.appendToEmbeddedChatLog(`Error: ${polyglotHelpers.sanitizeTextForDisplay(e.message)}`, 'connector-error', { isError: true });
        } finally {
            uiUpdater.toggleEmbeddedSendButton(true);
            saveConversationsToStorage();
            if (listRenderer) listRenderer.renderActiveChatList(activeConversations, openConversation);
        }
    }

    async function handleEmbeddedImageUpload(event) {
        const { uiUpdater, geminiService, activityManager, listRenderer, domElements, polyglotHelpers } = getDeps();
        const file = event.target.files[0];
        if (!file || !currentEmbeddedChatTargetId || !uiUpdater || !geminiService || !activityManager || !polyglotHelpers) {
            console.error("ChatManager.handleEmbeddedImageUpload: Missing dependencies or data. TargetID:", currentEmbeddedChatTargetId);
            if(domElements?.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.value = '';
            return;
        }
        const convo = activeConversations[currentEmbeddedChatTargetId];
        if (!convo?.connector) {
            console.error("ChatManager: Invalid conversation for embedded image upload. Target ID:", currentEmbeddedChatTargetId, "Convo:", convo);
            if(domElements?.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.value = '';
            return;
        }
        let isTutorForAnyLanguage = false;
        if (convo.connector.languageRoles) {
            for (const lang in convo.connector.languageRoles) {
                if (Array.isArray(convo.connector.languageRoles[lang]) && convo.connector.languageRoles[lang].includes('tutor')) {
                    isTutorForAnyLanguage = true;
                    break;
                }
            }
        }
        if (!isTutorForAnyLanguage) {
            alert("Image sharing is currently available only with Tutors.");
            if(domElements?.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.value = '';
            return;
        }
        if (file.size > 4 * 1024 * 1024) {
            alert("Image too large (max 4MB). Please select a smaller image.");
            if(domElements?.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result.split(',')[1];
            uiUpdater.showImageInEmbeddedChat(reader.result);
            const userImageMessageText = "[User sent an image]";
            convo.messages.push({ sender: 'user', type: 'image', content_url: reader.result, text: userImageMessageText, timestamp: Date.now() });
            convo.lastActivity = Date.now();
            uiUpdater.toggleEmbeddedSendButton(false);
            const promptForGemini = `User sent this image. Please describe it briefly or ask a relevant question about it in ${convo.connector.language}.`;
            addMessageToGeminiHistoryInternal(convo.geminiHistory, 'user', promptForGemini);
            const thinkingMsg = uiUpdater.appendToEmbeddedChatLog(
                `${polyglotHelpers.sanitizeTextForDisplay(convo.connector.profileName.split(' ')[0])} is looking...`,
                'connector-thinking'
            );
            try {
                const response = await geminiService.generateTextFromImageAndText(base64, file.type, convo.connector, convo.geminiHistory, promptForGemini);
                if (thinkingMsg?.remove) thinkingMsg.remove();
                uiUpdater.appendToEmbeddedChatLog(response, 'connector');
                convo.messages.push({ sender: 'connector', text: response, timestamp: Date.now() });
                addMessageToGeminiHistoryInternal(convo.geminiHistory, 'model', response);
                convo.lastActivity = Date.now();
            } catch (e) {
                console.error("ChatManager.handleEmbeddedImageUpload Error:", e);
                if (thinkingMsg?.remove) thinkingMsg.remove();
                uiUpdater.appendToEmbeddedChatLog(`Image processing error: ${polyglotHelpers.sanitizeTextForDisplay(e.message)}`, 'connector-error', { isError: true });
            } finally {
                uiUpdater.toggleEmbeddedSendButton(true);
                saveConversationsToStorage();
                if (listRenderer) listRenderer.renderActiveChatList(activeConversations, openConversation);
                if(domElements?.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.value = '';
            }
        };
        reader.onerror = (error) => {
            console.error("FileReader error:", error);
            alert("Error reading file. Please try again.");
            if(domElements?.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.value = '';
        };
        reader.readAsDataURL(file);
    }

    function openConversation(connectorOrId) {
        const { uiUpdater, listRenderer, domElements, polyglotHelpers, chatUiManager } = getDeps();
        const targetId = typeof connectorOrId === 'string' ? connectorOrId : connectorOrId?.id;

        console.log("ChatManager: openConversation - Called with targetId:", targetId);

        if (!targetId || !uiUpdater || !chatUiManager || !polyglotHelpers) {
            console.error("ChatManager: openConversation - Missing dependencies or invalid arguments:", { targetId, uiUpdater, chatUiManager, polyglotHelpers });
            chatUiManager?.hideEmbeddedChatInterface(); // Use chatUiManager to hide chat
            return;
        }

        ensureConversationRecord(targetId, typeof connectorOrId === 'object' ? connectorOrId : null);
        const convo = activeConversations[targetId];

        if (!convo?.connector) {
            console.error(`ChatManager: openConversation - No valid conversation or connector found for ${targetId}.`);
            chatUiManager?.hideEmbeddedChatInterface(); // Use chatUiManager to hide chat
            return;
        }

        currentEmbeddedChatTargetId = targetId;

        if (chatUiManager?.showEmbeddedChatInterface) {
            console.log("ChatManager: openConversation - Calling chatUiManager.showEmbeddedChatInterface for connector:", convo.connector);
            chatUiManager.showEmbeddedChatInterface(convo.connector);

            // Repopulate messages AFTER showEmbeddedChatInterface (which clears the log via uiUpdater)
            convo.messages?.forEach((msg, index) => {
                if (msg.type === 'image' && msg.content_url) {
                    uiUpdater.showImageInEmbeddedChat(msg.content_url);
                }
                if (msg.text) {
                    uiUpdater.appendToEmbeddedChatLog(msg.text, msg.sender.startsWith('user') ? 'user' : 'connector');
                }
            });

            if (domElements?.embeddedChatLog) {
                requestAnimationFrame(() => {
                    domElements.embeddedChatLog.scrollTop = domElements.embeddedChatLog.scrollHeight;
                });
            }
        } else {
            console.error("ChatManager: openConversation - chatUiManager.showEmbeddedChatInterface is not available!");
        }

        convo.lastActivity = Date.now();
        saveConversationsToStorage();

        if (listRenderer) {
            listRenderer.renderActiveChatList(activeConversations, openConversation);
        }
    }

    function handleMessagesTabActive() {
        const { listRenderer, chatUiManager } = getDeps();
        console.log("ChatManager: handleMessagesTabActive - Called. Current embedded target:", currentEmbeddedChatTargetId);

        if (!chatUiManager) {
            console.error("ChatManager: handleMessagesTabActive - chatUiManager is NOT available. Aborting.");
            return;
        }

        if (currentEmbeddedChatTargetId && activeConversations[currentEmbeddedChatTargetId]) {
            openConversation(activeConversations[currentEmbeddedChatTargetId].connector);
        } else {
            const convosWithMessages = Object.values(activeConversations).filter(c => c.messages?.length > 0);
            if (convosWithMessages.length > 0) {
                convosWithMessages.sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
                openConversation(convosWithMessages[0].connector);
            } else {
                console.log("ChatManager: handleMessagesTabActive - No conversations with messages. Hiding embedded chat.");
                chatUiManager.hideEmbeddedChatInterface(); // Use chatUiManager to hide chat
            }
        }

        if (listRenderer) {
            listRenderer.renderActiveChatList(activeConversations, openConversation);
        }
    }

    function openMessageModal(connector) {
        const { uiUpdater, modalHandler, domElements, polyglotHelpers } = getDeps();
        if (!connector?.id || !uiUpdater || !modalHandler || !domElements || !polyglotHelpers) {
            console.error("ChatManager.openMessageModal: Missing dependencies or connector.");
            return;
        }
        ensureConversationRecord(connector.id, connector);
        currentModalMessageTarget = connector;
        const convo = activeConversations[connector.id];
        if (!convo) {
            console.error("ChatManager.openMessageModal: Conversation record not found for connector:", connector.id);
            return;
        }
        uiUpdater.updateMessageModalHeader(connector);
        uiUpdater.clearMessageModalLog();
        if (convo.messages && convo.messages.length > 0) {
            convo.messages.forEach(msg => {
                if (!msg) {
                     console.warn("ChatManager.openMessageModal: Found null/undefined message in conversation", convo);
                     return;
                }
                if (msg.type === 'image' && msg.content_url) {
                    uiUpdater.showImageInMessageModal(msg.content_url);
                }
                if (msg.text) {
                    const senderType = msg.sender?.startsWith('user') ? 'user' : 'connector';
                    uiUpdater.appendToMessageLogModal(msg.text, senderType);
                } else if (msg.type !== 'image') {
                    console.warn("ChatManager.openMessageModal: Message has no text and is not a recognized image type.", msg);
                    uiUpdater.appendToMessageLogModal("[Unsupported message format]", msg.sender?.startsWith('user') ? 'user' : 'connector');
                }
            });
        }
        if (domElements.messageChatLog) {
            requestAnimationFrame(() => {
                domElements.messageChatLog.scrollTop = domElements.messageChatLog.scrollHeight;
            });
        }
        uiUpdater.resetMessageModalInput();
        isMessageModalTTSMuted = false;
        uiUpdater.updateTTSToggleButtonVisual(domElements.toggleMessageTTSBtn, isMessageModalTTSMuted);
        modalHandler.open(domElements.messagingInterface);
        if (domElements.messageTextInput) domElements.messageTextInput.focus();
    }

    async function sendModalTextMessage(textFromInput) {
        const { uiUpdater, geminiService, activityManager, listRenderer, polyglotHelpers, domElements } = getDeps();
        const text = textFromInput?.trim();
        if (!text || !currentModalMessageTarget?.id || !uiUpdater || !geminiService || !activityManager || !polyglotHelpers || !domElements) {
             console.error("ChatManager.sendModalTextMessage: Missing dependencies or data. ModalTargetID:", currentModalMessageTarget?.id);
            return;
        }
        const convo = activeConversations[currentModalMessageTarget.id];
        if (!convo) {
            console.error("ChatManager.sendModalTextMessage: Conversation not found for modal target:", currentModalMessageTarget.id);
            return;
        }
        uiUpdater.appendToMessageLogModal(text, 'user');
        convo.messages.push({ sender: 'user', text: text, timestamp: Date.now() });
        convo.lastActivity = Date.now();
        addMessageToGeminiHistoryInternal(convo.geminiHistory, 'user', text);
        uiUpdater.resetMessageModalInput();
        if (domElements.messageSendBtn) domElements.messageSendBtn.disabled = true;
        const thinkingMsg = uiUpdater.appendToMessageLogModal(
            `${polyglotHelpers.sanitizeTextForDisplay(currentModalMessageTarget.profileName.split(' ')[0])} is typing...`,
            'connector-thinking'
        );
        try {
            const langCodeToUse = currentModalMessageTarget.languageCode;
            const voiceNameToUse = currentModalMessageTarget.voiceName;
            const response = await geminiService.generateTextMessage(text, currentModalMessageTarget, convo.geminiHistory);
            if (thinkingMsg?.remove) thinkingMsg.remove();
            uiUpdater.appendToMessageLogModal(response, 'connector');
            convo.messages.push({ sender: 'connector', text: response, timestamp: Date.now() });
            addMessageToGeminiHistoryInternal(convo.geminiHistory, 'model', response);
            convo.lastActivity = Date.now();
            if (!isMessageModalTTSMuted && polyglotHelpers.speakText && response) {
                if (langCodeToUse) {
                    polyglotHelpers.speakText(response, langCodeToUse, voiceNameToUse);
                } else {
                    console.warn("ChatManager.sendModalTextMessage: Missing languageCode for TTS for connector:", currentModalMessageTarget.id);
                }
            }
        } catch (e) {
            console.error("ChatManager.sendModalTextMessage Error:", e);
            if (thinkingMsg?.remove) thinkingMsg.remove();
            uiUpdater.appendToMessageLogModal(`Error: ${polyglotHelpers.sanitizeTextForDisplay(e.message)}`, 'connector-error', { isError: true });
        } finally {
            if (domElements.messageSendBtn) domElements.messageSendBtn.disabled = false;
            saveConversationsToStorage();
            if (listRenderer) {
                listRenderer.renderActiveChatList(activeConversations, openConversation);
            }
        }
    }

    function endModalMessagingSession() {
        const { modalHandler, domElements } = getDeps();
        modalHandler?.close(domElements?.messagingInterface);
        currentModalMessageTarget = null;
        if (window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    }

    function toggleMessageModalTTS() {
        const { uiUpdater, domElements } = getDeps();
        isMessageModalTTSMuted = !isMessageModalTTSMuted;
        uiUpdater?.updateTTSToggleButtonVisual(domElements?.toggleMessageTTSBtn, isMessageModalTTSMuted);
        if (isMessageModalTTSMuted && window.speechSynthesis && window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }
    }
    // console.log("core/chat_manager.js loaded with improvements.");
    return {
        initialize,
        ensureConversationRecord,
        sendEmbeddedTextMessage,
        handleEmbeddedImageUpload,
        openConversation,
        handleMessagesTabActive,
        openMessageModal,
        sendModalTextMessage,
        endModalMessagingSession,
        toggleMessageModalTTS,
        getActiveConversations: () => activeConversations,
        getCurrentEmbeddedChatTargetId: () => currentEmbeddedChatTargetId,
        filterAndDisplayConnectors: (filters) => {
            const { cardRenderer, activityManager } = getDeps();
            if (!window.polyglotConnectors || !cardRenderer || !activityManager) {
                console.warn("ChatManager.filterAndDisplayConnectors: Missing dependencies.");
                return;
            }
            let filtered = window.polyglotConnectors.map(c => ({ ...c, isActive: activityManager.isConnectorActive(c) }));
            if (filters.language && filters.language !== 'all') {
                filtered = filtered.filter(c => c.languageRoles && c.languageRoles[filters.language]);
            }
            if (filters.role && filters.role !== 'all') {
                filtered = filtered.filter(c => {
                    if (!c.languageRoles) return false;
                    if (filters.language && filters.language !== 'all') {
                        return c.languageRoles[filters.language] && Array.isArray(c.languageRoles[filters.language]) && c.languageRoles[filters.language].includes(filters.role);
                    } else {
                        return Object.values(c.languageRoles).some(langDataArray => Array.isArray(langDataArray) && langDataArray.includes(filters.role));
                    }
                });
            }
            cardRenderer.renderCards(filtered);
        }
    };
})();
// if (!window.chatManager) {
//     console.error("Failed to initialize window.chatManager in chat_manager.js");
// }