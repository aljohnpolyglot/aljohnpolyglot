(function renderItalianPodcasts() {
    "use strict";

    const podcasts = window.ITALIAN_PODCASTS;
    const shelf = document.getElementById("italian-podcast-shelf");
    const previousButton = document.getElementById("italian-podcast-previous");
    const nextButton = document.getElementById("italian-podcast-next");
    const status = document.getElementById("italian-podcast-status");
    const modal = document.getElementById("italian-podcast-modal");
    const modalContent = document.getElementById("italian-podcast-modal-content");
    if (!Array.isArray(podcasts) || !shelf || !previousButton || !nextButton || !status || !modal || !modalContent) return;

    let lastTrigger = null;
    const closeButton = modal.querySelector("button.italian-podcast-modal-close");

    function focusable() {
        return Array.from(modal.querySelectorAll("button, a[href], [tabindex]:not([tabindex='-1'])")).filter((el) => !el.disabled && el.offsetParent !== null);
    }

    function createPodcastCard(podcast) {
        const article = document.createElement("article");
        article.className = "italian-podcast-card";
        article.setAttribute("role", "listitem");

        const trigger = document.createElement("button");
        trigger.type = "button";
        trigger.className = "italian-podcast-card__trigger";
        trigger.setAttribute("aria-label", `Apri i dettagli di ${podcast.title}`);
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-controls", "italian-podcast-modal");

        const cover = document.createElement("img");
        cover.src = podcast.image;
        cover.alt = `Copertina di ${podcast.title}`;
        cover.width = 320;
        cover.height = 320;
        cover.loading = "lazy";
        cover.decoding = "async";
        cover.addEventListener("error", () => { cover.src = "images/podcasts/geopop-podcast.webp"; }, { once: true });

        const copy = document.createElement("span");
        copy.className = "italian-podcast-card__copy";

        const metadata = document.createElement("span");
        metadata.className = "italian-podcast-card__metadata";
        metadata.textContent = `${podcast.publisher} · CEFR ${podcast.cefr}`;

        const title = document.createElement("span");
        title.className = "italian-podcast-card__title";
        title.textContent = podcast.title;

        const format = document.createElement("span");
        format.className = "italian-podcast-card__format";
        format.textContent = podcast.format;

        const action = document.createElement("span");
        action.className = "italian-podcast-card__action";
        action.textContent = "Apri dettagli →";

        copy.append(metadata, title, format, action);
        trigger.append(cover, copy);
        trigger.addEventListener("click", () => openModal(podcast, trigger));
        article.appendChild(trigger);
        return article;
    }

    function openModal(podcast, trigger) {
        lastTrigger = trigger;
        modalContent.replaceChildren();
        const layout = document.createElement("div");
        layout.className = "italian-podcast-modal-layout";

        const cover = document.createElement("img");
        cover.src = podcast.image;
        cover.alt = `Copertina di ${podcast.title}`;
        cover.width = 360;
        cover.height = 360;
        cover.loading = "eager";
        cover.decoding = "async";
        cover.addEventListener("error", () => { cover.src = "images/podcasts/geopop-podcast.webp"; }, { once: true });

        const copy = document.createElement("div");
        copy.className = "italian-podcast-modal-copy";
        const folio = document.createElement("p");
        folio.className = "folio";
        folio.textContent = `${podcast.publisher} · CEFR ${podcast.cefr}`;
        const title = document.createElement("h2");
        title.id = "italian-podcast-modal-title";
        title.textContent = podcast.title;
        const format = document.createElement("p");
        format.className = "italian-podcast-modal-format";
        format.textContent = podcast.format;
        const description = document.createElement("p");
        description.id = "italian-podcast-modal-description";
        description.textContent = podcast.description;
        const guidanceHeading = document.createElement("h3");
        guidanceHeading.textContent = "Come ascoltarlo";
        const guidance = document.createElement("p");
        guidance.id = "italian-podcast-modal-guidance";
        guidance.textContent = podcast.guidance;
        const note = podcast.personalComment ? document.createElement("p") : null;
        if (note) {
            note.className = "italian-podcast-modal-note";
            note.textContent = podcast.personalComment;
        }
        const links = document.createElement("div");
        links.className = "italian-podcast-modal-links";
        (Array.isArray(podcast.links) ? podcast.links : []).forEach((link) => {
            const anchor = document.createElement("a");
            anchor.href = link.url;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
            anchor.textContent = `${link.label} ↗`;
            links.appendChild(anchor);
        });
        copy.append(folio, title, format, description, guidanceHeading, guidance);
        if (note) copy.appendChild(note);
        copy.appendChild(links);
        layout.append(cover, copy);
        modalContent.appendChild(layout);
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        closeButton.focus();
    }

    function closeModal() {
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        modalContent.replaceChildren();
        if (lastTrigger) lastTrigger.focus();
    }

    modal.addEventListener("click", (event) => {
        if (event.target.closest("[data-italian-podcast-modal-close]")) closeModal();
    });
    modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
            return;
        }
        if (event.key !== "Tab") return;
        const items = focusable();
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    });

    podcasts.forEach((podcast) => shelf.appendChild(createPodcastCard(podcast)));
    shelf.setAttribute("role", "list");
    shelf.setAttribute("aria-label", "Scaffale dei podcast italiani");
    shelf.tabIndex = 0;

    function updateControls() {
        const maxScroll = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
        previousButton.disabled = shelf.scrollLeft <= 2;
        nextButton.disabled = shelf.scrollLeft >= maxScroll - 2;
    }

    function scrollShelf(direction) {
        const card = shelf.querySelector(".italian-podcast-card");
        const distance = card ? card.getBoundingClientRect().width + 24 : shelf.clientWidth * 0.85;
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        shelf.scrollBy({ left: direction * distance, behavior: reduceMotion ? "auto" : "smooth" });
        status.textContent = direction > 0 ? "Podcast successivi." : "Podcast precedenti.";
    }

    previousButton.addEventListener("click", () => scrollShelf(-1));
    nextButton.addEventListener("click", () => scrollShelf(1));
    shelf.addEventListener("scroll", updateControls, { passive: true });
    shelf.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            scrollShelf(event.key === "ArrowRight" ? 1 : -1);
        } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            shelf.scrollTo({ left: event.key === "End" ? shelf.scrollWidth : 0, behavior: reduceMotion ? "auto" : "smooth" });
        }
    });
    window.addEventListener("resize", updateControls, { passive: true });
    window.requestAnimationFrame(updateControls);
}());
