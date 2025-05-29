'use strict';

// --- Data for Aljohn's Cove ---
// (Assuming your aljohnCoveDialogues array is defined above this line as you provided,
// and ALL riddle type entries now have an 'answer' property)
const aljohnCoveDialogues = [
    // RIDDLES (ALL must have 'answer' property if revealAnswerBtn is to work for them)
    {
        type: "riddle",
        text: "I have cities, but no houses; forests, but no trees; and water, but no fish. What am I?",
        hint: "Often consulted before a grand voyage, or even a short trip to the market square!",
        answer: "A Map (or Chart)"
    },
    {
        type: "riddle",
        text: "I speak all languages but have never learned one. Travelers carry me, yet I never move from my shelf. What am I?",
        hint: "I contain worlds within my bound pages.",
        answer: "A Book (Tome, Scroll, Codex)"
    },
    {
        type: "riddle",
        text: "What has an eye, but cannot see, a tongue that cannot speak, yet guides the wise across the deep?",
        hint: "It points the way, through storm and sun, helping lost sailors find their run.",
        answer: "A Compass (specifically, the needle)"
    },
  
    // QUOTES, TIPS, MESSAGES
    {
        type: "quote",
        text: "The truest mark of a learned captain isn't the gold in their hold, but the charts they share freely. Knowledge, like the sea, should have no master!"
    },
    {
        type: "tip",
        text: "Captain's Log, Stardate... err, I mean, ahem... When seeking hidden coves of lore online, remember that sometimes the most valuable treasures aren't marked on official maps. A keen eye for digital currents and a bit of daring can lead ye to wonders."
    },
    {
        type: "quote",
        text: "'The grandest library of Alexandria may have turned to ash, but whispers say its spirit now sails under a new banner... starts with a 'Z,' they say. A library for the modern age, vast as the ocean itself!'"
    },
    {
        type: "tip",
        text: "'Squawk! Heard tell of a lass named Anna, always mending her 'Archives' so no scroll gets lost to the digital depths. A true treasure for any scholar of the seven seas!'"
    },
    
    {
        type: "quote",
        text: "All knowledge whispers on the digital wind, free for the taking. A fool ye be if ye don't learn to set your sails on these high seas!"
    },
    {
        type: "quote",
        text: "They call it 'piracy' when we share what's locked away. I call it 'liberation' for the mind, arrr! But always respect the creators when ye can, eh?"
    },
    {
        type: "tip",
        text: "A Whisper from a Cap'n often speaks of the 'Librarian's Genesis' – a legendary first source for nearly every academic paper and tome known to seafarers. A true starting point for any quest for obscure knowledge!'"
    },
    {
        type: "quote",
        text: "A book unread is like a treasure map unfollowed. The real doubloons are the ideas within, more valuable than any gold!"
    },
    {
        type: "quote",
        text: "The gatekeepers of knowledge build high walls, but the clever navigator always finds a hidden cove or a secret passage. Just be sure it ain't a Kraken's lair!"
    },
    {
        type: "quote",
        text: "The sharpest minds find the best loot. And knowledge, matey, is the greatest treasure of all!"
    },
    {
        type: "tip",
        text: "Sometimes the search engines with advanced operators like 'site:' or 'filetype:' lead to the richest, forgotten isles of information."
    },
    {
        type: "tip",
        text: "A trusty VPN be like an enchanted fog – helps ye navigate tricky digital waters and avoid prying eyes on yer quest for knowledge."
    },
    {
        type: "message",
        text: "The digital ocean is vast, and the currents of information ever-shifting. Keep yer spyglass polished and yer wits sharp!"
    }
];


let currentAljohnDialogueIndex = 0;
let isHintRevealed = false; 
// No need for isAnswerRevealed as a toggle state anymore, 
// as revealing the answer is a one-way action for the current riddle display.

