// js/navbar-loader.js - FINAL VERSION with Path Adjustment & Integrated Scripts
console.log("navbar-loader.js: Script start");

document.addEventListener('DOMContentLoaded', function() {
    console.log("navbar-loader.js: DOMContentLoaded event fired");
    const navbarPlaceholder = document.getElementById('main-header-placeholder');

    if (navbarPlaceholder) {
        console.log("navbar-loader.js: Found #main-header-placeholder");
        const templatePathRelativeToJs = '../templates/navbar.html';
        console.log(`Navbar Loader: Attempting to fetch template from: ${templatePathRelativeToJs}`);

        fetch(templatePathRelativeToJs)
            .then(response => {
                console.log(`Navbar Loader: Fetch response received. Status: ${response.status}`);
                if (!response.ok) {
                    console.error(`Navbar Loader: Fetch failed for ${response.url}`);
                    throw new Error(`HTTP error! status: ${response.status} while fetching ${response.url}`);
                }
                console.log("Navbar Loader: Fetch successful, getting text...");
                return response.text();
            })
            .then(data => {
                console.log("Navbar Loader: Template text received. Injecting HTML...");
                try {
                    navbarPlaceholder.outerHTML = data;
                    console.log("Navbar Loader: HTML injected successfully.");

                    console.log("Navbar Loader: Calling adjustLinksForBasePath...");
                    adjustLinksForBasePath();
                    console.log("Navbar Loader: adjustLinksForBasePath finished.");

                    console.log("Navbar Loader: Calling initializeNavbarScripts...");
                    initializeNavbarScripts(); // This will now contain sticky, mobile nav, smooth scroll for nav
                    console.log("Navbar Loader: initializeNavbarScripts finished.");

                    console.log("Navbar Loader: Calling setActiveLink...");
                    setActiveLink();         // This will now contain active link highlighting
                    console.log("Navbar Loader: setActiveLink finished.");

                } catch (injectionError) {
                    console.error("Navbar Loader: Error during HTML injection or subsequent script initialization:", injectionError);
                     if(navbarPlaceholder) navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px; background: #fff;">JS Error after loading navigation data.</p>';
                }
            })
            .catch(error => {
                console.error('Error loading navbar (fetch or initial processing):', error);
                if(navbarPlaceholder) { try { navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px; background: #fff;">Error loading navigation data.</p>'; } catch(e){} }
            });
    } else {
        console.warn('Navbar Loader: #main-header-placeholder NOT FOUND on this page.');
    }
});

// --- Function to Adjust Paths INSIDE the loaded navbar ---
function adjustLinksForBasePath() {
    const headerElement = document.querySelector('header'); // Query for header *after* injection
    if (!headerElement) {
        console.error("adjustLinksForBasePath: Header element not found after injection.");
        return;
    }
    const siteBasePath = '/aljohnpolyglot/'; // <--- !!! SET CORRECTLY !!!
    console.log(`adjustLinksForBasePath: Using siteBasePath: '${siteBasePath}'`);
    if (siteBasePath === '/') { return; }
    const correctBasePath = siteBasePath.endsWith('/') ? siteBasePath : siteBasePath + '/';
    let adjustedLinks = 0, adjustedImages = 0;
    headerElement.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach(link => {
        const originalHref = link.getAttribute('href');
        if (!originalHref.startsWith(correctBasePath)) {
            link.setAttribute('href', correctBasePath + originalHref.substring(1));
            adjustedLinks++;
        }
    });
    headerElement.querySelectorAll('img[src^="/"]:not([src^="//"])').forEach(img => {
        const originalSrc = img.getAttribute('src');
         if (!originalSrc.startsWith(correctBasePath)) {
            img.setAttribute('src', correctBasePath + originalSrc.substring(1));
            adjustedImages++;
         }
    });
    console.log(`adjustLinksForBasePath: Adjusted ${adjustedLinks} links and ${adjustedImages} images.`);
}

// --- NAVBAR SPECIFIC SCRIPTS (Moved from script.js) ---
function initializeNavbarScripts() {
    const headerElement = document.querySelector('header'); // Query *after* injection
    if (!headerElement) {
        console.error("initializeNavbarScripts: Header element not found.");
        return;
    }

    // --- Sticky Header (from script.js) ---
    if (!window.navbarScrollListenerAdded) { // Prevent multiple listeners
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                headerElement.classList.add('scrolled');
            } else {
                headerElement.classList.remove('scrolled');
            }
        });
        // Initial check in case page loads scrolled
        if (window.scrollY > 50) headerElement.classList.add('scrolled');
        window.navbarScrollListenerAdded = true;
    }


    // --- Mobile Navigation Toggle (from script.js, adapted) ---
    const menuToggle = headerElement.querySelector('.menu-toggle');
    const navLinksUl = headerElement.querySelector('.nav-links');

    if (menuToggle && navLinksUl) {
        // Clone and replace to remove potential old listeners
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);

        newMenuToggle.addEventListener('click', () => {
            navLinksUl.classList.toggle('active');
            newMenuToggle.classList.toggle('active');
        });

        // Close mobile nav when a link is clicked
        navLinksUl.querySelectorAll('a').forEach(link => {
            const newLink = link.cloneNode(true); // Clone to remove old listeners
            link.parentNode.replaceChild(newLink, link);

            newLink.addEventListener('click', (e) => {
                if (newLink.classList.contains('dropbtn') && (newLink.getAttribute('href') === 'javascript:void(0)' || newLink.getAttribute('href') === '#')) {
                    // Let dropdown logic handle this (or if it's just a toggle)
                    // If you want it to close after opening a dropdown, remove this return
                    return;
                }
                if (navLinksUl.classList.contains('active')) {
                    navLinksUl.classList.remove('active');
                    newMenuToggle.classList.remove('active');
                }
            });
        });
    }

    // --- Dropdown Click Handler (Mobile) ---
    const dropdowns = headerElement.querySelectorAll('.nav-links .dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        if (dropbtn) {
            const newDropbtn = dropbtn.cloneNode(true);
            dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);
            newDropbtn.addEventListener('click', function(event) {
                handleDropdownClick(this, event, headerElement); // Call helper
            });
        }
    });


    // --- Smooth Scrolling for header nav links (from script.js) ---
    const internalNavLinks = headerElement.querySelectorAll('.nav-links a[href^="#"]');
    internalNavLinks.forEach(link => {
        const newLink = link.cloneNode(true); // Clone to remove old listeners
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    const headerOffset = headerElement.offsetHeight;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });
    console.log("initializeNavbarScripts: Sticky, Mobile Nav, Smooth Scroll for nav initialized.");
}

