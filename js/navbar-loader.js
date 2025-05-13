// js/navbar-loader.js
console.log("navbar-loader.js: Script start. Relies on global 'siteBasePath'.");

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
        const finalTemplatePath = templatePath.replace(/\/\//g, '/');

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
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data.trim();
                    const headerElement = tempDiv.querySelector('header'); // Use querySelector

                    if (!headerElement) {
                        throw new Error("Loaded navbar template does not contain a <header> element.");
                    }

                    navbarPlaceholder.parentNode.replaceChild(headerElement, navbarPlaceholder);
                    console.log("Navbar Loader: HTML injected successfully.");

                    console.log("Navbar Loader: Calling adjustLinksForBasePath...");
                    adjustLinksForBasePath(headerElement, siteBasePath);
                    console.log("Navbar Loader: adjustLinksForBasePath finished.");

                    console.log("Navbar Loader: Calling initializeNavbarScripts...");
                    initializeNavbarScripts();
                    console.log("Navbar Loader: initializeNavbarScripts finished.");

                    console.log("Navbar Loader: Calling setActiveLink...");
                    setActiveLink(siteBasePath);
                    console.log("Navbar Loader: setActiveLink finished.");

                } catch (injectionError) {
                    console.error("Navbar Loader: Error during HTML injection or subsequent script initialization:", injectionError);
                     const targetPlaceholder = document.querySelector('header#main-header-placeholder') || document.querySelector('header') || navbarPlaceholder;
                     if(targetPlaceholder) targetPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px; background: #fff;">JS Error after loading navigation data. See console.</p>';
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

function adjustLinksForBasePath(parentElement, basePathToUse) {
    console.log(`adjustLinksForBasePath: Using basePath: '${basePathToUse}' for element:`, parentElement);
    if (!parentElement) {
        console.error("adjustLinksForBasePath: Parent element is null, cannot adjust links.");
        return;
    }
    if (basePathToUse === '/' || !basePathToUse || basePathToUse.trim() === '') {
         console.log("adjustLinksForBasePath: Base path is root ('/'), no path prepending needed for links/images starting with '/'.");
         return;
    }
    const correctBasePath = basePathToUse.endsWith('/') ? basePathToUse : basePathToUse + '/';
    let adjustedLinks = 0;
    let adjustedImages = 0;

    parentElement.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach(link => {
        const originalHref = link.getAttribute('href');
        if (originalHref && !originalHref.startsWith(correctBasePath)) {
            const pathSegment = originalHref === '/' ? '' : originalHref.substring(1);
            const newHref = (correctBasePath + pathSegment).replace(/\/\//g, '/');
            link.setAttribute('href', newHref);
            adjustedLinks++;
        }
    });
    parentElement.querySelectorAll('img[src^="/"]:not([src^="//"])').forEach(img => {
        const originalSrc = img.getAttribute('src');
         if (originalSrc && !originalSrc.startsWith(correctBasePath)) {
            const pathSegment = originalSrc === '/' ? '' : originalSrc.substring(1);
            const newSrc = (correctBasePath + pathSegment).replace(/\/\//g, '/');
            img.setAttribute('src', newSrc);
            adjustedImages++;
         }
    });
    console.log(`adjustLinksForBasePath: Adjusted ${adjustedLinks} links and ${adjustedImages} images within`, parentElement);
}

function initializeNavbarScripts() {
    const headerElement = document.querySelector('header:not(#main-header-placeholder)');
    if (!headerElement) {
        console.error("initializeNavbarScripts: Injected header element not found.");
        return;
    }
    if (!window.navbarScrollListenerAdded) {
        window.addEventListener('scroll', () => {
             const currentHeader = document.querySelector('header:not(#main-header-placeholder)');
             if (currentHeader) currentHeader.classList.toggle('scrolled', window.scrollY > 50);
        });
        const currentHeaderInitial = document.querySelector('header:not(#main-header-placeholder)');
        if (currentHeaderInitial) currentHeaderInitial.classList.toggle('scrolled', window.scrollY > 50);
        window.navbarScrollListenerAdded = true;
    }
    const menuToggle = headerElement.querySelector('.menu-toggle');
    const navLinksUl = headerElement.querySelector('.nav-links');
    if (menuToggle && navLinksUl) {
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);
        newMenuToggle.addEventListener('click', () => {
            navLinksUl.classList.toggle('active');
            newMenuToggle.classList.toggle('active');
        });
        navLinksUl.querySelectorAll('a').forEach(link => {
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            newLink.addEventListener('click', (e) => {
                const isDropbtn = newLink.classList.contains('dropbtn');
                const isMobile = window.innerWidth <= 768;
                const href = newLink.getAttribute('href');
                const isToggleOnly = href === 'javascript:void(0)' || href === '#';
                if (isDropbtn && isMobile && isToggleOnly) return;
                if (navLinksUl.classList.contains('active')) {
                    navLinksUl.classList.remove('active');
                    const currentToggle = headerElement.querySelector('.menu-toggle.active');
                    if(currentToggle) currentToggle.classList.remove('active');
                }
            });
        });
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
    const internalNavLinks = headerElement.querySelectorAll('.nav-links a[href*="#"]');
    internalNavLinks.forEach(link => {
        const newLink = link.cloneNode(true);
        link.parentNode.replaceChild(newLink, link);
        newLink.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            const hashIndex = href.lastIndexOf('#');
            if (hashIndex !== -1) {
                 const targetId = href.substring(hashIndex);
                 let currentPathForCompare = window.location.pathname;
                 if (typeof siteBasePath !== 'undefined' && siteBasePath !== '/') { // Check if siteBasePath is defined and not root
                    // If on GitHub pages, currentPathForCompare already includes the repo name
                 } else {
                    // For local server (siteBasePath = '/'), no special prefix needed for comparison
                 }
                 if (currentPathForCompare.endsWith('/index.html')) currentPathForCompare = currentPathForCompare.slice(0, -10);
                 if (currentPathForCompare.length > 1 && currentPathForCompare.endsWith('/')) currentPathForCompare = currentPathForCompare.slice(0, -1);
                 if (currentPathForCompare === '' && (typeof siteBasePath === 'undefined' || siteBasePath === '/')) currentPathForCompare = '/';

                 const linkBasePathOnly = href.substring(0, hashIndex);
                 const isSamePage = linkBasePathOnly === "" ||
                                   linkBasePathOnly === currentPathForCompare ||
                                   currentPathForCompare.endsWith(linkBasePathOnly);

                 if (targetId.length > 1 && isSamePage) {
                     const targetElement = document.querySelector(targetId);
                     if (targetElement) {
                        e.preventDefault();
                        const headerOffset = headerElement.offsetHeight;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                     }
                 }
            }
        });
    });
    console.log("initializeNavbarScripts: Sticky, Mobile Nav, Smooth Scroll for nav initialized.");
}

function handleDropdownClick(clickedDropbtn, event, headerElement) {
    const isMobile = window.innerWidth <= 768;
    const dropdownContent = clickedDropbtn.nextElementSibling;
    if (isMobile && dropdownContent && dropdownContent.classList.contains('dropdown-content')) {
        event.preventDefault();
        const isActive = dropdownContent.classList.contains('show-mobile');
        headerElement.querySelectorAll('.nav-links .dropdown-content.show-mobile').forEach(openDropdown => {
            if (openDropdown !== dropdownContent) {
                openDropdown.classList.remove('show-mobile');
                openDropdown.style.maxHeight = null;
                const otherBtn = openDropdown.previousElementSibling;
                if(otherBtn) otherBtn.classList.remove('mobile-dropdown-open');
            }
        });
        dropdownContent.classList.toggle('show-mobile', !isActive);
        clickedDropbtn.classList.toggle('mobile-dropdown-open', !isActive);
        dropdownContent.style.maxHeight = !isActive ? dropdownContent.scrollHeight + "px" : null;
    }
}

function setActiveLink(basePathToUse) {
    const headerElement = document.querySelector('header:not(#main-header-placeholder)');
    if (!headerElement) { console.log("setActiveLink: Injected header not found."); return; }

    const urlObject = new URL(window.location.href);
    let currentPathname = urlObject.pathname; // This will include repo name on GH Pages
    const currentHash = urlObject.hash;

    if (currentPathname.endsWith('/index.html')) {
        currentPathname = currentPathname.substring(0, currentPathname.length - 10);
    }
    if (currentPathname.length > 1 && currentPathname.endsWith('/') && currentPathname !== basePathToUse) {
        currentPathname = currentPathname.substring(0, currentPathname.length - 1);
    }
    if (currentPathname === '' && basePathToUse === '/') currentPathname = '/';
    // If currentPathname is like '/aljohnpolyglot' (basePath without trailing slash), it's the repo root.
    if (basePathToUse !== '/' && basePathToUse.endsWith('/') && currentPathname === basePathToUse.slice(0, -1)) {
        // This is fine, currentPathname represents the root of the repo.
    }

    console.log(`setActiveLink: Using basePath: '${basePathToUse}'. Normalized Current Path: '${currentPathname}', Hash: '${currentHash}'`);

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
        if (!linkHrefAttr || linkHrefAttr.startsWith('http') || linkHrefAttr === '#' || linkHrefAttr.startsWith('javascript:')) return;

        let normalizedLinkHref = linkHrefAttr; // Assumes adjustLinksForBasePath has prefixed it
        if (normalizedLinkHref.endsWith('/index.html')) {
            normalizedLinkHref = normalizedLinkHref.substring(0, normalizedLinkHref.length - 10);
        }
        if (normalizedLinkHref.length > 1 && normalizedLinkHref.endsWith('/') && normalizedLinkHref !== basePathToUse) {
            normalizedLinkHref = normalizedLinkHref.substring(0, normalizedLinkHref.length - 1);
        }
        // Handle link to absolute root when basePathToUse is also absolute root
        if (normalizedLinkHref === '' && basePathToUse === '/') normalizedLinkHref = '/';
        // Handle case where link href is just the base path (e.g., '/aljohnpolyglot')
        if (basePathToUse !== '/' && basePathToUse.endsWith('/') && normalizedLinkHref === basePathToUse.slice(0, -1)) {
             // Link is to the root of the repo, it's fine
        }


        const linkPathPart = normalizedLinkHref.split('#')[0];
        const linkHashPart = normalizedLinkHref.includes('#') ? '#' + normalizedLinkHref.split('#')[1] : '';

        if (linkPathPart === currentPathname) {
            if (linkHashPart === currentHash) {
                if (bestMatchLevel < 2) { bestMatch = link; bestMatchLevel = 2; }
            } else if (currentHash && !linkHashPart) {
                if (bestMatchLevel < 1) { bestMatch = link; bestMatchLevel = 1; }
            } else if (!currentHash && !linkHashPart) {
                 if (bestMatchLevel < 0) { bestMatch = link; bestMatchLevel = 0; }
            }
        }
    });

    if (bestMatch) {
        bestMatch.classList.add('active-link');
        activateParentDropdown(bestMatch);
    } else {
        // Fallback for the repo's root page if currentPathname matches the basePath (or basePath without trailing slash)
        const repoRootPath = (basePathToUse !== '/' && basePathToUse.endsWith('/')) ? basePathToUse.slice(0, -1) : basePathToUse;
        if (currentPathname === repoRootPath) {
            // Try to find a link that points exactly to the repo root (after potential adjustments)
            const rootLinkCandidate1 = headerElement.querySelector(`a[href="${basePathToUse}"]`); // e.g. /aljohnpolyglot/
            const rootLinkCandidate2 = headerElement.querySelector(`a[href="${basePathToUse}index.html"]`);
            const rootLinkCandidate3 = (basePathToUse !== '/') ? headerElement.querySelector(`a[href="${basePathToUse.slice(0,-1)}"]`) : null; // e.g. /aljohnpolyglot

            const candidates = [rootLinkCandidate1, rootLinkCandidate2, rootLinkCandidate3].filter(Boolean);
            for (const candidate of candidates) {
                if (candidate && !candidate.getAttribute('href').includes('#')) {
                    candidate.classList.add('active-link');
                    activateParentDropdown(candidate);
                    console.log("setActiveLink: Applied active class to a root page link:", candidate.href);
                    break; // Activate first valid root link found
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
        const dropbtn = dropdownContent.previousElementSibling;
        if (dropbtn && dropbtn.classList.contains('dropbtn')) {
            dropbtn.classList.add('active-link');
        }
    }
}