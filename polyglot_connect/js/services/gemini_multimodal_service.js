// js/services/gemini_multimodal_service.js
// Handles Gemini API calls involving multiple modalities (e.g., audio input, image input).

window.geminiMultimodalService = (() => {
    'use strict';

    if (!window._geminiInternalApiCaller || !window._geminiApiConstants) {
        console.error("Gemini Multimodal Service: Core API utilities not found.");
        const errorFn = async () => { throw new Error("Multimodal Service not initialized."); };
        return {
            generateTextFromAudioForCallModal: errorFn,
            generateTextFromImageAndText: errorFn,
            transcribeAudioToText: errorFn
        };
    }

    const callGeminiAPIInternal = window._geminiInternalApiCaller;
    const { MODEL_MULTIMODAL, MODEL_TEXT_RESPONSE, STANDARD_SAFETY_SETTINGS } = window._geminiApiConstants;

    async function transcribeAudioToText(base64AudioString, mimeType, languageHint = "en-US") {
        console.log(`geminiMultimodalService: transcribeAudioToText called. Lang hint: ${languageHint}, MimeType: ${mimeType}`);
        if (!base64AudioString) {
            console.error("geminiMultimodalService.transcribeAudioToText: Audio data missing.");
            throw new Error("Audio data missing for transcription.");
        }

        const transcriptionPrompt = `Transcribe the following audio. The speaker is likely speaking ${languageHint}.`;
        const contents = [{
            role: "user",
            parts: [
                { text: transcriptionPrompt },
                { inlineData: { mimeType: mimeType, data: base64AudioString } }
            ]
        }];

        const payload = {
            contents: contents,
            safetySettings: STANDARD_SAFETY_SETTINGS
        };
        console.log("geminiMultimodalService.transcribeAudioToText: Payload:", JSON.stringify(payload).substring(0, 300) + "...");

        try {
            const transcription = await callGeminiAPIInternal(payload, MODEL_MULTIMODAL, "generateContent");
            console.log("geminiMultimodalService: Transcription API call successful. Result:", transcription);
            if (typeof transcription !== 'string') {
                console.warn("geminiMultimodalService: Transcription result was not a string:", transcription);
                return ""; // Return empty string for non-string results
            }
            return transcription;
        } catch (error) {
            console.error(`geminiMultimodalService.transcribeAudioToText Error:`, error.message, error);
            throw error;
        }
    }

    async function generateTextFromAudioForCallModal(base64AudioString, mimeType, connector, modalCallHistory) {
        console.log("geminiMultimodalService: generateTextFromAudioForCallModal called.");
        if (!connector) throw new Error("Connector info missing for audio call modal.");
        if (!base64AudioString) throw new Error("Audio data missing for audio call modal.");

        let lastConnectorText = modalCallHistory.filter(t => t.sender === 'connector' && typeof t.text === 'string' && t.text.trim() !== "").pop()?.text || 'This is the start of our conversation.';
        const systemPrompt = `You are ${connector.profileName}, a ${connector.modernTitle}. You are in a voice call. The user has just SPOKEN (audio provided). Transcribe their speech if necessary, then respond naturally ONLY in ${connector.language}. Keep your response conversational and concise (1-3 sentences). Do not mention being an AI or that input was audio. Your last line was: "${lastConnectorText}". Now, process the user's audio:`;

        let contents = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: `Okay, I am ${connector.profileName}. I'm listening and will respond in ${connector.language}.` }] }
        ];
        const MAX_TEXT_HISTORY_WITH_MODAL_AUDIO = 3;
        const recentTextTurns = modalCallHistory.filter(t => typeof t.text === 'string').slice(-(MAX_TEXT_HISTORY_WITH_MODAL_AUDIO * 2));
        recentTextTurns.forEach(turn => {
            contents.push({ role: turn.sender.startsWith('user') ? 'user' : 'model', parts: [{ text: turn.text }] });
        });
        contents.push({ role: "user", parts: [{ inlineData: { mimeType: mimeType, data: base64AudioString } }] });

        const payload = { contents: contents, safetySettings: STANDARD_SAFETY_SETTINGS };
        console.log("geminiMultimodalService.generateTextFromAudioForCallModal: Payload:", JSON.stringify(payload).substring(0, 300) + "...");

        try {
            const response = await callGeminiAPIInternal(payload, MODEL_MULTIMODAL, "generateContent");
            console.log("geminiMultimodalService: Audio processing successful. Response:", response);
            return response;
        } catch (error) {
            console.error(`geminiMultimodalService.generateTextFromAudioForCallModal Error for ${connector.profileName}:`, error);
            return `(Audio Processing Error during call: ${error.message.substring(0, 30)}...)`;
        }
    }

    async function generateTextFromImageAndText(base64ImageString, mimeType, connector, existingGeminiHistory, optionalUserText) {
        console.log("geminiMultimodalService: generateTextFromImageAndText called.");
        if (!connector) throw new Error("Connector info missing for image chat.");
        if (!base64ImageString) throw new Error("Image data missing for image chat.");

        const userQueryText = optionalUserText || `User sent this image. Please describe it or ask a question about it in ${connector.language}.`;
        let currentHistoryForThisCall = [...existingGeminiHistory];
        const userImagePromptParts = [{ text: userQueryText }, { inlineData: { mimeType: mimeType, data: base64ImageString } }];
        currentHistoryForThisCall.push({ role: "user", parts: userImagePromptParts });

        const payload = { contents: currentHistoryForThisCall, safetySettings: STANDARD_SAFETY_SETTINGS };
        console.log("geminiMultimodalService.generateTextFromImageAndText: Payload:", JSON.stringify(payload).substring(0, 300) + "...");

        try {
            const response = await callGeminiAPIInternal(payload, MODEL_MULTIMODAL, "generateContent");
            console.log("geminiMultimodalService: Image processing successful. Response:", response);
            return response;
        } catch (error) {
            console.error(`geminiMultimodalService.generateTextFromImageAndText Error for ${connector.profileName}:`, error);
            return `(I had trouble with the image: ${error.message.substring(0, 30)}...)`;
        }
    }

    console.log("services/gemini_multimodal_service.js loaded (with debugging logs).");
    return {
        generateTextFromAudioForCallModal,
        generateTextFromImageAndText,
        transcribeAudioToText
    };
})();