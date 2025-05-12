// js/navbar-loader.js
document.addEventListener('DOMContentLoaded', function() {
    const navbarPlaceholder = document.getElementById('main-header-placeholder');
    if (navbarPlaceholder) {
        fetch('templates/navbar.html') // Root-relative path
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                navbarPlaceholder.outerHTML = data;
                initializeNavbarScripts();
                setActiveLink();
            })
            .catch(error => console.error('Error loading navbar:', error));
    } else {
        console.warn('Navbar placeholder #main-header-placeholder not found on this page.');
    }
});

function initializeNavbarScripts() {
    const menuToggle = document.querySelector('header .menu-toggle'); // Scoped to header
    const navLinksUl = document.querySelector('header .nav-links'); // Scoped to header
    const headerElement = document.querySelector('header'); // The injected header

    if (menuToggle && navLinksUl) {
        menuToggle.addEventListener('click', () => {
            navLinksUl.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    if (headerElement) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                headerElement.classList.add('scrolled');
            } else {
                headerElement.classList.remove('scrolled');
            }
        });
    }

    const dropdowns = document.querySelectorAll('header .nav-links .dropdown'); // Scoped
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        if (dropbtn) {
            dropbtn.addEventListener('click', function(event) {
                const isMobile = window.innerWidth <= 768;
                const hasRealHref = this.getAttribute('href') !== 'javascript:void(0)' && this.getAttribute('href') !== '#';
                const dropdownContent = this.nextElementSibling;

                if (isMobile) {
                    if (dropdownContent && dropdownContent.classList.contains('dropdown-content')) {
                        event.preventDefault(); // Prevent navigation for parent item on mobile to allow toggle
                        
                        // Close other open dropdowns
                        document.querySelectorAll('header .dropdown-content.show-mobile').forEach(openDropdown => {
                            if (openDropdown !== dropdownContent) {
                                openDropdown.classList.remove('show-mobile');
                                openDropdown.style.maxHeight = null;
                                const otherDropbtn = openDropdown.previousElementSibling;
                                if (otherDropbtn) otherDropbtn.classList.remove('mobile-dropdown-open');
                            }
                        });

                        dropdownContent.classList.toggle('show-mobile');
                        this.classList.toggle('mobile-dropdown-open');
                        if (dropdownContent.classList.contains('show-mobile')) {
                            dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
                        } else {
                            dropdownContent.style.maxHeight = null;
                        }
                    }
                    // If it's a real link AND its dropdown is already open, allow navigation (second tap)
                    // This logic can be complex; current setup: first tap on parent always toggles.
                    // To navigate from parent on mobile: user would tap, dropdown opens, then they'd have to tap again
                    // or the link itself would need to be separate from the toggle trigger.
                    // For simplicity, links *within* the dropdown navigate directly.
                }
                // Desktop hover is handled by CSS. JS click on javascript:void(0) for accessibility if needed.
            });
        }
    });
}

function setActiveLink() {
    const currentPath = window.location.pathname;
    const normalizedCurrentPath = (currentPath === '/' || currentPath === '') ? '/index.html' : currentPath;
    const currentPageFile = normalizedCurrentPath.substring(normalizedCurrentPath.lastIndexOf('/') + 1);
    const currentHash = window.location.hash;

    const allLinks = document.querySelectorAll('header .nav-links a, header .dropdown-content a');

    let bestMatch = null;
    let bestMatchSpecificity = -1; // 0: path, 1: path+hash

    allLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref.startsWith('http')) return;

        let normalizedLinkHref = (linkHref === '/' || linkHref === '') ? '/index.html' : linkHref;
        
        const linkPathPart = normalizedLinkHref.split('#')[0];
        const linkHashPart = normalizedLinkHref.split('#')[1] ? '#' + normalizedLinkHref.split('#')[1] : '';

        const currentPathPart = normalizedCurrentPath.split('#')[0];

        if (linkPathPart === currentPathPart) {
            // Exact path match
            if (linkHashPart === currentHash) { // Path and hash match
                if (bestMatchSpecificity < 1) {
                    bestMatch = link;
                    bestMatchSpecificity = 1;
                }
            } else if (!currentHash && !linkHashPart) { // Path matches, no hashes involved
                if (bestMatchSpecificity < 0) { // Only if no hash match found yet
                    bestMatch = link;
                    bestMatchSpecificity = 0;
                }
            } else if (currentHash && linkPathPart === currentPathPart && linkHashPart === '' && (link.closest('.nav-links > li > a') || link.closest('.dropbtn'))) {
                // Special case: if on index.html#about, make "index.html" (the parent) also active
                // if it's a top-level link or a dropbtn for the current section.
                // This makes the parent "Languages" active if on index.html#languages
                 if (bestMatchSpecificity < 0) { // Only if no hash match found yet
                    const parentDropbtn = link.closest('.dropdown')?.querySelector('.dropbtn');
                    if (parentDropbtn && currentPathPart + currentHash === parentDropbtn.getAttribute('href')) {
                       // this logic is a bit tricky; focus on direct matches first
                    } else if (link.matches('.nav-links > li > a, .dropbtn')) { // if it's a main nav link
                        // bestMatch = link; // Tentatively set it
                        // bestMatchSpecificity = 0; // Lower specificity
                    }
                }
            }
        }
    });
    
    if (bestMatch) {
        bestMatch.classList.add('active-link');
        activateParentDropdown(bestMatch);
    } else {
         // Fallback for index.html if no other specific link (especially hash link) was matched
        if (normalizedCurrentPath === '/index.html' && !currentHash) {
            const homeLink = document.querySelector('header .nav-links > li > a[href="/index.html"]:not([href*="#"]), header .nav-links > li > a[href="/"]:not([href*="#"])');
            if (homeLink) {
                homeLink.classList.add('active-link');
                activateParentDropdown(homeLink);
            }
        }
    }
    // If still no active link and on index.html with a hash, try to make the parent of that hash active
    if (!document.querySelector('header .nav-links .active-link') && normalizedCurrentPath === '/index.html' && currentHash) {
        const sectionDropbtn = document.querySelector(`header .dropbtn[href="/index.html${currentHash}"]`);
        if (sectionDropbtn) {
            sectionDropbtn.classList.add('active-link');
        }
    }
}

function activateParentDropdown(linkElement) {
    const dropdownContent = linkElement.closest('.dropdown-content');
    if (dropdownContent) {
        const dropbtn = dropdownContent.previousElementSibling;
        if (dropbtn && dropbtn.classList.contains('dropbtn')) {
            // Check if the dropbtn's href matches the main page part, or if it's a generic dropdown
            const currentPathPart = (window.location.pathname === '/' ? '/index.html' : window.location.pathname).split('#')[0];
            const dropbtnPathPart = dropbtn.getAttribute('href').split('#')[0];
            
            if (dropbtn.getAttribute('href') === 'javascript:void(0)' || dropbtnPathPart === currentPathPart) {
                 dropbtn.classList.add('active-link');
            }
        }
    }
}