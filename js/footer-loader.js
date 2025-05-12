// js/footer-loader.js - Fetches root template & runs footer scripts
console.log("footer-loader.js: Script start");

document.addEventListener('DOMContentLoaded', function() {
    console.log("footer-loader.js: DOMContentLoaded event fired");
    const footerPlaceholder = document.getElementById('main-footer-placeholder');
    if (footerPlaceholder) {
         console.log("footer-loader.js: Found #main-footer-placeholder");
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
                    if (typeof initializeFooterScripts === 'function') {
                         console.log("Footer Loader: Calling initializeFooterScripts...");
                        initializeFooterScripts(); // This will now update the year
                         console.log("Footer Loader: initializeFooterScripts finished.");
                    }
                 } catch (injectionError) {
                     console.error("Footer Loader: Error during HTML injection or subsequent script initialization:", injectionError);
                     if(footerPlaceholder) footerPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px;">JS Error after loading footer data.</p>';
                 }
            })
            .catch(error => {
                console.error('Error loading footer (fetch or initial processing):', error);
                if (footerPlaceholder) { try { footerPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px;">Error loading footer data.</p>'; } catch(e) {} }
            });
    } else {
       console.warn('Footer Loader: #main-footer-placeholder NOT FOUND on this page.');
    }
});

// FOOTER SPECIFIC SCRIPTS (Moved from script.js)
function initializeFooterScripts() {
    // --- Update Copyright Year (from script.js) ---
    const currentYearSpan = document.getElementById('current-year'); // Query *after* injection
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("initializeFooterScripts: #current-year span not found in loaded footer.");
    }
    console.log("initializeFooterScripts: Copyright year updated.");
}