(function () {
    "use strict";

    const library = window.ITALIAN_CURATED_LIBRARY;
    if (!library || !Array.isArray(library.categories) || !Array.isArray(library.creators)) return;

    const shelvesRoot = document.getElementById("creator-shelves");
    const cefrFiltersRoot = document.getElementById("creator-cefr-filters");
    const searchInput = document.getElementById("creator-search");
    const status = document.getElementById("creator-results-status");
    const emptyState = document.getElementById("creator-empty-state");
    const resetButton = document.getElementById("creator-reset");

    const modal = document.getElementById("creator-modal");
    const closeButton = document.getElementById("creator-modal-close");
    const modalImage = document.getElementById("creator-modal-image");
    const modalName = document.getElementById("creator-modal-name");
    const modalCategory = document.getElementById("creator-modal-category");
    const modalCefr = document.getElementById("creator-modal-cefr");
    const modalDescription = document.getElementById("creator-modal-description");
    const modalComment = document.getElementById("creator-modal-comment");
    const modalGuidance = document.getElementById("creator-modal-guidance");
    const modalPlatform = document.getElementById("creator-modal-platform");
    const modalVideo = document.getElementById("creator-modal-video");
    const modalVideoTitle = document.getElementById("creator-modal-video-title");
    const modalLinks = document.getElementById("creator-modal-links");

    if (!shelvesRoot || !cefrFiltersRoot || !searchInput || !modal || !closeButton) return;

    const CEFR_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
    const state = { cefr: "all", query: "" };
    const cefrFilterButtons = [];
    let lastFocusedElement = null;

    function normalize(value) {
        return String(value || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLocaleLowerCase("it");
    }

    function creatorMatches(creator) {
        const declaredLevels = String(creator.cefr || "").match(/A1|A2|B1|B2|C1|C2/g) || [];
        const firstLevelIndex = CEFR_LEVELS.indexOf(declaredLevels[0]);
        const lastLevelIndex = CEFR_LEVELS.indexOf(declaredLevels.at(-1));
        const selectedLevelIndex = CEFR_LEVELS.indexOf(state.cefr);
        const cefrMatches = state.cefr === "all"
            || (firstLevelIndex !== -1
                && lastLevelIndex !== -1
                && selectedLevelIndex >= firstLevelIndex
                && selectedLevelIndex <= lastLevelIndex);
        const haystack = normalize([
            creator.name,
            creator.category,
            creator.description,
            creator.longDescription,
            creator.cefr
        ].join(" "));
        return cefrMatches && haystack.includes(state.query);
    }

    function getProfilePlatform(creator) {
        if (creator.profilePlatform) return creator.profilePlatform;
        const hasInstagram = Array.isArray(creator.links)
            && creator.links.some((link) => link.label.toLocaleLowerCase("it").includes("instagram"));
        return hasInstagram ? "instagram" : "youtube";
    }

    function createCreatorCard(creator) {
        const card = document.createElement("button");
        card.type = "button";
        card.className = "creator-card";
        card.setAttribute("aria-haspopup", "dialog");
        card.setAttribute("aria-label", `Apri la scheda di ${creator.name}, livello ${creator.cefr}`);

        const portrait = document.createElement("span");
        portrait.className = "creator-card-portrait";

        const image = document.createElement("img");
        image.src = creator.image;
        image.alt = `Ritratto o immagine del canale ${creator.name}`;
        image.loading = "lazy";
        image.decoding = "async";
        image.width = 240;
        image.height = 240;
        image.addEventListener("error", () => {
            image.src = "/images/creators/creator-fallback.svg";
            image.alt = `Immagine sostitutiva per ${creator.name}`;
        }, { once: true });
        portrait.appendChild(image);

        const platform = getProfilePlatform(creator);
        const platformBadge = document.createElement("span");
        platformBadge.className = `creator-card-platform creator-card-platform--${platform}`;
        platformBadge.setAttribute("aria-label", platform === "instagram" ? "Profilo Instagram" : "Canale YouTube");
        platformBadge.innerHTML = platform === "instagram"
            ? '<i class="fa-brands fa-instagram" aria-hidden="true"></i>'
            : '<i class="fa-brands fa-youtube" aria-hidden="true"></i>';
        portrait.appendChild(platformBadge);

        const copy = document.createElement("span");
        copy.className = "creator-card-copy";

        const category = document.createElement("small");
        category.textContent = creator.category;

        const name = document.createElement("strong");
        name.textContent = creator.name;

        const description = document.createElement("span");
        description.textContent = creator.description;

        const footer = document.createElement("span");
        footer.className = "creator-card-footer";
        footer.innerHTML = `<span>CEFR ${creator.cefr}</span><span aria-hidden="true">Apri ↗</span>`;

        copy.append(category, name, description, footer);
        card.append(portrait, copy);
        card.addEventListener("click", () => openModal(creator, card));
        return card;
    }

    function renderShelves() {
        shelvesRoot.replaceChildren();
        let hasResults = false;

        library.categories.forEach((category) => {
            const creators = library.creators
                .filter((creator) => creator.categoryId === category.id && creatorMatches(creator))
                .sort((first, second) => {
                    const firstIsLead = first.id === category.leadCreatorId;
                    const secondIsLead = second.id === category.leadCreatorId;
                    return Number(secondIsLead) - Number(firstIsLead)
                        || first.name.localeCompare(second.name, "it");
                });
            if (!creators.length) return;
            hasResults = true;

            const section = document.createElement("section");
            section.className = "creator-shelf";
            section.setAttribute("aria-labelledby", `shelf-${category.id}`);

            const heading = document.createElement("header");
            heading.className = "creator-shelf-heading";

            const headingCopy = document.createElement("div");
            const title = document.createElement("h3");
            title.id = `shelf-${category.id}`;
            title.textContent = category.name;
            headingCopy.append(title);

            const description = document.createElement("p");
            description.textContent = category.description;

            const shelfMeta = document.createElement("div");
            shelfMeta.className = "creator-shelf-meta";

            const controls = document.createElement("div");
            controls.className = "creator-shelf-controls";
            controls.setAttribute("aria-label", `Controlli dello scaffale ${category.name}`);

            const previousButton = document.createElement("button");
            previousButton.type = "button";
            previousButton.className = "creator-shelf-control";
            previousButton.setAttribute("aria-label", `Scorri indietro nello scaffale ${category.name}`);
            previousButton.innerHTML = '<span aria-hidden="true">←</span>';

            const nextButton = document.createElement("button");
            nextButton.type = "button";
            nextButton.className = "creator-shelf-control";
            nextButton.setAttribute("aria-label", `Scorri avanti nello scaffale ${category.name}`);
            nextButton.innerHTML = '<span aria-hidden="true">→</span>';

            controls.append(previousButton, nextButton);
            shelfMeta.append(description, controls);
            heading.append(headingCopy, shelfMeta);

            const rail = document.createElement("div");
            rail.className = "creator-rail";
            rail.id = `rail-${category.id}`;
            rail.tabIndex = 0;
            rail.setAttribute("aria-label", `Creator nello scaffale ${category.name}`);
            creators.forEach((creator) => rail.appendChild(createCreatorCard(creator)));

            function updateRailControls() {
                const maxScroll = Math.max(0, rail.scrollWidth - rail.clientWidth);
                previousButton.disabled = rail.scrollLeft <= 2;
                nextButton.disabled = rail.scrollLeft >= maxScroll - 2;
            }

            function scrollRail(direction) {
                const card = rail.querySelector(".creator-card");
                const distance = card ? card.getBoundingClientRect().width + 20 : rail.clientWidth * 0.8;
                rail.scrollBy({ left: distance * direction, behavior: "smooth" });
            }

            previousButton.addEventListener("click", () => scrollRail(-1));
            nextButton.addEventListener("click", () => scrollRail(1));
            rail.addEventListener("scroll", updateRailControls, { passive: true });
            window.requestAnimationFrame(updateRailControls);

            section.append(heading, rail);
            shelvesRoot.appendChild(section);
        });

        emptyState.hidden = hasResults;
        status.textContent = hasResults ? "Biblioteca aggiornata in base ai filtri." : "Nessun creator corrisponde ai filtri scelti.";
    }

    function setCefr(cefr) {
        state.cefr = cefr;
        cefrFilterButtons.forEach((button) => {
            const selected = button.dataset.cefr === cefr;
            button.setAttribute("aria-pressed", String(selected));
            button.classList.toggle("is-selected", selected);
        });
        renderShelves();
    }

    function createCefrFilter(label, cefr) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = label;
        button.dataset.cefr = cefr;
        button.setAttribute("aria-pressed", String(cefr === state.cefr));
        button.addEventListener("click", () => setCefr(cefr));
        cefrFiltersRoot.appendChild(button);
        cefrFilterButtons.push(button);
    }

    function openModal(creator, trigger) {
        lastFocusedElement = trigger;
        modalImage.src = creator.image;
        modalImage.alt = `Ritratto o immagine del canale ${creator.name}`;
        modalImage.onerror = () => {
            modalImage.onerror = null;
            modalImage.src = "/images/creators/creator-fallback.svg";
            modalImage.alt = `Immagine sostitutiva per ${creator.name}`;
        };
        modalName.textContent = creator.name;
        modalCategory.textContent = creator.category;
        modalCefr.textContent = `CEFR ${creator.cefr}`;
        modalDescription.textContent = creator.longDescription;
        const personalComment = typeof creator.personalComment === "string"
            ? creator.personalComment.trim()
            : "";
        modalComment.textContent = personalComment;
        const personalNote = modalComment.closest(".aljohn-note");
        if (personalNote) personalNote.hidden = !personalComment;
        modalGuidance.textContent = creator.levelGuidance;
        const platform = getProfilePlatform(creator);
        if (modalPlatform) {
            modalPlatform.className = `creator-dialog-platform creator-dialog-platform--${platform}`;
            modalPlatform.setAttribute("aria-label", platform === "instagram" ? "Profilo Instagram" : "Canale YouTube");
            modalPlatform.innerHTML = platform === "instagram"
                ? '<i class="fa-brands fa-instagram" aria-hidden="true"></i>'
                : '<i class="fa-brands fa-youtube" aria-hidden="true"></i>';
        }
        const modalVideoFrame = modalVideo.closest(".video-frame");
        if (creator.sampleVideo?.id) {
            if (modalVideoFrame) modalVideoFrame.hidden = false;
            modalVideoTitle.textContent = creator.sampleVideo.title;
            modalVideo.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(creator.sampleVideo.id)}?rel=0`;
            modalVideo.title = `${creator.sampleVideo.title} — esempio di ${creator.name}`;
        } else {
            if (modalVideoFrame) modalVideoFrame.hidden = true;
            modalVideoTitle.textContent = creator.sampleUnavailableReason
                || "Nessun video YouTube verificato per questa scheda";
            modalVideo.src = "about:blank";
            modalVideo.title = "Nessun video di esempio selezionato";
        }

        modalLinks.replaceChildren();
        creator.links.forEach((link) => {
            const anchor = document.createElement("a");
            anchor.href = link.url;
            anchor.target = "_blank";
            anchor.rel = "noopener noreferrer";
            anchor.textContent = `${link.label} ↗`;
            modalLinks.appendChild(anchor);
        });

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        window.requestAnimationFrame(() => closeButton.focus());
    }

    function closeModal() {
        if (modal.hidden) return;
        modal.setAttribute("aria-hidden", "true");
        modal.hidden = true;
        modalVideo.src = "about:blank";
        document.body.classList.remove("modal-open");
        if (lastFocusedElement && document.contains(lastFocusedElement)) lastFocusedElement.focus();
    }

    function trapFocus(event) {
        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
            return;
        }
        if (event.key !== "Tab") return;

        const focusable = Array.from(modal.querySelectorAll(
            'button:not([disabled]), a[href], iframe, input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter((element) => !element.closest("[hidden]"));
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
    }

    createCefrFilter("Tutti i livelli", "all");
    CEFR_LEVELS.forEach((level) => createCefrFilter(level, level));

    searchInput.addEventListener("input", () => {
        state.query = normalize(searchInput.value.trim());
        renderShelves();
    });

    resetButton.addEventListener("click", () => {
        searchInput.value = "";
        state.query = "";
        setCefr("all");
        searchInput.focus();
    });

    closeButton.addEventListener("click", closeModal);
    modal.querySelectorAll("[data-modal-close]").forEach((element) => element.addEventListener("click", closeModal));
    modal.addEventListener("keydown", trapFocus);
    document.addEventListener("keydown", (event) => {
        if (!modal.hidden && event.key === "Escape") {
            event.preventDefault();
            closeModal();
        }
    });
    renderShelves();
})();
