document.addEventListener('DOMContentLoaded', () => {

    // --- REVEAL ON SCROLL FUNCTIONALITY ---
    const revealOnScroll = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scv-visible');
                observer.unobserve(entry.target); // Stop observing once visible to save resources
            }
        });
    };

    // Options for the Intersection Observer
    const revealOptions = {
        root: null, // observes intersections relative to the viewport
        threshold: 0.15, // item is 15% visible
        rootMargin: '0px 0px -50px 0px' // start revealing 50px before it fully enters bottom of viewport
    };

    // Create the observer
    const scrollObserver = new IntersectionObserver(revealOnScroll, revealOptions);

    // Select all elements you want to have the reveal effect
    // These classes will need to be added to your HTML sections
    const elementsToReveal = document.querySelectorAll('.scv-reveal-on-scroll');

    if (elementsToReveal.length > 0) {
        elementsToReveal.forEach(element => {
            scrollObserver.observe(element);
        });
    } else {
        // Fallback for older browsers or if IntersectionObserver is not supported
        // (though it's widely supported now)
        document.querySelectorAll('.scv-reveal-on-scroll-fallback').forEach(el => {
            el.classList.add('scv-visible');
        });
    }

    // --- SUBTLE PARALLAX EFFECT FOR HERO BACKGROUND (Optional) ---
    const heroSectionSCV = document.querySelector('.scv-hero');
    if (heroSectionSCV) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            // Adjust the '0.3' factor for more or less parallax effect
            // This moves the background-position of the stripes
            heroSectionSCV.style.backgroundPositionY = `-${scrollPosition * 0.1}px`;
        });
    }

});