// js/ztf_ui.js

// --- DOM Element References (cached by initializeUI) ---
let studyPointsDisplayUI, spsDisplayUI, clickerButtonUI, clickerButtonImageUI, upgradesPanelUI, masteredLanguagesListUI, storyLogUI;
let languageChoiceScreenUI, languageChoiceTitleUI, languageOptionsListUI;
let explainerModalUI, explainerTitleUI, explainerTextUI, explainerIconUI, explainerConfirmButtonUI;
let currentLanguageNameUI, currentCefrLevelUI, currentLanguageFlagUI, languageProgressBarFillUI, languageProgressTextUI;
let characterArtImageUI;
let totalClicksStatUI, timePlayedStatUI;

// STORY_LOG_MAX_MESSAGES will be a global const from ztf_main.js

// --- UI Initialization ---
function initializeUI() {
    studyPointsDisplayUI = document.getElementById('study-points-value');
    spsDisplayUI = document.getElementById('sps-value');
    clickerButtonUI = document.getElementById('click-learn-word-button');
    clickerButtonImageUI = clickerButtonUI ? clickerButtonUI.querySelector('img') : null;
    upgradesPanelUI = document.getElementById('upgrades-panel-content');
    masteredLanguagesListUI = document.getElementById('mastered-languages-list');
    storyLogUI = document.getElementById('story-log-messages');
    
    currentLanguageNameUI = document.getElementById('current-language-name');
    currentCefrLevelUI = document.getElementById('current-cefr-level');
    currentLanguageFlagUI = document.getElementById('current-language-flag');
    languageProgressBarFillUI = document.getElementById('language-progress-bar-fill');
    languageProgressTextUI = document.getElementById('language-progress-text');
    characterArtImageUI = document.getElementById('main-character-art');

    totalClicksStatUI = document.getElementById('total-clicks-stat');
    timePlayedStatUI = document.getElementById('time-played-stat');
    
    languageChoiceScreenUI = document.getElementById('language-choice-screen');
    if (languageChoiceScreenUI) {
        languageChoiceTitleUI = languageChoiceScreenUI.querySelector('h2');
        languageOptionsListUI = languageChoiceScreenUI.querySelector('.language-options-list');
        languageChoiceScreenUI.addEventListener('click', (e) => {
            if (e.target === languageChoiceScreenUI && gameState && gameState.currentLanguage) {
                hideLanguageSelectionScreen();
            }
        });
    }

    explainerModalUI = document.getElementById('explainer-modal');
    if (explainerModalUI) {
        explainerTitleUI = document.getElementById('explainer-title');
        explainerTextUI = document.getElementById('explainer-text');
        explainerIconUI = document.getElementById('explainer-icon');
        explainerConfirmButtonUI = document.getElementById('explainer-confirm-button');
        const closeButton = explainerModalUI.querySelector('.explainer-modal-close');
        if (closeButton) closeButton.addEventListener('click', hideExplainerModal);
        explainerModalUI.addEventListener('click', (e) => {
            if (e.target === explainerModalUI) hideExplainerModal();
        });
    }
    console.log("UI Initialized and elements cached.");
}

