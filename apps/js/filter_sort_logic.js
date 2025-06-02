// D:\website\apps\js\filter_sort_logic.js

let currentFilters = {
    keyword: '',
    cefr: [],
    // cefrUsage: '', // REMOVED - We are not using the separate intensity dropdown
    immersion: [],
    category: [],
    cost: [], // Will now expect "Free", "Freemium", "Paid"
    platform: []
};

const CEFR_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"]; // Define order for sorting

// Helper function to get a numeric value for CEFR levels for sorting
// Not strictly needed by filterAppData but good for sortAppData
function getCefrSortValue(level) {
    return CEFR_ORDER.indexOf(level);
}

function collectCurrentFilterValues() {
    currentFilters.keyword = document.getElementById('search-keyword').value.toLowerCase().trim();
    currentFilters.cefr = Array.from(document.querySelectorAll('#cefr-filter-options input[name="cefr"]:checked')).map(cb => cb.value);
    // currentFilters.cefrUsage = document.getElementById('cefr-usage-level').value; // REMOVED
    currentFilters.immersion = Array.from(document.querySelectorAll('#immersion-filter-options input[name="immersion"]:checked')).map(cb => cb.value.replace(/\s+/g, '')); // Normalized
    currentFilters.category = Array.from(document.querySelectorAll('#category-filter-options input[name="category"]:checked')).map(cb => cb.value);
    currentFilters.cost = Array.from(document.querySelectorAll('#cost-filter-options input[name="cost"]:checked')).map(cb => cb.value); // Collects Free, Freemium, Paid
    currentFilters.platform = Array.from(document.querySelectorAll('#platform-filter-options input[name="platform"]:checked')).map(cb => cb.value);
    return currentFilters;
}

function filterAppData(apps, filters) {
    return apps.filter(app => {
        const keywordMatch = filters.keyword === '' ||
                             app.name.toLowerCase().includes(filters.keyword) ||
                             app.tagline.toLowerCase().includes(filters.keyword) ||
                             (app.tags && app.tags.some(tag => tag.toLowerCase().includes(filters.keyword)));

        // REVISED AND SIMPLIFIED CEFR Logic:
        // An app matches the CEFR filter if:
        // 1. No CEFR levels are selected (shows all apps regardless of CEFR).
        // OR
        // 2. For AT LEAST ONE of the selected CEFR levels, the app's suitability for that level is "High" or "Medium".
        const cefrLevelsMatch = filters.cefr.length === 0 ||
                            filters.cefr.some(level => {
                                const usage = app.cefrSuitability[level]; // e.g., app.cefrSuitability['B1']
                                return usage === "High" || usage === "Medium";
                            });

        const immersionMatch = filters.immersion.length === 0 ||
                               filters.immersion.some(type => app.immersionTypes.map(it => it.replace(/\s+/g, '')).includes(type));

        const categoryMatch = filters.category.length === 0 ||
                              filters.category.some(cat => app.primaryCategories.includes(cat));

        const costMatch = filters.cost.length === 0 ||
                          filters.cost.includes(app.cost); // This now correctly handles "Free", "Freemium", "Paid" if they are in filters.cost

        const platformMatch = filters.platform.length === 0 ||
                              filters.platform.some(plat => app.platforms.includes(plat));

        return keywordMatch && cefrLevelsMatch && immersionMatch && categoryMatch && costMatch && platformMatch;
    });
}

function sortAppData(apps, sortByValue) {
    const sortedApps = [...apps]; // Create a new array

    switch (sortByValue) {
        case 'rating_desc':
            sortedApps.sort((a, b) => b.rating - a.rating);
            break;
        case 'rating_asc':
            sortedApps.sort((a, b) => a.rating - b.rating);
            break;
        case 'name_asc':
            sortedApps.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'name_desc':
            sortedApps.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'cefr_asc': // Sort by the lowest CEFR level an app is "High" or "Medium" for
            sortedApps.sort((a, b) => {
                const aMinLevelIndex = CEFR_ORDER.findIndex(level => {
                    const usage = a.cefrSuitability[level];
                    return usage === "High" || usage === "Medium";
                });
                const bMinLevelIndex = CEFR_ORDER.findIndex(level => {
                    const usage = b.cefrSuitability[level];
                    return usage === "High" || usage === "Medium";
                });
                // If an app has no "High" or "Medium" rating, push it to the end
                return (aMinLevelIndex === -1 ? Infinity : aMinLevelIndex) - (bMinLevelIndex === -1 ? Infinity : bMinLevelIndex);
            });
            break;
        case 'cefr_desc': // Sort by the highest CEFR level an app is "High" or "Medium" for
             sortedApps.sort((a, b) => {
                const aMaxLevelIndex = findLastIndex(CEFR_ORDER, level => {
                    const usage = a.cefrSuitability[level];
                    return usage === "High" || usage === "Medium";
                });
                const bMaxLevelIndex = findLastIndex(CEFR_ORDER, level => {
                    const usage = b.cefrSuitability[level];
                    return usage === "High" || usage === "Medium";
                });
                // If an app has no "High" or "Medium" rating, push it to the beginning (when sorting desc)
                return (bMaxLevelIndex === -1 ? -1 : bMaxLevelIndex) - (aMaxLevelIndex === -1 ? -1 : aMaxLevelIndex);
            });
            break;
    }
    return sortedApps;
}

// Helper to find last index (needed for cefr_desc sorting)
function findLastIndex(arr, predicate) {
    for (let i = arr.length - 1; i >= 0; i--) {
        if (predicate(arr[i])) {
            return i;
        }
    }
    return -1; // Return -1 if not found, handled in sort logic
}

function updateResultsCount(count) {
    const resultsCountEl = document.getElementById('results-count');
    if (resultsCountEl) {
        resultsCountEl.textContent = `${count} tool(s) found`;
    }
}