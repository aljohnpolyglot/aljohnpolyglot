const shelfDescriptions = {
    musik: "Mulai dari refrein yang mudah diingat, lalu kembali untuk menangkap ungkapan puitis dan warna suara.",
    hiburan: "Wawancara, komedi, dan percakapan spontan untuk mengikuti bahasa Indonesia sebagaimana dipakai sehari-hari.",
    edukasi: "Percakapan panjang untuk telinga yang siap mengikuti gagasan, argumen, dan ragam formal.",
    olahraga: "Cerita pemain, pertandingan, dan istilah lapangan dengan bantuan konteks visual yang kuat.",
    gaming: "Komentar langsung, permainan, dan bahasa internet Indonesia dengan tempo yang hidup.",
    budaya: "Bahasa sehari-hari, perjalanan, dan sudut pandang yang membuka pintu ke kebiasaan Indonesia."
};

const cefrOrder = ["A1", "A2", "B1", "B2", "C1", "C2"];

function levelsForCreator(creator) {
    const range = String(creator.cefr || "").toUpperCase().match(/[ABC][12]/g) || [];
    if (!range.length) return [];
    if (range.length === 1) return range;
    const start = cefrOrder.indexOf(range[0]);
    const end = cefrOrder.indexOf(range.at(-1));
    if (start < 0 || end < start) return [...new Set(range)];
    return cefrOrder.slice(start, end + 1);
}

function createImage(creator) {
    const image = document.createElement("img");
    image.src = creator.image;
    image.alt = creator.imageAlt || creator.name;
    image.width = 900;
    image.height = 900;
    image.loading = "lazy";
    image.decoding = "async";
    image.addEventListener("error", () => {
        if (!image.src.endsWith("creator-fallback.svg")) {
            image.src = "../../images/creators/creator-fallback.svg";
        }
    }, { once: true });
    return image;
}