function handleDropdownClick(clickedDropbtn, event, headerElement) {
    // (Keep this function as provided in previous replies for dropdown logic)
    const isMobile = window.innerWidth <= 768;
    const dropdownContent = clickedDropbtn.nextElementSibling;
    if (isMobile && dropdownContent && dropdownContent.classList.contains('dropdown-content')) {
        event.preventDefault();
        headerElement.querySelectorAll('.dropdown-content.show-mobile').forEach(openDropdown => {
            if (openDropdown !== dropdownContent) {
                openDropdown.classList.remove('show-mobile');
                openDropdown.style.maxHeight = null;
                const otherDropbtn = openDropdown.previousElementSibling;
                if (otherDropbtn) otherDropbtn.classList.remove('mobile-dropdown-open');
            }
        });
        dropdownContent.classList.toggle('show-mobile');
        clickedDropbtn.classList.toggle('mobile-dropdown-open');
        dropdownContent.style.maxHeight = dropdownContent.classList.contains('show-mobile') ? dropdownContent.scrollHeight + "px" : null;
    }
}

function handleScroll() { // Renamed for clarity, called by sticky header
    const headerElement = document.querySelector('header');
     if (headerElement) {
            headerElement.classList.toggle('scrolled', window.scrollY > 50);
     }
}


