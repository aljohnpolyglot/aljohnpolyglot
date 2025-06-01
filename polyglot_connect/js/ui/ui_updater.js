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

        let contentHtml = '';
        if (options.senderName && senderClass !== 'user' && senderClass !== 'user-audio' && !senderClass.includes('system')) { // Don't show senderName for user or system
            contentHtml += `<strong>${polyglotHelpers.sanitizeTextForDisplay(options.senderName)}:</strong> `;
        }
        if (text) { // Process and add text
            let processedText = polyglotHelpers.sanitizeTextForDisplay(text);
            // Basic markdown-like replacements (ensure this is what you want, can interfere if text legitimately contains * or **)
            // Consider using a more robust markdown parser if complex markdown is needed.
            processedText = processedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
            contentHtml += processedText;
        }

        // Handle imageUrl
        if (options.imageUrl) {
            if (text) contentHtml += '<br>'; // Add a break if there's text before the image
            contentHtml += `<img src="${polyglotHelpers.sanitizeTextForDisplay(options.imageUrl)}" alt="Chat Image" style="max-width: 100%; height: auto; border-radius: 8px; margin-top: 5px;">`;
        }

        messageDiv.innerHTML = contentHtml;

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

    const populateListInRecap = (ulElement, itemsArray, itemType = 'simple') => {
        const { polyglotHelpers } = getDeps();
        if (!ulElement || !polyglotHelpers) {
            console.warn("populateListInRecap: Missing ulElement or polyglotHelpers");
            return;
        }
        ulElement.innerHTML = ''; // Clear previous items

        if (itemsArray && itemsArray.length > 0) {
            itemsArray.forEach(itemData => {
                const li = document.createElement('li');
                if (itemType === 'simple' && typeof itemData === 'string') {
                    li.innerHTML = `<i class="fas fa-check-circle recap-item-icon"></i> ${polyglotHelpers.sanitizeTextForDisplay(itemData)}`;
                } else if (itemType === 'vocabulary' && typeof itemData === 'object' && itemData.term) {
                    let vocabHtml = `<i class="fas fa-book-open recap-item-icon"></i> <strong>${polyglotHelpers.sanitizeTextForDisplay(itemData.term)}</strong>`;
                    if (itemData.translation) {
                        vocabHtml += `: ${polyglotHelpers.sanitizeTextForDisplay(itemData.translation)}`;
                    }
                    if (itemData.exampleSentence) {
                        vocabHtml += `<br><em class="recap-example">E.g.: "${polyglotHelpers.sanitizeTextForDisplay(itemData.exampleSentence)}"</em>`;
                    }
                    li.innerHTML = vocabHtml;
                } else if (itemType === 'improvementArea' && typeof itemData === 'object' && itemData.areaType) {
                    let improvementHtml = `<div class="improvement-item">`;
                    improvementHtml += `<i class="fas fa-pencil-alt recap-item-icon"></i> <strong>${polyglotHelpers.sanitizeTextForDisplay(itemData.areaType)}:</strong>`;
                    if (itemData.userInputExample) {
                        improvementHtml += `<div class="recap-user-input">You said: "<em>${polyglotHelpers.sanitizeTextForDisplay(itemData.userInputExample)}</em>"</div>`;
                    }
                    if (itemData.coachSuggestion) {
                        improvementHtml += `<div class="recap-coach-suggestion">Suggestion: "<strong>${polyglotHelpers.sanitizeTextForDisplay(itemData.coachSuggestion)}</strong>"</div>`;
                    }
                    if (itemData.explanation) {
                        improvementHtml += `<div class="recap-explanation">Why: ${polyglotHelpers.sanitizeTextForDisplay(itemData.explanation)}</div>`;
                    }
                    if (itemData.exampleWithSuggestion) {
                        improvementHtml += `<div class="recap-example">Example: "<em>${polyglotHelpers.sanitizeTextForDisplay(itemData.exampleWithSuggestion)}</em>"</div>`;
                    }
                    improvementHtml += `</div>`;
                    li.innerHTML = improvementHtml;
                    li.classList.add('improvement-list-item'); // For distinct styling
                } else {
                    li.textContent = typeof itemData === 'string' ? itemData : JSON.stringify(itemData);
                }
                ulElement.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = itemType === 'improvementArea' ? 'No specific areas for improvement noted this time. Great job!' : 'None noted.';
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
            if (domElements.voiceChatSendTextBtn) domElements.voiceChatSendTextBtn.style.display = 'none'; // Assuming this button exists
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
            let buttonText = '';
            switch(state) {
                case 'listening':
                    btn.classList.add('listening', 'mic-active');
                    buttonText = polyglotHelpers.sanitizeTextForDisplay(text) || 'Listening...';
                    btn.innerHTML = `<i class="fas fa-stop"></i> ${buttonText}`;
                    btn.title = "Tap to Stop Recording";
                    break;
                case 'processing':
                    btn.classList.add('processing');
                    buttonText = polyglotHelpers.sanitizeTextForDisplay(text) || 'Processing...';
                    btn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${buttonText}`;
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
                let isTutorInPrimary = connector.languageRoles &&
                                    connector.languageRoles[connector.language] && // Assuming connector.language is the primary/active language
                                    Array.isArray(connector.languageRoles[connector.language]) &&
                                    connector.languageRoles[connector.language].includes('tutor');

                domElements.directCallActivityBtn.style.display = isTutorInPrimary && connector.tutorMinigameImageFiles?.length > 0 ? 'inline-flex' : 'none';
            }
        },
        updateDirectCallStatus: (statusText, isError = false) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (domElements?.directCallStatusIndicator && polyglotHelpers) {
                domElements.directCallStatusIndicator.textContent = polyglotHelpers.sanitizeTextForDisplay(statusText);
                domElements.directCallStatusIndicator.style.color = isError ? 'var(--danger-color)' : 'inherit'; // Make sure --danger-color is defined in CSS
            }
        },
        updateDirectCallMicButtonVisual: (isMuted) => {
            const { domElements } = getDeps();
            if (domElements?.directCallMuteBtn) {
                domElements.directCallMuteBtn.classList.toggle('mic-active', !isMuted); // Active when NOT muted
                domElements.directCallMuteBtn.innerHTML = isMuted ? '<i class="fas fa-microphone-slash"></i>' : '<i class="fas fa-microphone"></i>';
                domElements.directCallMuteBtn.title = isMuted ? "Mic Off (Click to Unmute & Record)" : "Mic On (Click to Mute & Send)";
            }
        },

        updateDirectCallSpeakerButtonVisual: (isMuted) => {
            const { domElements } = getDeps();
            if(domElements?.directCallSpeakerToggleBtn) {
                domElements.directCallSpeakerToggleBtn.classList.toggle('speaker-active', !isMuted); // Active when NOT muted
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
            if (!domElements || !polyglotHelpers || !connector) {
                console.warn("uiUpdater: updateMessageModalHeader - Missing deps or connector.");
                return;
            }

            if (domElements.messageModalHeaderAvatar) {
                domElements.messageModalHeaderAvatar.src = connector.avatarModern || 'images/placeholder_avatar.png';
                domElements.messageModalHeaderAvatar.alt = connector.profileName || 'Partner';
            }
            if (domElements.messageModalHeaderName) {
                domElements.messageModalHeaderName.textContent = polyglotHelpers.sanitizeTextForDisplay(connector.profileName || connector.name || 'Chat Partner');
            }
            if (domElements.messageModalHeaderDetails) {
                const ageText = connector.age && connector.age !== "N/A" ? `${connector.age} yrs` : '';
                const locationText = connector.city && connector.country ?
                    `${polyglotHelpers.sanitizeTextForDisplay(connector.city)}, ${polyglotHelpers.sanitizeTextForDisplay(connector.country)}` :
                    (connector.country ? polyglotHelpers.sanitizeTextForDisplay(connector.country) : '');
                let details = locationText;
                if (ageText && locationText) details += ` | ${ageText}`;
                else if (ageText) details = ageText;
                domElements.messageModalHeaderDetails.textContent = details || "Details unavailable";
                domElements.messageModalHeaderDetails.style.display = details ? 'block' : 'none';
            }

            if (domElements.messagingInterface) { // This is the modal itself
                domElements.messagingInterface.dataset.currentConnectorId = connector.id;
            }

            // Ensure buttons are displayed if they exist
            if (domElements.messageModalCallBtn) domElements.messageModalCallBtn.style.display = 'inline-flex';
            if (domElements.messageModalInfoBtn) domElements.messageModalInfoBtn.style.display = 'inline-flex';
        },
        resetMessageModalInput: () => {
            const { domElements } = getDeps();
            if (domElements?.messageTextInput) domElements.messageTextInput.value = '';
            if (domElements?.messageSendBtn) domElements.messageSendBtn.disabled = false; // Re-enable send button
        },
        clearMessageModalLog: () => {
            const { domElements } = getDeps();
            if (domElements?.messageChatLog) domElements.messageChatLog.innerHTML = '';
            if (domElements?.messageActivityArea) domElements.messageActivityArea.style.display = 'none';
            if (domElements?.messageActivityImageDisplay) domElements.messageActivityImageDisplay.src = '';
        },
        // EMBEDDED CHAT UI (typically in #messages-view)
        appendToEmbeddedChatLog: (text, senderClass, options = {}) => {
            const { domElements } = getDeps();
            return appendChatMessage(domElements?.embeddedChatLog, text, senderClass, options);
        },
        showImageInEmbeddedChat: (imageUrl) => {
            const { domElements } = getDeps();
            // Assuming embedded chat might not have a dedicated activity area but shows images inline or in log
            // For now, let's assume it might use one if defined.
            showImageInActivityArea(domElements?.embeddedMessageActivityArea, domElements?.embeddedMessageActivityImage, domElements?.embeddedChatLog, imageUrl);
        },
        updateEmbeddedChatHeader: (connector) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements || !polyglotHelpers || !connector) {
                console.warn("uiUpdater: updateEmbeddedChatHeader - Missing deps or connector.");
                return;
            }

            // Update avatar, name, and details
            if (domElements.embeddedChatHeaderAvatar) {
                domElements.embeddedChatHeaderAvatar.src = connector.avatarModern || 'images/placeholder_avatar.png';
                domElements.embeddedChatHeaderAvatar.alt = polyglotHelpers.sanitizeTextForDisplay(connector.profileName || 'Partner');
            }
            if (domElements.embeddedChatHeaderName) {
                domElements.embeddedChatHeaderName.textContent = polyglotHelpers.sanitizeTextForDisplay(connector.profileName || connector.name || 'Chat Partner');
            }
            if (domElements.embeddedChatHeaderDetails) {
                const ageText = connector.age && connector.age !== "N/A" ? `${connector.age} yrs` : '';
                const locationText = connector.city && connector.country
                    ? `${polyglotHelpers.sanitizeTextForDisplay(connector.city)}, ${polyglotHelpers.sanitizeTextForDisplay(connector.country)}`
                    : (connector.country ? polyglotHelpers.sanitizeTextForDisplay(connector.country) : '');
                let details = locationText;
                if (ageText && locationText) details += ` | ${ageText}`;
                else if (ageText) details = ageText;
                domElements.embeddedChatHeaderDetails.textContent = details || "Details unavailable";
                domElements.embeddedChatHeaderDetails.style.display = details ? 'block' : 'none';
            }

            if (domElements.embeddedChatContainer) {
                domElements.embeddedChatContainer.dataset.currentConnectorId = connector.id;
            }

            // Always show the attach button if the button element exists and a connector is present
            if (domElements.embeddedMessageAttachBtn) {
                domElements.embeddedMessageAttachBtn.style.display = connector ? 'inline-flex' : 'none';
                domElements.embeddedMessageAttachBtn.title = "Send Image"; // General title
            } else {
                console.warn("uiUpdater: domElements.embeddedMessageAttachBtn not found during header update.");
            }

            // Ensure visibility of call and info buttons
            if (domElements.embeddedChatCallBtn) domElements.embeddedChatCallBtn.style.display = 'inline-flex';
            if (domElements.embeddedChatInfoBtn) domElements.embeddedChatInfoBtn.style.display = 'inline-flex';
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

        // GROUP CHAT UI
        appendToGroupChatLog: (text, senderName, isUser, senderId) => {
            const { domElements, polyglotHelpers } = getDeps(); // Added polyglotHelpers
            let finalSenderClass = 'connector'; // Default for AI non-tutor members

            if (isUser) {
                finalSenderClass = 'user';
            } else if (senderId && window.polyglotConnectors && window.groupManager) {
                const speakerConnector = window.polyglotConnectors.find(c => c.id === senderId);
                const currentGroup = window.groupManager.getCurrentGroupData();

                if (speakerConnector && currentGroup &&
                    speakerConnector.languageRoles &&
                    speakerConnector.languageRoles[currentGroup.language] &&
                    Array.isArray(speakerConnector.languageRoles[currentGroup.language]) &&
                    speakerConnector.languageRoles[currentGroup.language].includes('tutor')) {
                    finalSenderClass = 'tutor';
                } else if (currentGroup && speakerConnector && speakerConnector.languageRoles && !speakerConnector.languageRoles[currentGroup.language]) {
                    // console.warn(`appendToGroupChatLog: Speaker ${senderName} (${senderId}) does not have roles defined for group language '${currentGroup.language}'. Classed as 'connector'.`);
                } else if (!speakerConnector) {
                    // console.warn(`appendToGroupChatLog: Speaker connector not found for ID ${senderId}. Classed as 'connector'.`);
                }
            }
             // Pass senderName to options for appendChatMessage
            return appendChatMessage(domElements?.groupChatLogDiv, text, finalSenderClass, { senderName: polyglotHelpers.sanitizeTextForDisplay(senderName) });
        },
        updateGroupChatHeader: (groupName, members) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements || !polyglotHelpers) return;
            if (domElements.activeGroupNameHeader) domElements.activeGroupNameHeader.textContent = polyglotHelpers.sanitizeTextForDisplay(groupName);
            if (domElements.groupChatMembersAvatarsDiv) {
                domElements.groupChatMembersAvatarsDiv.innerHTML = ''; // Clear previous avatars
                (members || []).slice(0, 5).forEach(member => { // Show max 5 avatars
                    if (!member) return; // Skip if member is undefined
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

        // RECAP & SUMMARY
        populateRecapModal: (recapData) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements?.sessionRecapScreen || !recapData || !polyglotHelpers) {
                console.warn("uiUpdater.populateRecapModal: Missing dependencies or recapData.");
                return;
            }

            if (domElements.recapConnectorName) domElements.recapConnectorName.textContent = `With ${polyglotHelpers.sanitizeTextForDisplay(recapData.connectorName || 'your Partner')}`;
            if (domElements.recapDate) domElements.recapDate.textContent = polyglotHelpers.sanitizeTextForDisplay(recapData.date || new Date().toLocaleDateString());
            if (domElements.recapDuration) domElements.recapDuration.textContent = polyglotHelpers.sanitizeTextForDisplay(recapData.duration || 'N/A');

            const recapSummaryEl = domElements.sessionRecapScreen.querySelector('#recap-conversation-summary-text');
            if (recapSummaryEl) {
                recapSummaryEl.textContent = polyglotHelpers.sanitizeTextForDisplay(recapData.conversationSummary || "No summary available.");
            }

            populateListInRecap(domElements.recapTopicsList, recapData.keyTopicsDiscussed, 'simple');
            populateListInRecap(domElements.recapVocabularyList, recapData.newVocabularyAndPhrases, 'vocabulary');
            populateListInRecap(domElements.recapFocusAreasList, recapData.areasForImprovement, 'improvementArea');

            const recapGoodUsageEl = domElements.sessionRecapScreen.querySelector('#recap-good-usage-list');
            if (recapGoodUsageEl) {
                populateListInRecap(recapGoodUsageEl, recapData.goodUsageHighlights, 'simple');
            }

            const recapPracticeEl = domElements.sessionRecapScreen.querySelector('#recap-practice-activities-list');
            if (recapPracticeEl) {
                populateListInRecap(recapPracticeEl, recapData.suggestedPracticeActivities, 'simple');
            }

            const recapEncouragementEl = domElements.sessionRecapScreen.querySelector('#recap-overall-encouragement-text');
            if (recapEncouragementEl) {
                recapEncouragementEl.textContent = polyglotHelpers.sanitizeTextForDisplay(recapData.overallEncouragement || "Keep practicing!");
            }

            domElements.sessionRecapScreen.dataset.sessionIdForDownload = recapData.sessionId || '';
        },

        displaySummaryInView: (sessionData) => {
            const { domElements, polyglotHelpers } = getDeps();
            if (!domElements?.summaryViewContent || !domElements.summaryTabHeader || !domElements.summaryPlaceholder || !polyglotHelpers) {
                console.warn("uiUpdater.displaySummaryInView: Missing critical DOM elements.");
                return;
            }

            if (!sessionData) {
                domElements.summaryTabHeader.textContent = "Learning Summary";
                domElements.summaryPlaceholder.innerHTML = "Select a session from the history on the right to view its detailed debrief.";
                domElements.summaryPlaceholder.style.display = 'block';
                domElements.summaryViewContent.innerHTML = '';
                domElements.summaryViewContent.appendChild(domElements.summaryPlaceholder);
                return;
            }

            domElements.summaryTabHeader.textContent = `Summary: ${polyglotHelpers.sanitizeTextForDisplay(sessionData.connectorName)} (${polyglotHelpers.sanitizeTextForDisplay(sessionData.date)})`;
            domElements.summaryPlaceholder.style.display = 'none';

            let summaryHtml = `<div class="recap-modal-content-embedded styled-scrollbar">`;
            summaryHtml += `<p><strong>Duration:</strong> ${polyglotHelpers.sanitizeTextForDisplay(sessionData.duration || 'N/A')}</p>`;

            if (sessionData.conversationSummary) {
                summaryHtml += `<div class="recap-section"><h4><i class="fas fa-info-circle"></i> Conversation Overview:</h4><p id="emb-recap-summary-text">${polyglotHelpers.sanitizeTextForDisplay(sessionData.conversationSummary)}</p></div>`;
            }

            summaryHtml += `<div class="recap-section"><h4><i class="fas fa-list-alt"></i> Key Topics Discussed:</h4><ul id="emb-recap-topics-view"></ul></div>`;
            
            if (sessionData.goodUsageHighlights && sessionData.goodUsageHighlights.length > 0) {
                summaryHtml += `<div class="recap-section"><h4><i class="fas fa-thumbs-up"></i> Well Done! (Highlights):</h4><ul id="emb-recap-good-usage-view"></ul></div>`;
            }
            
            summaryHtml += `<div class="recap-section"><h4><i class="fas fa-book-open"></i> New Vocabulary/Phrases:</h4><ul id="emb-recap-vocab-view"></ul></div>`;
            summaryHtml += `<div class="recap-section"><h4><i class="fas fa-pencil-ruler"></i> Areas for Improvement:</h4><ul id="emb-recap-focus-view"></ul></div>`;

            if (sessionData.suggestedPracticeActivities && sessionData.suggestedPracticeActivities.length > 0) {
                 summaryHtml += `<div class="recap-section"><h4><i class="fas fa-dumbbell"></i> Suggested Practice:</h4><ul id="emb-recap-practice-view"></ul></div>`;
            }

            if (sessionData.overallEncouragement) {
                summaryHtml += `<div class="recap-section"><h4><i class="fas fa-comment-dots"></i> Coach's Note:</h4><p id="emb-recap-encouragement-text">${polyglotHelpers.sanitizeTextForDisplay(sessionData.overallEncouragement)}</p></div>`;
            }

            summaryHtml += `<button id="summary-view-download-btn" class="action-btn primary-btn" data-session-id="${polyglotHelpers.sanitizeTextForDisplay(sessionData.sessionId)}"><i class="fas fa-download"></i> Download This Summary</button>`;
            summaryHtml += `</div>`;

            domElements.summaryViewContent.innerHTML = summaryHtml;

            populateListInRecap(document.getElementById('emb-recap-topics-view'), sessionData.keyTopicsDiscussed, 'simple');
            populateListInRecap(document.getElementById('emb-recap-good-usage-view'), sessionData.goodUsageHighlights, 'simple');
            populateListInRecap(document.getElementById('emb-recap-vocab-view'), sessionData.newVocabularyAndPhrases, 'vocabulary');
            populateListInRecap(document.getElementById('emb-recap-focus-view'), sessionData.areasForImprovement, 'improvementArea');
            populateListInRecap(document.getElementById('emb-recap-practice-view'), sessionData.suggestedPracticeActivities, 'simple');

            const downloadBtn = document.getElementById('summary-view-download-btn');
            if (downloadBtn && window.sessionManager?.downloadTranscriptForSession) {
                const newBtn = downloadBtn.cloneNode(true);
                downloadBtn.parentNode.replaceChild(newBtn, downloadBtn);
                newBtn.addEventListener('click', () => {
                    console.log("Download Transcript Button (Summary View) CLICKED! Session ID:", sessionData.sessionId);
                    window.sessionManager.downloadTranscriptForSession(sessionData.sessionId);
                });
            } else if (!downloadBtn) {
                console.warn("uiUpdater: displaySummaryInView - summary-view-download-btn not found post-injection.");
            } else if (!window.sessionManager?.downloadTranscriptForSession) {
                console.warn("uiUpdater: displaySummaryInView - window.sessionManager.downloadTranscriptForSession not found.");
            }
        }
    };
})();
console.log("ui/ui_updater.js loaded and updated for elaborate recap structure.");