(function () {
    'use strict';

    const $ = (selector, root = document) => root.querySelector(selector);
    const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
    const escapeHtml = value => String(value ?? '').replace(/[&<>"]/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[char]));
    const youtubeEmbed = id => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?rel=0`;
    const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const countryCodes = { Brasil: 'br', Portugal: 'pt', 'Cabo Verde': 'cv', Angola: 'ao', Filipinas: 'ph' };
    const flagMarkup = country => countryCodes[country]
        ? `<img class="country-flag-pt" src="https://flagcdn.com/w40/${countryCodes[country]}.png" width="24" height="18" alt="" loading="lazy" decoding="async">`
        : '';
    const modal = $('#portuguese-detail-modal');
    const modalDialog = $('.detail-modal-pt__dialog', modal);
    const modalContent = $('#portuguese-detail-modal-content');
    let modalReturnFocus = null;

    function renderPlaylist() {
        const playlist = window.PORTUGUESE_PLAYLIST;
        const list = $('#portuguese-playlist');
        if (!playlist?.videos?.length || !list) return;

        list.innerHTML = playlist.videos.map((video, index) => `
            <li>
                <button class="playlist-entry-pt" type="button" data-video-index="${index}" aria-current="${index === 0}">
                    <img src="${escapeHtml(video.thumbnail)}" width="480" height="360" alt="${escapeHtml(video.thumbnailAlt)}" ${index ? 'loading="lazy"' : ''} decoding="async">
                    <span><strong>${escapeHtml(video.title)}</strong><small>${escapeHtml(video.duration)}</small></span>
                </button>
            </li>`).join('');

        const selectVideo = index => {
            const video = playlist.videos[index];
            $('#portuguese-featured-player').src = youtubeEmbed(video.id);
            $('#portuguese-featured-title').textContent = video.title;
            $('#portuguese-featured-summary').textContent = video.summary;
            $('#portuguese-playlist-status').textContent = `${index + 1} / ${playlist.videos.length}`;
            $$('.playlist-entry-pt', list).forEach((button, buttonIndex) => button.setAttribute('aria-current', String(buttonIndex === index)));
        };

        list.addEventListener('click', event => {
            const button = event.target.closest('[data-video-index]');
            if (button) selectVideo(Number(button.dataset.videoIndex));
        });
        selectVideo(0);
    }

    function renderPodcasts() {
        const shelf = $('#portuguese-podcast-shelf');
        if (!shelf || !window.PORTUGUESE_PODCASTS) return;
        shelf.innerHTML = window.PORTUGUESE_PODCASTS.map((podcast, index) => `
            <button class="podcast-card-pt" type="button" role="listitem" data-podcast-index="${index}" aria-label="Ver detalhes de ${escapeHtml(podcast.title)}">
                <img src="${escapeHtml(podcast.image)}" alt="${escapeHtml(podcast.imageAlt)}" loading="lazy" decoding="async">
                <strong>${escapeHtml(podcast.title)}</strong>
                <span>${escapeHtml(podcast.publisher)} · ${escapeHtml(podcast.cefr)}</span>
            </button>`).join('');
        shelf.addEventListener('click', event => {
            const button = event.target.closest('[data-podcast-index]');
            if (button) openPodcast(window.PORTUGUESE_PODCASTS[Number(button.dataset.podcastIndex)], button);
        });
    }

    async function renderCreators() {
        const response = await fetch('js/data/brasil-creators-data.json');
        if (!response.ok) throw new Error(`Creator data failed: ${response.status}`);
        const data = await response.json();
        const shelves = $('#portuguese-creator-shelves');
        const controls = $('#portuguese-cefr-controls');
        const countryFilter = $('#portuguese-country-filter');
        if (!shelves || !controls || !countryFilter) return;

        const levels = [...new Set(data.creators.flatMap(creator => creator.cefr.match(/[ABC][12]/g) || []))]
            .sort((a, b) => levelOrder.indexOf(a) - levelOrder.indexOf(b));
        controls.innerHTML = ['Todos', ...levels].map((level, index) => `<button type="button" data-level="${level}" aria-pressed="${index === 0}">${level}</button>`).join('');
        const countries = [...new Set(data.creators.map(creator => creator.country).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'pt-BR'));
        countryFilter.innerHTML = `<button type="button" data-country="Todos" aria-pressed="true">Todos</button>${countries.map(country => `<button type="button" data-country="${escapeHtml(country)}" aria-pressed="false">${flagMarkup(country)} ${escapeHtml(country)}</button>`).join('')}`;

        shelves.innerHTML = data.categories.map(category => {
            const shelfId = `creator-shelf-${category.id}`;
            const cards = data.creators.filter(creator => creator.categoryId === category.id).map(creator => `
                <button class="creator-card-pt" type="button" data-creator-id="${escapeHtml(creator.id)}" data-cefr="${escapeHtml(creator.cefr)}" data-country="${escapeHtml(creator.country)}">
                    <img src="${escapeHtml(creator.image)}" alt="Retrato ou imagem oficial de ${escapeHtml(creator.name)}" loading="lazy" decoding="async">
                    <span class="creator-card-pt__body">
                        <span class="creator-card-pt__meta"><span>${flagMarkup(creator.country)} ${escapeHtml(creator.country)}</span><span>${escapeHtml(creator.cefr)}</span></span>
                        <h4>${escapeHtml(creator.name)}</h4>
                        <p>${escapeHtml(creator.description)}</p>
                    </span>
                </button>`).join('');
            return `<section class="creator-shelf-pt" data-creator-shelf>
                <header class="creator-shelf-pt__head">
                    <h3>${escapeHtml(category.name)}</h3>
                    <p>${escapeHtml(category.description)}</p>
                    <div class="creator-shelf-pt__controls" aria-label="Navegar pela seção ${escapeHtml(category.name)}">
                        <button type="button" data-shelf-scroll="-1" aria-controls="${escapeHtml(shelfId)}" aria-label="Voltar na seção ${escapeHtml(category.name)}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <button type="button" data-shelf-scroll="1" aria-controls="${escapeHtml(shelfId)}" aria-label="Avançar na seção ${escapeHtml(category.name)}">
                            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
                        </button>
                    </div>
                </header>
                <div class="creator-shelf-pt__row" id="${escapeHtml(shelfId)}" role="region" tabindex="0" aria-label="Criadores em ${escapeHtml(category.name)}">${cards}</div>
            </section>`;
        }).join('');

        shelves.addEventListener('click', event => {
            const scrollButton = event.target.closest('[data-shelf-scroll]');
            if (scrollButton) {
                const row = document.getElementById(scrollButton.getAttribute('aria-controls'));
                row?.scrollBy({ left: Number(scrollButton.dataset.shelfScroll) * row.clientWidth * .82, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
                return;
            }
            const button = event.target.closest('[data-creator-id]');
            if (button) openCreator(data.creators.find(creator => creator.id === button.dataset.creatorId), button);
        });

        const updateShelfControls = row => {
            const shelf = row.closest('[data-creator-shelf]');
            const max = row.scrollWidth - row.clientWidth;
            $('[data-shelf-scroll="-1"]', shelf).disabled = row.scrollLeft <= 2;
            $('[data-shelf-scroll="1"]', shelf).disabled = max <= 2 || row.scrollLeft >= max - 2;
        };
        const shelfRows = $$('.creator-shelf-pt__row', shelves);
        shelfRows.forEach(row => {
            row.addEventListener('scroll', () => updateShelfControls(row), { passive: true });
            updateShelfControls(row);
        });
        window.addEventListener('resize', () => shelfRows.forEach(updateShelfControls), { passive: true });

        let activeLevel = 'Todos';
        let activeCountry = 'Todos';
        const applyCreatorFilters = () => {
            $$('.creator-card-pt', shelves).forEach(card => {
                const levelMatches = activeLevel === 'Todos' || rangeIncludes(card.dataset.cefr, activeLevel);
                const countryMatches = activeCountry === 'Todos' || card.dataset.country === activeCountry;
                card.hidden = !levelMatches || !countryMatches;
            });
            $$('[data-creator-shelf]', shelves).forEach(shelf => { shelf.hidden = !$('.creator-card-pt:not([hidden])', shelf); });
            shelfRows.forEach(row => { row.scrollLeft = 0; updateShelfControls(row); });
            const levelText = activeLevel === 'Todos' ? 'todos os níveis' : `nível ${activeLevel}`;
            const countryText = activeCountry === 'Todos' ? 'todos os países' : activeCountry;
            $('#portuguese-cefr-status').textContent = `${levelText} · ${countryText}.`;
        };

        controls.addEventListener('click', event => {
            const button = event.target.closest('[data-level]');
            if (!button) return;
            activeLevel = button.dataset.level;
            $$('button', controls).forEach(control => control.setAttribute('aria-pressed', String(control === button)));
            applyCreatorFilters();
        });
        countryFilter.addEventListener('click', event => {
            const button = event.target.closest('[data-country]');
            if (!button) return;
            activeCountry = button.dataset.country;
            $$('button', countryFilter).forEach(control => control.setAttribute('aria-pressed', String(control === button)));
            applyCreatorFilters();
        });
    }

    function rangeIncludes(range, selected) {
        const ends = range.match(/[ABC][12]/g) || [];
        const selectedIndex = levelOrder.indexOf(selected);
        if (ends.length === 1) return ends[0] === selected;
        return selectedIndex >= levelOrder.indexOf(ends[0]) && selectedIndex <= levelOrder.indexOf(ends.at(-1));
    }

    function renderBooks() {
        const shelf = $('#portuguese-book-shelf');
        const bridge = window.PORTUGUESE_BOOK_RESOURCES;
        const catalogue = window.publicDomainBooks;
        if (!shelf || !bridge || !catalogue) return;
        const notes = new Map(bridge.books.map(item => [item.libraryRecordId, item.pageNote]));
        const books = catalogue.filter(book => notes.has(book.id));
        shelf.innerHTML = books.map((book, index) => `
            <button class="book-card-pt" type="button" role="listitem" data-book-index="${index}" aria-label="Ver detalhes de ${escapeHtml(book.title)}">
                <img src="../../library/images/books/pt/${escapeHtml(book.id)}.webp" alt="Capa de ${escapeHtml(book.title)}, de ${escapeHtml(book.author)}" loading="lazy" decoding="async">
                <strong>${escapeHtml(book.title)}</strong>
                <span>${escapeHtml(book.author)} · ${escapeHtml(formatCefr(book.recommendedCEFR))}</span>
            </button>`).join('');
        shelf.addEventListener('click', event => {
            const button = event.target.closest('[data-book-index]');
            if (button) openBook(books[Number(button.dataset.bookIndex)], notes.get(books[Number(button.dataset.bookIndex)].id), button);
        });
    }

    function formatCefr(value) { return Array.isArray(value) ? value.join('–') : value; }

    function openCreator(creator, trigger) {
        if (!creator) return;
        const video = creator.sampleVideo?.id ? `<div class="video-frame-pt"><iframe src="${youtubeEmbed(creator.sampleVideo.id)}" title="${escapeHtml(creator.sampleVideo.title)}" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>` : '<p>Amostra em vídeo indisponível.</p>';
        const note = creator.personalComment ? `<h3>Nota do Aljohn</h3><p class="modal-note-pt">${escapeHtml(creator.personalComment)}</p>` : '';
        openModal(`<div class="modal-layout-pt">
            <div class="modal-media-pt"><img src="${escapeHtml(creator.image)}" alt="Retrato ou imagem oficial de ${escapeHtml(creator.name)}">${video}</div>
            <div class="modal-copy-pt"><h2 id="detail-modal-title-pt">${escapeHtml(creator.name)}</h2><p class="modal-meta-pt">${flagMarkup(creator.country)} ${escapeHtml(creator.country)} · ${escapeHtml(creator.cefr)}</p><p>${escapeHtml(creator.longDescription)}</p><h3>Como escutar</h3><p>${escapeHtml(creator.levelGuidance)}</p>${note}<div class="modal-links-pt">${renderLinks(creator.links)}</div></div>
        </div>`, trigger);
    }

    function openPodcast(podcast, trigger) {
        const note = podcast.personalNote ? `<h3>Nota do Aljohn</h3><p class="modal-note-pt">${escapeHtml(podcast.personalNote)}</p>` : '';
        openModal(`<div class="modal-layout-pt">
            <div class="modal-media-pt"><img src="${escapeHtml(podcast.image)}" alt="${escapeHtml(podcast.imageAlt)}"></div>
            <div class="modal-copy-pt"><h2 id="detail-modal-title-pt">${escapeHtml(podcast.title)}</h2><p class="modal-meta-pt">${escapeHtml(podcast.format)} · ${escapeHtml(podcast.cefr)}</p><p>${escapeHtml(podcast.description)}</p><h3>Como escutar</h3><p>${escapeHtml(podcast.guidance)}</p>${note}<div class="modal-links-pt">${renderLinks(podcast.links)}</div></div>
        </div>`, trigger);
    }

    function openBook(book, note, trigger) {
        const links = [book.pdfLink && { label: 'Ler PDF', url: book.pdfLink }, book.epubLink && { label: 'Baixar EPUB', url: book.epubLink }].filter(Boolean);
        openModal(`<div class="modal-layout-pt">
            <div class="modal-media-pt"><img src="../../library/images/books/pt/${escapeHtml(book.id)}.webp" alt="Capa de ${escapeHtml(book.title)}"></div>
            <div class="modal-copy-pt"><h2 id="detail-modal-title-pt">${escapeHtml(book.title)}</h2><p class="modal-meta-pt">${escapeHtml(book.author)} · ${escapeHtml(formatCefr(book.recommendedCEFR))}</p><p>${escapeHtml(book.description)}</p><h3>Para esta leitura</h3><p class="modal-note-pt">${escapeHtml(note)}</p><div class="modal-links-pt">${renderLinks(links)}</div></div>
        </div>`, trigger);
    }

    function renderLinks(links = []) {
        return links.map(link => `<a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)} <span aria-hidden="true">↗</span></a>`).join('');
    }

    function openModal(content, trigger) {
        modalReturnFocus = trigger;
        modalContent.innerHTML = content;
        modal.hidden = false;
        document.body.classList.add('modal-open');
        modalDialog.focus();
    }

    function closeModal() {
        if (modal.hidden) return;
        modal.hidden = true;
        modalContent.innerHTML = '';
        document.body.classList.remove('modal-open');
        modalReturnFocus?.focus();
    }

    function setupModal() {
        modal.addEventListener('click', event => { if (event.target.closest('[data-modal-close]')) closeModal(); });
        modal.addEventListener('keydown', event => {
            if (event.key === 'Escape') return closeModal();
            if (event.key !== 'Tab') return;
            const focusable = $$('button, a[href], iframe, [tabindex]:not([tabindex="-1"])', modal).filter(element => !element.hidden);
            if (!focusable.length) return;
            const first = focusable[0];
            const last = focusable.at(-1);
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        });
    }

    function setupChapterNav() {
        const links = $$('.edition-nav a');
        const sections = links.map(link => document.querySelector(link.hash)).filter(Boolean);
        const observer = new IntersectionObserver(entries => {
            entries.filter(entry => entry.isIntersecting).forEach(entry => links.forEach(link => link.toggleAttribute('aria-current', link.hash === `#${entry.target.id}`)));
        }, { rootMargin: '-35% 0px -60% 0px' });
        sections.forEach(section => observer.observe(section));
    }

    function setupStoryCarousel() {
        const viewport = $('#story-carousel-viewport');
        if (!viewport) return;
        const slides = $$('.story-carousel__slide', viewport);
        const status = $('#story-carousel-status');
        const buttons = $$('[data-story-slide]');
        if (slides.length < 2 || !status || buttons.length !== 2) return;

        const currentIndex = () => Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / viewport.clientWidth)));
        const update = () => {
            const index = currentIndex();
            status.textContent = `${index + 1} / ${slides.length}`;
            buttons[0].disabled = index === 0;
            buttons[1].disabled = index === slides.length - 1;
        };
        const move = direction => viewport.scrollTo({ left: (currentIndex() + direction) * viewport.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

        buttons.forEach(button => button.addEventListener('click', () => move(Number(button.dataset.storySlide))));
        viewport.addEventListener('scroll', update, { passive: true });
        viewport.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                event.preventDefault();
                move(event.key === 'ArrowLeft' ? -1 : 1);
            }
        });
        window.addEventListener('resize', update, { passive: true });
        update();
    }

    function selfCheck() {
        const failures = [];
        if (!$('#portuguese-featured-player')?.src.includes('youtube-nocookie.com')) failures.push('featured player');
        if ($$('.creator-shelf-pt').length < 6) failures.push('creator shelves');
        if ($$('.cefr-filter-pt__controls button[aria-pressed="true"]').length !== 1) failures.push('CEFR state');
        if ($$('#portuguese-country-filter button[aria-pressed="true"]').length !== 1) failures.push('country filter');
        if ($$('.story-carousel__slide').length < 2) failures.push('story carousel');
        if ($$('.book-card-pt').length < 5) failures.push('book shelf');
        if (failures.length) throw new Error(`Portuguese page self-check failed: ${failures.join(', ')}`);
        return 'Portuguese page self-check passed';
    }

    document.addEventListener('DOMContentLoaded', async () => {
        renderPlaylist();
        renderPodcasts();
        renderBooks();
        setupModal();
        setupChapterNav();
        setupStoryCarousel();
        try {
            await renderCreators();
            window.portuguesePageSelfCheck = selfCheck;
            if (new URLSearchParams(location.search).has('selfcheck')) console.info(selfCheck());
        } catch (error) {
            console.error(error);
            $('#portuguese-creator-shelves').innerHTML = '<p>Não foi possível carregar a seleção de criadores.</p>';
        }
    });
})();
