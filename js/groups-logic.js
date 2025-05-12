// groups/js/groups-logic.js
document.addEventListener('DOMContentLoaded', () => {
    // ... (selectors from previous JS: groupsGrid, languageFiltersContainer, etc.)
    const groupsGrid = document.getElementById('groups-grid');
    const languageFiltersContainer = document.getElementById('language-filters');
    const typeFiltersContainer = document.getElementById('type-filters');
    const noGroupsMessage = document.getElementById('no-groups-message');

    let activeLangFilter = 'all';
    let activeTypeFilters = new Set(['all']);

    function renderGroupCards(groupsToRender) {
        groupsGrid.innerHTML = '';
        if (groupsToRender.length === 0) {
            noGroupsMessage.style.display = 'block';
            return;
        }
        noGroupsMessage.style.display = 'none';

        groupsToRender.forEach((group, index) => {
            const card = document.createElement('div');
            card.classList.add('group-card', 'reveal-item');
            card.style.transitionDelay = `${index * 0.05}s`;

            if (group.theme) {
                if (group.theme.backgroundColor) card.style.backgroundColor = group.theme.backgroundColor;
                if (group.theme.textColor) card.style.color = group.theme.textColor;
            }

            let languagesHTML = group.languages.map(lang => {
                // ... (flag logic as before) ...
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
                return `<span>${flagSrc ? `<img src="${flagSrc}" alt="${lang} flag" class="filter-flag">` : ''}${lang}</span>`; // Reused filter-flag class for consistency
            }).join('');

            let typesHTML = group.types.map(type => {
                // ... (icon logic as before) ...
                let iconClass = 'fa-users'; 
                switch (type.toLowerCase()) {
                    case 'facebook group': iconClass = 'fab fa-facebook-square'; break;
                    case 'facebook page': iconClass = 'fab fa-facebook'; break;
                    case 'meetup (in-person)': iconClass = 'fas fa-map-marker-alt'; break;
                    case 'online meetup': iconClass = 'fas fa-video'; break;
                    case 'language exchange': iconClass = 'fas fa-comments'; break;
                    case 'discord server': iconClass = 'fab fa-discord'; break;
                    case 'social club': iconClass = 'fas fa-glass-cheers'; break;
                    case 'mentorship': iconClass = 'fas fa-hands-helping'; break;
                }
                return `<span class="type-tag"><i class="${iconClass}"></i> ${type}</span>`;
            }).join('');
            
            const buttonTextColor = group.theme && group.theme.buttonTextColor ? group.theme.buttonTextColor : '#FFFFFF';
            const cardAccentColor = group.theme ? group.theme.accentColor : 'var(--groups-primary-accent)';
            const cardMainTextColor = group.theme ? group.theme.textColor : 'var(--groups-text-dark)';


            // ADD CLICKABLE AREA WRAPPER
            card.innerHTML = `
                <div class="group-card-clickable-area"> 
                    <div class="group-card-header">
                        <img src="${group.logo}" alt="${group.name} Logo" class="group-card-logo">
                        <h3 class="group-card-name" style="color: ${cardAccentColor};">${group.name}</h3>
                    </div>
                    <div class="group-card-body">
                        <div class="group-card-languages">
                            <i class="fas fa-language" style="color: ${cardAccentColor};"></i> ${languagesHTML}
                        </div>
                        <div class="group-card-types">
                             ${typesHTML}
                        </div>
                        <p class="group-card-tagline">${group.tagline}</p> 
                    </div>
                </div> 
                <div class="group-card-footer">
                    <a href="${group.link}" class="btn-view-group" 
                       style="background-color: ${cardAccentColor}; 
                              color: ${buttonTextColor}; 
                              border-color: ${cardAccentColor};">
                       View Details
                    </a>
                </div>
            `;
            
            // Event listener for expanding description on click (for touch primarily)
            const clickableArea = card.querySelector('.group-card-clickable-area');
            if(clickableArea){
                clickableArea.addEventListener('click', (e) => {
                    // Prevent link navigation if clicking to expand/collapse
                    if (e.target.tagName !== 'A' && e.target.parentNode.tagName !== 'A') {
                        card.classList.toggle('description-visible');
                    }
                });
            }

            groupsGrid.appendChild(card);
        });
        observeReveals();
    }

    // --- FILTERING LOGIC (Multi-select for type) ---
    // ... (Keep filtering logic and event listeners for filters as in the previous JS version) ...
    function filterGroups() {
        const filtered = languageGroupsData.filter(group => {
            const langMatch = activeLangFilter === 'all' || group.languages.includes(activeLangFilter);
            const typeMatch = activeTypeFilters.has('all') || group.types.some(type => activeTypeFilters.has(type));
            return langMatch && typeMatch;
        });
        renderGroupCards(filtered);
    }

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
                activeTypeFilters.delete('all');
                typeFiltersContainer.querySelector('.filter-btn[data-filter-type="all"]').classList.remove('active');
                
                if (activeTypeFilters.has(filterType)) {
                    activeTypeFilters.delete(filterType);
                    button.classList.remove('active');
                } else {
                    activeTypeFilters.add(filterType);
                    button.classList.add('active');
                }
                if (activeTypeFilters.size === 0) {
                    activeTypeFilters.add('all');
                    typeFiltersContainer.querySelector('.filter-btn[data-filter-type="all"]').classList.add('active');
                }
            }
            filterGroups();
        }
    });


    // --- REVEAL ON SCROLL ---
    // ... (Keep observeReveals function as in the previous JS version) ...
    let scrollObserver;
    function observeReveals() {
        const elementsToReveal = document.querySelectorAll('.group-card.reveal-item:not(.visible)');
        if (elementsToReveal.length === 0 && scrollObserver) return;
        
        const revealOnScroll = (entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observerInstance.unobserve(entry.target);
                }
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
        noGroupsMessage.style.display = 'block';
        groupsGrid.innerHTML = '';
    }
});