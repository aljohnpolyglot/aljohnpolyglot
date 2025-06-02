'use strict';

// --- UI Elements ---
const chatInputField = document.getElementById('user-chat-input-field');
const sendChatMessageBtn = document.getElementById('send-chat-message-btn');
const chatLogDisplayGlobal = document.getElementById('chat-log-display');
const languageFilterSelect = document.getElementById('language-filter');

// --- API Configuration ---
const GEMINI_API_KEY = "AIzaSyDfJspAjl93a5PnPENic7AG8yRT9vwRjh4"; // YOUR PROVIDED KEY
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${GEMINI_API_KEY}`;

// --- Chat Configuration ---
const MAX_HISTORY_TO_SEND = 10;
const CHAT_HISTORY_STORAGE_LIMIT = 50;
const LOCAL_STORAGE_KEY_PREFIX = 'geminiChatHistory_';

// --- Global State ---
let chatHistory = [];
let currentCharacterLanguageCode = 'default_captain_aljohn'; // Default if no language filter

// --- Helper: createElement (ensure globally available) ---
function createElement(tag, classNames = [], attributes = {}, textContent = '') {
    const el = document.createElement(tag);
    if (Array.isArray(classNames)) {
        el.classList.add(...classNames);
    } else if (typeof classNames === 'string' && classNames.length > 0) {
        el.classList.add(classNames);
    }
    for (const attr in attributes) {
        el.setAttribute(attr, attributes[attr]);
    }
    if (textContent) el.textContent = textContent; // Use textContent for safety
    return el;
}


function initializeChatbot() {
    if (!chatInputField || !sendChatMessageBtn || !chatLogDisplayGlobal) {
        console.error("Chatbot UI elements not found. Chatbot disabled.");
        if (sendChatMessageBtn) sendChatMessageBtn.disabled = true;
        if (chatInputField) chatInputField.disabled = true;
        return;
    }

    sendChatMessageBtn.addEventListener('click', handleSendMessage);
    chatInputField.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
    });

    if (languageFilterSelect) {
        languageFilterSelect.addEventListener('change', handleLanguageFilterChange);
        // Initialize based on current filter value
        currentCharacterLanguageCode = languageFilterSelect.value || 'default_captain_aljohn';
    }
    
    loadAndRenderHistory(); // Load history and potentially show greeting

    console.log("Chatbot initialized. Using API URL:", GEMINI_API_URL);
    console.log("Chatbot: Current context for history:", currentCharacterLanguageCode);
}

function handleLanguageFilterChange() {
    if (languageFilterSelect) {
        currentCharacterLanguageCode = languageFilterSelect.value || 'default_captain_aljohn';
    }
    console.log("Chatbot: Language filter changed. New context:", currentCharacterLanguageCode);
    loadAndRenderHistory();
}

function getStorageKey() {
    return `${LOCAL_STORAGE_KEY_PREFIX}${currentCharacterLanguageCode}`;
}

function saveHistory() {
    try {
        if (chatHistory.length > CHAT_HISTORY_STORAGE_LIMIT) {
            chatHistory = chatHistory.slice(-CHAT_HISTORY_STORAGE_LIMIT);
        }
        localStorage.setItem(getStorageKey(), JSON.stringify(chatHistory));
    } catch (e) {
        console.warn("Chatbot: Could not save chat history:", e);
    }
}

function loadAndRenderHistory() {
    if (!chatLogDisplayGlobal) return;

    chatLogDisplayGlobal.innerHTML = ''; // Chatbot clears and takes ownership
    
    const storedHistory = localStorage.getItem(getStorageKey());
    if (storedHistory) {
        try {
            chatHistory = JSON.parse(storedHistory);
        } catch (e) {
            console.error("Chatbot: Error parsing stored chat history:", e);
            chatHistory = [];
        }
    } else {
        chatHistory = [];
    }

    if (chatHistory.length > 0) {
        chatHistory.forEach(message => {
            appendMessageToChatLog(message.text, message.role === 'user' ? 'user' : 'character', false, true);
        });
        console.log(`Chatbot: Loaded ${chatHistory.length} messages for ${currentCharacterLanguageCode}`);
    } else {
        console.log(`Chatbot: No history for ${currentCharacterLanguageCode}. Displaying initial greeting.`);
        // Display initial greeting if no history
        let greetingMessage = "Ahoy! How can I help ye today?"; // Default general greeting
        let activeCharacterForGreeting = null;

        if (window.libraryCharacters && currentCharacterLanguageCode && currentCharacterLanguageCode !== 'default_captain_aljohn') {
            activeCharacterForGreeting = Object.values(window.libraryCharacters).find(char => char.languageCode === currentCharacterLanguageCode);
        }

        if (activeCharacterForGreeting) {
            if (activeCharacterForGreeting.dialogues && activeCharacterForGreeting.dialogues.length > 0) {
                greetingMessage = activeCharacterForGreeting.dialogues[Math.floor(Math.random() * activeCharacterForGreeting.dialogues.length)];
            } else {
                const langName = window.availableLanguages?.find(l => l.code === currentCharacterLanguageCode)?.name || 'these texts';
                greetingMessage = `Greetings! I am ${activeCharacterForGreeting.name}. How may I assist you with ${langName}?`;
            }
        }
        appendMessageToChatLog(greetingMessage, 'character', false, true); // isHistory=true to prevent immediate scroll if not needed
    }
    // Ensure chat scrolls to bottom if content was added, especially for a fresh greeting
    // Or if history doesn't fill the view.
    chatLogDisplayGlobal.scrollTop = chatLogDisplayGlobal.scrollHeight;
}


async function handleSendMessage() {
    const userMessageText = chatInputField.value.trim();
    if (!userMessageText) return;

    // If the chat log only contains the initial greeting, clear it before adding user message
    // This prevents the greeting from becoming part of the saved history.
    const firstMessageIsGreeting = chatLogDisplayGlobal.children.length === 1 &&
                                   chatLogDisplayGlobal.children[0].classList.contains('character') &&
                                   chatHistory.length === 0; // Check internal history too

    if (firstMessageIsGreeting) {
        chatLogDisplayGlobal.innerHTML = ''; // Clear the visual greeting
    }

    appendMessageToChatLog(userMessageText, 'user');
    chatHistory.push({ role: 'user', text: userMessageText });
    saveHistory();

    chatInputField.value = '';
    chatInputField.focus();
    sendChatMessageBtn.disabled = true;

    let activeCharacter = null;
    if (window.libraryCharacters && languageFilterSelect) {
        const currentLanguageFilterValue = languageFilterSelect.value || ""; // Use current value from select
        activeCharacter = Object.values(window.libraryCharacters).find(char => char.languageCode === currentLanguageFilterValue);
         // Update currentCharacterLanguageCode if it somehow got out of sync, though handleLanguageFilterChange should manage it
        if (currentCharacterLanguageCode !== currentLanguageFilterValue && currentLanguageFilterValue) {
            currentCharacterLanguageCode = currentLanguageFilterValue;
        }
    }
    
    const thinkingMessageText = activeCharacter ? `${activeCharacter.name} is thinking...` : "Captain Aljohn is thinking...";
    appendMessageToChatLog(thinkingMessageText, 'character', true);

    let exampleBooksForPrompt = [];
    if (activeCharacter && window.publicDomainBooks) {
        const booksInCharLanguage = window.publicDomainBooks.filter(
            book => book.language === activeCharacter.languageCode
        );
        if (booksInCharLanguage.length > 0) {
            exampleBooksForPrompt = booksInCharLanguage
                .sort(() => 0.5 - Math.random()).slice(0, 3)
                .map(book => ({ title: book.title, author: book.author }));
        }
    }

    try {
        const historyForAPI = chatHistory.slice(-MAX_HISTORY_TO_SEND);
        const requestPayload = constructGeminiRequestPayload(userMessageText, activeCharacter, exampleBooksForPrompt, historyForAPI);
        
        const botResponseText = await getGeminiResponse(requestPayload);
        updateLastCharacterMessage(botResponseText || "I'm currently charting new literary seas... try again shortly!");
        
        chatHistory.push({ role: 'model', text: botResponseText });
        saveHistory();

    } catch (error) {
        console.error("Chatbot: Error in handleSendMessage (Gemini interaction):", error);
        updateLastCharacterMessage(`Avast, me circuits seem to be crossed! (${error.message || 'Please try again.'})`);
    } finally {
        sendChatMessageBtn.disabled = false;
    }
}

function constructGeminiRequestPayload(currentUserMessageText, character, exampleBooks = [], conversationHistory = []) {
    let responseLanguageName = "English";
    let responseLanguageCode = "en";
    let characterPreamble;
    let characterSpeechExamples = "- (Rely on persona for speech style.)";
    let bookContext = "";

    if (character) {
        responseLanguageName = character.languageName || "their native language";
        responseLanguageCode = character.languageCode || "en";
        characterPreamble = `You are ${character.name}. Persona: ${character.bioShort}`;
        if (character.dialogues && character.dialogues.length > 0) {
            characterSpeechExamples = character.dialogues.map(d => `- "${d}"`).join('\n');
        }
        if (exampleBooks.length > 0) {
            const bookList = exampleBooks.map(book => `"${book.title}"` + (book.author ? ` by ${book.author}` : "")).join(', ');
            bookContext = `Your ${responseLanguageName} collection includes: ${bookList}.`;
        } else {
            bookContext = `Your ${responseLanguageName} collection is always growing.`;
        }
    } else { // Default to Captain Aljohn if no specific character for the language (or no language selected)
        characterPreamble = `You are Captain Aljohn, proprietor of the Aljohn Polyglot Library. You are friendly, knowledgeable, and speak with a hint of pirate flair. If a specific language character is contextually active, adopt their persona.`;
        characterSpeechExamples = `- "Ahoy there, matey!"\n- "What knowledge do ye seek?"`;
        bookContext = "The library holds treasures in many tongues.";
         // Try to infer language from currentCharacterLanguageCode if character object is null
        if (currentCharacterLanguageCode && currentCharacterLanguageCode !== 'default_captain_aljohn' && window.availableLanguages) {
            const langObj = window.availableLanguages.find(l => l.code === currentCharacterLanguageCode);
            if (langObj) {
                responseLanguageName = langObj.name;
                responseLanguageCode = langObj.code;
                 characterPreamble = `You are the library's specialist for ${responseLanguageName}. Persona: You are knowledgeable and helpful regarding ${responseLanguageName} texts.`;
                 bookContext = `The library's ${responseLanguageName} collection is always growing.`;
            }
        }
    }

    const systemInstructions = `${characterPreamble}
${bookContext}

Your entire response MUST be in ${responseLanguageName} (language code: ${responseLanguageCode}).
The user is speaking English.

General Instructions:
1. Respond naturally and in character. Keep responses concise (1-3 sentences typically).
2. If asked about books, refer to known titles or the general collection for ${responseLanguageName}.
3. Do NOT break character. Do NOT mention you are an AI model.
4. Your response must ONLY be in ${responseLanguageName}.
5. Refer to the 'CONVERSATION HISTORY' below if present for context.
Examples of your speech style (if applicable):
${characterSpeechExamples}
---
CONVERSATION HISTORY (if any):`;

    const contents = [];
    let conversationHistoryText = "";

    // conversationHistory includes the current user message as its last element.
    const actualHistoryTurns = conversationHistory.slice(0, -1); // All but the current message
    if (actualHistoryTurns.length > 0) {
        actualHistoryTurns.forEach(msg => {
            let speaker = msg.role === 'user' ? 'User' : (character ? character.name : 'Captain');
            // If using a generic persona for a language without a specific character object
            if (!character && currentCharacterLanguageCode && currentCharacterLanguageCode !== 'default_captain_aljohn' && msg.role === 'model') {
                const langObj = window.availableLanguages.find(l => l.code === currentCharacterLanguageCode);
                if (langObj) speaker = `${langObj.name} Specialist`;
            }
            conversationHistoryText += `\n${speaker}: ${msg.text}`;
        });
    } else {
        conversationHistoryText = "\n(No previous conversation history in this session for this turn)";
    }

    const fullUserPrompt = `${systemInstructions}${conversationHistoryText}\n\nCURRENT USER QUERY: "${currentUserMessageText}"`;
    contents.push({ role: 'user', parts: [{ text: fullUserPrompt }] });

    // console.log("DEBUG: Gemini Request Payload:", JSON.stringify({ contents }, null, 2));

    return {
        contents: contents,
        generationConfig: { /* "temperature": 0.7, "maxOutputTokens": 200, etc. */ },
        safetySettings: [ /* ... safety settings ... */ ]
    };
}

