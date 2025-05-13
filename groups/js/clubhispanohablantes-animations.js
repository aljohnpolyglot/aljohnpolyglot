// groups/js/clubhispanohablantes-animations.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("CHF Animations: DOMContentLoaded - SCRIPT HAS STARTED");

    // --- Intersection Observer for general scroll animations ---
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    console.log("CHF Animations: Found .animate-on-scroll elements:", animatedElements);

    if (animatedElements.length > 0) {
        const observerCallback = (entries, observer) => {
            entries.forEach(entry => {
                // Log every time the observer fires for an element
                console.log("CHF Animations: Observer entry for target:", entry.target, "Is Intersecting:", entry.isIntersecting);
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    console.log("CHF Animations: Added 'is-visible' to", entry.target);
                    observer.unobserve(entry.target); // Stop observing once animated
                }
            });
        };
        // Try a very sensitive threshold for testing
        const observerOptions = { root: null, rootMargin: '0px', threshold: 0.01 }; // Changed to 0.01
        const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);
        animatedElements.forEach(el => {
            console.log("CHF Animations: Observing element:", el);
            scrollObserver.observe(el);
        });
        console.log(`CHF Animations: Scroll observer initialized for ${animatedElements.length} .animate-on-scroll elements.`);
    } else {
        console.log("CHF Animations: No .animate-on-scroll elements found.");
    }

    // --- Intersection Observer for Staggered Animations ---
    const staggeredContainers = document.querySelectorAll('.stagger-children');
    console.log("CHF Animations: Found .stagger-children containers:", staggeredContainers);
    if (staggeredContainers.length > 0) {
        const staggerObserverCallback = (entries, observer) => {
            entries.forEach(entry => {
                console.log("CHF Animations: Stagger observer entry for target:", entry.target, "Is Intersecting:", entry.isIntersecting);
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    console.log("CHF Animations: Added 'is-visible' to stagger parent:", entry.target);
                    const children = entry.target.children;
                    for (let i = 0; i < children.length; i++) {
                        children[i].style.transitionDelay = `${i * 0.12}s`;
                    }
                    observer.unobserve(entry.target);
                }
            });
        };
        const staggerObserverOptions = { threshold: 0.1 }; // Can also try 0.01 if needed
        const staggerObserver = new IntersectionObserver(staggerObserverCallback, staggerObserverOptions);
        staggeredContainers.forEach(container => {
            console.log("CHF Animations: Observing stagger container:", container);
            staggerObserver.observe(container);
        });
        console.log(`CHF Animations: Stagger observer initialized for ${staggeredContainers.length} .stagger-children elements.`);
    } else {
        console.log("CHF Animations: No .stagger-children elements found.");
    }

    // --- Hero Entrance Animation Trigger ---
    const heroSection = document.querySelector('.chf-hero');
    if (heroSection) {
        setTimeout(() => {
            heroSection.classList.add('hero-elements-visible');
            console.log("CHF Animations: '.hero-elements-visible' class added to .chf-hero.");
        }, 150); // Slightly increased delay to ensure DOM is super ready
    } else {
        console.log("CHF Animations: .chf-hero element not found for entrance animation.");
    }

    // --- Parallax for Hero Bubbles ---
    const heroForBubbles = document.querySelector('.chf-hero');
    if (heroForBubbles) {
        const parallaxBubbles = heroForBubbles.querySelectorAll('.bg-bubble[data-parallax-speed]');
        console.log("CHF Animations: Found parallax bubbles:", parallaxBubbles);
        if (parallaxBubbles.length > 0) {
            const handleScrollParallax = () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                const heroRect = heroForBubbles.getBoundingClientRect();
                if (heroRect.bottom >= 0 && heroRect.top <= window.innerHeight) {
                    parallaxBubbles.forEach(bubble => {
                        const speed = parseFloat(bubble.dataset.parallaxSpeed);
                        if (!isNaN(speed)) {
                            const yPos = -(scrollTop * speed);
                            bubble.style.transform = `translateY(${yPos}px)`;
                        }
                    });
                }
            };
            window.addEventListener('scroll', handleScrollParallax, { passive: true });
            handleScrollParallax(); // Initial position
            console.log(`CHF Animations: Parallax initialized for ${parallaxBubbles.length} .bg-bubble elements.`);
        } else {
            console.log("CHF Animations: No .bg-bubble elements with data-parallax-speed found.");
        }
    } else {
         console.log("CHF Animations: .chf-hero not found for bubble parallax.");
    }
    console.log("CHF Animations: Script execution finished.");
});