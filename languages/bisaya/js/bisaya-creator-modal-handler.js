// js/bisaya-creator-modal-handler.js

function initializeCreatorModalHandler() {
    console.log("BISAYA CREATOR MODAL HANDLER (Final Concept - Regions BACK!): Initializing...");

    if (!window.BisayaModalCore) {
        console.error("BISAYA CREATOR MODAL HANDLER: BisayaModalCore is not available. Load order issue?");
        return;
    }

    // --- Cached Modal Elements ---
    const modal = window.BisayaModalCore.getModalElement();
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemName = document.getElementById('modal-item-name');
    const modalItemTags = modal.querySelector('.modal-item-tags'); // Parent for category/region tags
    const modalItemLongDesc = document.getElementById('modal-item-long-desc');
    
    // Video Tab Elements
    const videoEmbedsContainer = document.getElementById('modal-video-embeds-container');
    // Removed: videoEmbedsHeader = document.getElementById('modal-video-embeds-header'); (No longer needed in HTML)
    const videoTabsContainer = modal.querySelector('.video-tabs-container');
    const videoTabsNav = document.getElementById('modal-video-tabs-nav');
    const videoTabsContent = document.getElementById('modal-video-tabs-content');
    const singleVideoFallbackContainer = document.getElementById('modal-video-embed-1'); // Use this for single videos

    // Footer and CTA elements
    const defaultModalItemCta = document.getElementById('modal-item-cta'); // The generic button (will be hidden)
    const creatorSocialActionsContainer = document.getElementById('modal-creator-social-actions'); // For icon buttons


    // --- Helper function to create an iframe ---
    function createVideoIframe(embedData, creatorName) {
        let iframeHTML = '';
        const videoTitle = embedData.title || creatorName || 'Featured Video';
        if (embedData.type === 'youtube' && embedData.url) {
            const videoId = embedData.url.includes('embed/') ? embedData.url.split('embed/')[1].split('?')[0] : embedData.url.split('v=')[1]?.split('&')[0];
            if (videoId) {
                iframeHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${videoId}?rel=0&autoplay=0&modestbranding=1" title="${videoTitle}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
            }
        } else if (embedData.type === 'facebook' && embedData.url) {
            let fbEmbedUrl = embedData.url;
            if (!fbEmbedUrl.includes('plugins/video.php')) {
                const videoIdMatch = fbEmbedUrl.match(/(?:videos|watch|reel)\/(\d+)/);
                if (videoIdMatch && videoIdMatch[1]) {
                     const originalVideoUrl = `https://www.facebook.com/watch/?v=${videoIdMatch[1]}`;
                     fbEmbedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(originalVideoUrl)}&show_text=false&width=560&height=315&autoplay=0`;
                } else {
                    fbEmbedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(fbEmbedUrl)}&show_text=false&width=560&height=315&autoplay=0`;
                }
            }
            iframeHTML = `<iframe src="${fbEmbedUrl}" width="100%" height="100%" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title="${videoTitle}"></iframe>`;
        }
        return iframeHTML;
    }

    // --- Helper function to get category/region icon ---
    // This is defined here to ensure it's available within this module.
    function getTagIcon(tagName) { // Renamed to be more generic for category/region
        const lowerTagName = tagName.toLowerCase();
        const iconMap = {
            'comedy': 'fas fa-laugh-beam', 'food': 'fas fa-utensils', 'foodtrip': 'fas fa-utensils',
            'lifestyle': 'fas fa-camera-retro', 'vlog': 'fas fa-video', 'music': 'fas fa-music',
            'learning': 'fas fa-graduation-cap', 'education': 'fas fa-book-reader',
            'talkshow': 'fas fa-comments', 'interview': 'fas fa-microphone-alt', 'skit': 'fas fa-theater-masks',
            'provincial': 'fas fa-home', 'inspirational': 'fas fa-hands-helping', 'travel': 'fas fa-map-signs',
            'family': 'fas fa-users', 'kids': 'fas fa-child', 'personal': 'fas fa-user-edit',
            'q&a': 'fas fa-question-circle', 'prank': 'fas fa-ghost', 'business': 'fas fa-briefcase',
            'beauty': 'fas fa-spa', 'coffee': 'fas fa-coffee', 'podcast': 'fas fa-headphones-alt',
            'shortvideo': 'fab fa-tiktok', 'couple': 'fas fa-heart', 'motherhood':'fas fa-baby',
            // Region icons (can reuse map marker or add specific if desired)
            'cebu': 'fas fa-map-marker-alt', 'davao': 'fas fa-map-marker-alt', 'bohol': 'fas fa-map-marker-alt',
            'gensan': 'fas fa-map-marker-alt', 'lanao del norte': 'fas fa-map-marker-alt', 'bukidnon': 'fas fa-map-marker-alt',
            'cdo': 'fas fa-map-marker-alt', 'unknown': 'fas fa-map-marker-alt', 'cebu city': 'fas fa-map-marker-alt', 'digos': 'fas fa-map-marker-alt', 'usa': 'fas fa-map-marker-alt'
        };
        return iconMap[lowerTagName] || 'fas fa-tag';
    }


    // --- Main Creator Modal Population Function ---
    function populateCreatorModal(creator) {
        if (!creator) {
            console.warn("BISAYA CREATOR MODAL HANDLER: No creator data provided. Clearing modal.");
            window.BisayaModalCore.clear();
            return;
        }

        window.BisayaModalCore.clear(); // Start with a clean slate from core
        window.BisayaModalCore.applyTheme('creator-modal-theme'); // Apply creator-specific dark theme

        // 1. Populate Header: Image, Name, Category Tags, AND Region Tags
        if (modalItemImage) {
            modalItemImage.src = creator.profilePic || "images/creators/default_creator.png";
            modalItemImage.alt = creator.altText || creator.name || "Creator Profile Picture";
        }
        if (modalItemName) modalItemName.textContent = creator.name || "Creator Name";
        
        if (modalItemTags) { // This div holds all the tags
            let allTagsHTML = '';
            
            // --- CATEGORY TAGS ---
            if (creator.categoryTags && Array.isArray(creator.categoryTags) && creator.categoryTags.length > 0) {
                allTagsHTML += creator.categoryTags.map(tag => {
                    const iconClass = getTagIcon(tag); // Use generic tag icon helper
                    const tagName = typeof tag === 'string' ? tag : 'Unknown'; 
                    return `<span class="tag-eyebrow category-eyebrow" data-category-value="${tagName.toLowerCase()}"><i class="${iconClass}"></i> ${tagName.charAt(0).toUpperCase() + tagName.slice(1)}</span>`;
                }).join('');
            }

            // --- REGION TAGS (UPDATED: Include them here) ---
            // Ensure regionTag is an array for consistent mapping
            const creatorRegionTags = Array.isArray(creator.regionTag) 
                                      ? creator.regionTag 
                                      : (typeof creator.regionTag === 'string' ? [creator.regionTag] : []);
            
            if (creatorRegionTags.length > 0) {
                 allTagsHTML += creatorRegionTags.map(regionName => {
                    const iconClass = getTagIcon(regionName); // Use generic tag icon helper
                    return `<span class="tag-eyebrow region-eyebrow"><i class="${iconClass}"></i> ${regionName}</span>`;
                 }).join('');
            }

            if (allTagsHTML) {
                modalItemTags.innerHTML = allTagsHTML;
                modalItemTags.style.display = 'flex'; // Show the tags container if any tags exist
            } else {
                modalItemTags.innerHTML = '';
                modalItemTags.style.display = 'none'; // Hide if no tags
            }
        }

        // 2. Populate Long Description
        if (modalItemLongDesc) {
            modalItemLongDesc.innerHTML = creator.longDesc ? `<p>${creator.longDesc.replace(/\n/g, '</p><p>')}</p>` : "<p>Wala pay dugang detalye para aning creator.</p>";
        }

        // 3. Populate Video Embeds (with Tabs if multiple, or single fallback)
        if (videoEmbedsContainer && creator.videoEmbeds && creator.videoEmbeds.length > 0) {
            videoEmbedsContainer.style.display = 'block'; // Show the main video container
            
            // Clear previous tabs/content
            if (videoTabsNav) videoTabsNav.innerHTML = '';
            if (videoTabsContent) videoTabsContent.innerHTML = '';
            if (singleVideoFallbackContainer) singleVideoFallbackContainer.innerHTML = '';


            if (creator.videoEmbeds.length === 1 && singleVideoFallbackContainer) {
                // Single video: Use the fallback container, hide tabs
                if(videoTabsContainer) videoTabsContainer.style.display = 'none';
                singleVideoFallbackContainer.innerHTML = createVideoIframe(creator.videoEmbeds[0], creator.name);
                singleVideoFallbackContainer.style.display = 'block'; // Show single video slot
            } else if (creator.videoEmbeds.length > 1 && videoTabsContainer && videoTabsNav && videoTabsContent) {
                // Multiple videos: Use tabs, hide single video slot
                if(singleVideoFallbackContainer) singleVideoFallbackContainer.style.display = 'none';
                videoTabsContainer.style.display = 'block'; // Show tabs container

                creator.videoEmbeds.forEach((embed, index) => {
                    const tabId = `video-pane-${creator.id}-${index + 1}`;
                    
                    // Create Tab Button
                    const tabButton = document.createElement('button');
                    tabButton.className = 'video-tab-button';
                    tabButton.dataset.tabTarget = `#${tabId}`;
                    tabButton.textContent = embed.title || `Video ${index + 1}`;
                    if (index === 0) tabButton.classList.add('active'); // Activate first tab
                    videoTabsNav.appendChild(tabButton);

                    // Create Tab Pane
                    const tabPane = document.createElement('div');
                    tabPane.className = 'video-tab-pane modal-video-wrapper'; // Add .modal-video-wrapper for aspect ratio
                    tabPane.id = tabId;
                    if (index === 0) tabPane.classList.add('active'); // Activate first pane
                    tabPane.innerHTML = createVideoIframe(embed, creator.name);
                    videoTabsContent.appendChild(tabPane);
                });

                // Add event listeners for tab switching (use event delegation on nav container)
                // Remove existing listener to avoid duplicates if modal is opened multiple times
                const oldListener = videoTabsNav._creatorTabListener; // Store ref to old listener
                if (oldListener) {
                    videoTabsNav.removeEventListener('click', oldListener);
                }
                const newListener = (e) => {
                    if (e.target.classList.contains('video-tab-button')) {
                        // Pause currently playing videos before switching tab (best practice)
                        videoTabsContent.querySelectorAll('iframe').forEach(iframe => {
                            const src = iframe.src;
                            iframe.src = src; // Reloads the iframe, stopping playback
                            // For YouTube specifically: iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                        });

                        // Deactivate all
                        videoTabsNav.querySelectorAll('.video-tab-button').forEach(btn => btn.classList.remove('active'));
                        videoTabsContent.querySelectorAll('.video-tab-pane').forEach(pane => pane.classList.remove('active'));
                        
                        // Activate clicked tab and its corresponding pane
                        e.target.classList.add('active');
                        const targetPane = videoTabsContent.querySelector(e.target.dataset.tabTarget);
                        if (targetPane) targetPane.classList.add('active');
                    }
                };
                videoTabsNav.addEventListener('click', newListener);
                videoTabsNav._creatorTabListener = newListener; // Store ref for later removal
            }
        } else { // No videos available for this creator
            if (videoEmbedsContainer) videoEmbedsContainer.style.display = 'none';
        }

        // 4. Populate Footer CTAs (Icon-only social links)
        if (defaultModalItemCta) defaultModalItemCta.style.display = 'none'; // Hide the generic "Visit Item" button

        if (creatorSocialActionsContainer && creator.socialLinks) {
            creatorSocialActionsContainer.innerHTML = ''; // Clear previous icon buttons
            let hasLinks = false;
            const platformIconMap = {
                youtube: 'fab fa-youtube', facebook: 'fab fa-facebook', tiktok: 'fab fa-tiktok',
                instagram: 'fab fa-instagram', kofi: 'fas fa-mug-hot', website: 'fas fa-link',
                linktree: 'fas fa-stream', quizlet: 'fas fa-graduation-cap', twitter: 'fab fa-twitter',
                // Add more mappings as needed for other platforms in your data
            };
            // No platformColors needed as buttons are unstyled by default, color from CSS theme

            for (const platformKey in creator.socialLinks) {
                // Only create button if link exists AND we have a corresponding icon
                if (creator.socialLinks[platformKey] && platformIconMap[platformKey.toLowerCase().replace('_channel', '').replace('_playlist', '')]) {
                    hasLinks = true;
                    const platformName = platformKey.toLowerCase().replace('_channel', '').replace('_playlist', ''); // Normalize key for icon map
                    const iconClass = platformIconMap[platformName]; // Get icon class
                    
                    const socialButton = document.createElement('a');
                    socialButton.href = creator.socialLinks[platformKey];
                    socialButton.target = '_blank';
                    socialButton.className = `btn-social-icon-cta ${platformName}`; // Use platform name as class for specific styling
                    socialButton.setAttribute('aria-label', `Bisitaha ang ${creator.name} sa ${platformKey.charAt(0).toUpperCase() + platformKey.slice(1)}`);
                    socialButton.title = `${platformKey.charAt(0).toUpperCase() + platformKey.slice(1)}`; // Tooltip on hover
                    socialButton.innerHTML = `<i class="${iconClass}"></i>`;
                    creatorSocialActionsContainer.appendChild(socialButton);
                }
            }
            if (hasLinks) {
                creatorSocialActionsContainer.style.display = 'flex'; // Show container if links exist
            } else {
                creatorSocialActionsContainer.style.display = 'none'; // Hide if no valid links
            }
        }

        window.BisayaModalCore.open(); // Open the populated modal
    }

    // Expose the populate function to the global scope
    window.BisayaCreatorModal = {
        populateAndShow: populateCreatorModal
    };
}

// Initialize when script loads (ensure it's called after bisaya-modal-core.js)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCreatorModalHandler);
} else {
    initializeCreatorModalHandler();
}