// --- UI Update Functions ---
function updateDisplays() {
    if (!gameState || !upgradesData) { console.error("gameState or upgradesData not available for UI update."); return; }

    if (gameState.currentLanguage) {
        if (studyPointsDisplayUI) studyPointsDisplayUI.textContent = formatNumber(gameState.currentLanguage.currentLU);
        if (spsDisplayUI) spsDisplayUI.textContent = formatNumber(gameState.globalLPS);
    } else {
        if (studyPointsDisplayUI) studyPointsDisplayUI.textContent = '0';
        if (spsDisplayUI) spsDisplayUI.textContent = '0';
    }

    if (totalClicksStatUI) totalClicksStatUI.textContent = formatNumber(gameState.totalClicks);
    if (timePlayedStatUI) timePlayedStatUI.textContent = formatTime(gameState.totalTimePlayed);

    const buyQtySetting = gameState.userSettings.buyQuantity; // '1', '10', '100', 'MAX' (or corresponding numbers)
    const buyQtyNum = buyQtySetting === 'MAX' ? Infinity : parseInt(buyQtySetting);

    upgradesData.forEach(upgrade => {
        const btn = document.getElementById(`upgrade-btn-${upgrade.id}`);
        if (btn) {
            const currentCount = gameState.ownedUpgrades[upgrade.id] || 0;
            const isMaxed = upgrade.maxOwn && currentCount >= upgrade.maxOwn;
            const meetsPrereqs = meetsUpgradePrerequisites(upgrade); // From ztf_engine.js
            
            const costDisplay = btn.querySelector('.item-cost');
            const itemNameDisplay = btn.querySelector('.item-name');

            // Handle activatable upgrades (like Journaling)
            if (upgrade.clickLuBoost && upgrade.cooldown && currentCount > 0) {
                const cooldownEndTime = gameState.upgradeActionCooldowns[upgrade.id] || 0;
                const now = Date.now();
                if (now < cooldownEndTime) {
                    btn.disabled = true;
                    btn.classList.add('on-cooldown');
                    btn.classList.remove('locked', 'maxed', 'affordable');
                    if (costDisplay) {
                        const remainingSeconds = Math.ceil((cooldownEndTime - now) / 1000);
                        costDisplay.textContent = `Cooldown: ${formatTime(remainingSeconds)}`;
                    }
                } else {
                    btn.disabled = false;
                    btn.classList.remove('on-cooldown', 'locked', 'maxed');
                    btn.classList.add('affordable'); // Mark as activatable
                    if (costDisplay) costDisplay.textContent = `ACTIVATE (+${formatNumber(upgrade.clickLuBoost)} LU)`;
                }
                if (itemNameDisplay) itemNameDisplay.textContent = `${upgrade.name} (Owned)`;
            } else { // Regular buy/level up logic
                let cumulativeCost = 0;
                let numCanBuy = 0;
                let tempCurrentLU = gameState.currentLanguage ? gameState.currentLanguage.currentLU : 0;
                let tempOwnedCount = currentCount;

                for (let i = 0; i < buyQtyNum; i++) {
                    if (upgrade.maxOwn && tempOwnedCount >= upgrade.maxOwn) break;
                    const costForNext = calculateUpgradeCost(upgrade, tempOwnedCount);
                    if (tempCurrentLU >= costForNext - 0.0001) {
                        if (meetsPrereqs) { // Only count if prereqs met for the first one
                            tempCurrentLU -= costForNext;
                            cumulativeCost += costForNext;
                            numCanBuy++;
                            tempOwnedCount++;
                        } else {
                            break; // Prereqs not met for this upgrade path
                        }
                    } else {
                        break;
                    }
                }
                
                const canAffordCurrentSetting = numCanBuy > 0;
                btn.disabled = isMaxed || !canAffordCurrentSetting || !meetsPrereqs;

                btn.classList.toggle('locked', (!canAffordCurrentSetting || !meetsPrereqs) && !isMaxed);
                btn.classList.toggle('maxed', isMaxed);
                btn.classList.toggle('affordable', canAffordCurrentSetting && meetsPrereqs && !isMaxed);
                btn.classList.remove('on-cooldown');

                if (costDisplay) {
                    if (isMaxed) {
                        costDisplay.textContent = 'MAXED';
                    } else if (!meetsPrereqs) {
                        costDisplay.textContent = `Locked`; // Or show specific lock reason
                    }
                     else if (buyQtySetting === 'MAX') {
                        costDisplay.textContent = canAffordCurrentSetting ? `Buy Max (${numCanBuy > 0 ? numCanBuy : '?'})` : `${formatNumber(calculateUpgradeCost(upgrade, currentCount))} LU`;
                    } else {
                         costDisplay.textContent = `${formatNumber(cumulativeCost > 0 ? cumulativeCost : calculateUpgradeCost(upgrade,currentCount))} LU (x${numCanBuy > 0 ? numCanBuy : buyQtySetting})`;
                         if (numCanBuy < parseInt(buyQtySetting) && numCanBuy > 0 && !isMaxed && meetsPrereqs){
                            // If can't afford full quantity but can afford some
                            costDisplay.textContent = `${formatNumber(cumulativeCost)} LU (x${numCanBuy})`;
                         } else if (numCanBuy === 0 && !isMaxed && meetsPrereqs) {
                            // Can't afford even one at current setting, show cost for one
                            costDisplay.textContent = `${formatNumber(calculateUpgradeCost(upgrade,currentCount))} LU (x1)`;
                         }
                    }
                }
                if (itemNameDisplay) {
                    itemNameDisplay.textContent = `${upgrade.name} ${currentCount > 0 ? `(Lvl ${currentCount})` : ''}`;
                }
            }
        }
    });
    renderLanguageProgress();
}

