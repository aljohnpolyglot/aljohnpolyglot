// js/services/ai_text_generation_service.js
window.aiTextGenerationService = (() => {
    'use strict';

    // Check dependencies and API keys
    if (!window._geminiInternalApiCaller || !window._openaiCompatibleApiCaller || !window._aiApiConstants) {
        console.error("AI Text Generation Service: Core API callers or constants not found.");
        const errorFn = async () => { throw new Error("Text Generation Service not properly initialized."); };
        return { 
            generateTextMessage: errorFn, 
            generateTextFromImageAndTextOpenAI: errorFn, 
            generateTextForGeminiCallModal: errorFn 
        };
    }

    const callGeminiAPIInternal = window._geminiInternalApiCaller;
    const callOpenAICompatibleAPI = window._openaiCompatibleApiCaller;
    const { PROVIDERS, GEMINI_MODELS, GROQ_MODELS, TOGETHER_MODELS, STANDARD_SAFETY_SETTINGS_GEMINI } = window._aiApiConstants;

    // Helper function for converting history formats
    function convertGeminiHistoryToOpenAIMessages(geminiHistory, systemPromptText = null) {
        const messages = [];
        if (systemPromptText) {
            messages.push({ role: "system", content: systemPromptText });
        }

        const startIndex = systemPromptText ? 1 : 0;

        for (let i = startIndex; i < geminiHistory.length; i++) {
            const turn = geminiHistory[i];
            let role = turn.role;
            if (role === "model") {
                role = "assistant";
            } else if (role === "user" && messages.length === 0 && 
                      turn.parts[0]?.text?.toLowerCase().includes("you are ")) {
                role = "system";
            }
            messages.push({ 
                role: role, 
                content: turn.parts[0]?.text || "" 
            });
        }
        return messages;
    }

    // Main text generation with fallbacks
    async function generateTextMessage(userText, connector, existingGeminiHistory, provider = PROVIDERS.GROQ) {
        let currentProvider = provider;
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
            attempts++;
            try {
                if (currentProvider === PROVIDERS.GROQ) {
                    if (!window.GROQ_API_KEY) throw new Error("Groq API key not configured");
                    const messages = convertGeminiHistoryToOpenAIMessages(existingGeminiHistory);
                    return await callOpenAICompatibleAPI(
                        messages,
                        GROQ_MODELS.TEXT_CHAT,
                        PROVIDERS.GROQ,
                        window.GROQ_API_KEY,
                        { temperature: 0.7 }
                    );
                } else if (currentProvider === PROVIDERS.TOGETHER) {
                    if (!window.TOGETHER_API_KEY) throw new Error("Together AI key not configured");
                    const messages = convertGeminiHistoryToOpenAIMessages(existingGeminiHistory);
                    return await callOpenAICompatibleAPI(
                        messages,
                        TOGETHER_MODELS.TEXT_CHAT,
                        PROVIDERS.TOGETHER,
                        window.TOGETHER_API_KEY,
                        { temperature: 0.7 }
                    );
                } else if (currentProvider === PROVIDERS.GEMINI) {
                    // Gemini caller handles its own keys
                    return await callGeminiAPIInternal(geminiPayload, GEMINI_MODELS.TEXT, "generateContent");
                }
            } catch (error) {
                console.warn(`Provider ${currentProvider} failed. Attempt ${attempts}/${maxAttempts}. Error: ${error.message}`);
                
                if (currentProvider === PROVIDERS.GROQ) {
                    currentProvider = PROVIDERS.TOGETHER;
                } else if (currentProvider === PROVIDERS.TOGETHER) {
                    currentProvider = PROVIDERS.GEMINI;
                } else if (attempts >= maxAttempts) {
                    console.error("All providers failed. Last error:", error);
                    return `(I'm currently unable to connect. Please try again shortly.)`;
                }
            }
        }
        return `(Text generation failed after multiple attempts.)`;
    }

    // Image and text processing function
    async function generateTextFromImageAndTextOpenAI(
        base64ImageString, 
        mimeType, 
        connector, 
        existingGeminiHistory, 
        textPrompt,
        provider = PROVIDERS.TOGETHER // Default provider, no API key needed
    ) {
        if (!window.TOGETHER_API_KEY) throw new Error("Together AI key not configured");
        if (!connector) throw new Error("Connector info missing.");
        if (!base64ImageString) throw new Error("Base64 image string missing.");
        if (!textPrompt) throw new Error("Text prompt missing.");

        const messages = convertGeminiHistoryToOpenAIMessages(
            existingGeminiHistory, 
            existingGeminiHistory[0]?.parts[0]?.text
        );
        
        messages.push({
            role: "user",
            content: [
                { type: "text", text: textPrompt },
                { 
                    type: "image_url", 
                    image_url: { url: `data:${mimeType};base64,${base64ImageString}` } 
                }
            ]
        });

        return await callOpenAICompatibleAPI(
            messages,
            TOGETHER_MODELS.VISION,
            provider,
            window.TOGETHER_API_KEY,
            { temperature: 0.5, max_tokens: 512 }
        );
    }

    // --- Gemini-Specific Text Generation for Call Modal ---
    async function generateTextForGeminiCallModal(userText, connector, modalCallHistory) {
        if (!connector || !connector.language || !connector.profileName) {
            throw new Error("Connector info (language, profileName) missing for generateTextForCallModal.");
        }
        if (userText === undefined || userText === null) throw new Error("User text missing for generateTextForCallModal.");

        // System prompt specific to the call modal context
        const systemPrompt = `You are ${connector.profileName}, a ${connector.modernTitle || 'language partner'} from ${connector.city}. You are in a voice call with a user practicing ${connector.language}. The user has just TYPED the following text to you. Respond ONLY in ${connector.language}, keeping it brief and natural for a call. Maintain your persona. DO NOT mention being an AI.`;

        const contents = [
            { role: "user", parts: [{ text: systemPrompt }] },
            { role: "model", parts: [{ text: `Okay, I am ${connector.profileName}. I'll respond to the user's typed message in ${connector.language}.` }] }
        ];
        // Add recent modalCallHistory (this history is specific to the call modal, not general chat history)
        modalCallHistory.slice(-10).forEach(turn => { // Max 5 pairs of turns
            contents.push({
                role: turn.sender.startsWith('user') ? 'user' : 'model',
                parts: [{ text: typeof turn.text === 'string' ? turn.text : "[interaction segment]" }]
            });
        });
        contents.push({ role: "user", parts: [{ text: userText }] });

        const payload = {
            contents: contents,
            safetySettings: STANDARD_SAFETY_SETTINGS_GEMINI,
            generationConfig: { temperature: 0.7 }
        };

        try {
            console.log(`aiTextGenerationService: Requesting text for Gemini Call Modal for connector '${connector.id}'`);
            return await callGeminiAPIInternal(payload, GEMINI_MODELS.TEXT, "generateContent");
        } catch (error) {
            console.error(`aiTextGenerationService.generateTextForCallModal Error for ${connector.profileName}:`, error.message);
            return `(Text input error during call: ${error.message.substring(0, 30)}...)`;
        }
    }

    console.log("services/ai_text_generation_service.js loaded (with API key handling).");
    return {
        generateTextMessage,
        generateTextFromImageAndTextOpenAI,
        generateTextForGeminiCallModal
    };
})();