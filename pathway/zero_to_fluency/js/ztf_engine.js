// js/ztf_engine.js

// --- Game State (Initialized in ztf_main.js after loading) ---
let gameState = {
    currentLanguage: null, // Object: { id, name, currentLU, currentCEFR, flagIcon, family }
    masteredLanguages: [], // Array of language {id, name, family} objects
    ownedUpgrades: {},     // Object: { upgradeId: count, ... }
    globalLPS: 0,          // Calculated LU Per Second (after all multipliers)
    globalLU: 0,           // Total LU earned across all languages (optional, if you want to track this)
    totalClicks: 0,
    totalTimePlayed: 0,    // In seconds
    activeClickMultiplier: 1,
    activeClickMultiplierExpiry: 0,
    temporaryUpgradeCostModifier: 1,
    upgradeActionCooldowns: {}, // Stores { upgradeId: expiryTimestamp } for activatable upgrades
    clickLuFlatBonus: 0,         // Total flat bonus to clicks from upgrades
    baseClickLuMultiplier: 1,    // Multiplier for BASE_CLICK_LU from upgrades (starts at 1 for 100%)
    userSettings: {
        sortUpgradesBy: 'default', // 'default', 'affordable'
        buyQuantity: 1 // 1, 10, 100, 'MAX' (Note: store as string '1' or number 1, consistent)
    }
};

// --- Constants (Defined in ztf_main.js and accessible globally) ---
// GAME_TICK_INTERVAL, SAVE_GAME_INTERVAL, STORY_LOG_MAX_MESSAGES
const BASE_CLICK_LU = 1;
const UPGRADE_COST_INCREASE_FACTOR = 1.15; // 15% increase per level


// --- Initialization & Core Game Flow ---

function initializeNewGameState() {
    gameState = {
        currentLanguage: null,
        masteredLanguages: [],
        ownedUpgrades: {},
        globalLPS: 0,
        globalLU: 0,
        totalClicks: 0,
        totalTimePlayed: 0,
        activeClickMultiplier: 1,
        activeClickMultiplierExpiry: 0,
        temporaryUpgradeCostModifier: 1,
        upgradeActionCooldowns: {},
        clickLuFlatBonus: 0,
        baseClickLuMultiplier: 1,
        userSettings: { // Default settings
            sortUpgradesBy: 'default',
            buyQuantity: 1 // Store as number for easier parsing later
        }
    };
}

function startGameWithLanguage(languageId) {
    const langData = initialLanguageChoices.find(l => l.id === languageId);
    if (!langData) {
        console.error("Invalid language ID for starting game:", languageId);
        if (typeof showLanguageSelectionScreen === "function") showLanguageSelectionScreen();
        return;
    }
    gameState.currentLanguage = {
        id: langData.id,
        name: langData.name,
        currentLU: 0,
        currentCEFR: 'a1',
        flagIcon: langData.flagIcon,
        family: langData.family
    };
    // gameState.ownedUpgrades = {}; // Uncomment if upgrades reset per language

    if (typeof addStoryLog === "function") addStoryLog(`You have chosen to ascend in ${langData.name}! ${langData.startExplainer}`);
    if (typeof triggerGeneralExplainer === "function") triggerGeneralExplainer('deliberatePracticeIntro');
    
    calculateLPS();
    // UI Updates are handled by ztf_main.js
}
// NEW function to calculate click bonuses from all owned upgrades
function calculateClickBonuses() {
    if (!gameState || !upgradesData) return;

    let totalFlatBonus = 0;
    let totalMultiplierBonus = 0; // This will be added to the base of 1

    upgradesData.forEach(upgrade => {
        const count = gameState.ownedUpgrades[upgrade.id] || 0;
        if (count > 0) {
            if (upgrade.clickLuFlatBonus) {
                totalFlatBonus += upgrade.clickLuFlatBonus * count;
            }
            if (upgrade.baseClickLuMultiplierBonus) {
                totalMultiplierBonus += upgrade.baseClickLuMultiplierBonus * count;
            }
        }
    });

    gameState.clickLuFlatBonus = Number(loadedState.clickLuFlatBonus) || 0;
                gameState.baseClickLuMultiplier = Number(loadedState.baseClickLuMultiplier) || 1;// Base of 1 (100%) + sum of all % bonuses
}
// --- Clicker Logic ---
// --- Clicker Logic ---
function clickLearnWord() {
    if (!gameState.currentLanguage) {
        if (typeof addStoryLog === "function") addStoryLog("Please select a language to begin your studies!");
        return 0;
    }

    // ... (activeClickMultiplierExpiry check) ...

    // Incorporate new click bonuses
    const baseClickValue = (BASE_CLICK_LU * gameState.baseClickLuMultiplier) + gameState.clickLuFlatBonus;
    const luEarned = baseClickValue * gameState.activeClickMultiplier * calculateGlobalLPSMultiplier(); // Global LPS multiplier also affects clicks

    gameState.currentLanguage.currentLU = parseFloat((gameState.currentLanguage.currentLU + luEarned).toFixed(4));
    gameState.globalLU = parseFloat((gameState.globalLU + luEarned).toFixed(4));
    gameState.totalClicks++;
    return luEarned;
}

