// js/app_shell_controller.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Main Shell Elements ---
    const leftSidebarNavItems = document.querySelectorAll('#left-sidebar .nav-item');
    const mainViews = document.querySelectorAll('#main-container .view');
    const rightSidebarPanels = document.querySelectorAll('#right-sidebar .sidebar-panel');
    const connectorHubElement = document.getElementById('connector-hub');
    const themeToggleButton = document.getElementById('toggle-theme-btn');

    // --- Detailed Persona Modal Elements ---
    const detailedPersonaModal = document.getElementById('detailed-persona-modal');
    const closePersonaModalBtn = document.getElementById('close-persona-modal-btn');
    const personaModalAvatar = document.getElementById('persona-modal-avatar');
    const personaModalName = document.getElementById('persona-modal-name');
    const personaModalLocationAge = document.getElementById('persona-modal-location-age');
    const personaModalActiveStatus = document.getElementById('persona-modal-active-status');
    const personaModalBio = document.getElementById('persona-modal-bio');
    const personaModalLanguagesUl = document.getElementById('persona-modal-languages');
    const personaModalInterestsUl = document.getElementById('persona-modal-interests');
    const personaModalGallery = document.getElementById('persona-modal-gallery');
    const personaModalMessageBtn = document.getElementById('persona-modal-start-message-btn');
    const personaModalVoiceChatBtn = document.getElementById('persona-modal-start-voicechat-btn');
    const personaModalDirectCallBtn = document.getElementById('persona-modal-start-directcall-btn');

    // --- Active Chat & Summary List Elements (Right Sidebar) ---
    const chatListUl = document.getElementById('chat-list-ul');
    const summaryListUl = document.getElementById('summary-list-ul');
    const emptyChatListMsg = document.getElementById('empty-chat-list-msg');
    const emptySummaryListMsg = document.getElementById('empty-summary-list-msg');

    // --- Filter Elements (Right Sidebar for Find/Groups) ---
    const filterLanguageSelect = document.getElementById('filter-language');
    const filterRoleSelect = document.getElementById('filter-role');
    const filterLevelTagSelect = document.getElementById('filter-level-tag');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');
    const filterGroupLanguageSelect = document.getElementById('filter-group-language');
    const applyGroupFiltersBtn = document.getElementById('apply-group-filters-btn');

    // Group Chat UI Elements (from groups-view)
    const groupListContainer = document.getElementById('group-list-container');
    const availableGroupsUl = document.getElementById('available-groups-ul');
    const groupLoadingMessage = document.getElementById('group-loading-message');
    const groupChatInterfaceDiv = document.getElementById('group-chat-interface');
    const activeGroupNameHeader = document.getElementById('active-group-name');
    const groupChatMembersAvatarsDiv = document.getElementById('group-chat-members-avatars');
    const groupChatLogDiv = document.getElementById('group-chat-log');
    const groupChatInput = document.getElementById('group-chat-input');
    const sendGroupMessageBtn = document.getElementById('send-group-message-btn');
    const leaveGroupBtn = document.getElementById('leave-group-btn');
    const groupTypingIndicator = document.getElementById('group-typing-indicator');


    // Messages Tab Embedded UI
    const messagesViewContent = document.getElementById('messages-view-content');
    const messagesTabHeader = document.getElementById('active-chat-partner-name');
    const messagesPlaceholder = document.getElementById('messages-placeholder');
    const embeddedChatContainer = document.getElementById('embedded-chat-container');
    const embeddedChatLog = document.getElementById('embedded-chat-log');
    const embeddedMessageActivityArea = document.getElementById('embedded-message-activity-area');
    const embeddedMessageActivityImage = document.getElementById('embedded-message-activity-image-display');
    const embeddedMessageAttachBtn = document.getElementById('embedded-message-attach-btn');
    const embeddedMessageImageUpload = document.getElementById('embedded-message-image-upload');
    const embeddedMessageTextInput = document.getElementById('embedded-message-text-input');
    const embeddedMessageSendBtn = document.getElementById('embedded-message-send-btn');


    // =================================================================================
    // INITIALIZATION
    // =================================================================================
    function initializeApp() {
        const initialTab = 'home';
        document.querySelector(`.nav-item[data-tab="${initialTab}"]`).classList.add('active');
        document.getElementById(`${initialTab}-view`).classList.add('active-view');
        rightSidebarPanels.forEach(panel => panel.classList.remove('active-panel'));

        const tips = [
            "Ask your tutor to describe a picture — then write your own version!",
            "Challenge your tutor: Who tells the better story from a photo?",
            "Practice small talk: Discuss the (simulated) weather or weekend plans.",
            "Role-play common scenarios like ordering at a restaurant or asking for directions.",
            "Try a '20 Questions' game with your AI partner to guess an object."
        ];
        const tipsListElement = document.getElementById('homepage-tips-list');
        if (tipsListElement) {
            tipsListElement.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
        }

        populateLanguageFilters();
        if (window.groupChatManager && window.groupChatManager.loadAvailableGroups) {
            window.groupChatManager.loadAvailableGroups();
        }

        if (window.populateConnectorHub && connectorHubElement) {
             if (typeof window.polyglotConnectors !== 'undefined') {
                window.populateConnectorHub(window.polyglotConnectors);
            } else {
                console.warn("polyglotConnectors data not ready for initial hub population.");
                // Optionally, set a timeout or listener for when data is ready
            }
        } else {
            console.warn("window.populateConnectorHub not found or connectorHubElement missing.");
            if(connectorHubElement) connectorHubElement.innerHTML = "<p class='loading-message'>Error: Connector loading function missing.</p>";
        }

        updateChatListsDisplayStatus();
        initializeTheme();
        setupEventListeners(); // Centralized event listener setup

        console.log("App Shell Controller Initialized.");
    }

    // =================================================================================
    // THEME TOGGLE
    // =================================================================================
    function initializeTheme() {
        const savedTheme = localStorage.getItem('polyglotConnectTheme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
            if(themeToggleButton) themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            document.body.classList.remove('dark-mode');
            if(themeToggleButton) themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }

    // =================================================================================
    // EVENT LISTENERS (Centralized)
    // =================================================================================
    function setupEventListeners() {
        // Theme Toggle
        if (themeToggleButton) {
            themeToggleButton.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                if (document.body.classList.contains('dark-mode')) {
                    localStorage.setItem('polyglotConnectTheme', 'dark');
                    themeToggleButton.innerHTML = '<i class="fas fa-sun"></i>';
                } else {
                    localStorage.setItem('polyglotConnectTheme', 'light');
                    themeToggleButton.innerHTML = '<i class="fas fa-moon"></i>';
                }
            });
        }

        // Left Sidebar Navigation
        leftSidebarNavItems.forEach(item => {
            item.addEventListener('click', handleTabSwitch);
        });

        // Detailed Persona Modal Close Buttons
        if (closePersonaModalBtn) {
            closePersonaModalBtn.addEventListener('click', () => window.closeModal(detailedPersonaModal));
        }
        if (detailedPersonaModal) {
            detailedPersonaModal.addEventListener('click', (event) => {
                if (event.target === detailedPersonaModal) window.closeModal(detailedPersonaModal);
            });
        }

        // Persona Modal Action Buttons
        if(personaModalMessageBtn) personaModalMessageBtn.addEventListener('click', () => handlePersonaModalAction('message'));
        if(personaModalVoiceChatBtn) personaModalVoiceChatBtn.addEventListener('click', () => handlePersonaModalAction('voiceChat'));
        if(personaModalDirectCallBtn) personaModalDirectCallBtn.addEventListener('click', () => handlePersonaModalAction('direct'));

        // Filter Buttons
        if (applyFiltersBtn) applyFiltersBtn.addEventListener('click', applyFindFilters);
        if (applyGroupFiltersBtn) applyGroupFiltersBtn.addEventListener('click', applyGroupFilters);

        // Group Chat Interface Buttons
        if (sendGroupMessageBtn && groupChatInput) {
            sendGroupMessageBtn.addEventListener('click', handleSendGroupMessage);
            groupChatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendGroupMessage();
                } else {
                    if (window.groupChatManager && window.groupChatManager.userIsTyping) {
                        window.groupChatManager.userIsTyping();
                    }
                }
            });
        }
        if (leaveGroupBtn) leaveGroupBtn.addEventListener('click', () => {
            if (window.groupChatManager && window.groupChatManager.leaveCurrentGroup) {
                window.groupChatManager.leaveCurrentGroup();
            }
        });

        // Embedded Chat (Messages Tab)
        if (embeddedMessageSendBtn && embeddedMessageTextInput) {
            embeddedMessageSendBtn.addEventListener('click', handleSendEmbeddedMessage);
            embeddedMessageTextInput.addEventListener('keypress', (e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendEmbeddedMessage();
                }
            });
        }
        if (embeddedMessageAttachBtn && embeddedMessageImageUpload) {
            embeddedMessageAttachBtn.addEventListener('click', () => embeddedMessageImageUpload.click());
            embeddedMessageImageUpload.addEventListener('change', handleEmbeddedImageUpload);
        }
    }

    // =================================================================================
    // TAB SWITCHING HANDLER
    // =================================================================================
    function handleTabSwitch(e) {
        e.preventDefault();
        const targetTab = e.currentTarget.dataset.tab;

        leftSidebarNavItems.forEach(i => i.classList.remove('active'));
        e.currentTarget.classList.add('active');

        mainViews.forEach(view => {
            view.classList.remove('active-view');
            if (view.id === `${targetTab}-view`) view.classList.add('active-view');
        });

        rightSidebarPanels.forEach(panel => panel.classList.remove('active-panel'));
        let targetRightPanelId = null;
        if (targetTab === 'find') targetRightPanelId = 'find-filters';
        else if (targetTab === 'groups') targetRightPanelId = 'groups-filters';
        else if (targetTab === 'messages') targetRightPanelId = 'messages-chat-list';
        else if (targetTab === 'summary') targetRightPanelId = 'summary-chat-list';

        if (targetRightPanelId) {
            const targetPanel = document.getElementById(targetRightPanelId);
            if (targetPanel) targetPanel.classList.add('active-panel');
        }

        // Specific actions on tab switch
        if (targetTab === 'find') {
            const currentFilters = {
                language: filterLanguageSelect.value,
                role: filterRoleSelect.value,
                levelTag: filterLevelTagSelect.value,
            };
            if (window.filterAndDisplayConnectors) window.filterAndDisplayConnectors(currentFilters);
            else if (window.populateConnectorHub && typeof window.polyglotConnectors !== 'undefined') window.populateConnectorHub(window.polyglotConnectors);
        }
        if (targetTab === 'groups' && window.groupChatManager && window.groupChatManager.loadAvailableGroups) {
            // Hide group chat interface if it was open, show group list
            if (groupChatInterfaceDiv) groupChatInterfaceDiv.style.display = 'none';
            if (groupListContainer) groupListContainer.style.display = 'block';
            window.groupChatManager.loadAvailableGroups();
        }
        if (targetTab === 'messages') {
            if(window.polyglotConnectMain && window.polyglotConnectMain.currentOneOnOneChatTargetId) {
                // If a chat was active, re-show it
                 const connector = window.polyglotConnectors.find(c => c.id === window.polyglotConnectMain.currentOneOnOneChatTargetId);
                if (connector && window.appShellController.showEmbeddedChat) window.appShellController.showEmbeddedChat(connector);
            } else {
                 // Show placeholder if no chat active
                 if(window.appShellController.hideEmbeddedChat) window.appShellController.hideEmbeddedChat();
            }
            if(window.updateActiveChatListUI) window.updateActiveChatListUI();
        }
        if (targetTab === 'summary') {
            if(window.updateSummaryListUI) window.updateSummaryListUI();
             // Clear any specific summary content from main view, show placeholder
            if (document.getElementById('summary-view-content') && document.getElementById('summary-placeholder')) {
                document.getElementById('summary-view-content').innerHTML = '<p id="summary-placeholder" class="loading-message">Select a past conversation from the right to view your learning summary.</p>';
                document.getElementById('summary-placeholder').style.display = 'block';
            }
            if(document.getElementById('summary-for-partner-name')) document.getElementById('summary-for-partner-name').textContent = "Learning Summary";

        }
        updateChatListsDisplayStatus();
    }

    // =================================================================================
    // DETAILED PERSONA MODAL (Functions exposed via window.appShellController)
    // =================================================================================
    const openDetailedPersonaModalInternal = (connector) => { // Internal function
        if (!connector || !detailedPersonaModal) {
            console.error("Connector data or modal element missing for Detailed Persona Modal.");
            return;
        }

        personaModalAvatar.src = connector.avatarModern;
        personaModalAvatar.alt = connector.profileName || connector.name;
        personaModalName.textContent = connector.profileName || connector.name;

        let locationAgeText = `${connector.city || 'City Unknown'}, ${connector.country || 'Country Unknown'}`;
        if (connector.age) locationAgeText += ` | ${connector.age} years old`;
        personaModalLocationAge.textContent = locationAgeText;

        const isConnectorActive = window.polyglotConnectMain && typeof window.polyglotConnectMain.isConnectorActive === 'function'
            ? window.polyglotConnectMain.isConnectorActive(connector)
            : true;
        personaModalActiveStatus.classList.toggle('active', isConnectorActive);
        personaModalActiveStatus.title = isConnectorActive ? "Active now" : "Currently inactive";
        personaModalBio.textContent = connector.bioModern || "This user hasn't written a bio yet.";

        personaModalLanguagesUl.innerHTML = '';
        if (connector.profileLanguages && connector.profileLanguages.length > 0) {
            connector.profileLanguages.forEach(lang => {
                const li = document.createElement('li');
                const flagUrl = window.polyglotUtils ? window.polyglotUtils.getFlagCdnUrl(lang.flagCode) : '';
                li.innerHTML = `<img src="${flagUrl}" alt="${lang.lang} flag" class="lang-flag"> ${lang.lang} <span class="level-tag ${lang.levelTag.toLowerCase()}">${lang.levelTag.charAt(0).toUpperCase() + lang.levelTag.slice(1)}</span>`;
                personaModalLanguagesUl.appendChild(li);
            });
        } else {
            personaModalLanguagesUl.innerHTML = '<li>This user hasn’t added any languages yet.</li>';
        }

        personaModalInterestsUl.innerHTML = '';
        if (connector.interests && connector.interests.length > 0) {
            connector.interests.forEach(interest => {
                const li = document.createElement('li');
                li.textContent = interest.charAt(0).toUpperCase() + interest.slice(1);
                personaModalInterestsUl.appendChild(li);
            });
        } else {
            personaModalInterestsUl.innerHTML = '<li>This user hasn’t listed any interests yet.</li>';
        }

        if (connector.galleryImageFiles && connector.galleryImageFiles.length > 0) {
            personaModalGallery.innerHTML = `<p>${connector.galleryImageFiles.length} photos (display feature coming soon).</p>`;
        } else {
            personaModalGallery.innerHTML = `<i class="fas fa-images"></i><p>This user hasn’t added any photos yet.</p>`;
        }

        detailedPersonaModal.dataset.connectorId = connector.id;
        window.openModal(detailedPersonaModal); // from connect_ui.js
    };

    function handlePersonaModalAction(actionType) {
        const connectorId = detailedPersonaModal.dataset.connectorId;
        if (!connectorId) { console.error("No connector ID found on persona modal."); return; }
        const connector = window.polyglotConnectors.find(c => c.id === connectorId);
        if (!connector) { console.error(`Connector with ID ${connectorId} not found.`); return; }

        window.closeModal(detailedPersonaModal); // from connect_ui.js

        if (window.polyglotConnectMain && window.polyglotConnectMain.handleInitiateSessionFromShell) {
            window.polyglotConnectMain.handleInitiateSessionFromShell(connector, actionType);
        } else {
            console.error("window.polyglotConnectMain.handleInitiateSessionFromShell not found.");
        }
    }

    // =================================================================================
    // FILTER & GROUP CHAT HANDLERS
    // =================================================================================
    function applyFindFilters() {
        const filters = {
            language: filterLanguageSelect.value,
            role: filterRoleSelect.value,
            levelTag: filterLevelTagSelect.value,
        };
        if (window.filterAndDisplayConnectors) window.filterAndDisplayConnectors(filters);
        else if (window.populateConnectorHub && typeof window.polyglotConnectors !== 'undefined') window.populateConnectorHub(window.polyglotConnectors);
    }

    function applyGroupFilters() {
        const langFilter = filterGroupLanguageSelect.value;
        console.log("Group filter applied for language:", langFilter);
        if (window.groupChatManager && window.groupChatManager.loadAvailableGroups) {
            window.groupChatManager.loadAvailableGroups(langFilter === 'all' ? null : langFilter);
        }
    }

    function handleSendGroupMessage() {
         if (window.groupChatManager && window.groupChatManager.handleUserMessage) {
            window.groupChatManager.handleUserMessage();
        }
    }

    // =================================================================================
    // EMBEDDED CHAT HANDLERS (MESSAGES TAB)
    // =================================================================================
    function handleSendEmbeddedMessage() {
        // This will call a function in connect_main.js that handles sending to Gemini
        // and updating the activeConversations state.
        if (window.polyglotConnectMain && window.polyglotConnectMain.sendEmbeddedTextMessage) {
            const text = embeddedMessageTextInput.value;
            window.polyglotConnectMain.sendEmbeddedTextMessage(text);
            // connect_main.js will clear the input after successful send
        }
    }

    function handleEmbeddedImageUpload(event) {
        if (window.polyglotConnectMain && window.polyglotConnectMain.handleEmbeddedImageUpload) {
            window.polyglotConnectMain.handleEmbeddedImageUpload(event);
        }
    }

    // =================================================================================
    // UTILITY & UI UPDATE FUNCTIONS
    // =================================================================================
    function populateLanguageFilters() {
        const languages = [
            { name: "All Languages", value: "all", flagCode: null },
            { name: "French", value: "fr", flagCode: "fr" }, { name: "Spanish", value: "es", flagCode: "es" },
            { name: "German", value: "de", flagCode: "de" }, { name: "Italian", value: "it", flagCode: "it" },
            { name: "Portuguese", value: "pt", flagCode: "pt" }, { name: "Russian", value: "ru", flagCode: "ru" },
            { name: "Swedish", value: "sv", flagCode: "se" }, { name: "Indonesian", value: "id", flagCode: "id" }
        ];
        [filterLanguageSelect, filterGroupLanguageSelect].forEach(selectElement => {
            if (!selectElement) return;
            selectElement.innerHTML = '';
            languages.forEach(lang => {
                const option = document.createElement('option');
                option.value = lang.value;
                let flagEmoji = ''; // Simple emoji for standard select
                if(lang.flagCode) flagEmoji = window.polyglotUtils ? (window.polyglotUtils.getFlagEmoji ? window.polyglotUtils.getFlagEmoji(lang.flagCode) : '') : ''; // Prefer util if available
                else if (lang.flagCode === "fr") flagEmoji = "🇫🇷"; else if (lang.flagCode === "es") flagEmoji = "🇪🇸";
                else if (lang.flagCode === "de") flagEmoji = "🇩🇪"; else if (lang.flagCode === "it") flagEmoji = "🇮🇹";
                else if (lang.flagCode === "pt") flagEmoji = "🇵🇹"; else if (lang.flagCode === "ru") flagEmoji = "🇷🇺";
                else if (lang.flagCode === "se") flagEmoji = "🇸🇪"; else if (lang.flagCode === "id") flagEmoji = "🇮🇩";
                option.textContent = `${flagEmoji} ${lang.name}`.trim();
                selectElement.appendChild(option);
            });
        });
    }

    function updateChatListsDisplayStatus() {
        if (chatListUl && emptyChatListMsg) {
            emptyChatListMsg.style.display = chatListUl.children.length === 0 ? 'block' : 'none';
        }
        if (summaryListUl && emptySummaryListMsg) {
            emptySummaryListMsg.style.display = summaryListUl.children.length === 0 ? 'block' : 'none';
        }
    }

    // =================================================================================
    // EXPOSE CONTROLLER FUNCTIONS GLOBALLY
    // =================================================================================
    window.appShellController = {
        openDetailedPersonaModal: openDetailedPersonaModalInternal,
        renderChatList: (conversations) => {
            if (!chatListUl) return;
            chatListUl.innerHTML = '';
            const sortedConvos = Object.values(conversations).sort((a, b) => (b.lastActivity || 0) - (a.lastActivity || 0));
            sortedConvos.forEach(convo => {
                if (!convo.connector) return;
                const li = document.createElement('li');
                const isActive = window.polyglotConnectMain && window.polyglotConnectMain.isConnectorActive(convo.connector);
                const flagUrl = window.polyglotUtils ? window.polyglotUtils.getFlagCdnUrl(convo.connector.flagCode, 16) : '';
                li.innerHTML = `
                    <div class="chat-list-item" data-connector-id="${convo.connector.id}">
                        <img src="${convo.connector.avatarModern}" alt="${convo.connector.profileName}" class="chat-list-item-avatar">
                        <span class="chat-list-item-name">
                            ${flagUrl ? `<img src="${flagUrl}" alt="" class="lang-flag" style="width:16px; height:auto; margin-right:5px; vertical-align:middle;">` : ''}
                            ${convo.connector.profileName || convo.connector.name}
                        </span>
                        <span class="chat-list-item-status ${isActive ? 'active' : ''}" title="${isActive ? 'Active' : 'Inactive'}"></span>
                    </div>`;
                li.querySelector('.chat-list-item').addEventListener('click', () => {
                    if (window.polyglotConnectMain && window.polyglotConnectMain.setActiveOneOnOneChat) {
                        window.polyglotConnectMain.setActiveOneOnOneChat(convo.connector.id);
                    }
                    const messagesNavItem = document.querySelector('.nav-item[data-tab="messages"]');
                    if (messagesNavItem && !messagesNavItem.classList.contains('active')) messagesNavItem.click();
                });
                chatListUl.appendChild(li);
            });
            updateChatListsDisplayStatus();
        },
        renderSummaryList: (summarizedSessions) => {
            if (!summaryListUl) return;
            summaryListUl.innerHTML = '';
            summarizedSessions.forEach(session => {
                if (!session.connector) return;
                const li = document.createElement('li');
                const flagUrl = window.polyglotUtils ? window.polyglotUtils.getFlagCdnUrl(session.connector.flagCode, 16) : '';
                li.innerHTML = `
                    <div class="summary-list-item" data-session-id="${session.sessionId || session.connector.id + '_' + session.date}">
                        <img src="${session.connector.avatarModern}" alt="${session.connector.profileName}" class="chat-list-item-avatar">
                        <span class="chat-list-item-name">
                             ${flagUrl ? `<img src="${flagUrl}" alt="" class="lang-flag" style="width:16px; height:auto; margin-right:5px; vertical-align:middle;">` : ''}
                            ${session.connector.profileName} - ${new Date(session.date).toLocaleDateString()}
                        </span>
                    </div>`;
                li.querySelector('.summary-list-item').addEventListener('click', () => {
                    if (window.polyglotConnectMain && window.polyglotConnectMain.showSessionRecapById) {
                        window.polyglotConnectMain.showSessionRecapById(session.sessionId || session.connector.id + '_' + session.date);
                    }
                     const summaryNavItem = document.querySelector('.nav-item[data-tab="summary"]');
                    if (summaryNavItem && !summaryNavItem.classList.contains('active')) summaryNavItem.click();
                });
                summaryListUl.appendChild(li);
            });
            updateChatListsDisplayStatus();
        },
        displayAvailableGroups: (groups) => { /* ... (same as before) ... */
            if (!availableGroupsUl || !groupLoadingMessage) return;
            availableGroupsUl.innerHTML = '';
            if (groups && groups.length > 0) {
                groupLoadingMessage.style.display = 'none';
                groups.forEach(group => {
                    const li = document.createElement('li');
                    li.dataset.groupId = group.id;
                    const langData = window.polyglotConnectors.find(c => c.language === group.language); // Find any connector for the language to get flagCode
                    const flagUrl = langData ? (window.polyglotUtils.getFlagCdnUrl(langData.flagCode)) : '';
                    li.innerHTML = `
                        <div>
                            ${flagUrl ? `<img src="${flagUrl}" class="group-list-lang-flag" alt="${group.language} flag">` : ''}
                            <span class="group-list-name">${group.name}</span>
                        </div>
                        <span class="group-list-member-count">Join <i class="fas fa-chevron-right"></i></span>`;
                    li.addEventListener('click', () => {
                        if (window.groupChatManager && window.groupChatManager.joinGroup) {
                            window.groupChatManager.joinGroup(group.id);
                        }
                    });
                    availableGroupsUl.appendChild(li);
                });
            } else {
                groupLoadingMessage.textContent = 'No groups available currently.';
                groupLoadingMessage.style.display = 'block';
            }
        },
        showGroupChatInterface: (groupName, members) => { /* ... (same as before) ... */
            if (!groupListContainer || !groupChatInterfaceDiv || !activeGroupNameHeader || !groupChatMembersAvatarsDiv) return;
            groupListContainer.style.display = 'none'; groupChatInterfaceDiv.style.display = 'flex';
            activeGroupNameHeader.textContent = groupName; groupChatLogDiv.innerHTML = '';
            groupChatMembersAvatarsDiv.innerHTML = '';
            members.slice(0, 5).forEach(member => {
                const img = document.createElement('img'); img.src = member.avatarModern; img.alt = member.profileName;
                img.title = member.profileName; img.className = 'member-avatar-small';
                groupChatMembersAvatarsDiv.appendChild(img);
            });
            if (members.length > 5) {
                const moreSpan = document.createElement('span'); moreSpan.className = 'member-avatar-small more-members';
                moreSpan.textContent = `+${members.length - 5}`; groupChatMembersAvatarsDiv.appendChild(moreSpan);
            }
            if(groupChatInput) groupChatInput.focus();
        },
        hideGroupChatInterface: () => { /* ... (same as before) ... */
            if (!groupListContainer || !groupChatInterfaceDiv) return;
            groupChatInterfaceDiv.style.display = 'none'; groupListContainer.style.display = 'block';
            if (window.groupChatManager && window.groupChatManager.loadAvailableGroups) window.groupChatManager.loadAvailableGroups();
        },
        appendMessageToGroupChatLog: (message, senderName, isUser, senderId = null) => { /* ... (same as before) ... */
            if (!groupChatLogDiv) return;
            const messageDiv = document.createElement('div');
            const senderClass = isUser ? 'user' : (senderId && senderId.includes('_tutor') ? 'tutor' : 'connector'); // Basic tutor styling
            messageDiv.classList.add('chat-message-ui', senderClass);
            let displayName = isUser ? "You" : senderName;
            messageDiv.innerHTML = `<strong>${displayName}:</strong> ${message.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>')}`;
            groupChatLogDiv.appendChild(messageDiv); groupChatLogDiv.scrollTop = groupChatLogDiv.scrollHeight;
        },
        setGroupTypingIndicator: (text) => { /* ... (same as before) ... */
             if (groupTypingIndicator) {
                groupTypingIndicator.textContent = text || '';
                groupTypingIndicator.style.display = text ? 'block' : 'none';
            }
        },
        showEmbeddedChat: (connector) => { /* ... (same as before, ensure attach btn logic is present) ... */
            if (!embeddedChatContainer || !messagesPlaceholder || !messagesTabHeader) return;
            messagesPlaceholder.style.display = 'none'; embeddedChatContainer.style.display = 'flex';
            messagesTabHeader.textContent = `Chat with ${connector.profileName || connector.name}`;
            if (embeddedChatLog) embeddedChatLog.innerHTML = ''; if (embeddedMessageTextInput) embeddedMessageTextInput.value = '';
            if (embeddedMessageAttachBtn) embeddedMessageAttachBtn.style.display = connector.role === 'tutor' ? 'inline-flex' : 'none'; // flex for icon alignment
            if (embeddedMessageActivityArea) embeddedMessageActivityArea.style.display = 'none';
        },
        hideEmbeddedChat: () => { /* ... (same as before) ... */
             if (!embeddedChatContainer || !messagesPlaceholder || !messagesTabHeader) return;
            embeddedChatContainer.style.display = 'none'; messagesPlaceholder.style.display = 'block';
            messagesTabHeader.textContent = "Your Conversations";
        },
        appendMessageToEmbeddedChat: (text, senderClass) => { /* ... (same as before) ... */
            if (!embeddedChatLog) return;
            const messageDiv = document.createElement('div'); messageDiv.classList.add('chat-message-ui', senderClass);
            text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
            messageDiv.innerHTML = text; embeddedChatLog.appendChild(messageDiv); embeddedChatLog.scrollTop = embeddedChatLog.scrollHeight;
        },
        showImageInEmbeddedChat: (imageUrl) => { /* ... (same as before) ... */
            if (!embeddedMessageActivityArea || !embeddedMessageActivityImage || !embeddedChatLog) return;
            if (imageUrl) {
                embeddedMessageActivityImage.src = imageUrl; embeddedMessageActivityArea.style.display = 'block';
                embeddedChatLog.scrollTop = embeddedChatLog.scrollHeight;
            } else { embeddedMessageActivityArea.style.display = 'none'; }
        }
    };

    // =================================================================================
    // START THE APP
    // =================================================================================
    initializeApp();

}); // End DOMContentLoaded