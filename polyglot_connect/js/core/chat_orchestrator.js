// js/core/chat_orchestrator.js
// Orchestrates 1-on-1 chat interactions and group chats, acting as the main chatManager facade.

window.chatOrchestrator = (() => {
    'use strict';

    const getDeps = () => ({
        domElements: window.domElements,
        uiUpdater: window.uiUpdater,
        polyglotHelpers: window.polyglotHelpers,
        modalHandler: window.modalHandler,
        listRenderer: window.listRenderer,
        cardRenderer: window.cardRenderer,
        chatUiManager: window.chatUiManager,
        conversationManager: window.conversationManager,
        groupManager: window.groupManager, // Added groupManager
        textMessageHandler: window.textMessageHandler,
        voiceMemoHandler: window.voiceMemoHandler,
        activityManager: window.activityManager,
        viewManager: window.viewManager
    });

    let currentEmbeddedChatTargetId = null;
    let currentModalMessageTarget = null;

    function initialize() {
        const { conversationManager, groupManager } = getDeps();
        console.log("ChatOrchestrator: Initializing...");
        conversationManager?.initialize();
        groupManager?.initialize(); // Ensure groupManager is initialized
        console.log("ChatOrchestrator: Initialized.");
    }

    function getCombinedActiveChats() {
        const { conversationManager, groupManager } = getDeps();
        const oneOnOneConversations = Object.values(conversationManager.getActiveConversations() || {})
            .filter(convo => convo?.connector && convo.messages?.length > 0)
            .map(convo => ({
                id: convo.connector.id,
                name: convo.connector.profileName || convo.connector.name,
                connector: convo.connector,
                messages: convo.messages,
                lastActivity: convo.lastActivity,
                isGroup: false
            }));

        const groupConversations = groupManager?.getAllGroupDataWithLastActivity() || [];
        const allChats = [...oneOnOneConversations, ...groupConversations];
        allChats.sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
        console.log("ChatOrchestrator: Combined active chats:", allChats.length);
        return allChats;
    }

    function renderCombinedActiveChatsList() {
        const { listRenderer } = getDeps();
        if (listRenderer) {
            const combinedChats = getCombinedActiveChats();
            listRenderer.renderActiveChatList(combinedChats, handleActiveChatItemClick);
        }
    }

    function handleActiveChatItemClick(itemData) {
        console.log("ChatOrchestrator: handleActiveChatItemClick. Item isGroup:", itemData.isGroup, "ID:", itemData.id, "Name:", itemData.name);
        const { groupManager, viewManager, chatUiManager } = getDeps();

        if (itemData.isGroup) {
            console.log("ChatOrchestrator: Item is a Group. Current tab:", viewManager?.getCurrentActiveTab());
            if (viewManager?.getCurrentActiveTab() !== 'groups' || groupManager?.getCurrentGroupData()?.id !== itemData.id) {
                viewManager?.switchView('groups');
                groupManager?.joinGroup(itemData.id);
            } else {
                chatUiManager?.showGroupChatView(itemData.name, groupManager.currentGroupMembers);
            }
        } else {
            console.log("ChatOrchestrator: Item is 1-on-1. Current tab:", viewManager?.getCurrentActiveTab());
            if (groupManager?.getCurrentGroupData()) {
                console.log("ChatOrchestrator: Leaving current group to open 1-on-1 chat.");
                groupManager.leaveCurrentGroup(false);
            }
            if (viewManager?.getCurrentActiveTab() !== 'messages') {
                viewManager?.switchView('messages');
            }
            openConversation(itemData.connector || itemData.id);
        }
    }

    function openConversation(connectorOrId) {
        const { chatUiManager, conversationManager, uiUpdater, domElements, viewManager } = getDeps();
        const targetId = typeof connectorOrId === 'string' ? connectorOrId : connectorOrId?.id;

        console.log(`ChatOrchestrator: openConversation -- START -- Target ID: ${targetId}. Current active embedded ID: ${currentEmbeddedChatTargetId}`);

        if (!targetId) {
            console.error("ChatOrchestrator: openConversation - No targetId provided.");
            chatUiManager?.hideEmbeddedChatInterface();
            return;
        }
        if (!chatUiManager || !conversationManager || !uiUpdater || !domElements) {
            console.error("ChatOrchestrator: openConversation - Missing critical dependencies.");
            chatUiManager?.hideEmbeddedChatInterface();
            return;
        }

        // Ensure we are on the messages tab if not already
        if (viewManager?.getCurrentActiveTab() !== 'messages') {
            console.log("ChatOrchestrator: openConversation - Not on messages tab, switching now.");
            viewManager.switchView('messages');
        }

        // Ensure the conversation record exists or is created
        const { conversation: convo, isNew } = conversationManager.ensureConversationRecord(targetId, typeof connectorOrId === 'object' ? connectorOrId : null);

        if (!convo || !convo.connector) {
            console.error(`ChatOrchestrator: openConversation - Failed to get/create conversation record for ${targetId}.`);
            chatUiManager.hideEmbeddedChatInterface();
            return;
        }
        console.log(`ChatOrchestrator: openConversation - Conversation record ensured for: ${convo.connector.profileName} (ID: ${targetId}). Is new: ${isNew}`);

        // Set the current target ID
        currentEmbeddedChatTargetId = targetId;
        console.log(`ChatOrchestrator: openConversation - currentEmbeddedChatTargetId has been SET to: ${currentEmbeddedChatTargetId}`);

        // Update UI
        chatUiManager.hideGroupChatView(); // Ensure group chat is hidden
        chatUiManager.showEmbeddedChatInterface(convo.connector); // Shows header, sets data-connector-id

        // Repopulate messages for the now active conversation
        uiUpdater.clearEmbeddedChatLog(); // Explicitly clear before populating
        console.log(`ChatOrchestrator: openConversation - Repopulating ${convo.messages?.length || 0} messages for ${currentEmbeddedChatTargetId}`);
        convo.messages?.forEach((msg) => {
            if (!msg) {
                console.warn("ChatOrchestrator: Null/undefined message found in convo for", currentEmbeddedChatTargetId, msg);
                return;
            }
            if (msg.type === 'image' && msg.content_url) {
                uiUpdater.appendToEmbeddedChatLog("", msg.sender.startsWith('user') ? 'user' : 'connector', { imageUrl: msg.content_url });
            } else if (msg.text !== undefined && msg.text !== null) {
                let senderClass = msg.sender.startsWith('user') ? 'user' : 'connector';
                if (msg.sender === 'user-voice-transcript' || msg.sender === 'user-audio') {
                    senderClass = 'user-audio';
                }
                uiUpdater.appendToEmbeddedChatLog(msg.text, senderClass);
            } else {
                console.warn("ChatOrchestrator: Message without text or valid image content_url:", msg, "for connector:", currentEmbeddedChatTargetId);
            }
        });

        if (domElements.embeddedChatLog) {
            requestAnimationFrame(() => {
                domElements.embeddedChatLog.scrollTop = domElements.embeddedChatLog.scrollHeight;
            });
        }

        // Ensure the right sidebar is showing the active chats list for 1-on-1
        if (viewManager?.setActiveRightSidebarPanel) {
            viewManager.setActiveRightSidebarPanel('messagesChatListPanel');
        }
        console.log(`ChatOrchestrator: openConversation -- END -- Successfully opened for: ${currentEmbeddedChatTargetId}`);
    }

    function openMessageModal(connector) {
        const { uiUpdater, modalHandler, domElements, conversationManager } = getDeps(); // Removed chatUiManager from deps for this function
        if (!connector?.id || !uiUpdater || !modalHandler || !domElements || !conversationManager) {
            console.error("ChatOrchestrator.openMessageModal: Missing dependencies.");
            return;
        }

        const { conversation: convo } = conversationManager.ensureConversationRecord(connector.id, connector);
        if (!convo) {
            console.error("ChatOrchestrator: Failed to get/create conversation for message modal for connector:", connector.id);
            return;
        }
        currentModalMessageTarget = connector; // Store the full connector object

        // Use uiUpdater directly for these tasks
        uiUpdater.updateMessageModalHeader(connector);
        uiUpdater.clearMessageModalLog();

        convo.messages?.forEach(msg => {
            if (msg.type === 'image' && msg.content_url) {
                uiUpdater.showImageInMessageModal(msg.content_url);
            } else if (msg.text) {
                let senderClass = msg.sender.startsWith('user') ? 'user' : 'connector';
                if (msg.sender === 'user-voice-transcript' || msg.sender === 'user-audio') senderClass = 'user-audio';
                uiUpdater.appendToMessageLogModal(msg.text, senderClass);
            }
        });

        if (domElements.messageChatLog) {
            requestAnimationFrame(() => {
                domElements.messageChatLog.scrollTop = domElements.messageChatLog.scrollHeight;
            });
        }

        uiUpdater.resetMessageModalInput();
        modalHandler.open(domElements.messagingInterface);
        if (domElements.messageTextInput) domElements.messageTextInput.focus();
        console.log("ChatOrchestrator: Message modal opened for", connector.id);
    }

    function handleMessagesTabActive() {
        const { chatUiManager, conversationManager } = getDeps();
        console.log("ChatOrchestrator: handleMessagesTabActive.");
        if (!chatUiManager || !conversationManager) return;

        renderCombinedActiveChatsList();

        if (currentEmbeddedChatTargetId && conversationManager.getConversation(currentEmbeddedChatTargetId)) {
            const currentConvo = conversationManager.getConversation(currentEmbeddedChatTargetId);
            if (currentConvo && !currentConvo.isGroup) {
                openConversation(currentConvo.connector);
            } else {
                chatUiManager.hideEmbeddedChatInterface();
            }
        } else {
            const combinedChats = getCombinedActiveChats();
            const firstOneOnOne = combinedChats.find(chat => !chat.isGroup);
            if (firstOneOnOne) {
                openConversation(firstOneOnOne.connector);
            } else {
                chatUiManager.hideEmbeddedChatInterface();
            }
        }
    }

    function endModalMessagingSession() {
        getDeps().modalHandler?.close(getDeps().domElements.messagingInterface);
        currentModalMessageTarget = null;
    }

    function filterAndDisplayConnectors(filters) {
        console.log("ChatOrchestrator: filterAndDisplayConnectors called with filters:", filters);
        const { cardRenderer, activityManager } = getDeps();

        if (!window.polyglotConnectors) {
            console.error("ChatOrchestrator: window.polyglotConnectors is undefined or empty. Cannot filter.");
            const grid = getDeps().domElements?.connectorHubGrid;
            if (grid) grid.innerHTML = "<p class='error-message'>No connector data loaded.</p>";
            return;
        }
        if (!cardRenderer) {
            console.error("ChatOrchestrator: cardRenderer is not available. Cannot display cards.");
            return;
        }
        if (!activityManager) {
            console.warn("ChatOrchestrator: activityManager not available. isActive status might be incorrect.");
        }

        console.log("ChatOrchestrator: Total connectors before filter:", window.polyglotConnectors.length);

        let filtered = window.polyglotConnectors.map(c => ({
            ...c,
            isActive: activityManager ? activityManager.isConnectorActive(c) : true
        }));

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

        console.log("ChatOrchestrator: Connectors after filtering:", filtered.length, filtered);
        cardRenderer.renderCards(filtered);
        console.log("ChatOrchestrator: cardRenderer.renderCards called.");
    }

    function notifyNewActivityInConversation(connectorId) {
        const { conversationManager } = getDeps();
        const convo = conversationManager.getConversation(connectorId);
        if (convo) {
            convo.lastActivity = Date.now();
            conversationManager.saveConversationsToStorage();
            renderCombinedActiveChatsList();
        }
    }

    console.log("js/core/chat_orchestrator.js (updated for combined chat list).");
    return {
        initialize,
        openConversation,
        openMessageModal,
        handleMessagesTabActive,
        endModalMessagingSession,
        filterAndDisplayConnectors,
        getTextMessageHandler: () => getDeps().textMessageHandler,
        getVoiceMemoHandler: () => getDeps().voiceMemoHandler,
        getConversationManager: () => getDeps().conversationManager,
        getCurrentEmbeddedChatTargetId: () => currentEmbeddedChatTargetId,
        getCurrentModalMessageTarget: () => currentModalMessageTarget,
        renderCombinedActiveChatsList,
        notifyNewActivityInConversation
    };
})();

// In app.js, you would then assign window.chatManager = window.chatOrchestrator;
// or simply rename chatOrchestrator to chatManager in this file.
// For now, let's assume you'll do: window.chatManager = window.chatOrchestrator; in app.js