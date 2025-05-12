// WEBSITE/js/footer-loader.js
document.addEventListener('DOMContentLoaded', function() {
    const footerPlaceholder = document.getElementById('main-footer-placeholder');
    if (footerPlaceholder) {
        fetch('/templates/footer.html') // Root-relative path
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                footerPlaceholder.outerHTML = data; // Replace the placeholder with the footer HTML
                initializeFooterScripts(); // Call any scripts needed for the footer
            })
            .catch(error => console.error('Error loading footer:', error));
    } else {
        console.warn('Footer placeholder #main-footer-placeholder not found on this page.');
    }
});

function initializeFooterScripts() {
    // Set current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // Add any other footer-specific JavaScript initializations here
    // For example, if your footer had interactive elements.
}