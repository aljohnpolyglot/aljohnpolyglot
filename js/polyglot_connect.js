// js/script.js

// --- Polyglot Connect Showcase Interactivity ---
document.addEventListener('DOMContentLoaded', () => {
    const showcaseSection = document.getElementById('connect-showcase');
    if (!showcaseSection) return; // Exit if the section isn't on the page

    const tabsContainer = showcaseSection.querySelector('.showcase-tabs');
    const tabs = showcaseSection.querySelectorAll('.showcase-tab');
    const images = showcaseSection.querySelectorAll('.showcase-image');
    const textContent = showcaseSection.querySelector('.viewer-text-content');

    // Function to set the active state
    function setActiveFeature(feature) {
        // Update tabs
        tabs.forEach(t => {
            if (t.dataset.feature === feature) {
                t.classList.add('active');
            } else {
                t.classList.remove('active');
            }
        });

        // Update images
        images.forEach(img => {
            if (img.dataset.feature === feature) {
                img.classList.add('active');
            } else {
                img.classList.remove('active');
            }
        });
        
        // Hide text content if any feature is active
        if (feature) {
            textContent.style.opacity = '0';
            textContent.style.pointerEvents = 'none';
        } else {
            textContent.style.opacity = '1';
            textContent.style.pointerEvents = 'auto';
        }
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const feature = tab.dataset.feature;
            setActiveFeature(feature);
        });
    });

    // Set initial state from the HTML (first tab is active)
    const initialActiveTab = tabsContainer.querySelector('.showcase-tab.active');
    if (initialActiveTab) {
        setActiveFeature(initialActiveTab.dataset.feature);
    } else {
        // If no tab is active by default, show the text content
        setActiveFeature(null);
    }
});