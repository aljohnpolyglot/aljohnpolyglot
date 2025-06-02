document.addEventListener('DOMContentLoaded', () => {
    const groupsGrid = document.getElementById('groups-grid');
    const languageFiltersContainer = document.getElementById('language-filters');
    const typeFiltersContainer = document.getElementById('type-filters');
    const noGroupsMessage = document.getElementById('no-groups-message');

    let activeLangFilter = 'all';
    let activeTypeFilters = new Set(['all']);

    // --- 1. RENDER GROUP CARDS ---
    function renderGroupCards(groupsToRender) {
        groupsGrid.innerHTML = '';
        if (groupsToRender.length === 0) {
            noGroupsMessage.style.display = 'flex';
            return;
        }
        noGroupsMessage.style.display = 'none';

        groupsToRender.forEach((group, index) => {
            const card = document.createElement('div');
            card.classList.add('group-card', 'reveal-item');
            card.style.transitionDelay = `${index * 0.055}s`; // Slightly different stagger

            const theme = group.theme || {}; // Ensure theme object exists
            const cardHeaderBg = theme.backgroundColor || 'transparent';
            const cardHeaderText = theme.textColor || 'var(--groups-text-dark)';
            const cardAccentColor = theme.accentColor || 'var(--groups-primary-accent)';
            
            // Determine button text color for contrast with accentColor
            // This is a simple heuristic, might need adjustment for mid-range colors
            let buttonTextColor = '#FFFFFF'; // Default to white text
            if (cardAccentColor.startsWith('#')) {
                const r = parseInt(cardAccentColor.slice(1, 3), 16);
                const g = parseInt(cardAccentColor.slice(3, 5), 16);
                const b = parseInt(cardAccentColor.slice(5, 7), 16);
                // Check brightness (simple formula)
                if ((r * 0.299 + g * 0.587 + b * 0.114) > 150) { // 150 is a rough threshold for light colors
                    buttonTextColor = '#333333'; // Use dark text on light accent buttons
                }
            }


            card.style.borderTopColor = cardHeaderBg; // Theme color as top border

            let languagesHTML = group.languages.map(lang => {
                let flagSrc = '';
                switch (lang.toLowerCase()) {
                    case 'spanish': flagSrc = 'https://flagcdn.com/w20/es.png'; break;
                    case 'french': flagSrc = 'https://flagcdn.com/w20/fr.png'; break;
                    case 'indonesian': flagSrc = 'https://flagcdn.com/w20/id.png'; break;
                    case 'italian': flagSrc = 'https://flagcdn.com/w20/it.png'; break;
                    case 'portuguese': flagSrc = 'https://flagcdn.com/w20/pt.png'; break;
                    case 'russian': flagSrc = 'https://flagcdn.com/w20/ru.png'; break;
                    case 'swedish': flagSrc = 'https://flagcdn.com/w20/se.png'; break;
                    case 'german': flagSrc = 'https://flagcdn.com/w20/de.png'; break;
                    default: flagSrc = '';
                }
                return `<span class="lang-tag">${flagSrc ? `<img src="${flagSrc}" alt="${lang} flag" class="filter-flag">` : ''} ${lang}</span>`;
            }).join('');

            let typesHTML = group.types.map(type => {
                let iconClass = 'fas fa-users';
                switch (type.toLowerCase()) {
                    case 'facebook group': iconClass = 'fab fa-facebook-square'; break;
                    case 'meetup (in-person)': iconClass = 'fas fa-map-marker-alt'; break;
                    case 'online meetup': iconClass = 'fas fa-laptop-house'; break;
                    case 'social club': iconClass = 'fas fa-glass-cheers'; break;
                    case 'mentorship': iconClass = 'fas fa-hands-helping'; break;
                    case 'facebook page': iconClass = 'fab fa-facebook'; break; 
                }
                return `<span class="type-tag"><i class="${iconClass}"></i> ${type}</span>`;
            }).join('');

            card.innerHTML = `
                <div class="group-card-header" style="background-color: ${cardHeaderBg};">
                    <img src="${group.logo}" alt="${group.name} Logo" class="group-card-logo">
                    <h3 class="group-card-name" style="color: ${cardHeaderText};">${group.name}</h3>
                </div>
                <div class="group-card-body">
                    <div class="group-card-info-line">
                        <div class="group-card-languages-tags">${languagesHTML}</div>
                        <div class="group-card-types-tags">${typesHTML}</div>
                    </div>
                    <p class="group-card-tagline">${group.tagline}</p>
                    <div class="group-card-footer">
                        <a href="${group.link}" class="btn-view-group" 
                           style="background-color: ${cardAccentColor}; color: ${buttonTextColor}; border-color: ${cardAccentColor};">
                           View Details
                        </a>
                    </div>
                </div>
            `;
            groupsGrid.appendChild(card);
        });
        observeReveals();
    }

    // --- 2. FILTERING LOGIC (Multi-select for type) ---
    function filterGroups() {
        const filtered = languageGroupsData.filter(group => {
            const langMatch = activeLangFilter === 'all' || group.languages.includes(activeLangFilter);
            const typeMatch = activeTypeFilters.has('all') || group.types.some(type => activeTypeFilters.has(type));
            return langMatch && typeMatch;
        });
        renderGroupCards(filtered);
    }

    // --- 3. EVENT LISTENERS FOR FILTERS ---
    languageFiltersContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.filter-btn');
        if (button) {
            languageFiltersContainer.querySelector('.active').classList.remove('active');
            button.classList.add('active');
            activeLangFilter = button.dataset.filterLang;
            filterGroups();
        }
    });

    typeFiltersContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.filter-btn');
        if (button) {
            const filterType = button.dataset.filterType;
            if (filterType === 'all') {
                activeTypeFilters.clear();
                activeTypeFilters.add('all');
                typeFiltersContainer.querySelectorAll('.filter-btn.active').forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            } else {
                typeFiltersContainer.querySelector('[data-filter-type="all"]').classList.remove('active');
                activeTypeFilters.delete('all');
                if (activeTypeFilters.has(filterType)) {
                    activeTypeFilters.delete(filterType);
                    button.classList.remove('active');
                } else {
                    activeTypeFilters.add(filterType);
                    button.classList.add('active');
                }
                if (activeTypeFilters.size === 0) {
                    activeTypeFilters.add('all');
                    typeFiltersContainer.querySelector('[data-filter-type="all"]').classList.add('active');
                }
            }
            filterGroups();
        }
    });

    // --- 4. REVEAL ON SCROLL FOR CARDS ---
    let scrollObserver;
    function observeReveals() {
        const elementsToReveal = document.querySelectorAll('.group-card.reveal-item:not(.visible)');
        if (elementsToReveal.length === 0 && scrollObserver) return;
        const revealOnScroll = (entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) { entry.target.classList.add('visible'); observerInstance.unobserve(entry.target); }
            });
        };
        const revealOptions = { root: null, threshold: 0.05, rootMargin: '0px 0px -20px 0px' };
        if(scrollObserver) scrollObserver.disconnect(); 
        scrollObserver = new IntersectionObserver(revealOnScroll, revealOptions);
        elementsToReveal.forEach(element => { scrollObserver.observe(element); });
    }

    // --- INITIAL RENDER ---
    if (typeof languageGroupsData !== 'undefined' && languageGroupsData.length > 0) {
        renderGroupCards(languageGroupsData);
    } else {
        noGroupsMessage.style.display = 'flex';
        groupsGrid.innerHTML = '';
    }
});
// Add this to your JavaScript file (e.g., groups-logic.js)
document.addEventListener('DOMContentLoaded', () => {
    const filterGroups = document.querySelectorAll('.filters-sidebar .filter-group');

    filterGroups.forEach(group => {
        const title = group.querySelector('.filter-title');
        if (title) {
            title.addEventListener('click', () => {
                // Close other expanded groups for an accordion effect (optional)
                // filterGroups.forEach(otherGroup => {
                //     if (otherGroup !== group && otherGroup.classList.contains('expanded')) {
                //         otherGroup.classList.remove('expanded');
                //     }
                // });
                group.classList.toggle('expanded');
            });

            // Optional: Check if any filter button inside this group is active
            // and expand the group by default if so.
            // const hasActiveFilter = group.querySelector('.filter-btn.active:not([data-filter-lang="all"]):not([data-filter-type="all"])');
            // if (hasActiveFilter) {
            //    group.classList.add('expanded');
            // }
        }
    });

    // Optional: Expand the first filter group by default on mobile
    // if (window.innerWidth <= 992 && filterGroups.length > 0) {
    //    filterGroups[0].classList.add('expanded');
    // }
});