(function () {
    const focusableSelector = [
        'a[href]',
        'button:not([disabled])',
        'iframe',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ].join(',');

    let active = null;

    function getFocusableElements(overlay) {
        return Array.from(overlay.querySelectorAll(focusableSelector)).filter(element => {
            return !element.hidden && element.getAttribute('aria-hidden') !== 'true' && element.getClientRects().length > 0;
        });
    }

    function onKeydown(event) {
        if (!active) return;
        if (event.key === 'Escape') {
            event.preventDefault();
            close();
            return;
        }
        if (event.key !== 'Tab') return;

        const focusable = getFocusableElements(active.overlay);
        if (!focusable.length) {
            event.preventDefault();
            active.overlay.focus();
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
    }

    function close() {
        if (!active) return;
        const modal = active;
        active = null;
        document.removeEventListener('keydown', onKeydown, true);
        modal.overlay.classList.remove('visible');
        document.body.classList.remove('swedish-modal-open');
        document.body.style.overflow = modal.previousOverflow;

        modal.overlay.querySelectorAll('iframe').forEach(iframe => iframe.removeAttribute('src'));
        window.setTimeout(() => {
            modal.onClose?.();
            if (modal.trigger?.isConnected) modal.trigger.focus({ preventScroll: true });
        }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260);
    }

    function open(overlay, options = {}) {
        if (!overlay) return;
        if (active) close();

        active = {
            overlay,
            trigger: options.trigger || document.activeElement,
            onClose: options.onClose,
            previousOverflow: document.body.style.overflow
        };

        overlay.tabIndex = -1;
        document.body.classList.add('swedish-modal-open');
        document.body.style.overflow = 'hidden';
        document.addEventListener('keydown', onKeydown, true);
        overlay.addEventListener('mousedown', event => {
            if (event.target === overlay) close();
        });
        overlay.querySelector('.modal-close-btn')?.addEventListener('click', close);

        requestAnimationFrame(() => {
            overlay.classList.add('visible');
            const focusable = getFocusableElements(overlay);
            (focusable[0] || overlay).focus({ preventScroll: true });
        });
    }

    function wireLocalImageFallback(root = document) {
        root.querySelectorAll('img[data-local-fallback]').forEach(image => {
            image.addEventListener('error', () => {
                const fallback = image.dataset.localFallback;
                if (!fallback || image.src.endsWith(fallback)) return;
                image.src = fallback;
            }, { once: true });
        });
    }

    window.SwedishModalController = { open, close, wireLocalImageFallback };
})();
