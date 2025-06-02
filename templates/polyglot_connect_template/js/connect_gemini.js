// js/connect_gemini.js

const GEMINI_API_KEY = "AIzaSyDfJspAjl93a5PnPENic7AG8yRT9vwRjh4"; // IMPORTANT: REPLACE WITH YOUR ACTUAL KEY
const GEMINI_API_URL_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";

// Model strategy (as discussed, prioritize free tier for features)
const GEMINI_MODEL_AUDIO_INPUT = "gemini-1.5-flash-latest"; // Flash supports audio input
const GEMINI_MODEL_TEXT_RESPONSE = "gemini-1.5-flash-latest"; // Good for text, recap
const GEMINI_MODEL_MULTIMODAL = "gemini-1.5-flash-latest";   // For image + text input
const GEMINI_MODEL_TTS = "text-to-speech"; // Use the dedicated TTS model identifier

const standardSafetySettings = [
    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
];

async function callGeminiAPI(payload, modelToUse, isTTS = false, isGenerateContent = true) {
    let endpoint;
    if (isTTS) { // Dedicated TTS model endpoint
        endpoint = `${GEMINI_API_URL_BASE}${modelToUse}:synthesizeSpeech?key=${GEMINI_API_KEY}`;
    } else if (isGenerateContent) { // Standard content generation
        endpoint = `${GEMINI_API_URL_BASE}${modelToUse}:generateContent?key=${GEMINI_API_KEY}`;
    } else { // Other specific actions if needed
        // endpoint = `${GEMINI_API_URL_BASE}${modelToUse}:streamGenerateContent?key=${GEMINI_API_KEY}`; // Example for streaming
        console.error("Unsupported API action specified in callGeminiAPI");
        throw new Error("Unsupported API action.");
    }

    // console.log(`Calling Gemini (${modelToUse}): ${endpoint} with payload:`, JSON.stringify(payload).substring(0, 200) + "...");
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        const responseData = await response.json();
        // console.log(`Gemini Response (${modelToUse}):`, JSON.stringify(responseData).substring(0, 300) + "...");

        if (!response.ok) {
            const errorMessage = responseData.error?.message || `API request to ${modelToUse} failed: ${response.status}`;
            console.error(`Gemini API Error (${modelToUse} - ${response.status}):`, responseData.error || responseData);
            throw new Error(errorMessage);
        }

        if (isTTS) {
            if (responseData.audioContent) {
                return { audioBase64: responseData.audioContent, mimeType: 'audio/mp3' }; // Gemini TTS typically returns MP3
            } else {
                throw new Error(`TTS API for ${modelToUse} did not return audioContent.`);
            }
        } else { // For generateContent
            const textPart = responseData.candidates?.[0]?.content?.parts?.find(part => part.text !== undefined)?.text;
            if (textPart !== undefined) return textPart;

            const finishReason = responseData.candidates?.[0]?.finishReason;
            const blockReason = responseData.promptFeedback?.blockReason;
            let detail = responseData.candidates?.[0]?.finishReasonDetail || responseData.promptFeedback?.blockReasonMessage || "No further details.";

            if (finishReason === "STOP" && textPart === undefined) return ""; // Valid empty response
            if (blockReason) {
                 console.warn(`Content blocked by Gemini. Reason: ${blockReason}. Detail: ${detail}`);
                 return `(My response was blocked due to safety settings: ${blockReason})`;
            }
            throw new Error(`API call to ${modelToUse} finished unexpectedly. Reason: ${finishReason || 'Unknown'}. Detail: ${detail}`);
        }
    } catch (error) {
        console.error(`Error in callGeminiAPI (${modelToUse}):`, error);
        // Provide a more user-friendly error if possible, or a generic one
        if (error.message.includes("API key not valid")) {
            alert("Critical Error: The Gemini API key is not valid. Please check your configuration.");
        }
        throw error;
    }
}

