// js/hero-slideshow.js

function initializeHeroSlideshow() {
    console.log("HERO SLIDESHOW: Initializing slideshow...");
    const slideshowContainer = document.querySelector('.hero-background-slideshow');
    if (!slideshowContainer) {
        console.warn("HERO SLIDESHOW: .hero-background-slideshow container not found. Slideshow will not run.");
        return;
    }

    const images = slideshowContainer.querySelectorAll('.hero-background-image');
    if (images.length === 0) {
        console.warn("HERO SLIDESHOW: No images found within .hero-background-slideshow. Slideshow will not run.");
        return;
    }

    let currentImageIndex = 0;

    function cycleImages() {
        // Ensure all images are initially inactive
        images.forEach(img => img.classList.remove('active'));

        // Activate the next image
        images[currentImageIndex].classList.add('active');

        // Move to the next index, looping back to 0 if at the end
        currentImageIndex = (currentImageIndex + 1) % images.length;
    }

    // Start cycling:
    // Make the first image active immediately on init
    images[currentImageIndex].classList.add('active'); 
    
    // If more than one image, set up the interval for cycling
    if (images.length > 1) {
        setInterval(cycleImages, 8000); // Change image every 8 seconds (adjust as needed)
        console.log(`HERO SLIDESHOW: Cycling ${images.length} images every 8 seconds.`);
    } else {
        console.log("HERO SLIDESHOW: Only one image found, not cycling.");
    }
}