function focusableElements(root) {
    return [...root.querySelectorAll('a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hasAttribute("hidden"));
}

export async function renderCreatorShelves({ container, modal, modalContent, levelControls, levelStatus }) {
    if (!container || !modal || !modalContent) return;

    const response = await fetch("js/data/indonesian-creators-data.json");
    if (!response.ok) throw new Error(`Data kreator gagal dimuat (${response.status})`);
    const data = await response.json();
    const publishableCreators = data.creators;
    const shelfRecords = [];
    let lastTrigger = null;

    const closeModal = () => {
        if (modal.hidden) return;
        modal.hidden = true;
        document.body.classList.remove("modal-open");
        modalContent.replaceChildren();
        lastTrigger?.focus();
        lastTrigger = null;
    };

    const handleModalKeydown = (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = focusableElements(modal);
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
    };

    const openModal = (creator, trigger) => {
        lastTrigger = trigger;

        const layout = document.createElement("div");
        layout.className = "creator-modal-layout-id";
        const media = document.createElement("div");
        media.className = "creator-modal-media-id";
        media.append(createImage(creator));

        const video = document.createElement("div");
        video.className = "creator-video-id";
        if (creator.sampleVideo?.id) {
            const iframe = document.createElement("iframe");
            iframe.src = `https://www.youtube-nocookie.com/embed/${creator.sampleVideo.id}?rel=0`;
            iframe.title = creator.sampleVideo.title ? `${creator.sampleVideo.title} — contoh dari ${creator.name}` : `Contoh video dari ${creator.name}`;
            iframe.loading = "lazy";
            iframe.allow = "accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
            iframe.allowFullscreen = true;
            video.append(iframe);
        } else {
            const unavailable = document.createElement("p");
            unavailable.textContent = "Contoh video belum tersedia.";
            video.append(unavailable);
        }
        const copy = document.createElement("div");
        copy.className = "creator-modal-copy-id";
        const meta = document.createElement("p");
        const heading = document.createElement("h2");
        const description = document.createElement("p");
        const videoLabel = document.createElement("p");
        const note = document.createElement("div");
        const noteLabel = document.createElement("strong");
        const noteText = document.createElement("span");
        const guidance = document.createElement("p");
        const links = document.createElement("div");

        meta.textContent = `${creator.category} · ${creator.cefr}`;
        heading.id = "creator-modal-title";
        heading.textContent = creator.name;
        description.textContent = creator.longDescription || creator.description;
        videoLabel.className = "creator-video-label-id";
        videoLabel.textContent = "Contoh video pilihan";
        if (creator.personalComment?.trim()) {
            note.className = "creator-note-id";
            noteLabel.textContent = "Catatan Aljohn";
            noteText.textContent = creator.personalComment;
            note.append(noteLabel, noteText);
        }
        guidance.className = "creator-guidance-id";
        guidance.textContent = creator.levelGuidance;
        links.className = "creator-links-id";

        creator.links.forEach((item) => {
            const link = document.createElement("a");
            link.href = item.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = `${item.label} ↗`;
            links.append(link);
        });

        copy.append(meta, heading, description, videoLabel, video);
        if (note.childElementCount) copy.append(note);
        copy.append(guidance, links);
        layout.append(media, copy);
        modalContent.replaceChildren(layout);
        modal.hidden = false;
        document.body.classList.add("modal-open");
        modal.querySelector("button[data-modal-close]")?.focus();
    };

    data.categories.forEach((category) => {
        const creators = publishableCreators.filter((creator) => creator.categoryId === category.id);
        if (!creators.length) return;

        const shelf = document.createElement("section");
        shelf.className = "creator-shelf-id";
        shelf.setAttribute("aria-labelledby", `creator-shelf-${category.id}`);
        const heading = document.createElement("header");
        heading.className = "shelf-heading-id";
        const headingCopy = document.createElement("div");
        const title = document.createElement("h3");
        const description = document.createElement("p");
        const controls = document.createElement("div");
        const previous = document.createElement("button");
        const next = document.createElement("button");
        const row = document.createElement("div");

        title.id = `creator-shelf-${category.id}`;
        title.textContent = category.title;
        description.textContent = shelfDescriptions[category.id] || "Buka satu profil untuk melihat panduan tingkat, video contoh, dan tautan resmi.";
        controls.className = "shelf-controls-id";
        previous.type = "button";
        previous.className = "shelf-control-id";
        previous.setAttribute("aria-label", `Geser ${category.title} ke kiri`);
        previous.textContent = "←";
        next.type = "button";
        next.className = "shelf-control-id";
        next.setAttribute("aria-label", `Geser ${category.title} ke kanan`);
        next.textContent = "→";
        controls.append(previous, next);
        headingCopy.append(title, description);
        heading.append(headingCopy, controls);

        row.className = "creator-row-id";
        row.setAttribute("aria-label", category.title);
        const cardRecords = [];
        creators.forEach((creator) => {
            const card = document.createElement("button");
            const cardCopy = document.createElement("span");
            const meta = document.createElement("span");
            const name = document.createElement("strong");
            const hint = document.createElement("small");
            card.type = "button";
            card.className = "creator-card-id";
            card.setAttribute("aria-haspopup", "dialog");
            card.setAttribute("aria-label", `Buka profil ${creator.name}`);
            cardCopy.className = "creator-card-copy-id";
            meta.textContent = `${creator.category} · ${creator.cefr}`;
            name.textContent = creator.name;
            hint.textContent = creator.description;
            cardCopy.append(meta, name, hint);
            card.append(createImage(creator), cardCopy);
            card.addEventListener("click", () => openModal(creator, card));
            row.append(card);
            cardRecords.push({ card, levels: levelsForCreator(creator) });
        });

        const scrollShelf = (direction) => {
            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            row.scrollBy({
                left: direction * Math.max(row.clientWidth * 0.78, 260),
                behavior: reducedMotion ? "auto" : "smooth"
            });
        };
        previous.addEventListener("click", () => scrollShelf(-1));
        next.addEventListener("click", () => scrollShelf(1));

        shelf.append(heading, row);
        container.append(shelf);
        shelfRecords.push({ shelf, cardRecords });
    });

    if (levelControls) {
        const availableLevels = cefrOrder.filter((level) =>
            shelfRecords.some(({ cardRecords }) => cardRecords.some(({ levels }) => levels.includes(level)))
        );
        const filterLevels = ["all", ...availableLevels];

        const applyLevelFilter = (selectedLevel) => {
            shelfRecords.forEach(({ shelf, cardRecords }) => {
                let visibleCards = 0;
                cardRecords.forEach(({ card, levels }) => {
                    const visible = selectedLevel === "all" || levels.includes(selectedLevel);
                    card.hidden = !visible;
                    if (visible) visibleCards += 1;
                });
                shelf.hidden = visibleCards === 0;
            });

            levelControls.querySelectorAll("button[data-cefr-level]").forEach((button) => {
                button.setAttribute("aria-pressed", String(button.dataset.cefrLevel === selectedLevel));
            });
            if (levelStatus) {
                levelStatus.textContent = selectedLevel === "all"
                    ? "Semua tingkat ditampilkan."
                    : `Kreator untuk tingkat ${selectedLevel} ditampilkan.`;
            }
        };

        filterLevels.forEach((level) => {
            const button = document.createElement("button");
            button.type = "button";
            button.dataset.cefrLevel = level;
            button.setAttribute("aria-pressed", String(level === "all"));
            button.setAttribute("aria-label", level === "all" ? "Tampilkan semua tingkat CEFR" : `Tampilkan kreator tingkat ${level}`);
            button.textContent = level === "all" ? "Semua" : level;
            button.addEventListener("click", () => applyLevelFilter(level));
            levelControls.append(button);
        });
    }

    modal.querySelectorAll("[data-modal-close]").forEach((control) => control.addEventListener("click", closeModal));
    modal.addEventListener("keydown", handleModalKeydown);
}
