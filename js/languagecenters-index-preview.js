// js/languagecenters-index-preview.js

document.addEventListener('DOMContentLoaded', function() {
    const institutePreviewGrid = document.getElementById('institutePreviewGrid');

    function createBriefPreviewDescription(fullDescription, maxLength = 80) { // Adjusted max length
        if (!fullDescription || typeof fullDescription !== 'string') return "";
        if (fullDescription.length <= maxLength) {
            return fullDescription;
        }
        let trimmed = fullDescription.substring(0, maxLength);
        const lastSpace = trimmed.lastIndexOf(" ");
        if (lastSpace > 0) {
            trimmed = trimmed.substring(0, lastSpace);
        }
        return trimmed + "...";
    }

    function getTextColorOnBackground(hexOrVarBgColor) {
        const defaultLightText = 'var(--light-text, #ffffff)';
        const defaultDarkText = 'var(--dark-text, #2c3e50)';
        let bgColorToTest = hexOrVarBgColor;

        if (!bgColorToTest || typeof bgColorToTest !== 'string') return defaultLightText;
        
        if (bgColorToTest.startsWith('var(')) {
            try {
                const varNameMatch = bgColorToTest.match(/--[a-zA-Z0-9-]+/);
                if (varNameMatch && varNameMatch[0]) {
                    bgColorToTest = getComputedStyle(document.documentElement).getPropertyValue(varNameMatch[0]).trim();
                } else {
                    return defaultLightText; 
                }
            } catch (e) {
                return defaultLightText;
            }
        }
        
        let color = (bgColorToTest.charAt(0) === '#') ? bgColorToTest.substring(1) : bgColorToTest;
        if (color.length === 3) {
            color = color.split('').map(char => char + char).join('');
        }

        if (color.length !== 6) {
            return defaultLightText; 
        }
        
        try {
            const r = parseInt(color.substring(0, 2), 16);
            const g = parseInt(color.substring(2, 4), 16);
            const b = parseInt(color.substring(4, 6), 16);
            const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
            return (yiq >= 128) ? defaultDarkText : defaultLightText;
        } catch (e) {
            return defaultLightText;
        }
    }


    if (institutePreviewGrid && typeof culturalInstitutesData !== 'undefined' && Array.isArray(culturalInstitutesData)) {
        institutePreviewGrid.innerHTML = ''; // Clear "Loading..."

        const sortedInstitutes = [...culturalInstitutesData].sort((a, b) => {
            const order = ["cervantes-manila", "af-manille", "af-cebu", "pia", "dante-manila", "kbri-manila", "goethe-institut"];
            const indexA = order.indexOf(a.id); const indexB = order.indexOf(b.id);
            if (indexA === -1 && indexB === -1) return 0; if (indexA === -1) return 1;
            if (indexB === -1) return -1; return indexA - indexB;
        });

        sortedInstitutes.forEach(institute => {
            if (institute.id === "french-embassy-events") return;

            const card = document.createElement('div');
            card.classList.add('institute-preview-card');
            
            const palette = institute.brandPalette || {};
            const cardBgColor = palette.cardBackground || 'var(--panel-bg, rgba(12, 30, 58, 0.92))';
            const mainTextCol = palette.cardText || getTextColorOnBackground(cardBgColor);
            const btnAccentBg = palette.buttonAccent || 'var(--accent-yellow, #FFD700)';
            const btnTextColOnAccent = palette.buttonText || getTextColorOnBackground(btnAccentBg);
            const outlineBtnCol = palette.buttonAccent || 'var(--accent-yellow, #FFD700)';
            
            // Determine line color: if text is light, use light; if text is dark, use a light grey for the line.
            let lineColor = mainTextCol;
            if (mainTextCol.includes('2c3e50') || mainTextCol === 'var(--dark-text, #2c3e50)') { // If mainTextCol is dark
                lineColor = 'rgba(0, 0, 0, 0.15)'; // A light grey that works on light backgrounds
                if (cardBgColor.startsWith('#') && getTextColorOnBackground(cardBgColor) === 'var(--light-text, #ffffff)') {
                    // Card is dark, but text is somehow set to dark-text var (unlikely but safety)
                    lineColor = 'rgba(255, 255, 255, 0.25)';
                }
            } else { // mainTextCol is light
                 lineColor = 'rgba(255, 255, 255, 0.25)'; // A light line for dark backgrounds
            }
            // Override if brand palette explicitly defines a line/separator color
            if (palette.separatorColor) {
                lineColor = palette.separatorColor;
            }


            const cardHTML = `
                <div class="institute-card-header-content">
                    <img src="${institute.logo || 'images/placeholder-logo.png'}" alt="${institute.name} Logo" class="institute-preview-logo">
                    <div class="institute-name-line">
                        <img src="${institute.flag || 'images/placeholder-flag.png'}" alt="${institute.languageKey || 'Language'} Flag" class="institute-preview-flag">
                        <h3 style="color: ${mainTextCol};">${institute.name || 'Institute Name'}</h3>
                    </div>
                </div>
                <div class="institute-card-hover-description" style="color: ${mainTextCol};">
                    <p>${createBriefPreviewDescription(institute.previewDescription || institute.description)}</p>
                </div>
                <hr class="content-separator" style="border-color: ${lineColor};">
                <div class="institute-card-actions">
                    <div class="action-items-wrapper">
                        <div class="buttons-group">
                            <a href="languagecenters.html#institute-${institute.id}" class="btn btn-primary btn-small">Full Profile</a>
                            ${institute.website ? `<a href="${institute.website}" target="_blank" class="btn btn-outline btn-small">Website</a>` : ''}
                        </div>
                        <div class="social-media-icons">
                            ${institute.facebook ? `<a href="${institute.facebook}" target="_blank" title="Facebook"><i class="fab fa-facebook-f"></i></a>` : ''}
                            ${institute.instagram ? `<a href="${institute.instagram}" target="_blank" title="Instagram"><i class="fab fa-instagram"></i></a>` : ''}
                        </div>
                    </div>
                </div>
            `;

            card.innerHTML = cardHTML;
            card.style.backgroundColor = cardBgColor;

            const fullProfileBtn = card.querySelector('.btn-primary');
            if (fullProfileBtn) {
                fullProfileBtn.style.backgroundColor = btnAccentBg;
                fullProfileBtn.style.color = btnTextColOnAccent;
                fullProfileBtn.style.borderColor = btnAccentBg;
            }

            const websiteBtn = card.querySelector('.btn-outline');
            if (websiteBtn) {
                websiteBtn.style.color = outlineBtnCol;
                websiteBtn.style.borderColor = outlineBtnCol;
                websiteBtn.onmouseover = () => { 
                    websiteBtn.style.backgroundColor = outlineBtnCol;
                    websiteBtn.style.color = btnTextColOnAccent; 
                }
                websiteBtn.onmouseout = () => { 
                    websiteBtn.style.backgroundColor = 'transparent';
                    websiteBtn.style.color = outlineBtnCol; 
                }
            }
            
           // Determine the hover color for social icons
            const socialHoverColor = palette.socialIconHoverColor || outlineBtnCol || btnAccentBg || 'var(--accent-yellow, #FFD700)'; // Fallback chain

            card.querySelectorAll('.social-media-icons a').forEach(link => {
                link.style.color = mainTextCol; // Set initial color based on card's main text color
                link.onmouseover = () => {
                    link.style.color = socialHoverColor;
                };
                link.onmouseout = () => {
                    link.style.color = mainTextCol; // Revert to initial color
                };
            });

            institutePreviewGrid.appendChild(card);
        });
    } else {
        if (institutePreviewGrid) {
            institutePreviewGrid.innerHTML = "<p class='loading-preview-text'>Cultural center information loading or data file is missing/invalid. Ensure 'js/languagecenters-data.js' is correctly loaded first and check browser console for errors.</p>";
        }
        console.error("ERROR: Institute preview grid OR culturalInstitutesData is missing or invalid. Check HTML for ID 'institutePreviewGrid' and ensure js/languagecenters-data.js defines 'culturalInstitutesData' and is loaded BEFORE this script. Also check data file for syntax errors.");
    }

    // --- Global JS (Copyright Year, Main Nav Menu Toggles from js/script.js) ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) { currentYearSpan.textContent = new Date().getFullYear(); }

    const menuToggle = document.querySelector('header .menu-toggle');
    const navLinks = document.querySelector('header .nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    const desktopDropdowns = document.querySelectorAll('header .nav-links > li.dropdown');
    desktopDropdowns.forEach(dropdown => {
        const button = dropdown.querySelector('a.dropbtn');
        if (button) {
            button.setAttribute('aria-haspopup', 'true');
            button.setAttribute('aria-expanded', 'false');
            button.addEventListener('click', function(event) {
                let path = button.getAttribute('href');
                if (path === 'javascript:void(0)' || (path.startsWith('#') && !path.includes('index.html#'))) {
                     event.preventDefault();
                }
                const isCurrentlyOpen = dropdown.classList.contains('open');
                desktopDropdowns.forEach(otherDd => {
                    if (otherDd !== dropdown) {
                        otherDd.classList.remove('open');
                        const otherButton = otherDd.querySelector('a.dropbtn');
                        if (otherButton) otherButton.setAttribute('aria-expanded', 'false');
                    }
                });
                if (isCurrentlyOpen) {
                    dropdown.classList.remove('open');
                    button.setAttribute('aria-expanded', 'false');
                } else {
                    dropdown.classList.add('open');
                    button.setAttribute('aria-expanded', 'true');
                }
                event.stopPropagation();
            });
        }
    });
    document.addEventListener('click', function(event) {
        desktopDropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('open');
                const button = dropdown.querySelector('a.dropbtn');
                if (button) button.setAttribute('aria-expanded', 'false');
            }
        });
    });
});