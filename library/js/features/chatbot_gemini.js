'use strict';

// --- UI Elements ---
const chatInputField = document.getElementById('user-chat-input-field');
const sendChatMessageBtn = document.getElementById('send-chat-message-btn');
const chatLogDisplayGlobal = document.getElementById('chat-log-display');
const languageFilterSelect = document.getElementById('language-filter');

// --- API Configuration ---
// The proxy may use the model query parameter to select its upstream model. Keeping
// the production model here makes client/server migration intent explicit and singular.
const GEMINI_CLIENT_CONFIG = Object.freeze({
    endpoint: 'https://my-gemini-proxy.mogatas-princealjohn-05082003.workers.dev',
    model: 'gemini-3.7-flash',
    maxAttempts: 4,
    baseDelayMs: 900,
    maxDelayMs: 8000,
    timeoutMs: 30000
});

// --- Chat Configuration ---
const MAX_HISTORY_TO_SEND = 10;
const CHAT_HISTORY_STORAGE_LIMIT = 50;
const LOCAL_STORAGE_KEY_PREFIX = 'geminiChatHistory_';

// --- Global State ---
let chatHistory = [];
let currentCharacterLanguageCode = 'default_captain_aljohn'; // Default if no language filter
let requestInFlight = false;
let failedTurn = null;

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

}

function handleLanguageFilterChange() {
    if (languageFilterSelect) {
        currentCharacterLanguageCode = languageFilterSelect.value || 'default_captain_aljohn';
    }
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
    } else {
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
    if (requestInFlight) return;
    const userMessageText = chatInputField.value.trim();
    if (!userMessageText) return;

    await submitUserTurn(userMessageText, { appendUserMessage: true });
}

function setChatBusy(isBusy) {
    requestInFlight = isBusy;
    sendChatMessageBtn.disabled = isBusy;
    chatInputField.disabled = isBusy;
    if (languageFilterSelect) languageFilterSelect.disabled = isBusy;
    chatLogDisplayGlobal.setAttribute('aria-busy', isBusy ? 'true' : 'false');
}

async function submitUserTurn(userMessageText, options = {}) {
    if (requestInFlight) return;
    const appendUserMessage = options.appendUserMessage !== false;
    const turnContextCode = options.contextCode || currentCharacterLanguageCode;

    // If the chat log only contains the initial greeting, clear it before adding user message
    // This prevents the greeting from becoming part of the saved history.
    const firstMessageIsGreeting = chatLogDisplayGlobal.children.length === 1 &&
                                   chatLogDisplayGlobal.children[0].classList.contains('character') &&
                                   chatHistory.length === 0; // Check internal history too

    if (appendUserMessage && firstMessageIsGreeting) {
        chatLogDisplayGlobal.innerHTML = ''; // Clear the visual greeting
    }

    if (appendUserMessage) {
        appendMessageToChatLog(userMessageText, 'user');
        chatHistory.push({ role: 'user', text: userMessageText });
        saveHistory();
    }

    chatInputField.value = '';
    setChatBusy(true);

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

    let availableBooksForPrompt = [];
    // The `window.publicDomainBooks` variable must be populated by your `book_data.js` script.
    if (activeCharacter && window.publicDomainBooks) {
        availableBooksForPrompt = window.publicDomainBooks
            .filter(book => book.language === activeCharacter.languageCode)
            .map(book => ({ title: book.title, author: book.author })); // We only need title and author for the prompt.
    }

    try {
        const historyForAPI = chatHistory.slice(-MAX_HISTORY_TO_SEND);
        // --- MODIFICATION ---
        // Pass the full list of available books to the payload constructor.
        const requestPayload = constructGeminiRequestPayload(userMessageText, activeCharacter, availableBooksForPrompt, historyForAPI);
        
        const botResponseText = await getGeminiResponse(requestPayload);
        updateLastCharacterMessage(botResponseText || "I'm currently charting new literary seas... try again shortly!");
        
        chatHistory.push({ role: 'model', text: botResponseText });
        saveHistory();
        failedTurn = null;

    } catch (error) {
        failedTurn = { text: userMessageText, contextCode: turnContextCode };
        console.error('Chatbot request failed', {
            status: error.status || null,
            retryable: Boolean(error.retryable),
            attempts: error.attempts || GEMINI_CLIENT_CONFIG.maxAttempts,
            name: error.name
        });
        renderRetryMessage(error);
    } finally {
        setChatBusy(false);
        chatInputField.focus();
    }
}

