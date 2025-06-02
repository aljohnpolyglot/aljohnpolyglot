// D:\website\apps\js\ui_renderer.js

function displayStarRating(rating, totalStars = 10, ratingOutOf = 10) {
    let starsHtml = '';
    const numericRating = Number(rating);
    if (isNaN(numericRating)) {
        console.warn("Invalid rating for displayStarRating:", rating);
        return 'N/A';
    }
    const fullStars = Math.round(numericRating / (ratingOutOf / totalStars));
    for (let i = 1; i <= totalStars; i++) {
        starsHtml += `<i class="fas fa-star${i > fullStars ? ' muted-star' : ''}"></i>`;
    }
    return starsHtml;
}

function getCategoryIcon(categoryOrTypeName) {
    const lowerName = categoryOrTypeName.toLowerCase().replace(/\s+/g, '');
    if (lowerName.includes('reading') || lowerName.includes('readingassistant')) return '<i class="fas fa-book-open"></i>';
    if (lowerName.includes('listening') || lowerName.includes('mediaplayer')) return '<i class="fas fa-headphones"></i>';
    if (lowerName.includes('srs') || lowerName.includes('vocabularybuilding')) return '<i class="fas fa-brain"></i>';
    if (lowerName.includes('speaking') || lowerName.includes('languageexchange') || lowerName.includes('aitutor')) return '<i class="fas fa-comments"></i>';
    if (lowerName.includes('watching') || lowerName.includes('contentplatform')) return '<i class="fas fa-tv"></i>';
    if (lowerName.includes('writing')) return '<i class="fas fa-pencil-alt"></i>';
    if (lowerName.includes('grammarfocus') || lowerName.includes('interactiveexercises')) return '<i class="fas fa-spell-check"></i>';
    if (lowerName.includes('utility')) return '<i class="fas fa-cogs"></i>';
    if (lowerName.includes('community')) return '<i class="fas fa-users"></i>';
    if (lowerName.includes('dictionary') || lowerName.includes('translationtool')) return '<i class="fas fa-language"></i>';
    if (lowerName.includes('courseplatform')) return '<i class="fas fa-chalkboard-teacher"></i>';
    return '<i class="fas fa-tag"></i>';
}

