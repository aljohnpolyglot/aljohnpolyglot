(function () {
    "use strict";

    const nav = document.querySelector(".studiolo-nav");
    if (!nav || !("IntersectionObserver" in window)) return;

    const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
    const sections = links
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        links.forEach((link) => {
            const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
            link.toggleAttribute("aria-current", isCurrent);
        });
    }, { rootMargin: "-24% 0px -64%", threshold: [0.08, 0.25, 0.55] });

    sections.forEach((section) => observer.observe(section));
})();

(function () {
    "use strict";

    const carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) return;

    const slides = Array.from(carousel.querySelectorAll("[data-hero-slide]"));
    const previousButton = document.getElementById("hero-carousel-previous");
    const nextButton = document.getElementById("hero-carousel-next");
    const currentLabel = document.getElementById("hero-carousel-current");
    const totalLabel = document.getElementById("hero-carousel-total");
    if (!slides.length || !previousButton || !nextButton || !currentLabel || !totalLabel) return;

    let activeIndex = 0;
    let pointerStartX = null;
    totalLabel.textContent = String(slides.length);

    function showSlide(nextIndex) {
        activeIndex = (nextIndex + slides.length) % slides.length;
        slides.forEach((slide, index) => {
            const active = index === activeIndex;
            slide.classList.toggle("is-active", active);
            slide.setAttribute("aria-hidden", String(!active));
        });
        currentLabel.textContent = String(activeIndex + 1);
    }

    previousButton.addEventListener("click", () => showSlide(activeIndex - 1));
    nextButton.addEventListener("click", () => showSlide(activeIndex + 1));

    carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
            event.preventDefault();
            showSlide(activeIndex - 1);
        } else if (event.key === "ArrowRight") {
            event.preventDefault();
            showSlide(activeIndex + 1);
        } else if (event.key === "Home") {
            event.preventDefault();
            showSlide(0);
        } else if (event.key === "End") {
            event.preventDefault();
            showSlide(slides.length - 1);
        }
    });

    carousel.addEventListener("pointerdown", (event) => {
        if (event.pointerType === "mouse") return;
        pointerStartX = event.clientX;
    });

    carousel.addEventListener("pointerup", (event) => {
        if (pointerStartX === null) return;
        const distance = event.clientX - pointerStartX;
        pointerStartX = null;
        if (Math.abs(distance) < 48) return;
        showSlide(activeIndex + (distance < 0 ? 1 : -1));
    });

    carousel.addEventListener("pointercancel", () => {
        pointerStartX = null;
    });

    showSlide(0);
})();