function renderUpgrades() {
    if (!upgradesPanelUI || !gameState || !upgradesData) return;
    upgradesPanelUI.innerHTML = ''; 

    // --- Create controls container ---
    const controlsContainer = document.createElement('div');
    controlsContainer.classList.add('upgrades-controls');
    
    // Buy Quantity Selector
    const buyQtyGroup = document.createElement('div');
    buyQtyGroup.classList.add('control-group');
    const buyQtyLabel = document.createElement('label');
    buyQtyLabel.textContent = 'Buy Qty: ';
    buyQtyLabel.htmlFor = 'buy-qty-select';
    const buyQtySelect = document.createElement('select');
    buyQtySelect.id = 'buy-qty-select';
    ['1', '10', '100', 'MAX'].forEach(qty => {
        const option = document.createElement('option');
        option.value = qty;
        option.textContent = qty;
        // gameState.userSettings.buyQuantity could be number or 'MAX'
        if (String(gameState.userSettings.buyQuantity) === qty) option.selected = true;
        buyQtySelect.appendChild(option);
    });
    buyQtySelect.onchange = (e) => {
        gameState.userSettings.buyQuantity = e.target.value === 'MAX' ? 'MAX' : parseInt(e.target.value);
        updateDisplays(); // Update button costs and states
    };
    buyQtyGroup.appendChild(buyQtyLabel);
    buyQtyGroup.appendChild(buyQtySelect);
    controlsContainer.appendChild(buyQtyGroup);

    // Sort Options
    const sortGroup = document.createElement('div');
    sortGroup.classList.add('control-group');
    const sortLabel = document.createElement('label');
    sortLabel.textContent = 'Sort: ';
    sortLabel.htmlFor = 'sort-upgrades-select';
    const sortSelect = document.createElement('select');
    sortSelect.id = 'sort-upgrades-select';
    const sortOptions = { default: 'Default', affordable: 'Affordable First' };
    for (const key in sortOptions) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = sortOptions[key];
        if (gameState.userSettings.sortUpgradesBy === key) option.selected = true;
        sortSelect.appendChild(option);
    }
    sortSelect.onchange = (e) => {
        gameState.userSettings.sortUpgradesBy = e.target.value;
        renderUpgrades(); // Re-render the whole list with new sort
    };
    sortGroup.appendChild(sortLabel);
    sortGroup.appendChild(sortSelect);
    controlsContainer.appendChild(sortGroup);
    // Prepend controls to the panel content area, not the panel itself
    const upgradesGridContainer = document.createElement('div');
    upgradesGridContainer.classList.add('upgrades-grid'); // This will hold the actual upgrades
    
    upgradesPanelUI.appendChild(controlsContainer);
    upgradesPanelUI.appendChild(upgradesGridContainer);


    let sortedUpgrades = [...upgradesData];

    if (gameState.userSettings.sortUpgradesBy === 'affordable') {
        sortedUpgrades.sort((a, b) => {
            const getScore = (upg) => {
                const ownedCount = gameState.ownedUpgrades[upg.id] || 0;
                const isMaxed = upg.maxOwn && ownedCount >= upg.maxOwn;
                const meetsPrereqsVal = meetsUpgradePrerequisites(upg); // From engine

                if (upg.clickLuBoost && ownedCount > 0) { // Activatable
                    const cooldownEndTime = gameState.upgradeActionCooldowns[upg.id] || 0;
                    return Date.now() >= cooldownEndTime ? 0 : 2; // 0 if ready, 2 if on cooldown
                }
                if (isMaxed) return 5;
                if (!meetsPrereqsVal) return 4; // Locked by CEFR/other prereqs

                // Check affordability for current buyQuantity setting
                let canAffordThisBuySetting = false;
                const buyQty = gameState.userSettings.buyQuantity;
                const buyQtyNumSort = buyQty === 'MAX' ? 1 : parseInt(buyQty); // For MAX, check if can afford at least 1
                
                let tempLUSort = gameState.currentLanguage ? gameState.currentLanguage.currentLU : 0;
                let tempOwnedSort = ownedCount;
                let numCanActuallyBuySort = 0;

                for(let i=0; i < buyQtyNumSort; i++){
                    if(upg.maxOwn && tempOwnedSort >= upg.maxOwn) break;
                    const costNextSort = calculateUpgradeCost(upg, tempOwnedSort);
                    if(tempLUSort >= costNextSort - 0.0001){
                        tempLUSort -= costNextSort;
                        numCanActuallyBuySort++;
                        tempOwnedSort++;
                    } else {
                        break;
                    }
                }
                canAffordThisBuySetting = numCanActuallyBuySort > 0;

                if (canAffordThisBuySetting) return 1; // Affordable
                return 3; // Not affordable but meets prereqs
            };

            const scoreA = getScore(a);
            const scoreB = getScore(b);

            if (scoreA !== scoreB) return scoreA - scoreB;
            
            // Secondary sort: by base cost if scores are equal
            return (calculateUpgradeCost(a, gameState.ownedUpgrades[a.id] || 0)) - (calculateUpgradeCost(b, gameState.ownedUpgrades[b.id] || 0));
        });
    }


    sortedUpgrades.forEach(upgrade => {
        const currentCount = gameState.ownedUpgrades[upgrade.id] || 0;
        const cost = calculateUpgradeCost(upgrade, currentCount);
        const isMaxed = upgrade.maxOwn && currentCount >= upgrade.maxOwn;
        const isOwned = currentCount > 0;
        const hasExplainer = !!upgrade.explainerText;

        const isAvailableByLevel = gameState.currentLanguage && 
                                   Object.keys(cefrLevels).indexOf(gameState.currentLanguage.currentCEFR) >= 
                                   Object.keys(cefrLevels).indexOf(upgrade.unlockLevel);

        const itemWrapper = document.createElement('div');
        itemWrapper.classList.add('upgrade-item');
        itemWrapper.id = `upgrade-item-${upgrade.id}`;

        const button = document.createElement('button');
        button.id = `upgrade-btn-${upgrade.id}`;
        button.classList.add('upgrade-button');
        button.disabled = true; 

        let productionText = '';
        if (upgrade.baseLps > 0) {
            let currentLpsFromThis = 0;
            if (isOwned) currentLpsFromThis = upgrade.baseLps * currentCount;
            let nextLpsFromThis = upgrade.baseLps * (currentCount + 1); // Potential LPS if one more is bought
            productionText = `+${formatNumber(nextLpsFromThis - currentLpsFromThis)} LPS`;
            if (isOwned) productionText += ` (Total: ${formatNumber(currentLpsFromThis)} LPS)`;
        }
        // NEW: Display for click upgrades
        else if (upgrade.clickLuFlatBonus) {
            const bonusPerLevel = upgrade.clickLuFlatBonus;
            productionText = `+${formatNumber(bonusPerLevel)} LU/click`;
            if (isOwned) {
                productionText += ` (Total: +${formatNumber(bonusPerLevel * currentCount)} LU/click)`;
            }
        }
        else if (upgrade.baseClickLuMultiplierBonus) {
            const bonusPerLevel = upgrade.baseClickLuMultiplierBonus * 100; // As percentage
            productionText = `+${bonusPerLevel.toFixed(0)}% Base Click Power`;
             if (isOwned) {
                productionText += ` (Total: +${(bonusPerLevel * currentCount).toFixed(0)}%)`;
            }
        }
        else if (upgrade.oneTimeLuBoost && !isOwned) productionText = `+${formatNumber(upgrade.oneTimeLuBoost)} LU (One-time)`; // Show only if not owned
        else if (upgrade.globalLpsMultiplierBonus) productionText = `+${(upgrade.globalLpsMultiplierBonus * 100).toFixed(0)}% Global LPS`;
        else if (upgrade.activeClickMultiplier || upgrade.clickMultiplierBoost) productionText = `Boosts Active Study`;
        else if (upgrade.clickLuBoost) productionText = isOwned ? `Activate: +${formatNumber(upgrade.clickLuBoost)} LU` : `Unlock: +${formatNumber(upgrade.clickLuBoost)} LU on activation`;
        else productionText = 'Special Effect';


        button.innerHTML = `
            <img src="${upgrade.icon || 'assets/A2_textbook_icon.png'}" alt="${upgrade.name}" class="item-icon">
            <div class="item-info">
                <span class="item-name">${upgrade.name} ${currentCount > 0 && !upgrade.clickLuBoost ? `(Lvl ${currentCount})` : (isOwned && upgrade.clickLuBoost ? '(Owned)' : '')}</span>
                <span class="item-desc">${upgrade.description}</span>
                <span class="item-prod">${productionText}</span>
            </div>
            <div class="item-cost-container">
                <span class="item-cost">${isMaxed ? 'MAXED' : `${formatNumber(cost)} LU`}</span>
            </div>
        `;
        
        if (hasExplainer) {
            button.dataset.explainerTitle = upgrade.explainerTitle || `Insight: ${upgrade.name}`;
            button.dataset.explainerText = upgrade.explainerText;
            button.dataset.explainerIcon = upgrade.icon || 'assets/A2_textbook_icon.png'; // Default icon if none
            itemWrapper.title = "Left-click to buy/activate. Right-click for notes.";
        } else {
            itemWrapper.title = upgrade.description;
        }
       
        button.onclick = () => { // Simplified: engine's buyUpgrade now handles activatables and quantity
            buyUpgrade(upgrade.id); // Engine will use gameState.userSettings.buyQuantity
            // Main.js loop handles updateDisplays and checkForLevelUp after the event
        };
        
        if (hasExplainer) {
            button.oncontextmenu = (e) => {
                e.preventDefault();
                showExplainerModal(
                    button.dataset.explainerTitle,
                    button.dataset.explainerText,
                    button.dataset.explainerIcon
                );
            };
        }
       
        if (!isAvailableByLevel && !isOwned) { // Only apply CEFR lock visual if not already owned
            itemWrapper.classList.add('cefr-locked');
            // Update title to reflect it's CEFR locked, but still allow right-click for info
            button.title = `Requires ${cefrLevels[upgrade.unlockLevel].name}. (Right-click for notes if available)`;
            button.disabled = true; // Ensure it's disabled
        }

        itemWrapper.appendChild(button);
        upgradesGridContainer.appendChild(itemWrapper); // Add to the grid container
    });
    updateDisplays(); // Final pass to set all button states correctly
}