// --- Upgrade (Learning Method) Logic ---
function canAffordUpgrade(upgrade, countOverride = -1) { // countOverride for "buy max" calculation
    if (!gameState.currentLanguage) return false;
    const currentCount = countOverride >= 0 ? countOverride : (gameState.ownedUpgrades[upgrade.id] || 0);
    const cost = calculateUpgradeCost(upgrade, currentCount);
    // FIX for floating point precision on affordability check
    return gameState.currentLanguage.currentLU >= cost - 0.0001; // Allow for tiny floating point discrepancies
}

function meetsUpgradePrerequisites(upgrade) { // Removed countBeingEvaluated, as prereqs are based on current state
    if (!gameState.currentLanguage) return false;

    const currentCefrIndex = Object.keys(cefrLevels).indexOf(gameState.currentLanguage.currentCEFR);
    const requiredCefrIndex = Object.keys(cefrLevels).indexOf(upgrade.unlockLevel);
    if (currentCefrIndex < requiredCefrIndex) return false;

    if (upgrade.prerequisites && upgrade.prerequisites.upgrades) {
        for (const prereqId in upgrade.prerequisites.upgrades) {
            if ((gameState.ownedUpgrades[prereqId] || 0) < upgrade.prerequisites.upgrades[prereqId]) {
                return false;
            }
        }
    }
    if (upgrade.prerequisites && typeof upgrade.prerequisites.luWords !== 'undefined') {
        if (gameState.currentLanguage.currentLU < upgrade.prerequisites.luWords - 0.0001) {
            return false;
        }
    }
    return true;
}

function getUpgradeLockReason(upgrade) {
    if (!gameState.currentLanguage) return "Select a language first.";

    const currentCefrIndex = Object.keys(cefrLevels).indexOf(gameState.currentLanguage.currentCEFR);
    const requiredCefrIndex = Object.keys(cefrLevels).indexOf(upgrade.unlockLevel);
    if (currentCefrIndex < requiredCefrIndex) {
        return `Requires: ${cefrLevels[upgrade.unlockLevel].name}`;
    }
    if (upgrade.prerequisites && upgrade.prerequisites.upgrades) {
        for (const prereqId in upgrade.prerequisites.upgrades) {
            if ((gameState.ownedUpgrades[prereqId] || 0) < upgrade.prerequisites.upgrades[prereqId]) {
                const prereqUpgrade = upgradesData.find(u => u.id === prereqId);
                return `Requires: ${prereqUpgrade.name} (Lvl ${upgrade.prerequisites.upgrades[prereqId]})`;
            }
        }
    }
    if (upgrade.prerequisites && typeof upgrade.prerequisites.luWords !== 'undefined' && gameState.currentLanguage.currentLU < upgrade.prerequisites.luWords - 0.0001) {
        return `Requires: ~${formatNumber(upgrade.prerequisites.luWords)} LU in ${gameState.currentLanguage.name}`;
    }
    const currentCount = gameState.ownedUpgrades[upgrade.id] || 0;
    const cost = calculateUpgradeCost(upgrade, currentCount);
    if (gameState.currentLanguage.currentLU < cost - 0.0001) {
        return `Cost: ${formatNumber(cost)} LU`;
    }
    return null;
}


