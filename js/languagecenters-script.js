// js/languagecenters-script.js

document.addEventListener('DOMContentLoaded', function() {
    const listingContainer = document.getElementById('instituteListing');

    function createInstituteCardHTML(institute) {
        // Paths for images in the data object should be relative to the root 'images/' folder
        // or full URLs.
        // If languagecenters.html is in root, no prefix. If in subdir, add '../' to local paths.
        // This example assumes languagecenters.html is in root, so local paths are 'images/...'
        const imagePrefix = ""; // Change to "../" if languagecenters.html is in a subdir

        let photoGalleryHTML = '<p class="no-photos">Photo gallery coming soon!</p>';
        if (institute.photoGallery && institute.photoGallery.length > 0) {
            photoGalleryHTML = institute.photoGallery.map(photoSrc => 
                `<img src="${photoSrc.startsWith('http') ? photoSrc : imagePrefix + photoSrc}" alt="${institute.name} activity or event photo" loading="lazy">`
            ).join('');
        }
        
        let videoHTML = '';
        if (institute.featuredVideo) {
            videoHTML = `<div class="video-wrapper-journey"><iframe src="${institute.featuredVideo}" title="Video feature with ${institute.name}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe></div>`;
        } else if (institute.videoPlaceholderText) {
            videoHTML = `<p class="video-placeholder-text-journey">${institute.videoPlaceholderText}</p>`;
        }

        let communityPostHTML = '';
        if (institute.communityPost && institute.communityPost.text) {
            communityPostHTML = `
                <div class="detail-block community-buzz-block">
                    <h4><i class="fas fa-bullhorn"></i> Community Buzz</h4>
                    <div class="post-snippet">
                        <p>${institute.communityPost.text}</p>
                        ${institute.communityPost.link ? `<a href="${institute.communityPost.link}" target="_blank">View Original Post <i class="fas fa-external-link-alt fa-xs"></i></a>` : ''}
                    </div>
                </div>`;
        }
        
        let mapHTML = '';
        if (institute.mapEmbed) {
            mapHTML = `<div class="detail-block institute-map-embed"><h4><i class="fas fa-map-marker-alt"></i> Location</h4>${institute.mapEmbed}</div>`;
        }

        return `
            <article class="institute-entry-card" id="inst-${institute.id}">
                <div class="institute-card-main-info">
                    <div class="institute-card-header">
                        <img src="${institute.flag}" alt="${institute.name} Flag" class="institute-flag">
                        <img src="${institute.logo}" alt="${institute.name} Logo" class="institute-logo-display">
                    </div>
                    <h3>${institute.name}</h3>
                    <p class="institute-description-text">${institute.description}</p>
                    <div class="institute-main-links">
                        <a href="${institute.website}" target="_blank" class="btn btn-small btn-outline">Visit Website</a>
                        ${institute.facebook ? `<a href="${institute.facebook}" target="_blank" title="Facebook" class="social-icon-link"><i class="fab fa-facebook-square"></i></a>` : ''}
                        ${institute.instagram ? `<a href="${institute.instagram}" target="_blank" title="Instagram" class="social-icon-link"><i class="fab fa-instagram-square"></i></a>` : ''}
                    </div>
                </div>
                <button class="institute-details-toggle" aria-expanded="false" aria-controls="details-${institute.id}">
                    View Details & My Experiences
                    <i class="fas fa-chevron-down toggle-icon"></i>
                </button>
                <div class="institute-collapsible-content" id="details-${institute.id}">
                    <div class="institute-details-inner">
                        <div class="detail-block my-experience-block">
                            <h4><i class="fas fa-user-check"></i> My Experience</h4>
                            <p>${institute.myExperience || "I'm looking forward to visiting and sharing my experiences soon!"}</p>
                        </div>
                        ${institute.keyOfferings && institute.keyOfferings.length > 0 ? `
                        <div class="detail-block key-offerings-block">
                            <h4><i class="fas fa-graduation-cap"></i> Key Offerings</h4>
                            <ul>${institute.keyOfferings.map(offering => `<li>${offering}</li>`).join('')}</ul>
                        </div>` : ''}
                        <div class="detail-block contact-info">
                            <h4><i class="fas fa-address-book"></i> Contact & Address</h4>
                            ${institute.contact ? `<p><strong>Contact:</strong> ${institute.contact}</p>` : ''}
                            ${institute.addresses && institute.addresses.length > 0 ? `<p><strong>Address(es):</strong><br>${institute.addresses.join('<br>')}</p>` : ''}
                        </div>
                        ${videoHTML ? `
                        <div class="detail-block institute-video-embed-journey">
                            <h4><i class="fab fa-youtube"></i> Featured Video</h4>
                            ${videoHTML}
                        </div>` : ''}
                        <div class="detail-block institute-photo-gallery-journey">
                            <h4><i class="fas fa-images"></i> Photo Gallery</h4>
                            <div class="institute-photo-gallery-grid">${photoGalleryHTML}</div>
                        </div>
                        ${communityPostHTML}
                        ${mapHTML}
                    </div>
                </div>
            </article>
        `;
    }

    if (listingContainer && typeof culturalInstitutesData !== 'undefined') {
        listingContainer.innerHTML = ''; // Clear loading message
        culturalInstitutesData.forEach(institute => {
            listingContainer.insertAdjacentHTML('beforeend', createInstituteCardHTML(institute));
        });

        // Add event listeners for the toggles AFTER cards are rendered
        const toggles = document.querySelectorAll('.institute-details-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const content = document.getElementById(toggle.getAttribute('aria-controls'));
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                
                toggle.setAttribute('aria-expanded', String(!isExpanded));
                content.classList.toggle('open');
                
                if (!isExpanded) {
                    content.style.maxHeight = content.scrollHeight + "px";
                } else {
                    content.style.maxHeight = null;
                }
            });
        });
    } else {
        if(listingContainer) listingContainer.innerHTML = "<p>Could not load institute data. Please try again later.</p>";
        console.error("Institute listing container or data not found.");
    }
});