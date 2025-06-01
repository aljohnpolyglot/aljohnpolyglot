// js/services/gemini_tts_service.js
// Handles Text-to-Speech API calls to Gemini using the new generateContent method.

window.geminiTtsService = (() => {
    'use strict';

    // Ensure core API utilities are loaded
    if (!window._geminiInternalApiCaller || !window._geminiApiConstants) {
        console.error("Gemini TTS Service: Core Gemini API utilities not found.");
        // Return a non-functional object or throw an error to halt if critical
        return {
            getTTSAudio: async () => {
                throw new Error("TTS Service not initialized due to missing core API utilities.");
            }
        };
    }

    const callGeminiAPIInternal = window._geminiInternalApiCaller;
    const { MODEL_TTS_GENERATE_CONTENT } = window._geminiApiConstants;

    async function getTTSAudio(textToSpeak, languageCode, geminiVoiceName = null, stylePrompt = null) {
        if (!textToSpeak) {
            console.error("geminiTtsService.getTTSAudio: Text to speak is required.");
            throw new Error("Text to speak is required for TTS.");
        }
        if (!geminiVoiceName) {
            console.warn("geminiTtsService.getTTSAudio: geminiVoiceName not provided. Default voice will be used.");
        }

        let fullContent = textToSpeak;
        if (stylePrompt) {
            fullContent = `${stylePrompt.trim()} ${textToSpeak}`;
        }

     const restPayload = {
   contents: [{parts: [{text: fullContent}]}],
   config: {
     response_modalities: ["AUDIO"],
     speech_config: {
       voice_config: {
         prebuilt_voice_config: {
           voice_name: geminiVoiceName || 'Puck'
         },
         language_code: languageCode // <<<< ADD THIS LINE (use the languageCode param)
       }
       // audio_config: { sample_rate_hertz: 24000 }
     }
   }
};
        // Log the exact payload being sent to the API
        console.log("GEMINI_TTS_SERVICE: Final payload being sent to API:", JSON.stringify(restPayload, null, 2));

        try {
            console.log(`geminiTtsService: Requesting NEW TTS. Voice: '${geminiVoiceName || 'Puck (default)'}', Lang: '${languageCode}', Style: '${stylePrompt || 'none'}'`);
            return await callGeminiAPIInternal(restPayload, MODEL_TTS_GENERATE_CONTENT, "generateContentAudio");
        } catch (error) {
            console.error(`geminiTtsService.getTTSAudio Error for lang ${languageCode}, voice ${geminiVoiceName}:`, error.message, error);
            throw error;
        }
    }

    console.log("services/gemini_tts_service.js loaded (new TTS method).");
    return {
        getTTSAudio
    };
})();