document.addEventListener('DOMContentLoaded', () => {
    const postsGrid = document.getElementById('blogPostsGrid');
    const categoryFilters = document.getElementById('categoryFilters');
    const languageFilters = document.getElementById('languageFilters');
    const sortBy = document.getElementById('sortBy');
    const search = document.getElementById('tagSearch');
    const reset = document.getElementById('resetFilters');
    const resultsCount = document.getElementById('resultsCount');

    if (!postsGrid || !Array.isArray(window.blogPostsData || blogPostsData)) return;

    const formatDate = value => new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    }).format(new Date(`${value}T00:00:00`));

    const meta = post => `
        <div class="paper-meta">
            <span>${formatDate(post.date)}</span>
            ${post.categories?.[0] ? `<span>${post.categories[0]}</span>` : ''}
            ${post.readTime ? `<span>${post.readTime.replace('Approx. ', '')}</span>` : ''}
        </div>`;

    const featureMarkup = post => `
        <article class="paper-feature" data-id="${post.id}">
            <a class="paper-feature__media" href="${post.link}" aria-label="Read ${post.title}">
                ${post.featuredImage ? `<img src="${post.featuredImage}" alt="Cover art for ${post.title}" loading="eager" width="760" height="460">` : ''}
                <span class="paper-feature__label">Latest paper</span>
            </a>
            <div class="paper-feature__copy">
                <h3><a href="${post.link}">${post.title}</a></h3>
                <p>${post.excerpt}</p>
                ${meta(post)}
                <a class="paper-open" href="${post.link}">Read paper</a>
            </div>
        </article>`;

    const rowMarkup = (post, index) => `
        <article class="paper-row" data-id="${post.id}">
            <span class="paper-row__number" aria-hidden="true">${String(index + 2).padStart(2, '0')}</span>
            <a class="paper-row__media" href="${post.link}" aria-label="Read ${post.title}">
                ${post.featuredImage ? `<img src="${post.featuredImage}" alt="" loading="lazy" width="320" height="180">` : ''}
            </a>
            <h3><a href="${post.link}">${post.title}</a></h3>
            ${meta(post)}
            <a class="paper-row__open" href="${post.link}" aria-label="Read ${post.title}"></a>
        </article>`;

    function render(posts) {
        resultsCount.textContent = `${posts.length} ${posts.length === 1 ? 'paper' : 'papers'}`;
        if (!posts.length) {
            postsGrid.innerHTML = '<p class="no-results-message">No papers match those filters. Clear a filter or try another keyword.</p>';
            return;
        }
        postsGrid.innerHTML = featureMarkup(posts[0]) + posts.slice(1).map(rowMarkup).join('');
        postsGrid.querySelectorAll('img').forEach(img => img.addEventListener('error', () => img.remove(), { once: true }));
    }

    function populate(container, options) {
        container.replaceChildren(...options.map((option, index) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = option;
            button.dataset.filterValue = option;
            button.classList.toggle('active', index === 0);
            button.setAttribute('aria-pressed', String(index === 0));
            return button;
        }));
    }

    function selected(container) {
        return container.querySelector('button.active')?.dataset.filterValue;
    }

    function apply() {
        const category = selected(categoryFilters) || 'All Articles';
        const language = selected(languageFilters) || 'All Languages';
        const term = search.value.trim().toLowerCase();
        const posts = blogPostsData.filter(post => {
            const categoryMatch = category === 'All Articles' || post.categories?.includes(category);
            const languageMatch = language === 'All Languages' || post.languageFocus?.includes(language);
            const haystack = [post.title, post.excerpt, ...(post.tags || []), ...(post.categories || [])].join(' ').toLowerCase();
            return categoryMatch && languageMatch && (!term || haystack.includes(term));
        });

        posts.sort((a, b) => {
            if (sortBy.value === 'date-asc') return new Date(a.date) - new Date(b.date);
            if (sortBy.value === 'title-asc') return a.title.localeCompare(b.title);
            if (sortBy.value === 'title-desc') return b.title.localeCompare(a.title);
            return new Date(b.date) - new Date(a.date);
        });
        render(posts);
    }

    function bindFilter(container) {
        container.addEventListener('click', event => {
            const button = event.target.closest('button');
            if (!button) return;
            container.querySelectorAll('button').forEach(item => {
                const active = item === button;
                item.classList.toggle('active', active);
                item.setAttribute('aria-pressed', String(active));
            });
            apply();
        });
    }

    populate(categoryFilters, filterCategories);
    populate(languageFilters, filterLanguageFocus);
    bindFilter(categoryFilters);
    bindFilter(languageFilters);
    sortBy.addEventListener('change', apply);

    let searchTimer;
    search.addEventListener('input', () => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(apply, 180);
    });

    reset.addEventListener('click', () => {
        search.value = '';
        sortBy.value = 'date-desc';
        [categoryFilters, languageFilters].forEach(container => {
            container.querySelectorAll('button').forEach((button, index) => {
                button.classList.toggle('active', index === 0);
                button.setAttribute('aria-pressed', String(index === 0));
            });
        });
        apply();
        search.focus();
    });

    apply();
});