function displayAljohnCoveDialogue() {
    const dialogueTextEl = $('#aljohn-dialogue-text');
    const revealHintBtn = $('#reveal-cove-hint-btn');
    const revealAnswerBtn = $('#reveal-cove-answer-btn');
    const hintDisplayEl = $('#aljohn-cove-hint-display');
    const answerDisplayEl = $('#aljohn-cove-answer-display');

    if (!dialogueTextEl || !revealHintBtn || !revealAnswerBtn || !hintDisplayEl || !answerDisplayEl) {
        console.warn("Missing one or more dialogue display elements in Aljohn's Cove.");
        return;
    }

    // Reset states for the new entry
    isHintRevealed = false;
    hintDisplayEl.style.display = 'none';
    answerDisplayEl.style.display = 'none'; // Always hide answer initially
    revealHintBtn.textContent = "Show Hint";
    revealAnswerBtn.textContent = "Reveal Answer";

    const currentEntry = aljohnCoveDialogues[currentAljohnDialogueIndex];
    dialogueTextEl.textContent = currentEntry.text;

    if (currentEntry.type === "riddle") {
        // For riddles, hint and answer buttons are potentially visible
        revealHintBtn.style.display = currentEntry.hint ? 'inline-block' : 'none';
        revealAnswerBtn.style.display = currentEntry.answer ? 'inline-block' : 'none';
        
        if (currentEntry.hint) {
            hintDisplayEl.textContent = currentEntry.hint;
        }
        if (currentEntry.answer) {
            answerDisplayEl.textContent = `The answer be: ${currentEntry.answer}`;
        }
    } else {
        // For quotes, tips, messages - hide hint and answer buttons
        revealHintBtn.style.display = 'none';
        revealAnswerBtn.style.display = 'none';
    }
}

function initializeAljohnsCove() {
    const nextEntryBtn = $('#next-aljohn-entry-btn');
    const revealHintBtn = $('#reveal-cove-hint-btn');
    const revealAnswerBtn = $('#reveal-cove-answer-btn');
    const hintDisplayEl = $('#aljohn-cove-hint-display');
    const answerDisplayEl = $('#aljohn-cove-answer-display');

    if (!nextEntryBtn || !revealHintBtn || !revealAnswerBtn || !hintDisplayEl || !answerDisplayEl) {
        console.warn("Aljohn's Cove interaction elements not found. Cove functionality may be limited.");
        if(nextEntryBtn) nextEntryBtn.disabled = true;
        if(revealHintBtn) revealHintBtn.style.display = 'none';
        if(revealAnswerBtn) revealAnswerBtn.style.display = 'none';
        return;
    }

    // Initial dialogue display
    currentAljohnDialogueIndex = Math.floor(Math.random() * aljohnCoveDialogues.length);
    displayAljohnCoveDialogue();

    nextEntryBtn.addEventListener('click', () => {
        currentAljohnDialogueIndex = (currentAljohnDialogueIndex + 1) % aljohnCoveDialogues.length;
        displayAljohnCoveDialogue(); // This will reset button visibility and hint/answer displays
    });

    revealHintBtn.addEventListener('click', () => {
        const currentEntry = aljohnCoveDialogues[currentAljohnDialogueIndex];
        if (currentEntry.type !== "riddle" || !currentEntry.hint) return;

        // If answer is already shown, clicking hint button should not re-hide hint if it was shown due to answer.
        // However, current logic is simpler: hint button only controls hint.
        if (answerDisplayEl.style.display === 'block') {
            // If answer is shown, let hint also be shown or toggle it independently.
            // For simplicity, we'll let it toggle independently for now.
            // If you want hint to ALWAYS show when answer is shown, that's a different logic path.
        }

        isHintRevealed = !isHintRevealed;
        hintDisplayEl.style.display = isHintRevealed ? 'block' : 'none';
        revealHintBtn.textContent = isHintRevealed ? "Hide Hint" : "Show Hint";
    });

    revealAnswerBtn.addEventListener('click', () => {
        const currentEntry = aljohnCoveDialogues[currentAljohnDialogueIndex];
        if (currentEntry.type !== "riddle" || !currentEntry.answer) return;

        // When answer is revealed:
        answerDisplayEl.style.display = 'block'; // Show the answer
        revealHintBtn.style.display = 'none';    // Hide the "Show/Hide Hint" button
        revealAnswerBtn.style.display = 'none';  // Hide the "Reveal Answer" button itself

        // Ensure the hint text is also visible if an answer is revealed and a hint exists
        if (currentEntry.hint) {
            hintDisplayEl.textContent = currentEntry.hint; // Ensure it's populated
            hintDisplayEl.style.display = 'block';
            isHintRevealed = true; // Update state
            // No need to change revealHintBtn text as it's now hidden
        }
    });

    console.log("Captain Aljohn's Cove initialized for new riddle flow!");
}