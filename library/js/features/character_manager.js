'use strict';

let currentCharacterForModal = null;

function initializeCharacterManager() {
    const characterPanel = $('#character-panel-sidebar');
    if (!characterPanel) {
        console.error("Character panel sidebar not found. Character manager cannot initialize.");
        return;
    }

    document.addEventListener('languageFilterChanged', (event) => {
        if (event.detail && typeof event.detail.languageCode !== 'undefined') {
            updateCharacterPanel(event.detail.languageCode);
        } else {
            console.warn("languageFilterChanged event heard, but languageCode is missing in detail.");
            updateCharacterPanel("");
        }
    });

    updateCharacterPanel($('#language-filter')?.value || "");

    const characterPortraitImg = $('#character-portrait-img', characterPanel);
    if (characterPortraitImg) {
        characterPortraitImg.addEventListener('click', openCharacterBioModal);
    }

    const closeCharacterBioBtn = $('#close-character-bio-modal');
    if (closeCharacterBioBtn) {
        closeCharacterBioBtn.addEventListener('click', closeCharacterBioModal);
    }
    const characterBioModalOverlay = $('#character-bio-modal');
    if (characterBioModalOverlay) {
        characterBioModalOverlay.addEventListener('click', (event) => {
            if (event.target === characterBioModalOverlay) {
                closeCharacterBioModal();
            }
        });
    }
}

function updateCharacterPanel(languageCode) {
    const characterPanel = $('#character-panel-sidebar');
    const characterInfoDiv = $('#character-info', characterPanel); // Get the main info div
    const characterPortraitImg = $('#character-portrait-img', characterInfoDiv);
    const characterNameLine = $('#character-name-line', characterInfoDiv); // Get the new name line div
    const characterNameDisplay = $('#character-name-display', characterNameLine); // Name is inside name-line

    const chatLogDisplay = $('#chat-log-display', characterPanel);
    const apiNote = $('.api-note', characterPanel);

    if (!characterPanel || !characterInfoDiv || !characterPortraitImg || !characterNameLine || !characterNameDisplay || !chatLogDisplay || !apiNote) {
        console.error("updateCharacterPanel: One or more critical character panel elements are missing. Check HTML structure for #character-info, #character-portrait-img, #character-name-line, #character-name-display.");
        if(characterPanel) characterPanel.style.display = 'none';
        currentCharacterForModal = null;
        return;
    }
    
    // if (typeof clearChildren === 'function') {
    //     clearChildren(chatLogDisplay);
    // } else {
    //     if (chatLogDisplay) chatLogDisplay.innerHTML = '';
    // }
    
    // Clear existing flag from the character-name-line
    const existingFlag = $('.character-flag-icon', characterNameLine);
    if (existingFlag) existingFlag.remove();


    if (!languageCode) {
        characterPanel.style.display = 'none';
        currentCharacterForModal = null;
        return;
    }

    if (!window.libraryCharacters || Object.keys(window.libraryCharacters).length === 0) {
        console.warn("`window.libraryCharacters` is not available or empty. Cannot display character.");
        characterPanel.style.display = 'none';
        currentCharacterForModal = null;
        return;
    }

    const character = Object.values(window.libraryCharacters).find(char => char.languageCode === languageCode);
    currentCharacterForModal = character; 

    if (character) {
        characterPortraitImg.src = character.imagePNG || 'images/assets/default_character_placeholder.png';
        characterPortraitImg.alt = `Portrait of ${character.name}`;
        characterNameDisplay.textContent = character.name;

        // Add flag before name, inside the #character-name-line div
        const langCodeForFlag = languageToFlagCode[character.languageCode.toLowerCase()] || character.languageCode.toLowerCase();
        const flagImg = createFlagImg(langCodeForFlag, `${character.languageCode} flag`, 'w20', ['character-flag-icon']);
        if (flagImg) {
            characterNameLine.prepend(flagImg); // Prepend to the name line container
        }

        if (apiNote) apiNote.textContent = `${character.name} awaits your query.`;

        let greetingMessage;
        if (character.dialogues && character.dialogues.length > 0) {
            greetingMessage = character.dialogues[Math.floor(Math.random() * character.dialogues.length)];
        } else {
            const langName = window.availableLanguages?.find(l => l.code === languageCode)?.name || 'these texts';
            greetingMessage = `Greetings! I am ${character.name}. How may I assist you with ${langName}?`;
        }

        // if (typeof appendMessageToChatLog === 'function') {
        //     appendMessageToChatLog(greetingMessage, 'character');
        // } else {
        //     const greetingDiv = createElement('div', ['chat-message', 'character'], {}, greetingMessage);
        //     chatLogDisplay.appendChild(greetingDiv);
        //     chatLogDisplay.scrollTop = chatLogDisplay.scrollHeight;
        // }
        characterPanel.style.display = 'block'; // Or 'flex' if character-panel-sidebar itself is a flex container
    } else {
        characterPanel.style.display = 'none';
        if (apiNote) apiNote.textContent = `Our linguist awaits your query.`;
        currentCharacterForModal = null;
    }
}

