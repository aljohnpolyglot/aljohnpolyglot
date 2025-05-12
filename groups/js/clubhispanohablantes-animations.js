document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for general scroll animations
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    if (animatedElements.length > 0) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observerInstance.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    // Hero elements initial animation (triggered once)
    const heroSection = document.querySelector('.chf-hero');
    if (heroSection) {
        // Give a slight delay for CSS to load, then trigger hero animation
        setTimeout(() => {
            heroSection.classList.add('hero-elements-visible');
        }, 100); // 100ms delay

        // Parallax for hero bubbles
        const bubbles = heroSection.querySelectorAll('.hero-background-elements .bg-bubble');
        if (bubbles.length > 0) {
            window.addEventListener('scroll', () => {
                let scrollPosition = window.pageYOffset;
                // Only apply parallax if hero is somewhat in view to save performance
                if (scrollPosition < window.innerHeight * 1.5) {
                    bubbles.forEach((bubble, index) => {
                        const speedFactor = parseFloat(bubble.getAttribute('data-parallax-speed') || '0.1');
                        // Alternate direction for some bubbles
                        const direction = (index % 2 === 0) ? -1 : 1;
                        bubble.style.transform = `translateY(${scrollPosition * speedFactor * direction}px) scale(${1 + scrollPosition * 0.00005 * (index + 1)})`;
                    });
                }
            });
        }
    }

    // Staggered list item animations (e.g., in event details)
    const listContainers = document.querySelectorAll('.stagger-list-items');
    listContainers.forEach(container => {
        const listItems = container.querySelectorAll('li');
        listItems.forEach((item, index) => {
            item.classList.add('animate-on-scroll', 'fade-in-up'); // Base animation classes
            item.style.transitionDelay = `${index * 0.1}s`; // Apply individual delay via style
        });
    });
     // Re-observe these newly classed items if they weren't caught by the initial query
    const newlyAnimatedListItems = document.querySelectorAll('.stagger-list-items li.animate-on-scroll');
    if (newlyAnimatedListItems.length > 0 && typeof observer !== 'undefined') { // check if observer is defined
        newlyAnimatedListItems.forEach(element => {
            observer.observe(element);
        });
    }

});