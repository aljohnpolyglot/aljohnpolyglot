// D:\website\apps\js\arsenal_main.js

document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References (cached for performance)
    const searchKeywordInput = document.getElementById('search-keyword');
    const cefrCheckboxes = document.querySelectorAll('#cefr-filter-options input[name="cefr"]');
    // cefrUsageSelect was REMOVED from HTML and here
    const immersionCheckboxes = document.querySelectorAll('#immersion-filter-options input[name="immersion"]');
    const categoryCheckboxes = document.querySelectorAll('#category-filter-options input[name="category"]'); // These will be inside the dropdown
    const costCheckboxes = document.querySelectorAll('#cost-filter-options input[name="cost"]');
    const platformCheckboxes = document.querySelectorAll('#platform-filter-options input[name="platform"]');
    const sortBySelect = document.getElementById('sort-by');
    const resetFiltersBtn = document.getElementById('reset-filters-btn');
    const appGrid = document.getElementById('app-grid'); // For event delegation

    // Consolidate all *initially visible* filter input elements for easier event listener setup
    // Checkboxes within custom dropdowns will have their listeners set up by setupCustomDropdowns
    const ALL_INITIALLY_VISIBLE_FILTER_INPUTS = [
        searchKeywordInput,
        sortBySelect,
        ...Array.from(cefrCheckboxes),
        // immersionCheckboxes might also become a dropdown, adjust if so
        ...Array.from(immersionCheckboxes), 
        ...Array.from(costCheckboxes),
        ...Array.from(platformCheckboxes)
    ].filter(input => input !== null);

    function applyFiltersAndSortAndRender() {
        const activeFilters = collectCurrentFilterValues(); // from filter_sort_logic.js
        const filteredData = filterAppData(allAppData, activeFilters); // from filter_sort_logic.js
        const sortedData = sortAppData(filteredData, sortBySelect.value); // from filter_sort_logic.js

        renderAppCards(sortedData, activeFilters); // from ui_renderer.js
        
        const resultsExist = sortedData.length > 0;
        updateGuidancePanel(activeFilters, 
            (typeof CEFR_ORDER !== 'undefined' ? CEFR_ORDER : ["A1", "A2", "B1", "B2", "C1", "C2"]), 
            resultsExist); // from guidance_logic.js
        
        updateResultsCount(sortedData.length); // from filter_sort_logic.js
    }

    function setupCustomDropdowns() {
        const dropdownContainers = document.querySelectorAll('.custom-dropdown-filter .dropdown-container');

        dropdownContainers.forEach(container => {
            const toggleBtn = container.querySelector('.dropdown-toggle-btn');
            const optionsPanel = container.querySelector('.dropdown-options-panel');
            const btnTextElement = toggleBtn.querySelector('.dropdown-btn-text');
            // Ensure btnTextElement exists before trying to access its textContent
            const originalBtnText = btnTextElement ? btnTextElement.textContent : "Select Options"; 
            const checkboxes = optionsPanel.querySelectorAll('input[type="checkbox"]');

            // Function to update button text based on selections
            function updateButtonText() {
                if (!btnTextElement) return; // Guard clause
                const selectedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked);
                if (selectedCheckboxes.length > 0) {
                    const parentLabelText = selectedCheckboxes.map(cb => {
                        // Try to get text from the label, excluding the hidden input's text
                        const labelElement = cb.closest('label');
                        return labelElement ? labelElement.textContent.replace(cb.value, '').trim() : 'Item';
                    });

                    if (selectedCheckboxes.length <= 2) {
                        btnTextElement.textContent = parentLabelText.join(', ');
                    } else {
                        // Use a more generic way to get the title if originalBtnText is just "Select Tool Types"
                        const baseTitle = container.closest('.custom-dropdown-filter').querySelector('h3')?.textContent.replace("Tool Type", "").replace("Immersion Strategy", "").trim() || originalBtnText.split(' (')[0];
                        btnTextElement.textContent = `${baseTitle} (${selectedCheckboxes.length} selected)`;
                    }
                } else {
                    btnTextElement.textContent = originalBtnText;
                }
            }

            // Toggle dropdown panel
            toggleBtn.addEventListener('click', (event) => {
                event.stopPropagation(); // Prevent click from immediately closing due to document listener
                const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
                toggleBtn.setAttribute('aria-expanded', !isExpanded);
                optionsPanel.style.display = isExpanded ? 'none' : 'block';
            });
            
            // Prevent clicks inside the options panel from closing it
            optionsPanel.addEventListener('click', (event) => {
                event.stopPropagation();
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (event) => {
                // Check if the click is outside the current dropdown container AND the panel is open
                if (!container.contains(event.target) && toggleBtn.getAttribute('aria-expanded') === 'true') {
                    toggleBtn.setAttribute('aria-expanded', 'false');
                    optionsPanel.style.display = 'none';
                }
            });
            
            // Close dropdown with Escape key
            // Event listener on document to catch Escape key globally when a dropdown is open
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
                    toggleBtn.setAttribute('aria-expanded', 'false');
                    optionsPanel.style.display = 'none';
                    toggleBtn.focus(); // Return focus to the button
                }
            });

            // Update button text when a checkbox changes & re-apply filters
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', () => {
                    updateButtonText();
                    if (typeof applyFiltersAndSortAndRender === 'function') {
                        applyFiltersAndSortAndRender();
                    }
                });
            });

            // Initial update of button text on page load
            updateButtonText();
        });
    }

    function setupEventListeners() {
        // Attach listeners to initially visible filter inputs
        ALL_INITIALLY_VISIBLE_FILTER_INPUTS.forEach(input => {
            if (input) {
                const eventType = (input.type === 'checkbox' || input.tagName === 'SELECT') ? 'change' : 'input';
                input.addEventListener(eventType, applyFiltersAndSortAndRender);
            }
        });

        if (resetFiltersBtn) {
            resetFiltersBtn.addEventListener('click', () => {
                if (searchKeywordInput) searchKeywordInput.value = '';
                // Reset all checkboxes, including those inside dropdowns
                document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(cb => cb.checked = false);
                if (sortBySelect) sortBySelect.value = 'rating_desc';
                
                applyFiltersAndSortAndRender();
                
                // After resetting, also update the display text of custom dropdown buttons
                document.querySelectorAll('.custom-dropdown-filter .dropdown-container').forEach(container => {
                    const toggleBtn = container.querySelector('.dropdown-toggle-btn');
                    const btnTextElement = toggleBtn.querySelector('.dropdown-btn-text');
                    const originalBtnText = container.dataset.originalBtnText || btnTextElement.textContent.split(' (')[0]; // Fallback
                     if (!container.dataset.originalBtnText && btnTextElement) { // Store original text if not already
                        container.dataset.originalBtnText = btnTextElement.textContent;
                    }
                    btnTextElement.textContent = container.dataset.originalBtnText;
                });
            });
        }

        if (appGrid) {
            appGrid.addEventListener('click', (event) => {
                const targetButton = event.target.closest('.app-card-details-btn');
                if (targetButton && targetButton.dataset.appId) {
                    openModal(targetButton.dataset.appId); // from modal_handler.js
                }
            });
        }
        
        setupModalEventListeners(); // from modal_handler.js
    }

    // --- Initial Load ---
    if (typeof allAppData !== 'undefined' && allAppData.length > 0) {
        if (typeof collectCurrentFilterValues === 'function' &&
            typeof filterAppData === 'function' &&
            typeof sortAppData === 'function' &&
            typeof renderAppCards === 'function' &&
            typeof updateGuidancePanel === 'function' &&
            typeof updateResultsCount === 'function' &&
            typeof openModal === 'function' &&
            typeof setupModalEventListeners === 'function') {
            
            // Store original button texts for dropdowns before first render
            document.querySelectorAll('.custom-dropdown-filter .dropdown-toggle-btn .dropdown-btn-text').forEach(btnTextEl => {
                const container = btnTextEl.closest('.dropdown-container');
                if (container) {
                    container.dataset.originalBtnText = btnTextEl.textContent;
                }
            });

            applyFiltersAndSortAndRender(); // Initial render
            setupEventListeners(); // Sets up listeners for standard inputs & modal
            setupCustomDropdowns(); // Sets up listeners and behavior for new custom dropdowns

        } else {
            console.error("CRITICAL ERROR: One or more essential functions from linked JS files are not defined. Check script loading order and ensure all JS files (apps_data.js, filter_sort_logic.js, guidance_logic.js, ui_renderer.js, modal_handler.js) are present and correctly linked before arsenal_main.js.");
            const tempAppGrid = document.getElementById('app-grid');
            if(tempAppGrid) tempAppGrid.innerHTML = "<p class='error-message'>Error initializing the application. Essential components missing.</p>";
        }
    } else {
        console.error("CRITICAL ERROR: App data (allAppData) not found or is empty. Make sure apps_data.js is loaded first and populated correctly.");
        const tempAppGrid = document.getElementById('app-grid');
        if(tempAppGrid) tempAppGrid.innerHTML = "<p class='error-message'>Could not load app data. Please ensure apps_data.js is correct and loaded first.</p>";
    }
});