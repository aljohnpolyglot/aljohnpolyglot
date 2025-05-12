// js/navbar-loader.js - DEBUG VERSION with more logging
console.log("navbar-loader.js: Script start"); // Log script start

document.addEventListener('DOMContentLoaded', function() {
    console.log("navbar-loader.js: DOMContentLoaded event fired"); // Log DOM ready
    const navbarPlaceholder = document.getElementById('main-header-placeholder');

    if (navbarPlaceholder) {
        console.log("navbar-loader.js: Found #main-header-placeholder");

        // Path relative FROM JS FILE to the single root navbar template
        const templatePathRelativeToJs = '../templates/navbar.html';
        console.log(`Navbar Loader: Attempting to fetch template from: ${templatePathRelativeToJs}`);

        fetch(templatePathRelativeToJs)
            .then(response => {
                console.log(`Navbar Loader: Fetch response received. Status: ${response.status}`); // Log response status
                if (!response.ok) {
                    // Log the path that failed clearly
                    console.error(`Navbar Loader: Fetch failed for ${response.url}`);
                    throw new Error(`HTTP error! status: ${response.status} while fetching ${response.url}`);
                }
                console.log("Navbar Loader: Fetch successful, getting text...");
                return response.text();
            })
            .then(data => {
                console.log("Navbar Loader: Template text received. Injecting HTML...");
                try {
                    navbarPlaceholder.outerHTML = data; // Inject the HTML
                    console.log("Navbar Loader: HTML injected successfully.");

                    // --- Call the function to adjust links/srcs INSIDE the injected HTML ---
                    console.log("Navbar Loader: Calling adjustLinksForBasePath...");
                    adjustLinksForBasePath();
                    console.log("Navbar Loader: adjustLinksForBasePath finished.");

                    // Now initialize the rest
                    console.log("Navbar Loader: Calling initializeNavbarScripts...");
                    initializeNavbarScripts();
                    console.log("Navbar Loader: initializeNavbarScripts finished.");

                    console.log("Navbar Loader: Calling setActiveLink...");
                    setActiveLink();
                    console.log("Navbar Loader: setActiveLink finished.");

                } catch (injectionError) {
                    console.error("Navbar Loader: Error during HTML injection or subsequent script initialization:", injectionError);
                     if(navbarPlaceholder) navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px; background: #fff;">JS Error after loading navigation data.</p>';
                }
            })
            .catch(error => {
                // This catches errors from fetch() or the .then() blocks before the final try/catch
                console.error('Error loading navbar (fetch or initial processing):', error);
                if(navbarPlaceholder) {
                   try {
                      navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px; background: #fff;">Error loading navigation data.</p>';
                   } catch(e){}
                }
            });

    } else {
        console.warn('Navbar Loader: #main-header-placeholder NOT FOUND on this page.');
    }
});

// --- Function to Adjust Paths INSIDE the loaded navbar ---
function adjustLinksForBasePath() {
    const headerElement = document.querySelector('header');
    if (!headerElement) {
        console.error("adjustLinksForBasePath: Header element not found after injection.");
        return;
    }

    // <<< --- CRITICAL: SET YOUR BASE PATH HERE --- >>>
    const siteBasePath = '/aljohnpolyglot/'; // <--- !!! SET TO '/' OR '/your-repo-name/' !!!
    // <<< --- END OF CRITICAL SETTING --- >>>

    console.log(`adjustLinksForBasePath: Using siteBasePath: '${siteBasePath}'`);

    if (siteBasePath === '/') {
        // console.log("adjustLinksForBasePath: Deploying to root, no adjustments needed.");
        return;
    }
    const correctBasePath = siteBasePath.endsWith('/') ? siteBasePath : siteBasePath + '/';
    const allInternalLinks = headerElement.querySelectorAll('a[href^="/"]:not([href^="//"])');
    let adjustedLinks = 0;
    allInternalLinks.forEach(link => {
        const originalHref = link.getAttribute('href');
        if (!originalHref.startsWith(correctBasePath)) {
            const correctedHref = correctBasePath + originalHref.substring(1);
            link.setAttribute('href', correctedHref);
            adjustedLinks++;
        }
    });
    const rootImages = headerElement.querySelectorAll('img[src^="/"]:not([src^="//"])');
     let adjustedImages = 0;
    rootImages.forEach(img => {
        const originalSrc = img.getAttribute('src');
         if (!originalSrc.startsWith(correctBasePath)) {
            const correctedSrc = correctBasePath + originalSrc.substring(1);
            img.setAttribute('src', correctedSrc);
            adjustedImages++;
         }
    });
     console.log(`adjustLinksForBasePath: Adjusted ${adjustedLinks} links and ${adjustedImages} images.`);
}

// --- Your existing functions below (Use the robust ones) ---
function initializeNavbarScripts() {
    // ... (keep the full function from previous answer) ...
    const headerElement = document.querySelector('header');
    if (!headerElement) { return; }
    const menuToggle = headerElement.querySelector('.menu-toggle');
    const navLinksUl = headerElement.querySelector('.nav-links');
    if (menuToggle && navLinksUl) {
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        newMenuToggle.addEventListener('click', () => {
            navLinksUl.classList.toggle('active');
            newMenuToggle.classList.toggle('active');
        });
    }
    if (!window.navbarScrollListenerAdded) {
        window.addEventListener('scroll', handleScroll);
        window.navbarScrollListenerAdded = true;
    }
    const dropdowns = headerElement.querySelectorAll('.nav-links .dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        if (dropbtn) {
            const newDropbtn = dropbtn.cloneNode(true);
            dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);
            newDropbtn.addEventListener('click', function(event) {
                handleDropdownClick(this, event, headerElement);
            });
        }
    });
    handleScroll(); // Initial check
    console.log("initializeNavbarScripts: Handlers attached."); // Add log
}

function handleDropdownClick(clickedDropbtn, event, headerElement) {
    // ... (keep the full function from previous answer) ...
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

function handleScroll() {
    // ... (keep the full function from previous answer) ...
    const headerElement = document.querySelector('header');
     if (headerElement) {
            headerElement.classList.toggle('scrolled', window.scrollY > 50);
     }
}

function setActiveLink() {
    // ... (keep the full function from previous answer) ...
    const headerElement = document.querySelector('header');
    if (!headerElement) { console.log("setActiveLink: Header not found."); return; }
    const siteBasePath = '/aljohnpolyglot/'; // <--- !!! ENSURE MATCHES adjustLinksForBasePath !!!
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
     console.log("setActiveLink: Link highlighting complete."); // Add log
}


function activateParentDropdown(linkElement) {
    // ... (keep the full function from previous answer) ...
    const dropdownContent = linkElement.closest('.dropdown-content');
    if (dropdownConten  t) {
        const dropbtn = dropdownContent.previousElementSibling;
        if (dropbtn && dropbtn.classList.contains('dropbtn')) {
            dropbtn.classList.add('active-link');
        }
    }
}