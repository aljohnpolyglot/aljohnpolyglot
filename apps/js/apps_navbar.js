console.log("navbar-loader.js: Script start. Relies on global 'siteBasePath'.");

// Define adjustLinksForBasePath globally within this script's scope or ensure it's truly global
// If other scripts need it, consider a shared utility file.
function adjustLinksForBasePath(parentElement, basePathToUse) {
    console.log(`adjustLinksForBasePath: Using basePath: '${basePathToUse}' for element:`, parentElement);
    if (!parentElement) {
        console.error("adjustLinksForBasePath: Parent element is null, cannot adjust links.");
        return;
    }
    // No prepending needed if basePath is root, or for absolute URLs, or if already prefixed
    if (basePathToUse === '/' || !basePathToUse || basePathToUse.trim() === '') {
         console.log("adjustLinksForBasePath: Base path is root ('/'), no path prepending needed for links/images starting with '/'.");
         return;
    }

    const correctBasePath = basePathToUse.endsWith('/') ? basePathToUse : basePathToUse + '/';
    let adjustedLinks = 0;
    let adjustedImages = 0;

    // Adjust <a> tags
    parentElement.querySelectorAll('a[href]').forEach(link => {
        let originalHref = link.getAttribute('href');
        if (originalHref && originalHref.startsWith('/') && !originalHref.startsWith('//') && !originalHref.startsWith(correctBasePath)) {
            const pathSegment = originalHref === '/' ? '' : originalHref.substring(1);
            const newHref = (correctBasePath + pathSegment).replace(/\/\//g, '/');
            link.setAttribute('href', newHref);
            adjustedLinks++;
        }
    });

    // Adjust <img> tags
    parentElement.querySelectorAll('img[src]').forEach(img => {
        let originalSrc = img.getAttribute('src');
         if (originalSrc && originalSrc.startsWith('/') && !originalSrc.startsWith('//') && !originalSrc.startsWith(correctBasePath)) {
            const pathSegment = originalSrc === '/' ? '' : originalSrc.substring(1);
            const newSrc = (correctBasePath + pathSegment).replace(/\/\//g, '/');
            img.setAttribute('src', newSrc);
            adjustedImages++;
         }
    });
    console.log(`adjustLinksForBasePath: Adjusted ${adjustedLinks} links and ${adjustedImages} images within`, parentElement);
}


document.addEventListener('DOMContentLoaded', function() {
    console.log("navbar-loader.js: DOMContentLoaded event fired.");

    if (typeof siteBasePath === 'undefined') {
        console.error("Navbar Loader: CRITICAL - global 'siteBasePath' is not defined. Navbar cannot load correctly.");
        const errPlaceholder = document.getElementById('main-header-placeholder');
        if (errPlaceholder) errPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding:10px; background:#fff;">Error: Site configuration missing (siteBasePath). Navbar cannot load.</p>';
        return;
    }
    console.log("Navbar Loader: Using global siteBasePath:", siteBasePath);

    const navbarPlaceholder = document.getElementById('main-header-placeholder');

    if (navbarPlaceholder) {
        console.log("navbar-loader.js: Found #main-header-placeholder");

        let templatePath = siteBasePath + 'templates/navbar.html';
        const finalTemplatePath = templatePath.replace(/\/\//g, '/'); // Normalize path

        console.log(`Navbar Loader: Attempting to fetch template from: ${finalTemplatePath}`);

        fetch(finalTemplatePath)
            .then(response => {
                console.log(`Navbar Loader: Fetch response received. Status: ${response.status}`);
                if (!response.ok) {
                    console.error(`Navbar Loader: Fetch failed for ${response.url}`);
                    navbarPlaceholder.innerHTML = `<p style="color:red; text-align:center; padding: 10px; background: #fff;">Error loading navigation data (Status: ${response.status}). Check console and path: ${response.url}</p>`;
                    throw new Error(`HTTP error! status: ${response.status} while fetching ${response.url}`);
                }
                console.log("Navbar Loader: Fetch successful, getting text...");
                return response.text();
            })
            .then(data => {
                console.log("Navbar Loader: Template text received. Injecting HTML...");
                try {
                    // MODIFIED INJECTION: Inject HTML content into the placeholder
                    navbarPlaceholder.innerHTML = data.trim();
                    // Get a reference to the actual <header> element from the injected template
                    const headerElement = navbarPlaceholder.querySelector('header');

                    if (!headerElement) {
                        throw new Error("Loaded navbar template does not contain a <header> element after injection.");
                    }
                    // No longer replacing the placeholder, so the placeholder's class remains.

                    console.log("Navbar Loader: HTML injected successfully.");

                    console.log("Navbar Loader: Calling adjustLinksForBasePath...");
                    adjustLinksForBasePath(headerElement, siteBasePath); // Pass the injected headerElement
                    console.log("Navbar Loader: adjustLinksForBasePath finished.");

                    console.log("Navbar Loader: Calling initializeNavbarScripts...");
                    initializeNavbarScripts(headerElement); // Pass the injected headerElement
                    console.log("Navbar Loader: initializeNavbarScripts finished.");

                    console.log("Navbar Loader: Calling setActiveLink...");
                    setActiveLink(siteBasePath, headerElement); // Pass the injected headerElement
                    console.log("Navbar Loader: setActiveLink finished.");

                } catch (injectionError) {
                    console.error("Navbar Loader: Error during HTML injection or subsequent script initialization:", injectionError);
                     const targetEl = navbarPlaceholder.querySelector('header') || navbarPlaceholder; // Use inner header if present, else placeholder
                     if(targetEl) targetEl.innerHTML = '<p style="color:red; text-align:center; padding: 10px; background: #fff;">JS Error after loading navigation data. See console.</p>';
                }
            })
            .catch(error => {
                console.error('Error loading navbar (fetch or processing):', error);
                if (navbarPlaceholder && !navbarPlaceholder.innerHTML.includes('Error loading')) {
                     try { navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px; background: #fff;">Error loading navigation data. See console.</p>'; } catch(e){}
                 }
            });
    } else {
        console.warn('Navbar Loader: #main-header-placeholder NOT FOUND on this page.');
    }
});

// --- Navbar Core Functions ---
// (These functions are now designed to take the specific headerElement as context)

function initializeNavbarScripts(headerElementContext) {
    if (!headerElementContext) {
        console.error("initializeNavbarScripts: Header element context not provided.");
        return;
    }

    // Sticky header based on scroll (applies 'scrolled' to the passed headerElementContext)
    // This assumes headerElementContext is the one styled with position:fixed by overrides
    if (!window.navbarScrollListenerAdded) {
        window.addEventListener('scroll', () => {
            if (headerElementContext) { // Check if element still exists
                 headerElementContext.classList.toggle('scrolled', window.scrollY > 50);
            }
        });
        // Initial check
        if (headerElementContext) {
            headerElementContext.classList.toggle('scrolled', window.scrollY > 50);
        }
        window.navbarScrollListenerAdded = true;
    }

    // Mobile menu toggle
    const menuToggle = headerElementContext.querySelector('.menu-toggle');
    const navLinksUl = headerElementContext.querySelector('.nav-links');

    if (menuToggle && navLinksUl) {
        // Re-attach listener to prevent issues if this function is called multiple times (though it shouldn't be)
        const newMenuToggle = menuToggle.cloneNode(true); // Clone to remove old listeners
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);

        newMenuToggle.addEventListener('click', () => {
            navLinksUl.classList.toggle('active');
            newMenuToggle.classList.toggle('active');
        });

        // Close mobile menu when a link is clicked
        navLinksUl.querySelectorAll('a').forEach(link => {
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);

            newLink.addEventListener('click', (e) => {
                const isDropbtn = newLink.classList.contains('dropbtn');
                const isMobile = window.innerWidth <= 768;
                const href = newLink.getAttribute('href');
                // For mobile dropdown toggles that are just for showing/hiding content
                const isToggleOnly = href === 'javascript:void(0)' || href === '#';

                if (isDropbtn && isMobile && isToggleOnly) {
                    // Handled by handleDropdownClick, do not close menu here
                    return;
                }

                // Close menu if it's active
                if (navLinksUl.classList.contains('active')) {
                    navLinksUl.classList.remove('active');
                    const currentToggle = headerElementContext.querySelector('.menu-toggle.active');
                    if(currentToggle) currentToggle.classList.remove('active');
                }
            });
        });
    }

    // Dropdown functionality
    const dropdowns = headerElementContext.querySelectorAll('.nav-links .dropdown');
    dropdowns.forEach(dropdown => {
        const dropbtn = dropdown.querySelector('.dropbtn');
        if (dropbtn) {
            const newDropbtn = dropbtn.cloneNode(true);
            dropbtn.parentNode.replaceChild(newDropbtn, dropbtn);

            newDropbtn.addEventListener('click', function(event) {
                handleDropdownClick(this, event, headerElementContext); // Pass headerElementContext
            });
        }
    });

    // Smooth scroll for internal links
    const internalNavLinks = headerElementContext.querySelectorAll('.nav-links a[href*="#"]');
    internalNavLinks.forEach(link => {
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);

        newLink.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const hashIndex = href.lastIndexOf('#');
            if (hashIndex !== -1) {
                 const targetId = href.substring(hashIndex); // e.g., #about

                 // Determine if the link is for the current page
                 let currentPathForCompare = window.location.pathname;
                 if (typeof siteBasePath !== 'undefined' && siteBasePath !== '/' && currentPathForCompare.startsWith(siteBasePath)) {
                    // Remove base path for comparison if on a sub-page of the repo,
                    // but keep it if currentPath IS the base path.
                    if (currentPathForCompare !== siteBasePath && currentPathForCompare !== siteBasePath.slice(0,-1)) {
                         currentPathForCompare = currentPathForCompare.substring(siteBasePath.length -1);
                    }
                 }

                 if (currentPathForCompare.endsWith('/index.html')) currentPathForCompare = currentPathForCompare.slice(0, -10);
                 if (currentPathForCompare.length > 1 && currentPathForCompare.endsWith('/')) currentPathForCompare = currentPathForCompare.slice(0, -1);
                 if (currentPathForCompare === '') currentPathForCompare = '/'; // Normalize root

                 // Normalize link's base path part
                 let linkBasePathOnly = href.substring(0, hashIndex);
                 if (typeof siteBasePath !== 'undefined' && siteBasePath !== '/' && linkBasePathOnly.startsWith(siteBasePath)) {
                     if (linkBasePathOnly !== siteBasePath && linkBasePathOnly !== siteBasePath.slice(0,-1)) {
                        linkBasePathOnly = linkBasePathOnly.substring(siteBasePath.length -1);
                     }
                 }
                 if (linkBasePathOnly.endsWith('/index.html')) linkBasePathOnly = linkBasePathOnly.slice(0, -10);
                 if (linkBasePathOnly.length > 1 && linkBasePathOnly.endsWith('/')) linkBasePathOnly = linkBasePathOnly.slice(0, -1);
                 if (linkBasePathOnly === '') linkBasePathOnly = '/'; // Normalize root


                 const isSamePage = linkBasePathOnly === currentPathForCompare;

                 if (targetId.length > 1 && isSamePage) { // targetId must be like #something, not just #
                     const targetElement = document.querySelector(targetId);
                     if (targetElement) {
                        e.preventDefault();
                        const headerOffset = headerElementContext.offsetHeight;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                     }
                 }
            }
        });
    });
    console.log("initializeNavbarScripts: Sticky, Mobile Nav, Dropdowns, Smooth Scroll initialized for specific header.");
}

