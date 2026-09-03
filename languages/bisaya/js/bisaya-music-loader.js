// js/bisaya-music-loader.js - Handles the Bisaya Music Section

// --- GLOBAL VARIABLES FOR YOUTUBE IFRAME API AND DOM REFERENCES ---
let musicPlayer; 
let musicFeaturedVideoIframeEl; 
let musicFeaturedArtistImgEl; 
let musicFeaturedPlayerAndInfoContainerEl;

// --- GLOBAL STATE VARIABLES for Featured Song Rotation ---
let allSongsWithArtists = []; 
let currentFeaturedSongIndex = 0; // MOVED TO MODULE SCOPE
let rotationInterval = null; 
let userInteractedWithPlayer = false; 

// --- Main Initialization Function for the Music Section ---
function initializeMusicSection() {
    console.log("BISAYA MUSIC LOADER: Initializing music section (Correcting Global State Scope - currentFeaturedSongIndex).");

    // --- DOM Element Selectors (ASSIGN TO MODULE-SCOPED VARIABLES) ---
    musicFeaturedVideoIframeEl = document.getElementById('music-featured-video-iframe'); 
    musicFeaturedArtistImgEl = document.getElementById('music-featured-artist-img'); 
    musicFeaturedPlayerAndInfoContainerEl = musicFeaturedVideoIframeEl ? musicFeaturedVideoIframeEl.closest('.music-featured-player-and-info') : null;

    // Local constants for other elements
    const featuredSongTitleEl = document.getElementById('music-featured-song-title');
    const featuredArtistNameEl = document.getElementById('music-featured-artist-name');
    const featuredSpotifyLinkEl = document.getElementById('music-featured-spotify-link');
    const artistsScrollWrapper = document.getElementById('music-artists-scroll-wrapper');
    const musicSectionEl = document.getElementById('bisaya-music-section'); 


    // --- Essential HTML Element & Data Checks ---
    if (!musicFeaturedVideoIframeEl || !featuredSongTitleEl || !featuredArtistNameEl || !featuredSpotifyLinkEl || !artistsScrollWrapper || !musicFeaturedArtistImgEl || !musicFeaturedPlayerAndInfoContainerEl || !musicSectionEl) {
        console.error("BISAYA MUSIC LOADER ERROR: Essential HTML elements for music section are missing. Check HTML IDs/classes. Aborting.");
        if (musicSectionEl) musicSectionEl.innerHTML = "<p class='text-center full-width-message' style='color: red;'>ERROR: Music section elements missing.</p>";
        return;
    }
    if (typeof bisayaMusicArtists === 'undefined' || !Array.isArray(bisayaMusicArtists) || bisayaMusicArtists.length === 0) {
        console.warn("BISAYA MUSIC LOADER WARNING: 'bisayaMusicArtists' data array is not available or empty.");
        if (musicSectionEl) musicSectionEl.innerHTML = "<p class='text-center full-width-message'>Wala pay Bisaya nga kanta/artists.</p>";
        return;
    }

    // --- Populate allSongsWithArtists (Data Preparation) ---
    allSongsWithArtists = []; // Reset for fresh population
    bisayaMusicArtists.forEach(artist => {
        if (artist.bisayaSongs && Array.isArray(artist.bisayaSongs)) {
            artist.bisayaSongs.forEach(song => {
                allSongsWithArtists.push({
                    song: song, 
                    artistName: artist.name,
                    artistSpotifyLink: artist.spotifyLink,
                    artistCoverArt: artist.coverArt, 
                    artistLocation: artist.location,
                    artistLongDesc: artist.longDesc,
                    artistSocialLinks: artist.socialLinks
                });
            });
        }
    });

    if (allSongsWithArtists.length === 0) {
        console.warn("BISAYA MUSIC LOADER: No songs found in bisayaMusicArtists.bisayaSongs for rotation.");
        musicFeaturedVideoIframeEl.src = "about:blank"; 
        featuredSongTitleEl.textContent = "Wala pay Featured Song";
        featuredArtistNameEl.textContent = "Walay Artist Data";
        featuredSpotifyLinkEl.style.display = 'none';
        musicFeaturedArtistImgEl.src = "images/music/placeholder_artist.jpg"; 
        musicFeaturedArtistImgEl.classList.add('active'); 
        musicFeaturedVideoIframeEl.classList.remove('active'); 
        musicFeaturedPlayerAndInfoContainerEl.classList.remove('video-active'); 
        return; 
    }
    
    allSongsWithArtists.sort(() => Math.random() - 0.5); 
    currentFeaturedSongIndex = 0; // Reset index after shuffling for initial load

    // --- Helper Function: Get YouTube Video ID from URL/ID ---
    function getYouTubeVideoId(url) {
        if (!url || typeof url !== 'string') return null;
        const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
        const match = url.match(regExp);
        return (match && match[1]) ? match[1] : (url.length === 11 ? url : null);
    }

    function getYouTubeEmbedUrl(videoId, autoplay = 0) {
        const id = getYouTubeVideoId(videoId);
        if (!id) {
            console.warn("Invalid YouTube video ID provided for embed:", videoId);
            return "about:blank";
        }
        return `https://www.youtube.com/embed/${id}?rel=0&autoplay=${autoplay}&modestbranding=1&enablejsapi=1&controls=1`; 
    }

    // --- Core Function: Load and Display Featured Song ---
    function loadFeaturedSong() { 
        if (allSongsWithArtists.length === 0) { return; } 

        const featuredItem = allSongsWithArtists[currentFeaturedSongIndex]; // Uses module-scoped variable
        const song = featuredItem.song;
        const artist = featuredItem.artistName;
        const collaborator = featuredItem.collaborator;
        const spotifyLink = featuredItem.artistSpotifyLink;
        const artistVisual = featuredItem.artistCoverArt; 
        const videoId = getYouTubeVideoId(song.videoId);

        musicFeaturedArtistImgEl.src = artistVisual || "images/music/placeholder_artist.jpg";
        musicFeaturedArtistImgEl.alt = artist || "Featured Artist";

        featuredSongTitleEl.textContent = song.title || "Unknown Song";
        featuredArtistNameEl.textContent = artist + (collaborator ? ` (feat. ${collaborator})` : '');
        
        if (spotifyLink) {
            featuredSpotifyLinkEl.href = spotifyLink;
            featuredSpotifyLinkEl.style.display = 'inline-flex'; 
        } else {
            featuredSpotifyLinkEl.style.display = 'none';
        }

        if (musicPlayer && videoId) {
            musicPlayer.loadVideoById(videoId);
            musicFeaturedArtistImgEl.classList.add('active');
            musicFeaturedVideoIframeEl.classList.remove('active');
            musicFeaturedPlayerAndInfoContainerEl.classList.remove('video-active');
        } else if (videoId) { 
            musicFeaturedVideoIframeEl.src = getYouTubeEmbedUrl(videoId, 0);
            musicFeaturedArtistImgEl.classList.add('active');
            musicFeaturedVideoIframeEl.classList.remove('active');
            musicFeaturedPlayerAndInfoContainerEl.classList.remove('video-active');
        } else { 
            musicFeaturedVideoIframeEl.src = "about:blank";
            musicFeaturedArtistImgEl.classList.add('active');
            musicFeaturedVideoIframeEl.classList.remove('active');
            musicFeaturedPlayerAndInfoContainerEl.classList.remove('video-active');
            console.warn(`BISAYA MUSIC LOADER: No valid video ID for song "${song.title || 'Unknown'}" or artist "${artist}".`);
        }
        // Update module-scoped currentFeaturedSongIndex
        currentFeaturedSongIndex = (currentFeaturedSongIndex + 1) % allSongsWithArtists.length; 
    }


    // --- Callbacks for YouTube Iframe API Events ---
    window.musicPlayerOnReadyCallback = (event) => {
        console.log("Music Player is READY. Loading first featured song via callback.");
        loadFeaturedSong();
        if (allSongsWithArtists.length > 1 && !userInteractedWithPlayer) {
            if (rotationInterval) clearInterval(rotationInterval);
            rotationInterval = setInterval(() => {
                if (!userInteractedWithPlayer) { loadFeaturedSong(); }
            }, 15000); 
            console.log("MUSIC LOADER: Automatic song rotation started (onReady callback).");
        }
    };

    window.musicPlayerOnStateChangeCallback = (event) => {
        if (event.data === YT.PlayerState.PLAYING) {
            userInteractedWithPlayer = true; 
            if (rotationInterval) { clearInterval(rotationInterval); rotationInterval = null; }
            musicFeaturedVideoIframeEl.classList.add('active');
            musicFeaturedArtistImgEl.classList.remove('active'); 
            musicFeaturedPlayerAndInfoContainerEl.classList.add('video-active'); 
            console.log("MUSIC LOADER: User playing video, rotation stopped.");
        } else if (event.data === YT.PlayerState.PAUSED) {
            userInteractedWithPlayer = true; 
            musicFeaturedVideoIframeEl.classList.remove('active'); 
            musicFeaturedArtistImgEl.classList.add('active'); 
            musicFeaturedPlayerAndInfoContainerEl.classList.remove('video-active');
            console.log("MUSIC LOADER: User paused video.");
        } else if (event.data === YT.PlayerState.ENDED) {
            userInteractedWithPlayer = false; 
            loadFeaturedSong(); 
            musicFeaturedVideoIframeEl.classList.remove('active'); 
            musicFeaturedArtistImgEl.classList.add('active'); 
            musicFeaturedPlayerAndInfoContainerEl.classList.remove('video-active');
            if (allSongsWithArtists.length > 1 && !rotationInterval) { 
                rotationInterval = setInterval(() => loadFeaturedSong(), 15000);
                console.log("MUSIC LOADER: Song ended, resumed rotation.");
            }
        } else if (event.data === YT.PlayerState.BUFFERING) {
            musicFeaturedVideoIframeEl.classList.add('active');
            musicFeaturedArtistImgEl.classList.remove('active');
            musicFeaturedPlayerAndInfoContainerEl.classList.add('video-active');
        } else if (event.data === YT.PlayerState.UNSTARTED) {
             musicFeaturedVideoIframeEl.classList.remove('active');
             musicFeaturedArtistImgEl.classList.add('active');
             musicFeaturedPlayerAndInfoContainerEl.classList.remove('video-active');
        }
    };

    // --- Fallback if YouTube API is slow or not loaded ---
    if (typeof YT === 'undefined' || typeof YT.Player === 'undefined') {
        console.warn("YouTube Iframe API not yet detected. Initial song load via fallback.");
        loadFeaturedSong();
        if (allSongsWithArtists.length > 1 && !rotationInterval) {
            rotationInterval = setInterval(() => {
                if (!userInteractedWithPlayer) { loadFeaturedSong(); }
            }, 15000);
        }
    }

    // --- Render Artist Cards Carousel ---
    let artistsHTML = '';
    bisayaMusicArtists.forEach(artist => {
        if (!artist || !artist.id) { return; }
        artistsHTML += `
            <article class="music-artist-card" 
                     data-artist-id="${artist.id}" 
                     aria-label="Artist: ${artist.name}"
                     tabindex="0" role="button">
                <div class="music-artist-card-art" style="background-image: url('${artist.coverArt || 'images/music/placeholder_artist.jpg'}');"></div>
                <div class="music-artist-card-info">
                    <h4>${artist.name || 'Artist Name'}</h4>
                    ${artist.location ? `<span class="music-artist-location-tag"><i class="fas fa-map-marker-alt"></i> ${artist.location}</span>` : ''}
                </div>
                <a href="${artist.spotifyLink || '#'}" target="_blank" class="music-artist-card-play-btn" title="Paminaw sa Spotify: ${artist.name}">
                    <i class="fab fa-spotify"></i>
                </a>
            </article>`;
    });
    if (artistsScrollWrapper) { 
        artistsScrollWrapper.innerHTML = artistsHTML;
        console.log("BISAYA MUSIC LOADER: Artist cards carousel populated.");
    } else {
        console.error("BISAYA MUSIC LOADER: artistsScrollWrapper element not found. Cannot render artist cards.");
    }

    // --- Event listener for Artist Cards to open Modal ---
    if (artistsScrollWrapper) { 
        artistsScrollWrapper.querySelectorAll('.music-artist-card').forEach(card => {
            card.addEventListener('click', () => {
                if (rotationInterval) { clearInterval(rotationInterval); rotationInterval = null; }
                if (musicPlayer && typeof musicPlayer.pauseVideo === 'function') { musicPlayer.pauseVideo(); }
                musicFeaturedVideoIframeEl.classList.remove('active'); 
                musicFeaturedArtistImgEl.classList.add('active'); 
                musicFeaturedPlayerAndInfoContainerEl.classList.remove('video-active');
                userInteractedWithPlayer = false; 

                const artistId = card.dataset.artistId;
                const artistData = bisayaMusicArtists.find(a => a.id === artistId);
                
                if (artistData && window.BisayaMusicArtistModal && typeof window.BisayaMusicArtistModal.populateAndShow === 'function') {
                    window.BisayaMusicArtistModal.populateAndShow(artistData); 
                } else {
                    console.warn(`BISAYA MUSIC LOADER: Artist data or modal handler missing for ID: ${artistId}.`);
                }
            });
            card.addEventListener('keydown', (event) => { 
                if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); card.click(); }
            });
        });
    }
}
// This function initializeMusicSection() is called by bisaya-page-loader.js after DOMContentLoaded.