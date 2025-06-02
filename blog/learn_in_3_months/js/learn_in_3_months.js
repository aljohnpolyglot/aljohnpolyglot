// js/learn_in_3_months_page.js
document.addEventListener('DOMContentLoaded', function() {
    console.log("Learn in 3 Months Page Script Loaded");

    // --- Part 1: Interactive Mastery/Practice Levels Section ---
    const masteryInteractiveContainer = document.querySelector('.mastery-interactive-container');
    const explanationPanel = document.querySelector('.mastery-explanation-panel');

    if (masteryInteractiveContainer && explanationPanel) {
        const levelItems = masteryInteractiveContainer.querySelectorAll('.level-item');
        const explanationContents = explanationPanel.querySelectorAll('.explanation-content');
        const placeholderExplanation = explanationPanel.querySelector('#explanation-placeholder');

        function showSpecificExplanation(levelIdToShow) {
            let activeExplanationSet = false;
            explanationContents.forEach(content => {
                if (content.id === levelIdToShow) {
                    content.classList.add('active');
                    activeExplanationSet = true;
                } else {
                    content.classList.remove('active');
                }
            });

            if (placeholderExplanation) { // Manage placeholder visibility
                if (!activeExplanationSet) {
                    placeholderExplanation.classList.add('active');
                } else {
                    placeholderExplanation.classList.remove('active');
                }
            } else if (!activeExplanationSet && explanationContents.length > 0) {
                // Fallback if no placeholder and no specific match (e.g., show first)
                // explanationContents[0].classList.add('active'); 
            }
        }
        
        let initialLevelId = null;
        let foundActiveLevel = false;
        levelItems.forEach(item => {
            if (item.classList.contains('active-level')) { // Check if an item is pre-activated in HTML
                initialLevelId = 'explanation-' + item.dataset.level;
                foundActiveLevel = true;
            }
        });

        if (foundActiveLevel && initialLevelId) {
            showSpecificExplanation(initialLevelId);
        } else if (placeholderExplanation) {
            showSpecificExplanation(null); // This will make placeholder active via the logic in showSpecificExplanation
        }

        levelItems.forEach(item => {
            item.addEventListener('click', function() {
                levelItems.forEach(i => i.classList.remove('active-level'));
                this.classList.add('active-level');
                const level = this.dataset.level;
                showSpecificExplanation('explanation-' + level);
            });

            item.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.click();
                }
            });
        });
        console.log("Mastery Levels Interactive Section: Initialized.");
    } else {
        // console.warn("Mastery Levels Interactive Section: Required containers not found.");
    }

    // --- Part 2: Footer Current Year ---
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
        console.log("Footer Year: Updated.");
    }

    // --- Part 3: INITIALIZE THE NATIVE COMPARISON GRAPH (if placeholder exists) ---
    // This calls the function from native_comparison_graph.js
    if (document.getElementById('nativeComparisonGraphPlaceholder')) {
        if (typeof loadAndInitializeNativeComparisonGraph === 'function') {
            loadAndInitializeNativeComparisonGraph();
        } else {
            console.error("Error: loadAndInitializeNativeComparisonGraph function not found. Make sure native_comparison_graph.js is loaded before this script.");
        }
    }
});