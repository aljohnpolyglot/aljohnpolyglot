// js/blog_data.js

const blogPostsData = [
    {
        id: "learn-in-3-months", // Unique identifier
        title: "How to Learn a Language in 3 Months? The Truth & The Method",
        date: "2024-05-17", // Use YYYY-MM-DD for easy sorting. Replace with actual publish date.
        author: "Aljohn Polyglot",
        categories: ["Core Systems & Schematics", "Psyche & Soma", "Field Reports & Cultural Intel"],
        languageFocus: ["Multi-Language Focus", "Spanish", "French", "Italian", "Indonesian", "Portuguese", "Russian", "German", "Swedish"], // Languages it's relevant to or mentions
        tags: ["deliberate practice", "immersion", "language learning routine", "polyglot journey", "rapid fluency", "sacrifice", "mindset", "language acquisition"],
        excerpt: "Can you *really* learn a language in 3 months? I say YES. This isn't just a claim; it's a field-tested methodology. Discover the '500 Deliberate Hour' rule, the intense daily routine that makes it possible, and the mindset that bypasses years of traditional study. Your calculator for fluency is inside.",
        link: "blog/learn_in_3_months/index.html", // Relative path from blog.html to the article
        featuredImage: "images/blog/aljohn_3_months.png", // Placeholder - Create a compelling image for this
        // For "Most Popular" (future feature - can be updated dynamically or manually)
        views: 1500, // Example view count
        readTime: "Approx. 15 min read" // Example read time
    },
    // --- FUTURE POSTS WILL GO HERE ---
    // Example of a future post structure:
    /*
    {
        id: "my-first-french-month",
        title: "My First Month Immersed in French: What Really Happened",
        date: "2024-06-10",
        author: "Aljohn Polyglot",
        categories: ["Field Reports & Cultural Intel", "Core Systems & Schematics"],
        languageFocus: ["French"],
        tags: ["beginner experience", "french immersion", "comprehensible input", "anki"],
        excerpt: "A raw look at the daily grind, the breakthroughs, and the frustrations of diving headfirst into French for 30 days straight.",
        link: "path/to/french-month-article.html",
        featuredImage: "images/blog_previews/french-month.jpg",
        views: 800,
        readTime: "Approx. 8 min read"
    },
    {
        id: "declassified-off-topic-1",
        title: "Beyond Languages: My Obsession with [Your Off-Topic Interest]",
        date: "2024-07-01",
        author: "Aljohn Polyglot",
        categories: ["[CLASSIFIED] Off-Topic Logs"],
        languageFocus: ["N/A"],
        tags: ["personal", "hobbies", "philosophy"],
        excerpt: "Sometimes the polyglot needs a break. A peek into one of my other deep dives that isn't about verb conjugations or immersion hours.",
        link: "path/to/off-topic-article.html",
        featuredImage: "images/blog_previews/off-topic-1.jpg",
        views: 500,
        readTime: "Approx. 5 min read"
    }
    */
];

// Data for filter options (can also be generated dynamically from blogPostsData if preferred)
const filterCategories = [
    "All Dispatches", // Default option
    "Core Systems & Schematics",
    "Psyche & Soma",
    "Field Reports & Cultural Intel",
    "[CLASSIFIED] Off-Topic Logs"
];

const filterLanguageFocus = [
    "All Languages", // Default option
    "Multi-Language Focus",
    "English", "Tagalog", "Cebuano", "Spanish", "French", "Italian",
    "Indonesian", "Portuguese", "Russian", "German", "Swedish"
    // Add more as Aljohn learns them!
];