async function getGeminiResponse(requestPayload) {
    // ... (Same as your last robust version - logging, error handling, parsing response)
    try {
        const response = await fetch(GEMINI_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestPayload)
        });
        if (!response.ok) {
            let errorData = { error: { message: `API request failed with status ${response.status}.` } };
            try { errorData = await response.json(); } catch (e) { console.warn("Could not parse error JSON from API"); }
            console.error("Chatbot: Gemini API Error Response Body:", errorData);
            throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
        }
        const data = await response.json();
        if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text;
        } else {
            console.warn("Chatbot: Gemini API response did not contain expected text structure:", data);
            const finishReason = data.candidates?.[0]?.finishReason;
            if (finishReason) return `Me compass spun wildly! (Reason: ${finishReason}). Try a different tack?`;
            if (data.promptFeedback?.blockReason) return `Avast! My message in a bottle was returned (Reason: ${data.promptFeedback.blockReason}).`;
            return "I received a peculiar signal... but no clear message.";
        }
    } catch (error) {
        console.error("Chatbot: Error during fetch to Gemini:", error);
        throw error;
    }
}

function appendMessageToChatLog(text, sender, isThinking = false, isHistory = false) {
    if (!chatLogDisplayGlobal) return null;
    const messageDiv = createElement('div', ['chat-message', sender]);
    if (isThinking) {
        messageDiv.classList.add('thinking');
        // Ensure text for thinking is HTML-safe or just use textContent
        const thinkingTextNode = document.createTextNode(text + " ");
        const spinnerSpan = createElement('span', ['dot-elastic']); // dot-elastic or your spinner class
        messageDiv.appendChild(thinkingTextNode);
        messageDiv.appendChild(spinnerSpan);
    } else {
        messageDiv.textContent = text;
    }
    chatLogDisplayGlobal.appendChild(messageDiv);
    if (!isHistory || chatLogDisplayGlobal.scrollHeight > chatLogDisplayGlobal.clientHeight) {
        // Scroll for new messages, or if history overflows
        chatLogDisplayGlobal.scrollTop = chatLogDisplayGlobal.scrollHeight;
    }
    return messageDiv;
}

function updateLastCharacterMessage(text) {
    if (!chatLogDisplayGlobal) return;
    const thinkingMessage = chatLogDisplayGlobal.querySelector('.chat-message.character.thinking');
    if (thinkingMessage) {
        thinkingMessage.classList.remove('thinking');
        thinkingMessage.innerHTML = ''; 
        thinkingMessage.textContent = text;
    } else {
        appendMessageToChatLog(text, 'character');
    }
    chatLogDisplayGlobal.scrollTop = chatLogDisplayGlobal.scrollHeight;
}

document.addEventListener('DOMContentLoaded', initializeChatbot);