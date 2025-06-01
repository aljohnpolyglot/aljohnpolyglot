// js/core/text_message_handler.js
// Handles sending text and image messages in 1-on-1 chats.

window.textMessageHandler = (() => {
    'use strict';

    const getDeps = () => ({
        uiUpdater: window.uiUpdater,
        geminiService: window.geminiService,
        conversationManager: window.conversationManager,
        domElements: window.domElements,
        polyglotHelpers: window.polyglotHelpers,
        chatOrchestrator: window.chatOrchestrator
    });

    async function sendEmbeddedTextMessage(textFromInput, currentEmbeddedChatTargetId) {
        // ... (no changes here)
        const { uiUpdater, geminiService, polyglotHelpers, conversationManager, chatOrchestrator } = getDeps();
        const text = textFromInput?.trim();

        if (!text || !currentEmbeddedChatTargetId) {
            console.error("TextMessageHandler:sendEmbeddedTextMessage - Missing text or targetId."); // Clarified error
            return;
        }

        const { conversation: convo } = conversationManager.ensureConversationRecord(currentEmbeddedChatTargetId);
        if (!convo || !convo.connector) {
            console.error("TextMessageHandler: Invalid conversation for embedded chat. Target ID:", currentEmbeddedChatTargetId);
            return;
        }

        uiUpdater.appendToEmbeddedChatLog(text, 'user');
        conversationManager.addMessageToConversation(currentEmbeddedChatTargetId, 'user', text, 'text');

        uiUpdater.clearEmbeddedChatInput();
        uiUpdater.toggleEmbeddedSendButton(false); // Disable while processing
        const thinkingMsg = uiUpdater.appendToEmbeddedChatLog(
            `${polyglotHelpers.sanitizeTextForDisplay(convo.connector.profileName.split(' ')[0])} is typing...`,
            'connector-thinking'
        );

        try {
            const aiResponse = await geminiService.generateTextMessage(text, convo.connector, convo.geminiHistory);
            if (thinkingMsg?.remove) thinkingMsg.remove();
            uiUpdater.appendToEmbeddedChatLog(aiResponse, 'connector');
            conversationManager.addModelResponseMessage(currentEmbeddedChatTargetId, aiResponse, convo.geminiHistory);
        } catch (e) {
            console.error("TextMessageHandler:sendEmbeddedTextMessage Error:", e);
            if (thinkingMsg?.remove) thinkingMsg.remove();
            uiUpdater.appendToEmbeddedChatLog(`Error: ${polyglotHelpers.sanitizeTextForDisplay(e.message)}`, 'connector-error', { isError: true });
            // Optionally add to convo.messages as system error
            // conversationManager.addMessageToConversation(currentEmbeddedChatTargetId, 'system-error', `Failed to get AI response: ${e.message}`);
        } finally {
            uiUpdater.toggleEmbeddedSendButton(true); // Re-enable
            if (chatOrchestrator) chatOrchestrator.notifyNewActivityInConversation(currentEmbeddedChatTargetId);
        }
    }

    async function handleEmbeddedImageUpload(event, currentEmbeddedChatTargetId) {
        const { uiUpdater, geminiService, domElements, polyglotHelpers, conversationManager, chatOrchestrator } = getDeps(); // Removed listRenderer here, use chatOrchestrator
        const file = event.target.files[0];

        if (!file || !currentEmbeddedChatTargetId) {
            console.warn("TextMessageHandler:handleEmbeddedImageUpload - No file or targetId.");
            if (domElements?.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.value = '';
            return;
        }

        const { conversation: convo } = conversationManager.ensureConversationRecord(currentEmbeddedChatTargetId);
        if (!convo || !convo.connector) {
            console.error("TextMessageHandler:handleEmbeddedImageUpload - Invalid conversation for target ID:", currentEmbeddedChatTargetId);
            if (domElements?.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.value = '';
            return;
        }

        // REMOVED TUTOR CHECK
        // let isTutorForAnyLanguage = false;
        // if (convo.connector.languageRoles) { ... }
        // if (!isTutorForAnyLanguage) { ... return; }

        if (file.size > 4 * 1024 * 1024) { // Max 4MB
            alert("Image too large (max 4MB).");
            if (domElements?.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            console.log("TextMessageHandler: FileReader successful for embedded image. Target ID:", currentEmbeddedChatTargetId);
            const base64DataForApi = reader.result.split(',')[1];
            const dataUrlForDisplay = reader.result;

            uiUpdater.appendToEmbeddedChatLog("", 'user', { imageUrl: dataUrlForDisplay });
            console.log("TextMessageHandler: User image displayed in embedded UI.");

            const imageMessageText = "[User sent an image]";
            conversationManager.addMessageToConversation(
                currentEmbeddedChatTargetId, 'user', imageMessageText, 'image', Date.now(),
                { content_url: dataUrlForDisplay, imagePartsForGemini: [{ inlineData: { mimeType: file.type, data: base64DataForApi } }] }
            );
             console.log("TextMessageHandler: User image message added to conversation " + currentEmbeddedChatTargetId);


            uiUpdater.toggleEmbeddedSendButton(false); // Disable while processing
            const thinkingMsg = uiUpdater.appendToEmbeddedChatLog(`${polyglotHelpers.sanitizeTextForDisplay(convo.connector.profileName.split(' ')[0])} is looking...`, 'connector-thinking');
            console.log("TextMessageHandler: 'is looking' message shown for embedded.");

            try {
                const promptForGeminiWithImage = `The user has sent this image. Please comment on it or ask a relevant question in ${convo.connector.language}.`;
                console.log("TextMessageHandler: Calling geminiService.generateTextFromImageAndText for embedded. Prompt:", promptForGeminiWithImage.substring(0,100));
                
                const aiResponseText = await geminiService.generateTextFromImageAndText(
                    base64DataForApi, file.type, convo.connector, convo.geminiHistory, promptForGeminiWithImage
                );
                console.log("TextMessageHandler: AI Response Text from embedded image:", aiResponseText);

                if (thinkingMsg?.remove) thinkingMsg.remove();
                uiUpdater.appendToEmbeddedChatLog(aiResponseText, 'connector');
                console.log("TextMessageHandler: AI text response displayed for embedded.");

                conversationManager.addModelResponseMessage(currentEmbeddedChatTargetId, aiResponseText, convo.geminiHistory);
                console.log("TextMessageHandler: AI response message added to conversation " + currentEmbeddedChatTargetId);


            } catch (e) {
                console.error("TextMessageHandler:handleEmbeddedImageUpload - Error getting AI response:", e);
                if (thinkingMsg?.remove) thinkingMsg.remove();
                uiUpdater.appendToEmbeddedChatLog(`Image processing error: ${polyglotHelpers.sanitizeTextForDisplay(e.message)}`, 'connector-error', { isError: true });
            } finally {
                // convo.lastActivity is updated by addMessage/addModelResponse
                uiUpdater.toggleEmbeddedSendButton(true); // Re-enable
                // conversationManager.saveConversationsToStorage(); // Done by addMessage/addModelResponse
                if (chatOrchestrator) chatOrchestrator.notifyNewActivityInConversation(currentEmbeddedChatTargetId);
                if (domElements?.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.value = ''; // Clear file input
                console.log("TextMessageHandler: Embedded image upload finally block executed for " + currentEmbeddedChatTargetId);
            }
        };
        reader.onerror = (error) => {
            console.error("textMessageHandler: FileReader error (embedded):", error);
            alert("Error reading image file.");
            if (domElements?.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.value = '';
        };
        reader.readAsDataURL(file);
    }

    async function handleModalImageUpload(event, currentModalMessageTarget) { // Changed 'connector' param to 'currentModalMessageTarget' for clarity
        const { uiUpdater, geminiService, domElements, polyglotHelpers, conversationManager, chatOrchestrator } = getDeps(); // Removed listRenderer
        const file = event.target.files[0];
        const targetId = currentModalMessageTarget?.id; // Get ID from the passed connector object

        if (!file || !targetId) {
            console.warn("TextMessageHandler:handleModalImageUpload - No file or targetId.");
            if (domElements?.messageModalImageUpload) domElements.messageModalImageUpload.value = '';
            return;
        }

        // Use currentModalMessageTarget directly as it should be the full connector object
        const { conversation: convo } = conversationManager.ensureConversationRecord(targetId, currentModalMessageTarget);
        if (!convo || !convo.connector) {
            console.error("TextMessageHandler:handleModalImageUpload - Invalid conversation for target ID:", targetId);
            if (domElements?.messageModalImageUpload) domElements.messageModalImageUpload.value = '';
            return;
        }

        // REMOVED TUTOR CHECK
        // let isTutorInAnyLanguage = false;
        // if (convo.connector.languageRoles) { ... }
        // if (!isTutorInAnyLanguage) { ... return; }

        if (file.size > 4 * 1024 * 1024) { // Max 4MB
            alert("Image too large (max 4MB).");
            if (domElements?.messageModalImageUpload) domElements.messageModalImageUpload.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            console.log("TextMessageHandler: FileReader successful for modal image. Target ID:", targetId);
            const base64DataForApi = reader.result.split(',')[1];
            const dataUrlForDisplay = reader.result;

            uiUpdater.appendToMessageLogModal("", 'user', { imageUrl: dataUrlForDisplay });
             console.log("TextMessageHandler: User image displayed in modal UI.");

            const imageMessageText = "[User sent an image]";
            conversationManager.addMessageToConversation(
                targetId, 'user', imageMessageText, 'image', Date.now(),
                { content_url: dataUrlForDisplay, imagePartsForGemini: [{ inlineData: { mimeType: file.type, data: base64DataForApi } }] }
            );
            console.log("TextMessageHandler: User image message added to conversation " + targetId);


            if (domElements?.messageSendBtn) domElements.messageSendBtn.disabled = true; // Disable send button during processing
            const thinkingMsg = uiUpdater.appendToMessageLogModal(`${polyglotHelpers.sanitizeTextForDisplay(convo.connector.profileName.split(' ')[0])} is looking...`, 'connector-thinking');
            console.log("TextMessageHandler: 'is looking' message shown for modal.");

            try {
                const promptForGeminiWithImage = `The user has sent this image. Please comment on it or ask a relevant question in ${convo.connector.language}.`;
                console.log("TextMessageHandler: Calling geminiService.generateTextFromImageAndText for modal. Prompt:", promptForGeminiWithImage.substring(0,100));

                const aiResponseText = await geminiService.generateTextFromImageAndText(
                    base64DataForApi, file.type, convo.connector, convo.geminiHistory, promptForGeminiWithImage
                );
                console.log("TextMessageHandler: AI Response Text from modal image:", aiResponseText);

                if (thinkingMsg?.remove) thinkingMsg.remove();
                uiUpdater.appendToMessageLogModal(aiResponseText, 'connector');
                console.log("TextMessageHandler: AI text response displayed for modal.");

                conversationManager.addModelResponseMessage(targetId, aiResponseText, convo.geminiHistory);
                console.log("TextMessageHandler: AI response message added to conversation " + targetId);

            } catch (e) {
                console.error("TextMessageHandler:handleModalImageUpload - Error getting AI response:", e);
                if (thinkingMsg?.remove) thinkingMsg.remove();
                uiUpdater.appendToMessageLogModal(`Image processing error: ${polyglotHelpers.sanitizeTextForDisplay(e.message)}`, 'connector-error', { isError: true });
            } finally {
                // convo.lastActivity updated by addMessage/addModelResponse
                if (domElements?.messageSendBtn) domElements.messageSendBtn.disabled = false; // Re-enable
                // conversationManager.saveConversationsToStorage(); // Done by addMessage/addModelResponse
                if (chatOrchestrator) chatOrchestrator.notifyNewActivityInConversation(targetId);
                if (domElements?.messageModalImageUpload) domElements.messageModalImageUpload.value = ''; // Clear file input
                console.log("TextMessageHandler: Modal image upload finally block executed for " + targetId);
            }
        };
        reader.onerror = (error) => {
            console.error("textMessageHandler: FileReader error (modal):", error);
            alert("Error reading image file.");
            if (domElements?.messageModalImageUpload) domElements.messageModalImageUpload.value = '';
        };
        reader.readAsDataURL(file);
    }

    async function sendModalTextMessage(textFromInput, currentModalMessageTarget) {
        // ... (no changes here)
        const { uiUpdater, geminiService, polyglotHelpers, domElements, conversationManager, chatOrchestrator } = getDeps();
        const text = textFromInput?.trim();

        if (!text || !currentModalMessageTarget?.id) {
            console.error("TextMessageHandler:sendModalTextMessage - Missing text or valid currentModalMessageTarget.");
            if (domElements?.messageSendBtn) domElements.messageSendBtn.disabled = false; // Ensure button is re-enabled
            return;
        }

        const { conversation: convo } = conversationManager.ensureConversationRecord(currentModalMessageTarget.id, currentModalMessageTarget);
        if (!convo || !convo.connector) {
            console.error("TextMessageHandler:sendModalTextMessage - Invalid conversation for target ID:", currentModalMessageTarget.id);
            if (domElements?.messageSendBtn) domElements.messageSendBtn.disabled = false;
            return;
        }

        uiUpdater.appendToMessageLogModal(text, 'user');
        conversationManager.addMessageToConversation(currentModalMessageTarget.id, 'user', text, 'text');

        if (domElements?.messageSendBtn) domElements.messageSendBtn.disabled = true; // Disable while processing
        uiUpdater.resetMessageModalInput(); // Clears input

        const thinkingMsg = uiUpdater.appendToMessageLogModal(
            `${polyglotHelpers.sanitizeTextForDisplay(convo.connector.profileName.split(' ')[0])} is typing...`,
            'connector-thinking'
        );

        try {
            const aiResponse = await geminiService.generateTextMessage(text, convo.connector, convo.geminiHistory);
            if (thinkingMsg?.remove) thinkingMsg.remove();
            uiUpdater.appendToMessageLogModal(aiResponse, 'connector');
            conversationManager.addModelResponseMessage(currentModalMessageTarget.id, aiResponse, convo.geminiHistory);
        } catch (e) {
            console.error("TextMessageHandler:sendModalTextMessage Error:", e);
            if (thinkingMsg?.remove) thinkingMsg.remove();
            uiUpdater.appendToMessageLogModal(`Error: ${polyglotHelpers.sanitizeTextForDisplay(e.message)}`, 'connector-error', { isError: true });
            // Optionally add to convo.messages as system error
        } finally {
            if (domElements?.messageSendBtn) domElements.messageSendBtn.disabled = false; // Re-enable
            if (chatOrchestrator) chatOrchestrator.notifyNewActivityInConversation(currentModalMessageTarget.id);
        }
    }

    console.log("js/core/text_message_handler.js updated (tutor check removed for images, logging improved).");
    return {
        sendEmbeddedTextMessage,
        handleEmbeddedImageUpload, // Make sure this is exported
        sendModalTextMessage,
        handleModalImageUpload // Make sure this is exported
    };
})();