// --- Text-to-Speech (TTS) using Gemini API ---
window.getTTSAudioFromGemini = async function(textToSpeak, languageCode, voiceName = "en-US-Standard-C") { // Default voice
    // Gemini TTS `synthesizeSpeech` uses IETF BCP-47 language codes.
    // Voice name structure is typically like 'en-US-Standard-A' or 'fr-FR-Wavenet-A'.
    // We need to map our simpler `voiceName` (like "Charon") to actual Gemini voice names or construct them.
    // For now, let's assume languageCode is primary and voiceName is a preference within that language.
    // The API expects a specific voice configuration.

    // Simple mapping for demo, in production this would be more robust or you'd use exact Gemini voice names in connect_data.js
    let geminiVoiceName = voiceName; // If connect_data.js uses full Gemini voice names, this is fine.
    // If connect_data.js uses abstract names like "Charon", you need a map here:
    // const voiceMap = { "Charon": "fr-FR-Standard-D", "Kore": "de-DE-Standard-A", ... };
    // geminiVoiceName = voiceMap[voiceName] || "en-US-News-K"; // Fallback

    // If connect_data.js provides full voice names like "fr-FR-Standard-D", use it directly.
    // Otherwise, construct based on languageCode and a generic type if voiceName is abstract.
    // For this example, I'll assume `voiceName` from `connect_data.js` IS the Gemini voice name.

    const payload = {
        input: { text: textToSpeak },
        voice: {
            languageCode: languageCode, // e.g., "fr-FR", "es-US"
            name: geminiVoiceName        // e.g., "fr-FR-Standard-D" from your data
        },
        audioConfig: { audioEncoding: "MP3" }
    };

    try {
        return await callGeminiAPI(payload, GEMINI_MODEL_TTS, true, false); // isTTS=true, isGenerateContent=false
    } catch (error) {
        console.error(`Gemini TTS Error for lang ${languageCode}, voice ${geminiVoiceName}:`, error);
        throw error;
    }
};

// --- Text-Based Chat (Shell Version - takes existing history) ---
window.sendTextToGeminiForMessage_Shell = async function(userText, connector, existingGeminiHistory) {
    if (!connector) throw new Error("Connector information missing for message.");
    const MAX_MESSAGE_HISTORY_TURNS = 10; // Each turn is user + model

    // The existingGeminiHistory already contains the system prompt.
    let currentHistory = [...existingGeminiHistory];
    currentHistory.push({ role: "user", parts: [{ text: userText }] });

    // Pruning, keeping system prompts at the start
    if (currentHistory.length > (MAX_MESSAGE_HISTORY_TURNS * 2 + 2)) { // +2 for initial system prompt/ack
        const systemPrompts = currentHistory.slice(0, 2); // Assuming first 2 are system prompts
        const recentTurns = currentHistory.slice(-(MAX_MESSAGE_HISTORY_TURNS * 2));
        currentHistory = [...systemPrompts, ...recentTurns];
    }

    const payload = {
        contents: currentHistory,
        safetySettings: standardSafetySettings,
        generationConfig: {
            // temperature: 0.7, // Adjust for creativity vs. predictability
            // topK: 40,
            // topP: 0.95,
        }
    };
    try {
        const aiResponseText = await callGeminiAPI(payload, GEMINI_MODEL_TEXT_RESPONSE);
        // The calling function in connect_main.js will add this AI response to existingGeminiHistory
        return aiResponseText;
    } catch (error) {
        console.error(`Gemini Message Shell Error for ${connector.name}:`, error);
        return `(I'm having a little trouble responding right now. Let's try a different topic?)`;
    }
};

// --- Voice-Enabled Chat (Text Input part - for MODAL) ---
window.sendTextToGeminiForCall = async function(userText, connector, callHistory) {
    if (!connector) throw new Error("Connector information missing for call text input.");
    const systemPrompt = `You are ${connector.name}, a ${connector.modernTitle} for ${connector.language}. User is in a voice-enabled chat (this input is TYPED text by the user). Respond ONLY in ${connector.language}. Be conversational and concise (1-3 sentences). Do not mention you are an AI.`;

    const contents = [
        { role: "user", parts: [{ text: systemPrompt }] },
        { role: "model", parts: [{ text: `Okay, I am ${connector.name}. I'll respond in ${connector.language} to the typed text.` }] }
    ];
    const MAX_CALL_HISTORY_TURNS = 6; // User + Model = 1 turn
    const recentHistory = callHistory.slice(-MAX_CALL_HISTORY_TURNS * 2); // Get last N messages (user and model)
    recentHistory.forEach(turn => {
        // Ensure 'user-audio' is mapped to 'user' for Gemini history
        const role = turn.sender.startsWith('user') ? 'user' : 'model';
        contents.push({ role: role, parts: [{ text: turn.text }] })
    });
    contents.push({ role: "user", parts: [{ text: userText }] });

    const payload = { contents: contents, safetySettings: standardSafetySettings };
    try {
        return await callGeminiAPI(payload, GEMINI_MODEL_TEXT_RESPONSE);
    } catch (error) {
        return `(Text Input Error: ${error.message.substring(0,40)}...)`;
    }
};