function buyUpgrade(upgradeId, quantityToBuySetting = gameState.userSettings.buyQuantity) {
    const upgrade = upgradesData.find(u => u.id === upgradeId);
    if (!upgrade || !gameState.currentLanguage) return;

    if (upgrade.clickLuBoost && (gameState.ownedUpgrades[upgrade.id] || 0) > 0) {
        activateUpgradeAbility(upgradeId);
        return;
    }

    let actualQuantityPurchased = 0;
    let totalCost = 0;
    let tempCurrentLU = gameState.currentLanguage.currentLU;
    let tempOwnedCount = gameState.ownedUpgrades[upgrade.id] || 0;
    const maxLevelsToBuy = quantityToBuySetting === 'MAX' ? Infinity : parseInt(quantityToBuySetting);

    for (let i = 0; i < maxLevelsToBuy; i++) {
        if (upgrade.maxOwn && tempOwnedCount >= upgrade.maxOwn) break;
        if (!meetsUpgradePrerequisites(upgrade)) break; // Check prereqs at each step if they could change (though most don't based on current upgrade's level)

        const costForNext = calculateUpgradeCost(upgrade, tempOwnedCount);
        if (tempCurrentLU >= costForNext - 0.0001) {
            tempCurrentLU -= costForNext;
            totalCost += costForNext;
            tempOwnedCount++;
            actualQuantityPurchased++;
        } else {
            break; // Cannot afford the next one
        }
    }

    if (actualQuantityPurchased === 0) {
        if (!meetsUpgradePrerequisites(upgrade)) {
            const reason = getUpgradeLockReason(upgrade) || "Prerequisites not met.";
            if (typeof showExplainerModal === "function") showExplainerModal(`${upgrade.name} - Locked`, reason, upgrade.icon);
        } else if (upgrade.maxOwn && (gameState.ownedUpgrades[upgrade.id] || 0) >= upgrade.maxOwn) {
             if (typeof addStoryLog === "function") addStoryLog(`${upgrade.name} is already at max level.`);
        } else {
            if (typeof addStoryLog === "function") addStoryLog(`Not enough LU for ${upgrade.name}.`);
        }
        return;
    }

    const isFirstTimeEverBuyingThis = !(gameState.ownedUpgrades[upgrade.id] > 0);

    if (isFirstTimeEverBuyingThis && upgrade.explainerText && actualQuantityPurchased === 1 && quantityToBuySetting !== 'MAX') {
        if (typeof showExplainerModal === "function") {
            showExplainerModal(upgrade.explainerTitle || `Unlock: ${upgrade.name}`, upgrade.explainerText, upgrade.icon, () => {
                confirmMultiplePurchases(upgrade, totalCost, actualQuantityPurchased, isFirstTimeEverBuyingThis);
            });
        } else {
            confirmMultiplePurchases(upgrade, totalCost, actualQuantityPurchased, isFirstTimeEverBuyingThis);
        }
    } else {
        confirmMultiplePurchases(upgrade, totalCost, actualQuantityPurchased, isFirstTimeEverBuyingThis);
    }
}

function confirmMultiplePurchases(upgrade, totalCost, quantityPurchased, isFirstTimeEverBuyingThis) {
    // ... (existing LU deduction, ownedUpgrades update) ...
    gameState.currentLanguage.currentLU -= totalCost;
    gameState.currentLanguage.currentLU = parseFloat(gameState.currentLanguage.currentLU.toFixed(4));

    const initialOwnedCountThisUpgrade = gameState.ownedUpgrades[upgrade.id] || 0; // Get before updating
    gameState.ownedUpgrades[upgrade.id] = (gameState.ownedUpgrades[upgrade.id] || 0) + quantityPurchased;


  let oneTimeBoostTotal = 0;
    if (upgrade.oneTimeLuBoost) {
        if (initialOwnedCountThisUpgrade === 0 && quantityPurchased > 0) {
            oneTimeBoostTotal = upgrade.oneTimeLuBoost; // Assuming it's truly one-time per upgrade ID
            gameState.currentLanguage.currentLU += oneTimeBoostTotal;
            gameState.currentLanguage.currentLU = parseFloat(gameState.currentLanguage.currentLU.toFixed(4));
            if (typeof addStoryLog === "function" && oneTimeBoostTotal > 0) addStoryLog(`${upgrade.name} provided a one-time boost of ${formatNumber(oneTimeBoostTotal)} LU!`);
        }
    }

    if (upgrade.activeClickMultiplier && upgrade.cooldown && quantityPurchased > 0) {
        // This buff usually applies once when the upgrade that grants it is acquired/activated.
        // If buying multiple levels, it typically doesn't stack or re-trigger unless designed to.
        // Assuming it triggers if at least one level is bought and wasn't active or is being refreshed.
        gameState.activeClickMultiplier = upgrade.activeClickMultiplier;
        gameState.activeClickMultiplierExpiry = Date.now() + (upgrade.cooldown * 1000);
        if (typeof addStoryLog === "function") addStoryLog(`${upgrade.name} buff activated! Click value boosted for ${formatTime(upgrade.cooldown)}!`);
    }


 if (typeof addStoryLog === "function") {
        if (quantityPurchased > 1) {
            addStoryLog(`Acquired ${upgrade.name} x${quantityPurchased} (now Level ${gameState.ownedUpgrades[upgrade.id]})!`);
        } else {
            addStoryLog(`Acquired ${upgrade.name} (now Level ${gameState.ownedUpgrades[upgrade.id]})!`);
        }
    }
    // Check if this is the very first upgrade *of any kind* the player has bought
  // ... (firstMethodUnlocked trigger) ...
     const totalUpgradesOwnedByPlayer = Object.keys(gameState.ownedUpgrades).length;
    // Check if this purchase made it the first *type* of upgrade bought
    if (isFirstTimeEverBuyingThis && initialOwnedCountThisUpgrade === 0) {
        // Count how many distinct upgrades are owned
        let distinctOwnedUpgrades = 0;
        for (const upgId in gameState.ownedUpgrades) {
            if (gameState.ownedUpgrades[upgId] > 0) {
                distinctOwnedUpgrades++;
            }
        }
        if (distinctOwnedUpgrades === 1) { // If this is the only distinct upgrade now owned
             if (typeof triggerGeneralExplainer === "function") triggerGeneralExplainer('firstMethodUnlocked');
        }
    }

  calculateLPS();
    calculateClickBonuses(); // <<< CALL NEW FUNCTION HERE
}

