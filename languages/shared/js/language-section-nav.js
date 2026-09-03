(function () {
    "use strict";

    const navs = Array.from(document.querySelectorAll("[data-language-section-nav]"));
    if (!navs.length) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    navs.forEach((nav) => {
        const links = Array.from(nav.querySelectorAll('a[href^="#"]'));
        const entries = links
            .map((link) => {
                const id = decodeURIComponent(link.hash.slice(1));
                return { link, target: document.getElementById(id) };
            })
            .filter((entry) => entry.target);

        if (!entries.length) return;

        let activeLink = null;
        let frame = 0;

        const setActive = (nextLink, reveal) => {
            if (!nextLink || nextLink === activeLink) return;
            entries.forEach(({ link }) => {
                if (link === nextLink) {
                    link.setAttribute("aria-current", "location");
                } else {
                    link.removeAttribute("aria-current");
                }
            });
            activeLink = nextLink;

            if (reveal) {
                nextLink.scrollIntoView({
                    behavior: prefersReducedMotion.matches ? "auto" : "smooth",
                    block: "nearest",
                    inline: "center"
                });
            }
        };

        const updateFromScroll = () => {
            frame = 0;
            const navBottom = nav.getBoundingClientRect().bottom + 28;
            const activationLine = Math.max(navBottom, window.innerHeight * 0.35);
            let current = entries[0];

            entries.forEach((entry) => {
                if (entry.target.getBoundingClientRect().top <= activationLine) current = entry;
            });

            setActive(current.link, true);
        };

        const scheduleUpdate = () => {
            if (!frame) frame = window.requestAnimationFrame(updateFromScroll);
        };

        entries.forEach(({ link }) => {
            link.addEventListener("click", () => setActive(link, true));
        });

        window.addEventListener("scroll", scheduleUpdate, { passive: true });
        window.addEventListener("resize", scheduleUpdate);
        window.addEventListener("hashchange", scheduleUpdate);
        updateFromScroll();
    });
})();
