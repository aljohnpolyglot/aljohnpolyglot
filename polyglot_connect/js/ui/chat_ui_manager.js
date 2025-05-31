// js/ui/chat_ui_manager.js
// Manages UI aspects of embedded chat and group chat interfaces.

window.chatUiManager = (() => {
    const getDeps = () => ({
        domElements: window.domElements,
        uiUpdater: window.uiUpdater,         // For updating headers, clearing logs/inputs
        chatManager: window.chatManager,     // For sending messages
        groupManager: window.groupManager,   // For sending group messages, user typing
    });

    // Called once by app.js or self-invoked if only setting up static listeners
    function initializeChatUiControls() {
        const { domElements, chatManager, groupManager } = getDeps();
        console.log("chatUiManager: initializeChatUiControls - Setting up listeners.");

        if (!domElements) {
            console.warn("chatUiManager: initializeChatUiControls - domElements not available.");
            return;
        }

        // --- Embedded Chat Listeners ---
        if (domElements.embeddedMessageSendBtn && domElements.embeddedMessageTextInput) {
            domElements.embeddedMessageSendBtn.addEventListener('click', handleSendEmbeddedMessage);
            domElements.embeddedMessageTextInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendEmbeddedMessage();
                }
            });
            console.log("chatUiManager: Embedded chat input/send listeners attached.");
        } else {
            console.warn("chatUiManager: Embedded message send button or text input not found.");
        }

        if (domElements.embeddedMessageAttachBtn && domElements.embeddedMessageImageUpload) {
            domElements.embeddedMessageAttachBtn.addEventListener('click', () => {
                if (domElements.embeddedMessageImageUpload) domElements.embeddedMessageImageUpload.click();
            });
            domElements.embeddedMessageImageUpload.addEventListener('change', handleEmbeddedImageUploadEvent);
            console.log("chatUiManager: Embedded chat attach/upload listeners attached.");
        } else {
            console.warn("chatUiManager: Embedded message attach button or image upload input not found.");
        }

        // --- Group Chat Listeners ---
        if (domElements.sendGroupMessageBtn && domElements.groupChatInput) {
            domElements.sendGroupMessageBtn.addEventListener('click', handleSendGroupMessage);
            domElements.groupChatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendGroupMessage();
                } else if (groupManager?.userIsTyping) { // Check if groupManager and method exist
                    groupManager.userIsTyping();
                }
            });
            console.log("chatUiManager: Group chat input/send listeners attached.");
        } else {
            console.warn("chatUiManager: Group chat send button or input not found.");
        }

        if (domElements.leaveGroupBtn) {
            domElements.leaveGroupBtn.addEventListener('click', () => {
                groupManager?.leaveCurrentGroup(); // Call groupManager to handle leave logic
            });
            console.log("chatUiManager: Group chat leave button listener attached.");
        } else {
            console.warn("chatUiManager: Group chat leave button not found.");
        }
        console.log("chatUiManager: Chat UI control listeners attached.");
    }

    // --- Embedded Chat UI ---
    function showEmbeddedChatInterface(connector) {
        const { domElements, uiUpdater } = getDeps();
        console.log("chatUiManager: showEmbeddedChatInterface - Called for connector:", connector?.id);

        if (!domElements?.embeddedChatContainer || !domElements.messagesPlaceholder || !uiUpdater || !connector) {
            console.error("chatUiManager: showEmbeddedChatInterface - ABORTING. Missing critical elements or connector.", {
                hasEmbContainer: !!domElements?.embeddedChatContainer,
                hasPlaceholder: !!domElements?.messagesPlaceholder,
                hasUiUpdater: !!uiUpdater,
                hasConnector: !!connector
            });
            return;
        }

        domElements.messagesPlaceholder.style.display = 'none';
        domElements.embeddedChatContainer.style.display = 'flex'; // Use flex for proper layout

        uiUpdater.updateEmbeddedChatHeader(connector); // Sets name, attach btn visibility
        uiUpdater.clearEmbeddedChatLog();           // Clear previous messages from UI
        uiUpdater.clearEmbeddedChatInput();         // Clear input field

        if (domElements.embeddedMessageTextInput) {
            domElements.embeddedMessageTextInput.focus();
        }
        console.log("chatUiManager: Embedded chat interface shown for", connector.id);
    }

    function hideEmbeddedChatInterface() {
        const { domElements } = getDeps();
        console.log("chatUiManager: hideEmbeddedChatInterface - Called.");

        if (!domElements?.embeddedChatContainer || !domElements.messagesPlaceholder) {
            console.warn("chatUiManager: hideEmbeddedChatInterface - Missing embeddedChatContainer or messagesPlaceholder.");
            return;
        }

        domElements.embeddedChatContainer.style.display = 'none';
        domElements.messagesPlaceholder.style.display = 'block'; // Or 'flex' if that's its default
        if (domElements.messagesTabHeader) {
            domElements.messagesTabHeader.textContent = "Your Conversations"; // Reset header
        }
        console.log("chatUiManager: Embedded chat interface hidden.");
    }

    function handleSendEmbeddedMessage() {
        const { domElements, chatManager } = getDeps();
        if (!domElements?.embeddedMessageTextInput || !chatManager?.sendEmbeddedTextMessage) {
            console.warn("chatUiManager: handleSendEmbeddedMessage - Input field or chatManager.sendEmbeddedTextMessage missing.");
            return;
        }
        const text = domElements.embeddedMessageTextInput.value.trim();
        if (text) {
            chatManager.sendEmbeddedTextMessage(text); // chatManager clears input via uiUpdater
        }
    }

    function handleEmbeddedImageUploadEvent(event) {
        const { chatManager } = getDeps();
        if (!chatManager?.handleEmbeddedImageUpload) {
            console.warn("chatUiManager: handleEmbeddedImageUploadEvent - chatManager.handleEmbeddedImageUpload missing.");
            return;
        }
        chatManager.handleEmbeddedImageUpload(event);
    }


    // --- Group Chat UI ---
    function showGroupChatView(groupName, members) {
        const { domElements, uiUpdater } = getDeps();
        console.log("chatUiManager: showGroupChatView - Called for group:", groupName);

        if (!domElements?.groupListContainer || !domElements.groupChatInterfaceDiv || !uiUpdater) {
            console.error("chatUiManager: showGroupChatView - ABORTING. Missing critical elements.");
            return;
        }
        domElements.groupListContainer.style.display = 'none';
        domElements.groupChatInterfaceDiv.style.display = 'flex'; // Use flex

        uiUpdater.updateGroupChatHeader(groupName, members);
        uiUpdater.clearGroupChatLog();
        uiUpdater.clearGroupChatInput(); // Ensure input is clear

        if (domElements.groupChatInput) {
            domElements.groupChatInput.focus();
        }
        console.log("chatUiManager: Group chat view shown for", groupName);
    }

    function hideGroupChatView() {
        const { domElements, groupManager } = getDeps(); // Added groupManager
        console.log("chatUiManager: hideGroupChatView - Called.");

        if (!domElements?.groupListContainer || !domElements.groupChatInterfaceDiv) {
            console.warn("chatUiManager: hideGroupChatView - Missing groupListContainer or groupChatInterfaceDiv.");
            return;
        }
        domElements.groupChatInterfaceDiv.style.display = 'none';
        domElements.groupListContainer.style.display = 'block';

        // Optional: Refresh group list when hiding the chat view
        // This was previously in shellController.hideGroupChatInterface
        groupManager?.loadAvailableGroups();
        console.log("chatUiManager: Group chat view hidden.");
    }

    function handleSendGroupMessage() {
        const { groupManager } = getDeps();
        if (!groupManager?.handleUserMessageInGroup) {
            console.warn("chatUiManager: handleSendGroupMessage - groupManager.handleUserMessageInGroup missing.");
            return;
        }
        groupManager.handleUserMessageInGroup(); // groupManager clears input via uiUpdater
    }


    // Initialize listeners when the module loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeChatUiControls);
    } else {
        initializeChatUiControls();
    }

    console.log("js/ui/chat_ui_manager.js loaded.");
    return {
        // Embedded Chat
        showEmbeddedChatInterface,
        hideEmbeddedChatInterface,
        // Group Chat
        showGroupChatView,
        hideGroupChatView
        // initializeChatUiControls is internal
        // handleSend... functions are internal event handlers
    };
})();