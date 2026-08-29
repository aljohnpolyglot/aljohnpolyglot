function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (typeof text === "string") element.textContent = text;
    return element;
}

function focusableElements(root) {
    return [...root.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')]
        .filter((element) => !element.hidden && element.getClientRects().length > 0);
}

export function renderIndonesianBooks({ books, shelf, previousButton, nextButton, modal }) {
    if (!shelf || !previousButton || !nextButton || !modal) return;

    const dialog = modal.querySelector(".book-dialog-id");
    const closeButton = modal.querySelector("[data-book-modal-close-button]");
    const cover = modal.querySelector("[data-book-modal-cover]");
    const coverFallback = modal.querySelector("[data-book-modal-cover-fallback]");
    const category = modal.querySelector("[data-book-modal-category]");
    const title = modal.querySelector("[data-book-modal-title]");
    const author = modal.querySelector("[data-book-modal-author]");
    const level = modal.querySelector("[data-book-modal-level]");
    const description = modal.querySelector("[data-book-modal-description]");
    const guidance = modal.querySelector("[data-book-modal-guidance]");
    const source = modal.querySelector("[data-book-modal-source]");
    const links = modal.querySelector("[data-book-modal-links]");

    if (!dialog || !closeButton || !cover || !coverFallback || !category || !title || !author || !level || !description || !guidance || !source || !links) return;

    let activeBook = null;
    let lastTrigger = null;
    let previousBodyOverflow = "";

    const showCoverFallback = (image, fallback, bookTitle) => {
        image.hidden = true;
        fallback.hidden = false;
        fallback.textContent = bookTitle;
    };

    const updateShelfControls = () => {
        const maximumScroll = Math.max(0, shelf.scrollWidth - shelf.clientWidth);
        previousButton.disabled = shelf.scrollLeft <= 4;
        nextButton.disabled = shelf.scrollLeft >= maximumScroll - 4;
    };

    const closeModal = () => {
        if (modal.hidden) return;
        modal.hidden = true;
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("book-modal-open-id");
        document.body.style.overflow = previousBodyOverflow;
        links.replaceChildren();
        lastTrigger?.focus();
        activeBook = null;
        lastTrigger = null;
    };

    const openModal = (book, trigger) => {
        activeBook = book;
        lastTrigger = trigger;

        cover.hidden = false;
        coverFallback.hidden = true;
        cover.src = book.coverImage;
        cover.alt = book.coverAlt;
        cover.width = book.coverWidth;
        cover.height = book.coverHeight;
        coverFallback.textContent = book.title;
        category.textContent = book.category;
        title.textContent = book.title;
        author.textContent = book.author;
        level.textContent = `Tingkat yang disarankan · ${book.levels.join("–")}`;
        description.textContent = book.longDescription;
        guidance.textContent = book.guidance;
        source.textContent = book.sourceLabel;
        links.replaceChildren();

        if (book.officialLink) {
            const link = createElement("a", "book-dialog-link-id", book.sourceAction);
            link.href = book.officialLink;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            links.appendChild(link);
        }

        previousBodyOverflow = document.body.style.overflow;
        modal.hidden = false;
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("book-modal-open-id");
        document.body.style.overflow = "hidden";
        closeButton.focus();
    };

    const renderCard = (book) => {
        const item = createElement("li", "book-item-id");
        const button = createElement("button", "book-card-id");
        const media = createElement("span", "book-card-media-id");
        const image = document.createElement("img");
        const fallback = createElement("span", "book-cover-fallback-id", book.title);
        const copy = createElement("span", "book-card-copy-id");
        const bookCategory = createElement("span", "book-card-category-id", book.category);
        const bookTitle = createElement("strong", "book-card-title-id", book.title);
        const bookAuthor = createElement("span", "book-card-author-id", book.author);
        const bookLevel = createElement("span", "book-card-level-id", `CEFR · ${book.levels.join("–")}`);
        const bookDescription = createElement("span", "book-card-description-id", book.shortDescription);
        const action = createElement("span", "book-card-action-id", "Buka detail buku");

        button.type = "button";
        button.setAttribute("aria-haspopup", "dialog");
        button.setAttribute("aria-controls", modal.id);
        button.setAttribute("aria-label", `Buka detail ${book.title}, tingkat ${book.levels.join(" sampai ")}`);
        button.addEventListener("click", () => openModal(book, button));

        image.src = book.coverImage;
        image.alt = book.coverAlt;
        image.width = book.coverWidth;
        image.height = book.coverHeight;
        image.loading = "lazy";
        image.decoding = "async";
        fallback.hidden = true;
        fallback.setAttribute("aria-hidden", "true");
        image.addEventListener("error", () => showCoverFallback(image, fallback, book.title), { once: true });

        media.append(image, fallback);
        copy.append(bookCategory, bookTitle, bookAuthor, bookLevel, bookDescription, action);
        button.append(media, copy);
        item.appendChild(button);
        return item;
    };

    shelf.replaceChildren();
    if (!Array.isArray(books) || books.length === 0) {
        const empty = createElement("li", "books-empty-id", "Buku Bahasa Indonesia belum dapat dimuat. Silakan muat ulang halaman ini.");
        empty.setAttribute("role", "alert");
        shelf.appendChild(empty);
        previousButton.disabled = true;
        nextButton.disabled = true;
        return;
    }

    books.forEach((book) => shelf.appendChild(renderCard(book)));

    cover.addEventListener("error", () => {
        showCoverFallback(cover, coverFallback, activeBook?.title || "Buku");
    });
    modal.querySelectorAll("[data-book-modal-close]").forEach((control) => control.addEventListener("click", closeModal));
    modal.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            closeModal();
            return;
        }
        if (event.key !== "Tab") return;
        const focusable = focusableElements(dialog);
        if (!focusable.length) {
            event.preventDefault();
            dialog.focus();
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

    const scrollShelf = (direction) => {
        shelf.scrollBy({
            left: direction * Math.max(280, shelf.clientWidth * 0.82),
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
        });
    };

    previousButton.addEventListener("click", () => scrollShelf(-1));
    nextButton.addEventListener("click", () => scrollShelf(1));
    shelf.addEventListener("scroll", updateShelfControls, { passive: true });
    window.addEventListener("resize", updateShelfControls, { passive: true });
    window.requestAnimationFrame(updateShelfControls);
}