function renderLanguageProgress() {
    if (!gameState || !languageProgressBarFillUI || !languageProgressTextUI || !currentLanguageNameUI || !currentCefrLevelUI || !currentLanguageFlagUI) {
        if (characterArtImageUI) characterArtImageUI.src = "assets/A2_art_bg_with_character.png";
        return;
    }
    if (!gameState.currentLanguage) {
        if (currentLanguageNameUI) currentLanguageNameUI.textContent = "No Language";
        if (currentCefrLevelUI) currentCefrLevelUI.textContent = "Awaiting Ascent...";
        if (currentLanguageFlagUI) { currentLanguageFlagUI.src = ""; currentLanguageFlagUI.alt = ""; }
        if (languageProgressBarFillUI) languageProgressBarFillUI.style.width = '0%';
        if (languageProgressTextUI) languageProgressTextUI.textContent = "Select a language to begin your journey.";
        if (characterArtImageUI) characterArtImageUI.src = "assets/A2_art_bg_with_character.png";
        return;
    }

    currentLanguageNameUI.textContent = gameState.currentLanguage.name;
    currentCefrLevelUI.textContent = cefrLevels[gameState.currentLanguage.currentCEFR].name;
    currentLanguageFlagUI.src = gameState.currentLanguage.flagIcon;
    currentLanguageFlagUI.alt = `${gameState.currentLanguage.name} Flag`;

    const currentLevelData = cefrLevels[gameState.currentLanguage.currentCEFR];
    const cefrKeys = Object.keys(cefrLevels);
    const currentLevelIndex = cefrKeys.indexOf(gameState.currentLanguage.currentCEFR);
    
    if (currentLevelIndex < cefrKeys.length - 1) {
        const nextLevelId = cefrKeys[currentLevelIndex + 1];
        const nextLevelData = cefrLevels[nextLevelId];
        // Progress is LU accumulated *within* the current CEFR level's requirements for the bar
        const luEarnedForThisLevel = gameState.currentLanguage.currentLU - currentLevelData.luThreshold;
        const luNeededForNextLevelFromCurrent = nextLevelData.luThreshold - currentLevelData.luThreshold;
        
        const progressPercent = luNeededForNextLevelFromCurrent > 0 ? Math.min(100, Math.max(0, (luEarnedForThisLevel / luNeededForNextLevelFromCurrent) * 100)) : 100;
        
        languageProgressBarFillUI.style.width = `${progressPercent}%`;
        // CORRECTED TEXT: Show current total LU / LU needed for NEXT CEFR level.
        languageProgressTextUI.textContent = `${formatNumber(gameState.currentLanguage.currentLU)} / ${formatNumber(nextLevelData.luThreshold)} LU to ${nextLevelData.name}`;
    } else {
        languageProgressBarFillUI.style.width = '100%';
        languageProgressTextUI.textContent = "Grand Master! Ready to Ascend Anew?";
    }
}