function renderAppCards(appsToRender, currentFilters) {
    const appGrid = document.getElementById('app-grid');
    if (!appGrid) return;
    appGrid.innerHTML = '';

    if (appsToRender.length === 0) {
        appGrid.innerHTML = '<p class="no-results-message">No tools match your current filters. Try adjusting them or resetting!</p>';
        return;
    }

    appsToRender.forEach(app => {
        const card = document.createElement('div');
        card.className = 'app-card';
        card.dataset.appId = app.id;

        const cardRatingStars = displayStarRating(app.rating, 10); // 10 stars on card

        let cardInfoTagsHtml = '';
        const categoriesToShowOnCard = app.primaryCategories || [];
        const immersionTypesToShowOnCard = app.immersionTypes || [];
        let combinedDisplayTags = [...new Set([...categoriesToShowOnCard, ...immersionTypesToShowOnCard])];
        const activeCategoryFilters = currentFilters.category || [];
        const activeImmersionFilters = currentFilters.immersion || [];

        combinedDisplayTags.sort((a,b) => {
            const aNormalized = a.replace(/\s+/g, '');
            const bNormalized = b.replace(/\s+/g, '');
            let aIsActive = activeCategoryFilters.includes(a) || activeImmersionFilters.includes(aNormalized);
            let bIsActive = activeCategoryFilters.includes(b) || activeImmersionFilters.includes(bNormalized);
            if (aIsActive && !bIsActive) return -1;
            if (!aIsActive && bIsActive) return 1;
            return 0;
        });

        combinedDisplayTags.slice(0, 3).forEach(tagText => {
             const isHighlighted = activeCategoryFilters.includes(tagText) || activeImmersionFilters.includes(tagText.replace(/\s+/g, ''));
            cardInfoTagsHtml += `<span class="app-card-info-tag ${isHighlighted ? 'highlighted-tag' : ''}">${getCategoryIcon(tagText)} ${tagText}</span>`;
        });
        
        let cefrDisplayOnCard = '';
        if (app.cefrSuitability && currentFilters.cefr && currentFilters.cefr.length > 0) {
            const relevantCefr = currentFilters.cefr[0]; 
            const usage = app.cefrSuitability[relevantCefr];
            if (usage && usage !== "Very Low") {
                cefrDisplayOnCard = `<span class="app-card-info-tag cefr-card-tag">${relevantCefr}: ${usage}</span>`;
            }
        }

        card.innerHTML = `
            <div class="app-card-header">
                <img src="${app.logoUrl}" alt="${app.name} Logo" class="app-card-logo">
                <div class="app-card-title-section">
                    <h3>${app.name}</h3>
                    <div class="rating-stars-card">${cardRatingStars} <span class="rating-numeric">(${app.rating}/10)</span></div>
                </div>
            </div>
            <p class="app-card-tagline">${app.tagline}</p>
            <div class="app-card-key-tags-container">
                ${cefrDisplayOnCard}
                ${cardInfoTagsHtml}
            </div>
            <div class="app-card-buttons">
                <button class="app-card-details-btn" data-app-id="${app.id}">View Details</button>
                ${app.fullResourcePageUrl && app.fullResourcePageUrl.trim() !== "" ?
                `<a href="${app.fullResourcePageUrl}" target="_blank" class="app-card-full-review-btn">Aljohn's Full Review <i class="fas fa-external-link-alt"></i></a>` : ''}
            </div>
        `;
        appGrid.appendChild(card);
    });
}

function populateModal(appData) {
    if (!appData) return;

    // Populate modal header elements
    document.getElementById('modal-app-logo').src = appData.logoUrl;
    document.getElementById('modal-app-logo').alt = `${appData.name} Logo`;
    document.getElementById('modal-app-name').textContent = appData.name;
    document.getElementById('modal-app-tagline').textContent = appData.tagline;
    document.getElementById('modal-app-rating').innerHTML = `${displayStarRating(appData.rating, 10)} (${appData.rating}/10)`;
    
    // Populate Eyebrows in Modal Header
    const categoriesEyebrow = document.getElementById('modal-eyebrow-categories');
    if (categoriesEyebrow && appData.primaryCategories && appData.primaryCategories.length > 0) {
        categoriesEyebrow.innerHTML = `${getCategoryIcon(appData.primaryCategories[0])} ${appData.primaryCategories.slice(0, 2).join(' / ')}`;
        categoriesEyebrow.style.display = 'inline-flex';
    } else if (categoriesEyebrow) {
        categoriesEyebrow.style.display = 'none';
        categoriesEyebrow.innerHTML = '';
    }

    const immersionEyebrow = document.getElementById('modal-eyebrow-immersion');
    if (immersionEyebrow && appData.immersionTypes && appData.immersionTypes.length > 0) {
        immersionEyebrow.innerHTML = `${getCategoryIcon(appData.immersionTypes[0])} ${appData.immersionTypes.slice(0, 2).join(' / ')}`;
        immersionEyebrow.style.display = 'inline-flex';
    } else if (immersionEyebrow) {
        immersionEyebrow.style.display = 'none';
        immersionEyebrow.innerHTML = '';
    }

    // Populate modal body elements
    document.getElementById('modal-app-mytake').innerHTML = appData.myTake.replace(/\n/g, '<br>');

    const prosList = document.getElementById('modal-app-pros');
    prosList.innerHTML = '';
    if (appData.pros) appData.pros.forEach(pro => prosList.innerHTML += `<li>${pro}</li>`);

    const consList = document.getElementById('modal-app-cons');
    consList.innerHTML = '';
    if (appData.cons) appData.cons.forEach(con => consList.innerHTML += `<li>${con}</li>`);

    // --- NEW CEFR DOTS/PILLS DISPLAY ---
    const cefrDisplayContainer = document.getElementById('modal-app-cefr');
    cefrDisplayContainer.innerHTML = ''; // Clear previous content
    if (appData.cefrSuitability) {
        // Assume CEFR_ORDER is globally available or defined in this file for iteration order
        const orderOfDisplay = (typeof CEFR_ORDER !== 'undefined') ? CEFR_ORDER : ["A1", "A2", "B1", "B2", "C1", "C2"];
        
        orderOfDisplay.forEach(level => {
            if (appData.cefrSuitability.hasOwnProperty(level)) {
                const usage = appData.cefrSuitability[level];
                const usageClass = usage.toLowerCase().replace(/\s+/g, ''); // e.g., "verylow" or "high"
                
                const cefrPill = document.createElement('span');
                cefrPill.className = `cefr-dot cefr-usage-${usageClass}`; // e.g., "cefr-dot cefr-usage-high"
                cefrPill.textContent = level;
                cefrPill.title = `${level}: ${usage}`; // Tooltip for usability
                cefrDisplayContainer.appendChild(cefrPill);
            }
        });
    }
    // --- END NEW CEFR DOTS/PILLS DISPLAY ---

    document.getElementById('modal-app-cost').textContent = appData.cost || 'N/A';
    
    // Platforms paragraph is removed from the modal body.

    // Populate Links
    const linksContainer = document.getElementById('modal-app-links');
    linksContainer.innerHTML = '';
    if (appData.websiteUrl) linksContainer.innerHTML += `<a href="${appData.websiteUrl}" target="_blank" class="btn-link btn-website"><i class="fas fa-globe"></i> Website</a>`;
    if (appData.androidUrl) linksContainer.innerHTML += `<a href="${appData.androidUrl}" target="_blank" class="btn-link btn-platform"><i class="fab fa-android"></i> Android</a>`;
    if (appData.iosUrl) linksContainer.innerHTML += `<a href="${appData.iosUrl}" target="_blank" class="btn-link btn-platform"><i class="fab fa-apple"></i> iOS</a>`;
    if (appData.windowsUrl) linksContainer.innerHTML += `<a href="${appData.windowsUrl}" target="_blank" class="btn-link btn-platform"><i class="fab fa-windows"></i> Windows</a>`;
    if (appData.fullResourcePageUrl && appData.fullResourcePageUrl.trim() !== "") {
        linksContainer.innerHTML += `<a href="${appData.fullResourcePageUrl}" target="_blank" class="btn-link btn-full-review">Aljohn's Full Review <i class="fas fa-arrow-right"></i></a>`;
    }
}