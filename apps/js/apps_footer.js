console.log("footer-loader.js: Script start. Relies on global 'siteBasePath'.");

document.addEventListener('DOMContentLoaded', function() {
    console.log("footer-loader.js: DOMContentLoaded event fired.");

    if (typeof siteBasePath === 'undefined') {
        console.error("Footer Loader: CRITICAL - global 'siteBasePath' is not defined. Footer cannot load correctly.");
        const errPlaceholder = document.getElementById('main-footer-placeholder');
        if (errPlaceholder) errPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding:10px;">Error: Site configuration missing (siteBasePath). Footer cannot load.</p>';
        return;
    }
    console.log("Footer Loader: Using global siteBasePath:", siteBasePath);

    const footerPlaceholder = document.getElementById('main-footer-placeholder');

    if (footerPlaceholder) {
         console.log("footer-loader.js: Found #main-footer-placeholder");

        let templatePath = siteBasePath + 'templates/footer.html';
        const finalTemplatePath = templatePath.replace(/\/\//g, '/'); // Normalize path

        console.log(`Footer Loader: Attempting to fetch template from: ${finalTemplatePath}`);

        fetch(finalTemplatePath)
            .then(response => {
                 console.log(`Footer Loader: Fetch response received. Status: ${response.status}`);
                if (!response.ok) {
                     console.error(`Footer Loader: Fetch failed for ${response.url}`);
                     footerPlaceholder.innerHTML = `<p style="color:red; text-align:center; padding: 10px;">Error loading footer data (Status: ${response.status}). Check console and path: ${response.url}</p>`;
                    throw new Error(`HTTP error! status: ${response.status} while fetching ${response.url}`);
                }
                 console.log("Footer Loader: Fetch successful, getting text...");
                return response.text();
            })
            .then(data => {
                 console.log("Footer Loader: Template text received. Injecting HTML...");
                 try {
                    // MODIFIED INJECTION: Inject HTML content into the placeholder
                    footerPlaceholder.innerHTML = data.trim();
                    // Get a reference to the actual <footer> element from the injected template
                    const footerElement = footerPlaceholder.querySelector('footer');

                    if (!footerElement) {
                        throw new Error("Loaded footer template does not contain a <footer> element after injection.");
                    }
                    // No longer replacing the placeholder.

                    console.log("Footer Loader: HTML injected successfully.");

                    // Ensure adjustLinksForBasePath is available (defined in navbar-loader.js or globally)
                    if (typeof adjustLinksForBasePath === 'function') {
                        console.log("Footer Loader: Calling adjustLinksForBasePath for footer...");
                        adjustLinksForBasePath(footerElement, siteBasePath); // Pass the injected footerElement
                        console.log("Footer Loader: adjustLinksForBasePath for footer finished.");
                    } else {
                        console.warn("Footer Loader: adjustLinksForBasePath function not found. Links in footer might not be adjusted.");
                    }


                    if (typeof initializeFooterScripts === 'function') {
                         console.log("Footer Loader: Calling initializeFooterScripts...");
                        initializeFooterScripts(footerElement); // Pass the injected footerElement
                         console.log("Footer Loader: initializeFooterScripts finished.");
                    }
                 } catch (injectionError) {
                     console.error("Footer Loader: Error during HTML injection or subsequent script initialization:", injectionError);
                     const targetEl = footerPlaceholder.querySelector('footer') || footerPlaceholder;
                     if(targetEl) targetEl.innerHTML = '<p style="color:red; text-align:center; padding: 10px;">JS Error after loading footer data. See console.</p>';
                 }
            })
            .catch(error => {
                console.error('Error loading footer (fetch or processing):', error);
                if (footerPlaceholder && !footerPlaceholder.innerHTML.includes('Error loading')) {
                    try { footerPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px;">Error loading footer data. See console.</p>'; } catch(e) {}
                }
            });
    } else {
       console.warn('Footer Loader: #main-footer-placeholder NOT FOUND on this page.');
    }
});

function initializeFooterScripts(footerElementContext) {
    if (!footerElementContext) {
        console.error("initializeFooterScripts: Footer element context not provided.");
        return;
    }
    const currentYearSpan = footerElementContext.querySelector('#current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    } else {
        console.warn("initializeFooterScripts: #current-year span not found in loaded footer.");
    }
    console.log("initializeFooterScripts: Copyright year updated for specific footer.");
}