function updateCharacterArt(artPath) {
    if (characterArtImageUI && artPath && characterArtImageUI.src !== artPath) {
        characterArtImageUI.style.opacity = 0;
        setTimeout(() => {
            characterArtImageUI.src = artPath;
            characterArtImageUI.style.opacity = 1;
        }, 250);
    } else if (characterArtImageUI && artPath && characterArtImageUI.style.opacity !== 1) {
        characterArtImageUI.src = artPath;
        characterArtImageUI.style.opacity = 1;
    }
}

function showExplainerModal(title, text, iconPath, onConfirmCallback = null) {
    if (!explainerModalUI || !explainerTitleUI || !explainerTextUI || !explainerIconUI || !explainerConfirmButtonUI) {
        console.warn("Explainer modal elements not found."); return;
    }
    
    explainerTitleUI.textContent = title;
    explainerTextUI.innerHTML = text;
    if (iconPath) {
        explainerIconUI.src = iconPath;
        explainerIconUI.style.display = 'block';
    } else {
        explainerIconUI.style.display = 'none';
    }

    // Clone and replace button to remove old listeners
    const newConfirmButton = explainerConfirmButtonUI.cloneNode(true);
    explainerConfirmButtonUI.parentNode.replaceChild(newConfirmButton, explainerConfirmButtonUI);
    explainerConfirmButtonUI = newConfirmButton;

    explainerConfirmButtonUI.onclick = () => {
        hideExplainerModal();
        if (onConfirmCallback && typeof onConfirmCallback === 'function') {
            onConfirmCallback();
        }
    };
    
    explainerModalUI.classList.add('visible');
}

