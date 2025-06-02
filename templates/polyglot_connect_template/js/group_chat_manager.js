// js/group_chat_manager.js

window.groupChatManager = {
    currentGroupId: null,
    currentGroupMembers: [], // Array of full connector objects
    currentGroupTutor: null,
    messageIntervalId: null,
    userTypingTimeoutId: null,
    isUserTyping: false,
    lastSpeakerIndex: -1, // To rotate speakers

    loadAvailableGroups: () => {
        // In a real app, this might fetch from a server or filter complex definitions
        // For now, use window.polyglotGroupsData from connect_data.js
        if (window.appShellController && window.appShellController.displayAvailableGroups) {
            window.appShellController.displayAvailableGroups(window.polyglotGroupsData || []);
        }
    },

    joinGroup: (groupId) => {
        if (!window.polyglotGroupsData || !window.polyglotConnectors) return;
        const groupDef = window.polyglotGroupsData.find(g => g.id === groupId);
        if (!groupDef) {
            console.error(`Group definition for ${groupId} not found.`);
            return;
        }

        groupChatManager.leaveCurrentGroup(); // Leave any existing group first

        groupChatManager.currentGroupId = groupId;

        // Select tutor
        groupChatManager.currentGroupTutor = window.polyglotConnectors.find(c => c.id === groupDef.tutorId && c.language === groupDef.language);
        if (!groupChatManager.currentGroupTutor) {
            console.error(`Tutor ${groupDef.tutorId} for group ${groupId} not found or language mismatch.`);
            // Fallback: pick any tutor of that language
            groupChatManager.currentGroupTutor = window.polyglotConnectors.find(c => c.role === 'tutor' && c.language === groupDef.language);
            if (!groupChatManager.currentGroupTutor) {
                alert("Could not find a suitable tutor for this group."); return;
            }
        }

        // Select learners (ensure they are not the tutor, and match language)
        const potentialLearners = window.polyglotConnectors.filter(c =>
            c.role === 'learner' &&
            c.language === groupDef.language &&
            c.id !== groupChatManager.currentGroupTutor.id
        );

        // Simple random selection of learners (can be more sophisticated)
        groupChatManager.currentGroupMembers = [groupChatManager.currentGroupTutor];
        const shuffledLearners = potentialLearners.sort(() => 0.5 - Math.random());
        for (let i = 0; i < Math.min(shuffledLearners.length, groupDef.maxLearners); i++) {
            groupChatManager.currentGroupMembers.push(shuffledLearners[i]);
        }
        if (groupChatManager.currentGroupMembers.length <= 1 && potentialLearners.length < groupDef.maxLearners) {
             console.warn(`Not enough unique learners for group ${groupId}. Group will be small.`);
        }


        if (window.appShellController && window.appShellController.showGroupChatInterface) {
            window.appShellController.showGroupChatInterface(groupDef.name, groupChatManager.currentGroupMembers);
        }

        // Send initial welcome messages
        setTimeout(() => groupChatManager.sendWelcomeMessages(), 500);
        groupChatManager.startGroupConversationFlow();

        // Add event listener for user input
        const groupInput = document.getElementById('group-chat-input');
        const sendBtn = document.getElementById('send-group-message-btn');
        if (groupInput && sendBtn) {
            groupInput.onkeypress = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    groupChatManager.handleUserMessage();
                } else {
                    groupChatManager.userIsTyping();
                }
            };
            sendBtn.onclick = groupChatManager.handleUserMessage;
        }
        const leaveBtn = document.getElementById('leave-group-btn');
        if (leaveBtn) leaveBtn.onclick = groupChatManager.leaveCurrentGroup;
    },

    sendWelcomeMessages: () => {
        if (!groupChatManager.currentGroupMembers.length) return;
        const tutor = groupChatManager.currentGroupTutor;
        if (tutor && window.appShellController && window.appShellController.appendMessageToGroupChatLog) {
            window.appShellController.appendMessageToGroupChatLog(
                `Welcome everyone to the "${document.getElementById('active-group-name').textContent}"! I'm ${tutor.profileName}, your tutor for this session. Feel free to ask questions and practice. Let's start by introducing ourselves briefly, perhaps?`,
                tutor.profileName, false, tutor.id
            );
        }
        // Simulate a couple of learners welcoming
        const learnersToWelcome = groupChatManager.currentGroupMembers.filter(m => m.id !== tutor.id).slice(0,2);
        learnersToWelcome.forEach((learner, index) => {
            setTimeout(() => {
                if (window.appShellController && window.appShellController.appendMessageToGroupChatLog) {
                     window.appShellController.appendMessageToGroupChatLog(
                        index === 0 ? "Hi everyone! Glad to be here." : "Hello! Looking forward to chatting.",
                        learner.profileName, false, learner.id
                    );
                }
            }, 1000 + index * 1500);
        });
    },

    startGroupConversationFlow: () => {
        groupChatManager.stopGroupConversationFlow(); // Clear existing interval
        groupChatManager.messageIntervalId = setInterval(() => {
            if (groupChatManager.isUserTyping || !groupChatManager.currentGroupId) return;
            groupChatManager.simulateAIMessage();
        }, 10000); // Every 10 seconds
    },

    stopGroupConversationFlow: () => {
        if (groupChatManager.messageIntervalId) {
            clearInterval(groupChatManager.messageIntervalId);
            groupChatManager.messageIntervalId = null;
        }
        if (window.appShellController) window.appShellController.setGroupTypingIndicator('');
    },

    userIsTyping: () => {
        groupChatManager.isUserTyping = true;
        if (window.appShellController) window.appShellController.setGroupTypingIndicator('You are typing...');
        clearTimeout(groupChatManager.userTypingTimeoutId);
        groupChatManager.userTypingTimeoutId = setTimeout(() => {
            groupChatManager.isUserTyping = false;
            if (window.appShellController) window.appShellController.setGroupTypingIndicator('');
        }, 3000); // User considered idle after 3 seconds of no typing
    },

    handleUserMessage: () => {
        const inputElement = document.getElementById('group-chat-input');
        const messageText = inputElement.value.trim();
        if (!messageText) return;

        if (window.appShellController && window.appShellController.appendMessageToGroupChatLog) {
            window.appShellController.appendMessageToGroupChatLog(messageText, "You", true);
        }
        inputElement.value = '';
        groupChatManager.isUserTyping = false; // Reset typing state
        if (window.appShellController) window.appShellController.setGroupTypingIndicator('');


        // TODO: Send user message to Gemini for context if needed for smarter AI replies
        // For now, AI replies are more scripted/random based on personas

        // Reset and potentially trigger a quicker AI response
        groupChatManager.stopGroupConversationFlow();
        groupChatManager.startGroupConversationFlow();
        setTimeout(() => groupChatManager.simulateAIMessage(true), Math.random() * 2000 + 1000); // Quicker reply after user posts
    },

    simulateAIMessage: (isReplyToUser = false) => {
        if (!groupChatManager.currentGroupMembers || groupChatManager.currentGroupMembers.length <= 1) return; // Need at least one AI other than potentially user

        // Select a speaker (excluding "You", rotate through AI members)
        let availableSpeakers = groupChatManager.currentGroupMembers;
        if (availableSpeakers.length === 0) return;

        groupChatManager.lastSpeakerIndex = (groupChatManager.lastSpeakerIndex + 1) % availableSpeakers.length;
        const speaker = availableSpeakers[groupChatManager.lastSpeakerIndex];

        // Simple canned responses based on persona (expand with Gemini)
        let aiMessage = "Yes, I agree.";
        const genericMessages = [
            "That's an interesting point.", "Could you elaborate on that?", "I'm still learning that too!",
            "What does everyone else think?", `In ${speaker.language}, we often say...`, `My ${speaker.chatPersonality.style || 'opinion'} is that...`
        ];
        if (speaker.role === 'tutor') {
            aiMessage = isReplyToUser ? "That's a good question! Let me think..." : "Does anyone have a question about our topic today?";
            const tutorMessages = ["Remember to practice your verb conjugations!", "Don't be afraid to make mistakes, that's how we learn.", "Has anyone encountered this phrase before?"];
            aiMessage = tutorMessages[Math.floor(Math.random() * tutorMessages.length)];
        } else { // Learner
            aiMessage = genericMessages[Math.floor(Math.random() * genericMessages.length)];
            if (isReplyToUser) aiMessage = `I was wondering about that too, thanks for asking!`;
        }


        // Simulate typing for this AI
        const typingFor = `${speaker.profileName} is typing...`;
        if(window.appShellController) window.appShellController.setGroupTypingIndicator(typingFor);

        setTimeout(() => {
            if (window.appShellController && window.appShellController.appendMessageToGroupChatLog && groupChatManager.currentGroupId) { // Check if still in group
                window.appShellController.appendMessageToGroupChatLog(aiMessage, speaker.profileName, false, speaker.id);
            }
            if(window.appShellController) window.appShellController.setGroupTypingIndicator(''); // Clear after message
        }, window.polyglotUtils.simulateTypingDelay(speaker.chatPersonality.typingDelayMs, aiMessage.length));
    },

    leaveCurrentGroup: () => {
        groupChatManager.stopGroupConversationFlow();
        if (window.appShellController && window.appShellController.hideGroupChatInterface) {
            window.appShellController.hideGroupChatInterface();
        }
        groupChatManager.currentGroupId = null;
        groupChatManager.currentGroupMembers = [];
        groupChatManager.currentGroupTutor = null;
        console.log("Left group.");
    },
};

console.log("group_chat_manager.js loaded.");