function handleDropdownClick(clickedDropbtn, event, headerElementContext) {
    const isMobile = window.innerWidth <= 768;
    const dropdownContent = clickedDropbtn.nextElementSibling;

    if (isMobile && dropdownContent && dropdownContent.classList.contains('dropdown-content')) {
        event.preventDefault(); // Prevent navigation if it's a js:void(0) link
        const isActive = dropdownContent.classList.contains('show-mobile');

        // Close other open mobile dropdowns within this specific navbar
        headerElementContext.querySelectorAll('.nav-links .dropdown-content.show-mobile').forEach(openDropdown => {
            if (openDropdown !== dropdownContent) {
                openDropdown.classList.remove('show-mobile');
                openDropdown.style.maxHeight = null;
                const otherBtn = openDropdown.previousElementSibling;
                if(otherBtn) otherBtn.classList.remove('mobile-dropdown-open');
            }
        });

        // Toggle current dropdown
        dropdownContent.classList.toggle('show-mobile', !isActive);
        clickedDropbtn.classList.toggle('mobile-dropdown-open', !isActive);
        dropdownContent.style.maxHeight = !isActive ? dropdownContent.scrollHeight + "px" : null;
    }
}

function setActiveLink(basePathToUse, headerElementContext) {
    if (!headerElementContext) {
        console.log("setActiveLink: Header element context not provided.");
        return;
    }

    const urlObject = new URL(window.location.href);
    let currentPathname = urlObject.pathname; // This will include repo name on GH Pages
    const currentHash = urlObject.hash;

    // Normalize currentPathname
    if (currentPathname.endsWith('/index.html')) {
        currentPathname = currentPathname.substring(0, currentPathname.length - 10);
    }
    // Ensure trailing slash for comparison, unless it's the basePath root or absolute root
    if (currentPathname.length > 1 && !currentPathname.endsWith('/') && currentPathname !== basePathToUse.slice(0,-1)) {
        // Only add slash if it's not already the repo root path like '/aljohnpolyglot'
    } else if (currentPathname.length > 1 && currentPathname.endsWith('/') && currentPathname !== basePathToUse){
         currentPathname = currentPathname.substring(0, currentPathname.length - 1); // Remove if not base path
    }

    // Handle root case for local and GitHub Pages correctly
    if (currentPathname === '' && basePathToUse === '/') currentPathname = '/'; // True root
    if (basePathToUse !== '/' && currentPathname === basePathToUse.slice(0, -1)) { // e.g. /aljohnpolyglot
        // This is the root of the repo, treat it as such for comparison
    }


    console.log(`setActiveLink: Using basePath: '${basePathToUse}'. Current URL Path: '${urlObject.pathname}', Normalized Current Path: '${currentPathname}', Hash: '${currentHash}'`);

    const allLinks = headerElementContext.querySelectorAll('.nav-links a, .dropdown-content a');
    allLinks.forEach(link => {
        link.classList.remove('active-link');
        const parentDropbtn = link.closest('.dropdown')?.querySelector('.dropbtn');
        if (parentDropbtn) parentDropbtn.classList.remove('active-link');
    });

    let bestMatch = null;
    let bestMatchLevel = -1; // -1: no match, 0: path match, 1: path match (current has hash, link doesn't), 2: path and hash match

    allLinks.forEach(link => {
        const linkHrefAttr = link.getAttribute('href');
        // Skip external links, empty hrefs, or javascript links
        if (!linkHrefAttr || linkHrefAttr.startsWith('http') || linkHrefAttr === '#' || linkHrefAttr.startsWith('javascript:')) return;

        // Href should already be adjusted by adjustLinksForBasePath
        let normalizedLinkHref = linkHrefAttr;

        // Normalize link href for comparison
        if (normalizedLinkHref.endsWith('/index.html')) {
            normalizedLinkHref = normalizedLinkHref.substring(0, normalizedLinkHref.length - 10);
        }
        if (normalizedLinkHref.length > 1 && normalizedLinkHref.endsWith('/') && normalizedLinkHref !== basePathToUse) {
            normalizedLinkHref = normalizedLinkHref.substring(0, normalizedLinkHref.length - 1);
        }
        if (normalizedLinkHref === '' && basePathToUse === '/') normalizedLinkHref = '/';
        if (basePathToUse !== '/' && normalizedLinkHref === basePathToUse.slice(0, -1)) {
            // Link is to the root of the repo
        }


        const linkPathPart = normalizedLinkHref.split('#')[0];
        const linkHashPart = normalizedLinkHref.includes('#') ? '#' + normalizedLinkHref.split('#')[1] : '';

        // console.log(`Comparing: Current='${currentPathname}${currentHash}' with Link='${linkPathPart}${linkHashPart}' (Original Link Href: ${linkHrefAttr})`);


        if (linkPathPart === currentPathname) {
            if (linkHashPart === currentHash) { // Exact match (path and hash)
                if (bestMatchLevel < 2) { bestMatch = link; bestMatchLevel = 2; }
            } else if (!linkHashPart && currentHash) { // Link is to page, current URL has hash (e.g. section on page)
                if (bestMatchLevel < 1) { bestMatch = link; bestMatchLevel = 1; }
            } else if (!linkHashPart && !currentHash) { // Path match, no hashes involved
                if (bestMatchLevel < 0) { bestMatch = link; bestMatchLevel = 0; }
            }
        }
    });

    if (bestMatch) {
        console.log("setActiveLink: Best match found:", bestMatch.href, "Level:", bestMatchLevel);
        bestMatch.classList.add('active-link');
        activateParentDropdown(bestMatch);
    } else {
        // Fallback for the repo's root page if currentPathname matches the basePath
        // (e.g., currentPathname is '/aljohnpolyglot/' or '/aljohnpolyglot')
        const repoRootPathForCompare = basePathToUse.endsWith('/') ? basePathToUse : basePathToUse + '/';
        const repoRootPathWithoutSlash = basePathToUse.endsWith('/') ? basePathToUse.slice(0, -1) : basePathToUse;

        if (currentPathname === repoRootPathForCompare || currentPathname === repoRootPathWithoutSlash || (currentPathname === '/' && basePathToUse === '/')) {
            // Try to find a link that points exactly to the repo root
            // Hrefs are already adjusted, so they include the basePath
            const rootLinkCandidates = [
                headerElementContext.querySelector(`a[href="${repoRootPathForCompare}"]`), // e.g. /aljohnpolyglot/
                headerElementContext.querySelector(`a[href="${repoRootPathForCompare}index.html"]`),
                (repoRootPathWithoutSlash !== repoRootPathForCompare) ? headerElementContext.querySelector(`a[href="${repoRootPathWithoutSlash}"]`) : null, // e.g. /aljohnpolyglot
                headerElementContext.querySelector(`a[href="/"]`) // For true root on local dev
            ].filter(Boolean); // Remove nulls

            for (const candidate of rootLinkCandidates) {
                if (candidate && !candidate.getAttribute('href').includes('#')) {
                    candidate.classList.add('active-link');
                    activateParentDropdown(candidate);
                    console.log("setActiveLink: Applied active class to a root page link (fallback):", candidate.href);
                    break;
                }
            }
        } else {
           console.log("setActiveLink: No suitable link found to activate for current path:", currentPathname);
        }
    }
    console.log("setActiveLink: Link highlighting process complete.");
}

function activateParentDropdown(linkElement) {
    const dropdownContent = linkElement.closest('.dropdown-content');
    if (dropdownContent) {
        const dropbtn = dropdownContent.previousElementSibling; // Should be the .dropbtn <a>
        if (dropbtn && (dropbtn.classList.contains('dropbtn') || dropbtn.tagName === 'A')) {
            dropbtn.classList.add('active-link');
        }
    }
}