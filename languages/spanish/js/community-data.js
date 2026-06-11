
const communityData = [
    {
        // -------------------------------------
        // ---- INSTITUCIÓN (PARA EL FEATURE) ----
        // -------------------------------------
        id: "cervantes-manila",
        type: "institute",
        name: "Instituto Cervantes de Manila",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSMBAgg_X1quHa29B84HDuyK0nMeDI1gVyVQ&s",
        photoGallery: [
            { src: '../../images/languagecenters/cervantes_aljohn_sabado_boardgames.jpg', caption: 'Sabado Board Games session' },
            { src: '../../images/languagecenters/cervantes_aljohn_sabado_boardgames2.jpg', caption: 'Aprendiendo y jugando' },
            { src: '../../images/languagecenters/cervantes_aljohn_sabado_boardgames3.jpg', caption: 'Estoy super feliz' },
            { src: '../../images/languagecenters/cervantes_aljohn_sabado_boardgames4.jpg', caption: 'Siempre un buen rato en el Instituto' }
        ],
        shortDesc: "Centro cultural oficial de España que ofrece cursos, exámenes DELE y vibrantes eventos culturales.",
        longDesc: "El Instituto Cervantes es la institución oficial del Gobierno de España para promover la lengua y la cultura españolas. Ofrece una amplia gama de cursos, los exámenes oficiales DELE y SIELE, y un rico calendario de eventos culturales.",
        keyOfferings: ["Cursos de español (A1-C2)", "Exámenes DELE y SIELE", "Eventos culturales", "Biblioteca"],
        website: "https://manila.cervantes.es/en/default.shtm",
        facebook: "https://www.facebook.com/InstitutoCervantesManila/",
        link: "../../languagecenters.html#institute-cervantes-manila",
        brandPalette: {
            background: "#cc0000", // Rojo Cervantes
            text: "#ffffff",
            buttonBg: "#ffffff",
            buttonText: "#cc0000",
            accent: "#ffffff" // Amarillo España
        }
    },
    {
        // -------------------------------------
        // ---- GRUPOS (PARA LA ESTANTERÍA) ----
        // -------------------------------------
        id: 'sff',
        type: "group",
        name: 'Spanish for Filipinos',
        logo: '../../images/groups/spanish_for_filipinos_logo.jpg',
        shortDesc: '¡Comunidad vibrante y encuentros regulares en Luneta!',
        link: '../../groups/spanishforfilipinos.html',
        brandPalette: {
            background: '#FCD116', // Amarillo SFF
            text: '#0038a7',
            accent: '#0038a7' // Rojo SFF
        }
    },
    {
        id: 'slm',
        type: "group",
        name: 'Spanish Language Meetup - Makati',
        logo: '../../images/groups/spanish_language_meetup_logo.avif',
        shortDesc: 'Practica español en un ambiente amistoso en SM Jazz.',
        link: '../../groups/spanishlanguagemeetup.html',
        brandPalette: {
            background: '#A72323', // Rojo SLM
            text: '#F9FCFA',
            accent: '#F9FCFA' // Amarillo SLM
        }
    },
    {
        id: 'chf',
        type: "group",
        name: 'Club de Hispano-Hablantes Filipino',
        logo: '../../images/groups/club_hispanohablantes_logo.jpg',
        shortDesc: 'Fomentando el español a través de la mentoría y el apoyo.',
        link: '../../groups/clubhispanohablantes.html',
        brandPalette: {
            background: '#FFFFFF', // Fondo Blanco CHF
            text: '#333333',
            accent: '#C8102E' // Rojo Acento CHF
        }
    }
];