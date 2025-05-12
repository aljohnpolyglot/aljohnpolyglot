// js/navbar-loader.js - CORRECTED FETCH PATHS
document.addEventListener('DOMContentLoaded', function() {
    const navbarPlaceholder = document.getElementById('main-header-placeholder');
    if (navbarPlaceholder) {

        // --- Determine Directory Depth of the HTML Page ---
        const currentPagePath = window.location.pathname;
        let depth = 0;
        let effectivePath = currentPagePath;
        if (effectivePath.endsWith('/index.html')) {
             effectivePath = effectivePath.substring(0, effectivePath.lastIndexOf('/index.html'));
        }
        if (effectivePath === '/') { effectivePath = ''; }
        if (effectivePath && effectivePath !== '/') {
            const pathSegments = effectivePath.split('/').filter(segment => segment.length > 0);
            depth = pathSegments.length;
        }
        // --- End Depth Determination ---

        // --- Choose FIXED Template Path Relative to *THIS JS FILE* ---
        let templatePathRelativeToJs = '';
        if (depth === 0) { // Root level HTML page
            templatePathRelativeToJs = '../templates/navbar.html'; // Path from js/ up to root, then down to templates/
        } else if (depth >= 1) { // Any subdirectory HTML page (Level 1, 2, etc.)
            templatePathRelativeToJs = '../templates/level2/navbar.html'; // Path from js/ up to root, then down to templates/level2/
        } else {
            console.error(`Navbar Loader: Unexpected depth calculated: ${depth}. Cannot determine template.`);
             if (navbarPlaceholder) navbarPlaceholder.innerHTML = '<p>Error</p>';
            return; // Stop
        }
        // --- End Template Path Choice ---

        console.log(`Navbar Loader: HTML Depth ${depth}, Fetching template: ${templatePathRelativeToJs} (relative FROM JS folder)`);

        // --- Fetch the chosen template USING THE CORRECT RELATIVE PATH ---
        fetch(templatePathRelativeToJs)
            .then(response => {
                if (!response.ok) {
                    // Log the path that failed clearly
                    throw new Error(`HTTP error! status: ${response.status} while fetching ${response.url}`);
                }
                return response.text();
            })
            .then(data => {
                navbarPlaceholder.outerHTML = data;
                initializeNavbarScripts();
                setActiveLink();
            })
            .catch(error => {
                console.error('Error loading navbar:', error);
                if (navbarPlaceholder) navbarPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px;">Error loading navigation.</p>';
            });

    } else {
        // console.warn('Navbar placeholder #main-header-placeholder not found on this page.');
    }
});


// --- Navbar Interaction & Active Link Functions ---
// (These should be the same robust functions from the previous answer)

function initializeNavbarScripts() {
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
    handleScroll();
}

function handleDropdownClick(clickedDropbtn, event, headerElement) {
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
    const headerElement = document.querySelector('header');
     if (headerElement) {
            headerElement.classList.toggle('scrolled', window.scrollY > 50);
     }
}

function setActiveLink() {
    const headerElement = document.querySelector('header');
    if (!headerElement) return;
    const currentFullUrl = window.location.href;
    const urlObject = new URL(currentFullUrl);
    const currentPathname = urlObject.pathname;
    const currentHash = urlObject.hash;
    let normalizedCurrentPath = currentPathname.endsWith('/') && currentPathname !== '/' ? currentPathname.slice(0, -1) : currentPathname;
    normalizedCurrentPath = normalizedCurrentPath.endsWith('/index.html') ? normalizedCurrentPath.slice(0, -10) : normalizedCurrentPath;
    if (normalizedCurrentPath === '') normalizedCurrentPath = '/';
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
        const linkAbsoluteUrl = new URL(linkHrefAttr, window.location.href).href;
        const linkUrlObject = new URL(linkAbsoluteUrl);
        let linkPathname = linkUrlObject.pathname;
        const linkHashPart = linkUrlObject.hash;
        linkPathname = linkPathname.endsWith('/') && linkPathname !== '/' ? linkPathname.slice(0, -1) : linkPathname;
        linkPathname = linkPathname.endsWith('/index.html') ? linkPathname.slice(0, -10) : linkPathname;
        if (linkPathname === '') linkPathname = '/';
        if (linkPathname === normalizedCurrentPath) {
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
    } else if (normalizedCurrentPath === '/') {
        const rootLink = headerElement.querySelector('a[href="/"], a[href="/index.html"]');
         if (rootLink) { rootLink.classList.add('active-link'); }
    }
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