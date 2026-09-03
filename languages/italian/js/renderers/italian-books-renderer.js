(function renderItalianBookshelf() {
    "use strict";

    const shelf = document.getElementById("italian-books-shelf");
    const previousButton = document.getElementById("italian-books-previous");
    const nextButton = document.getElementById("italian-books-next");
    const status = document.getElementById("italian-books-status");
    const modal = document.getElementById("italian-book-modal");
    const modalDialog = modal?.querySelector(".italian-book-dialog");
    const modalClose = document.getElementById("italian-book-modal-close");
    const modalCover = document.getElementById("italian-book-modal-cover");
    const modalSource = document.getElementById("italian-book-modal-source");
    const modalCategory = document.getElementById("italian-book-modal-category");
    const modalTitle = document.getElementById("italian-book-modal-title");
    const modalAuthor = document.getElementById("italian-book-modal-author");
    const modalLevel = document.getElementById("italian-book-modal-level");
    const modalDescription = document.getElementById("italian-book-modal-description");
    const modalGuidance = document.getElementById("italian-book-modal-guidance");
    const modalLinks = document.getElementById("italian-book-modal-links");
    const books = Array.isArray(window.publicDomainBooks)
        ? window.publicDomainBooks.filter((book) => book.language === "it")
        : [];
    const pageCopy = window.italianBookPageData || {};

    if (
        !shelf || !previousButton || !nextButton || !status || !modal || !modalDialog
        || !modalClose || !modalCover || !modalSource || !modalCategory || !modalTitle
        || !modalAuthor || !modalLevel || !modalDescription || !modalGuidance || !modalLinks
    ) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const state = { activeBook: null, trigger: null, closeTimer: null };
    function getLevelLabel(levels) {
        const values = Array.isArray(levels) ? levels : [levels];
        return values.filter(Boolean).join("–") || "Livello aperto";
    }

    function getGuidance(book) {
        if (pageCopy[book.id]?.guidance) return pageCopy[book.id].guidance;
        if (book.aljohnsNotes) return book.aljohnsNotes;
        const levels = Array.isArray(book.recommendedCEFR)
            ? book.recommendedCEFR
            : [book.recommendedCEFR];
        if (levels.includes("A2") || levels.includes("B1")) {
            return "Procedi per capitoli brevi, annota le parole che ritornano e lascia che la trama sostenga ciò che non capisci ancora.";
        }
        if (levels.includes("C1")) {
            return "Leggi una scena alla volta con un glossario vicino. Prima segui l’azione, poi torna sui periodi lunghi e sul lessico storico.";
        }
        return "Affianca il testo a note o a un’edizione commentata. Qui il ritmo lento conta più della quantità: poche pagine, rilette con attenzione.";
    }

    function getDescription(book) {
        return pageCopy[book.id]?.description || book.description;
    }

    function getGenres(book) {
        return pageCopy[book.id]?.genres || book.genres || [];
    }

    function createBookCard(book) {
        const item = document.createElement("li");
        const card = document.createElement("button");
        const coverWrap = document.createElement("span");
        const cover = document.createElement("img");
        const copy = document.createElement("span");
        const level = document.createElement("span");
        const title = document.createElement("strong");
        const author = document.createElement("span");
        const description = document.createElement("span");
        const action = document.createElement("span");

        item.className = "italian-book-item";
        card.type = "button";
        card.className = "italian-book-card";
        card.dataset.italianBookId = book.id;
        card.setAttribute("aria-haspopup", "dialog");
        card.setAttribute("aria-controls", "italian-book-modal");
        card.setAttribute("aria-label", `Apri la scheda di ${book.title}, livello ${getLevelLabel(book.recommendedCEFR)}`);

        coverWrap.className = "italian-book-cover";
        cover.src = book.coverImg;
        cover.alt = `Copertina di ${book.title}`;
        cover.loading = "lazy";
        cover.decoding = "async";
        cover.width = 360;
        cover.height = 540;
        cover.addEventListener("error", () => {
            cover.src = "/library/images/assets/open_book_flipping_icon.png";
            cover.alt = `Copertina non disponibile per ${book.title}`;
        }, { once: true });
        coverWrap.appendChild(cover);

        copy.className = "italian-book-copy";
        level.className = "italian-book-level";
        level.textContent = `CEFR ${getLevelLabel(book.recommendedCEFR)}`;
        title.textContent = book.title;
        author.className = "italian-book-author";
        author.textContent = book.author;
        description.className = "italian-book-description";
        description.textContent = getDescription(book);
        action.className = "italian-book-card-action";
        action.textContent = "Apri la scheda →";

        copy.append(level, title, author, description, action);
        card.append(coverWrap, copy);
        item.appendChild(card);
        return item;
    }

    function renderModalLinks(book) {
        const links = [];
        if (book.epubLink) links.push({ label: "Apri EPUB", href: book.epubLink, external: true });
        if (book.pdfLink) links.push({ label: "Apri PDF", href: book.pdfLink, external: true });

        modalLinks.replaceChildren(...links.map((link, index) => {
            const anchor = document.createElement("a");
            anchor.className = index === 0 ? "button button--primary" : "text-link";
            anchor.href = link.href;
            anchor.textContent = link.label;
            if (link.external) {
                anchor.target = "_blank";
                anchor.rel = "noopener noreferrer";
            }
            return anchor;
        }));
    }

    function openModal(book, trigger) {
        if (state.closeTimer) {
            window.clearTimeout(state.closeTimer);
            state.closeTimer = null;
        }
        state.activeBook = book;
        state.trigger = trigger;
        modalCover.onerror = () => {
            modalCover.onerror = null;
            modalCover.src = "/library/images/assets/open_book_flipping_icon.png";
            modalCover.alt = `Copertina non disponibile per ${book.title}`;
        };
        modalCover.src = book.coverImg;
        modalCover.alt = `Copertina di ${book.title}`;
        modalSource.textContent = "Dalla biblioteca condivisa di Aljohn";
        modalCategory.textContent = getGenres(book).join(" · ");
        modalTitle.textContent = book.title;
        modalAuthor.textContent = book.author;
        modalLevel.textContent = `Livello consigliato · ${getLevelLabel(book.recommendedCEFR)}`;
        modalDescription.textContent = getDescription(book);
        modalGuidance.textContent = getGuidance(book);
        renderModalLinks(book);

        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("italian-book-modal-open");
        window.requestAnimationFrame(() => {
            modal.classList.add("open");
            modalClose.focus();
        });
    }

    function closeModal() {
        if (modal.hidden) return;
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("italian-book-modal-open");
        state.closeTimer = window.setTimeout(() => {
            modal.hidden = true;
            modalLinks.replaceChildren();
            state.trigger?.focus();
            state.activeBook = null;
            state.trigger = null;
            state.closeTimer = null;
        }, reducedMotion.matches ? 0 : 160);
    }

    function updateControls() {
        const maxScroll = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
        previousButton.disabled = shelf.scrollLeft <= 2;
        nextButton.disabled = shelf.scrollLeft >= maxScroll - 2;
    }

    function scrollShelf(direction) {
        const card = shelf.querySelector(".italian-book-item");
        const distance = card ? card.getBoundingClientRect().width + 24 : shelf.clientWidth * 0.8;
        shelf.scrollBy({
            left: distance * direction,
            behavior: reducedMotion.matches ? "auto" : "smooth"
        });
    }

    if (!books.length) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "italian-books-empty";
        emptyItem.textContent = "Lo scaffale non è disponibile. Riprova dopo aver ricaricato la pagina.";
        shelf.appendChild(emptyItem);
        previousButton.disabled = true;
        nextButton.disabled = true;
        status.textContent = "Scaffale non disponibile.";
        return;
    }

    shelf.replaceChildren(...books.map(createBookCard));
    shelf.tabIndex = 0;
    shelf.setAttribute("aria-label", "Scaffale dei classici italiani");
    status.textContent = "Scaffale pronto.";

    shelf.addEventListener("click", (event) => {
        const card = event.target.closest("[data-italian-book-id]");
        if (!card || !shelf.contains(card)) return;
        const book = books.find((item) => item.id === card.dataset.italianBookId);
        if (book) openModal(book, card);
    });
    modal.addEventListener("click", (event) => {
        if (event.target.closest("[data-italian-book-modal-close]")) closeModal();
    });
    modalClose.addEventListener("click", closeModal);
    previousButton.addEventListener("click", () => scrollShelf(-1));
    nextButton.addEventListener("click", () => scrollShelf(1));
    shelf.addEventListener("scroll", updateControls, { passive: true });
    shelf.addEventListener("keydown", (event) => {
        if (event.target.closest("[data-italian-book-id]")) return;
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            scrollShelf(event.key === "ArrowLeft" ? -1 : 1);
        } else if (event.key === "Home" || event.key === "End") {
            event.preventDefault();
            shelf.scrollTo({
                left: event.key === "Home" ? 0 : shelf.scrollWidth,
                behavior: reducedMotion.matches ? "auto" : "smooth"
            });
        }
    });
    document.addEventListener("keydown", (event) => {
        if (modal.hidden) return;
        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = Array.from(modalDialog.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        ));
        if (!focusable.length) {
            event.preventDefault();
            modalDialog.focus();
            return;
        }
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
    window.addEventListener("resize", updateControls, { passive: true });
    window.requestAnimationFrame(updateControls);
}());