function activateUpgradeAbility(upgradeId) {
    const upgrade = upgradesData.find(u => u.id === upgradeId);
    if (!upgrade || !gameState.currentLanguage || !upgrade.clickLuBoost || !upgrade.cooldown) {
        console.warn("Cannot activate ability for upgrade:", upgradeId);
        return;
    }

    const currentCount = gameState.ownedUpgrades[upgrade.id] || 0;
    if (currentCount === 0) {
        if (typeof addStoryLog === "function") addStoryLog(`You need to acquire ${upgrade.name} first.`);
        return;
    }

    const cooldownEndTime = gameState.upgradeActionCooldowns[upgrade.id] || 0;
    if (Date.now() < cooldownEndTime) {
        const remaining = Math.ceil((cooldownEndTime - Date.now()) / 1000);
        if (typeof addStoryLog === "function") addStoryLog(`${upgrade.name} is on cooldown. Please wait ${formatTime(remaining)}.`);
        return;
    }

    gameState.currentLanguage.currentLU += upgrade.clickLuBoost;
    gameState.currentLanguage.currentLU = parseFloat(gameState.currentLanguage.currentLU.toFixed(4));
    gameState.upgradeActionCooldowns[upgrade.id] = Date.now() + upgrade.cooldown * 1000;

    if (typeof addStoryLog === "function") addStoryLog(`${upgrade.name} activated! Gained ${formatNumber(upgrade.clickLuBoost)} LU. Cooldown: ${formatTime(upgrade.cooldown)}.`);
    
    // if (typeof updateDisplays === "function") updateDisplays(); // Could call for immediate UI update
    // if (typeof checkForLevelUp === "function") checkForLevelUp();
}


function calculateUpgradeCost(upgrade, currentCount) {
    return Math.floor(upgrade.cost * (UPGRADE_COST_INCREASE_FACTOR ** currentCount) * gameState.temporaryUpgradeCostModifier);
}

// --- LU Per Second (LPS) Calculation ---
function calculateLPS() {
    if (!gameState.currentLanguage) {
        gameState.globalLPS = 0;
        return;
    }
    let baseLPS = 0;
    upgradesData.forEach(upgrade => {
        const count = gameState.ownedUpgrades[upgrade.id] || 0;
        if (count > 0 && typeof upgrade.baseLps === 'number' && upgrade.baseLps > 0) {
            const currentCefrIndex = Object.keys(cefrLevels).indexOf(gameState.currentLanguage.currentCEFR);
            const requiredCefrIndex = Object.keys(cefrLevels).indexOf(upgrade.unlockLevel);
            if (currentCefrIndex >= requiredCefrIndex) {
                 baseLPS += upgrade.baseLps * count;
            }
        }
    });
    gameState.globalLPS = parseFloat((baseLPS * calculateGlobalLPSMultiplier()).toFixed(4));
}

