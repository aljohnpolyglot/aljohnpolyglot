// js/bisaya-modals.js
function initializeBisayaModals() {
    const modal = document.getElementById('bisaya-item-modal');
    if (!modal) {
        console.error("Modal element #bisaya-item-modal not found!");
        return;
    }
    const closeModalBtn = modal.querySelector('.close-modal-bisaya');
    if (!closeModalBtn) {
        console.error("Close button .close-modal-bisaya not found in modal!");
        return;
    }

    // Cache modal elements for repeated use
    const modalItemImage = document.getElementById('modal-item-image');
    const modalItemNameContainer = modal.querySelector('.modal-item-info-header'); // For name and tags
    const modalItemLongDesc = document.getElementById('modal-item-long-desc');
    const modalItemCta = document.getElementById('modal-item-cta');
    const videoEmbedsContainer = document.getElementById('modal-video-embeds-container');
    const embed1Div = document.getElementById('modal-video-embed-1');
    const embed2Div = document.getElementById('modal-video-embed-2');

    document.body.addEventListener('click', (event) => {
        const trigger = event.target.closest('.btn-modal-trigger, .content-card-bisaya');
        if (trigger) {
            const modalTargetId = trigger.dataset.modalTarget;
            if (!modalTargetId) return;

            const itemId = modalTargetId.replace('modal-', '');
            let itemData;

            // Check bisayaCreators first
            if (typeof bisayaCreators !== 'undefined' && Array.isArray(bisayaCreators)) {
                itemData = bisayaCreators.find(c => c.id === itemId);
                if (itemData) {
                    populateCreatorModal(itemData);
                    modal.style.display = 'flex';
                    return; // Exit after populating
                }
            }

            // Then check bisayaKDramas
            if (typeof bisayaKDramas !== 'undefined' && Array.isArray(bisayaKDramas)) {
                itemData = bisayaKDramas.find(s => s.id === itemId);
                if (itemData) {
                    populateShowPodcastModal(itemData, 'show');
                    modal.style.display = 'flex';
                    return; // Exit
                }
            }

            // Finally, check bisayaPodcasts
            if (typeof bisayaPodcasts !== 'undefined' && Array.isArray(bisayaPodcasts)) {
                itemData = bisayaPodcasts.find(p => p.id === itemId);
                if (itemData) {
                    populateShowPodcastModal(itemData, 'podcast');
                    modal.style.display = 'flex';
                    return; // Exit
                }
            }
        }
    });

    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        clearModalContent();
    });

    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
            clearModalContent();
        }
    });

    function clearModalContent() {
        if(modalItemImage) modalItemImage.src = "images/placeholder_modal_image.png"; // Placeholder
        if(modalItemImage) modalItemImage.alt = "Loading";
        if(modalItemNameContainer) modalItemNameContainer.innerHTML = '<h3 id="modal-item-name">Loading...</h3>'; // Reset header
        if(modalItemLongDesc) modalItemLongDesc.innerHTML = "";
        if(modalItemCta) {
            modalItemCta.href = "#";
            modalItemCta.innerHTML = "Visit <i class='fas fa-external-link-alt'></i>";
            modalItemCta.style.display = 'none'; // Hide by default, show if needed
        }

        if(videoEmbedsContainer) videoEmbedsContainer.style.display = 'none';
        if(embed1Div) embed1Div.innerHTML = '';
        if(embed2Div) embed2Div.innerHTML = '';

        // Remove any dynamically added social links container inside modal-body
        const existingSocialLinks = modal.querySelector('.modal-body-bisaya .modal-social-links');
        if (existingSocialLinks) existingSocialLinks.remove();
    }

    function populateCreatorModal(creator) {
        clearModalContent(); // Ensure modal is clean before populating

        if(modalItemImage) {
            modalItemImage.src = creator.profilePic || "images/creators/default_creator.png";
            modalItemImage.alt = creator.altText || creator.name;
        }

        if (modalItemNameContainer) {
            let categoryIcons = '';
            if (creator.categoryTags) { // Check if categoryTags exists
                if (creator.categoryTags.includes('comedy')) categoryIcons += '<i class="fas fa-laugh-beam" title="Comedy"></i> ';
                if (creator.categoryTags.includes('food')) categoryIcons += '<i class="fas fa-utensils" title="Food"></i> ';
                if (creator.categoryTags.includes('lifestyle')) categoryIcons += '<i class="fas fa-camera-retro" title="Lifestyle"></i> ';
                if (creator.categoryTags.includes('talkshow')) categoryIcons += '<i class="fas fa-comments" title="Talk Show"></i> ';
                if (creator.categoryTags.includes('learning')) categoryIcons += '<i class="fas fa-graduation-cap" title="Learning"></i> ';
                if (creator.categoryTags.includes('music')) categoryIcons += '<i class="fas fa-music" title="Music"></i> ';
                // Add more icon mappings as needed
            }

            modalItemNameContainer.innerHTML = `
                <h3 id="modal-item-name">${creator.name}</h3>
                <div class="modal-item-tags">
                    ${creator.categoryTags ? `<span class="tag-eyebrow category-eyebrow">${categoryIcons} ${creator.categoryTags.join(', ')}</span>` : ''}
                    ${creator.regionTag ? `<span class="tag-eyebrow region-eyebrow"><i class="fas fa-map-marker-alt"></i> ${creator.regionTag}</span>` : ''}
                </div>
            `;
        }
        
        if(modalItemLongDesc) modalItemLongDesc.innerHTML = creator.longDesc || "No description available.";

        if (videoEmbedsContainer && embed1Div && embed2Div) {
            embed1Div.innerHTML = ''; // Clear previous
            embed2Div.innerHTML = ''; // Clear previous
            if (creator.videoEmbeds && creator.videoEmbeds.length > 0) {
                videoEmbedsContainer.style.display = 'block';
                creator.videoEmbeds.forEach((embed, index) => {
                    let iframeHTML = '';
                    const videoTitle = embed.title || creator.name;
                    if (embed.type === 'youtube' && embed.url) {
                        const videoId = embed.url.includes('embed/') ? embed.url.split('embed/')[1].split('?')[0] : embed.url.split('v=')[1]?.split('&')[0];
                        if (videoId) {
                            iframeHTML = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" title="${videoTitle}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
                        }
                    } else if (embed.type === 'facebook' && embed.url && embed.url.includes('facebook.com')) {
                        let fbEmbedUrl = embed.url;
                        // Check if it's already an embed URL
                        if (!fbEmbedUrl.includes('plugins/video.php')) {
                            // Try to construct embed URL from a watch or reels link
                            const videoIdMatch = fbEmbedUrl.match(/(?:videos|watch|reel)\/(\d+)/);
                            if (videoIdMatch && videoIdMatch[1]) {
                                 const originalVideoUrl = `https://www.facebook.com/watch/?v=${videoIdMatch[1]}`; // Or construct based on creator's page + video id
                                 fbEmbedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(originalVideoUrl)}&show_text=false&width=560&height=315`; // Height added for consistency
                            } else {
                                // Fallback if it's a different type of FB video link
                                fbEmbedUrl = `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(fbEmbedUrl)}&show_text=false&width=560&height=315`;
                            }
                        }
                        iframeHTML = `<iframe src="${fbEmbedUrl}" width="100%" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" title="${videoTitle}"></iframe>`;
                    }

                    if (iframeHTML) {
                        if (index === 0) embed1Div.innerHTML = iframeHTML;
                        if (index === 1) embed2Div.innerHTML = iframeHTML;
                    }
                });
            } else {
                videoEmbedsContainer.style.display = 'none';
            }
        }
        
        // Handle Social Links for Creators
        const modalBody = modal.querySelector('.modal-body-bisaya');
        if (modalBody && creator.socialLinks) {
            let socialLinksHTML = '<div class="modal-social-links">';
            for (const platform in creator.socialLinks) {
                if (creator.socialLinks[platform]) {
                    let iconClass = `fab fa-${platform}`;
                    if (platform === 'kofi') iconClass = 'fas fa-mug-hot';
                    else if (platform === 'website' || platform === 'linktree' || platform === 'quizlet') iconClass = 'fas fa-link';
                    // Add more custom icons if needed
                    
                    socialLinksHTML += `<a href="${creator.socialLinks[platform]}" target="_blank" class="btn-social ${platform}"><i class="${iconClass}"></i> ${platform.charAt(0).toUpperCase() + platform.slice(1)}</a>`;
                }
            }
            socialLinksHTML += '</div>';
            modalBody.insertAdjacentHTML('beforeend', socialLinksHTML);
        }

        // Main CTA for creator (might be redundant if social links are comprehensive)
        if (modalItemCta) {
            const primaryPlatform = creator.platformTags && creator.platformTags.length > 0 ? creator.platformTags[0] : 'Profile';
            const primaryLink = creator.socialLinks?.[primaryPlatform.toLowerCase()] || creator.socialLinks?.youtube || creator.socialLinks?.facebook || '#';
            modalItemCta.href = primaryLink;
            modalItemCta.innerHTML = `Bisitaha ang ${primaryPlatform} <i class="fas fa-external-link-alt"></i>`;
            modalItemCta.style.display = 'inline-block';
        }
    }

    function populateShowPodcastModal(item, type) { // type can be 'show' or 'podcast'
        clearModalContent();

        if(modalItemImage) {
            modalItemImage.src = item.posterSrc || item.coverSrc || "images/placeholder_modal_image.png";
            modalItemImage.alt = item.altText || item.title;
        }

        if (modalItemNameContainer) {
            let typeIcon = type === 'show' ? '<i class="fas fa-film" title="Show/Series"></i> ' : '<i class="fas fa-headphones-alt" title="Podcast"></i> ';
            modalItemNameContainer.innerHTML = `
                <h3 id="modal-item-name">${item.title}</h3>
                <div class="modal-item-tags">
                    <span class="tag-eyebrow category-eyebrow">${typeIcon} ${type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    ${item.platformName ? `<span class="tag-eyebrow platform-eyebrow"><i class="fas fa-tv"></i> ${item.platformName}</span>` : ''}
                </div>
            `;
        }

        if(modalItemLongDesc) modalItemLongDesc.innerHTML = item.longSynopsis || item.longDesc || "No detailed description available.";
        if(videoEmbedsContainer) videoEmbedsContainer.style.display = 'none'; // Typically no direct video embeds for shows/podcasts in this list

        const modalBody = modal.querySelector('.modal-body-bisaya'); // For podcast links

        if (type === 'show' && item.platformLink && modalItemCta) {
            modalItemCta.href = item.platformLink;
            modalItemCta.innerHTML = `Tan-awa sa ${item.platformName || 'Platform'} <i class="fas fa-external-link-alt"></i>`;
            modalItemCta.style.display = 'inline-block';
        } else if (type === 'podcast' && item.platformLinks && modalBody) {
            if (modalItemCta) modalItemCta.style.display = 'none'; // Hide single CTA if multiple podcast links
            
            let podcastLinksHTML = '<div class="modal-social-links"><h4>Paminawa Sa:</h4>'; // Reuse .modal-social-links for styling
            let hasLinks = false;
            for (const platform in item.platformLinks) {
                if (item.platformLinks[platform]) {
                    hasLinks = true;
                    let iconClass = `fab fa-${platform}`;
                    if (platform === 'apple') iconClass = 'fab fa-apple';
                    else if (platform === 'website') iconClass = 'fas fa-link';
                    // Add more specific icons as needed
                    podcastLinksHTML += `<a href="${item.platformLinks[platform]}" target="_blank" class="btn-social ${platform}"><i class="${iconClass}"></i> ${platform.charAt(0).toUpperCase() + platform.slice(1)}</a>`;
                }
            }
            podcastLinksHTML += '</div>';
            if (hasLinks) {
                modalBody.insertAdjacentHTML('beforeend', podcastLinksHTML);
            }
        } else if (modalItemCta) {
            modalItemCta.style.display = 'none'; // Hide CTA if no specific link
        }
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeBisayaModals);
} else {
    initializeBisayaModals(); // Or trigger from bisaya-page-loader.js after content is rendered
}