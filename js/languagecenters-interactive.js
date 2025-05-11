// D:\website\js\languagecenters-interactive.js
document.addEventListener('DOMContentLoaded', function() {
    const languageFilterContainer = document.getElementById('languageFilter');
    const institutesListContainer = document.getElementById('institutesList');
    const initialPromptText = document.getElementById('initialPromptText');
    const institutesListHeader = document.getElementById('institutesListHeader');
    const selectedLanguageTitleElement = document.getElementById('selectedLanguageTitle');
    const dynamicLanguageNameSpan = document.getElementById('dynamicLanguageName');
    const languageTitleFlagImg = selectedLanguageTitleElement.querySelector('.language-title-flag');
    const backToMainWrapper = document.getElementById('backToMainWrapper');

    const mainBody = document.querySelector('body.lc-interactive-page');

    const modal = document.getElementById('instituteDetailModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const backToInstitutesListBtn = document.getElementById('backToInstitutesList');

    const modalFlag = document.getElementById('modalFlag');
    const modalLogo = document.getElementById('modalLogo');
    const modalInstituteName = document.getElementById('modalInstituteName');
    const modalPartnershipInfo = document.getElementById('modalPartnershipInfo');
    const modalWebsiteLink = document.getElementById('modalWebsiteLink');
    const modalSocialLinks = document.getElementById('modalSocialLinks');
    const modalDescription = document.getElementById('modalDescription');
    const modalMyExperience = document.getElementById('modalMyExperience');
    const modalKeyOfferings = document.getElementById('modalKeyOfferings');
    const modalContact = document.getElementById('modalContact');
    const modalAddresses = document.getElementById('modalAddresses');
    const modalMapEmbed = document.getElementById('modalMapEmbed');
    const modalFeaturedVideo = document.getElementById('modalFeaturedVideo');
    const modalPhotoGallery = document.getElementById('modalPhotoGallery');
    const modalCommunityPost = document.getElementById('modalCommunityPost');
    const modalTabs = document.querySelectorAll('.lc-modal-tabs .lc-tab-button');
    const modalTabContents = document.querySelectorAll('.lc-modal-main .lc-tab-content');

    let currentLanguageKey = null;
    let currentSlideshowIndex = 0;
    let currentPhotos = [];
    let currentPhotoCaptions = [];

    function getTextColorOnBackground(hexOrVarBgColor) {
        const defaultLightText = 'var(--light-text-global, #ffffff)';
        const defaultDarkText = 'var(--dark-text-global, #2c3e50)';
        let bgColorToTest = hexOrVarBgColor;
        if (!bgColorToTest || typeof bgColorToTest !== 'string') return defaultDarkText;
        if (bgColorToTest.startsWith('var(')) {
            try {
                const varNameMatch = bgColorToTest.match(/--[a-zA-Z0-9-]+/);
                if (varNameMatch && varNameMatch[0]) {
                    bgColorToTest = getComputedStyle(document.documentElement).getPropertyValue(varNameMatch[0]).trim();
                } else { return defaultDarkText; }
            } catch (e) { return defaultDarkText; }
        }
        let color = (bgColorToTest.charAt(0) === '#') ? bgColorToTest.substring(1) : bgColorToTest;
        if (color.length === 3) color = color.split('').map(char => char + char).join('');
        if (color.length !== 6) return defaultDarkText;
        try {
            const r = parseInt(color.substring(0, 2), 16);
            const g = parseInt(color.substring(2, 4), 16);
            const b = parseInt(color.substring(4, 6), 16);
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return (yiq >= 128) ? defaultDarkText : defaultLightText;
        } catch (e) { return defaultDarkText; }
    }

    function populateLanguageFilters() {
        if (!languageFilterContainer || typeof languageFilters === 'undefined' || !Array.isArray(languageFilters)) {
            console.error("Language filter container or languageFilters data is missing.");
            if (languageFilterContainer) languageFilterContainer.innerHTML = '<p class="error-text">Language filters unavailable.</p>';
            return;
        }
        languageFilterContainer.innerHTML = '';
        languageFilters.forEach(lang => {
            if (!lang || !lang.key || !lang.name || !lang.flag) return;
            const button = document.createElement('button');
            button.classList.add('lang-filter-button');
            button.dataset.langKey = lang.key;
            button.innerHTML = `
                <img src="${lang.flag}" alt="${lang.name} Flag" class="lang-flag-filter">
                <span>${lang.name}</span>
            `;
            button.addEventListener('click', () => {
                window.location.hash = lang.key;
            });
            languageFilterContainer.appendChild(button);
        });
    }

    function highlightActiveLanguageFilter(langKey) {
        const allFilters = languageFilterContainer.querySelectorAll('.lang-filter-button');
        allFilters.forEach(btn => {
            const btnLangKey = btn.dataset.langKey;
            if (btnLangKey === langKey) {
                btn.classList.add('active-filter');
                const langData = languageFilters.find(f => f.key === btnLangKey);
                const activeBg = (langData && langData.brandPalette && langData.brandPalette.activeFilterBg) ? langData.brandPalette.activeFilterBg : 'var(--lc-highlight-yellow)';
                const activeBorder = (langData && langData.brandPalette && langData.brandPalette.activeFilterBorder) ? langData.brandPalette.activeFilterBorder : activeBg;
                const activeText = (langData && langData.brandPalette && langData.brandPalette.activeFilterText) ? langData.brandPalette.activeFilterText : getTextColorOnBackground(activeBg);
                
                btn.style.backgroundColor = activeBg;
                btn.style.borderColor = activeBorder;
                btn.style.color = activeText;
            } else {
                btn.classList.remove('active-filter');
                btn.style.backgroundColor = '';
                btn.style.borderColor = '';
                btn.style.color = '';
            }
        });
    }

    function displayInstitutesForLanguage(langKey, langName) {
        currentLanguageKey = langKey;
        highlightActiveLanguageFilter(langKey);

        if (!institutesListContainer || typeof culturalInstitutesData === 'undefined' || !dynamicLanguageNameSpan || !languageTitleFlagImg || !institutesListHeader || !initialPromptText || !backToMainWrapper) {
            return;
        }
        institutesListContainer.innerHTML = '';

        const selectedLangFilterData = languageFilters.find(lang => lang.key === langKey);
        const flagUrl = selectedLangFilterData ? selectedLangFilterData.flag : '';

        if (flagUrl) {
            languageTitleFlagImg.src = flagUrl;
            languageTitleFlagImg.alt = `${langName} Flag`;
            languageTitleFlagImg.style.display = 'inline-block';
        } else {
            languageTitleFlagImg.style.display = 'none';
        }
        dynamicLanguageNameSpan.textContent = langName;
        institutesListHeader.style.display = 'flex';
        initialPromptText.style.display = 'none';

        const relevantInstitutes = culturalInstitutesData.filter(inst => {
            if (!inst || !inst.languageKey) return false;
            return Array.isArray(inst.languageKey) ? inst.languageKey.includes(langKey) : inst.languageKey === langKey;
        });

        relevantInstitutes.sort((a, b) => {
            if (langKey === 'italian') {
                if (a.id === 'pia' && b.id === 'dante-manila') return -1;
                if (a.id === 'dante-manila' && b.id === 'pia') return 1;
            }
            return (a.name || '').localeCompare(b.name || '');
        });

        if (relevantInstitutes.length === 0) {
            institutesListContainer.innerHTML = `<p class="no-institutes-found">No specific institutes currently listed for ${langName}. We're always updating, please check back soon!</p>`;
        } else {
            relevantInstitutes.forEach(institute => {
                institutesListContainer.appendChild(createSimpleInstitutePreview(institute));
            });
        }
        
        backToMainWrapper.style.display = 'block';
    }
    
    function createBriefDescription(fullDescription, maxLength = 120) { // INCREASED maxLength
        if (!fullDescription || typeof fullDescription !== 'string') return "Details available.";
        if (fullDescription.length <= maxLength) return fullDescription;
        let trimmed = fullDescription.substring(0, maxLength);
        // Try to cut at the last space within a reasonable distance from maxLength
        const lastSpace = trimmed.lastIndexOf(" ", maxLength - 10); // Look for space within last 10 chars
        if (lastSpace > 0 && (maxLength - lastSpace) < 20) { // If found space is close to end
             trimmed = trimmed.substring(0, lastSpace);
        } else { // If no good space, just cut at maxLength (might cut word)
            trimmed = fullDescription.substring(0, maxLength - 3); // leave space for "..."
        }
        return trimmed + "...";
    }

    function createSimpleInstitutePreview(institute) {
        const card = document.createElement('div');
        card.classList.add('institute-preview-interactive');
        card.dataset.instituteid = institute.id;

        const palette = institute.brandPalette || {};
        const cardBg = palette.cardBackground || 'var(--lc-panel-bg)';
        const mainTextCol = palette.cardText || getTextColorOnBackground(cardBg);
        const btnAccentBg = palette.buttonAccent || 'var(--lc-highlight-yellow)';
        const btnTextColOnAccent = palette.buttonText || getTextColorOnBackground(btnAccentBg);
        
        card.style.backgroundColor = cardBg;
        card.style.color = mainTextCol;
        card.style.borderColor = palette.cardBorderColor || (mainTextCol === getTextColorOnBackground(cardBg) && mainTextCol.includes('2c3e50') ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)');

        const logoBg = cardBg === 'var(--lc-panel-bg)' || !mainTextCol.includes('2c3e50') ? 'rgba(255,255,255,0.9)' : 'transparent';

        const descriptionToUse = institute.previewDescription || institute.description;
        const displayDescription = createBriefDescription(descriptionToUse);

        card.innerHTML = `
            <img src="${institute.logo || 'images/placeholder-logo.png'}" alt="${institute.name} Logo" class="preview-logo" style="background-color: ${logoBg};">
            <div class="preview-info-wrapper">
                <div class="institute-name-line">
                    ${institute.flag ? `<img src="${institute.flag}" alt="${institute.name} Flag" class="institute-preview-flag">` : ''}
                    <h5 style="color: ${mainTextCol};">${institute.name || 'Institute Name'}</h5>
                </div>
                <p class="preview-description-text" style="color: ${palette.cardTextSecondary || mainTextCol}; opacity: 0.85;">
                    ${displayDescription}
                </p>
            </div>
            <button class="btn btn-small view-details-btn-preview" data-instituteid="${institute.id}">View Details</button> 
        `;
        // IMPORTANT: Added data-instituteid to the button itself as well, for easier event delegation.
        
        const viewDetailsBtn = card.querySelector('.view-details-btn-preview');
        if (viewDetailsBtn) {
            viewDetailsBtn.style.backgroundColor = btnAccentBg;
            viewDetailsBtn.style.color = btnTextColOnAccent;
            viewDetailsBtn.style.borderColor = btnAccentBg;
        }
        return card;
    }

    function openInstituteModal(instituteId) {
        const institute = culturalInstitutesData.find(inst => inst.id === instituteId);
        if (!institute) {
            console.error("MODAL ERROR: Institute data not found for ID:", instituteId);
            return;
        }

        const palette = institute.brandPalette || {};
        modalFlag.src = institute.flag || 'images/placeholder-flag.png';
        modalLogo.src = institute.logo || 'images/placeholder-logo.png';
        modalInstituteName.textContent = institute.name || 'Institute Details';
        modalPartnershipInfo.innerHTML = institute.partnershipDescription ? `<p>${institute.partnershipDescription}</p>` : '';

        if (institute.website) {
            modalWebsiteLink.href = institute.website;
            modalWebsiteLink.style.display = 'block';
            const websiteBtnBg = palette.buttonAccent || 'var(--primary-blue)';
            const websiteBtnText = palette.buttonText || getTextColorOnBackground(websiteBtnBg);
            modalWebsiteLink.style.backgroundColor = websiteBtnBg;
            modalWebsiteLink.style.color = websiteBtnText;
            modalWebsiteLink.style.borderColor = websiteBtnBg;

            // Simplified hover - CSS can handle darkening or palette can define specific hover
            // const websiteBtnHoverBg = palette.buttonAccentHover || (palette.buttonAccent ? chroma(palette.buttonAccent).darken(0.1).hex() : chroma(websiteBtnBg).darken(0.1).hex());
            // modalWebsiteLink.onmouseover = () => { modalWebsiteLink.style.backgroundColor = websiteBtnHoverBg; };
            // modalWebsiteLink.onmouseout = () => { modalWebsiteLink.style.backgroundColor = websiteBtnBg; };
        } else {
            modalWebsiteLink.style.display = 'none';
        }

        const modalSocialIconBaseColor = palette.socialIconColor || '#8899a6';
        const modalSocialIconHover = palette.socialIconHoverColor || palette.buttonAccent || 'var(--primary-blue)';
        modalSocialLinks.innerHTML = '';
        if (institute.facebook) {
            const fbLink = document.createElement('a');
            fbLink.href = institute.facebook; fbLink.target = "_blank"; fbLink.title = "Facebook";
            fbLink.innerHTML = '<i class="fab fa-facebook-square"></i>';
            fbLink.style.color = modalSocialIconBaseColor;
            fbLink.onmouseover = () => fbLink.style.color = modalSocialIconHover;
            fbLink.onmouseout = () => fbLink.style.color = modalSocialIconBaseColor;
            modalSocialLinks.appendChild(fbLink);
        }
        if (institute.instagram) {
            const igLink = document.createElement('a');
            igLink.href = institute.instagram; igLink.target = "_blank"; igLink.title = "Instagram";
            igLink.innerHTML = '<i class="fab fa-instagram-square"></i>';
            igLink.style.color = modalSocialIconBaseColor;
            igLink.onmouseover = () => igLink.style.color = modalSocialIconHover;
            igLink.onmouseout = () => igLink.style.color = modalSocialIconBaseColor;
            modalSocialLinks.appendChild(igLink);
        }

        modalDescription.innerHTML = institute.description ? institute.description.replace(/\n/g, '<br>') : 'Detailed description coming soon.';
        modalMyExperience.innerHTML = institute.myExperience ? institute.myExperience.replace(/\n/g, '<br>') : 'Personal experiences will be shared soon!';
        modalKeyOfferings.innerHTML = institute.keyOfferings && institute.keyOfferings.length > 0 ? institute.keyOfferings.map(o => `<li>${o}</li>`).join('') : '<li>Details on their official site.</li>';
        modalContact.innerHTML = institute.contact ? `<strong>Contact:</strong> ${institute.contact}` : '';
        modalAddresses.innerHTML = institute.addresses && institute.addresses.length > 0 ? `<strong>Address(es):</strong><br>${institute.addresses.join('<br>')}` : '';
        modalMapEmbed.innerHTML = institute.mapEmbed || '<p class="no-data-placeholder">Map coming soon.</p>';
        modalFeaturedVideo.innerHTML = institute.featuredVideo ? `<div class="video-wrapper-modal"><iframe src="${institute.featuredVideo}" title="Featured Video: ${institute.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>` : (institute.videoPlaceholderText || '<p class="no-data-placeholder">No video.</p>');
        modalCommunityPost.innerHTML = institute.communityPost && institute.communityPost.text ? `<div class="post-snippet-modal"><p>${institute.communityPost.text.replace(/\n/g, '<br>')}</p>${institute.communityPost.link ? `<a href="${institute.communityPost.link}" target="_blank">View Original Post <i class="fas fa-external-link-alt fa-xs"></i></a>` : ''}</div>` : '<p class="no-data-placeholder">No community buzz.</p>';

        currentPhotos = institute.photoGallery || [];
        currentPhotoCaptions = institute.photoCaptions || [];
        currentSlideshowIndex = 0;
        setupPhotoGallerySlideshow();

        showTab('overview');
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    function setupPhotoGallerySlideshow() {
        if (!modalPhotoGallery) return;
        modalPhotoGallery.innerHTML = '';
        if (currentPhotos.length === 0) {
            modalPhotoGallery.innerHTML = '<p class="no-photos-modal">Photo gallery coming soon.</p>';
            return;
        }
        modalPhotoGallery.className = 'modal-photo-gallery-slideshow'; 
        const slideshowContainer = document.createElement('div');
        slideshowContainer.classList.add('slideshow-container');
        currentPhotos.forEach((photoSrc, index) => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            const caption = currentPhotoCaptions[index] || '';
            const resolvedPhotoSrc = photoSrc.startsWith('http') || photoSrc.startsWith('images/') ? photoSrc : `images/languagecenters/${photoSrc}`;
            slide.innerHTML = `
                <img src="${resolvedPhotoSrc}" alt="Gallery image ${index + 1}" loading="lazy">
                <p class="slide-caption">${caption}</p>`;
            slideshowContainer.appendChild(slide);
        });
        modalPhotoGallery.appendChild(slideshowContainer);
        if (currentPhotos.length > 1) {
            const controls = document.createElement('div');
            controls.classList.add('slideshow-controls');
            controls.innerHTML = `
                <button class="prev-btn" aria-label="Previous slide"><i class="fas fa-chevron-left"></i></button>
                <button class="next-btn" aria-label="Next slide"><i class="fas fa-chevron-right"></i></button>`;
            modalPhotoGallery.appendChild(controls);
            controls.querySelector('.prev-btn').addEventListener('click', () => showSlide(currentSlideshowIndex - 1));
            controls.querySelector('.next-btn').addEventListener('click', () => showSlide(currentSlideshowIndex + 1));
        }
        updateSlideshowView();
    }

    function showSlide(index) {
        const slideshowContainer = modalPhotoGallery.querySelector('.slideshow-container');
        const slides = modalPhotoGallery.querySelectorAll('.slideshow-container .slide');
        if (!slideshowContainer || !slides || slides.length === 0) return;
        currentSlideshowIndex = (index + slides.length) % slides.length;
        slideshowContainer.style.transform = `translateX(${-currentSlideshowIndex * 100}%)`;
        slides.forEach((slide, idx) => slide.classList.toggle('active-slide', idx === currentSlideshowIndex));
    }
    
    function updateSlideshowView() { if (currentPhotos.length > 0) showSlide(currentSlideshowIndex); }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
        if (currentLanguageKey) {
            highlightActiveLanguageFilter(currentLanguageKey); // Re-highlight active filter
        }
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (backToInstitutesListBtn) backToInstitutesListBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });
    modalTabs.forEach(button => button.addEventListener('click', () => showTab(button.dataset.tab)));

    function showTab(tabId) {
        modalTabs.forEach(btn => btn.classList.remove('active'));
        modalTabContents.forEach(content => content.classList.remove('active'));
        const activeTabButton = document.querySelector(`.lc-modal-tabs .lc-tab-button[data-tab="${tabId}"]`);
        const activeTabContent = document.getElementById(`tab-${tabId}`);
        if (activeTabButton) activeTabButton.classList.add('active');
        if (activeTabContent) activeTabContent.classList.add('active');
    }
    
    function handleHashChange() {
        if (typeof culturalInstitutesData === 'undefined' || typeof languageFilters === 'undefined') {
            setTimeout(handleHashChange, 250);
            return;
        }
        const hash = window.location.hash.substring(1);
        let instituteIdToOpen = null;
        let langKeyToShow = null;

        if (hash.startsWith('institute-')) {
            instituteIdToOpen = hash.replace('institute-', '');
            const targetInstitute = culturalInstitutesData.find(inst => inst.id === instituteIdToOpen);
            if (targetInstitute) {
                langKeyToShow = Array.isArray(targetInstitute.languageKey) ? targetInstitute.languageKey[0] : targetInstitute.languageKey;
            } else {
                langKeyToShow = null;
                instituteIdToOpen = null;
                if (window.location.hash !== '') window.location.hash = ''; // Avoid infinite loop if hash was already empty
            }
        } else if (hash && languageFilters.some(lf => lf.key === hash)) {
            langKeyToShow = hash;
        } else if (hash) { // Invalid hash
            langKeyToShow = null;
            if (window.location.hash !== '') window.location.hash = '';
        }

        if (langKeyToShow) {
            const langFilterData = languageFilters.find(lf => lf.key === langKeyToShow);
            if (langFilterData) {
                displayInstitutesForLanguage(langFilterData.key, langFilterData.name);
                if (instituteIdToOpen) {
                    setTimeout(() => openInstituteModal(instituteIdToOpen), 150); // Allow UI to update
                }
            }
        } else { // No valid language or institute in hash, show default state
            institutesListContainer.innerHTML = '';
            if(institutesListHeader) institutesListHeader.style.display = 'none';
            if(initialPromptText) initialPromptText.style.display = 'block';
            if(backToMainWrapper) backToMainWrapper.style.display = 'none';
            highlightActiveLanguageFilter(null);
            currentLanguageKey = null;
        }
    }

    // CORRECTED Event listener for institute cards
    if (institutesListContainer) {
        institutesListContainer.addEventListener('click', function(event) {
            // Check if the click was on the 'View Details' button OR the card itself
            const viewDetailsButton = event.target.closest('.view-details-btn-preview');
            const instituteCard = event.target.closest('.institute-preview-interactive');

            let instituteId = null;

            if (viewDetailsButton) { // Prioritize button click
                instituteId = viewDetailsButton.dataset.instituteid;
                 // console.log("View Details button clicked, ID:", instituteId); // For debugging
            } else if (instituteCard) { // Fallback to card click if button wasn't the direct target
                instituteId = instituteCard.dataset.instituteid;
                // console.log("Institute card clicked, ID:", instituteId); // For debugging
            }


            if (instituteId) {
                openInstituteModal(instituteId);
            } else {
                // console.log("Click was not on a 'View Details' button or a card with an ID."); // For debugging
            }
        });
    }


    // Initial setup
    if (typeof languageFilters !== 'undefined' && typeof culturalInstitutesData !== 'undefined') {
        populateLanguageFilters();
        handleHashChange(); 
        window.addEventListener('hashchange', handleHashChange);
    } else {
        console.error("Essential data missing for languagecenters-interactive.js.");
        if (languageFilterContainer) languageFilterContainer.innerHTML = '<p class="error-text">Page data failed to load. Refresh.</p>';
        if (initialPromptText) initialPromptText.style.display = 'block';
    }

    // Make sure Chroma.js is loaded if you uncomment its usage for color manipulation
    // Example: const darkColor = chroma(color).darken(0.2).hex();
});