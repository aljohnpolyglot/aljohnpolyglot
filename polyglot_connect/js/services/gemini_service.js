// js/services/gemini_service.js

window.geminiService = (() => {
    const API_URL_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";

    const MODEL_TEXT_RESPONSE = "gemini-1.5-flash-latest";
    const MODEL_MULTIMODAL = "gemini-1.5-flash-latest"; // For image + text, also supports audio in text turns
    const MODEL_TTS = "text-to-speech";

    const standardSafetySettings = [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
    ];

    async function callGeminiAPIInternal(payload, modelIdentifier, isTTSRequest = false) {
        if (!window.GEMINI_API_KEY || window.GEMINI_API_KEY === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE') {
            const errorMsg = "Gemini API Key is not configured or is still the placeholder.";
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        const endpointAction = isTTSRequest ? ":synthesizeSpeech" : ":generateContent";
        const fullApiUrl = `${API_URL_BASE}${modelIdentifier}${endpointAction}?key=${window.GEMINI_API_KEY}`;

        // console.debug(`Calling Gemini (${modelIdentifier}): ${fullApiUrl} with payload:`, JSON.stringify(payload).substring(0, 250) + "...");
        try {
            const response = await fetch(fullApiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const responseData = await response.json();
            // console.debug(`Gemini Response (${modelIdentifier}):`, JSON.stringify(responseData).substring(0, 250) + "...");

            if (!response.ok) {
                const errorDetails = responseData.error || { message: `API request failed with status ${response.status}` };
                console.error(`Gemini API Error (${modelIdentifier} - ${response.status}):`, errorDetails);
                throw new Error(errorDetails.message || `Gemini API Error: ${response.status}`);
            }

            if (isTTSRequest) {
                if (responseData.audioContent) {
                    return { audioBase64: responseData.audioContent, mimeType: 'audio/mp3' };
                }
                console.error(`TTS API (${modelIdentifier}) did not return audioContent. Response:`, responseData);
                throw new Error(`TTS API (${modelIdentifier}) did not return audioContent.`);
            } else { // generateContent
                const candidate = responseData.candidates?.[0];
                if (!candidate) {
                    console.warn(`No candidates in Gemini response for ${modelIdentifier}. Response:`, responseData);
                    // Check for prompt feedback if no candidates
                    if (responseData.promptFeedback?.blockReason) {
                        const blockReason = responseData.promptFeedback.blockReason;
                        const blockMessage = responseData.promptFeedback.blockReasonMessage || "No additional details.";
                        console.warn(`Content blocked by Gemini. Reason: ${blockReason}. Detail: ${blockMessage}`);
                        return `(My response was blocked due to safety settings: ${blockReason})`;
                    }
                    throw new Error(`API call to ${modelIdentifier} returned no candidates and no clear block reason.`);
                }

                const textPart = candidate.content?.parts?.find(part => part.text !== undefined)?.text;
                if (textPart !== undefined) return textPart;

                const finishReason = candidate.finishReason;
                if (finishReason === "STOP" && textPart === undefined) return ""; // Valid empty response

                // Handle other finish reasons like SAFETY, RECITATION, etc.
                if (finishReason && finishReason !== "STOP") {
                    console.warn(`Content generation stopped by Gemini. Reason: ${finishReason}. Candidate:`, candidate);
                    return `(My response was altered or stopped. Reason: ${finishReason})`;
                }
                
                console.error(`API call to ${modelIdentifier} finished unexpectedly or with no text. Candidate:`, candidate, "Full Response:", responseData);
                throw new Error(`API call to ${modelIdentifier} finished unexpectedly or with no text part. Reason: ${finishReason || 'Unknown'}.`);
            }
        } catch (error) {
            console.error(`Error in callGeminiAPIInternal (${modelIdentifier}):`, error.message, error.stack);
            throw error; // Re-throw to be handled by specific service functions
        }
    }

    return {
        getTTSAudio: async function(textToSpeak, languageCode, geminiVoiceName) {
            if (!textToSpeak || !languageCode) {
                throw new Error("Text to speak and language code are required for TTS.");
            }
            const payload = {
                input: { text: textToSpeak },
                voice: { languageCode: languageCode }, // Gemini might pick best voice if name not provided or invalid
                audioConfig: { audioEncoding: "MP3", speakingRate: 1.0, pitch: 0 } // Default speaking rate and pitch
            };
            if (geminiVoiceName) {
                payload.voice.name = geminiVoiceName;
            }
            try {
                return await callGeminiAPIInternal(payload, MODEL_TTS, true);
            } catch (error) {
                console.error(`geminiService.getTTSAudio Error for lang ${languageCode}, voice ${geminiVoiceName}:`, error);
                throw error;
            }
        },

        generateTextMessage: async function(userText, connector, existingGeminiHistory) {
            if (!connector) throw new Error("Connector info missing for generateTextMessage.");
            if (!userText && userText !== "") throw new Error("User text is missing for generateTextMessage.");

            // existingGeminiHistory is managed by chat_manager.js and includes system prompts
            let currentHistory = [...existingGeminiHistory];
            currentHistory.push({ role: "user", parts: [{ text: userText }] });

            // Pruning is handled by chat_manager before passing existingGeminiHistory

            const payload = {
                contents: currentHistory,
                safetySettings: standardSafetySettings,
                generationConfig: { temperature: 0.75, topP: 0.95, topK: 40 }
            };
            try {
                const aiResponseText = await callGeminiAPIInternal(payload, MODEL_TEXT_RESPONSE);
                return aiResponseText;
            } catch (error) {
                console.error(`geminiService.generateTextMessage Error for ${connector.profileName || connector.name}:`, error);
                return `(I'm having a little trouble responding right now. Let's try that again, or pick a new topic?) Error: ${error.message.substring(0,50)}`;
            }
        },

        // For MODAL Voice Chat text input or Direct Call text input (if ever implemented)
        generateTextForCallModal: async function(userText, connector, modalCallHistory) {
            if (!connector) throw new Error("Connector info missing for generateTextForCallModal.");
            const systemPrompt = `You are ${connector.profileName || connector.name}, a ${connector.modernTitle}. You are in a voice-enabled chat session. The user has just TYPED the following text. Respond ONLY in ${connector.language}. Be conversational and concise (1-3 sentences). Do not mention you are an AI.`;
            
            let contents = [
                { role: "user", parts: [{ text: systemPrompt }] },
                { role: "model", parts: [{ text: `Okay, I am ${connector.profileName}. I'll respond in ${connector.language} to the user's typed text.` }] }
            ];
            
            const MAX_MODAL_CALL_HISTORY_TURNS = 6; // User + Model = 1 turn
            const recentHistory = modalCallHistory.slice(-MAX_MODAL_CALL_HISTORY_TURNS * 2);
            recentHistory.forEach(turn => {
                const role = turn.sender.startsWith('user') ? 'user' : 'model';
                // Ensure turn.text is a string, even if it was e.g. an audio placeholder
                const textContent = typeof turn.text === 'string' ? turn.text : "[Previous audio segment]";
                contents.push({ role: role, parts: [{ text: textContent }] });
            });
            contents.push({ role: "user", parts: [{ text: userText }] });

            const payload = { contents: contents, safetySettings: standardSafetySettings };
            try {
                return await callGeminiAPIInternal(payload, MODEL_TEXT_RESPONSE);
            } catch (error) {
                console.error(`geminiService.generateTextForCallModal Error for ${connector.profileName}:`, error);
                return `(Text Input Error during call: ${error.message.substring(0,30)}...)`;
            }
        },

        generateTextFromAudioForCallModal: async function(base64AudioString, mimeType, connector, modalCallHistory) {
            if (!connector) throw new Error("Connector info missing for audio call modal.");
            if (!base64AudioString) throw new Error("Audio data missing for audio call modal.");

            let lastConnectorText = modalCallHistory.filter(t => t.sender === 'connector' && typeof t.text === 'string' && t.text.trim() !== "").pop()?.text || 'This is the start of our conversation.';
            const systemPrompt = `You are ${connector.profileName || connector.name}, a ${connector.modernTitle}. You are in a voice call. The user has just SPOKEN (audio provided). Transcribe their speech if necessary, then respond naturally ONLY in ${connector.language}. Keep your response conversational and concise (1-3 sentences). Do not mention being an AI or that input was audio. Your last line was: "${lastConnectorText}". Now, process the user's audio:`;
            
            let contents = [
                { role: "user", parts: [{ text: systemPrompt }] },
                { role: "model", parts: [{ text: `Okay, I am ${connector.profileName}. I'm listening and will respond in ${connector.language}.` }] }
            ];

            const MAX_TEXT_HISTORY_WITH_MODAL_AUDIO = 3; // Keep some recent text turns for context
            const recentTextTurns = modalCallHistory.filter(t => typeof t.text === 'string').slice(-(MAX_TEXT_HISTORY_WITH_MODAL_AUDIO * 2));
            recentTextTurns.forEach(turn => {
                contents.push({ role: turn.sender.startsWith('user') ? 'user' : 'model', parts: [{ text: turn.text }] })
            });
            
            contents.push({ role: "user", parts: [{ inlineData: { mimeType: mimeType, data: base64AudioString } }] });
            
            const payload = { contents: contents, safetySettings: standardSafetySettings };
            try {
                // Gemini 1.5 Flash can handle audio directly in generateContent
                return await callGeminiAPIInternal(payload, MODEL_MULTIMODAL); 
            } catch (error) {
                console.error(`geminiService.generateTextFromAudioForCallModal Error for ${connector.profileName}:`, error);
                return `(Audio Processing Error during call: ${error.message.substring(0,30)}...)`;
            }
        },

        generateTextFromImageAndText: async function(base64ImageString, mimeType, connector, existingGeminiHistory, optionalUserText) {
            if (!connector) throw new Error("Connector info missing for image chat.");
            if (!base64ImageString) throw new Error("Image data missing for image chat.");
            
            const userQueryText = optionalUserText || `User sent this image. Please describe it or ask a question about it in ${connector.language}.`;

            let currentHistory = [...existingGeminiHistory];
            const userImagePromptParts = [ { text: userQueryText }, { inlineData: { mimeType: mimeType, data: base64ImageString } }];
            currentHistory.push({ role: "user", parts: userImagePromptParts });

            // Pruning for multimodal history handled by chat_manager

            const payload = { contents: currentHistory, safetySettings: standardSafetySettings };
            try {
                return await callGeminiAPIInternal(payload, MODEL_MULTIMODAL);
            } catch (error) {
                console.error(`geminiService.generateTextFromImageAndText Error for ${connector.profileName}:`, error);
                return `(I had trouble with the image: ${error.message.substring(0,30)}...)`;
            }
        },

        generateSessionRecap: async function(fullCallTranscript, connector) {
            if (!fullCallTranscript || fullCallTranscript.length === 0) {
                return { topics: ["No conversation recorded."], vocabulary: [], focusAreas: [] };
            }
            if (!connector) {
                return { topics: ["Connector info missing for recap."], vocabulary: [], focusAreas: [] };
            }

            let transcriptText = "Conversation Transcript:\n";
            fullCallTranscript.forEach(turn => {
                const speaker = turn.sender.startsWith('user') ? 'User' : (connector.profileName || connector.name);
                // Ensure turn.text is a string
                const textContent = typeof turn.text === 'string' ? turn.text : `[${turn.type || 'Non-text entry'}]`;
                transcriptText += `${speaker}: ${textContent}\n`;
            });

            const recapPrompt = `
You are an expert language learning coach. Analyze the following conversation transcript between a user and an AI language partner named ${connector.profileName || connector.name} (who was speaking ${connector.language}).
The user is learning ${connector.language}.
Provide a concise debrief in JSON format. The JSON object should have three keys: "topics", "vocabulary", and "focusAreas".
- "topics": An array of strings listing the main subjects discussed (e.g., "Weekend plans", "Ordering food", "Hobbies"). Max 5 topics.
- "vocabulary": An array of strings listing 3-5 key vocabulary words or short phrases in ${connector.language} that the user practiced or could find useful from the conversation. If the user made errors with certain words, include the correct form.
- "focusAreas": An array of strings identifying 2-3 specific grammar points, pronunciation challenges (if inferable), or conversational skills the user could focus on to improve their ${connector.language}, based on the transcript. Be constructive and encouraging.

Transcript:
${transcriptText}

Return ONLY the valid JSON object.
`;
            const payload = {
                contents: [{ role: "user", parts: [{ text: recapPrompt }] }],
                generationConfig: { responseMimeType: "application/json", temperature: 0.5 },
                safetySettings: standardSafetySettings
            };
            try {
                const jsonStringResponse = await callGeminiAPIInternal(payload, MODEL_TEXT_RESPONSE);
                if (!jsonStringResponse || jsonStringResponse.trim() === "") {
                    throw new Error("Empty recap response from AI.");
                }
                // Robust JSON parsing: try to parse directly, then look for JSON within markdown
                let parsed;
                try {
                    parsed = JSON.parse(jsonStringResponse);
                } catch (e) {
                    const jsonMatch = jsonStringResponse.match(/```json\s*(\{[\s\S]*?\})\s*```/s) || jsonStringResponse.match(/(\{[\s\S]*?\})/s) ;
                    if (!jsonMatch || !jsonMatch[1]) {
                        console.error("Recap response was not valid JSON nor contained valid JSON block. Response:", jsonStringResponse);
                        throw new Error("Recap response was not valid JSON.");
                    }
                    parsed = JSON.parse(jsonMatch[1]);
                }
                
                return {
                    topics: Array.isArray(parsed.topics) ? parsed.topics : ["N/A"],
                    vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
                    focusAreas: Array.isArray(parsed.focusAreas) ? parsed.focusAreas : ["Keep practicing!"]
                };
            } catch (error) {
                console.error(`geminiService.generateSessionRecap Error for ${connector.profileName || connector.name}:`, error);
                return { topics: [`Debrief failed: ${error.message.substring(0,50)}...`], vocabulary: [], focusAreas: [] };
            }
        }
    };
})();

console.log("services/gemini_service.js loaded. window.geminiService object:", window.geminiService);