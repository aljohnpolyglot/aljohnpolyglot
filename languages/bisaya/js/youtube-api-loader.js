// js/youtube-api-loader.js
// This script defines the global callback function required by the YouTube Iframe API.
// It should be loaded BEFORE the YouTube Iframe API script itself (<script src="https://www.youtube.com/iframe_api"></script>).

/**
 * This function is called by the YouTube Iframe API when it's fully loaded.
 * It's the central point for creating YouTube player instances.
 */
function onYouTubeIframeAPIReady() {
    console.log("Global onYouTubeIframeAPIReady has been called.");

    // --- Initialize Music Section's Featured Player ---
    // This part ensures the music section's player is created only once the API is ready.
    if (typeof initializeMusicSectionPlayer === 'function') { // Check if this function exists (defined in music-loader.js)
        initializeMusicSectionPlayer(); // Call the specific player creation logic
    } else {
        console.error("onYouTubeIframeAPIReady: 'initializeMusicSectionPlayer' function not found. Music featured player might not work.");
    }
    
    // If you had other YouTube players on other sections, you would call their respective
    // player initialization functions here as well.
}

// Ensure the necessary global variables are accessible to this file and other modules.
// These are assumed to be declared in bisaya-music-loader.js, but need to be global for YT API.
// A common pattern is to put an empty definition here if they are only initialized in other modules.
// Alternatively, music-loader.js could be designed to export the player.

// Let's assume musicFeaturedVideoIframeEl, musicPlayer, musicFeaturedArtistImgEl
// are global and set by bisaya-music-loader.js.

// We need a way for music-loader to communicate its player setup to this file.
// The best approach is to define the player creation logic *in* music-loader.js,
// but have it *callable* by this global function.
// So, music-loader.js will expose `initializeMusicSectionPlayer` to `window`.

// This is an internal function that will be called by the global onYouTubeIframeAPIReady.
// It will handle the creation and event binding for the music featured player.
function initializeMusicSectionPlayerAndLogic() {
    // These variables must be global (defined outside function or attached to window by music-loader.js)
    // for YT.Player to work correctly if they are referenced by it directly.
    if (!musicFeaturedVideoIframeEl || typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        console.error("MUSIC LOADER PLAYER INIT: Missing iframe element or YT API not available. Cannot create player.");
        return;
    }

    // Create the player instance for the featured video iframe
    // This is the actual creation point for the player object.
    musicPlayer = new YT.Player(musicFeaturedVideoIframeEl, { 
        videoId: '', // Initial video will be loaded by loadFeaturedSong (loadVideoById)
        playerVars: {
            'controls': 1, 
            'rel': 0, 
            'modestbranding': 1, 
            'autoplay': 0, 
            'enablejsapi': 1 
        },
        events: {
            'onReady': (event) => {
                console.log("YouTube Player is READY.");
                // Ensure loadFeaturedSong is called *after* player is ready.
                // This call is now handled by music-loader.js's onYouTubeIframeAPIReady wrapper.
                // The onReady logic can call a function provided by music-loader.js.
                if (window.musicPlayerOnReadyCallback) {
                    window.musicPlayerOnReadyCallback(event);
                }
            },
            'onStateChange': (event) => {
                if (window.musicPlayerOnStateChangeCallback) {
                    window.musicPlayerOnStateChangeCallback(event);
                }
            }
        }
    });
}

// Expose the player initialization function to the global scope so onYouTubeIframeAPIReady can call it.
window.initializeMusicSectionPlayer = initializeMusicSectionPlayerAndLogic;