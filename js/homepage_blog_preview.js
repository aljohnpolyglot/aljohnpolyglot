document.addEventListener('DOMContentLoaded', () => {
    const featuredSlot = document.getElementById('featuredPostSlot');
    const recentGrid = document.getElementById('recentPostsGrid');
    if (!featuredSlot || !recentGrid || typeof blogPostsData === 'undefined' || !blogPostsData.length) return;

    const posts = [...blogPostsData].sort((a, b) => new Date(b.date) - new Date(a.date));
    const [featured, ...recent] = posts;
    const formatDate = value => new Intl.DateTimeFormat('en-US', {
        year: 'numeric', month: 'short', day: 'numeric'
    }).format(new Date(`${value}T00:00:00`));

    featuredSlot.innerHTML = `
        <article class="home-paper-feature">
            <a href="${featured.link}" aria-label="Read ${featured.title}">
                <img src="${featured.featuredImage}" alt="Cover art for ${featured.title}" loading="lazy" width="640" height="360">
            </a>
            <div class="home-paper-feature__copy">
                <h3><a href="${featured.link}">${featured.title}</a></h3>
                <div class="paper-meta"><span>${formatDate(featured.date)}</span><span>${featured.readTime.replace('Approx. ', '')}</span></div>
                <p>${featured.excerpt}</p>
                <a class="paper-open" href="${featured.link}">Read paper</a>
            </div>
        </article>`;

    recentGrid.innerHTML = recent.slice(0, 3).map((post, index) => `
        <article class="home-paper-row">
            <span aria-hidden="true">${String(index + 2).padStart(2, '0')}</span>
            <h3><a href="${post.link}">${post.title}</a></h3>
            <a href="${post.link}" aria-label="Read ${post.title}">Read</a>
        </article>`).join('');

    featuredSlot.querySelector('img')?.addEventListener('error', event => event.currentTarget.remove(), { once: true });
});
