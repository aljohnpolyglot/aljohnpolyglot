// js/ui/dom_elements.js
// Centralized DOM element selectors for easy access and maintenance.

window.domElements = {
    // App Shell
    appShell: document.getElementById('polyglot-connect-app-shell'),
    leftSidebar: document.getElementById('left-sidebar'),
    mainNavItems: document.querySelectorAll('#left-sidebar .nav-item'),
    mainContainer: document.getElementById('main-container'),
    mainViews: document.querySelectorAll('#main-container .view'),
    rightSidebar: document.getElementById('right-sidebar'),
    rightSidebarPanels: document.querySelectorAll('#right-sidebar .sidebar-panel'),
    themeToggleButton: document.getElementById('toggle-theme-btn'),

    // Home View
    homepageTipsList: document.getElementById('homepage-tips-list'),

    // Find Someone View
    findView: document.getElementById('find-view'),
    connectorHubGrid: document.getElementById('connector-hub'),
    findFiltersPanel: document.getElementById('find-filters'),
    filterLanguageSelect: document.getElementById('filter-language'),
    filterRoleSelect: document.getElementById('filter-role'),
    applyFiltersBtn: document.getElementById('apply-filters-btn'),

    // Groups View
    groupsView: document.getElementById('groups-view'),
    groupListContainer: document.getElementById('group-list-container'),
    availableGroupsUl: document.getElementById('available-groups-ul'),
    groupLoadingMessage: document.getElementById('group-loading-message'),
    groupChatInterfaceDiv: document.getElementById('group-chat-interface'),
    activeGroupNameHeader: document.getElementById('active-group-name'),
    groupChatMembersAvatarsDiv: document.getElementById('group-chat-members-avatars'),
    groupChatLogDiv: document.getElementById('group-chat-log'),
    groupTypingIndicator: document.getElementById('group-typing-indicator'),
    groupChatInput: document.getElementById('group-chat-input'),
    sendGroupMessageBtn: document.getElementById('send-group-message-btn'),
    leaveGroupBtn: document.getElementById('leave-group-btn'),
    groupsFiltersPanel: document.getElementById('groups-filters'),
    filterGroupLanguageSelect: document.getElementById('filter-group-language'),
    applyGroupFiltersBtn: document.getElementById('apply-group-filters-btn'),

    // Messages View (for 1-on-1 Embedded Chat)
    messagesView: document.getElementById('messages-view'),
    messagesTabHeader: document.getElementById('active-chat-partner-name'),
    messagesPlaceholder: document.getElementById('messages-placeholder'),
    embeddedChatContainer: document.getElementById('embedded-chat-container'),
    embeddedChatLog: document.getElementById('embedded-chat-log'),
    embeddedMessageActivityArea: document.getElementById('embedded-message-activity-area'),
    embeddedMessageActivityImage: document.getElementById('embedded-message-activity-image-display'),
    embeddedMessageAttachBtn: document.getElementById('embedded-message-attach-btn'),
    embeddedMessageImageUpload: document.getElementById('embedded-message-image-upload'),
    embeddedMessageTextInput: document.getElementById('embedded-message-text-input'),
    embeddedMessageSendBtn: document.getElementById('embedded-message-send-btn'),
    messagesChatListPanel: document.getElementById('messages-chat-list'),
    chatListUl: document.getElementById('chat-list-ul'),
    emptyChatListMsg: document.getElementById('empty-chat-list-msg'),

    // Summary View
    summaryView: document.getElementById('summary-view'),
    summaryViewContent: document.getElementById('summary-view-content'),
    summaryTabHeader: document.getElementById('summary-for-partner-name'),
    summaryPlaceholder: document.getElementById('summary-placeholder'),
    summaryChatListPanel: document.getElementById('summary-chat-list'),
    summaryListUl: document.getElementById('summary-list-ul'),
    emptySummaryListMsg: document.getElementById('empty-summary-list-msg'),

    // Detailed Persona Modal
    detailedPersonaModal: document.getElementById('detailed-persona-modal'),
    closePersonaModalBtn: document.getElementById('close-persona-modal-btn'),
    personaModalAvatar: document.getElementById('persona-modal-avatar'),
    personaModalName: document.getElementById('persona-modal-name'),
    personaModalLocationAge: document.getElementById('persona-modal-location-age'),
    personaModalActiveStatus: document.getElementById('persona-modal-active-status'),
    personaModalBio: document.getElementById('persona-modal-bio'),
    personaModalLanguagesUl: document.getElementById('persona-modal-languages'), // This is now a div in HTML for grid
    personaModalInterestsUl: document.getElementById('persona-modal-interests'),
    personaModalGallery: document.getElementById('persona-modal-gallery'),
    personaModalMessageBtn: document.getElementById('persona-modal-start-message-btn'),
    personaModalVoiceChatBtn: document.getElementById('persona-modal-start-voicechat-btn'),
    personaModalDirectCallBtn: document.getElementById('persona-modal-start-directcall-btn'),

    // Virtual Calling Screen Modal
    virtualCallingScreen: document.getElementById('virtual-calling-screen'),
    callingAvatar: document.getElementById('calling-avatar'),
    callingName: document.getElementById('calling-name'),
    callingStatus: document.getElementById('calling-status'),
    cancelCallBtn: document.getElementById('cancel-call-btn'),

    // Voice-Enabled Chat Modal
    voiceEnabledChatInterface: document.getElementById('voice-enabled-chat-interface'),
    voiceChatActiveAvatar: document.getElementById('voice-chat-active-avatar'),
    voiceChatActiveName: document.getElementById('voice-chat-active-name'),
    voiceChatLog: document.getElementById('voice-chat-log'),
    voiceChatActivityArea: document.getElementById('voice-chat-activity-area'),
    voiceChatActivityImageDisplay: document.getElementById('voice-chat-activity-image-display'),
    voiceChatTextInput: document.getElementById('voice-chat-text-input'),
    voiceChatTapToSpeakBtn: document.getElementById('voice-chat-tap-to-speak-btn'),
    voiceChatSendTextBtn: document.getElementById('voice-chat-send-text-btn'),
    endVoiceChatBtn: document.getElementById('end-voice-chat-btn'),
    toggleVoiceChatTTSBtn: document.getElementById('toggle-voice-chat-tts-btn'),

    // Direct Call Modal
    directCallInterface: document.getElementById('direct-call-interface'),
    directCallActiveAvatar: document.getElementById('direct-call-active-avatar'),
    directCallActiveName: document.getElementById('direct-call-active-name'),
    directCallStatusIndicator: document.getElementById('direct-call-status-indicator'),
    directCallMuteBtn: document.getElementById('direct-call-mute-btn'),
    directCallEndBtn: document.getElementById('direct-call-end-btn'),
    directCallActivityArea: document.getElementById('direct-call-activity-area'),
    directCallActivityImageDisplay: document.getElementById('direct-call-activity-image-display'),
    directCallSpeakerToggleBtn: document.getElementById('direct-call-speaker-toggle-btn'),
    directCallActivityBtn: document.getElementById('direct-call-activity-btn'),
    directCallMainContent: document.querySelector('#direct-call-interface .direct-call-main-content'), // For scrolling image into view

    // Messaging Modal
    messagingInterface: document.getElementById('messaging-interface'),
    messageActiveAvatar: document.getElementById('message-active-avatar'),
    messageActiveName: document.getElementById('message-active-name'),
    messageChatLog: document.getElementById('message-chat-log'),
    messageActivityArea: document.getElementById('message-activity-area'),
    messageActivityImageDisplay: document.getElementById('message-activity-image-display'),
    messageTextInput: document.getElementById('message-text-input'),
    messageSendBtn: document.getElementById('message-send-btn'),
    closeMessagingModalBtn: document.getElementById('close-messaging-modal-btn'),
    toggleMessageTTSBtn: document.getElementById('toggle-message-tts-btn'),

    // Session Recap Modal
    sessionRecapScreen: document.getElementById('session-recap-screen'),
    recapConnectorName: document.getElementById('recap-connector-name'),
    recapDate: document.getElementById('recap-date'),
    recapDuration: document.getElementById('recap-duration'),
    recapTopicsList: document.getElementById('recap-topics'),
    recapVocabularyList: document.getElementById('recap-vocabulary'),
    recapFocusAreasList: document.getElementById('recap-focus-areas'),
    closeRecapBtn: document.getElementById('close-recap-btn'),
    downloadTranscriptBtn: document.getElementById('recap-download-transcript-btn'),
};

// console.log('ui/dom_elements.js loaded. window.domElements object defined.'); // From your paste