function calculateGlobalLPSMultiplier() {
    let multiplier = 1;
    if (gameState.currentLanguage && gameState.masteredLanguages.length > 0) {
        const currentLangInfo = initialLanguageChoices.find(l => l.id === gameState.currentLanguage.id);
        if (currentLangInfo) {
            gameState.masteredLanguages.forEach(masteredLangInfo => {
                const masteredLangDetails = initialLanguageChoices.find(l => l.id === masteredLangInfo.id); // Get family from initial choices
                if (masteredLangDetails && masteredLangDetails.family === currentLangInfo.family) {
                    multiplier *= 1.1;
                }
            });
        }
    }
    upgradesData.forEach(upgrade => {
        const count = gameState.ownedUpgrades[upgrade.id] || 0;
        if (count > 0 && upgrade.isGlobalMultiplier && typeof upgrade.globalLpsMultiplierBonus === 'number') {
            multiplier *= (1 + (upgrade.globalLpsMultiplierBonus * count)); // Ensure this is multiplicative if intended, or additive (1 + bonus1 + bonus2)
        }
    });
    return multiplier;
}

// --- CEFR Level Progression ---
function checkForLevelUp() {
    if (!gameState.currentLanguage) return;

    const currentLevelId = gameState.currentLanguage.currentCEFR;
    const cefrKeys = Object.keys(cefrLevels);
    const currentLevelIndex = cefrKeys.indexOf(currentLevelId);

    if (currentLevelIndex < cefrKeys.length - 1) {
        const nextLevelId = cefrKeys[currentLevelIndex + 1];
        const nextLevelData = cefrLevels[nextLevelId];

        if (gameState.currentLanguage.currentLU >= nextLevelData.luThreshold - 0.0001) { // Precision check
            gameState.currentLanguage.currentCEFR = nextLevelId;
            
            let explainerText = nextLevelData.levelUpExplainerText;
            if (explainerText.includes("[LanguageName]")) {
                explainerText = explainerText.replace(/\[LanguageName\]/g, gameState.currentLanguage.name);
            }
            if (typeof showExplainerModal === "function") showExplainerModal(nextLevelData.levelUpExplainerTitle, explainerText, nextLevelData.characterArt);
            
            if (typeof updateCharacterArt === "function") updateCharacterArt(nextLevelData.characterArt);
            if (typeof renderUpgrades === "function") renderUpgrades(); // Re-render to show newly unlocked upgrades
            
            if (nextLevelId === 'c2') {
                const currentLangFamily = initialLanguageChoices.find(l => l.id === gameState.currentLanguage.id)?.family;
                gameState.masteredLanguages.push({
                    id: gameState.currentLanguage.id,
                    name: gameState.currentLanguage.name,
                    family: currentLangFamily || 'unknown' // Store family for bonuses
                });
                let masteredExplainer = generalExplainers.languageMastered.text.replace(/\[LanguageName\]/g, gameState.currentLanguage.name);
                if (typeof showExplainerModal === "function") {
                    showExplainerModal(generalExplainers.languageMastered.title.replace(/\[LanguageName\]/g, gameState.currentLanguage.name), masteredExplainer, generalExplainers.languageMastered.icon, () => {
                        if (typeof showLanguageSelectionScreen === "function") showLanguageSelectionScreen(true);
                    });
                }
                if (typeof renderMasteredLanguages === "function") renderMasteredLanguages();
            }
            if ((nextLevelId === 'b1' || nextLevelId === 'b2') && 
                (gameState.ownedUpgrades.nativeWatchingB1 >= 1 || gameState.ownedUpgrades.nativeListeningB1 >=1 )) {
                if (typeof triggerGeneralExplainer === "function") triggerGeneralExplainer('intuitionThresholdReached');
            }
            // After level up, recalculate LPS as global multipliers (from mastered languages) might change
            calculateLPS();
        }
    }
}

// --- Game Loop & Saving/Loading ---
function gameLoop() {
    if (gameState.currentLanguage && gameState.globalLPS > 0 && typeof GAME_TICK_INTERVAL !== 'undefined') {
        const luGainedThisTick = gameState.globalLPS / (1000 / GAME_TICK_INTERVAL);
        gameState.currentLanguage.currentLU += luGainedThisTick;
        gameState.currentLanguage.currentLU = parseFloat(gameState.currentLanguage.currentLU.toFixed(4));
        gameState.globalLU += luGainedThisTick;
        gameState.globalLU = parseFloat(gameState.globalLU.toFixed(4));
    }
    if (typeof GAME_TICK_INTERVAL !== 'undefined') {
        gameState.totalTimePlayed += GAME_TICK_INTERVAL / 1000;
    }
}

