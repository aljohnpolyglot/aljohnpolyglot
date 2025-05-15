// D:\website\languages\js\renderers\swedish-page-resources-renderer.js
// COMPLETE SCRIPT V11.2 - Enhanced Logging for Category Visible Count Debugging

document.addEventListener('DOMContentLoaded', function() {
    if (typeof swedishResourceData === 'undefined') {
        console.error('CRITICAL: swedishResourceData is UNDEFINED (from resources-renderer).');
        return;
    }

    const modalPlaceholder = document.getElementById('resource-modal-placeholder');
    if (!modalPlaceholder) {
        console.error("CRITICAL: Modal placeholder 'resource-modal-placeholder' not found (from resources-renderer)!");
    }

    const createNode = (element) => document.createElement(element);
    const append = (parent, el) => parent.appendChild(el);

    // --- ORIGINAL CATEGORY CONTENT STORAGE ---
    const originalResourceCategoryContent = {};
    document.querySelectorAll('#swedish-resources .resource-category-wrapper').forEach(categoryWrapper => {
        const categoryId = categoryWrapper.dataset.categoryId;
        if (categoryId) {
            originalResourceCategoryContent[categoryId] = {};
            const descEl = document.getElementById(`${categoryId}-desc`);
            if (descEl) {
                if (categoryId === 'personalities-all') {
                    const staticDesc = "Från schackbräden och YouTube-studior till fotbollsplaner och scener – här är några av de profiler som fångat min uppmärksamhet och berikat min svenska upplevelse. Att följa dem på sociala medier eller se deras intervjuer ger en autentisk inblick i språket.";
                    const staticTip = "Att följa personer med passion, oavsett ämne, är ett fantastiskt sätt att lära sig vardagsspråk och få kulturella insikter. Plus, det är ju kul! Interaktioner på Instagram, kommentarer på YouTube – allt är exponering.";
                    originalResourceCategoryContent[categoryId].description = `${staticDesc} ${staticTip.replace(/^Att följa personer med passion, oavsett ämne, är ett fantastiskt sätt att lära sig vardagsspråk och få kulturella insikter. Plus, det är ju kul! /, "Det är ett roligt och engagerande sätt att lära sig – ")}`;
                    originalResourceCategoryContent[categoryId].tipText = "";
                    originalResourceCategoryContent[categoryId].tipPersona = "";
                } else {
                    originalResourceCategoryContent[categoryId].description = descEl.innerHTML;
                }
            } else if (categoryId === 'top-podcasts') {
                 const podcastsDescEl = document.getElementById('top-podcasts-desc');
                 if (podcastsDescEl) originalResourceCategoryContent[categoryId].description = podcastsDescEl.innerHTML;
            }

            const tipContainerEl = categoryWrapper.querySelector('.resource-tip, .large-image-tip-box');
            if (tipContainerEl && categoryId !== 'personalities-all') {
                const tipContentDiv = tipContainerEl.querySelector('.tip-content');
                if (tipContentDiv) {
                    const personaEl = tipContentDiv.querySelector('strong');
                    const textSpanEl = tipContentDiv.querySelector('span');
                    if (personaEl) originalResourceCategoryContent[categoryId].tipPersona = personaEl.innerHTML;
                    if (textSpanEl) originalResourceCategoryContent[categoryId].tipText = textSpanEl.innerHTML;
                }
                originalResourceCategoryContent[categoryId].tipContainerDisplay = window.getComputedStyle(tipContainerEl).display || 'block';
                 if (tipContainerEl.classList.contains('large-image-tip-box')) {
                    originalResourceCategoryContent[categoryId].tipContainerDisplay = 'flex';
                }
            }
        }
    });
    // console.log("Debug Original Content:", JSON.stringify(originalResourceCategoryContent, null, 2));

 // In your js/renderers/swedish-page-resources-renderer.js
// (Ensure modalPlaceholder, createNode are defined at the top of this file or globally)

// === MODAL FUNCTIONS (for resources) - REVISED FOR NEW ORDER & NO TABS ===

// In js/renderers/swedish-page-resources-renderer.js
// (Ensure modalPlaceholder, createNode are defined at the top of this file or globally)

// === MODAL FUNCTIONS (for resources) - CORRECTED ORDER & NO TABS ===

function closeResourceModal() {
    if (!modalPlaceholder) return;
    const overlay = modalPlaceholder.querySelector('.modal-overlay.swedish-resource-modal-overlay');
    if (overlay && overlay.classList.contains('visible')) {
        overlay.classList.remove('visible');
        const iframes = overlay.querySelectorAll('iframe');
        iframes.forEach(iframe => { 
            try { 
                // Attempt to stop video playback
                let currentSrc = iframe.src;
                iframe.src = ''; // Clear src to stop playback
                // Optionally, restore src if iframe might be reused immediately, though usually not the case for modals.
                // iframe.src = currentSrc; 
            } catch (e) { /* ignore errors if src access is restricted */ }
        });
        setTimeout(() => { 
            if (modalPlaceholder) modalPlaceholder.innerHTML = ''; 
        }, 300); // Match CSS transition duration for fade-out
    }
}

function openSpecificResourceModal(itemData, category) {
    if (!modalPlaceholder || !itemData) {
        console.error("Modal error: Missing placeholder or itemData for specific resource.", { itemData, category });
        return;
    }

    // --- 1. Prepare all content sections in the desired order ---
    let videoHTML = '';
    if (itemData.sampleVideoEmbed && itemData.sampleVideoEmbed.trim() !== '') {
        videoHTML = `
            <div class="modal-video-embed-area">
                <div class="video-embed-container">
                    <iframe src="${itemData.sampleVideoEmbed}" title="${itemData.name || itemData.title || 'Sample Video'}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                </div>
            </div>`;
    }

    let longDescHTML = '';
    if (itemData.longDesc && itemData.longDesc.trim() !== '') {
        longDescHTML = `
            <div class="modal-long-description-area">
                <h4>Om Resursen</h4>
                <p>${itemData.longDesc.replace(/\n/g, '</p><p>')}</p>
            </div>`;
    } else if (itemData.shortDesc && itemData.shortDesc.trim() !== '') { // Fallback to shortDesc
         longDescHTML = `
            <div class="modal-long-description-area">
                <h4>Info</h4>
                <p>${itemData.shortDesc}</p>
            </div>`;
    }

    let cefrHTML = '';
    const cefrLevelsExist = itemData.cefrLevels && Array.isArray(itemData.cefrLevels) && itemData.cefrLevels.length > 0;
    // Check if all defined levels have strength 'none' or are just strings without strength info
    const allCefrEffectivelyNone = cefrLevelsExist ? itemData.cefrLevels.every(l => (typeof l === 'object' && l.strength === 'none') || (typeof l === 'string' && !l.includes(':'))) : true;
    const showCefrSection = cefrLevelsExist && !allCefrEffectivelyNone;


    if (showCefrSection) {
        cefrHTML = '<div class="modal-cefr-details-area">';
        cefrHTML += '<h4>Rekommenderad Nivå:</h4>';
        cefrHTML += '<div class="cefr-dots-container"><p>'; // Paragraph to hold dots and strengths

        const standardCefrLevels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
        const itemCefrMap = new Map();
        // Normalize CEFR data: handle both strings and objects
        const normalizedCefrLevels = itemData.cefrLevels.map(l => {
            if (typeof l === 'string') return { level: l.toUpperCase(), strength: 'medium' }; // Default strength if string
            if (typeof l === 'object' && l.level) return { ...l, level: l.level.toUpperCase() };
            return null;
        }).filter(Boolean);

        normalizedCefrLevels.forEach(lObj => itemCefrMap.set(lObj.level, lObj));
        
        standardCefrLevels.forEach(stdLvl => {
            const lI = itemCefrMap.get(stdLvl);
            let lCls = `level-${stdLvl.toLowerCase().replace('+', 'plus')}`;
            let lvlTitle = stdLvl; 
            if (lI && lI.strength !== 'none') { // Only add strength class if not 'none'
                lCls += ` ${lI.strength || 'medium'}`; 
                lvlTitle += `${lI.strength && lI.strength !== 'medium' ? ': '+lI.strength : ''}${lI.note ? ' ('+lI.note+')' : ''}`; 
            } else { 
                lCls += ' not-present'; // If not found or strength is 'none'
            }
            cefrHTML += `<span class="cefr-level-dot ${lCls}" title="${lvlTitle}">${stdLvl}</span>`;
        });

        if (itemData.strengths && itemData.strengths.length > 0) {
            cefrHTML += `<br><strong>Styrkor:</strong> ${itemData.strengths.join(', ')}`;
        }
        cefrHTML += '</p></div></div>';
    }
    
    const mainComment = (category === 'top-podcasts' && itemData.aljohnsTake) ? itemData.aljohnsTake : itemData.aljohnsNote;
    let magnusCommentHTML = '';
    if (mainComment && mainComment.trim() !== '') {
        magnusCommentHTML = `
            <div class="modal-aljohns-take-container"> 
                <h4>Magnus Kommentar</h4> 
                <div class="modal-aljohns-take">${mainComment.replace(/\n/g, '<br>')}</div>
            </div>`;
    }

    let linksHTML = '';
    const linksArray = [];
    // Populate linksArray as before...
    if (itemData.youtubeChannel) linksArray.push({ href: itemData.youtubeChannel, text: 'YouTube-kanal', icon: 'fab fa-youtube' });
    else if (itemData.youtube) linksArray.push({ href: itemData.youtube, text: 'YouTube', icon: 'fab fa-youtube' });
    if (itemData.spotifyLink) linksArray.push({ href: itemData.spotifyLink, text: 'Spotify', icon: 'fab fa-spotify' });
    if (itemData.websiteLink) linksArray.push({ href: itemData.websiteLink, text: 'Webbplats', icon: 'fas fa-globe' });
    if (itemData.svtLink) linksArray.push({ href: itemData.svtLink, text: 'SVT Play', icon: 'fas fa-tv' });
    if (itemData.instagram) linksArray.push({ href: itemData.instagram, text: 'Instagram', icon: 'fab fa-instagram' });
    if (itemData.twitch) linksArray.push({ href: itemData.twitch, text: 'Twitch', icon: 'fab fa-twitch' });
    if (itemData.podcastLink) linksArray.push({ href: itemData.podcastLink, text: 'Lyssna på Podden', icon: 'fas fa-podcast' });

    if (linksArray.length > 0) {
        linksHTML = '<div class="modal-external-links-area">';
        // linksHTML += '<h4>Externa Länkar</h4>'; // Optional title
        linksHTML += '<div class="modal-links">';
        linksArray.forEach(link => {
            linksHTML += `<a href="${link.href}" target="_blank" rel="noopener noreferrer" class="btn btn-small btn-outline">
                                    ${link.icon ? `<i class="${link.icon}"></i> ` : ''}${link.text}
                                  </a>`;
        });
        linksHTML += '</div></div>';
    }

    // --- 2. Assemble Modal HTML ---
    const modalImgCls = (['youtube-main', 'news-sources', 'top-podcasts', 'learning-channels', 'personalities-all'].includes(category)) ? 'channel-logo' : '';
    const modalIdSuffix = itemData.id || (itemData.name || 'resource').replace(/\W/g, '');

    modalPlaceholder.innerHTML = `
        <div class="modal-overlay swedish-resource-modal-overlay">
            <div class="modal-content swedish-resource-modal" role="dialog" aria-modal="true" aria-labelledby="resourceModalTitle-${modalIdSuffix}">
                <button class="modal-close-btn" aria-label="Stäng modalen"><i class="fas fa-times"></i></button>
                
                <div class="modal-header">
                    <img src="${itemData.imgSrc || itemData.imageSrc || '../images/placeholder_resource_card.png'}" alt="${itemData.name || itemData.title || 'Resursbild'}" class="modal-image ${modalImgCls}">
                    <h2 id="resourceModalTitle-${modalIdSuffix}">${itemData.name || itemData.title || 'Resursinformation'}</h2>
                </div>
                
                <div class="modal-main-content-area">
                    ${videoHTML}
                    ${longDescHTML}
                    ${cefrHTML}
                    ${magnusCommentHTML} 
                    ${linksHTML}       
                </div>

             
            </div>
        </div>`;

    // --- 3. Show Modal and Add Event Listeners ---
    const overlay = modalPlaceholder.querySelector('.modal-overlay.swedish-resource-modal-overlay');
    if (overlay) {
        setTimeout(() => {
            overlay.classList.add('visible');
            const closeButton = overlay.querySelector('.modal-close-btn');
            const firstFocusableElement = closeButton || overlay.querySelector('iframe, button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            if(firstFocusableElement) firstFocusableElement.focus();
        }, 10);
        
        overlay.addEventListener('click', e => { 
            if (e.target === overlay || e.target.closest('.modal-close-btn')) {
                closeResourceModal();
            }
        });
        overlay.addEventListener('keydown', e => { 
            if (e.key === 'Escape') { 
                e.preventDefault(); 
                closeResourceModal(); 
            } 
        });
    } else {
        console.error("Failed to find modal overlay after injecting HTML for resource modal.");
    }
}

// ... (keep your createStandardResourceCard, createPodcastCard, renderStandardResourceCategory, renderTopPodcastsSpotlight, renderSnabbFaktaHighlight functions)
// ... (keep your CEFR filter logic: getAljohnPhase, getCustomResourceCategoryContent, applyCefrFiltersForResources, and their event listeners)
// ... (keep your INITIAL PAGE RENDER CALLS at the end of the file)


    // === CARD CREATION FUNCTIONS ===
    function createStandardResourceCard(itemData, categoryId) {
        const card = createNode('div');
        card.className = 'resource-item-card';
        if (categoryId === 'personalities-all' && itemData.imgSrc && itemData.imgSrc.includes('/players/') && itemData.instagram && !(itemData.youtubeChannel || itemData.youtube)) {
            card.classList.add('player-card');
        }
        card.dataset.item = JSON.stringify(itemData);
        card.dataset.category = categoryId;

        if (itemData.cefrLevels && Array.isArray(itemData.cefrLevels)) {
            const actualLevels = itemData.cefrLevels
                .map(l => (typeof l === 'object' && l.level !== null && l.level !== undefined) ? String(l.level) : (typeof l === 'string' ? l : null) )
                .filter(Boolean)
                .map(level => level.toUpperCase());
            card.dataset.cefrLevels = actualLevels.length > 0 ? actualLevels.join(',') : "";
        } else {
            card.dataset.cefrLevels = "";
        }

        const imgSrc = itemData.imgSrc || itemData.imageSrc || '../images/placeholder_resource_card.png';
        let socialButtonsHTML = '';
        if (itemData.youtubeChannel) socialButtonsHTML += `<a href="${itemData.youtubeChannel}" class="btn-icon youtube" aria-label="YouTube-kanal" onclick="event.stopPropagation();"><i class="fab fa-youtube"></i></a>`;
        else if (itemData.youtube) socialButtonsHTML += `<a href="${itemData.youtube}" class="btn-icon youtube" aria-label="YouTube" onclick="event.stopPropagation();"><i class="fab fa-youtube"></i></a>`;
        if (itemData.spotifyLink) socialButtonsHTML += `<a href="${itemData.spotifyLink}" class="btn-icon spotify" aria-label="Spotify" onclick="event.stopPropagation();"><i class="fab fa-spotify"></i></a>`;
        if (itemData.websiteLink) socialButtonsHTML += `<a href="${itemData.websiteLink}" class="btn-icon website" aria-label="Webbplats" onclick="event.stopPropagation();"><i class="fas fa-globe"></i></a>`;
        if (itemData.svtLink) socialButtonsHTML += `<a href="${itemData.svtLink}" class="btn-icon svtplay" aria-label="SVT Play" onclick="event.stopPropagation();"><i class="fas fa-play-circle"></i></a>`;
        if (itemData.instagram) socialButtonsHTML += `<a href="${itemData.instagram}" class="btn-icon instagram" aria-label="Instagram" onclick="event.stopPropagation();"><i class="fab fa-instagram"></i></a>`;
        if (itemData.twitch) socialButtonsHTML += `<a href="${itemData.twitch}" class="btn-icon twitch" aria-label="Twitch" onclick="event.stopPropagation();"><i class="fab fa-twitch"></i></a>`;

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${imgSrc}" alt="${itemData.name || itemData.title}">
            </div>
            <div class="card-content-area">
                <h4>${itemData.name || itemData.title}</h4>
                <p class="card-short-desc">${itemData.shortDesc || ' '}</p>
                <div class="btn-group">${socialButtonsHTML}</div>
            </div>`;

        card.addEventListener('click', e => {
            if (e.target.closest('a.btn-icon')) return;
            try {
                const d = JSON.parse(card.dataset.item);
                openSpecificResourceModal(d, card.dataset.category);
            } catch (pE) {
                console.error("Error parsing item data for modal:", pE, card.dataset.item);
            }
        });
        return card;
    }

    function createPodcastCard(podcastData) {
        const card = createNode('div');
        card.className = 'swedish-podcast-card';
        card.dataset.item = JSON.stringify(podcastData);
        card.dataset.category = 'top-podcasts';

        if (podcastData.cefrLevels && Array.isArray(podcastData.cefrLevels)) {
            const actualLevels = podcastData.cefrLevels
                .map(l => (typeof l === 'object' && l.level !== null && l.level !== undefined) ? String(l.level) : (typeof l === 'string' ? l : null) )
                .filter(Boolean)
                .map(level => level.toUpperCase());
            card.dataset.cefrLevels = actualLevels.length > 0 ? actualLevels.join(',') : "";
        } else {
            card.dataset.cefrLevels = "";
        }

        card.innerHTML = `
            <img src="${podcastData.imageSrc || '../images/placeholder_resource_card.png'}" alt="${podcastData.name}" class="podcast-card-image-new">
            <h4 class="podcast-card-name-new">${podcastData.name}</h4>
            <p class="podcast-card-shortdesc-new">${podcastData.shortDesc || 'Klicka för mer info...'}</p>
            <a href="${podcastData.podcastLink || '#'}" target="_blank" class="btn btn-primary podcast-card-button-new" onclick="event.stopPropagation();">Lyssna här</a>`;

        card.addEventListener('click', e => {
            if (e.target.closest('a.podcast-card-button-new')) return;
            try {
                const itemDataForModal = JSON.parse(card.dataset.item);
                openSpecificResourceModal(itemDataForModal, 'top-podcasts');
            } catch (parseError) {
                console.error("Error parsing podcast data for modal:", parseError, card.dataset.item);
            }
        });
        return card;
    }

    // === SECTION/CATEGORY RENDERING FUNCTIONS ===
    function renderStandardResourceCategory(gridElementId, dataArray, categoryId) {
        const gridContainer = document.getElementById(gridElementId);
        if (!gridContainer) { console.warn(`Grid '#${gridElementId}' for '${categoryId}' not found.`); return; }
        if (!dataArray || dataArray.length === 0) {
            gridContainer.innerHTML = `<p class="empty-category-message">Inga resurser att visa i denna kategori.</p>`; return;
        }
        gridContainer.innerHTML = '';
        dataArray.forEach(item => append(gridContainer, createStandardResourceCard(item, categoryId)));
    }

    function renderTopPodcastsSpotlight() {
        const gridContainer = document.getElementById('top-podcasts-grid');
        if (!gridContainer) { console.warn("Top podcasts grid container (#top-podcasts-grid) not found."); return; }
        const podcastsData = swedishResourceData.topPodcasts;
        gridContainer.innerHTML = '';
        if (!podcastsData || podcastsData.length === 0) {
            gridContainer.innerHTML = '<p class="empty-category-message">Inga topp-poddar att visa just nu.</p>';
            return;
        }
        podcastsData.forEach(podcast => append(gridContainer, createPodcastCard(podcast)));
    }

    function renderSnabbFaktaHighlight() {
        const container = document.getElementById('snabbfakta-highlight-container');
        if (!container) { return; }
        const data = swedishResourceData.youtubeChannels?.snabbFaktaHighlight;
        if (!data) { container.innerHTML = ''; container.style.display = 'none'; return; }
        container.style.display = 'block';
        container.innerHTML = `
            <div class="snabbfakta-card">
                <img src="${data.logoSrc || '../images/channels/snabbfakta_logo.jpg'}" alt="Snabb Fakta Logo" class="snabbfakta-logo">
                <div class="snabbfakta-content">
                    <h4>Ett Måste från Snabb Fakta:</h4>
                    <a href="${data.youtubeLink}" target="_blank" class="video-title inline-link">${data.videoTitle}</a>
                    <p class="video-description">${data.videoDescription}</p>
                    <div class="aljohn-comment">
                        <p><strong><i class="fas fa-user-circle"></i> ${data.commentPersona || "Magnus"} kommenterade:</strong> "${data.aljohnComment}"</p>
                    </div>
                </div>
            </div>`;
    }

    // === CEFR FILTER LOGIC ===
    const cefrFilterButtons = document.querySelectorAll('#cefr-filter-controls-container .btn-filter-cefr');
    const clearCefrFiltersButton = document.getElementById('clear-cefr-filters');
    const activeFiltersDisplay = document.getElementById('active-filters-display');
    let activeCefrFilters = [];

    function getAljohnPhase(selectedLevels) {
        // ... (Logic from V11 - no changes)
        if (!selectedLevels || selectedLevels.length === 0) return null;
        let maxLevel = "A1";
        const levelOrder = {'A1':1, 'A2':2, 'B1':3, 'B2':4, 'C1':5, 'C2':6};
        selectedLevels.forEach(level => {
            const upperLevel = String(level).toUpperCase();
            if (levelOrder[upperLevel] && levelOrder[upperLevel] > levelOrder[maxLevel]) {
                 maxLevel = upperLevel;
            }
        });
        if (['A1', 'A2'].includes(maxLevel)) return 'Beginner';
        if (['B1', 'B2'].includes(maxLevel)) return 'Intermediate';
        if (['C1', 'C2'].includes(maxLevel)) return 'Advanced';
        return null;
    }

    function getCustomResourceCategoryContent(categoryId, currentActiveFilters, visibleItemCount) {
        // ... (The extensive custom message logic from V11 - no changes here)
        const aljohnPhase = getAljohnPhase(currentActiveFilters);
        const original = originalResourceCategoryContent[categoryId] || {};
        let newDescHTML = "", newTipTextHTML = "", newTipPersonaHTML = original.tipPersona || "Magnus Mjölkson säger:", showTip = false;

        const learningChannelsHref = "#learning-channels-section";
        const kidsContentHref = "#kids-content-section";

        if (currentActiveFilters.length === 0) {
            newDescHTML = original.description || "";
            newTipTextHTML = original.tipText || "";
            showTip = !!newTipTextHTML && categoryId !== 'personalities-all';
            if (categoryId === 'personalities-all' && original.description) newDescHTML = original.description;

        } else {
            if (visibleItemCount === 0) {
                const categoryWrapperEl = document.querySelector(`article.resource-category-wrapper[data-category-id="${categoryId}"]`);
                let catName = categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                if (categoryWrapperEl) {
                    const titleEl = categoryWrapperEl.querySelector('h3.subsection-title');
                    if (titleEl) {
                        let tempName = titleEl.textContent.trim();
                        const iconEl = titleEl.querySelector('i');
                        if (iconEl) tempName = tempName.replace(iconEl.textContent, '').trim();
                        const mainTextSpan = titleEl.querySelector('.title-text-main');
                        const highlightRedSpan = titleEl.querySelector('.title-highlight-red, .title-highlight-yellow'); // Added yellow
                        if (mainTextSpan && mainTextSpan.textContent.trim()) {
                            tempName = mainTextSpan.textContent.trim();
                        } else if (highlightRedSpan && highlightRedSpan.textContent.trim()) {
                            let baseTitle = tempName.split(highlightRedSpan.textContent)[0];
                            if (baseTitle) tempName = baseTitle.trim().replace(/:$/, '').trim();
                        }
                        if (tempName) catName = tempName;
                     }
                }
                newDescHTML = `För ${currentActiveFilters.join('/')}-nivå(er), finns det inga direkta CEFR-matchningar i '${catName}' just nu. `;
                let advice = "";
                switch (categoryId) {
                    case 'music-artists': case 'music-programs':
                        if (aljohnPhase === 'Beginner') advice = `Musik är dock toppen för att vänja örat vid språkljuden (Phase 1)! Leta efter barnvisor under <a href="${kidsContentHref}" class="inline-link">Barninnehåll</a> eller artister med tydligt uttal. Fokusera på rytm och känsla, inte textförståelse än.`;
                        else if (aljohnPhase === 'Intermediate') advice = "CEFR-märkning på musik är sällsynt. Lyssna på det du gillar! All exponering för 'massive input' (Phase 2) är bra. Använd texter för att aktivt bygga ordförråd.";
                        else advice = "För C1/C2 (Phase 3) är CEFR-märkning irrelevant för musik. Analysera texter, upptäck kulturella referenser och njut av språklig variation i vilken svensk musik som helst.";
                        break;
                    case 'youtube-main':
                        if (aljohnPhase === 'Beginner') advice = `YouTube är en guldgruva för Phase 1! Om inget visas här, kolla <a href="${learningChannelsHref}" class="inline-link">Språkinlärningskanaler</a> och <a href="${kidsContentHref}" class="inline-link">Barninnehåll</a> för tydligt tal och grundläggande input. Sök på 'lära sig svenska A1' direkt på YouTube.`;
                        else if (aljohnPhase === 'Intermediate') advice = "För B1/B2 (Phase 2) är mycket på YouTube relevant även utan CEFR-märkning. Sök på dina intressen på svenska! 'Massive input' är nyckeln. Använd svenska undertexter.";
                        else advice = "På C1/C2 (Phase 3) är hela svenska YouTube ditt. Utforska nischade kanaler, debatter, dokumentärer. Språket är sällan ett hinder nu.";
                        break;
                    case 'news-sources':
                        if (aljohnPhase === 'Beginner') advice = `Nyheter är ofta komplexa för Phase 1. 'Lilla Aktuellt' (om tillgängligt) eller nyhetsliknande program i <a href="${kidsContentHref}" class="inline-link">Barninnehåll</a> är bättre startpunkter. Fokusera på enkel, begriplig input.`;
                        else if (aljohnPhase === 'Intermediate') advice = "För B1/B2 (Phase 2), prova '8 Sidor' (lattlast.se) för nyheter på enklare svenska. Korta videoklipp på SVT Nyheter eller TV4 Nyheterna med svensk text kan också fungera.";
                        else advice = "På C1/C2 (Phase 3) kan du läsa och förstå de flesta svenska nyhetskällor. Gå direkt till DN, SvD, Aftonbladet, Expressen, eller SVT Nyheter för djupare analyser och opinionstexter.";
                        break;
                    case 'svt-series':
                        if (aljohnPhase === 'Beginner') advice = `SVT-serier har ofta avancerat språk och kulturell kontext, vilket är tufft för Phase 1. Fokusera istället på material under <a href="${kidsContentHref}" class="inline-link">Barninnehåll</a> (t.ex. Bolibompa, UR Play) eller <a href="${learningChannelsHref}" class="inline-link">Språkinlärningskanaler</a>. Enkla dialoger och repetition är viktigare nu.`;
                        else if (aljohnPhase === 'Intermediate') advice = "För B1/B2 (Phase 2) kan många SVT-serier fungera bra, särskilt med svenska undertexter. Leta efter dramaserier med tydlig dialog eller dokumentärer om ämnen du känner till. Det är utmärkt för 'massive input'.";
                        else advice = "På C1/C2 (Phase 3) är hela SVT Plays utbud en fantastisk resurs. Utforska komplexa dramer, historiska serier, djupa dokumentärer och debattprogram för att utmana och finslipa din svenska.";
                        break;
                    case 'personalities-all':
                        if (aljohnPhase === 'Beginner') advice = `Att följa personligheter är kul för Phase 1 exponering! Om inga specifika visas, leta efter kreatörer på YouTube under <a href="${kidsContentHref}" class="inline-link">Barninnehåll</a> eller <a href="${learningChannelsHref}" class="inline-link">Språkinlärningskanaler</a>. Deras innehåll är ofta anpassat för nybörjare.`;
                        else if (aljohnPhase === 'Intermediate') advice = "För B1/B2 (Phase 2), följ svenskar inom dina intresseområden på Instagram, YouTube, eller TikTok. Även om de inte är CEFR-märkta, ger de autentiskt vardagsspråk och 'massive input'.";
                        else advice = "På C1/C2 (Phase 3), följ experter, författare, journalister eller politiker. Lyssna på deras intervjuer och debatter för att exponeras för mer specialiserat och formellt språk.";
                        break;
                    case 'learning-channels':
                        if (aljohnPhase === 'Beginner') advice = "Detta är hjärtat av Phase 1! Om inga kanaler visas, sök på YouTube efter 'lära sig svenska A1/A2', 'Swedish grammar for beginners', etc. Dessa kanaler är designade för dig.";
                        else if (aljohnPhase === 'Intermediate') advice = "För B1/B2 (Phase 2), kan vissa lärandekanaler fortfarande vara användbara för specifika grammatikpunkter. Men ditt huvudfokus bör nu ligga på autentiskt material och 'massive input'.";
                        else advice = "På C1/C2 (Phase 3) är generella lärandekanaler sällan nödvändiga. Använd dem som referens för mycket specifika frågor, men prioritera avancerad interaktion och innehåll.";
                        break;
                    case 'kids-content':
                        if (aljohnPhase === 'Beginner') advice = `Barninnehåll är perfekt för Phase 1! Om inget visas här, sök på SVT Barn (Bolibompa), UR Play, eller YouTube efter svenska barnprogram. Enkelt språk och repetition är guld värt. Kolla även under <a href="${learningChannelsHref}" class="inline-link">Språkinlärningskanaler</a> för material anpassat för nybörjare.`;
                        else if (aljohnPhase === 'Intermediate') advice = `För B1/B2 (Phase 2), har du sannolikt vuxit ur det mesta direkta barninnehållet för primär inlärning, men det kan fortfarande vara bra för avslappnad repetition eller om du hittar något som intresserar dig. Fokusera mer på material i andra kategorier.`;
                        else if (aljohnPhase === 'Advanced') advice = `På C1/C2 (Phase 3) är barninnehåll generellt inte längre relevant för din språkutveckling. Ditt fokus bör ligga på autentiskt material för modersmålstalare i alla andra kategorier.`;
                        else advice = `Barninnehåll kan vara en bra start, men för din valda nivå, utforska gärna andra kategorier.`;
                        break;
                    case 'top-podcasts':
                        if (aljohnPhase === 'Beginner') advice = `Poddar är oftast för svåra för Phase 1. Fokusera på kortare ljudklipp, musik, eller video med tydligt tal (se t.ex. <a href="${kidsContentHref}" class="inline-link">Barninnehåll</a> eller <a href="${learningChannelsHref}" class="inline-link">Språkinlärningskanaler</a>). Du kan återkomma till poddar när du närmar dig A2/B1.`;
                        else if (aljohnPhase === 'Intermediate') advice = "För B1/B2 (Phase 2) är poddar som 'Lätt Svenska med Oskar' eller 'The Swedish Linguist' utmärkta. Om de inte visas, sök direkt på dem. Många poddar för modersmålstalare kan också fungera med aktivt lyssnande.";
                        else advice = "På C1/C2 (Phase 3), om inga poddar visas här, sök efter svenska poddar inom dina intresseområden. Utbudet är enormt! Detta är en utmärkt källa för avancerat språk och kulturell förståelse.";
                        break;
                    default: advice = "Överväg att utforska andra kategorier eller bredda dina filter för att hitta passande material på din nuvarande nivå.";
                }
                newDescHTML += advice;
                showTip = false;
            } else {
                let mainMsg = "";
                switch (categoryId) {
                    case 'music-artists': case 'music-programs':
                        if (aljohnPhase === 'Beginner') mainMsg = "Härligt! Musik är ett lekfullt sätt att börja på A1/A2 (Phase 1). Känn igen ord, njut av melodin. Fokusera på rytm och att vänja örat vid språkljuden. Använd texter som komplement senare.";
                        else if (aljohnPhase === 'Intermediate') mainMsg = "Perfekt för B1/B2 (Phase 2)! Nu kan du lyssna aktivt på texterna, utöka ordförrådet och fånga kulturella nyanser. Sjung med för att öva uttal och intonation ('massive input').";
                        else mainMsg = "På C1/C2 (Phase 3) kan du analysera texter och uppskatta den språkliga konsten. Utforska olika genrer för att bredda din förståelse för register och slang.";
                        break;
                    case 'youtube-main':
                        if (aljohnPhase === 'Beginner') mainMsg = "Toppen! Dessa kanaler kan ge bra, enkel input för A1/A2 (Phase 1). Fokusera på att förstå huvudbudskapet och snappa upp nya ord.";
                        else if (aljohnPhase === 'Intermediate') mainMsg = "Utmärkt för B1/B2 (Phase 2)! Använd dessa kanaler för 'massive input'. Försök titta med svenska undertexter eller helt utan för att utmana dig.";
                        else mainMsg = "På C1/C2 (Phase 3) erbjuder dessa kanaler en chans att fördjupa dig i ämnen på svenska och finslipa din förståelse för nyanserat språk.";
                        break;
                    case 'news-sources':
                        if (aljohnPhase === 'Beginner') mainMsg = "Bra! Nyheter på A1/A2 (Phase 1) bör vara enkla och tydliga. Fokusera på att förstå huvudpunkterna.";
                        else if (aljohnPhase === 'Intermediate') mainMsg = "Nyheter för B1/B2 (Phase 2) hjälper dig att bygga ordförråd kring aktuella händelser och förstå mer komplexa sammanhang.";
                        else mainMsg = "På C1/C2 (Phase 3) kan du analysera nyhetsartiklar, opinionstexter och debatter för att förstå olika perspektiv och språkliga stilar.";
                        break;
                    case 'svt-series':
                        if (aljohnPhase === 'Beginner') mainMsg = "Vissa enklare serier kan fungera för A1/A2 (Phase 1), speciellt om de har tydlig dialog och du använder svenska undertexter. Fokusera på att följa handlingen.";
                        else if (aljohnPhase === 'Intermediate') mainMsg = "Serier är fantastiska för 'massive input' på B1/B2 (Phase 2)! Försök att gradvis minska beroendet av undertexter.";
                        else mainMsg = "På C1/C2 (Phase 3) kan du njuta av komplexa svenska serier och uppskatta dialog, kulturella referenser och dialekter fullt ut.";
                        break;
                    case 'personalities-all':
                        showTip = false;
                        if (aljohnPhase === 'Beginner') mainMsg = "Att följa dessa personligheter ger bra exponering på A1/A2 (Phase 1). Fokusera på korta klipp, snappa upp ord och vänj örat vid språket. Kom ihåg, interaktioner och att se språket i verklig användning är guld värt!";
                        else if (aljohnPhase === 'Intermediate') mainMsg = "På B1/B2 (Phase 2) kan du förstå mer av deras intervjuer och inlägg. Det är toppen för att lära sig vardagsspråk, slang och få kulturella insikter!";
                        else mainMsg = "För C1/C2 (Phase 3), analysera deras språkbruk, delta i diskussioner (om möjligt) och förstå de kulturella nyanserna i deras kommunikation. Det här är autentisk svenska på hög nivå.";
                        break;
                    case 'learning-channels':
                        if (aljohnPhase === 'Beginner') mainMsg = "Perfekt! Dessa kanaler är designade för A1/A2 (Phase 1). Använd dem flitigt för grammatik, ordförråd och grundläggande konversation.";
                        else if (aljohnPhase === 'Intermediate') mainMsg = "Vissa kanaler här har material för B1/B2 (Phase 2), särskilt för specifika grammatikpunkter. Komplettera med mycket autentiskt material.";
                        else mainMsg = "På C1/C2 (Phase 3) kan dessa kanaler tjäna som referens för knepiga språkregler, men ditt huvudfokus bör vara på avancerad interaktion.";
                        break;
                    case 'kids-content':
                        showTip = false;
                        if (aljohnPhase === 'Beginner') {
                            mainMsg = "Helt rätt! Barninnehåll är din bästa vän på A1/A2 (Phase 1). Tydligt tal, enkla ord och repetition bygger en stark grund.";
                            showTip = !!original.tipText;
                        } else if (aljohnPhase === 'Intermediate') {
                             mainMsg = `På B1/B2-nivån kan barnprogram fortfarande vara ett roligt och avslappnat sätt att repetera eller bara njuta av språket utan press. Du kommer förstå det mesta!`;
                        } else if (aljohnPhase === 'Advanced') {
                             mainMsg = `För C1/C2-nivån är barninnehåll troligen för enkelt för aktiv inlärning, men kan vara en nostalgisk och enkel repetition ibland. Inget fel med lite Greta Gris även på avancerad nivå om man känner för det!`;
                        } else {
                            mainMsg = original.description || "Barninnehåll kan vara ett bra komplement.";
                        }
                        break;
                    case 'top-podcasts':
                        if (aljohnPhase === 'Beginner') mainMsg = "Bra start! Vissa poddar här kan fungera mot slutet av A2 (Phase 1), särskilt med transkript. Fokusera på att förstå huvudidén.";
                        else if (aljohnPhase === 'Intermediate') mainMsg = "Utmärkt för B1/B2 (Phase 2)! Dessa poddar är nyckeln till att förstå naturligt tal och vardagssvenska. Perfekt för 'massive input'.";
                        else mainMsg = "Fortsätt lyssna! Även på C1/C2 (Phase 3) hjälper dessa poddar dig att hålla språket levande och uppfatta subtila nyanser.";
                        break;
                    default: mainMsg = original.description || "Här är några resurser som matchar din valda nivå.";
                }
                newDescHTML = mainMsg;
                if (categoryId !== 'personalities-all' && !(categoryId === 'kids-content' && aljohnPhase !== 'Beginner')) {
                    newTipTextHTML = original.tipText || "";
                    showTip = !!newTipTextHTML;
                } else {
                    showTip = false;
                }
            }
        }
        return { description: newDescHTML, tipText: newTipTextHTML, tipPersona: newTipPersonaHTML, showTip: showTip };
    }


    function applyCefrFiltersForResources() {
        console.log("Applying CEFR filters. Active filters:", activeCefrFilters.join(', ') || "NONE");
        const allResourceCards = document.querySelectorAll('#swedish-resources .resource-item-card, #swedish-resources .swedish-podcast-card');

        // --- Step 1: Determine visibility for each card and apply/remove .hidden-by-filter ---
        console.log("--- CARD VISIBILITY PASS ---");
        allResourceCards.forEach((card, index) => {
            const cardTitle = card.querySelector('h4') ? card.querySelector('h4').textContent.trim() : `Card ${index + 1}`;
            const cardCefrLevelsString = card.dataset.cefrLevels || "";
            const cardCefrLevelsArray = cardCefrLevelsString ? cardCefrLevelsString.toUpperCase().split(',').filter(l => l.trim() !== '') : []; // Ensure no empty strings from split

            let isVisible = false;
            if (activeCefrFilters.length === 0) {
                isVisible = true; // Show all if no filters are active
            } else {
                // Card is visible if ANY of its CEFR levels match ANY of the active filters
                isVisible = activeCefrFilters.some(filterLevel => cardCefrLevelsArray.includes(filterLevel.toUpperCase()));
            }

            console.log(`  Card: "${cardTitle}", Dataset CEFR: "${cardCefrLevelsString}", Parsed Levels: [${cardCefrLevelsArray.join(', ')}], Active Filters: [${activeCefrFilters.join(', ')}], Calculated isVisible: ${isVisible}`);
            card.classList.toggle('hidden-by-filter', !isVisible);
            if (!isVisible) {
                // console.log(`    -> HIDING "${cardTitle}"`);
            } else {
                // console.log(`    -> SHOWING "${cardTitle}"`);
            }
        });
        console.log("--- END CARD VISIBILITY PASS ---");


        // --- Step 2: Update category descriptions based on the *now current* visibility of cards ---
        console.log("--- CATEGORY DESCRIPTION UPDATE PASS ---");
        document.querySelectorAll('#swedish-resources .resource-category-wrapper').forEach(categoryWrapper => {
            const categoryId = categoryWrapper.dataset.categoryId;
            if (!categoryId) {
                console.warn("Category wrapper found without data-category-id", categoryWrapper);
                return;
            }
            categoryWrapper.style.display = ''; // Ensure section is initially visible for content update

            const grid = categoryWrapper.querySelector('.swedish-item-grid, .top-podcast-grid-new');
            let visibleCardsInThisGrid = 0;

            if (grid) {
                // Count cards within THIS grid that DO NOT have the 'hidden-by-filter' class
                const currentlyVisibleCardsInGrid = grid.querySelectorAll('.resource-item-card:not(.hidden-by-filter), .swedish-podcast-card:not(.hidden-by-filter)');
                visibleCardsInThisGrid = currentlyVisibleCardsInGrid.length;
                console.log(`  Category: "${categoryId}". Grid found. Visible cards in this grid: ${visibleCardsInThisGrid}`);

                // For very detailed debugging of a specific category, e.g., 'news-sources' when B1 is active
                if (categoryId === 'news-sources' && activeCefrFilters.includes('B1')) {
                     console.log(`    Detailed check for 'news-sources' (B1 active):`);
                     const allCardsInNewsGrid = grid.querySelectorAll('.resource-item-card, .swedish-podcast-card');
                     allCardsInNewsGrid.forEach((cardInGrid, idx) => {
                        const cardTitle = cardInGrid.querySelector('h4') ? cardInGrid.querySelector('h4').textContent.trim() : `News Card ${idx + 1}`;
                        const isHidden = cardInGrid.classList.contains('hidden-by-filter');
                        console.log(`      - Card "${cardTitle}": Has .hidden-by-filter? ${isHidden}, CEFR: ${cardInGrid.dataset.cefrLevels}`);
                     });
                }

            } else {
                console.log(`  Category: "${categoryId}". Grid NOT found.`);
            }

            const content = getCustomResourceCategoryContent(categoryId, activeCefrFilters, visibleCardsInThisGrid);

            const descEl = document.getElementById(`${categoryId}-desc`);
            if (descEl) {
                descEl.innerHTML = content.description;
            } else if (categoryId === 'top-podcasts') {
                const topPodcastsDescEl = document.getElementById('top-podcasts-desc');
                if(topPodcastsDescEl) topPodcastsDescEl.innerHTML = content.description;
            }

            const tipContainerEl = categoryWrapper.querySelector('.resource-tip, .large-image-tip-box');
            if (tipContainerEl && categoryId !== 'personalities-all') {
                const originalDisplay = originalResourceCategoryContent[categoryId]?.tipContainerDisplay || (tipContainerEl.classList.contains('large-image-tip-box') ? 'flex' : 'block');
                tipContainerEl.style.display = content.showTip && content.tipText ? originalDisplay : 'none';
                if (content.showTip && content.tipText) {
                    const tipContentDiv = tipContainerEl.querySelector('.tip-content');
                    if (tipContentDiv) {
                        const personaEl = tipContentDiv.querySelector('strong');
                        const textSpanEl = tipContentDiv.querySelector('span');
                        if (personaEl) personaEl.innerHTML = content.tipPersona;
                        if (textSpanEl) textSpanEl.innerHTML = content.tipText;
                    }
                }
            }
        });
        console.log("--- END CATEGORY DESCRIPTION UPDATE PASS ---");

        if (activeFiltersDisplay) {
            if (activeCefrFilters.length > 0) {
                activeFiltersDisplay.textContent = `Visar resurser för nivå(er): ${activeCefrFilters.join(', ')}`;
                activeFiltersDisplay.style.display = 'inline-block';
                if (clearCefrFiltersButton) clearCefrFiltersButton.classList.add('less-active');
            } else {
                activeFiltersDisplay.style.display = 'none';
                if (clearCefrFiltersButton) clearCefrFiltersButton.classList.remove('less-active');
            }
        }
    }

    cefrFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cefrLevel = button.dataset.cefr.toUpperCase();
            button.classList.toggle('active');
            if (button.classList.contains('active')) {
                if (!activeCefrFilters.includes(cefrLevel)) activeCefrFilters.push(cefrLevel);
            } else {
                activeCefrFilters = activeCefrFilters.filter(level => level !== cefrLevel);
            }
            const levelOrder = {'A1':1, 'A2':2, 'B1':3, 'B2':4, 'C1':5, 'C2':6};
            activeCefrFilters.sort((a,b) => levelOrder[a] - levelOrder[b]);
            applyCefrFiltersForResources();
        });
    });

    if (clearCefrFiltersButton) {
        clearCefrFiltersButton.addEventListener('click', () => {
            activeCefrFilters = [];
            cefrFilterButtons.forEach(btn => btn.classList.remove('active'));
            applyCefrFiltersForResources();
        });
    }

    // --- INITIAL PAGE RENDER CALLS ---
    console.log("--- INITIAL PAGE RENDER ---");
    renderTopPodcastsSpotlight();
    renderStandardResourceCategory('music-artists-grid', swedishResourceData.music?.artists, 'music-artists');
    renderStandardResourceCategory('music-programs-grid', swedishResourceData.musicPrograms?.programs, 'music-programs');
    if (swedishResourceData.youtubeChannels) {
        renderStandardResourceCategory('youtube-channels-grid', swedishResourceData.youtubeChannels.channels, 'youtube-main');
        renderSnabbFaktaHighlight();
    } else {
        const ytGrid = document.getElementById('youtube-channels-grid');
        if (ytGrid) ytGrid.innerHTML = '<p class="empty-category-message">Inga YouTube-kanaler att visa.</p>';
        const snabbFaktaContainer = document.getElementById('snabbfakta-highlight-container');
        if (snabbFaktaContainer) { snabbFaktaContainer.innerHTML = ''; snabbFaktaContainer.style.display = 'none'; }
    }
    renderStandardResourceCategory('news-sources-grid', swedishResourceData.newsSources?.sources, 'news-sources');
    renderStandardResourceCategory('svt-series-grid', swedishResourceData.svtPlaySeries?.series, 'svt-series');
    renderStandardResourceCategory('all-personalities-grid', swedishResourceData.PersonalitiesAndInterests?.personalities, 'personalities-all');
    renderStandardResourceCategory('learning-channels-grid', swedishResourceData.languageLearningChannels?.channels, 'learning-channels');
    renderStandardResourceCategory('kids-content-grid', swedishResourceData.kidsContent?.items, 'kids-content');

    // Initial filter application (which should show all if no filters are active by default)
    applyCefrFiltersForResources();
    console.log("--- END INITIAL PAGE RENDER ---");
});