async function retryFailedTurn() {
    if (!failedTurn || requestInFlight || failedTurn.contextCode !== currentCharacterLanguageCode) return;
    await submitUserTurn(failedTurn.text, {
        appendUserMessage: false,
        contextCode: failedTurn.contextCode
    });
}
function constructGeminiRequestPayload(currentUserMessageText, character, availableBooks = [], conversationHistory = []) {
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
      // --- MODIFICATION ---
        // The logic for building the book context is updated to be more direct and clear for the AI.
        // Note: The function signature should now use `availableBooks` as the parameter name.
        if (availableBooks.length > 0) {
            const bookList = availableBooks.map(book => `"${book.title}" by ${book.author}`).join('; ');
            bookContext = `Your library's ${responseLanguageName} collection consists of the following books: ${bookList}.`;
        } else {
            bookContext = `Your ${responseLanguageName} collection is currently empty, but always growing.`;
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
2. If asked about books, answer based *only* on the list of titles provided in your context. Do not invent books or authors. If a book isn't on your list, say you don't have it.
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

class ChatbotRequestError extends Error {
    constructor(message, options = {}) {
        super(message);
        this.name = 'ChatbotRequestError';
        this.status = options.status || null;
        this.retryable = Boolean(options.retryable);
        this.retryAfterMs = options.retryAfterMs || 0;
        this.attempts = options.attempts || 1;
    }
}

function getGeminiRequestUrl() {
    const url = new URL(GEMINI_CLIENT_CONFIG.endpoint);
    url.searchParams.set('model', GEMINI_CLIENT_CONFIG.model);
    return url.toString();
}

function getRetryAfterMs(response) {
    const value = response.headers.get('Retry-After');
    if (!value) return 0;
    const seconds = Number(value);
    if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000);
    const dateValue = Date.parse(value);
    return Number.isNaN(dateValue) ? 0 : Math.max(0, dateValue - Date.now());
}

function waitForRetry(delayMs) {
    return new Promise(resolve => window.setTimeout(resolve, delayMs));
}

function getBackoffDelay(attempt, retryAfterMs = 0) {
    if (retryAfterMs > 0) return Math.min(retryAfterMs, GEMINI_CLIENT_CONFIG.maxDelayMs);
    const exponential = GEMINI_CLIENT_CONFIG.baseDelayMs * (2 ** attempt);
    const jitter = Math.random() * GEMINI_CLIENT_CONFIG.baseDelayMs * 0.35;
    return Math.min(exponential + jitter, GEMINI_CLIENT_CONFIG.maxDelayMs);
}

async function getGeminiResponse(requestPayload) {
    let lastError = null;

    for (let attempt = 0; attempt < GEMINI_CLIENT_CONFIG.maxAttempts; attempt += 1) {
        const controller = new AbortController();
        const timeoutId = window.setTimeout(() => controller.abort(), GEMINI_CLIENT_CONFIG.timeoutMs);

        try {
            const response = await fetch(getGeminiRequestUrl(), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestPayload),
                signal: controller.signal
            });

            if (!response.ok) {
                const retryable = response.status === 408 || response.status === 429 || response.status >= 500;
                throw new ChatbotRequestError(
                    retryable
                        ? 'The library assistant is temporarily unavailable.'
                        : 'The library assistant could not process this message.',
                    {
                        status: response.status,
                        retryable,
                        retryAfterMs: getRetryAfterMs(response),
                        attempts: attempt + 1
                    }
                );
            }

            const data = await response.json();
            const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (responseText) return responseText;

            const finishReason = data.candidates?.[0]?.finishReason;
            if (finishReason) return `Me compass spun wildly! (Reason: ${finishReason}). Try a different tack?`;
            if (data.promptFeedback?.blockReason) return `Avast! My message in a bottle was returned (Reason: ${data.promptFeedback.blockReason}).`;
            throw new ChatbotRequestError('The library assistant returned an unreadable response.', {
                retryable: false,
                attempts: attempt + 1
            });
        } catch (error) {
            const normalizedError = error.name === 'AbortError'
                ? new ChatbotRequestError('The library assistant took too long to answer.', {
                    retryable: true,
                    attempts: attempt + 1
                })
                : error instanceof ChatbotRequestError
                    ? error
                    : new ChatbotRequestError('The library assistant could not be reached.', {
                        retryable: true,
                        attempts: attempt + 1
                    });

            lastError = normalizedError;
            const hasAnotherAttempt = attempt + 1 < GEMINI_CLIENT_CONFIG.maxAttempts;
            if (!normalizedError.retryable || !hasAnotherAttempt) throw normalizedError;
            await waitForRetry(getBackoffDelay(attempt, normalizedError.retryAfterMs));
        } finally {
            window.clearTimeout(timeoutId);
        }
    }

    throw lastError || new ChatbotRequestError('The library assistant is unavailable.', {
        retryable: true,
        attempts: GEMINI_CLIENT_CONFIG.maxAttempts
    });
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

function renderRetryMessage(error) {
    if (!chatLogDisplayGlobal) return;
    const thinkingMessage = chatLogDisplayGlobal.querySelector('.chat-message.character.thinking');
    const message = thinkingMessage || appendMessageToChatLog('', 'character');
    message.classList.remove('thinking');
    message.classList.add('chat-message--error');
    message.replaceChildren();

    const errorText = createElement(
        'span',
        ['chat-error-copy'],
        {},
        error.retryable
            ? 'The library assistant is temporarily unavailable. Your message is saved.'
            : 'The library assistant could not process that message. Your message is still saved.'
    );
    const retryButton = createElement('button', ['chat-retry-button'], { type: 'button' }, 'Try again');
    retryButton.addEventListener('click', retryFailedTurn);
    message.append(errorText, retryButton);
    chatLogDisplayGlobal.scrollTop = chatLogDisplayGlobal.scrollHeight;
}

document.addEventListener('DOMContentLoaded', initializeChatbot);