function hideExplainerModal() {
    if (explainerModalUI) explainerModalUI.classList.remove('visible');
}

function showLanguageSelectionScreen(isChoosingNext = false) {
    if (!languageChoiceScreenUI || !languageChoiceTitleUI || !languageOptionsListUI) {
        console.warn("Language choice screen elements not found."); return;
    }
    
    languageChoiceTitleUI.textContent = isChoosingNext ? "Choose Your Next Linguistic Ascent!" : "Select Your First Language to Master";
    languageOptionsListUI.innerHTML = '';

    initialLanguageChoices.forEach(lang => {
        const isMastered = gameState && gameState.masteredLanguages && gameState.masteredLanguages.some(ml => ml.id === lang.id);
        // Only show languages that haven't been mastered IF we are choosing the *next* language.
        // If it's the initial choice (isChoosingNext = false), show all.
        if (!isMastered || !isChoosingNext) {
             // If mastered but it's not "choosing next" (e.g. showing all for some reason), still list them, maybe styled differently.
             // For this game, if mastered, don't show in selection screen.
            if (isMastered && isChoosingNext) return; // Skip if mastered and choosing next

            const langButton = document.createElement('button');
            langButton.classList.add('language-choice-button');
            langButton.dataset.langId = lang.id;
            langButton.innerHTML = `
                <img src="${lang.flagIcon}" alt="${lang.name} Flag">
                <span>${lang.name}</span>
                <small>(Difficulty: ${lang.difficulty}/5 | Resources: ${lang.resources}/5)</small>
            `;
            langButton.onclick = () => {
                if (typeof handleLanguageSelection === "function") {
                    handleLanguageSelection(lang.id); // Defined in ztf_main.js
                } else {
                    console.error("handleLanguageSelection function is not defined globally or in ztf_main.js");
                }
            };
            languageOptionsListUI.appendChild(langButton);
        }
    });
    languageChoiceScreenUI.classList.add('visible');
}

