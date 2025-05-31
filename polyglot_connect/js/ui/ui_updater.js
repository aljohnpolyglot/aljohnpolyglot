// js/ui/ui_updater.js
// Contains functions to update specific parts of the UI.

window.uiUpdater = (() => {
    const getDeps = () => ({ // Lazy load dependencies to avoid race conditions
        domElements: window.domElements,
        polyglotHelpers: window.polyglotHelpers
    });

    function appendChatMessage(logElement, text, senderClass, options = {}) {
        const { polyglotHelpers } = getDeps();
        if (!logElement || !polyglotHelpers) {
            console.warn("appendChatMessage: Log element or polyglotHelpers not found.");
            return null;
        }
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('chat-message-ui', senderClass);
        if (options.isThinking) messageDiv.classList.add('connector-thinking');
        if (options.isError) messageDiv.classList.add(senderClass.includes('user') ? 'user-audio-error' : 'connector-error');

        let processedText = text;
        if (options.senderName && senderClass !== 'user' && senderClass !== 'user-audio') {
            processedText = `<strong>${polyglotHelpers.sanitizeTextForDisplay(options.senderName)}:</strong> ${polyglotHelpers.sanitizeTextForDisplay(text)}`;
        } else {
            processedText = polyglotHelpers.sanitizeTextForDisplay(text);
        }
        processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
        messageDiv.innerHTML = processedText;

        if (options.messageId) messageDiv.dataset.messageId = options.messageId;

        logElement.appendChild(messageDiv);
        requestAnimationFrame(() => { // Ensure layout is updated before scrolling
            logElement.scrollTop = logElement.scrollHeight;
        });
        return messageDiv;
    }

    function showImageInActivityArea(activityAreaElement, imageDisplayElement, logElementToScroll, imageUrl) {
        if (!activityAreaElement || !imageDisplayElement || !logElementToScroll) {
            console.warn("showImageInActivityArea: Missing one or more DOM elements.");
            return;
        }
        if (imageUrl) {
            imageDisplayElement.src = imageUrl;
            activityAreaElement.style.display = 'block';
            requestAnimationFrame(() => {
                logElementToScroll.scrollTop = logElementToScroll.scrollHeight;
            });
        } else {
            imageDisplayElement.src = '';
            activityAreaElement.style.display = 'none';
        }
    }

    const populateListInRecap = (ulElement, itemsArray) => {
        if (!ulElement) return;
        ulElement.innerHTML = '';
        if (itemsArray && itemsArray.length > 0) {
            itemsArray.forEach(itemText => {
                const li = document.createElement('li');
                li.textContent = typeof itemText === 'string' ? itemText : JSON.stringify(itemText); // Handle non-string items
                ulElement.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'None noted.';
            li.style.fontStyle = 'italic';
            ulElement.appendChild(li);
        }
    };

    return {
        updateVirtualCallingScreen: (connector, sessionTypeAttempt) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements || !polyglotHelpers || !connector) return;
            if (domElements.callingAvatar) domElements.callingAvatar.src = connector.avatarModern || 'images/placeholder_avatar.png';
            if (domElements.callingName) domElements.callingName.textContent = `Connecting to ${polyglotHelpers.sanitizeTextForDisplay(connector.profileName || connector.name)}...`;
            if (domElements.callingStatus) domElements.callingStatus.textContent = `Attempting ${sessionTypeAttempt.replace('_modal','')}... Ringing...`;
        },
        appendToVoiceChatLog: (text, senderClass, options = {}) => {
            const { domElements } = getDeps();
            return appendChatMessage(domElements?.voiceChatLog, text, senderClass, options);
        },
        showImageInVoiceChat: (imageUrl) => {
            const { domElements } = getDeps();
            showImageInActivityArea(domElements?.voiceChatActivityArea, domElements?.voiceChatActivityImageDisplay, domElements?.voiceChatLog, imageUrl);
        },
        updateVoiceChatHeader: (connector) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements || !polyglotHelpers || !connector) return;
            if (domElements.voiceChatActiveAvatar) domElements.voiceChatActiveAvatar.src = connector.avatarModern || 'images/placeholder_avatar.png';
            if (domElements.voiceChatActiveName) domElements.voiceChatActiveName.textContent = polyglotHelpers.sanitizeTextForDisplay(connector.profileName || connector.name);
        },
        clearVoiceChatLog: () => {
            const { domElements } = getDeps();
            if (domElements?.voiceChatLog) domElements.voiceChatLog.innerHTML = '';
            if (domElements?.voiceChatActivityArea) domElements.voiceChatActivityArea.style.display = 'none';
            if (domElements?.voiceChatActivityImageDisplay) domElements.voiceChatActivityImageDisplay.src = '';
        },
        resetVoiceChatInput: () => {
            const { domElements } = getDeps();
            if (!domElements) return;
            if (domElements.voiceChatTextInput) domElements.voiceChatTextInput.value = '';
            if (domElements.voiceChatSendTextBtn) domElements.voiceChatSendTextBtn.style.display = 'none';
            if (domElements.voiceChatTapToSpeakBtn) {
                const btn = domElements.voiceChatTapToSpeakBtn;
                btn.classList.remove('listening', 'processing', 'mic-active');
                btn.innerHTML = '<i class="fas fa-microphone"></i>';
                btn.disabled = false;
                btn.title = "Tap to Speak";
            }
        },
        updateVoiceChatTapToSpeakButton: (state, text = '') => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements?.voiceChatTapToSpeakBtn || !polyglotHelpers) return;
            const btn = domElements.voiceChatTapToSpeakBtn;
            btn.classList.remove('listening', 'processing', 'mic-active');
            btn.disabled = false;
            switch(state) {
                case 'listening':
                    btn.classList.add('listening', 'mic-active');
                    btn.innerHTML = `<i class="fas fa-stop"></i> ${polyglotHelpers.sanitizeTextForDisplay(text) || 'Listening...'}`;
                    btn.title = "Tap to Stop Recording";
                    break;
                case 'processing':
                    btn.classList.add('processing');
                    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${polyglotHelpers.sanitizeTextForDisplay(text) || 'Processing...'}`;
                    btn.disabled = true;
                    btn.title = "Processing Audio";
                    break;
                default: // idle
                    btn.innerHTML = '<i class="fas fa-microphone"></i>';
                    btn.title = "Tap to Speak";
                    break;
            }
        },
        updateDirectCallHeader: (connector) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements || !polyglotHelpers || !connector) return;
            if (domElements.directCallActiveAvatar) domElements.directCallActiveAvatar.src = connector.avatarModern || 'images/placeholder_avatar.png';
            if (domElements.directCallActiveName) domElements.directCallActiveName.textContent = polyglotHelpers.sanitizeTextForDisplay(connector.profileName || connector.name);
            if (domElements.directCallActivityBtn) {
                // Check primary language roles first
                let isTutorInPrimary = connector.languageRoles &&
                                    connector.languageRoles[connector.language] &&
                                    Array.isArray(connector.languageRoles[connector.language]) &&
                                    connector.languageRoles[connector.language].includes('tutor');

                domElements.directCallActivityBtn.style.display = isTutorInPrimary && connector.tutorMinigameImageFiles?.length > 0 ? 'inline-flex' : 'none';
            }
        },
        updateDirectCallStatus: (statusText, isError = false) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (domElements?.directCallStatusIndicator && polyglotHelpers) {
                domElements.directCallStatusIndicator.textContent = polyglotHelpers.sanitizeTextForDisplay(statusText);
                domElements.directCallStatusIndicator.style.color = isError ? 'var(--danger-color)' : 'inherit';
            }
        },
        updateDirectCallMicButtonVisual: (isMuted) => {
            const { domElements } = getDeps();
            if (domElements?.directCallMuteBtn) {
                domElements.directCallMuteBtn.classList.toggle('mic-active', !isMuted);
                domElements.directCallMuteBtn.innerHTML = isMuted ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
                domElements.directCallMuteBtn.title = isMuted ? "Mic Off (Click to Unmute & Record)" : "Mic On (Click to Mute & Send)";
            }
        },
        updateDirectCallSpeakerButtonVisual: (isMuted) => {
            const { domElements } = getDeps();
            if(domElements?.directCallSpeakerToggleBtn) {
                domElements.directCallSpeakerToggleBtn.classList.toggle('speaker-active', !isMuted);
                domElements.directCallSpeakerToggleBtn.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
                domElements.directCallSpeakerToggleBtn.title = isMuted ? "AI Voice Off" : "AI Voice On";
            }
        },
        showImageInDirectCall: (imageUrl) => {
            const { domElements } = getDeps();
            const mainContentArea = domElements?.directCallInterface?.querySelector('.direct-call-main-content') || domElements?.directCallInterface;
            showImageInActivityArea(domElements?.directCallActivityArea, domElements?.directCallActivityImageDisplay, mainContentArea, imageUrl);
        },
        clearDirectCallActivityArea: () => {
            const { domElements } = getDeps();
            if (domElements?.directCallActivityArea) domElements.directCallActivityArea.style.display = 'none';
            if (domElements?.directCallActivityImageDisplay) domElements.directCallActivityImageDisplay.src = '';
        },
        appendToMessageLogModal: (text, senderClass, options = {}) => {
            const { domElements } = getDeps();
            return appendChatMessage(domElements?.messageChatLog, text, senderClass, options);
        },
        showImageInMessageModal: (imageUrl) => {
            const { domElements } = getDeps();
            showImageInActivityArea(domElements?.messageActivityArea, domElements?.messageActivityImageDisplay, domElements?.messageChatLog, imageUrl);
        },
        updateMessageModalHeader: (connector) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements || !polyglotHelpers || !connector) return;
            if (domElements.messageActiveAvatar) domElements.messageActiveAvatar.src = connector.avatarModern || 'images/placeholder_avatar.png';
            if (domElements.messageActiveName) domElements.messageActiveName.textContent = `Chat with ${polyglotHelpers.sanitizeTextForDisplay(connector.profileName || connector.name)}`;
        },
        resetMessageModalInput: () => {
            const { domElements } = getDeps();
            if (domElements?.messageTextInput) domElements.messageTextInput.value = '';
            if (domElements?.messageSendBtn) domElements.messageSendBtn.disabled = false;
        },
        clearMessageModalLog: () => {
            const { domElements } = getDeps();
            if (domElements?.messageChatLog) domElements.messageChatLog.innerHTML = '';
            if (domElements?.messageActivityArea) domElements.messageActivityArea.style.display = 'none';
            if (domElements?.messageActivityImageDisplay) domElements.messageActivityImageDisplay.src = '';
        },
        appendToEmbeddedChatLog: (text, senderClass, options = {}) => {
            const { domElements } = getDeps();
            return appendChatMessage(domElements?.embeddedChatLog, text, senderClass, options);
        },
        showImageInEmbeddedChat: (imageUrl) => {
            const { domElements } = getDeps();
            showImageInActivityArea(domElements?.embeddedMessageActivityArea, domElements?.embeddedMessageActivityImage, domElements?.embeddedChatLog, imageUrl);
        },
        updateEmbeddedChatHeader: (connector) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements || !polyglotHelpers || !connector) {
                 console.warn("updateEmbeddedChatHeader: Missing dependencies or connector.", { domElements, polyglotHelpers, connector });
                return;
            }
            if (domElements.messagesTabHeader) domElements.messagesTabHeader.textContent = `Chat with ${polyglotHelpers.sanitizeTextForDisplay(connector.profileName || connector.name)}`;

            if (domElements.embeddedMessageAttachBtn) {
                let isTutorInAnyLanguage = false;
                if (connector.languageRoles) {
                    for (const lang in connector.languageRoles) {
                        // Check if languageRoles[lang] is an array and includes 'tutor'
                        if (Array.isArray(connector.languageRoles[lang]) && connector.languageRoles[lang].includes('tutor')) {
                            isTutorInAnyLanguage = true;
                            break;
                        }
                    }
                }
                domElements.embeddedMessageAttachBtn.style.display = isTutorInAnyLanguage ? 'inline-flex' : 'none';
            }
        },
        clearEmbeddedChatInput: () => {
            const { domElements } = getDeps();
            if (domElements?.embeddedMessageTextInput) domElements.embeddedMessageTextInput.value = '';
        },
        toggleEmbeddedSendButton: (enable) => {
            const { domElements } = getDeps();
            if (domElements?.embeddedMessageSendBtn) domElements.embeddedMessageSendBtn.disabled = !enable;
        },
        clearEmbeddedChatLog: () => {
            const { domElements } = getDeps();
            if (domElements?.embeddedChatLog) domElements.embeddedChatLog.innerHTML = '';
            if (domElements?.embeddedMessageActivityArea) domElements.embeddedMessageActivityArea.style.display = 'none';
            if (domElements?.embeddedMessageActivityImage) domElements.embeddedMessageActivityImage.src = '';
        },
        appendToGroupChatLog: (text, senderName, isUser, senderId) => {
            const { domElements } = getDeps();
            let finalSenderClass = 'connector'; // Default for AI non-tutor members
            if (isUser) {
                finalSenderClass = 'user';
            } else if (senderId && window.polyglotConnectors) {
                const speakerConnector = window.polyglotConnectors.find(c => c.id === senderId);
                 // console.log("appendToGroupChatLog: speakerConnector:", speakerConnector); // Already there from your paste

                if (speakerConnector && window.groupManager && typeof window.groupManager.getCurrentGroupData === 'function') {
                    const currentGroup = window.groupManager.getCurrentGroupData();
                    // console.log("appendToGroupChatLog: currentGroup:", currentGroup); // Already there

                    // Ensure languageRoles exists, and the specific language key exists, and it's an array
                    if (currentGroup &&
                        speakerConnector.languageRoles &&
                        speakerConnector.languageRoles[currentGroup.language] &&
                        Array.isArray(speakerConnector.languageRoles[currentGroup.language]) &&
                        speakerConnector.languageRoles[currentGroup.language].includes('tutor')) {
                        finalSenderClass = 'tutor';
                    } else if (currentGroup && speakerConnector.languageRoles && !speakerConnector.languageRoles[currentGroup.language]) {
                        // console.warn(`appendToGroupChatLog: Speaker ${senderName} (${senderId}) does not have roles defined for group language '${currentGroup.language}'.`);
                    }
                }
            }
            return appendChatMessage(domElements?.groupChatLogDiv, text, finalSenderClass, { senderName: senderName });
        },
        updateGroupChatHeader: (groupName, members) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements || !polyglotHelpers) return;
            if (domElements.activeGroupNameHeader) domElements.activeGroupNameHeader.textContent = polyglotHelpers.sanitizeTextForDisplay(groupName);
            if (domElements.groupChatMembersAvatarsDiv) {
                domElements.groupChatMembersAvatarsDiv.innerHTML = '';
                (members || []).slice(0, 5).forEach(member => {
                    if (!member) return;
                    const img = document.createElement('img');
                    img.src = member.avatarModern || 'images/placeholder_avatar.png';
                    img.alt = polyglotHelpers.sanitizeTextForDisplay(member.profileName || 'Member');
                    img.title = polyglotHelpers.sanitizeTextForDisplay(member.profileName || 'Member');
                    img.className = 'member-avatar-small';
                    domElements.groupChatMembersAvatarsDiv.appendChild(img);
                });
                if (members && members.length > 5) {
                    const moreSpan = document.createElement('span');
                    moreSpan.className = 'member-avatar-small more-members';
                    moreSpan.textContent = `+${members.length - 5}`;
                    domElements.groupChatMembersAvatarsDiv.appendChild(moreSpan);
                }
            }
        },
        setGroupTypingIndicatorText: (text) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (domElements?.groupTypingIndicator && polyglotHelpers) {
                domElements.groupTypingIndicator.textContent = polyglotHelpers.sanitizeTextForDisplay(text || '');
                domElements.groupTypingIndicator.style.display = text ? 'block' : 'none';
            }
        },
        clearGroupChatInput: () => {
            const { domElements } = getDeps();
            if (domElements?.groupChatInput) domElements.groupChatInput.value = '';
        },
        clearGroupChatLog: () => {
            const { domElements } = getDeps();
             if (domElements?.groupChatLogDiv) domElements.groupChatLogDiv.innerHTML = '';
        },
        populateRecapModal: (recapData) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements?.sessionRecapScreen || !recapData || !polyglotHelpers) return;
            if (domElements.recapConnectorName) domElements.recapConnectorName.textContent = `With ${polyglotHelpers.sanitizeTextForDisplay(recapData.connectorName || 'your Connector')}`;
            if (domElements.recapDate) domElements.recapDate.textContent = polyglotHelpers.sanitizeTextForDisplay(recapData.date || new Date().toLocaleDateString());
            if (domElements.recapDuration) domElements.recapDuration.textContent = polyglotHelpers.sanitizeTextForDisplay(recapData.duration || 'N/A');
            populateListInRecap(domElements.recapTopicsList, recapData.topics);
            populateListInRecap(domElements.recapVocabularyList, recapData.vocabulary);
            populateListInRecap(domElements.recapFocusAreasList, recapData.focusAreas);
            domElements.sessionRecapScreen.dataset.sessionIdForDownload = recapData.sessionId || '';
        },
        displaySummaryInView: (sessionData) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements?.summaryViewContent || !domElements.summaryTabHeader || !domElements.summaryPlaceholder || !polyglotHelpers) return;
            if (!sessionData) {
                domElements.summaryTabHeader.textContent = "Learning Summary";
                domElements.summaryPlaceholder.textContent = "Select a session from the history to view its summary.";
                domElements.summaryPlaceholder.style.display = 'block';
                domElements.summaryViewContent.innerHTML = domElements.summaryPlaceholder.outerHTML;
                return;
            }
            domElements.summaryTabHeader.textContent = `Summary: ${polyglotHelpers.sanitizeTextForDisplay(sessionData.connectorName)} (${polyglotHelpers.sanitizeTextForDisplay(sessionData.date)})`;
            domElements.summaryPlaceholder.style.display = 'none';
            domElements.summaryViewContent.innerHTML = `
                <div class="recap-modal-content-embedded styled-scrollbar">
                    <p><strong>Duration:</strong> ${polyglotHelpers.sanitizeTextForDisplay(sessionData.duration || 'N/A')}</p>
                    <div class="recap-section"><h4><i class="fas fa-list-alt"></i> Topics Discussed:</h4><ul id="emb-recap-topics-view"></ul></div>
                    <div class="recap-section"><h4><i class="fas fa-book-open"></i> Key Vocabulary/Phrases:</h4><ul id="emb-recap-vocab-view"></ul></div>
                    <div class="recap-section"><h4><i class="fas fa-bullseye"></i> Areas for Your Focus:</h4><ul id="emb-recap-focus-view"></ul></div>
                    <button id="summary-view-download-btn" class="action-btn primary-btn" data-session-id="${polyglotHelpers.sanitizeTextForDisplay(sessionData.sessionId)}"><i class="fas fa-download"></i> Download This Summary</button>
                </div>
            `;
            const populateEmbList = (ulId, items) => {
                const ul = document.getElementById(ulId);
                if(ul) populateListInRecap(ul, items);
            };
            populateEmbList('emb-recap-topics-view', sessionData.topics);
            populateEmbList('emb-recap-vocab-view', sessionData.vocabulary);
            populateEmbList('emb-recap-focus-view', sessionData.focusAreas);
            const downloadBtn = document.getElementById('summary-view-download-btn');
            if (downloadBtn && window.sessionManager?.downloadTranscriptForSession) {
                const newBtn = downloadBtn.cloneNode(true); // Clone to remove old listeners
                downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);
                newBtn.addEventListener('click', () => {
                    window.sessionManager.downloadTranscriptForSession(sessionData.sessionId);
                });
            }
        },
        updateTTSToggleButtonVisual: (buttonElement, isMuted) => {
            if (buttonElement) {
                buttonElement.innerHTML = isMuted ? '<i class="fas fa-volume-mute"></i>' : '<i class="fas fa-volume-up"></i>';
                buttonElement.title = isMuted ? "AI Voice Off (Click to Enable)" : "AI Voice On (Click to Disable)";
                buttonElement.classList.toggle('active', !isMuted);
            }
        },
    };
})();
console.log("ui/ui_updater.js loaded. window.uiUpdater object defined.");