// js/homepage_blog_preview.js
document.addEventListener('DOMContentLoaded', () => {
    const featuredPostSlot = document.getElementById('featuredPostSlot');
    const recentPostsGrid = document.getElementById('recentPostsGrid');
    const featuredPostId = "learn-in-3-months"; // ID of your main article
    const numberOfRecentPosts = 3; // How many other posts to show in the grid

    if (typeof blogPostsData === 'undefined' || blogPostsData.length === 0) {
        console.warn("Blog post data not found or empty. Preview section will not be populated.");
        if (recentPostsGrid) {
             recentPostsGrid.innerHTML = '<p style="color: var(--theme-soft-mint-text); text-align: center;">No dispatches available at the moment.</p>';
        }
        return;
    }

    function createPostCardHTML(post, isFeatured = false) {
        const titleClass = isFeatured ? 'featured-title' : '';
        const contentClass = isFeatured ? 'card-content-featured' : 'card-content-preview';
        const excerptClass = isFeatured ? 'featured-excerpt' : 'card-excerpt-preview';
        const imageClass = isFeatured ? 'featured-image' : 'card-preview-image';
        const metaClass = isFeatured ? 'card-meta-featured' : 'card-meta-preview';

        // Create category tags HTML
        let categoryTagsHtml = '';
        // if (post.categories && post.categories.length > 0 && !isFeatured) { // Optionally hide tags on featured
        //     categoryTagsHtml = post.categories.slice(0, 2).map(cat => `<span class="card-category-tag">${cat}</span>`).join('');
        // }
        
        // Note: The paths for `post.link` and `post.featuredImage` in blog_data.js
        // should be relative to where blog_data.js is loaded FROM, OR make them absolute
        // OR adjust them here if index.html is in a different directory depth than blog.html.
        // Assuming index.html is at root, and blog_data.js uses paths relative to blog.html:
        const postLink = `${post.link}`;
        const imageLink = post.featuredImage ? `${post.featuredImage}` : 'https://via.placeholder.com/600x300/0a2e1a/2dce89?text=Polyglot+Paper';


        return `
            <div class="paper-teaser-card">
                <a href="${postLink}" class="card-image-link" aria-label="Read more about ${post.title}">
                    <img src="${imageLink}" alt="" class="${imageClass}">
                    ${categoryTagsHtml ? `<div class="card-category-tags">${categoryTagsHtml}</div>` : ''}
                </a>
                <div class="${contentClass}">
                    <h3 class="card-title ${titleClass}"><a href="${postLink}">${post.title}</a></h3>
                    <p class="${metaClass}">
                        <span><i class="fas fa-user-edit"></i> ${post.author}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${new Date(post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        ${post.readTime ? `<span><i class="fas fa-clock"></i> ${post.readTime}</span>` : ''}
                    </p>
                    <p class="${excerptClass}">${post.excerpt}</p>
                    <a href="${postLink}" class="btn btn-outline btn-small paper-link">
                        Read Dispatch <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
    }

    // Find and render the featured post
    const featuredPost = blogPostsData.find(post => post.id === featuredPostId);
    if (featuredPost && featuredPostSlot) {
        featuredPostSlot.innerHTML = createPostCardHTML(featuredPost, true);
    } else if (featuredPostSlot) {
        featuredPostSlot.innerHTML = "<p>Featured article not found.</p>";
    }

    // Filter out the featured post and get other recent posts
    const otherPosts = blogPostsData
        .filter(post => post.id !== featuredPostId)
        .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
        .slice(0, numberOfRecentPosts);

    if (recentPostsGrid) {
        if (otherPosts.length > 0) {
            recentPostsGrid.innerHTML = otherPosts.map(post => createPostCardHTML(post, false)).join('');
        } else if (!featuredPost) { // Only show if no posts at all
            recentPostsGrid.innerHTML = '<p style="color: var(--theme-soft-mint-text); text-align: center; grid-column: 1 / -1;">More dispatches coming soon...</p>';
        } else {
            recentPostsGrid.innerHTML = ''; // Clear if featured post is shown and no others
        }
    }
});