// --- openCharacterBioModal and closeCharacterBioModal remain the same as previous version ---
// They correctly target modal elements, not sidebar elements for their content.
function openCharacterBioModal() {
    if (!currentCharacterForModal) {
        console.warn("No character selected to display in modal.");
        return;
    }

    const modal = $('#character-bio-modal');
    const modalFullImg = $('#modal-character-full-img'); 
    const modalNameDisplayContainer = $('#modal-character-name-container'); 
    const modalName = $('#modal-character-name'); 
    const modalTitle = $('.modal-character-title-text');
    const modalBio = $('#modal-character-bio-long');
    const modalQuotesSection = $('#modal-character-quotes-section'); 

    if (!modal || !modalFullImg || !modalName || !modalTitle || !modalBio || !modalQuotesSection || !modalNameDisplayContainer) {
        console.error("One or more character bio modal elements are missing from the DOM.");
        return;
    }

    modalFullImg.src = currentCharacterForModal.imagePNG || 'images/assets/default_character_placeholder.png';
    modalFullImg.alt = `Full portrait of ${currentCharacterForModal.name}`;
    
    const existingModalFlag = $('.character-modal-flag-icon', modalNameDisplayContainer);
    if(existingModalFlag) existingModalFlag.remove();
    modalName.textContent = currentCharacterForModal.name;

    const langCodeForFlag = languageToFlagCode[currentCharacterForModal.languageCode.toLowerCase()] || currentCharacterForModal.languageCode.toLowerCase();
    const flagImg = createFlagImg(langCodeForFlag, `${currentCharacterForModal.languageCode} flag`, 'w20', ['character-modal-flag-icon']); 
     if (flagImg) {
        modalNameDisplayContainer.prepend(flagImg);
    }

    modalTitle.textContent = currentCharacterForModal.title;
    modalBio.textContent = currentCharacterForModal.bioLong || currentCharacterForModal.bioShort || "No detailed biography available.";

    modalQuotesSection.style.display = 'none';
    modal.style.display = 'flex';
}

function closeCharacterBioModal() {
    const modal = $('#character-bio-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Fallback appendMessageToChatLog (if not defined by chatbot_gemini.js)
if (typeof appendMessageToChatLog === 'undefined') {
    // ... (definition as before)
    console.warn("appendMessageToChatLog not defined globally, CharacterManager defining its own minimal version.");
    function appendMessageToChatLog(text, sender, isThinking = false) {
        const chatLog = $('#chat-log-display');
        if (!chatLog) return;
        const messageDiv = createElement('div', ['chat-message', sender]);
        if (isThinking) {
            messageDiv.classList.add('thinking');
            messageDiv.innerHTML = `${text} <span class="dot-elastic"></span>`;
        } else {
            messageDiv.textContent = text;
        }
        chatLog.appendChild(messageDiv);
        chatLog.scrollTop = chatLog.scrollHeight;
        return messageDiv;
    }
}