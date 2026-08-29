import { indonesianPlaylist } from "./data/indonesian-playlist-data.js";
import { indonesianBooks } from "./data/indonesian-books-data.js";
import { renderPlaylist } from "./renderers/indonesian-playlist-renderer.js";
import { renderIndonesianBooks } from "./renderers/indonesian-books-renderer.js";
import { renderCreatorShelves } from "./renderers/indonesian-creator-renderer.js";

function syncNavigationOffsets() {
    const globalHeader = document.getElementById("main-header-placeholder");
    const chapterNav = document.querySelector(".chapter-nav");
    if (!globalHeader || !chapterNav) return;

    const update = () => {
        const globalHeight = Math.round(globalHeader.getBoundingClientRect().height);
        if (globalHeight) document.documentElement.style.setProperty("--id-global-nav-height", `${globalHeight}px`);
    };

    const observer = new ResizeObserver(update);
    observer.observe(globalHeader);
    update();
    window.addEventListener("load", update, { once: true });
}

function initializeHeroCarousel() {
    const carousel = document.querySelector("[data-hero-carousel]");
    if (!carousel) return;
    const slides = [...carousel.querySelectorAll("[data-hero-slide]")];
    const previous = carousel.querySelector("[data-hero-previous]");
    const next = carousel.querySelector("[data-hero-next]");
    const current = carousel.querySelector("[data-hero-current]");
    let activeIndex = 0;

    const show = (index) => {
        activeIndex = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            const active = slideIndex === activeIndex;
            slide.classList.toggle("is-active", active);
            slide.setAttribute("aria-hidden", active ? "false" : "true");
        });
        const activeImage = slides[activeIndex]?.querySelector("img");
        const imageWidth = Number(activeImage?.getAttribute("width")) || activeImage?.naturalWidth;
        const imageHeight = Number(activeImage?.getAttribute("height")) || activeImage?.naturalHeight;
        if (imageWidth && imageHeight) {
            carousel.style.setProperty("--id-hero-photo-ratio", `${imageWidth} / ${imageHeight}`);
        }
        if (current) current.textContent = String(activeIndex + 1);
    };

    previous?.addEventListener("click", () => show(activeIndex - 1));
    next?.addEventListener("click", () => show(activeIndex + 1));
    carousel.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") show(activeIndex - 1);
        if (event.key === "ArrowRight") show(activeIndex + 1);
    });
    show(0);
}

function initializeMediaCarousels() {
    document.querySelectorAll("[data-media-carousel]").forEach((carousel) => {
        const slides = [...carousel.querySelectorAll("[data-media-slide]")];
        const previous = carousel.querySelector("[data-media-previous]");
        const next = carousel.querySelector("[data-media-next]");
        const current = carousel.querySelector("[data-media-current]");
        let activeIndex = 0;

        const show = (index) => {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                const active = slideIndex === activeIndex;
                slide.classList.toggle("is-active", active);
                slide.setAttribute("aria-hidden", active ? "false" : "true");
                slide.tabIndex = active ? 0 : -1;
                slide.querySelectorAll("a, button, iframe, [tabindex]").forEach((control) => {
                    if (!control.dataset.carouselTabindex) {
                        control.dataset.carouselTabindex = control.getAttribute("tabindex") ?? "0";
                    }
                    control.tabIndex = active ? Number(control.dataset.carouselTabindex) : -1;
                });
            });
            if (current) current.textContent = String(activeIndex + 1);
        };

        previous?.addEventListener("click", () => show(activeIndex - 1));
        next?.addEventListener("click", () => show(activeIndex + 1));
        carousel.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                show(activeIndex - 1);
            }
            if (event.key === "ArrowRight") {
                event.preventDefault();
                show(activeIndex + 1);
            }
        });
        show(0);
    });
}

function focusableElements(root) {
    return [...root.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hasAttribute("hidden"));
}

function initializeLightbox() {
    const lightbox = document.getElementById("image-lightbox");
    const image = document.getElementById("lightbox-image");
    const caption = document.getElementById("lightbox-caption");
    if (!lightbox || !image || !caption) return;
    let lastTrigger = null;

    const close = () => {
        if (lightbox.hidden) return;
        lightbox.hidden = true;
        document.body.classList.remove("modal-open");
        image.src = "../../images/creators/creator-fallback.svg";
        image.alt = "";
        caption.textContent = "";
        lastTrigger?.focus();
        lastTrigger = null;
    };

    document.querySelectorAll("[data-lightbox-src]").forEach((trigger) => {
        trigger.addEventListener("click", () => {
            lastTrigger = trigger;
            image.src = trigger.dataset.lightboxSrc;
            image.alt = trigger.dataset.lightboxAlt || "";
            caption.textContent = trigger.dataset.lightboxAlt || "";
            lightbox.hidden = false;
            document.body.classList.add("modal-open");
            lightbox.querySelector("button[data-lightbox-close]")?.focus();
        });
    });

    lightbox.querySelectorAll("[data-lightbox-close]").forEach((control) => control.addEventListener("click", close));
    lightbox.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            close();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = focusableElements(lightbox);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
}

function initializeChapterNavigation() {
    const links = [...document.querySelectorAll(".chapter-nav a[href^='#']")];
    const sections = links
        .map((link) => document.querySelector(link.getAttribute("href")))
        .filter(Boolean);
    if (!links.length || !sections.length) return;

    links.forEach((link) => {
        link.addEventListener("focus", () => {
            link.scrollIntoView({
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
                block: "nearest",
                inline: "center"
            });
        });
    });

    const observer = new IntersectionObserver((entries) => {
        const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        links.forEach((link) => {
            const active = link.getAttribute("href") === `#${visible.target.id}`;
            if (active) link.setAttribute("aria-current", "location");
            else link.removeAttribute("aria-current");
        });
    }, { rootMargin: "-22% 0px -65%", threshold: [0.01, 0.2] });

    sections.forEach((section) => observer.observe(section));
}

function showRenderError(container, message) {
    if (!container) return;
    const alert = document.createElement("p");
    alert.className = "render-error-id";
    alert.setAttribute("role", "alert");
    alert.textContent = message;
    container.replaceChildren(alert);
}

document.addEventListener("DOMContentLoaded", async () => {
    syncNavigationOffsets();
    initializeHeroCarousel();
    initializeMediaCarousels();
    initializeLightbox();
    initializeChapterNavigation();

    renderPlaylist({
        playlist: indonesianPlaylist,
        list: document.getElementById("indonesian-playlist"),
        player: document.getElementById("indonesian-featured-player"),
        title: document.getElementById("indonesian-featured-title"),
        context: document.getElementById("indonesian-featured-context"),
        position: document.getElementById("playlist-position")
    });

    renderIndonesianBooks({
        books: indonesianBooks,
        shelf: document.getElementById("indonesian-books-shelf"),
        previousButton: document.getElementById("indonesian-books-previous"),
        nextButton: document.getElementById("indonesian-books-next"),
        modal: document.getElementById("indonesian-book-modal")
    });

    const creatorContainer = document.getElementById("indonesian-creator-shelves");
    try {
        await renderCreatorShelves({
            container: creatorContainer,
            modal: document.getElementById("creator-modal"),
            modalContent: document.getElementById("creator-modal-content"),
            levelControls: document.getElementById("indonesian-creator-level-controls"),
            levelStatus: document.getElementById("indonesian-creator-level-status")
        });
    } catch (error) {
        console.error(error);
        showRenderError(creatorContainer, "Koleksi kreator belum dapat dimuat. Silakan muat ulang halaman ini.");
    }
});