// --- Voice Call & Voice-Enabled Chat (Audio Input part - for MODAL) ---
window.sendAudioDataToGeminiForCall = async function(base64AudioString, mimeType, connector, callHistory) {
    if (!connector) throw new Error("Connector information missing for audio call.");
    if (!base64AudioString) throw new Error("Audio data is missing.");

    let lastConnectorTextTurn = callHistory.filter(t => t.sender === 'connector').pop()?.text || 'This is the start of our conversation.';
    const systemPromptForAudio = `You are ${connector.name}, a ${connector.modernTitle} for ${connector.language}. The user is speaking to you via AUDIO in a voice call. Transcribe their audio (if you can) AND respond naturally ONLY in ${connector.language}. Be conversational and concise (1-3 sentences). Do not mention you are an AI or that the input was audio. Your last spoken line was: "${lastConnectorTextTurn}". Now, here is the user's audio:`;

    const contents = [
        { role: "user", parts: [{ text: systemPromptForAudio }] }, // This text part now precedes the audio
        { role: "model", parts: [{ text: `Okay, I am ${connector.name}. I'm listening and will respond in ${connector.language}.` }] }
    ];
    // Include minimal recent text history for context before the audio part
    const MAX_TEXT_HISTORY_WITH_AUDIO = 2; // 2 turns (user + model)
    const recentTextHistory = callHistory.filter(turn => turn.sender !== 'user-audio').slice(-(MAX_TEXT_HISTORY_WITH_AUDIO * 2));
    recentTextHistory.forEach(turn => contents.push({ role: turn.sender.startsWith('user') ? 'user' : 'model', parts: [{ text: turn.text }] }));

    // Add the audio data as the latest user part
    contents.push({ role: "user", parts: [{ inlineData: { mimeType: mimeType, data: base64AudioString } }] });

    const payload = { contents: contents, safetySettings: standardSafetySettings };
    let modelToTry = GEMINI_MODEL_AUDIO_INPUT;
    try {
        return await callGeminiAPI(payload, modelToTry);
    } catch (error) {
        console.warn(`Audio attempt with ${modelToTry} failed: ${error.message}.`);
        // Simple fallback, could add more levels if needed
        // Fallback not strictly necessary if Flash is generally reliable for audio.
        return `(Audio Processing Error: ${error.message.substring(0,40)}...)`;
    }
};

// --- User Image Submission with Optional Text (Shell Version - for Embedded Chat) ---
window.sendImageToGeminiForChat_Shell = async function(base64ImageString, mimeType, connector, existingGeminiHistory, optionalUserText = "What do you think of this image? Can you describe it or ask me a question about it in " + connector.language + "?") {
    if (!connector) throw new Error("Connector info missing for image chat.");
    if (!base64ImageString) throw new Error("Image data missing for image chat.");

    let currentHistory = [...existingGeminiHistory];
    const userImagePromptParts = [
        { text: optionalUserText },
        { inlineData: { mimeType: mimeType, data: base64ImageString } }
    ];
    currentHistory.push({ role: "user", parts: userImagePromptParts });

    // Pruning, keeping system prompts
    const MAX_MULTI_HISTORY_TURNS = 5;
     if (currentHistory.length > (MAX_MULTI_HISTORY_TURNS * 2 + 2)) {
        const systemPrompts = currentHistory.slice(0, 2);
        const recentTurns = currentHistory.slice(-(MAX_MULTI_HISTORY_TURNS * 2));
        currentHistory = [...systemPrompts, ...recentTurns];
    }

    const payload = { contents: currentHistory, safetySettings: standardSafetySettings };
    try {
        // Flash model is generally good for multimodal
        const aiResponseText = await callGeminiAPI(payload, GEMINI_MODEL_MULTIMODAL);
        return aiResponseText;
    } catch (error) {
        console.error(`Gemini Image Chat Shell Error for ${connector.name}:`, error);
        return `(I had a little trouble with the image. Maybe try another one or a different topic?)`;
    }
};


