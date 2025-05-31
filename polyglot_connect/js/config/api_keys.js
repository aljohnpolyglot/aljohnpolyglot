// js/config/api_keys.js

window.GEMINI_API_KEY = 'AIzaSyDfJspAjl93a5PnPENic7AG8yRT9vwRjh4'; // Your API key

if (window.GEMINI_API_KEY === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE') {
    console.warn('config/api_keys.js: GEMINI_API_KEY is still set to the placeholder. Please replace it with your actual key for the app to function.');
} else if (window.GEMINI_API_KEY === 'AIzaSyDfJspAjl93a5PnPENic7AG8yRT9vwRjh4') {
    console.log('config/api_keys.js loaded. GEMINI_API_KEY is set (using provided key).');
} else {
     console.log('config/api_keys.js loaded. GEMINI_API_KEY is set.');
}