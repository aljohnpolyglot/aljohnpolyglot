// js/ui/view_manager.js
// Manages view switching, navigation, and view-specific initializations.

window.viewManager = (() => {
    const getDeps = () => ({
        domElements: window.domElements,
        polyglotHelpers: window.polyglotHelpers,
        uiUpdater: window.uiUpdater,
        chatManager: window.chatManager,
        groupManager: window.groupManager,
        sessionManager: window.sessionManager,
        listRenderer: window.listRenderer,
        filterController: window.filterController,
        chatUiManager: window.chatUiManager,
        polyglotSharedContent: window.polyglotSharedContent,
    });

    let currentActiveTab = 'home';

    function initializeAndSwitchToInitialView() {
        const { polyglotHelpers } = getDeps();
        console.log("viewManager: initializeAndSwitchToInitialView - Starting.");
        currentActiveTab = polyglotHelpers?.loadFromLocalStorage('polyglotLastActiveTab') || 'home';
        console.log("viewManager: Initial activeTab from localStorage (or default):", currentActiveTab);
        setupNavigationEventListeners();
        switchView(currentActiveTab, true);
        console.log("viewManager: initializeAndSwitchToInitialView - Complete.");
    }

    function setupNavigationEventListeners() {
        const { domElements } = getDeps();
        if (domElements?.mainNavItems) {
            domElements.mainNavItems.forEach(item => {
                item.addEventListener('click', handleTabSwitchEvent);
            });
            console.log("viewManager: Main navigation event listeners attached.");
        } else {
            console.warn("viewManager: Main navigation items (domElements.mainNavItems) not found.");
        }
    }

    function handleTabSwitchEvent(e) {
        e.preventDefault();
        const targetTab = e.currentTarget.dataset.tab;
        if (targetTab && targetTab !== currentActiveTab) {
            switchView(targetTab);
        }
    }

    function switchView(targetTab, isInitialLoad = false) {
        const {
            domElements, listRenderer, uiUpdater, chatManager, groupManager,
            sessionManager, polyglotHelpers, filterController, chatUiManager
        } = getDeps();

        console.log(`viewManager: switchView - Attempting to switch to tab: '${targetTab}', current: '${currentActiveTab}', initial: ${isInitialLoad}`);

        if (!targetTab || !domElements?.mainNavItems || !domElements.mainViews || !domElements.rightSidebarPanels) {
            console.error("viewManager: switchView - CRITICAL: Missing DOM elements for tab switching. Aborting.");
            return;
        }

        currentActiveTab = targetTab;
        polyglotHelpers?.saveToLocalStorage('polyglotLastActiveTab', currentActiveTab);
        domElements.mainNavItems.forEach(i => i.classList.toggle('active', i.dataset.tab === targetTab));
        domElements.mainViews.forEach(view => {
            view.classList.toggle('active-view', view.id === `${targetTab}-view`);
        });
        domElements.rightSidebarPanels.forEach(panel => panel.classList.remove('active-panel'));
        const rightPanelMap = {
            'home': null,
            'find': 'findFiltersPanel',
            'groups': 'groupsFiltersPanel',
            'messages': 'messagesChatListPanel',
            'summary': 'summaryChatListPanel'
        };
        const targetRightPanelKey = rightPanelMap[targetTab];
        if (targetRightPanelKey && domElements[targetRightPanelKey]) {
            domElements[targetRightPanelKey].classList.add('active-panel');
        } else if (targetRightPanelKey) {
            console.warn(`viewManager: Right sidebar panel DOM element '${targetRightPanelKey}' not found for tab '${targetTab}'.`);
        }

        if (targetTab === 'home') {
            console.log("viewManager: Activating 'home' view.");
            populateHomepageTips();
        } else if (targetTab === 'find') {
            console.log("viewManager: Activating 'find' view.");
            filterController?.applyFindConnectorsFilters();
        } else if (targetTab === 'groups') {
            console.log("viewManager: Activating 'groups' view.");
            if (chatUiManager?.hideGroupChatView) { // CORRECTED FUNCTION NAME HERE
                chatUiManager.hideGroupChatView();
            } else {
                console.warn("viewManager: chatUiManager.hideGroupChatView is not available for 'groups' tab.");
            }
            groupManager?.loadAvailableGroups();
        } else if (targetTab === 'messages') {
            console.log("viewManager: Activating 'messages' view. Calling chatManager.handleMessagesTabActive()");
            chatManager?.handleMessagesTabActive();
        } else if (targetTab === 'summary') {
            console.log("viewManager: Activating 'summary' view.");
            if (sessionManager && listRenderer) {
                listRenderer.renderSummaryList(sessionManager.getCompletedSessions(), sessionManager.showSessionRecapInView);
            }
            uiUpdater?.displaySummaryInView(null);
        }

        updateEmptyListMessages();
        console.log(`viewManager: switchView - Successfully switched to tab: '${targetTab}'`);
    }

    function populateHomepageTips() {
        const { domElements, polyglotHelpers, polyglotSharedContent } = getDeps();
        console.log("viewManager: populateHomepageTips - Called.");

        if (!domElements?.homepageTipsList) {
            console.error("viewManager: populateHomepageTips - domElements.homepageTipsList is missing!");
            return;
        }
        if (!polyglotSharedContent?.homepageTips) {
            console.error("viewManager: populateHomepageTips - polyglotSharedContent.homepageTips is missing or undefined!");
            if (domElements.homepageTipsList) domElements.homepageTipsList.innerHTML = "<li>No tips available.</li>";
            return;
        }
        if (!polyglotHelpers) {
            console.error("viewManager: populateHomepageTips - polyglotHelpers is missing!");
            return;
        }

        const tips = polyglotSharedContent.homepageTips;
        if (Array.isArray(tips) && tips.length > 0) {
            domElements.homepageTipsList.innerHTML = tips.map(tip =>
                `<li><i class="fas fa-check-circle tip-icon"></i> ${polyglotHelpers.sanitizeTextForDisplay(tip)}</li>`
            ).join('');
            console.log("viewManager: Homepage tips populated.");
        } else {
            console.warn("viewManager: populateHomepageTips - homepageTips is not a non-empty array. Content:", tips);
            domElements.homepageTipsList.innerHTML = "<li>Tips are loading or unavailable.</li>";
        }
    }

    function updateEmptyListMessages() {
        const { domElements } = getDeps();
        if (!domElements) {
            console.warn("viewManager: updateEmptyListMessages - domElements not available.");
            return;
        }
        if (domElements.chatListUl && domElements.emptyChatListMsg) {
            domElements.emptyChatListMsg.style.display = domElements.chatListUl.children.length === 0 ? 'block' : 'none';
        }
        if (domElements.summaryListUl && domElements.emptySummaryListMsg) {
            domElements.emptySummaryListMsg.style.display = domElements.summaryListUl.children.length === 0 ? 'block' : 'none';
        }
        if (domElements.availableGroupsUl && domElements.groupLoadingMessage) {
            const hasGroups = domElements.availableGroupsUl.children.length > 0;
            let message = '';
            if (!hasGroups) {
                const currentFilterValue = domElements.filterGroupLanguageSelect?.value || 'all';
                message = currentFilterValue !== 'all' ? 'No groups match your current filter.' : 'No groups available at the moment.';
            }
            domElements.groupLoadingMessage.textContent = message;
            domElements.groupLoadingMessage.style.display = message ? 'block' : 'none';
        }
    }

    console.log("js/ui/view_manager.js loaded.");
    return {
        initializeAndSwitchToInitialView,
        switchView,
        updateEmptyListMessages
    };
})();