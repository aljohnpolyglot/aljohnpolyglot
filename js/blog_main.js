// js/blog_main.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("Blog Main JS Loaded");

    const postsGrid = document.getElementById('blogPostsGrid');
    const categoryFiltersContainer = document.getElementById('categoryFilters');
    const languageFiltersContainer = document.getElementById('languageFilters');
    const sortBySelect = document.getElementById('sortBy');
    const tagSearchInput = document.getElementById('tagSearch');
    const resetFiltersButton = document.getElementById('resetFilters');
    const noResultsMessage = postsGrid ? postsGrid.querySelector('.no-results-message') : null;

    let currentPosts = [...blogPostsData]; // Make a mutable copy

    // --- INITIAL RENDERING FUNCTIONS ---

    function createPostCard(post) {
        // Create category tags HTML
        let categoryTagsHtml = '';
        if (post.categories && post.categories.length > 0) {
            categoryTagsHtml = post.categories.map(cat => `<span class="card-category-tag">${cat}</span>`).join('');
        }

        return `
            <article class="blog-post-card" data-id="${post.id}">
                <a href="${post.link}" class="card-image-link" aria-label="Read more about ${post.title}">
                    ${post.featuredImage ? `<img src="${post.featuredImage}" alt="" class="card-image">` : '<div class="card-image-placeholder"></div>'}
                    ${categoryTagsHtml ? `<div class="card-category-tags">${categoryTagsHtml}</div>` : ''}
                </a>
                <div class="card-content">
                    <h2 class="card-title"><a href="${post.link}">${post.title}</a></h2>
                    <p class="card-meta">
                        <span><i class="fas fa-user-edit"></i> ${post.author}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        ${post.readTime ? `<span><i class="fas fa-clock"></i> ${post.readTime}</span>` : ''}
                    </p>
                    <p class="card-excerpt">${post.excerpt}</p>
                    <a href="${post.link}" class="btn btn-outline btn-small card-read-more">Read Dispatch <i class="fas fa-arrow-right"></i></a>
                </div>
            </article>
        `;
    }

    function renderPosts(postsToRender) {
        if (!postsGrid || !noResultsMessage) {
            console.error("Blog posts grid or no results message element not found.");
            return;
        }
        postsGrid.innerHTML = ''; // Clear existing posts
        if (postsToRender.length === 0) {
            noResultsMessage.style.display = 'block';
        } else {
            noResultsMessage.style.display = 'none';
            postsToRender.forEach(post => {
                postsGrid.innerHTML += createPostCard(post);
            });
        }
    }

    function populateFilterOptions(container, optionsArray, filterType) {
        if (!container) return;
        container.innerHTML = ''; // Clear previous options before populating
        optionsArray.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.dataset.filterType = filterType;
            button.dataset.filterValue = option;
            if (option === "All Dispatches" || option === "All Languages") {
                button.classList.add('active'); // Default active
            }
            container.appendChild(button);
        });
    }

    // --- FILTERING AND SORTING LOGIC ---

    function applyFiltersAndSort() {
        let filteredPosts = [...blogPostsData];

        // Category Filter
        const activeCategoryButton = categoryFiltersContainer ? categoryFiltersContainer.querySelector('button.active') : null;
        const selectedCategory = activeCategoryButton ? activeCategoryButton.dataset.filterValue : "All Dispatches";
        if (selectedCategory !== "All Dispatches") {
            filteredPosts = filteredPosts.filter(post => post.categories && post.categories.includes(selectedCategory));
        }

        // Language Filter
        const activeLanguageButton = languageFiltersContainer ? languageFiltersContainer.querySelector('button.active') : null;
        const selectedLanguage = activeLanguageButton ? activeLanguageButton.dataset.filterValue : "All Languages";
        if (selectedLanguage !== "All Languages") {
            filteredPosts = filteredPosts.filter(post => post.languageFocus && post.languageFocus.includes(selectedLanguage));
        }
        
        // Tag/Keyword Search
        const searchTerm = tagSearchInput ? tagSearchInput.value.toLowerCase().trim() : "";
        if (searchTerm) {
            filteredPosts = filteredPosts.filter(post => {
                const titleMatch = post.title.toLowerCase().includes(searchTerm);
                const excerptMatch = post.excerpt.toLowerCase().includes(searchTerm);
                const tagsMatch = post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchTerm));
                const categoryMatch = post.categories && post.categories.some(cat => cat.toLowerCase().includes(searchTerm));
                return titleMatch || excerptMatch || tagsMatch || categoryMatch;
            });
        }

        // Sorting
        const sortBy = sortBySelect ? sortBySelect.value : 'date-desc';
        switch (sortBy) {
            case 'date-asc':
                filteredPosts.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'title-asc':
                filteredPosts.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                filteredPosts.sort((a, b) => b.title.localeCompare(a.title));
                break;
            // case 'popularity': // Future: sort by views or other metric
            //     filteredPosts.sort((a, b) => (b.views || 0) - (a.views || 0));
            //     break;
            case 'date-desc':
            default:
                filteredPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
        }
        currentPosts = filteredPosts;
        renderPosts(currentPosts);
    }

    // --- EVENT LISTENERS ---

    if (categoryFiltersContainer) {
        populateFilterOptions(categoryFiltersContainer, filterCategories, 'category');
        categoryFiltersContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                categoryFiltersContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                applyFiltersAndSort();
            }
        });
    }

    if (languageFiltersContainer) {
        populateFilterOptions(languageFiltersContainer, filterLanguageFocus, 'language');
        languageFiltersContainer.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                languageFiltersContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                applyFiltersAndSort();
            }
        });
    }

    if (sortBySelect) {
        sortBySelect.addEventListener('change', applyFiltersAndSort);
    }
    
    if (tagSearchInput) {
        let searchTimeout;
        tagSearchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(applyFiltersAndSort, 300); // Debounce search
        });
    }

    if (resetFiltersButton) {
        resetFiltersButton.addEventListener('click', () => {
            if (sortBySelect) sortBySelect.value = 'date-desc';
            if (tagSearchInput) tagSearchInput.value = '';
            if (categoryFiltersContainer) {
                categoryFiltersContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                const defaultCategoryButton = categoryFiltersContainer.querySelector('button[data-filter-value="All Dispatches"]');
                if (defaultCategoryButton) defaultCategoryButton.classList.add('active');
            }
            if (languageFiltersContainer) {
                languageFiltersContainer.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
                const defaultLanguageButton = languageFiltersContainer.querySelector('button[data-filter-value="All Languages"]');
                if (defaultLanguageButton) defaultLanguageButton.classList.add('active');
            }
            applyFiltersAndSort();
        });
    }

    // --- INITIAL PAGE LOAD ---
    if (postsGrid) { // Only run if the main grid exists
        applyFiltersAndSort(); // Initial render of posts
    } else {
        console.log("Blog posts grid container not found. Blog will not be rendered.");
    }

    // REMOVED: Sidebar sticky functionality (basic)
    // CSS 'position: sticky' will handle this.
    /*
    const sidebar = document.getElementById('blogSidebar');
    if (sidebar) {
        const sidebarTop = sidebar.offsetTop;
        const headerHeight = document.querySelector('header')?.offsetHeight || 70; // Fallback to 70px

        window.addEventListener('scroll', () => {
            if (window.innerWidth > 992) { // Only apply sticky on desktop
                if (window.pageYOffset > sidebarTop - headerHeight - 20) { // 20px buffer
                    sidebar.style.position = 'fixed';
                    sidebar.style.top = (headerHeight + 20) + 'px'; // Below fixed header
                } else {
                    sidebar.style.position = 'static';
                    sidebar.style.top = 'auto';
                }
            } else { // Reset for mobile
                sidebar.style.position = 'static';
                sidebar.style.top = 'auto';
            }
        });
    }
    */
});