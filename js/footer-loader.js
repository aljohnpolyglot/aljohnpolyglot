// js/footer-loader.js - DEBUG VERSION with more logging
console.log("footer-loader.js: Script start");

document.addEventListener('DOMContentLoaded', function() {
    console.log("footer-loader.js: DOMContentLoaded event fired");
    const footerPlaceholder = document.getElementById('main-footer-placeholder');
    if (footerPlaceholder) {
         console.log("footer-loader.js: Found #main-footer-placeholder");

        // Path relative FROM JS FILE to the single root footer template
        const templatePathRelativeToJs = '../templates/footer.html';
        console.log(`Footer Loader: Attempting to fetch template from: ${templatePathRelativeToJs}`);

        fetch(templatePathRelativeToJs)
            .then(response => {
                 console.log(`Footer Loader: Fetch response received. Status: ${response.status}`);
                if (!response.ok) {
                     console.error(`Footer Loader: Fetch failed for ${response.url}`);
                    throw new Error(`HTTP error! status: ${response.status} while fetching ${response.url}`);
                }
                 console.log("Footer Loader: Fetch successful, getting text...");
                return response.text();
            })
            .then(data => {
                 console.log("Footer Loader: Template text received. Injecting HTML...");
                 try {
                    footerPlaceholder.outerHTML = data;
                     console.log("Footer Loader: HTML injected successfully.");
                    // NOTE: No path adjustments needed for footer usually
                    if (typeof initializeFooterScripts === 'function') {
                         console.log("Footer Loader: Calling initializeFooterScripts...");
                        initializeFooterScripts();
                         console.log("Footer Loader: initializeFooterScripts finished.");
                    }
                 } catch (injectionError) {
                     console.error("Footer Loader: Error during HTML injection or subsequent script initialization:", injectionError);
                     if(footerPlaceholder) footerPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px;">JS Error after loading footer data.</p>';
                 }
            })
            .catch(error => {
                // Catches fetch or initial processing errors
                console.error('Error loading footer (fetch or initial processing):', error);
                if (footerPlaceholder) {
                    try {
                        footerPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px;">Error loading footer data.</p>';
                    } catch(e) {}
                }
            });
    } else {
       console.warn('Footer Loader: #main-footer-placeholder NOT FOUND on this page.');
    }
});

// Make sure this function exists if your footer needs JS
function initializeFooterScripts() {
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
    // console.log("initializeFooterScripts: Year updated."); // Add log
}