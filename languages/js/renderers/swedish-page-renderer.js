// js/renderers/swedish-page-renderer.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('Swedish Page Renderer (V-FINAL-FIXED: Popovers Restored, No Parallax, Modals OK) executing...');

    // Ensure swedishResourceData is available
    if (typeof swedishResourceData === 'undefined') {
        console.error('CRITICAL: swedishResourceData is UNDEFINED. Ensure swedish-page-data.js is loaded before this script.');
        return;
    }

    const modalPlaceholder = document.getElementById('resource-modal-placeholder');
    if (!modalPlaceholder) {
        console.error("CRITICAL: Modal placeholder 'resource-modal-placeholder' not found! Modals will not work correctly.");
    }

    // --- HELPER FUNCTIONS ---
    const createNode = (element) => document.createElement(element);

    // --- "READ MORE" FUNCTIONALITY FOR FRAGMENTERAD VERKLIGHET ---
    const readMoreBtn = document.getElementById('read-more-narrative-btn');
    const hiddenNarrativeContent = document.getElementById('narrative-hidden-content');
    if (readMoreBtn && hiddenNarrativeContent) {
        readMoreBtn.addEventListener('click', function() {
            const isHidden = hiddenNarrativeContent.classList.contains('narrative-hidden');
            if (isHidden) {
                hiddenNarrativeContent.classList.remove('narrative-hidden');
                hiddenNarrativeContent.classList.add('show');
                this.textContent = 'Läs mindre...';
                this.setAttribute('aria-expanded', 'true');
            } else {
                hiddenNarrativeContent.classList.add('narrative-hidden');
                hiddenNarrativeContent.classList.remove('show');
                this.textContent = 'Läs mer...';
                this.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // --- FLIP CARD FUNCTIONALITY FOR VIDEO HIGHLIGHT ---
    function initFlipCards() {
        const flipCards = document.querySelectorAll('.interactive-card');
        flipCards.forEach(card => {
            const cardFront = card.querySelector('.card-front');
            const flipBackButton = card.querySelector('.flip-back-btn');
            const flipAction = () => {
                card.classList.toggle('is-flipped');
                if (card.classList.contains('is-flipped')) {
                    const firstFocusableOnBack = card.querySelector('.card-back button, .card-back a');
                    if (firstFocusableOnBack) firstFocusableOnBack.focus();
                } else {
                    card.focus();
                }
            };
            if (cardFront) {
                cardFront.addEventListener('click', (e) => { if (!e.target.closest('a, button:not(.flip-prompt)')) flipAction(); });
                card.addEventListener('keydown', (e) => { if ((e.key === 'Enter' || e.key === ' ') && document.activeElement === card && !card.classList.contains('is-flipped')) { e.preventDefault(); flipAction(); }});
            }
            if (flipBackButton) {
                flipBackButton.addEventListener('click', (e) => { e.stopPropagation(); flipAction(); });
            }
        });
    }
    initFlipCards();

    // --- PARALLAX HERO SECTION (REMOVED) ---
    // const heroSection = document.getElementById('swedish-custom-hero');
    // if (heroSection) { ... parallax logic removed ... }


    // --- GENERIC INFO POPOVER FUNCTIONALITY ---
    let currentOpenPopover = null;
    function createInfoPopover(triggerElement, title, contentHTML, iconClass = 'fas fa-info-circle', iconColor = 'var(--sw-flag-yellow)') {
        const existingPopover = triggerElement.querySelector('.info-popover');
        if (existingPopover) existingPopover.remove();
        const popover = createNode('div');
        popover.className = 'info-popover';
        popover.setAttribute('role', 'dialog'); popover.setAttribute('aria-modal', 'false');
        popover.setAttribute('aria-labelledby', triggerElement.id + '-popover-title');
        popover.setAttribute('tabindex', '-1');
        let headerIconHTML = iconClass ? `<i class="${iconClass} popover-icon" style="color: ${iconColor};" aria-hidden="true"></i>` : '';
        popover.innerHTML = `
            <div class="info-popover-header">
                ${headerIconHTML}
                <h5 id="${triggerElement.id}-popover-title">${title}</h5>
            </div>
            <div class="info-popover-content">${contentHTML}</div>`;
        triggerElement.appendChild(popover);
        return popover;
    }
    function togglePopover(triggerElement, popoverInstance) {
        if (currentOpenPopover && currentOpenPopover !== popoverInstance) {
            currentOpenPopover.classList.remove('visible');
            const oldTriggerId = currentOpenPopover.parentElement.id;
            if (oldTriggerId) document.getElementById(oldTriggerId)?.setAttribute('aria-expanded', 'false');
        }
        const isVisible = popoverInstance.classList.toggle('visible');
        triggerElement.setAttribute('aria-expanded', isVisible ? 'true' : 'false');
        if (isVisible) {
            currentOpenPopover = popoverInstance;
            popoverInstance.focus();
        } else {
            currentOpenPopover = null;
            triggerElement.focus();
        }
    }
    function setupInfoPopoverTrigger(triggerId, popoverTitle, popoverContentHTML, popoverIconClass, popoverIconColor) {
        const trigger = document.getElementById(triggerId);
        if (!trigger) {
            // console.warn(`Info trigger not found: ${triggerId}`); // Keep commented unless debugging specific icon
            return;
        }
        let popoverElement = null;
        const handleTriggerAction = (event) => {
            event.stopPropagation();
            if (!popoverElement) popoverElement = createInfoPopover(trigger, popoverTitle, popoverContentHTML, popoverIconClass, popoverIconColor);
            Promise.resolve().then(() => togglePopover(trigger, popoverElement));
        };
        trigger.addEventListener('click', handleTriggerAction);
        trigger.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); handleTriggerAction(event); }});
    }
    document.addEventListener('click', (event) => {
        if (currentOpenPopover) {
            const triggerId = currentOpenPopover.parentElement.id;
            const triggerElement = document.getElementById(triggerId);
            if (!currentOpenPopover.contains(event.target) && event.target !== triggerElement && (triggerElement && !triggerElement.contains(event.target))) {
                currentOpenPopover.classList.remove('visible');
                if(triggerElement) triggerElement.setAttribute('aria-expanded', 'false');
                currentOpenPopover = null;
            }
        }
    });
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && currentOpenPopover) {
            const triggerId = currentOpenPopover.parentElement.id;
            const triggerElement = document.getElementById(triggerId);
            currentOpenPopover.classList.remove('visible');
            if(triggerElement) triggerElement.setAttribute('aria-expanded', 'false');
            currentOpenPopover = null;
            if (triggerElement) triggerElement.focus();
        }
    });

    // --- DEFINE POPOVER CONTENT AND SETUP TRIGGERS ---
    // THIS IS THE CORRECTED AND COMPLETE POPOVER DATA ARRAY
    const popoverData = [
        { id: 'learning-channels-info-trigger', title: 'Magnus om Språkinlärningskanaler:', content: `<p>Ibland behöver man lite extra draghjälp, speciellt med knepig grammatik eller när uttalet känns som en omöjlig knut. Det är då dessa guldkanaler kommer in! Se dem som dina personliga svensklärare på YouTube. De förklarar, de peppar, och de gör det ofta på ett jäkligt roligt sätt. Använd dem när du känner dig fast, men glöm inte att hoppa tillbaka till "the wild" – den äkta svenskan!</p>`, icon: 'fas fa-graduation-cap', color: 'var(--sw-flag-blue)' },
        { id: 'kids-content-info-trigger', title: 'Magnus om Barninnehåll:', content: `<p>Skratta inte, men Greta Gris och Bolibompa kan vara dina bästa vänner i början! Enkelt språk, tydligt tal, massor av repetition – precis vad hjärnan behöver för att bygga grunden. Och du, att kunna sjunga med i en svensk barnvisa? Det är en speciell typ av seger. Inget att skämmas för, bara att köra!</p>`, icon: 'fas fa-child', color: 'var(--sw-resource-peppa-pig-pink)' },
        { id: 'top-podcasts-info-trigger', title: 'Magnus om Svenska Poddar:', content: `<p>Poddar är som att ha en svensk kompis i örat! Perfekt för att vänja sig vid olika dialekter, taltempo och hur folk faktiskt pratar med varandra. Jag har ofta en podd igång när jag pendlar eller städar. Du plockar upp så mycket utan att ens anstränga dig!</p>`, icon: 'fas fa-headphones-alt', color: 'var(--sw-flag-blue)' },
        { id: 'music-artists-info-trigger', title: 'Magnus om Svensk Musik:', content: `<p>Svensk musik är inte bara bra för språket, det är en direktlinje till kulturen! Lyssna aktivt på texterna, slå upp ord du inte förstår, och försök förstå sammanhanget. Mello är en guldgruva för att hitta nya favoriter och se hur språket används i festliga sammanhang!</p>`, icon: 'fab fa-spotify', color: 'var(--sw-resource-spotify-green)' },
        { id: 'music-programs-info-trigger', title: 'Magnus om Musikprogram:', content: `<p>Musikprogram som Mello och Så Mycket Bättre är rena rama folkfester, visst? Men de är också smygbra språklektioner! Lyssna på artisternas snack mellan låtarna – det är där du hör äkta, vardaglig svenska. Och att hänga med i diskussionerna om bidragen på sociala medier? Guld värt för att lära sig hur folk verkligen pratar och tycker. Plus, du får ju nya favoritlåtar på köpet!</p>`, icon: 'fas fa-tv', color: 'var(--sw-resource-tv-blue)' },
        { id: 'youtube-main-info-trigger', title: 'Magnus om YouTube-Sverige:', content: `<p>YouTube är som ett smörgåsbord av svenskt liv! Släng dig in. Kolla vloggar, sketcher, dokumentärer – vad som helst som fångar ditt intresse. Poängen är inte att förstå varje ord från start, utan att omge dig med språket. Lyssna på rytmen, snappa upp uttryck. Snart nog börjar du tänka på svenska när du minst anar det. Och kom ihåg, gilla-knappen och kommentarsfältet är dina vänner för interaktion!</p>`, icon: 'fab fa-youtube', color: 'var(--sw-resource-youtube-red)' },
        { id: 'youtube-subs-info-trigger', title: 'Viktigt om YouTube-Undertexter!', content: `<p>När jag började min svenska resa hade YouTube inte automatiska undertexter för svenska, vilket innebar att jag ofta fick förlita mig helt på min hörförståelse eller kanaler med manuellt inbäddade texter. Idag är situationen en helt annan!</p><p>YouTube har nu <a href="https://www.reddit.com/r/youtube/comments/1dbyorc/is_youtube_slowly_rolling_out_autogenerated/" target="_blank" rel="noopener noreferrer" class="inline-link">rullat ut automatiskt genererade undertexter</a> för svenska (och många andra språk!), vilket öppnar upp en enorm värld av innehåll för språkinlärning.</p><p>Använd dessa automatiska undertexter som ett verktyg: slå på dem för att stödja din förståelse när du behöver det, och stäng sedan av dem för att aktivt träna och utmana din hörförståelse. Även om de inte alltid är 100% perfekta, är de en fantastisk resurs på vägen mot flytande svenska!</p>`, icon: 'fas fa-closed-captioning', color: 'var(--sw-resource-youtube-red)' },
        { id: 'personalities-info-trigger', title: 'Magnus om att Följa Svenskar:', content: `<p>Att följa personer med passion, oavsett ämne, är ett fantastiskt sätt att lära sig vardagsspråk och få kulturella insikter. Deras stories, kommentarer, live-sändningar – det är som att smyglyssna på äkta svenska konversationer. Guld värt! Plus, det är ju kul!</p>`, icon: 'fas fa-users', color: 'var(--sw-flag-yellow)' },
        { id: 'svt-series-info-trigger', title: 'Magnus om SVT Play Serier:', content: `<p>Svenska TV-serier är som en intensivkurs i kultur och vardagsspråk, förklädd till underhållning. Slå på undertexterna (svenska, om du vågar!) och bara njut. Du lär dig hur folk faktiskt pratar, hur relationer funkar, vad som är viktigt. Och när du börjar känna igen skådisarna i olika serier, då vet du att du är inne i matchen!</p>`, icon: 'fas fa-tv', color: 'var(--sw-resource-tv-blue)' },
        { id: 'news-sources-info-trigger', title: 'Magnus om Nyheter:', content: `<p>Nyheter kan kännas tunga, jag vet. Men att fatta vad som händer i Sverige, även de små sakerna, är nyckeln till att verkligen förstå kulturen och hur folk tänker. Börja med Lilla Aktuellt om du är ny, sen våga dig på de stora drakarna. Korta nyhetsklipp på nätet är också toppen – snabb input, aktuella ämnen. Och du, att kunna diskutera dagens snackis på svenska? Ovärderligt.</p>`, icon: 'fas fa-newspaper', color: 'var(--sw-resource-news-red)' }
    ];
    popoverData.forEach(data => {
        setupInfoPopoverTrigger(data.id, data.title, data.content, data.icon, data.color);
    });

    // --- MODAL FUNCTIONS (Global for access from static HTML & this script) ---
    window.closeGenericModal = function() {
        if (!modalPlaceholder) return;
        const overlay = modalPlaceholder.querySelector('.modal-overlay');
        if (overlay && overlay.classList.contains('visible')) {
            overlay.classList.remove('visible');
            const iframes = overlay.querySelectorAll('iframe');
            iframes.forEach(iframe => { try { let src = iframe.src; iframe.src = ''; iframe.src = src; } catch (e) {} });
            setTimeout(() => { if (modalPlaceholder) modalPlaceholder.innerHTML = ''; }, 300);
        }
    };
    
    // MODAL FOR SCANDINAVIAN ENCOUNTERS (Corrected Content Order & Video)
    window.openEncounterModalFromMain = function(itemData) {
        if (!modalPlaceholder || !itemData) { console.error("Modal Error: Encounter data missing for modal."); return; }

        let flagsHTML = '';
        if (itemData.countryCodes && Array.isArray(itemData.countryCodes)) {
            flagsHTML = itemData.countryCodes.map(code => 
                `<img src="https://flagcdn.com/h24/${code.toLowerCase()}.png" alt="${code}" class="title-inline-flag-img" style="height:1.1em; margin-right: 6px; vertical-align: -0.1em; border-radius: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">`
            ).join('');
        } else if (itemData.flags && Array.isArray(itemData.flags)) { 
             flagsHTML = itemData.flags.map(flag => `<span class="flag-icon">${flag}</span>`).join(' ');
        }

        const videoSectionHTML = itemData.sampleVideoEmbed ? `
            <div class="modal-video-embed-area"> 
                <div class="video-embed-container">
                    <iframe src="${itemData.sampleVideoEmbed}" title="${itemData.title || 'Video'} Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            </div>` : ''; // Removed fallback message, video is primary content here
        
        const longDescHTML = itemData.longDesc ? 
            `<div class="modal-long-description-area">
                <h4>Beskrivning</h4>
                <p>${itemData.longDesc.replace(/\n/g, '</p><p>')}</p>
            </div>` : 
            (itemData.cardTeaser ? `<div class="modal-long-description-area"><p>${itemData.cardTeaser}</p></div>` : '');
        
        const aljohnsNoteHTML = itemData.aljohnsNote ? 
            `<div class="modal-aljohns-take-container">
                <h4>Magnus Kommentar</h4>
                <div class="modal-aljohns-take">${itemData.aljohnsNote.replace(/\n/g, '<br>')}</div>
            </div>` : '';
        
        let modalThemeClass = 'scandinavian-encounter-modal';
        if (itemData.countryCodes) {
            if (itemData.countryCodes.includes('NO')) modalThemeClass += ' norway-theme-modal';
            else if (itemData.countryCodes.includes('DK') || itemData.countryCodes.includes('EU')) modalThemeClass += ' denmark-ehef-theme-modal';
            else if (itemData.countryCodes.includes('FI')) modalThemeClass += ' finland-theme-modal';
        }

        const modalIdSuffix = itemData.id || (itemData.title || 'encounter').replace(/\W/g, '');

        modalPlaceholder.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content ${modalThemeClass}" role="dialog" aria-modal="true" aria-labelledby="encounterModalTitle-${modalIdSuffix}">
                    <button class="modal-close-btn" aria-label="Stäng modalen"><i class="fas fa-times"></i></button>
                    <div class="modal-header">
                        <h2 id="encounterModalTitle-${modalIdSuffix}">${flagsHTML} ${itemData.title || 'Skandinaviskt Äventyr'}</h2>
                    </div>
                    <div class="modal-main-content-area">
                        ${videoSectionHTML}
                        ${longDescHTML}
                        ${aljohnsNoteHTML}
                    </div>
                </div>
            </div>`;

        const overlay = modalPlaceholder.querySelector('.modal-overlay');
        setTimeout(() => {
            if(overlay) overlay.classList.add('visible');
        }, 10);
        const closeButton = overlay?.querySelector('.modal-close-btn');
        const firstFocusable = closeButton || overlay?.querySelector('iframe, button, [href]');
        if(firstFocusable) firstFocusable.focus();
        overlay?.addEventListener('click', e => { if (e.target === overlay) closeGenericModal(); });
        closeButton?.addEventListener('click', closeGenericModal);
        overlay?.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); closeGenericModal(); } });
    };

    window.openEncounterModalById = function(itemId) {
        if (!swedishResourceData || !swedishResourceData.scandinavianEncounters) { console.error("Encounter data source missing."); return; }
        const itemData = swedishResourceData.scandinavianEncounters.find(item => item.id === itemId);
        if (itemData) {
            if (typeof openEncounterModalFromMain === 'function') {
                openEncounterModalFromMain(itemData);
            } else { console.error('CRITICAL: openEncounterModalFromMain is not defined.'); }
        } else { console.error(`Encounter data not found for ID: ${itemId}`); }
    };

    // MODAL FOR RESTAURANTS (No Tabs)
    window.openRestaurantPHModalFromMain = function(itemData) {
       if (!modalPlaceholder || !itemData) { console.error("Modal error: Restaurant data missing."); return; }
        let modalHeaderContent = `<div class="restaurant-ph-modal-header-text"><h2 id="restaurantModalTitle-${itemData.id}">${itemData.name || 'Restaurang'}</h2>`;
        if (itemData.fullAddress) modalHeaderContent += `<p class="restaurant-modal-address"><i class="fas fa-map-marked-alt"></i> ${itemData.fullAddress}</p>`;
        modalHeaderContent += `</div>`;
        const modalImageHTML = itemData.cardImageSrc ? `<img src="${itemData.cardImageSrc}" alt="${itemData.name || ''}" class="modal-image restaurant-modal-image">` : '';
        const longDescHTML = itemData.longDesc ? `<div class="modal-long-description-area"><h4>Om Restaurangen</h4><p>${itemData.longDesc.replace(/\n/g, '</p><p>')}</p></div>` : (itemData.shortDesc ? `<div class="modal-long-description-area"><p>${itemData.shortDesc}</p></div>` : '');
        const aljohnsEncounterHTML = itemData.aljohnsEncounter ? `<div class="modal-aljohns-take-container"><h4>Magnus Upplevelse</h4><div class="modal-aljohns-take">${itemData.aljohnsEncounter.replace(/\n/g, '<br>')}</div></div>` : '';
        let linksHTML = '';
        if(itemData.facebookLink || itemData.websiteLink) {
            linksHTML += '<div class="modal-external-links-area"><div class="modal-links">';
            if(itemData.facebookLink) linksHTML += `<a href="${itemData.facebookLink}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-outline"><i class="fab fa-facebook-f"></i> Facebook</a>`;
            if(itemData.websiteLink) linksHTML += `<a href="${itemData.websiteLink}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-outline"><i class="fas fa-globe"></i> Webbplats</a>`;
            linksHTML += '</div></div>';
        }
        modalPlaceholder.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content swedish-restaurant-ph-modal" role="dialog" aria-modal="true" aria-labelledby="restaurantModalTitle-${itemData.id}">
                    <button class="modal-close-btn" aria-label="Stäng modalen"><i class="fas fa-times"></i></button>
                    <div class="modal-header restaurant-ph-modal-header">
                        ${modalImageHTML}
                        ${modalHeaderContent}
                    </div>
                    <div class="modal-main-content-area">
                        ${longDescHTML}
                        ${aljohnsEncounterHTML}
                        ${linksHTML}
                    </div>
                </div>
            </div>`;
        const overlay = modalPlaceholder.querySelector('.modal-overlay');
        setTimeout(() => { if(overlay) overlay.classList.add('visible'); }, 10);
        const closeButton = overlay?.querySelector('.modal-close-btn');
        const firstFocusable = closeButton || overlay?.querySelector('button, [href]');
        if(firstFocusable) firstFocusable.focus();
        overlay?.addEventListener('click', e => { if (e.target === overlay) closeGenericModal(); });
        closeButton?.addEventListener('click', closeGenericModal);
        overlay?.addEventListener('keydown', e => { if (e.key === 'Escape') { e.preventDefault(); closeGenericModal(); } });
    };

    // --- APPLY THEMES TO STATIC SCANDINAVIAN ENCOUNTER CARDS ---
    function applyEncounterCardThemes() {
        const gridContainer = document.getElementById('scandinavian-encounters-grid-container');
        if (!gridContainer) return;
        const cards = gridContainer.querySelectorAll('.scandinavian-encounter-card');
        const encountersData = swedishResourceData.scandinavianEncounters;
        if (!encountersData) return;
        cards.forEach(card => {
            const cardIdFromHTML = card.dataset.id || card.getAttribute('onclick')?.match(/'([^']+)'/)?.[1];
            if (cardIdFromHTML) {
                const itemData = encountersData.find(item => item.id === cardIdFromHTML);
                if (itemData) {
                    card.classList.remove('norway-theme-card', 'denmark-ehef-theme-card', 'finland-theme-card');
                    if (itemData.themeAccentVar) { // Use themeAccentVar if present
                        const themeClassName = itemData.themeAccentVar.replace('--','').replace('-accent','-theme-card');
                        card.classList.add(themeClassName);
                    } else if (itemData.countryCodes?.includes('NO')) card.classList.add('norway-theme-card');
                    else if (itemData.countryCodes?.includes('DK') || itemData.countryCodes?.includes('EU')) card.classList.add('denmark-ehef-theme-card');
                    else if (itemData.countryCodes?.includes('FI')) card.classList.add('finland-theme-card');
                }
            }
        });
    }
    applyEncounterCardThemes();

    // --- RENDER SWEDISH RESTAURANTS PH (Dynamic Card Creation) ---
    function renderMainSwedishRestaurantsPH() {
        const gridContainer = document.getElementById('swedish-restaurants-ph-grid-container');
        if (!gridContainer) { console.warn("Swedish Restaurants PH grid container not found."); return; }
        const restaurantsData = swedishResourceData.swedishRestaurantsPH;
        if (!restaurantsData || !Array.isArray(restaurantsData) || restaurantsData.length === 0) {
            gridContainer.innerHTML = '<p class="empty-category-message">Inga restauranger att visa.</p>'; return;
        }
        gridContainer.innerHTML = '';
        restaurantsData.forEach(itemData => {
            if (!itemData || typeof itemData.name === 'undefined') return;
            const card = createNode('article');
            card.className = 'restaurant-ph-card';
            card.setAttribute('role', 'button'); card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Läs mer om ${itemData.name}`);
            card.dataset.itemId = itemData.id; 

            let linksHTML = '';
            if (itemData.facebookLink) linksHTML += `<a href="${itemData.facebookLink}" class="btn-icon" target="_blank" rel="noopener noreferrer" aria-label="${itemData.name} Facebook" onclick="event.stopPropagation();"><i class="fab fa-facebook-f"></i></a>`;
            if (itemData.websiteLink) linksHTML += `<a href="${itemData.websiteLink}" class="btn-icon" target="_blank" rel="noopener noreferrer" aria-label="${itemData.name} Webbplats" onclick="event.stopPropagation();"><i class="fas fa-globe"></i></a>`;
            const cardImageSrc = itemData.cardImageSrc || '../images/placeholder_resource_card.png';
            card.innerHTML = `
                <div class="restaurant-ph-card-image-wrapper"><img src="${cardImageSrc}" alt="${itemData.name || ''}" class="restaurant-ph-card-image">
                    ${itemData.shortDesc ? `<p class="restaurant-ph-card-teaser">${itemData.shortDesc}</p>` : ''}</div>
                <div class="restaurant-ph-card-content">
                    <h4>${itemData.name}</h4>
                    ${itemData.locationCity ? `<p class="restaurant-ph-card-location"><i class="fas fa-map-marker-alt" aria-hidden="true"></i> ${itemData.locationCity}</p>` : ''}
                    ${linksHTML ? `<div class="restaurant-ph-card-links">${linksHTML}</div>` : ''}
                </div>`;
            
            const openModalAction = () => {
                const currentItemData = swedishResourceData.swedishRestaurantsPH.find(r => r.id === card.dataset.itemId);
                if (currentItemData && typeof openRestaurantPHModalFromMain === 'function') {
                    openRestaurantPHModalFromMain(currentItemData);
                } else { console.error("Could not find item data or modal function for restaurant.");}
            };
            card.addEventListener('click', e => { if (!e.target.closest('a.btn-icon')) openModalAction(); });
            card.addEventListener('keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.target.closest('a.btn-icon')) { e.preventDefault(); openModalAction(); }});
            gridContainer.appendChild(card);
        });
    }

    // --- INITIAL PAGE RENDER CALLS ---
    renderMainSwedishRestaurantsPH(); 

    console.log("Swedish page main renderer (COMPLETE V FINAL - Popovers, Modals Updated) initialized.");
});