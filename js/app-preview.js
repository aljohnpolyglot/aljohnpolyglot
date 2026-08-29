// Keep the small homepage toolkit resilient when an asset is missing or served incorrectly.
(function initializeAppPreviewLogos() {
    const fallbackAsset = document.getElementById('app-logo-fallback-asset');
    const defaultFallbackSrc = fallbackAsset?.href || 'images/apps/app-fallback.svg';
    const logoSelector = '.app-preview-logo-index, .resilient-logo';

    function useFallback(image) {
        if (image.dataset.fallbackApplied === 'true') return;

        image.dataset.fallbackApplied = 'true';
        image.classList.add('app-logo-fallback');
        image.alt = `${image.dataset.appName || 'Application'} logo unavailable`;
        image.src = image.dataset.fallbackSrc || defaultFallbackSrc;
    }

    document.querySelectorAll(logoSelector).forEach((image) => {
        image.addEventListener('error', () => useFallback(image));

        // Covers cached 404s that complete before the error listener is attached.
        if (image.complete && image.naturalWidth === 0) {
            useFallback(image);
        }
    });
})();
