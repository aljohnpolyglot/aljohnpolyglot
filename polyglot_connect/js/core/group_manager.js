// js/core/group_manager.js
window.groupManager = (() => {
    const getDeps = () => ({
        domElements: window.domElements, uiUpdater: window.uiUpdater,
        polyglotHelpers: window.polyglotHelpers, activityManager: window.activityManager,
        shellController: window.shellController, listRenderer: window.listRenderer,
        geminiService: window.geminiService
    });

    let currentGroupId = null;
    let currentGroupData = null;
    let currentGroupMembers = [];
    let currentGroupTutor = null;
    let messageIntervalId = null;
    let userTypingTimeoutId = null;
    let isUserTypingInGroup = false;
    let lastAiSpeakerIndex = -1;
    let groupChatHistory = [];
    const MAX_GROUP_HISTORY_FOR_GEMINI = 8; // Turns

    function initialize() { loadAvailableGroups(); }
    const getCurrentGroupData = () => currentGroupData; // Expose for uiUpdater

    function loadAvailableGroups(languageFilter = null) { // languageFilter is language NAME
        const { listRenderer, shellController } = getDeps();
        if (!window.polyglotGroupsData || !listRenderer) {
            console.warn("GroupManager: Group data or listRenderer missing.");
            const { domElements } = getDeps();
            if (domElements?.groupLoadingMessage) {
                domElements.groupLoadingMessage.textContent = "Error loading groups.";
                domElements.groupLoadingMessage.style.display = 'block';
            }
            return;
        }
        let groups = window.polyglotGroupsData;
        if (languageFilter) groups = groups.filter(g => g.language === languageFilter);
        listRenderer.renderAvailableGroupsList(groups, joinGroup);
        shellController?.updateEmptyListMessages();
    }

    function joinGroup(groupOrGroupId) {
        const { shellController } = getDeps();
        const groupId = typeof groupOrGroupId === 'string' ? groupOrGroupId : groupOrGroupId?.id;
        if (!window.polyglotGroupsData || !window.polyglotConnectors || !groupId) {
            alert("Cannot join group: Core data missing."); return;
        }
        const groupDef = window.polyglotGroupsData.find(g => g.id === groupId);
        if (!groupDef) { alert("Group not found."); return; }

        leaveCurrentGroup();
        currentGroupId = groupId; currentGroupData = groupDef; groupChatHistory = [];

        currentGroupTutor = window.polyglotConnectors.find(c =>
            c.id === groupDef.tutorId &&
            c.languageRoles &&
            c.languageRoles[groupDef.language] && // Check if language key exists
            Array.isArray(c.languageRoles[groupDef.language]) && // Check if it's an array
            c.languageRoles[groupDef.language].includes('tutor')
        );
        if (!currentGroupTutor) { // Fallback
            currentGroupTutor = window.polyglotConnectors.find(c =>
                c.languageRoles &&
                c.languageRoles[groupDef.language] &&
                Array.isArray(c.languageRoles[groupDef.language]) &&
                c.languageRoles[groupDef.language].includes('tutor')
            );
        }
        if (!currentGroupTutor) {
            alert(`Tutor for "${groupDef.name}" (${groupDef.language}) not found or not configured correctly.`);
            resetGroupState(); return;
        }

        const learners = window.polyglotConnectors.filter(c =>
            c.id !== currentGroupTutor.id &&
            c.languageRoles &&
            c.languageRoles[groupDef.language] &&
            Array.isArray(c.languageRoles[groupDef.language]) &&
            c.languageRoles[groupDef.language].includes('learner')
        ).sort(() => 0.5 - Math.random());
        currentGroupMembers = [currentGroupTutor, ...learners.slice(0, groupDef.maxLearners || 3)];

        if (shellController?.showGroupChatInterface) {
            shellController.showGroupChatInterface(groupDef.name, currentGroupMembers);
            setTimeout(() => sendWelcomeMessagesToGroup(groupDef), 600);
            startGroupConversationFlow();
        }
    }

    function sendWelcomeMessagesToGroup(groupDef) {
        const { uiUpdater } = getDeps();
        if (!currentGroupMembers.length || !uiUpdater || !currentGroupTutor) return;
        const tutor = currentGroupTutor;
        const welcome = `Welcome to "${groupDef.name}"! I'm ${tutor.profileName}, your tutor. Topic: ${groupDef.tags[0] || 'general chat'}. Introduce yourselves!`;
        uiUpdater.appendToGroupChatLog(welcome, tutor.profileName, false, tutor.id);
        groupChatHistory.push({ speakerId: tutor.id, text: welcome, timestamp: Date.now() });

        currentGroupMembers.filter(m => m.id !== tutor.id).slice(0, 2).forEach((learner, i) => {
            setTimeout(() => {
                const msg = i === 0 ? `Hi, I'm ${learner.profileName}! Excited for ${groupDef.language} practice.` : `Hello! ${learner.profileName} here.`;
                uiUpdater.appendToGroupChatLog(msg, learner.profileName, false, learner.id);
                groupChatHistory.push({ speakerId: learner.id, text: msg, timestamp: Date.now() });
            }, 1300 + i * 1700);
        });
    }

    function startGroupConversationFlow() {
        const { polyglotHelpers } = getDeps();
        stopGroupConversationFlow();
        messageIntervalId = setInterval(() => {
            if (isUserTypingInGroup || !currentGroupId || currentGroupMembers.length <= 1) return;
            simulateAiMessageInGroup();
        }, polyglotHelpers.simulateTypingDelay(12000, 70) + Math.random() * 7000); // 12-19s
    }

    function stopGroupConversationFlow() {
        if (messageIntervalId) clearInterval(messageIntervalId);
        messageIntervalId = null;
        getDeps().uiUpdater?.setGroupTypingIndicatorText('');
    }

    function userIsTypingInGroupSignal() {
        const { uiUpdater } = getDeps();
        isUserTypingInGroup = true;
        uiUpdater?.setGroupTypingIndicatorText('You are typing...');
        clearTimeout(userTypingTimeoutId);
        userTypingTimeoutId = setTimeout(() => {
            isUserTypingInGroup = false;
            uiUpdater?.setGroupTypingIndicatorText('');
        }, 2500);
    }

    async function handleUserMessageInGroup() {
        const { domElements, uiUpdater } = getDeps();
        const text = domElements?.groupChatInput?.value.trim();
        if (!text || !currentGroupId) return;
        uiUpdater?.appendToGroupChatLog(text, "You", true, "user_player");
        groupChatHistory.push({ speakerId: "user_player", text: text, timestamp: Date.now() });
        uiUpdater?.clearGroupChatInput();
        isUserTypingInGroup = false; uiUpdater?.setGroupTypingIndicatorText('');
        stopGroupConversationFlow();
        await simulateAiMessageInGroup(true); // AI responds to user
        startGroupConversationFlow(); // Resume autonomous messages
    }

    async function simulateAiMessageInGroup(isReplyToUser = false) {
        const { uiUpdater, activityManager, geminiService, polyglotHelpers } = getDeps();
        if (!currentGroupId || !currentGroupMembers?.length || !currentGroupData || !geminiService || !uiUpdater || !activityManager || !polyglotHelpers) return;

        const aiSpeakers = currentGroupMembers.filter(m => m.id !== "user_player");
        if (aiSpeakers.length === 0) return;
        lastAiSpeakerIndex = (lastAiSpeakerIndex + 1) % aiSpeakers.length;
        const speaker = aiSpeakers[lastAiSpeakerIndex];

        uiUpdater.setGroupTypingIndicatorText(`${speaker.profileName.split(' ')[0]} is typing...`);
        const delay = activityManager.getAiReplyDelay(speaker, 100);

        let promptContext = `You are ${speaker.profileName}. You are in a group chat: "${currentGroupData.name}" (Language: ${currentGroupData.language}, Topic: ${currentGroupData.tags.join(', ')}).\n`;
        promptContext += "Recent messages:\n";
        groupChatHistory.slice(-MAX_GROUP_HISTORY_FOR_GEMINI * 2).forEach(msg => {
            const member = currentGroupMembers.find(m => m.id === msg.speakerId) || (msg.speakerId === "user_player" ? {profileName: "User"} : {profileName:"Bot"});
            promptContext += `${member.profileName}: ${msg.text}\n`;
        });
        promptContext += `\n${speaker.profileName}, ${isReplyToUser ? "respond to the User or " : ""}contribute to the conversation. Speak naturally in ${currentGroupData.language}. Keep it brief. Do not use markdown.`;

        try {
            // For group chat, Gemini history for this speaker is self-contained in the prompt context.
            // No need to pass existingGeminiHistory from chatManager which is for 1-on-1.
            const aiMsg = await geminiService.generateTextMessage(promptContext, speaker, []);
            setTimeout(() => {
                if (currentGroupId) { // Still in group
                    uiUpdater.setGroupTypingIndicatorText('');
                    uiUpdater.appendToGroupChatLog(aiMsg, speaker.profileName, false, speaker.id);
                    groupChatHistory.push({ speakerId: speaker.id, text: aiMsg, timestamp: Date.now() });
                }
            }, delay);
        } catch (error) {
            console.error(`GroupManager AI error for ${speaker.profileName}:`, error);
            uiUpdater.setGroupTypingIndicatorText('');
            if (currentGroupId) uiUpdater.appendToGroupChatLog(`(Hmm, lost my train of thought!)`, speaker.profileName, false, speaker.id);
        }
    }

    function resetGroupState() {
        const { uiUpdater, domElements } = getDeps();
        stopGroupConversationFlow();
        currentGroupId = null; currentGroupData = null; currentGroupMembers = []; currentGroupTutor = null;
        lastAiSpeakerIndex = -1; groupChatHistory = []; isUserTypingInGroup = false;
        uiUpdater?.setGroupTypingIndicatorText('');
        if (domElements?.groupChatLogDiv) domElements.groupChatLogDiv.innerHTML = '';
        if (domElements?.groupChatInput) domElements.groupChatInput.value = '';
    }

    function leaveCurrentGroup() {
        const { shellController } = getDeps();
        shellController?.hideGroupChatInterface();
        resetGroupState();
        console.log("groupManager: Left group.");
    }

    console.log("core/group_manager.js loaded.");
    return {
        initialize, loadAvailableGroups, joinGroup, handleUserMessageInGroup,
        userIsTyping: userIsTypingInGroupSignal, leaveCurrentGroup, getCurrentGroupData
    };
})();
console.log("core/group_manager.js loaded. window.groupManager object:", window.groupManager);