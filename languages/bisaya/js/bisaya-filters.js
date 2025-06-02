// js/bisaya-filters.js

// This script should be loaded AFTER bisaya-data.js

function initializeBisayaFilters() {
    console.log("BISAYA FILTERS: Initializing filter system...");

    // --- DOM Element Selectors ---
    const filterButtons = document.querySelectorAll('.filter-sidebar-bisaya .btn-filter, .platform-buttons-compact .btn-filter-platform');
    const regionSelect = document.getElementById('region-filter-select');
    const creatorGridEl = document.getElementById('creator-grid-bisaya');
    const clearFiltersBtn = document.getElementById('clear-all-filters-btn');
    const sortButtons = document.querySelectorAll('.sort-controls-container .btn-sort');
    const paginationContainerEl = document.getElementById('pagination-controls-bisaya');

    // --- Essential Element & Data Checks ---
    if (!creatorGridEl) {
        console.error("BISAYA FILTERS: Creator grid element (#creator-grid-bisaya) not found. Cannot render creators.");
        return;
    }
    if (!paginationContainerEl) {
        console.warn("BISAYA FILTERS: Pagination container (#pagination-controls-bisaya) not found. Pagination will not work.");
    }
    if (typeof bisayaCreators === 'undefined' || !Array.isArray(bisayaCreators)) {
        console.error("BISAYA FILTERS: 'bisayaCreators' data array is not available. Ensure bisaya-data.js is loaded first.");
        creatorGridEl.innerHTML = "<p class='text-center full-width-message'>Error: Creator data is missing.</p>";
        return;
    }

    // --- State Variables ---
    // Store a local, mutable copy of the original data for filtering without altering the global bisayaCreators
    let allCreatorDataForFiltering = [...bisayaCreators]; 
    let currentFilteredAndSortedData = []; // This will hold the data after filtering and sorting

    let currentSort = { by: 'name', order: 'asc' }; // Default sort
    let currentPage = 1;
    const itemsPerPage = 10; // 10 cards per page (e.g., 2 rows of 5)

    const activeFilters = {
        category: 'all',
        region: 'all',
        platform: 'all'
    };

    // --- Event Listener Setup ---
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterGroup = button.dataset.filterGroup;
            const filterValue = button.dataset.filter;
            
            // Deactivate other buttons in the same group
            document.querySelectorAll(`.btn-filter[data-filter-group="${filterGroup}"], .btn-filter-platform[data-filter-group="${filterGroup}"]`).forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active'); // Activate clicked button
            
            activeFilters[filterGroup] = filterValue;
            currentPage = 1; // Reset to first page on any filter change
            processAndRenderCreators();
        });
    });

    if (regionSelect) {
        regionSelect.addEventListener('change', () => {
            activeFilters.region = regionSelect.value;
            currentPage = 1;
            processAndRenderCreators();
        });
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            // Reset activeFilters object
            activeFilters.category = 'all';
            activeFilters.region = 'all';
            activeFilters.platform = 'all';

            // Reset UI for filter buttons (activate 'all' buttons)
            filterButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.btn-filter[data-filter-group="category"][data-filter="all"]').forEach(btn => btn.classList.add('active'));
            document.querySelectorAll('.btn-filter-platform[data-filter-group="platform"][data-filter="all"]').forEach(btn => btn.classList.add('active'));
            if (regionSelect) regionSelect.value = 'all';

            // Reset sort to default (name asc)
            currentSort = { by: 'name', order: 'asc' };
            sortButtons.forEach(btn => btn.classList.remove('active'));
            // Activate default sort button visually
            document.querySelector('.btn-sort[data-sort-by="name"][data-sort-order="asc"]')?.classList.add('active');
            
            currentPage = 1;
            processAndRenderCreators();
        });
    }

    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            sortButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            currentSort.by = button.dataset.sortBy;
            currentSort.order = button.dataset.sortOrder;
            currentPage = 1; // Reset to first page on sort change
            processAndRenderCreators();
        });
    });

    // --- Core Data Processing and Rendering Function ---
    function processAndRenderCreators() {
        let processedData = [...allCreatorDataForFiltering]; // Start with a fresh copy of all creator data

        // 1. Apply Filters
        processedData = processedData.filter(creator => {
            // Normalize categoryTags to an array of lowercase strings
            const categories = Array.isArray(creator.categoryTags) ? creator.categoryTags.map(c => c.toLowerCase()) : [];
            
            // --- UPDATED REGION FILTERING LOGIC ---
            // Ensure creatorRegions is an array of lowercase, hyphenated strings
            const creatorRegions = Array.isArray(creator.regionTag) 
                                   ? creator.regionTag.map(r => String(r).toLowerCase().replace(/\s+/g, '-')) // Ensure string before replace
                                   : (typeof creator.regionTag === 'string' ? [creator.regionTag.toLowerCase().replace(/\s+/g, '-')] : ["unknown"]); // Handle single string or unknown
            
            // Normalize platformTags to an array of lowercase strings
            const creatorPlatforms = Array.isArray(creator.platformTags) 
                                     ? creator.platformTags.map(p => p.toLowerCase()) 
                                     : [];

            // Check if active filter value is present in the creator's array of values
            const categoryMatch = activeFilters.category === 'all' || categories.includes(activeFilters.category);
            const regionMatch = activeFilters.region === 'all' || creatorRegions.includes(activeFilters.region);
            const platformMatch = activeFilters.platform === 'all' || creatorPlatforms.includes(activeFilters.platform);
            
            return categoryMatch && regionMatch && platformMatch;
        });

        // 2. Apply Sorting
        if (currentSort.by === 'name') {
            processedData.sort((a, b) => {
                const nameA = a.name?.toLowerCase() || '';
                const nameB = b.name?.toLowerCase() || '';
                return currentSort.order === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
            });
        } else if (currentSort.by === 'default') {
            // If 'default', no specific sort needed after filtering, original order (filtered) is maintained
        }
        // Add other sort criteria (e.g., by follower count if you add that data)

        currentFilteredAndSortedData = processedData; // Store the fully processed list
        renderPaginatedCards(); // Render the current page of this processed list
        updatePaginationControls();
    }

    // --- Helper Function for Category Icons ---
    // (This function seems correct, no changes needed here)
    function getCategoryIcon(category) {
        const lowerCategory = category.toLowerCase();
        const iconMap = {
            'comedy': 'fas fa-laugh-beam', 'food': 'fas fa-utensils', 'foodtrip': 'fas fa-utensils',
            'lifestyle': 'fas fa-camera-retro', 'vlog': 'fas fa-video', 'music': 'fas fa-music',
            'learning': 'fas fa-graduation-cap', 'education': 'fas fa-book-reader',
            'talkshow': 'fas fa-comments', 'interview': 'fas fa-microphone-alt', 'skit': 'fas fa-theater-masks',
            'provincial': 'fas fa-home', 'inspirational': 'fas fa-hands-helping', 'travel': 'fas fa-map-signs',
            'family': 'fas fa-users', 'kids': 'fas fa-child', 'personal': 'fas fa-user-edit',
            'q&a': 'fas fa-question-circle', 'prank': 'fas fa-ghost', 'business': 'fas fa-briefcase',
            'beauty': 'fas fa-spa',
            'coffee': 'fas fa-coffee', 'podcast': 'fas fa-headphones-alt',
            'shortvideo': 'fab fa-tiktok', 'couple': 'fas fa-heart', 'motherhood':'fas fa-baby'
        };
        return iconMap[lowerCategory] || 'fas fa-tag';
    }

    // --- HTML Generation for a Single Creator Card ---
    function renderCreatorCardHTML(creator) {
        if (!creator || !creator.id) {
            console.warn("Bisaya Filters: Invalid creator data for card rendering", creator);
            return ''; 
        }
        const categories = Array.isArray(creator.categoryTags) ? creator.categoryTags : [];
        // --- UPDATED: Ensure region is an array for rendering ---
        const region = Array.isArray(creator.regionTag) ? creator.regionTag : (typeof creator.regionTag === 'string' ? [creator.regionTag] : []); 
        const platforms = Array.isArray(creator.platformTags) ? creator.platformTags : [];

        // For data attributes (space-separated, lowercase, hyphenated for region)
        const dataCategories = categories.map(c => typeof c === 'string' ? c.toLowerCase() : '').join(' ');
        const dataRegions = region.map(r => typeof r === 'string' ? r.toLowerCase().replace(/\s+/g, '-') : '').join(' ');
        const dataPlatforms = platforms.map(p => typeof p === 'string' ? p.toLowerCase() : '').join(' ');

        let categoryTagsHTML = categories.map(tag => {
            const iconClass = getCategoryIcon(tag);
            const tagName = typeof tag === 'string' ? tag : 'Unknown'; 
            return `<span class="tag-eyebrow category-eyebrow" data-category-value="${tagName.toLowerCase()}"><i class="${iconClass}"></i> ${tagName.charAt(0).toUpperCase() + tagName.slice(1)}</span>`;
        }).join('');

        // --- UPDATED: Generate multiple region tags if region is an array ---
        let regionTagsHTML = region.map(r => {
            const regionName = typeof r === 'string' ? r : 'Unknown';
            return `<span class="tag-eyebrow region-eyebrow"><i class="fas fa-map-marker-alt"></i> ${regionName}</span>`;
        }).join('');

        return `
            <article class="creator-card" 
                     id="creator-${creator.id}" 
                     data-id="${creator.id}" 
                     data-categories="${dataCategories}"
                     data-region="${dataRegions}"
                     data-platforms="${dataPlatforms}"
                     tabindex="0" 
                     role="group" 
                     aria-labelledby="creator-name-${creator.id}">
                <div class="creator-card-thumbnail" style="background-image: url('${creator.profilePic || 'images/creators/default_creator.png'}');">
                    <div class="creator-card-platform-icons">
                        ${platforms.includes('youtube') ? '<i class="fab fa-youtube" title="YouTube"></i>' : ''}
                        ${platforms.includes('facebook') ? '<i class="fab fa-facebook" title="Facebook"></i>' : ''}
                        ${platforms.includes('tiktok') ? '<i class="fab fa-tiktok" title="TikTok"></i>' : ''}
                        ${platforms.includes('instagram') ? '<i class="fab fa-instagram" title="Instagram"></i>' : ''}
                    </div>
                </div>
                <div class="creator-card-info">
                    <h3 class="creator-name" id="creator-name-${creator.id}">${creator.name || 'Creator Name'}</h3>
                    <p class="creator-tagline">${creator.shortHook || 'Astig nga Bisdak Creator!'}</p> 
                    <div class="creator-tags">
                        ${categoryTagsHTML}
                        ${regionTagsHTML} <!-- Now correctly renders multiple region tags -->
                    </div>
                    <button class="btn-view-more btn-sinulog" aria-label="Tan-awa ang detalye para kang ${creator.name || 'Creator'}">Tan-awa Pa</button> 
                </div>
            </article>
        `;
    }

    // --- Render Paginated Cards ---
    // (This function seems correct, no changes needed here)
    function renderPaginatedCards() {
        if (!creatorGridEl) return;
        creatorGridEl.innerHTML = '';

        const totalItems = currentFilteredAndSortedData.length;
        if (totalItems === 0) {
            creatorGridEl.innerHTML = "<p class='text-center full-width-message'>Wala'y Bisdak creators nga ni-match sa imong gipangita.</p>";
            updatePaginationControls();
            return;
        }

        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItemsData = currentFilteredAndSortedData.slice(start, end);

        paginatedItemsData.forEach(creatorData => {
            creatorGridEl.innerHTML += renderCreatorCardHTML(creatorData);
        });
        highlightVisibleCategoryEyebrows(activeFilters.category);
    }

    // --- Update Pagination Controls ---
    // (This function seems correct, no changes needed here)
    function updatePaginationControls() {
        if (!paginationContainerEl) return;
        paginationContainerEl.innerHTML = '';

        const totalItems = currentFilteredAndSortedData.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        if (totalPages <= 1) {
            return;
        }

        const prevButton = document.createElement('button');
        prevButton.innerHTML = '« <span class="pagination-text">Kaniadto</span>';
        prevButton.classList.add('btn-pagination');
        prevButton.disabled = currentPage === 1;
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                processAndRenderCreators();
            }
        });
        paginationContainerEl.appendChild(prevButton);

        const pageInfo = document.createElement('span');
        pageInfo.id = 'pagination-page-info';
        pageInfo.textContent = `Panid ${currentPage} / ${totalPages}`;
        paginationContainerEl.appendChild(pageInfo);

        const nextButton = document.createElement('button');
        nextButton.innerHTML = '<span class="pagination-text">Sunod</span> »';
        nextButton.classList.add('btn-pagination');
        nextButton.disabled = currentPage === totalPages;
        nextButton.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                processAndRenderCreators();
            }
        });
        paginationContainerEl.appendChild(nextButton);
    }

    // --- Eyebrow Highlighting (Optional Visual Cue) ---
    // (This function seems correct, no changes needed here)
    function highlightVisibleCategoryEyebrows(activeCategory) {
        if (!creatorGridEl) return;
        clearAllEyebrowHighlights();
        if (activeCategory === 'all' || !activeCategory) return;

        const visibleCards = creatorGridEl.querySelectorAll('.creator-card');
        visibleCards.forEach(cardDOMElement => {
            const cardCategories = cardDOMElement.dataset.categories ? cardDOMElement.dataset.categories.split(' ') : [];
            if (cardCategories.includes(activeCategory.toLowerCase())) {
                const eyebrowTags = cardDOMElement.querySelectorAll('.tag-eyebrow.category-eyebrow');
                eyebrowTags.forEach(tag => {
                    if (tag.dataset.categoryValue === activeCategory.toLowerCase()) {
                        tag.classList.add('highlighted-eyebrow');
                    }
                });
            }
        });
    }

    // (This function seems correct, no changes needed here)
    function clearAllEyebrowHighlights() {
        if (!creatorGridEl) return;
        creatorGridEl.querySelectorAll('.tag-eyebrow.highlighted-eyebrow').forEach(tag => {
            tag.classList.remove('highlighted-eyebrow');
        });
    }
    
    // --- Function to be called by bisaya-page-loader.js for initial render ---
    // (This function seems correct, no changes needed here)
    window.initializeAndRenderCreators = () => {
        console.log("BISAYA FILTERS: Global function initializeAndRenderCreators called. Performing initial render...");
        if (typeof bisayaCreators !== 'undefined' && Array.isArray(bisayaCreators)) {
            allCreatorDataForFiltering = [...bisayaCreators];
            currentPage = 1;
            const defaultSortButton = document.querySelector('.btn-sort[data-sort-by="name"][data-sort-order="asc"]');
            if(defaultSortButton) defaultSortButton.classList.add('active');

            processAndRenderCreators();
        } else {
            console.error("BISAYA FILTERS: bisayaCreators data not available for initial render when called from window.");
             if(creatorGridEl) creatorGridEl.innerHTML = "<p class='text-center full-width-message'>Error: Creator data failed to load for filters.</p>";
        }
    };

    console.log("BISAYA FILTERS: Filter system initialized and event listeners attached.");
}

// Initialize the filter system when the DOM is ready.
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBisayaFilters);
} else {
    initializeBisayaFilters();
}