function hideLanguageSelectionScreen() {
    if (languageChoiceScreenUI) languageChoiceScreenUI.classList.remove('visible');
}

function addStoryLog(message) {
    if (!storyLogUI) return;
    const p = document.createElement('p');
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    p.innerHTML = `<span>[${timestamp}]</span> ${message}`;
    storyLogUI.appendChild(p);
    if (typeof STORY_LOG_MAX_MESSAGES !== 'undefined' && storyLogUI.children.length > STORY_LOG_MAX_MESSAGES) {
        storyLogUI.removeChild(storyLogUI.firstChild);
    }
    storyLogUI.scrollTop = storyLogUI.scrollHeight;
}

function clearStoryLog() {
    if(storyLogUI) storyLogUI.innerHTML = '<p>A new chapter begins...</p>';
}

function triggerGeneralExplainer(explainerKey, params = {}) {
    if (generalExplainers && generalExplainers[explainerKey]) {
        let text = generalExplainers[explainerKey].text;
        if (params.LanguageName) {
            text = text.replace(/\[LanguageName\]/g, params.LanguageName);
        }
        showExplainerModal(generalExplainers[explainerKey].title, text, generalExplainers[explainerKey].icon);
    }
}

function renderMasteredLanguages() {
    if (!masteredLanguagesListUI || !gameState) return;
    masteredLanguagesListUI.innerHTML = '';
    if (gameState.masteredLanguages.length === 0) {
        masteredLanguagesListUI.innerHTML = '<p class="panel-placeholder-text">No languages mastered yet. Your legend awaits!</p>';
        return;
    }
    gameState.masteredLanguages.forEach(langInfo => {
        const langChoiceData = initialLanguageChoices.find(l=>l.id === langInfo.id);
        const langDiv = document.createElement('div');
        langDiv.classList.add('mastered-language-item');
        langDiv.innerHTML = `<img src="${langChoiceData?.flagIcon || ''}" alt="${langInfo.name} Flag"> <span>${langInfo.name} (C2 Master)</span>`;
        masteredLanguagesListUI.appendChild(langDiv);
    });
}

// Helper to format numbers
function formatNumber(num) {
    if (num === undefined || num === null || isNaN(num)) return '0';
    num = parseFloat(num); // Ensure it's a number
    if (Math.abs(num) < 1 && num !== 0) return num.toFixed(2);
    if (num < 1000) return num.toFixed(num % 1 === 0 ? 0 : (Math.abs(num) < 10 ? 2 : 1));
    if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
    if (num < 1000000000) return (num / 1000000).toFixed(1) + 'M';
    return (num / 1000000000).toFixed(1) + 'B';
}

function formatTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "0s";
    totalSeconds = Math.floor(totalSeconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    let timeString = "";
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0 || (hours > 0 && (minutes > 0 || seconds > 0))) timeString += `${minutes}m `; // Show minutes if hours are shown, or if minutes exist
    if (timeString === "" || seconds > 0 || (minutes > 0 && seconds === 0) || (hours > 0 && minutes === 0 && seconds === 0) ) { // Show seconds if it's the only unit, or if other units are present
         timeString += `${seconds}s`;
    }
    return timeString.trim() || "0s"; // Ensure "0s" if string is empty
}