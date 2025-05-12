// groups/js/groups-data.js
const languageGroupsData = [
    {
        id: 'sff',
        name: 'Spanish for Filipinos (by Eric Martinez)',
        logo: '../images/groups/spanish_for_filipinos_logo.jpg',
        tagline: 'A vibrant community connecting Filipino learners with the Spanish-speaking world. Regular Luneta meetups!',
        languages: ['Spanish'],
        types: ['Facebook Group', 'Meetup (In-Person)',],
        link: 'groups/spanishforfilipinos.html',
        theme: {
            backgroundColor: '#CE1126', // SFF Red (Dark BG)
            textColor: '#FFFFFF',       // White text
            accentColor: '#FCD116',     // SFF Yellow (for button text or accents)
            buttonTextColor: '#1A1A1A'  // Dark text for yellow button
        }
    },
    {
        id: 'sagingcava',
        name: 'Saging Ça Va ? - French for Filipinos',
        logo: '../images/groups/saging_cava_logo_yellowbg.jpg',
        tagline: 'Practice French in a friendly environment. Monthly meet-ups!',
        languages: ['French'],
        types: ['Facebook Group', 'Meetup (In-Person)'],
        link: 'groups/sagingcava.html',
        theme: {
            backgroundColor: '#FFDD57', // SCV Yellow (Light BG)
            textColor: '#00529F',       // SCV Blue text
            accentColor: '#EF4135',     // SCV Red (for button BG)
            buttonTextColor: '#FFFFFF'  // White text for red button
        }
    },
    {
        id: 'slm',
        name: 'Spanish Language Meetup - Makati',
        logo: '../images/groups/spanish_language_meetup_logo.avif',
        tagline: 'Enjoy learning and practicing Spanish in a fun, friendly atmosphere at Coffee Bean SM Jazz.',
        languages: ['Spanish'],
        types: ['Meetup (In-Person)'],
        link: 'groups/spanishlanguagemeetup.html',
        theme: {
            backgroundColor: '#A72323', // SLM Main Red (Dark BG)
            textColor: '#F9FCFA',       // SLM White text
            accentColor: '#FDD870',     // SLM Yellow (for button BG)
            buttonTextColor: '#A72323'  // Main red text for yellow button
        }
    },
    {
        id: 'chf',
        name: 'Club de Hispano-Hablantes Filipino',
        logo: '../images/groups/club_hispanohablantes_logo.jpg',
        tagline: 'Fostering Spanish learning through mentorship and community support.',
        languages: ['Spanish'],
        types: ['Social Club', 'Mentorship', 'Facebook Page'],
        link: 'groups/clubhispanohablantes.html',
        theme: {
            backgroundColor: '#FFFFFF', // CHF White BG for card
            textColor: '#333333',       // Dark text
            accentColor: '#C8102E',     // CHF Spanish Red (for button BG)
            buttonTextColor: '#FFFFFF'  // White text for red button
            // topBorderColor: '#C8102E' // Optional: if you still want a top border accent
        }
    }
    // Add more group objects here
];