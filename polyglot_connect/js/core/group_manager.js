// js/core/group_manager.js
// Manages group chat functionality: loading, joining, handling group conversations, and persisting chat history.

window.groupManager = (() => {
    const getDeps = () => ({
        domElements: window.domElements,
        uiUpdater: window.uiUpdater,
        polyglotHelpers: window.polyglotHelpers,
        activityManager: window.activityManager,
        chatUiManager: window.chatUiManager,
        listRenderer: window.listRenderer,
        geminiService: window.geminiService,
        viewManager: window.viewManager,
        chatOrchestrator: window.chatOrchestrator
    });

    const GROUP_CHAT_HISTORY_STORAGE_KEY = 'polyglotGroupChatHistories';
    const MAX_GROUP_HISTORY_FOR_GEMINI = 10; // Added default value

    // Declare module-scoped state variables
    let currentGroupId = null;
    let currentGroupData = null;
    let groupChatHistory = [];
    let currentGroupTutor = null;
    let currentGroupMembers = [];
    let lastAiSpeakerIndex = -1;
    let isUserTypingInGroup = false;
    let userTypingTimeoutId = null;
    let messageIntervalId = null;


    function isGroupJoined(groupId) {
        const { polyglotHelpers } = getDeps();
        if (!polyglotHelpers) return false;
        const allHistories = polyglotHelpers.loadFromLocalStorage(GROUP_CHAT_HISTORY_STORAGE_KEY) || {};
        return !!(allHistories[groupId] && allHistories[groupId].length > 0);
    }

    function initialize() {
        console.log("GroupManager: Initializing...");
    }

    function getCurrentGroupData() {
        return currentGroupData;
    }

    function loadGroupChatHistory(groupId) {
        const { polyglotHelpers } = getDeps();
        if (!polyglotHelpers) return [];
        const allHistories = polyglotHelpers.loadFromLocalStorage(GROUP_CHAT_HISTORY_STORAGE_KEY) || {};
        console.log(`GroupManager: Loaded history for group ${groupId}:`, allHistories[groupId]?.length || 0, "messages");
        return allHistories[groupId] || [];
    }

    function saveCurrentGroupChatHistory() {
        const { polyglotHelpers } = getDeps();
        if (!polyglotHelpers || !currentGroupId || !groupChatHistory) return;

        const allHistories = polyglotHelpers.loadFromLocalStorage(GROUP_CHAT_HISTORY_STORAGE_KEY) || {};
        allHistories[currentGroupId] = groupChatHistory.slice(-50);
        polyglotHelpers.saveToLocalStorage(GROUP_CHAT_HISTORY_STORAGE_KEY, allHistories);
        console.log(`GroupManager: Saved history for group ${currentGroupId}:`, groupChatHistory.length, "messages (storing last 50).");

        updateGroupLastActivity(currentGroupId, Date.now());
    }

    function loadAvailableGroups(languageFilter = null) {
        console.log("GroupManager: loadAvailableGroups called. Filter:", languageFilter);
        const { listRenderer, domElements, viewManager } = getDeps();
        if (!window.polyglotGroupsData || !listRenderer) {
            console.warn("GroupManager: Group data or listRenderer missing for loadAvailableGroups.");
            if (domElements?.groupLoadingMessage) {
                domElements.groupLoadingMessage.textContent = "Error loading groups data.";
                domElements.groupLoadingMessage.style.display = 'block';
            }
            return;
        }

        let rawGroups = window.polyglotGroupsData;
        if (languageFilter) {
            rawGroups = rawGroups.filter(g => g.language === languageFilter);
        }

        // Augment group data with isJoined status
        const augmentedGroups = rawGroups.map(groupDef => ({
            ...groupDef,
            isJoined: isGroupJoined(groupDef.id) // Add the joined status
        }));

        console.log("GroupManager: Augmented groups to display:", augmentedGroups.length, augmentedGroups);
        listRenderer.renderAvailableGroupsList(augmentedGroups, joinGroup);

        viewManager?.updateEmptyListMessages();
    }

    function joinGroup(groupOrGroupId) {
        const { chatUiManager, viewManager, chatOrchestrator, uiUpdater, domElements } = getDeps(); // Added uiUpdater, domElements
        const groupId = (typeof groupOrGroupId === 'object' && groupOrGroupId !== null) ? groupOrGroupId.id : groupOrGroupId;

        if (!window.polyglotGroupsData || !window.polyglotConnectors || !groupId) return;
        const groupDef = window.polyglotGroupsData.find(g => g.id === groupId);
        if (!groupDef) return;

        leaveCurrentGroup(false); // Pass false to prevent reloading group list unnecessarily

        currentGroupId = groupId;
        currentGroupData = groupDef;
        groupChatHistory = loadGroupChatHistory(currentGroupId);

        currentGroupTutor = window.polyglotConnectors.find(c => c.id === groupDef.tutorId && c.languageRoles?.[groupDef.language]?.includes('tutor'));
        if (!currentGroupTutor) {
            // Fallback: find any tutor for that language if specified one not found or not a tutor for that lang
            currentGroupTutor = window.polyglotConnectors.find(c => c.languageRoles?.[groupDef.language]?.includes('tutor'));
        }
        if (!currentGroupTutor) {
            // If still no tutor, it's a problem
            alert(`Tutor for "${groupDef.name}" (${groupDef.language}) could not be assigned. Please check group and connector configurations.`);
            resetGroupState();
            return;
        }

        const learners = window.polyglotConnectors.filter(c => c.id !== currentGroupTutor.id && c.languageRoles?.[groupDef.language]?.includes('learner')).sort(() => 0.5 - Math.random());
        currentGroupMembers = [currentGroupTutor, ...learners.slice(0, groupDef.maxLearners || 3)];


        if (chatUiManager && typeof chatUiManager.showGroupChatView === 'function') {
            chatUiManager.showGroupChatView(groupDef.name, currentGroupMembers);

             if (viewManager?.setActiveRightSidebarPanel) {
                viewManager.setActiveRightSidebarPanel('messagesChatListPanel');
                chatOrchestrator?.renderCombinedActiveChatsList();
            }


            if (uiUpdater && groupChatHistory.length > 0) {
                // Clear existing log before repopulating
                if (domElements?.groupChatLogDiv) domElements.groupChatLogDiv.innerHTML = '';
                groupChatHistory.forEach(msg => {
                    const speaker = currentGroupMembers.find(m => m.id === msg.speakerId) || (msg.speakerId === "user_player" ? { profileName: "You" } : { profileName: "Bot" });
                    // Ensure speaker is found, otherwise default to a generic name
                    const speakerName = speaker ? speaker.profileName : (msg.speakerId === "user_player" ? "You" : "Unknown");
                    uiUpdater.appendToGroupChatLog(msg.text, speakerName, msg.speakerId === "user_player", msg.speakerId);
                });
            }


            if (groupChatHistory.length === 0) {
                setTimeout(() => sendWelcomeMessagesToGroup(groupDef), 600);
            }
            startGroupConversationFlow();
        } else {
            console.error("GroupManager: chatUiManager.showGroupChatView is not a function or chatUiManager is undefined.");
        }
    }

    function sendWelcomeMessagesToGroup(groupDef) {
        const { uiUpdater } = getDeps();
        if (!currentGroupMembers.length || !uiUpdater || !currentGroupTutor || !currentGroupId) return; // Added currentGroupId check

        const tutor = currentGroupTutor;
        const welcome = `Welcome to "${groupDef.name}"! I'm ${tutor.profileName}, your tutor. Topic: ${groupDef.tags[0] || 'general chat'}. Introduce yourselves!`;
        uiUpdater.appendToGroupChatLog(welcome, tutor.profileName, false, tutor.id);
        groupChatHistory.push({ speakerId: tutor.id, text: welcome, timestamp: Date.now() });

        currentGroupMembers.filter(m => m.id !== tutor.id).slice(0, 2).forEach((learner, i) => {
            setTimeout(() => {
                if (!currentGroupId) return; // Check if still in group
                const msg = i === 0 ? `Hi, I'm ${learner.profileName}! Excited for ${groupDef.language} practice.` : `Hello! ${learner.profileName} here.`;
                uiUpdater.appendToGroupChatLog(msg, learner.profileName, false, learner.id);
                groupChatHistory.push({ speakerId: learner.id, text: msg, timestamp: Date.now() });
                if (i === currentGroupMembers.filter(m => m.id !== tutor.id).slice(0, 2).length - 1) {
                    saveCurrentGroupChatHistory();
                }
            }, 1300 + i * 1700);
        });

        if (currentGroupMembers.filter(m => m.id !== tutor.id).slice(0, 2).length === 0) {
            saveCurrentGroupChatHistory();
        }
    }

    function userIsTypingInGroupSignal() {
        const { uiUpdater } = getDeps();
        if (!uiUpdater) {
            console.warn("GroupManager: uiUpdater not available for typing indicator.");
            return;
        }
        isUserTypingInGroup = true;
        uiUpdater.setGroupTypingIndicatorText('You are typing...');
        clearTimeout(userTypingTimeoutId);
        userTypingTimeoutId = setTimeout(() => {
            isUserTypingInGroup = false;
            if (currentGroupId) { // Only clear if still in a group
                uiUpdater.setGroupTypingIndicatorText('');
            }
        }, 2500);
    }

    function leaveCurrentGroup(triggerReload = true) {
        console.log("GroupManager: leaveCurrentGroup called. Trigger reload:", triggerReload);
        const { chatUiManager, viewManager, domElements } = getDeps(); // Added domElements

        stopGroupConversationFlow(); // Stop AI messages first

        if (chatUiManager && typeof chatUiManager.hideGroupChatView === 'function') {
            chatUiManager.hideGroupChatView();
        } else {
            // Fallback if chatUiManager is not available or hideGroupChatView is not a function
            if (domElements?.groupChatInterfaceDiv) domElements.groupChatInterfaceDiv.style.display = 'none';
            if (domElements?.groupListContainer) domElements.groupListContainer.style.display = 'block';
        }

        const previouslyActiveGroupId = currentGroupId; // Store before resetting
        resetGroupState(); // This will set currentGroupId to null

        if (viewManager) {
            const currentTab = viewManager.getCurrentActiveTab ? viewManager.getCurrentActiveTab() : null;
            if (currentTab === 'groups') {
                // If on groups tab and left a group, show group filters panel
                viewManager.setActiveRightSidebarPanel('groupsFiltersPanel');
            } else if (previouslyActiveGroupId && viewManager.setActiveRightSidebarPanel) {
                 // If on another tab (e.g. messages) that was showing active chats, refresh it
                viewManager.setActiveRightSidebarPanel('messagesChatListPanel');
            }
        }


        if (triggerReload && viewManager?.getCurrentActiveTab && viewManager.getCurrentActiveTab() === 'groups') {
            loadAvailableGroups(); // Reload the list of available groups if on the groups tab
        }
        // Potentially refresh active chats list if it was affected
        getDeps().chatOrchestrator?.renderCombinedActiveChatsList();
    }

    function resetGroupState() {
        const { uiUpdater, domElements } = getDeps();
        // stopGroupConversationFlow(); // Moved to leaveCurrentGroup to be called first
        currentGroupId = null;
        currentGroupData = null;
        currentGroupMembers = [];
        currentGroupTutor = null;
        lastAiSpeakerIndex = -1;
        groupChatHistory = [];
        isUserTypingInGroup = false; // Reset typing status
        if (userTypingTimeoutId) clearTimeout(userTypingTimeoutId); // Clear any pending typing timeout

        uiUpdater?.setGroupTypingIndicatorText('');
        if (domElements?.groupChatLogDiv) domElements.groupChatLogDiv.innerHTML = '';
        if (domElements?.groupChatInput) domElements.groupChatInput.value = '';
    }

    function startGroupConversationFlow() {
        const { polyglotHelpers } = getDeps();
        if (!currentGroupId) return; // Don't start if not in a group
        stopGroupConversationFlow(); // Ensure no previous interval is running
        messageIntervalId = setInterval(() => {
            if (isUserTypingInGroup || !currentGroupId || currentGroupMembers.length <= 1) return;
            simulateAiMessageInGroup();
        }, (polyglotHelpers.simulateTypingDelay(12000, 70) + Math.random() * 7000));
    }

    function stopGroupConversationFlow() {
        if (messageIntervalId) clearInterval(messageIntervalId);
        messageIntervalId = null;
        // Clear typing indicator if an AI was typing
        const deps = getDeps();
        if (deps.uiUpdater && currentGroupId) { // Check currentGroupId before clearing
             // Only clear if not "You are typing..."
            const indicatorText = deps.domElements?.groupTypingIndicator?.textContent || '';
            if (!indicatorText.startsWith('You')) {
                deps.uiUpdater.setGroupTypingIndicatorText('');
            }
        }
    }

    async function handleUserMessageInGroup() {
        const { domElements, uiUpdater } = getDeps();
        if (!domElements?.groupChatInput) return;
        const text = domElements.groupChatInput.value.trim();
        if (!text || !currentGroupId) return;

        uiUpdater?.appendToGroupChatLog(text, "You", true, "user_player");
        groupChatHistory.push({ speakerId: "user_player", text: text, timestamp: Date.now() });
        domElements.groupChatInput.value = ''; // Clear input after sending
        saveCurrentGroupChatHistory();

        stopGroupConversationFlow(); // Stop regular AI messages
        isUserTypingInGroup = false; // User has sent, no longer typing
        if(userTypingTimeoutId) clearTimeout(userTypingTimeoutId);
        getDeps().uiUpdater?.setGroupTypingIndicatorText(''); // Clear "You are typing"


        await simulateAiMessageInGroup(true); // Trigger a reply
        startGroupConversationFlow(); // Restart regular AI messages
    }

    async function simulateAiMessageInGroup(isReplyToUser = false) {
        const { uiUpdater, activityManager, geminiService, polyglotHelpers, domElements } = getDeps();
        if (!currentGroupId || !currentGroupMembers?.length || !currentGroupData || !geminiService || !uiUpdater || !activityManager || !polyglotHelpers) return;

        const aiSpeakers = currentGroupMembers.filter(m => m.id !== "user_player");
        if (aiSpeakers.length === 0) return;

        // If replying to user, ensure the speaker is not the one who just virtually "spoke" if it was an AI before user
        // For simplicity, we'll stick to round-robin or pick one if only one AI.
        let speaker;
        if (aiSpeakers.length === 1) {
            speaker = aiSpeakers[0];
        } else {
            // Basic round-robin
            lastAiSpeakerIndex = (lastAiSpeakerIndex + 1) % aiSpeakers.length;
            speaker = aiSpeakers[lastAiSpeakerIndex];
        }


        if (!speaker) {
            console.warn("GroupManager: No AI speaker could be selected.");
            return;
        }

        uiUpdater.setGroupTypingIndicatorText(`${speaker.profileName.split(' ')[0]} is typing...`);
        const delay = activityManager.getAiReplyDelay(speaker, isReplyToUser ? 50 : 100); // Faster reply if direct response

        let promptContext = `You are ${speaker.profileName}. You are in a group chat: "${currentGroupData.name}" (Language: ${currentGroupData.language}, Topic: ${currentGroupData.tags.join(', ')}).\n`;
        promptContext += `The other members are: ${currentGroupMembers.filter(m=> m.id !== speaker.id).map(m=> m.profileName).join(', ')}.\n`;
        promptContext += "Recent messages (last " + MAX_GROUP_HISTORY_FOR_GEMINI + " shown):\n";
        groupChatHistory.slice(-MAX_GROUP_HISTORY_FOR_GEMINI).forEach(msg => { // Use constant
            const member = currentGroupMembers.find(m => m.id === msg.speakerId) || (msg.speakerId === "user_player" ? { profileName: "User" } : { profileName: "Bot" });
            promptContext += `${member.profileName}: ${msg.text}\n`;
        });
        promptContext += `\n${speaker.profileName}, ${isReplyToUser ? "respond to the User's last message or " : ""}contribute to the conversation. Speak naturally in ${currentGroupData.language}. Keep it brief (1-2 sentences). Do not use markdown.`;

        try {
            const aiMsg = await geminiService.generateTextMessage(promptContext, speaker, []); // Pass empty history for stateless generation
            
            // Delay before showing message
            setTimeout(() => {
                if (currentGroupId === currentGroupData.id && domElements?.groupChatLogDiv) { // Ensure still in the same group and UI element exists
                    // Clear "is typing" only if it was this speaker
                    const currentTypingText = domElements.groupTypingIndicator?.textContent || '';
                    if (currentTypingText.startsWith(speaker.profileName.split(' ')[0])) {
                        uiUpdater.setGroupTypingIndicatorText('');
                    }
                    uiUpdater.appendToGroupChatLog(aiMsg, speaker.profileName, false, speaker.id);
                    groupChatHistory.push({ speakerId: speaker.id, text: aiMsg, timestamp: Date.now() });
                    saveCurrentGroupChatHistory();
                }
            }, delay);

        } catch (error) {
            console.error(`GroupManager AI error for ${speaker.profileName} in group ${currentGroupId}:`, error);
            if (currentGroupId === currentGroupData.id) { // Check if still in the same group
                uiUpdater.setGroupTypingIndicatorText(''); // Clear typing indicator on error
                // Optionally, add a message indicating an error
                // uiUpdater.appendToGroupChatLog(`(Sorry, I'm having a little trouble thinking right now!)`, speaker.profileName, false, speaker.id);
            }
        }
    }

    function getAllGroupDataWithLastActivity() {
        const { polyglotHelpers } = getDeps();
        if (!polyglotHelpers || !window.polyglotGroupsData) return [];

        const allHistories = polyglotHelpers.loadFromLocalStorage(GROUP_CHAT_HISTORY_STORAGE_KEY) || {};
        const activeGroupChats = [];

        window.polyglotGroupsData.forEach(groupDef => {
            const history = allHistories[groupDef.id];
            if (history && history.length > 0) {
                const lastMessage = history[history.length - 1];
                // Attempt to find speaker name for the last message preview
                let speakerNamePreview = "Partner"; // Default
                if (lastMessage && lastMessage.speakerId) {
                    if (lastMessage.speakerId === "user_player") {
                        speakerNamePreview = "You";
                    } else {
                        // Try to find from current members if in this group, or from all connectors
                        const currentGroupIfActive = (currentGroupId === groupDef.id) ? currentGroupMembers : null;
                        const speakerConnector = currentGroupIfActive?.find(m => m.id === lastMessage.speakerId) ||
                                               window.polyglotConnectors?.find(c => c.id === lastMessage.speakerId);
                        if (speakerConnector) {
                            speakerNamePreview = speakerConnector.profileName;
                        }
                    }
                }

                activeGroupChats.push({
                    id: groupDef.id,
                    name: groupDef.name,
                    language: groupDef.language,
                    description: groupDef.description,
                    lastActivity: lastMessage ? lastMessage.timestamp : (groupDef.creationTime || 0),
                    messages: history.slice(-1).map(msg => ({ // Add speakerName to the message object for listRenderer
                        ...msg,
                        speakerName: speakerNamePreview
                    })),
                    isGroup: true
                });
            }
        });
        console.log("GroupManager: getAllGroupDataWithLastActivity - Returning groups with history:", activeGroupChats.length);
        return activeGroupChats;
    }

    function updateGroupLastActivity(groupId, timestamp) {
        // This function seems primarily to trigger a re-render of active chats.
        // The actual "last activity" timestamp is derived from the saved history.
        const { chatOrchestrator } = getDeps();
        if (chatOrchestrator && typeof chatOrchestrator.renderCombinedActiveChatsList === 'function') {
            chatOrchestrator.renderCombinedActiveChatsList();
        }
    }

    console.log("core/group_manager.js updated with declared state variables, MAX_GROUP_HISTORY constant, and refined logic.");
    return {
        initialize,
        loadAvailableGroups,
        joinGroup,
        leaveCurrentGroup,
        handleUserMessageInGroup,
        userIsTyping: userIsTypingInGroupSignal,
        getCurrentGroupData,
        getAllGroupDataWithLastActivity,
        isGroupJoined
    };
})();