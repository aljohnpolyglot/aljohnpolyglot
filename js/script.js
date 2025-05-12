// js/script.js - For NON-template-dependent global scripts

document.addEventListener('DOMContentLoaded', () => {
    console.log("script.js: DOMContentLoaded - Initializing global scripts.");

    // --- Element Selectors (for elements expected in main HTML, not loaded templates) ---
    const languageRotator = document.getElementById('language-rotator');
    const sectionsToReveal = document.querySelectorAll('.content-section, .featured-video-section, .playlists-section, .pathway-section, .friends-section, .resources-section, .resource-category, .cultural-institutes-section');
    const appGrids = document.querySelectorAll('.app-grid'); // For resources/apps.html
    const friendCards = document.querySelectorAll('.friend-card'); // For index.html friend cards
    const instituteCards = document.querySelectorAll('.institute-card'); // For index.html cultural institute cards

    // --- Hero Text Rotator (if #language-rotator is in main HTML) ---
    if (languageRotator) {
        const languages = ["Spanish", "French", "Russian", "Indonesian", "Italian", "Portuguese", "Swedish", "German","Bisaya", "11 Languages"];
        let currentIndex = 0;
        languageRotator.style.transition = 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out';
        languageRotator.style.display = 'inline-block'; // Ensure it's displayed

        function rotateLanguage() {
            languageRotator.style.opacity = 0;
            languageRotator.style.transform = 'translateY(10px)';
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % languages.length;
                languageRotator.textContent = languages[currentIndex];
                languageRotator.style.opacity = 1;
                languageRotator.style.transform = 'translateY(0)';
            }, 300); // Matches CSS transition
        }
        if (languages.length > 0) { // Start rotation only if there are languages
            languageRotator.textContent = languages[currentIndex]; // Set initial text
            languageRotator.style.opacity = 1; // Make initial text visible
            languageRotator.style.transform = 'translateY(0)';
            setInterval(rotateLanguage, 3000);
            console.log("script.js: Hero text rotator initialized.");
        }
    }

    // --- Reveal Sections on Scroll (Good to keep here if sections are in main HTML) ---
    const revealSection = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    };

    if (typeof IntersectionObserver !== 'undefined' && sectionsToReveal.length > 0) {
        const sectionObserver = new IntersectionObserver(revealSection, {
            root: null,
            threshold: 0.1, // 10% of item visible
            rootMargin: '0px 0px -50px 0px' // Start revealing 50px before it enters viewport
        });
        sectionsToReveal.forEach(section => {
            if (section) sectionObserver.observe(section);
        });
        console.log("script.js: Intersection observer for sections initialized.");
    } else { // Fallback for older browsers
        sectionsToReveal.forEach(section => {
            if (section) section.classList.add('visible');
        });
         console.log("script.js: Sections made visible (IntersectionObserver fallback).");
    }

    // --- Smooth Scrolling for GENERAL buttons/links on the page (NOT header nav) ---
    // Targets <a> tags with class 'btn' and href starting with '#'
    // Excludes links within an element that has an ID 'main-header-placeholder' or is a 'header' tag
    // This avoids interfering with the smooth scroll logic in navbar-loader.js
    document.querySelectorAll('a.btn[href^="#"]').forEach(link => {
        // Check if the link is part of the dynamically loaded header
        if (link.closest('header#main-header-placeholder') || link.closest('header')) {
            return; // Skip, as this will be handled by navbar-loader.js
        }

        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement){
                    e.preventDefault();
                    // Smooth scroll without considering header offset here, or define a general offset
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const generalOffset = 0; // Adjust if you have a different fixed element for general pages
                    const offsetPosition = elementPosition + window.pageYOffset - generalOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });
    if (document.querySelectorAll('a.btn[href^="#"]').length > 0) {
        console.log("script.js: General smooth scroll for buttons initialized.");
    }


    // --- Friend Card Video Preview on Hover (If friend cards are in main HTML) ---
    if (friendCards.length > 0) {
        let activeVideoCard = null;
        let hoverTimeoutId = null;
        let leaveTimeoutId = null;

        friendCards.forEach(card => {
            const videoPreviewContainer = card.querySelector('.video-preview-container');
            const videoId = card.dataset.videoId;
            if (!videoPreviewContainer || !videoId) return;

            card.addEventListener('mouseenter', () => {
                clearTimeout(leaveTimeoutId);
                clearTimeout(hoverTimeoutId);
                hoverTimeoutId = setTimeout(() => {
                    if (activeVideoCard && activeVideoCard !== card) {
                        const prevVideoContainer = activeVideoCard.querySelector('.video-preview-container');
                        if (prevVideoContainer) prevVideoContainer.innerHTML = '';
                        activeVideoCard.classList.remove('video-active');
                    }
                    if (!videoPreviewContainer.querySelector('iframe')) {
                        const iframe = document.createElement('iframe');
                        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&loop=1&playlist=${videoId}`;
                        iframe.title = "YouTube video player";
                        iframe.frameBorder = "0";
                        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                        iframe.allowFullscreen = true;
                        videoPreviewContainer.appendChild(iframe);
                    }
                    card.classList.add('video-active');
                    activeVideoCard = card;
                }, 250);
            });

            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeoutId);
                leaveTimeoutId = setTimeout(() => {
                    if (card.classList.contains('video-active')) {
                        if (videoPreviewContainer.querySelector('iframe')) {
                            videoPreviewContainer.innerHTML = '';
                        }
                        card.classList.remove('video-active');
                        if (activeVideoCard === card) {
                            activeVideoCard = null;
                        }
                    }
                }, 300);
            });
        });
        console.log("script.js: Friend card hover logic initialized.");
    }
    // --- End of Friend Card Video Preview ---


    // --- Cultural Institute Card Video Toggle (If these cards are in main HTML) ---
    if (instituteCards.length > 0) {
        instituteCards.forEach(card => {
            const toggleButton = card.querySelector('.institute-video-toggle');
            const videoContainer = card.querySelector('.institute-video-collapsible-area');
            let videoIframe = null; // Define videoIframe here
            let videoLoaded = false;

            if (videoContainer) { // Check if videoContainer exists before querying iframe
                 videoIframe = videoContainer.querySelector('.institute-video-embed iframe');
            }


            if (toggleButton && videoContainer) { // videoIframe might be null if just a placeholder
                toggleButton.addEventListener('click', () => {
                    if (toggleButton.disabled) return;
                    card.classList.toggle('video-active');
                    const isNowActive = card.classList.contains('video-active');
                    toggleButton.setAttribute('aria-expanded', isNowActive.toString());

                    if (isNowActive) {
                        if (videoIframe && videoIframe.dataset.src && !videoLoaded) { // Check videoIframe exists
                            videoIframe.setAttribute('src', videoIframe.dataset.src);
                            videoLoaded = true;
                        }
                        videoContainer.style.maxHeight = videoContainer.scrollHeight + "px";
                    } else {
                        videoContainer.style.maxHeight = null;
                        if (videoIframe && videoIframe.getAttribute('src') && videoIframe.contentWindow) { // Check videoIframe exists
                            videoIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                        }
                    }
                });
            }
        });
        console.log("script.js: Institute card toggle logic initialized.");
    }
    // --- End of Cultural Institute Card Video Toggle ---


    // --- Toggle App Details Functionality (If .app-grid is in main HTML) ---
    if (appGrids.length > 0) {
        appGrids.forEach(grid => {
            grid.addEventListener('click', function(event) {
                const button = event.target.closest('.toggle-details-btn');
                if (!button) return;
                event.preventDefault();
                const appCardContainer = button.closest('.app-card-container');
                if (!appCardContainer) return;
                const detailsDiv = appCardContainer.querySelector('.app-details');
                if (!detailsDiv) return;
                const isVisible = detailsDiv.classList.toggle('details-visible');
                button.innerHTML = isVisible ? 'Hide Details <i class="fas fa-chevron-up"></i>' : 'View Details <i class="fas fa-chevron-down"></i>';
            });
        });
        console.log("script.js: App grid toggle logic initialized.");
    }

    console.log("script.js: All non-template-dependent scripts initialization complete.");
}); // End of DOMContentLoaded