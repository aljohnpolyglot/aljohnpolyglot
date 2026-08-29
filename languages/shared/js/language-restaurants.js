(function () {
    "use strict";

    const config = window.languageRestaurantShelfConfig;
    if (!config) return;

    const section = document.querySelector("[data-language-restaurant-shelf]");
    const rail = section?.querySelector("[data-language-restaurant-rail]");
    if (!section || !rail) return;

    const labels = config.labels || {};
    let activeOverlay = null;
    let activeTrigger = null;
    let previousBodyOverflow = "";

    function createElement(tagName, className, text) {
        const node = document.createElement(tagName);
        if (className) node.className = className;
        if (typeof text === "string") node.textContent = text;
        return node;
    }

    function wireImageFallback(image) {
        image.addEventListener("error", () => {
            if (!config.fallbackImage || image.dataset.fallbackApplied === "true") {
                image.hidden = true;
                return;
            }
            image.dataset.fallbackApplied = "true";
            image.classList.add("is-fallback");
            image.src = config.fallbackImage;
        });
    }

    function getFocusable(dialog) {
        return Array.from(dialog.querySelectorAll(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )).filter((node) => !node.hidden && node.getClientRects().length > 0);
    }

    function closeDialog() {
        if (!activeOverlay) return;
        const trigger = activeTrigger;
        activeOverlay.remove();
        activeOverlay = null;
        activeTrigger = null;
        document.body.classList.remove("restaurant-dialog-open");
        document.body.style.overflow = previousBodyOverflow;
        trigger?.focus();
    }

    function appendLink(container, link) {
        if (!link?.url || !link?.label) return;
        const anchor = createElement("a", "restaurant-place-dialog__link", link.label);
        anchor.href = link.url;
        anchor.target = "_blank";
        anchor.rel = "noopener noreferrer";
        container.appendChild(anchor);
    }

    function openDialog(item, trigger) {
        closeDialog();

        const overlay = createElement("div", "restaurant-place-overlay");
        const dialog = createElement("div", "restaurant-place-dialog");
        const closeButton = createElement("button", "restaurant-place-dialog__close", "×");
        const media = createElement("div", "restaurant-place-dialog__media");
        const image = document.createElement("img");
        const body = createElement("div", "restaurant-place-dialog__body");
        const title = createElement("h2", "restaurant-place-dialog__title", item.name);
        const city = createElement("p", "restaurant-place-dialog__city", item.city);
        const description = createElement("p", "restaurant-place-dialog__description", item.description);
        const addressGroup = createElement("div", "restaurant-place-dialog__address");
        const addressLabel = createElement("span", "restaurant-place-dialog__label", labels.address || "Address");
        const address = createElement("p", "", item.address);
        const links = createElement("div", "restaurant-place-dialog__links");

        overlay.addEventListener("click", (event) => {
            if (event.target === overlay) closeDialog();
        });
        overlay.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                closeDialog();
                return;
            }
            if (event.key !== "Tab") return;
            const focusable = getFocusable(dialog);
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

        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-modal", "true");
        dialog.setAttribute("aria-labelledby", `${config.idPrefix}-restaurant-title-${item.id}`);
        dialog.tabIndex = -1;
        title.id = `${config.idPrefix}-restaurant-title-${item.id}`;
        closeButton.type = "button";
        closeButton.setAttribute("aria-label", labels.close || "Close");
        closeButton.addEventListener("click", closeDialog);

        image.src = item.image;
        image.alt = item.imageAlt;
        image.width = 960;
        image.height = 540;
        image.decoding = "async";
        wireImageFallback(image);
        media.appendChild(image);

        addressGroup.append(addressLabel, address);
        (item.links || []).forEach((link) => appendLink(links, link));
        if (item.videoUrl) {
            appendLink(links, {
                label: item.videoLabel || labels.watchVideo || "Watch Aljohn's video",
                url: item.videoUrl
            });
        }

        body.append(title, city, description, addressGroup);
        if (item.contact) {
            const contactGroup = createElement("div", "restaurant-place-dialog__contact");
            contactGroup.append(
                createElement("span", "restaurant-place-dialog__label", labels.contact || "Contact"),
                createElement("p", "", item.contact)
            );
            body.appendChild(contactGroup);
        }
        body.appendChild(links);
        dialog.append(closeButton, media, body);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        activeOverlay = overlay;
        activeTrigger = trigger;
        previousBodyOverflow = document.body.style.overflow;
        document.body.classList.add("restaurant-dialog-open");
        document.body.style.overflow = "hidden";
        closeButton.focus();
    }

    function renderCard(item) {
        const article = createElement("article", "restaurant-place-card");
        const trigger = createElement("button", "restaurant-place-card__trigger");
        const media = createElement("span", "restaurant-place-card__media");
        const image = document.createElement("img");
        const copy = createElement("span", "restaurant-place-card__copy");
        const city = createElement("span", "restaurant-place-card__city", item.city);
        const name = createElement("span", "restaurant-place-card__name", item.name);
        const summary = createElement("span", "restaurant-place-card__summary", item.summary);
        const action = createElement("span", "restaurant-place-card__action", labels.details || "Details");

        trigger.type = "button";
        trigger.setAttribute("aria-haspopup", "dialog");
        trigger.setAttribute("aria-label", `${labels.details || "Details"}: ${item.name}`);
        trigger.addEventListener("click", () => openDialog(item, trigger));

        image.src = item.logo || item.image;
        image.alt = item.logoAlt || item.imageAlt;
        image.width = 960;
        image.height = 540;
        image.loading = "lazy";
        image.decoding = "async";
        wireImageFallback(image);

        media.appendChild(image);
        copy.append(city, name, summary, action);
        trigger.append(media, copy);
        article.appendChild(trigger);
        return article;
    }

    rail.replaceChildren();
    if (!Array.isArray(config.items) || config.items.length === 0) {
        rail.appendChild(createElement("p", "restaurant-place-empty", labels.empty || "No places available."));
        return;
    }

    config.items.forEach((item) => rail.appendChild(renderCard(item)));
})();
