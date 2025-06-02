// js/ztf_features.js
console.log("Zero To Fluency: ztf_features.js loaded");
    function updateUpgradeVisibility() {
    if (!gameState || !gameState.currentLanguage || !upgradesData || !cefrLevels) {
        // console.warn("Cannot update upgrade visibility: game state or data missing.");
        return;
    }

    const currentCefrIndex = Object.keys(cefrLevels).indexOf(gameState.currentLanguage.currentCEFR);

    upgradesData.forEach(upgrade => {
        const upgradeItemElement = document.getElementById(`upgrade-item-${upgrade.id}`);
        if (upgradeItemElement) {
            const requiredCefrIndex = Object.keys(cefrLevels).indexOf(upgrade.unlockLevel);
            const isOwned = (gameState.ownedUpgrades[upgrade.id] || 0) > 0;

            // Hide if the required CEFR level is higher than current, AND the upgrade is not already owned.
            // (We might want to show owned upgrades even if current CEFR drops, though that's an edge case)
            if (requiredCefrIndex > currentCefrIndex && !isOwned) {
                upgradeItemElement.style.display = 'none';
            } else {
                // Ensure it's visible if it should be (e.g., after a level up)
                // Default display for .upgrade-item is typically 'block' or 'flex' if it's a flex child.
                // Check your CSS; assuming 'block' is fine for now.
                upgradeItemElement.style.display = ''; // Resets to CSS default (usually block)
            }
        }
    });
}
// --- Feature: Floating Click Numbers ---
function createFloatingNumber(amount, clickerButtonElement) {
    if (!clickerButtonElement || amount === 0) return; // Don't show for 0 LU

    const RENDERED_LU_PREFIX = "+"; 
    const LU_FLOAT_DURATION = 1500; // ms
    const LU_FLOAT_DISTANCE = 80; // px vertical travel
    const LU_HORIZONTAL_SPREAD = 50; // px max horizontal spread

    const numElement = document.createElement('div');
    // Use formatNumber from ztf_ui.js (it should be globally available)
    numElement.textContent = `${RENDERED_LU_PREFIX}${typeof formatNumber === 'function' ? formatNumber(amount) : amount.toFixed(1)}`; 
    numElement.classList.add('floating-number');

    document.body.appendChild(numElement);

    const rect = clickerButtonElement.getBoundingClientRect();
    // Start slightly randomized around the center-top of the button
    const initialX = rect.left + rect.width / 2 + (Math.random() * LU_HORIZONTAL_SPREAD - LU_HORIZONTAL_SPREAD / 2);
    const initialY = rect.top + rect.height / 3; // Start a bit lower on the button

    numElement.style.left = `${initialX}px`;
    numElement.style.top = `${initialY}px`;
    numElement.style.opacity = 1; // Start fully visible

    // Force a reflow to ensure transition applies from initial state
    void numElement.offsetWidth; 

    // Set target styles for CSS transition
    numElement.style.transform = `translate(-50%, -${LU_FLOAT_DISTANCE}px) scale(1.2)`;
    numElement.style.opacity = 0;

    // Remove the element after the animation
    setTimeout(() => {
        if (numElement.parentNode) {
            numElement.parentNode.removeChild(numElement);
        }
    }, LU_FLOAT_DURATION);
}