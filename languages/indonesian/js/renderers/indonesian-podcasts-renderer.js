function focusableElements(root) {
    return [...root.querySelectorAll("a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])")]
        .filter((element) => !element.hidden);
}

export function renderIndonesianPodcasts({ podcasts, shelf, previousButton, nextButton, status, modal, modalContent }) {
    if (!Array.isArray(podcasts) || !shelf || !previousButton || !nextButton || !status || !modal || !modalContent) {
        throw new Error("Podcast Indonesia tidak dapat dirender.");
    }

    let activeTrigger = null;
    const closeButton = modal.querySelector(".modal-close-id");

    const closeModal = () => {
        if (modal.hidden) return;
        modal.hidden = true;
        document.body.classList.remove("modal-open");
        activeTrigger?.focus();
        activeTrigger = null;
    };

    const openModal = (podcast, trigger) => {
        const layout = document.createElement("div");
        layout.className = "podcast-modal-layout-id";

        const media = document.createElement("div");
        media.className = "podcast-modal-media-id";
        const cover = document.createElement("img");
        cover.src = podcast.image;
        cover.alt = podcast.imageAlt;
        cover.width = 480;
        cover.height = 480;
        cover.decoding = "async";
        cover.addEventListener("error", () => {
            cover.src = "../../images/creators/creator-fallback.svg";
        }, { once: true });
        media.appendChild(cover);

        const copy = document.createElement("div");
        copy.className = "podcast-modal-copy-id";

        const metadata = document.createElement("p");
        metadata.textContent = `${podcast.publisher} · ${podcast.language} · CEFR ${podcast.cefr}`;

        const title = document.createElement("h2");
        title.id = "indonesian-podcast-modal-title";
        title.textContent = podcast.title;

        const format = document.createElement("p");
        format.className = "podcast-modal-format-id";
        format.textContent = podcast.format;

        const description = document.createElement("p");
        description.id = "indonesian-podcast-modal-description";
        description.textContent = podcast.description;

        const guidance = document.createElement("div");
        guidance.className = "podcast-modal-guidance-id";
        const guidanceTitle = document.createElement("h3");
        guidanceTitle.textContent = "Cara mendengarkan";
        const guidanceCopy = document.createElement("p");
        guidanceCopy.id = "indonesian-podcast-modal-guidance";
        guidanceCopy.textContent = podcast.guidance;
        guidance.append(guidanceTitle, guidanceCopy);

        copy.append(metadata, title, format, description, guidance);

        if (podcast.personalNote) {
            const note = document.createElement("blockquote");
            note.className = "podcast-modal-note-id";
            note.textContent = podcast.personalNote;
            copy.appendChild(note);
        }

        const links = document.createElement("div");
        links.className = "podcast-modal-links-id";
        podcast.links.forEach((link) => {
            const anchor = document.createElement("a");
            anchor.href = link.url;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
            anchor.setAttribute("aria-label", `${link.label}: ${podcast.title}`);
            anchor.textContent = `${link.label} ↗`;
            links.appendChild(anchor);
        });
        copy.appendChild(links);
        layout.append(media, copy);
        modalContent.replaceChildren(layout);

        activeTrigger = trigger;
        modal.hidden = false;
        document.body.classList.add("modal-open");
        window.requestAnimationFrame(() => closeButton?.focus());
    };

    podcasts.forEach((podcast) => {
        const article = document.createElement("article");
        article.className = "podcast-card-id";
        article.setAttribute("role", "listitem");

        const button = document.createElement("button");
        button.className = "podcast-card-trigger-id";
        button.type = "button";
        button.setAttribute("aria-label", `Lihat detail podcast ${podcast.title}`);

        const cover = document.createElement("img");
        cover.src = podcast.image;
        cover.alt = podcast.imageAlt;
        cover.width = 320;
        cover.height = 320;
        cover.loading = "lazy";
        cover.decoding = "async";
        cover.addEventListener("error", () => {
            cover.src = "../../images/creators/creator-fallback.svg";
        }, { once: true });

        const copy = document.createElement("span");
        copy.className = "podcast-card-copy-id";
        const metadata = document.createElement("span");
        metadata.className = "podcast-card-metadata-id";
        metadata.textContent = `${podcast.publisher} · CEFR ${podcast.cefr}`;
        const title = document.createElement("strong");
        title.textContent = podcast.title;
        const format = document.createElement("span");
        format.className = "podcast-card-format-id";
        format.textContent = podcast.format;
        const action = document.createElement("span");
        action.className = "podcast-card-action-id";
        action.textContent = "Lihat detail →";
        copy.append(metadata, title, format, action);
        button.append(cover, copy);
        button.addEventListener("click", () => openModal(podcast, button));
        article.appendChild(button);
        shelf.appendChild(article);
    });

    const updateControls = () => {
        const maxScroll = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
        previousButton.disabled = shelf.scrollLeft <= 2;
        nextButton.disabled = shelf.scrollLeft >= maxScroll - 2;
    };

    const scrollShelf = (direction) => {
        const card = shelf.querySelector(".podcast-card-id");
        const distance = card ? card.getBoundingClientRect().width + 24 : shelf.clientWidth * 0.85;
        shelf.scrollBy({
            left: direction * distance,
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
        status.textContent = direction > 0 ? "Podcast berikutnya." : "Podcast sebelumnya.";
    };

    previousButton.addEventListener("click", () => scrollShelf(-1));
    nextButton.addEventListener("click", () => scrollShelf(1));
    shelf.addEventListener("scroll", updateControls, { passive: true });
    shelf.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            scrollShelf(event.key === "ArrowRight" ? 1 : -1);
        } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            shelf.scrollTo({
                left: event.key === "Home" ? 0 : shelf.scrollWidth,
                behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
            });
        }
    });
    modal.querySelectorAll("[data-podcast-modal-close]").forEach((control) => control.addEventListener("click", closeModal));
    modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = focusableElements(modal);
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable.at(-1);
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });
    window.addEventListener("resize", updateControls, { passive: true });
    window.requestAnimationFrame(updateControls);
}
