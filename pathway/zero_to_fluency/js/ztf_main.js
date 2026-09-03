// js/ztf_main.js

const GAME_TICK_INTERVAL = 1000;
const SAVE_GAME_INTERVAL = 30000;
const STORY_LOG_MAX_MESSAGES = 15;

function handleLanguageSelection(languageId) {
    console.log(`Language selected via UI: ${languageId}`);
    startGameWithLanguage(languageId); // From ztf_engine.js
    
    hideLanguageSelectionScreen();     // From ztf_ui.js
    
    if (gameState.currentLanguage && cefrLevels[gameState.currentLanguage.currentCEFR]) {
        updateCharacterArt(cefrLevels[gameState.currentLanguage.currentCEFR].characterArt);
    } else if (cefrLevels.a1) {
        updateCharacterArt(cefrLevels.a1.characterArt);
    }
    renderUpgrades(); // This will now include sort/buy qty controls
    renderLanguageProgress();
    updateDisplays();
    updateUpgradeVisibility();
}


document.addEventListener('DOMContentLoaded', () => {
    console.log("Zero To Fluency: DOMContentLoaded - Initializing game...");

    initializeUI(); 

    if (typeof initialLanguageChoices === 'undefined' || 
        typeof cefrLevels === 'undefined' || 
        typeof upgradesData === 'undefined' ||
        typeof generalExplainers === 'undefined' ||
        typeof gameState === 'undefined' || // Check if ztf_engine.js loaded gameState
        typeof createFloatingNumber === 'undefined') { // Check if ztf_features.js loaded
        console.error("CRITICAL: Essential game data or functions not found. Ensure all JS files (ztf_game_data.js, ztf_engine.js, ztf_ui.js, ztf_features.js) are loaded correctly and BEFORE ztf_main.js.");
        document.body.innerHTML = "<div style='color:red; text-align:center; padding:50px; font-size:1.5em;'>Error: Essential game components failed to load. Please check the console (F12) and ensure all script files are present and loaded in the correct order.</div>";
        return;
    }
    if (typeof updateUpgradeVisibility === 'undefined') {
    console.error("CRITICAL: updateUpgradeVisibility function not found. Ensure ztf_features.js is loaded.");
    // ... (your error display logic) ...
    return;
}

    const clickerButton = document.getElementById('click-learn-word-button');
    if (clickerButton) {
        clickerButton.addEventListener('click', () => {
            const luGained = clickLearnWord();    // From ztf_engine.js
            if (luGained > 0 && typeof createFloatingNumber === "function") {
                createFloatingNumber(luGained, clickerButton); // From ztf_features.js
            }
            // These are called after the click action
            updateDisplays();    // From ztf_ui.js 
            checkForLevelUp();   // From ztf_engine.js
        });
    } else {
        console.error("Clicker button ('click-learn-word-button') not found in HTML!");
    }

    if (loadGame()) { // loadGame() from ztf_engine.js populates gameState
        addStoryLog("Welcome back, Aspirant! Your journey continues.");
        if (gameState.currentLanguage && gameState.currentLanguage.id) {
            if (cefrLevels[gameState.currentLanguage.currentCEFR]) {
                updateCharacterArt(cefrLevels[gameState.currentLanguage.currentCEFR].characterArt);
            }
        } else { // No current language in save, or new player who cleared save then reloaded
            showLanguageSelectionScreen(true); // True because game state exists, but no active lang
             if (Object.keys(generalExplainers).length > 0 && generalExplainers.welcome) {
                triggerGeneralExplainer('welcome');
            }
        }
    } else { // No valid save, or error loading
        initializeNewGameState(); // from ztf_engine.js, sets fresh gameState
        showLanguageSelectionScreen(false); // from ztf_ui.js
        if (Object.keys(generalExplainers).length > 0 && generalExplainers.welcome) {
            triggerGeneralExplainer('welcome');
        }
        if (cefrLevels.a1) {
             updateCharacterArt(cefrLevels.a1.characterArt);
        }
    }

    // Initial UI render based on loaded/new state
    renderUpgrades();       // Will use gameState.userSettings for controls
    renderLanguageProgress();
    renderMasteredLanguages();
    updateDisplays();       // Critical to set initial button states
    updateUpgradeVisibility();


    setInterval(() => {
        gameLoop();        // from ztf_engine.js
        // Check for active click multiplier expiry inside gameLoop or here
        if (gameState.activeClickMultiplierExpiry > 0 && Date.now() > gameState.activeClickMultiplierExpiry) {
            if(gameState.activeClickMultiplier !== 1) { // only log if it actually changes
                gameState.activeClickMultiplier = 1;
                gameState.activeClickMultiplierExpiry = 0;
                addStoryLog("Active study focus (click boost) has worn off.");
            }
        }
        updateDisplays();    // from ztf_ui.js
        checkForLevelUp(); // from ztf_engine.js
        updateDisplays();    
        const previousCEFR = gameState.currentLanguage ? gameState.currentLanguage.currentCEFR : null;
        checkForLevelUp(); 
        const currentCEFR = gameState.currentLanguage ? gameState.currentLanguage.currentCEFR : null;
        if (previousCEFR !== currentCEFR) {
            updateUpgradeVisibility(); // <<< CALL IT HERE IF CEFR LEVEL CHANGED
        }
    }, GAME_TICK_INTERVAL); 
    
    setInterval(saveGame, SAVE_GAME_INTERVAL); 

    window.addEventListener('beforeunload', saveGame);

    const resetButton = document.getElementById('reset-game-button');
    if (resetButton) {
        resetButton.addEventListener('click', () => {
            resetGame(); 
        });
    }
    const saveButton = document.getElementById('save-game-button');
    if(saveButton){
        saveButton.addEventListener('click', ()=>{
            saveGame(); 
            addStoryLog("Manual save complete!");
        });
    }

    console.log("Zero To Fluency: Game Initialized and running.");
});