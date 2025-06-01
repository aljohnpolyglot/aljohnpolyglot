// js/core/voice_memo_handler.js
// Handles "Tap-to-Speak" voice memo functionality for chat interfaces.

window.voiceMemoHandler = (() => {
    'use strict';

    const getDeps = () => ({
        domElements: window.domElements,
        uiUpdater: window.uiUpdater,
        geminiService: window.geminiService,
        conversationManager: window.conversationManager,
        textMessageHandler: window.textMessageHandler,
        polyglotHelpers: window.polyglotHelpers,
        chatOrchestrator: window.chatOrchestrator // Added for centralized list updates
    });

    let mediaRecorder = null;
    let audioChunks = [];
    let currentRecordingInterfaceType = null; // "embedded" or "modal" (passed from chatUiManager)
    let currentRecordingButtonElement = null;
    let isRecording = false;
    let userMicStreamForMemo = null; // Separate stream for voice memos
    let isProcessingVoiceMemo = false; // Add this flag globally or within the relevant scope
    let currentMemoPlaceholderElement = null; // Temporary placeholder element for voice memo processing

    function initializeVoiceMemoControls() {
        // This function might be called by chatUiManager after it sets up its listeners,
        // or chatUiManager can directly call handleVoiceMemoButtonClick.
        // For now, let's assume chatUiManager calls handleVoiceMemoButtonClick.
        console.log("VoiceMemoHandler: Controls would be initialized if this module handled button events directly.");
    }

    // Called by chatUiManager when a mic button is clicked
    async function handleNewVoiceMemoInteraction(interfaceType, buttonElement, currentTargetId) {
        console.log(`VoiceMemoHandler: handleNewVoiceMemoInteraction for ${interfaceType}. Currently recording: ${isRecording}`);
        if (isRecording) {
            await stopRecording(buttonElement);
        } else {
            currentRecordingInterfaceType = interfaceType;
            currentRecordingButtonElement = buttonElement; // Store for UI updates
            await startRecording(buttonElement, currentTargetId);
        }
    }

    async function startRecording(buttonElement, currentChatTargetId) {
        // const { uiUpdater } = getDeps(); // uiUpdater is used via buttonElement updates
        if (isRecording) {
            console.warn("VoiceMemoHandler: startRecording called while already recording.");
            return;
        }
        console.log("VoiceMemoHandler: Attempting to start voice memo recording.");

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            console.error("VoiceMemoHandler: getUserMedia not supported!");
            alert("Your browser doesn't support audio recording.");
            return;
        }

        try {
            userMicStreamForMemo = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            console.log("VoiceMemoHandler: Microphone stream obtained for memo.");
            isRecording = true;
            audioChunks = [];

            if (buttonElement) {
                buttonElement.classList.add('recording');
                buttonElement.innerHTML = '<i class="fas fa-stop"></i>';
                buttonElement.title = "Stop Recording";
            }

            const mimeTypesToTry = ['audio/webm;codecs=opus', 'audio/ogg;codecs=opus', 'audio/mp4', 'audio/aac', 'audio/wav'];
            const supportedMimeType = mimeTypesToTry.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
            console.log("VoiceMemoHandler: Using MIME type for MediaRecorder:", supportedMimeType);

            mediaRecorder = new MediaRecorder(userMicStreamForMemo, { mimeType: supportedMimeType });

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) audioChunks.push(event.data);
            };

            mediaRecorder.onstop = async () => {
                console.log("VoiceMemoHandler: MediaRecorder onstop event.");
                isRecording = false; // Set before async to prevent re-entry
                if (userMicStreamForMemo) {
                    userMicStreamForMemo.getTracks().forEach(track => track.stop());
                    userMicStreamForMemo = null;
                }
                if (currentRecordingButtonElement) { // Use the stored button element
                    currentRecordingButtonElement.classList.remove('recording');
                    currentRecordingButtonElement.innerHTML = '<i class="fas fa-microphone"></i>';
                    currentRecordingButtonElement.title = "Send Voice Message";
                }

                if (audioChunks.length === 0) { console.warn("VoiceMemoHandler: No audio data recorded."); return; }

                const audioBlob = new Blob(audioChunks, { type: mediaRecorder.mimeType });
                audioChunks = [];

                const { uiUpdater } = getDeps(); // Get fresh deps
                const placeholderText = "[Processing voice message...]";
                if (currentRecordingInterfaceType === 'embedded' && currentChatTargetId) {
                    currentMemoPlaceholderElement = uiUpdater.appendToEmbeddedChatLog(placeholderText, 'user-thinking');
                } else if (currentRecordingInterfaceType === 'modal' && currentChatTargetId) {
                    currentMemoPlaceholderElement = uiUpdater.appendToMessageLogModal(placeholderText, 'user-thinking');
                }

                const reader = new FileReader();
                reader.readAsDataURL(audioBlob);
                reader.onloadend = async () => {
                    const base64Audio = reader.result.split(',')[1];
                    const { conversationManager } = getDeps();
                    const convoRecord = conversationManager.getConversation(currentChatTargetId);
                    if (convoRecord?.connector) {
                        await processAndSend(base64Audio, audioBlob.type, convoRecord.connector, currentRecordingInterfaceType, currentChatTargetId);
                    } else {
                        console.error("VoiceMemoHandler: Target connector not found for voice memo.", currentChatTargetId);
                    }
                };
                reader.onerror = (err) => console.error("VoiceMemoHandler: FileReader error:", err);
            };
            mediaRecorder.onerror = (err) => console.error("VoiceMemoHandler: MediaRecorder error:", err);
            mediaRecorder.start();
            console.log("VoiceMemoHandler: MediaRecorder started.");
        } catch (err) {
            console.error("VoiceMemoHandler: Error starting recording:", err);
        }
    }

    async function stopRecording(buttonElement) { // buttonElement passed for UI reset
        console.log("VoiceMemoHandler: stopRecording called. MediaRecorder state:", mediaRecorder?.state);
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop(); // Triggers onstop
        } else {
            isRecording = false;
            if (userMicStreamForMemo) {userMicStreamForMemo.getTracks().forEach(track => track.stop()); userMicStreamForMemo = null;}
            if (buttonElement) {
                buttonElement.classList.remove('recording');
                buttonElement.innerHTML = '<i class="fas fa-microphone"></i>';
                buttonElement.title = "Send Voice Message";
            }
        }
    }

    async function processAndSend(base64Audio, mimeType, connector, interfaceType, targetId) {
        if (isProcessingVoiceMemo) {
            console.warn("VoiceMemoHandler: processAndSend already in progress. Skipping duplicate call.");
            return;
        }
        isProcessingVoiceMemo = true; // Set flag to prevent duplicate calls

        try {
            const { geminiService, textMessageHandler, chatOrchestrator } = getDeps();
            console.log("VoiceMemoHandler: processAndSend for connector:", connector.id);

            const languageHint = connector.languageCode || 'en-US';
            const transcribedText = await geminiService.transcribeAudioToText(base64Audio, mimeType, languageHint);

            if (currentMemoPlaceholderElement?.remove) {
                currentMemoPlaceholderElement.remove();
                currentMemoPlaceholderElement = null;
            }

            if (!transcribedText || transcribedText.trim() === "") {
                console.warn("VoiceMemoHandler: Transcription was empty.");
                return;
            }

            // Call the appropriate method from textMessageHandler
            if (interfaceType === 'embedded') {
                await textMessageHandler.sendEmbeddedTextMessage(transcribedText, targetId);
            } else if (interfaceType === 'modal') {
                await textMessageHandler.sendModalTextMessage(transcribedText, connector);
            }

            // Centralized list update
            if (chatOrchestrator) chatOrchestrator.notifyNewActivityInConversation(targetId);
        } catch (error) {
            console.error("VoiceMemoHandler: Error in processAndSend:", error);
        } finally {
            isProcessingVoiceMemo = false; // Reset flag after processing
        }
    }

    console.log("js/core/voice_memo_handler.js loaded.");
    return {
        initializeVoiceMemoControls, // If needed to be called by chatUiManager or app.js
        handleNewVoiceMemoInteraction // Main entry point from UI event listeners
    };
})();