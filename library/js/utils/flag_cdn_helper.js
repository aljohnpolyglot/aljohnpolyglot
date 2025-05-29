// js/utils/flag_cdn_helper.js

/**
 * Generates an <img> tag for a country flag using flagcdn.com.
 * @param {string} countryCode - The 2-letter ISO 3166-1 alpha-2 country code (e.g., 'fr', 'us').
 * @param {string} altText - The alt text for the image.
 * @param {string} [width='w20'] - The desired width (e.g., 'w20', 'w40', 'w80'). FlagCDN uses specific width parameters.
 * @param {string[]} [classes=[]] - Array of CSS classes to add to the img element.
 * @returns {HTMLImageElement} The created <img> element.
 */
function createFlagImg(countryCode, altText, width = 'w20', classes = []) {
    if (!countryCode) return null;
    const normalizedCode = countryCode.toLowerCase();
    const src = `https://flagcdn.com/${width}/${normalizedCode}.png`;
    const imgClasses = ['flag-icon', ...classes]; // Ensure 'flag-icon' is always there
    return createElement('img', imgClasses, { src: src, alt: altText });
}

// Mapping language codes to country codes for flags (can be expanded)
// This is a simplification; some languages are spoken in many countries.
// Choose a representative flag or allow more complex mapping if needed.
const languageToFlagCode = {
    "es": "es", // Spain
    "fr": "fr", // France
    "it": "it", // Italy
    "pt": "br", // Brazil (for Portuguese)
    "de": "de", // Germany
    "ru": "ru", // Russia
    "sv": "se", // Sweden
    "id": "id"  // Indonesia
    // Add more as needed
};