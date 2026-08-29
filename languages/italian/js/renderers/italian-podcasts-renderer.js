(function renderItalianPodcasts() {
    "use strict";

    const podcasts = window.ITALIAN_PODCASTS;
    const shelf = document.getElementById("italian-podcast-shelf");
    const previousButton = document.getElementById("italian-podcast-previous");
    const nextButton = document.getElementById("italian-podcast-next");
    const status = document.getElementById("italian-podcast-status");
    if (!Array.isArray(podcasts) || !shelf || !previousButton || !nextButton || !status) return;

    function createPodcastCard(podcast) {
        const article = document.createElement("article");
        article.className = "italian-podcast-card";

        const cover = document.createElement("img");
        cover.src = podcast.image;
        cover.alt = `Copertina di ${podcast.title}`;
        cover.width = 200;
        cover.height = 200;
        cover.loading = "lazy";
        cover.decoding = "async";

        const copy = document.createElement("div");
        copy.className = "italian-podcast-card__copy";

        const metadata = document.createElement("p");
        metadata.className = "italian-podcast-card__metadata";
        metadata.textContent = `${podcast.publisher} · CEFR ${podcast.cefr}`;

        const title = document.createElement("h3");
        title.textContent = podcast.title;

        const format = document.createElement("p");
        format.className = "italian-podcast-card__format";
        format.textContent = podcast.format;

        const description = document.createElement("p");
        description.className = "italian-podcast-card__description";
        description.textContent = podcast.description;

        const guidance = document.createElement("p");
        guidance.className = "italian-podcast-card__guidance";
        const guidanceLabel = document.createElement("strong");
        guidanceLabel.textContent = "Come ascoltarlo: ";
        guidance.append(guidanceLabel, podcast.guidance);

        const links = document.createElement("div");
        links.className = "italian-podcast-card__links";
        podcast.links.forEach((link) => {
            const anchor = document.createElement("a");
            anchor.href = link.url;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
            anchor.textContent = `${link.label} ↗`;
            links.appendChild(anchor);
        });

        copy.append(metadata, title, format, description, guidance, links);
        article.append(cover, copy);
        return article;
    }

    podcasts.forEach((podcast) => shelf.appendChild(createPodcastCard(podcast)));

    function updateControls() {
        const maxScroll = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
        previousButton.disabled = shelf.scrollLeft <= 2;
        nextButton.disabled = shelf.scrollLeft >= maxScroll - 2;
    }

    function scrollShelf(direction) {
        const card = shelf.querySelector(".italian-podcast-card");
        const distance = card ? card.getBoundingClientRect().width + 24 : shelf.clientWidth * 0.85;
        shelf.scrollBy({ left: direction * distance, behavior: "smooth" });
        status.textContent = direction > 0 ? "Podcast successivi." : "Podcast precedenti.";
    }

    previousButton.addEventListener("click", () => scrollShelf(-1));
    nextButton.addEventListener("click", () => scrollShelf(1));
    shelf.addEventListener("scroll", updateControls, { passive: true });
    shelf.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            scrollShelf(event.key === "ArrowRight" ? 1 : -1);
        } else if (event.key === "Home") {
            event.preventDefault();
            shelf.scrollTo({ left: 0, behavior: "smooth" });
        } else if (event.key === "End") {
            event.preventDefault();
            shelf.scrollTo({ left: shelf.scrollWidth, behavior: "smooth" });
        }
    });
    shelf.tabIndex = 0;
    shelf.setAttribute("aria-label", "Scaffale dei podcast italiani");
    window.addEventListener("resize", updateControls, { passive: true });
    window.requestAnimationFrame(updateControls);
}());
