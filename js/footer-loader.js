// js/footer-loader.js - CORRECTED FETCH PATHS
document.addEventListener('DOMContentLoaded', function() {
    const footerPlaceholder = document.getElementById('main-footer-placeholder');
    if (footerPlaceholder) {

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
            templatePathRelativeToJs = '../templates/footer.html'; // Path from js/ up to root, then down to templates/
        } else if (depth >= 1) { // Any subdirectory HTML page (Level 1, 2, etc.)
            templatePathRelativeToJs = '../templates/level2/footer.html'; // Path from js/ up to root, then down to templates/level2/
        } else {
            console.error(`Footer Loader: Unexpected depth calculated: ${depth}. Cannot determine template.`);
             if (footerPlaceholder) footerPlaceholder.innerHTML = '<p>Error</p>';
            return; // Stop
        }
        // --- End Template Path Choice ---

        console.log(`Footer Loader: HTML Depth ${depth}, Fetching template: ${templatePathRelativeToJs} (relative FROM JS folder)`);

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
                footerPlaceholder.outerHTML = data;
                initializeFooterScripts();
            })
            .catch(error => {
                console.error('Error loading footer:', error);
                if (footerPlaceholder) footerPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px;">Error loading footer.</p>';
            });
    } else {
       // console.warn('Footer placeholder #main-footer-placeholder not found on this page.');
    }
});

function initializeFooterScripts() {
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    // Add any other footer-specific JavaScript initializations here
}