function setActiveLink() {
    // (Keep this function as provided, but ensure siteBasePath matches the one in adjustLinksForBasePath)
    const headerElement = document.querySelector('header');
    if (!headerElement) { console.log("setActiveLink: Header not found."); return; }
    const siteBasePath = '/aljohnpolyglot/'; // <--- !!! ENSURE MATCHES !!!
    const currentFullUrl = window.location.href;
    const urlObject = new URL(currentFullUrl);
    const currentPathname = urlObject.pathname;
    const currentHash = urlObject.hash;
    let pathForComparison = currentPathname;
    if (siteBasePath !== '/' && pathForComparison.startsWith(siteBasePath)) {
        pathForComparison = '/' + pathForComparison.substring(siteBasePath.length);
    }
    pathForComparison = pathForComparison.endsWith('/') && pathForComparison !== '/' ? pathForComparison.slice(0, -1) : pathForComparison;
    pathForComparison = pathForComparison.endsWith('/index.html') ? pathForComparison.slice(0, -10) : pathForComparison;
    if (pathForComparison === '') pathForComparison = '/';
    const allLinks = headerElement.querySelectorAll('.nav-links a, .dropdown-content a');
    allLinks.forEach(link => {
        link.classList.remove('active-link');
        const parentDropbtn = link.closest('.dropdown')?.querySelector('.dropbtn');
        if (parentDropbtn) parentDropbtn.classList.remove('active-link');
    });
    let bestMatch = null;
    let bestMatchLevel = -1;
    allLinks.forEach(link => {
        const linkHrefAttr = link.getAttribute('href');
        if (!linkHrefAttr || linkHrefAttr.startsWith('http') || linkHrefAttr === 'javascript:void(0)' || linkHrefAttr === '#') return;
        let normalizedLinkHref = linkHrefAttr.startsWith('/') ? linkHrefAttr : '/' + linkHrefAttr;
        normalizedLinkHref = normalizedLinkHref.endsWith('/') && normalizedLinkHref !== '/' ? normalizedLinkHref.slice(0, -1) : normalizedLinkHref;
        normalizedLinkHref = normalizedLinkHref.endsWith('/index.html') ? normalizedLinkHref.slice(0, -10) : normalizedLinkHref;
        if (normalizedLinkHref === '') normalizedLinkHref = '/';
        const linkPathPart = normalizedLinkHref.split('#')[0];
        const linkHashPart = normalizedLinkHref.includes('#') ? '#' + normalizedLinkHref.split('#')[1] : '';
         if (linkPathPart === pathForComparison) {
            if (linkHashPart === currentHash) {
                if (bestMatchLevel < 2) { bestMatch = link; bestMatchLevel = 2; }
            } else if (!currentHash && !linkHashPart) {
                if (bestMatchLevel < 1) { bestMatch = link; bestMatchLevel = 1; }
            } else if (currentHash && !linkHashPart) {
                if (bestMatchLevel < 1) { bestMatch = link; bestMatchLevel = 1; }
            }
        }
    });
    if (bestMatch) {
        bestMatch.classList.add('active-link');
        activateParentDropdown(bestMatch);
    } else if (pathForComparison === '/') {
        const rootLink = headerElement.querySelector('a[href="/"], a[href="/index.html"]');
         if (rootLink) { rootLink.classList.add('active-link'); }
    }
    console.log("setActiveLink: Link highlighting complete.");
}

function activateParentDropdown(linkElement) {
    // (Keep this function as is)
    const dropdownContent = linkElement.closest('.dropdown-content');
    if (dropdownContent) {
        const dropbtn = dropdownContent.previousElementSibling;
        if (dropbtn && dropbtn.classList.contains('dropbtn')) {
            dropbtn.classList.add('active-link');
        }
    }
}