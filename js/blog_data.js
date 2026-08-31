// js/blog_data.js

const blogPostsData = [
    {
        id: "daily-routine-i-actually-used",
        title: "Aljohn's Daily Immersion System",
        date: "2025-05-31",
        author: "Aljohn Polyglot",
        categories: ["Study Methods", "Learning Strategy", "Language Notes"],
        languageFocus: ["Multi-Language Focus"],
        tags: ["daily routine", "immersion", "Anki", "reading", "listening", "speaking", "sleep"],
        excerpt: "The hour-by-hour immersion system I used: recall, writing, reading, movement, native video, speaking, and sleep.",
        link: "blog/daily-routine/index.html",
        featuredImage: "images/blog/daily-routine.svg",
        readTime: "Approx. 18 min read"
    },
    {
        id: "iceberg-theory",
        title: "Stop! You Are Learning Languages Wrong!",
        date: "2026-08-31",
        author: "Aljohn Polyglot",
        categories: ["Learning Strategy", "Cultural Immersion", "Language Notes"],
        languageFocus: ["Multi-Language Focus", "Tagalog", "French", "Spanish", "Indonesian"],
        tags: ["iceberg theory", "cultural fluency", "belonging", "CEFR", "immersion", "shared context"],
        excerpt: "Grammar and CEFR levels are only the visible tip. Descend through ten layers of slang, behavior, memory, media, and cultural belonging.",
        link: "blog/iceberg-theory/index.html",
        featuredImage: "images/blog/iceberg-theory.svg",
        readTime: "Approx. 12 min read"
    },
    {
        id: "learn-in-3-months", // Unique identifier
        title: "Learning a Language in 3 Months: Method and Expectations",
        date: "2024-05-17", // Use YYYY-MM-DD for easy sorting. Replace with actual publish date.
        author: "Aljohn Polyglot",
        categories: ["Study Methods", "Learning Strategy", "Language Notes"],
        languageFocus: ["Multi-Language Focus", "Spanish", "French", "Italian", "Indonesian", "Portuguese", "Russian", "German", "Swedish"], // Languages it's relevant to or mentions
        tags: ["deliberate practice", "immersion", "language learning routine", "polyglot journey", "rapid fluency", "sacrifice", "mindset", "language acquisition"],
        excerpt: "Can a language be learned in three months? This article outlines the method, the time commitment, and the habits that make consistent progress possible.",
        link: "blog/learn_in_3_months/index.html", // Relative path from blog.html to the article
        featuredImage: "images/blog/aljohn_3_months.png", // Placeholder - Create a compelling image for this
        // For "Most Popular" (future feature - can be updated dynamically or manually)
        views: 1500, // Example view count
        readTime: "Approx. 15 min read" // Example read time
    },
    {
        id: "roadmap-i-actually-use",
        title: "The Roadmap I Actually Use to Learn Languages",
        date: "2025-05-17",
        author: "Aljohn Polyglot",
        categories: ["Study Methods", "Learning Strategy", "Language Notes"],
        languageFocus: ["Multi-Language Focus"],
        tags: ["roadmap", "CEFR", "immersion", "Anki", "comprehensible input", "advanced fluency"],
        excerpt: "What to focus on as a beginner, what changes at the intermediate stage, and how to refine a language once you can already use it.",
        link: "blog/roadmap-to-fluency/index.html",
        featuredImage: "pathway/assets/roadmap-map.webp",
        readTime: "Approx. 14 min read"
    },
    // --- FUTURE POSTS WILL GO HERE ---
    // Example of a future post structure:
    /*
    {
        id: "my-first-french-month",
        title: "My First Month Immersed in French: What Really Happened",
        date: "2024-06-10",
        author: "Aljohn Polyglot",
        categories: ["Language Notes", "Study Methods"],
        languageFocus: ["French"],
        tags: ["beginner experience", "french immersion", "comprehensible input", "anki"],
        excerpt: "A raw look at the daily grind, the breakthroughs, and the frustrations of diving headfirst into French for 30 days straight.",
        link: "path/to/french-month-article.html",
        featuredImage: "images/blog_previews/french-month.jpg",
        views: 800,
        readTime: "Approx. 8 min read"
    },
    {
        id: "off-topic-1",
        title: "Beyond Languages: My Obsession with [Your Off-Topic Interest]",
        date: "2024-07-01",
        author: "Aljohn Polyglot",
        categories: ["Other"],
        languageFocus: ["N/A"],
        tags: ["personal", "hobbies", "philosophy"],
        excerpt: "Sometimes it helps to step away from language study. This post explores another interest that shapes my thinking and routines.",
        link: "path/to/off-topic-article.html",
        featuredImage: "images/blog_previews/off-topic-1.jpg",
        views: 500,
        readTime: "Approx. 5 min read"
    }
    */
];

// Data for filter options (can also be generated dynamically from blogPostsData if preferred)
const filterCategories = [
    "All Articles", // Default option
    "Study Methods",
    "Learning Strategy",
    "Cultural Immersion",
    "Language Notes",
    "Other"
];

const filterLanguageFocus = [
    "All Languages", // Default option
    "Multi-Language Focus",
    "English", "Tagalog", "Cebuano", "Spanish", "French", "Italian",
    "Indonesian", "Portuguese", "Russian", "German", "Swedish"
    // Add more as Aljohn learns them!
];
