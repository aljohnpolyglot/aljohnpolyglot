// js/footer-loader.js
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
        const finalTemplatePath = templatePath.replace(/\/\//g, '/');

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
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data.trim();
                    const footerElement = tempDiv.querySelector('footer'); // Use querySelector

                    if (!footerElement) {
                        throw new Error("Loaded footer template does not contain a <footer> element.");
                    }

                    footerPlaceholder.parentNode.replaceChild(footerElement, footerPlaceholder);
                    console.log("Footer Loader: HTML injected successfully.");

                    // Ensure adjustLinksForBasePath is available (defined in navbar-loader.js or globally)
                    if (typeof adjustLinksForBasePath === 'function') {
                        console.log("Footer Loader: Calling adjustLinksForBasePath for footer...");
                        adjustLinksForBasePath(footerElement, siteBasePath);
                        console.log("Footer Loader: adjustLinksForBasePath for footer finished.");
                    } else {
                        console.warn("Footer Loader: adjustLinksForBasePath function not found. Links in footer might not be adjusted.");
                    }


                    if (typeof initializeFooterScripts === 'function') {
                         console.log("Footer Loader: Calling initializeFooterScripts...");
                        initializeFooterScripts();
                         console.log("Footer Loader: initializeFooterScripts finished.");
                    }
                 } catch (injectionError) {
                     console.error("Footer Loader: Error during HTML injection or subsequent script initialization:", injectionError);
                     const targetPlaceholder = document.querySelector('footer#main-footer-placeholder') || document.querySelector('footer') || footerPlaceholder;
                     if(targetPlaceholder) targetPlaceholder.innerHTML = '<p style="color:red; text-align:center; padding: 10px;">JS Error after loading footer data. See console.</p>';
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

function initializeFooterScripts() {
     const footerElement = document.querySelector('footer');
     if (footerElement) {
        const currentYearSpan = footerElement.querySelector('#current-year');
        if (currentYearSpan) {
            currentYearSpan.textContent = new Date().getFullYear();
        } else {
            console.warn("initializeFooterScripts: #current-year span not found in loaded footer.");
        }
        console.log("initializeFooterScripts: Copyright year updated.");
     } else {
         console.error("initializeFooterScripts: Injected footer element not found.");
     }
}