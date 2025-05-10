document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selectors (Ensure these are defined only once at the top) ---
    const header = document.querySelector('header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const languageRotator = document.getElementById('language-rotator');
    const sectionsToReveal = document.querySelectorAll('.content-section, .featured-video-section, .playlists-section, .pathway-section, .friends-section, .resources-section, .resource-category, .cultural-institutes-section'); // Added .cultural-institutes-section
    const internalNavLinks = document.querySelectorAll('header .nav-links a[href^="#"]');
    const currentYearSpan = document.getElementById('current-year');
    const appGrids = document.querySelectorAll('.app-grid'); // For resources/apps.html
    // const languageEntries = document.querySelectorAll('.language-entry details'); // For resources/apps.html - Uncomment if used
    const friendCards = document.querySelectorAll('.friend-card'); // For index.html friend cards
    const instituteCards = document.querySelectorAll('.institute-card'); // For index.html cultural institute cards

    // --- Sticky Header ---
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // --- Mobile Navigation Toggle ---
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close mobile nav when an internal link (starts with #) or any link in dropdown is clicked
        navLinks.querySelectorAll('a').forEach(link => { // Changed to 'a' to include dropdown links
            link.addEventListener('click', (e) => {
                // Don't close if it's a dropdown toggle itself
                if (link.classList.contains('dropbtn') && link.getAttribute('href') === 'javascript:void(0)') {
                    // Let the click happen for dropdown logic (if any JS is added for mobile dropdown click)
                    // Or, if pure CSS hover, this check might not be strictly needed for closing,
                    // but good if you add JS to toggle dropdowns on mobile click.
                    return;
                }
                if (navLinks.classList.contains('active')) {
                    // If it's not a link to an external page or a section on another page
                    const href = link.getAttribute('href');
                    if (href && (href.startsWith('#') || !href.includes('.'))) { // Simple check for internal/anchor
                        navLinks.classList.remove('active');
                        menuToggle.classList.remove('active');
                    } else if (!href || href === 'javascript:void(0)'){ // If it's just a placeholder or JS trigger
                        // This case is usually for dropdown toggles, already handled above
                    } else {
                        // For links to other pages or external sites, let the navigation happen,
                        // but still close the mobile menu
                        navLinks.classList.remove('active');
                        menuToggle.classList.remove('active');
                    }
                }
            });
        });
    }

    // --- Smooth Scrolling ---
    function smoothScrollTo(targetElement) {
        if (targetElement && header) {
            const headerOffset = header.offsetHeight;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
        } else if (targetElement) { // Fallback if header not found
            targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // For header navigation links that are internal anchors
    internalNavLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            // Ensure it's an internal link on the current page
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) { // Check if target element exists
                    e.preventDefault();
                    smoothScrollTo(targetElement);
                }
            }
        });
    });

    // For other buttons/links that might scroll (e.g., ".btn" class)
     document.querySelectorAll('a.btn[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement){ // Check if target element exists
                    e.preventDefault();
                    smoothScrollTo(targetElement);
                }
            }
        });
    });


    // --- Active Link Highlighting ---
    function debounce(func, wait = 20, immediate = false) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    function updateActiveLinkLogic() {
        if (!header) return; // Exit if no header

        // Filter for links that are actual section links on the current page
        const currentPath = window.location.pathname.split('/').pop() || 'index.html'; // Get current page name
        const pageInternalNavLinks = Array.from(internalNavLinks).filter(link => {
            const href = link.getAttribute('href');
            // Only consider hash links if on index.html or if the link is part of a dropdown for sections on index.html
            // This needs to be more robust if you have sections on other pages linked from a global header.
            // For now, this primarily works for index.html sections.
            return href && href.startsWith('#') && (currentPath === 'index.html' || link.closest('.dropdown-content'));
        });

        if (pageInternalNavLinks.length === 0) { // If no relevant internal links, clear all
            internalNavLinks.forEach(link => link.classList.remove('active-link'));
            return;
        }


        let currentSectionId = null;
        const scrollThreshold = header.offsetHeight + (window.innerHeight * 0.2); // Adjusted threshold

        const navTargets = pageInternalNavLinks.map(link => {
            const href = link.getAttribute('href');
            const target = document.querySelector(href); // Target must exist on THIS page
            if (target) {
                return { link: link, target: target, href: href };
            }
            return null;
        }).filter(item => item !== null);


        for (let i = navTargets.length - 1; i >= 0; i--) {
            const sectionInfo = navTargets[i];
            const sectionTop = sectionInfo.target.offsetTop;

            // Section is active if its top is above the scrollThreshold (meaning we've scrolled into it)
            if (sectionTop <= window.pageYOffset + scrollThreshold) {
                currentSectionId = sectionInfo.href;
                break;
            }
        }
        
        // If scrolled to the very bottom, highlight the last relevant nav link
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50 && navTargets.length > 0) {
             const lastVisibleTarget = navTargets.findLast(nt => nt.target.offsetParent !== null); // is visible
             if (lastVisibleTarget) currentSectionId = lastVisibleTarget.href;
        }

        // If at the very top, no section is active (unless you have a #hero link)
        if (window.pageYOffset < header.offsetHeight) {
            currentSectionId = null; // Or '#hero' if you have a "Home" link
        }


        internalNavLinks.forEach(link => {
             const linkHref = link.getAttribute('href');
             if(linkHref === currentSectionId) {
                 link.classList.add('active-link');
             } else {
                 link.classList.remove('active-link');
             }
        });
    }
    const debouncedUpdateActiveLink = debounce(updateActiveLinkLogic, 50);
    window.addEventListener('scroll', debouncedUpdateActiveLink);
    updateActiveLinkLogic(); // Initial call


    // --- Hero Text Rotator ---
    if (languageRotator) {
        const languages = ["Spanish", "French", "Russian", "Indonesian", "Italian", "Portuguese", "Swedish", "German","Bisaya", "11 Languages"]; // Added "Languages"
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
        }
    }

    // --- Reveal Sections on Scroll ---
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
    } else { // Fallback for older browsers
        sectionsToReveal.forEach(section => { 
            if (section) section.classList.add('visible'); 
        });
    }
    
    // --- Update Copyright Year ---
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Toggle App Details Functionality (resources/apps.html) ---
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
    }

    // --- Language Flags Click (index.html) ---
    const languageFlagGridLinks = document.querySelectorAll('#languages .language-item'); // More specific selector
    if (languageFlagGridLinks.length > 0) {
        languageFlagGridLinks.forEach(link => {
            link.addEventListener('click', function(event) {
                // Allow default navigation to the linked page (e.g., languages/spanish.html)
                // The alert was for testing, actual navigation should happen.
                // event.preventDefault(); // Remove this if you want the link to work
                // const langName = this.querySelector('span').textContent;
                // const targetUrl = this.href;
                // alert(`Navigate to ${langName} resources at: ${targetUrl}`); 
            });
        });
    }


    // --- Friend Card Video Preview on Hover (Expanding Version) ---
    if (friendCards.length > 0) {
        let activeVideoCard = null; // Keep track of the card with the active video
        let hoverTimeoutId = null;  // To manage showing video after a delay
        let leaveTimeoutId = null;  // To manage hiding video after a delay

        friendCards.forEach(card => {
            const videoPreviewContainer = card.querySelector('.video-preview-container');
            const videoId = card.dataset.videoId;

            if (!videoPreviewContainer || !videoId) return; // Skip if no container or videoId

            card.addEventListener('mouseenter', () => {
                clearTimeout(leaveTimeoutId); // Clear any pending hide
                clearTimeout(hoverTimeoutId); // Clear any pending show

                hoverTimeoutId = setTimeout(() => {
                    // If another video is already active, remove it
                    if (activeVideoCard && activeVideoCard !== card) {
                        const prevVideoContainer = activeVideoCard.querySelector('.video-preview-container');
                        if (prevVideoContainer) prevVideoContainer.innerHTML = ''; // Clear previous video
                        activeVideoCard.classList.remove('video-active');
                    }

                    // If this card's video isn't already loaded, load it
                    if (!videoPreviewContainer.querySelector('iframe')) {
                        const iframe = document.createElement('iframe');
                        // Added modestbranding=1 to reduce YouTube logo, rel=0 to limit related videos
                        iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0&loop=1&playlist=${videoId}`;
                        iframe.title = "YouTube video player";
                        iframe.frameBorder = "0";
                        iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
                        iframe.allowFullscreen = true;
                        videoPreviewContainer.appendChild(iframe);
                    }
                    card.classList.add('video-active');
                    activeVideoCard = card; // Set this card as the one with the active video
                }, 250); // ms delay before showing the video
            });

            card.addEventListener('mouseleave', () => {
                clearTimeout(hoverTimeoutId); // Clear any pending show
                
                leaveTimeoutId = setTimeout(() => {
                    // Only remove if this card is the one currently active
                    if (card.classList.contains('video-active')) { 
                        if (videoPreviewContainer.querySelector('iframe')) {
                            videoPreviewContainer.innerHTML = ''; // Clear video to stop playback
                        }
                        card.classList.remove('video-active');
                        if (activeVideoCard === card) { // If this was the active card, reset
                            activeVideoCard = null;
                        }
                    }
                }, 300); // ms delay before hiding the video
            });
        });
    }
    // --- End of Friend Card Video Preview ---

    // --- Cultural Institute Card Video Toggle ---
    if (instituteCards.length > 0) {
        instituteCards.forEach(card => {
            const toggleButton = card.querySelector('.institute-video-toggle');
            const videoContainer = card.querySelector('.institute-video-collapsible-area');
            const videoIframe = videoContainer ? videoContainer.querySelector('.institute-video-embed iframe') : null; // Ensure videoContainer exists
            let videoLoaded = false;

            if (toggleButton && videoContainer && videoIframe) { // Ensure all elements are found
                toggleButton.addEventListener('click', () => {
                    card.classList.toggle('video-active');
                    const isNowActive = card.classList.contains('video-active');
                    toggleButton.setAttribute('aria-expanded', isNowActive.toString());

                    if (isNowActive) {
                        // Load video src only on first open if using data-src
                        if (videoIframe.dataset.src && !videoLoaded) {
                            videoIframe.setAttribute('src', videoIframe.dataset.src);
                            videoLoaded = true;
                        }
                        videoContainer.style.maxHeight = videoContainer.scrollHeight + "px";
                    } else {
                        videoContainer.style.maxHeight = null;
                        // Optional: Pause video when collapsing
                        // Check if iframe src is set (not just data-src) and it has contentWindow
                        if (videoIframe.getAttribute('src') && videoIframe.contentWindow) { 
                            videoIframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
                        }
                    }
                });
            } else if (toggleButton && !videoIframe && videoContainer) {
                // This handles cards with placeholders like "Video Coming Soon"
                // So the button might exist but no iframe.
                toggleButton.addEventListener('click', () => {
                    if (toggleButton.disabled) return; // Don't do anything if button is disabled
                    card.classList.toggle('video-active');
                     const isNowActive = card.classList.contains('video-active');
                    toggleButton.setAttribute('aria-expanded', isNowActive.toString());
                    if (isNowActive) {
                        videoContainer.style.maxHeight = videoContainer.scrollHeight + "px";
                    } else {
                        videoContainer.style.maxHeight = null;
                    }
                });
            }
        });
    }
    // --- End of Cultural Institute Card Video Toggle ---

}); // End of the SINGLE, OUTER DOMContentLoaded