// --- Session Recap ---
window.getGeminiSessionRecap = async function(fullCallTranscript, connector) {
    if (!fullCallTranscript || fullCallTranscript.length === 0) return { topics: ["No conversation recorded."], vocabulary: [], focusAreas: [] };
    if (!connector) return { topics: ["Connector info missing."], vocabulary: [], focusAreas: [] };

    let transcriptText = "Conversation Transcript:\n";
    fullCallTranscript.forEach(turn => {
        const speaker = turn.sender.startsWith('user') ? 'User' : (connector.profileName || connector.name);
        transcriptText += `${speaker}: ${turn.text}\n`;
    });

    const recapPrompt = `You are an expert language learning coach. Analyze the following conversation transcript between "User" and "${connector.profileName || connector.name}" (who was speaking ${connector.language}).
The User is learning ${connector.language}.
Provide a concise, helpful, and encouraging debrief for the "User".
Format your response STRICTLY as a JSON object with the following keys:
- "topics": An array of 2-4 strings summarizing the main topics discussed.
- "vocabulary": An array of 3-5 key ${connector.language} vocabulary words or phrases used or introduced that the User might find useful. List the term in ${connector.language}, optionally followed by a brief English equivalent in parentheses.
- "focusAreas": An array of 1-2 specific, actionable, and encouraging suggestions for the User to improve their ${connector.language}, based *only* on what can be inferred from this transcript (e.g., if User struggled with a tense, or used a word incorrectly). If no clear areas for improvement are evident, provide a general encouragement.
All descriptive text in the JSON values (like topic summaries or focus area advice) should be in English. Only the "vocabulary" items themselves should be in ${connector.language}.
If the transcript is too short or vague for a specific section, use an empty array [] or a single string like "Not enough information from this session." in the array for that key.
Ensure the entire output is a single, valid JSON object.

Transcript:
${transcriptText}`;

    const payload = {
        contents: [{ role: "user", parts: [{ text: recapPrompt }] }],
        generationConfig: { responseMimeType: "application/json" }, // Request JSON output
        safetySettings: standardSafetySettings
    };
    try {
        const jsonStringResponse = await callGeminiAPI(payload, GEMINI_MODEL_TEXT_RESPONSE);
        if (jsonStringResponse === null || jsonStringResponse.trim() === "") {
            return { topics: ["AI returned no recap data."], vocabulary: [], focusAreas: [] };
        }
        const jsonMatch = jsonStringResponse.match(/\{[\s\S]*\}/); // Extract JSON part
        if (!jsonMatch) throw new Error("Recap response was not valid JSON.");
        const cleanedJsonString = jsonMatch[0];
        const parsedResponse = JSON.parse(cleanedJsonString);

        return {
            topics: parsedResponse.topics || ["No specific topics identified."],
            vocabulary: parsedResponse.vocabulary || [],
            focusAreas: parsedResponse.focusAreas || ["Keep practicing! Every conversation helps."]
        };
    } catch (error) {
        console.error(`Error getting/parsing session recap from Gemini for ${connector.name}:`, error);
        return { topics: [`Debrief generation failed: ${error.message.substring(0,60)}...`], vocabulary: [], focusAreas: [] };
    }
};

// --- Message History Management (used by connect_main.js for shell version) ---
// This is now primarily managed within connect_main.js in the activeConversations[id].geminiHistory
// but connect_gemini.js might need a helper if a function here directly modifies a history array passed to it.
// For now, sendTextToGeminiForMessage_Shell takes the history as an argument.

console.log("Polyglot Connect Gemini JS Initialized (Shell Integration Version with TTS, Multimodal Stubs).");