function saveGame() {
    try {
        localStorage.setItem('zeroToFluencySave', JSON.stringify(gameState));
        console.log("Game Saved!", new Date().toLocaleTimeString());
    } catch (e) {
        console.error("Could not save game:", e);
        if (typeof addStoryLog === "function") addStoryLog("Error: Could not save progress. Your browser might be blocking local storage or storage is full.");
    }
}

function loadGame() {
    const savedGame = localStorage.getItem('zeroToFluencySave');
    if (savedGame) {
        try {
            const loadedState = JSON.parse(savedGame);
            if (loadedState && typeof loadedState.ownedUpgrades === 'object') {
                const defaultState = { /* ... as before ... */
                    clickLuFlatBonus: 0, baseClickLuMultiplier: 1, /* ensure these are in default */
                    userSettings: { sortUpgradesBy: 'default', buyQuantity: 1 }
                };
                gameState = {...defaultState, ...loadedState};
                // ... (ensure nested objects like userSettings, masteredLanguages, etc.)
                gameState.masteredLanguages = loadedState.masteredLanguages || [];
                gameState.ownedUpgrades = loadedState.ownedUpgrades || {};
                gameState.upgradeActionCooldowns = loadedState.upgradeActionCooldowns || {};
                gameState.userSettings = { ...defaultState.userSettings, ...(loadedState.userSettings || {}) };
                 if (gameState.userSettings.buyQuantity !== 'MAX') {
                    gameState.userSettings.buyQuantity = parseInt(gameState.userSettings.buyQuantity) || 1;
                }


                // Convert relevant numbers just in case they were stringified differently
                gameState.globalLU = Number(gameState.globalLU) || 0;
                gameState.totalClicks = Number(gameState.totalClicks) || 0;
                gameState.totalTimePlayed = Number(gameState.totalTimePlayed) || 0;
                gameState.activeClickMultiplier = Number(gameState.activeClickMultiplier) || 1;
                gameState.activeClickMultiplierExpiry = Number(gameState.activeClickMultiplierExpiry) || 0;
                if (gameState.currentLanguage) {
                    gameState.currentLanguage.currentLU = Number(gameState.currentLanguage.currentLU) || 0;
                }


                calculateLPS();
                calculateClickBonuses(); // <<< CALL NEW FUNCTION HERE
                console.log("Game Loaded!", gameState);
                return true;
            } else {
                console.warn("Saved game data is incomplete or malformed. Starting new game.");
                localStorage.removeItem('zeroToFluencySave');
            }
        } catch (e) {
            console.error("Could not parse saved game:", e);
            localStorage.removeItem('zeroToFluencySave');
        }
    }
    return false;
}

function resetGame() {
    if (confirm("Are you sure you want to reset ALL your linguistic progress? This journey cannot be unlearned (locally)!")) {
        localStorage.removeItem('zeroToFluencySave');
        initializeNewGameState(); // Sets gameState to default
        
        // Trigger UI reset functions (ensure these are defined in ztf_ui.js)
        if (typeof clearStoryLog === "function") clearStoryLog();
        if (typeof showLanguageSelectionScreen === "function") showLanguageSelectionScreen(false);
        
        // These UI updates should reflect the newly initialized gameState
        if (typeof renderUpgrades === "function") renderUpgrades();
        if (typeof renderLanguageProgress === "function") renderLanguageProgress();
        if (typeof updateDisplays === "function") updateDisplays();
        if (typeof updateCharacterArt === "function" && cefrLevels && cefrLevels.a1) {
             updateCharacterArt(cefrLevels.a1.characterArt);
        } else {
             // Fallback if cefrLevels.a1 not found, or provide a generic default art path
             if (typeof updateCharacterArt === "function") updateCharacterArt("assets/A2_art_bg_with_character.png");
        }
        if (typeof renderMasteredLanguages === "function") renderMasteredLanguages();
        if (typeof addStoryLog === "function") addStoryLog("The path has been cleared. A new linguistic ascent awaits!");
        console.log("Game Reset.");
    }
}