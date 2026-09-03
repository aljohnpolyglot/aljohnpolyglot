document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Scroll-triggered Animations ---
    const initScrollAnimations = () => {
        const animatedElements = document.querySelectorAll(
            '.anim-fade-in, .anim-fade-in-up, .anim-fade-in-left, .anim-fade-in-right, .anim-zoom-in'
        );

        if (!animatedElements.length) return;

        const observerOptions = {
            root: null, // relative to document viewport
            rootMargin: '0px',
            threshold: 0.1 // 10% of element is visible
        };

        const intersectionCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Stop observing once it's visible
                }
            });
        };

        const observer = new IntersectionObserver(intersectionCallback, observerOptions);
        animatedElements.forEach(el => observer.observe(el));
    };

    // --- 2. "Back to Top" Button ---
    const initBackToTopButton = () => {
        const backToTopButton = document.createElement('button');
        backToTopButton.setAttribute('id', 'backToTopBtn');
        backToTopButton.setAttribute('aria-label', 'Scroll to top');
        backToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>'; // Using Font Awesome
        document.body.appendChild(backToTopButton);

        // CSS for the button will be in spanishforfilipinos-styles.css

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) { // Show button after 300px scroll
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    };

    // Initialize features
    initScrollAnimations();
    initBackToTopButton();

});