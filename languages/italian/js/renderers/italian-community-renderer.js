(function () {
    "use strict";

    const chapters = window.ITALIAN_COMMUNITY_CHAPTERS;
    const root = document.getElementById("italian-community-chapters");
    const lightbox = document.getElementById("community-lightbox");
    const lightboxImage = document.getElementById("community-lightbox-image");
    const lightboxTitle = document.getElementById("community-lightbox-title");
    const lightboxCaption = document.getElementById("community-lightbox-caption");
    const lightboxClose = document.getElementById("community-lightbox-close");

    if (!Array.isArray(chapters) || !root || !lightbox || !lightboxClose) return;

    let lightboxTrigger = null;

    function openLightbox(chapter, photo, trigger) {
        lightboxTrigger = trigger;
        lightboxImage.src = photo.src;
        lightboxImage.alt = photo.alt;
        lightboxTitle.textContent = chapter.name;
        lightboxCaption.textContent = photo.caption;
        lightbox.hidden = false;
        lightbox.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        requestAnimationFrame(() => lightboxClose.focus());
    }

    function closeLightbox() {
        if (lightbox.hidden) return;
        lightbox.hidden = true;
        lightbox.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        if (lightboxTrigger && document.contains(lightboxTrigger)) lightboxTrigger.focus();
    }

    function createChapter(chapter, chapterIndex) {
        let currentIndex = 0;
        const article = document.createElement("article");
        article.className = "community-chapter";
        article.id = `community-${chapter.id}`;

        const story = document.createElement("div");
        story.className = "community-chapter-story";
        const folio = document.createElement("p");
        folio.className = "folio";
        folio.textContent = chapter.kind;
        const title = document.createElement("h3");
        title.id = `community-title-${chapter.id}`;
        title.textContent = chapter.name;
        const lead = document.createElement("p");
        lead.className = "community-chapter-lead";
        lead.textContent = chapter.lead;
        const copy = document.createElement("p");
        copy.className = "community-chapter-copy";
        copy.textContent = chapter.story;
        const link = document.createElement("a");
        link.className = "text-link";
        link.href = chapter.link;
        link.textContent = `${chapter.linkLabel} →`;
        story.append(folio, title, lead, copy, link);

        if (chapter.mark) {
            const mark = document.createElement("img");
            mark.className = "community-chapter-mark";
            mark.src = chapter.mark;
            mark.alt = `Logo di ${chapter.name}`;
            story.insertBefore(mark, title);
        }

        const carousel = document.createElement("div");
        carousel.className = "community-carousel";
        carousel.setAttribute("role", "region");
        carousel.setAttribute("aria-roledescription", "carosello");
        carousel.setAttribute("aria-label", `Fotografie: ${chapter.name}`);

        const stage = document.createElement("button");
        stage.className = "community-carousel-stage";
        stage.type = "button";

        const image = document.createElement("img");
        image.loading = chapterIndex === 0 ? "eager" : "lazy";
        const caption = document.createElement("span");
        caption.className = "community-carousel-caption";

        const position = document.createElement("span");
        position.className = "community-carousel-position";
        position.setAttribute("aria-live", "polite");

        stage.append(image, caption, position);

        const controls = document.createElement("div");
        controls.className = "community-carousel-controls";
        const previous = document.createElement("button");
        previous.type = "button";
        previous.className = "carousel-arrow";
        previous.setAttribute("aria-label", `Foto precedente di ${chapter.name}`);
        previous.innerHTML = '<span aria-hidden="true">←</span>';
        const next = document.createElement("button");
        next.type = "button";
        next.className = "carousel-arrow";
        next.setAttribute("aria-label", `Foto successiva di ${chapter.name}`);
        next.innerHTML = '<span aria-hidden="true">→</span>';
        const thumbs = document.createElement("div");
        thumbs.className = "community-carousel-thumbs";
        controls.append(previous, thumbs, next);

        const thumbButtons = chapter.photos.map((photo, photoIndex) => {
            const button = document.createElement("button");
            button.type = "button";
            button.setAttribute("aria-label", `Vai alla foto ${photoIndex + 1} di ${chapter.name}`);
            const thumb = document.createElement("img");
            thumb.src = photo.src;
            thumb.alt = "";
            thumb.loading = "lazy";
            button.appendChild(thumb);
            button.addEventListener("click", () => show(photoIndex));
            thumbs.appendChild(button);
            return button;
        });

        function show(index) {
            currentIndex = (index + chapter.photos.length) % chapter.photos.length;
            const photo = chapter.photos[currentIndex];
            image.src = photo.src;
            image.alt = photo.alt;
            caption.textContent = photo.caption;
            position.textContent = `${String(currentIndex + 1).padStart(2, "0")} / ${String(chapter.photos.length).padStart(2, "0")}`;
            stage.setAttribute("aria-label", `Ingrandisci la foto ${currentIndex + 1} di ${chapter.name}: ${photo.caption}`);
            thumbButtons.forEach((button, indexValue) => button.setAttribute("aria-pressed", String(indexValue === currentIndex)));
        }

        previous.addEventListener("click", () => show(currentIndex - 1));
        next.addEventListener("click", () => show(currentIndex + 1));
        stage.addEventListener("click", () => openLightbox(chapter, chapter.photos[currentIndex], stage));
        carousel.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                event.preventDefault();
                show(currentIndex - 1);
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                show(currentIndex + 1);
            }
        });

        carousel.append(stage, controls);
        article.append(story, carousel);
        show(0);
        return article;
    }

    chapters.forEach((chapter, index) => root.appendChild(createChapter(chapter, index)));

    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.querySelectorAll("[data-lightbox-close]").forEach((element) => element.addEventListener("click", closeLightbox));
    lightbox.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeLightbox();
        } else if (event.key === "Tab") {
            event.preventDefault();
            lightboxClose.focus();
        }
    });
})();
