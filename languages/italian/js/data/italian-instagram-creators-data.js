/*
 * Public Instagram accounts that Aljohn follows and that extend the Italian
 * shelves. No popularity or favourite label is inferred from the following
 * list; notes remain editable when the personal reason is not documented.
 */
(function extendItalianInstagramLibrary() {
    const library = window.ITALIAN_CURATED_LIBRARY;
    if (!library || !Array.isArray(library.creators)) return;

    const addInstagramLink = (creatorId, url) => {
        const creator = library.creators.find((item) => item.id === creatorId);
        if (!creator) return;
        creator.links = Array.isArray(creator.links) ? creator.links : [];
        if (!creator.links.some((link) => link.label === 'Instagram')) {
            creator.links.push({ label: 'Instagram', url });
        }
    };

    addInstagramLink('marco-montemagno', 'https://www.instagram.com/marcomontemagno/');
    addInstagramLink('the-voice-italy', 'https://www.instagram.com/thevoice_italy/');
    addInstagramLink('x-factor-italia', 'https://www.instagram.com/xfactoritalia/');

    library.creators.push(
        {
            id: 'francesca-michielin',
            name: 'Francesca Michielin',
            profilePlatform: 'instagram',
            image: 'images/creators/francesca-michielin.webp',
            categoryId: 'musica-italiana',
            category: 'Canzone e scrittura',
            cefr: 'A2—B2',
            description: 'Canzoni, pianoforte e una scrittura personale tra pop, Sanremo e ricerca musicale.',
            longDescription: 'Francesca Michielin attraversa videoclip, esibizioni e conversazioni sulla scrittura. I testi offrono un ascolto ravvicinato della frase italiana, mentre interviste e live mostrano il lessico del lavoro musicale e della scena.',
            personalComment: null,
            levelGuidance: 'Da A2 per ritornelli e videoclip; B1—B2 per seguire interviste, immagini poetiche e il lessico della scrittura musicale.',
            sampleVideo: { id: '2d82kb4_2rU', title: 'Francesca Michielin — Fango in Paradiso' },
            links: [
                { label: 'Instagram', url: 'https://www.instagram.com/francesca_michielin/' },
                { label: 'Canale YouTube', url: 'https://www.youtube.com/@FrancescaMVEVO' },
                { label: 'Profilo Spotify', url: 'https://open.spotify.com/artist/4jFlmD92WULLlaRS8Cj6QS' },
            ],
        },
        {
            id: 'sanremo-rai',
            name: 'Sanremo Rai',
            profilePlatform: 'instagram',
            image: 'images/creators/sanremo-rai.webp',
            categoryId: 'musica-italiana',
            category: 'Festival e spettacolo',
            cefr: 'A2—C1',
            description: 'Il festival come archivio vivo di canzoni, presentazioni, interviste e italiano da prima serata.',
            longDescription: 'Sanremo raccoglie performance, commenti, backstage e una grande varietà di voci italiane. La musica sostiene la comprensione, mentre le presentazioni e le conversazioni fanno sentire il ritmo televisivo, le battute e il lessico dell’attualità culturale.',
            personalComment: null,
            levelGuidance: 'Da A2 per le esibizioni e i ritornelli; B1—C1 per monologhi, interviste, battute e riferimenti culturali del festival.',
            sampleVideo: { id: 'YaRwQe9Q0dg', title: 'Sanremo 2026 — Fedez e Masini cantano « Male necessario »' },
            links: [
                { label: 'Instagram', url: 'https://www.instagram.com/sanremorai/' },
                { label: 'Rai su YouTube', url: 'https://www.youtube.com/@rai' },
            ],
        },
        {
            id: 'il-collegio',
            name: 'Il Collegio',
            profilePlatform: 'instagram',
            image: 'images/creators/il-collegio.webp',
            categoryId: 'creativita-spettacolo',
            category: 'Docu-reality e scuola',
            cefr: 'B1—C1',
            description: 'Vita di classe, regole e generazioni messe a confronto dentro un docu-reality italiano.',
            longDescription: 'Il programma porta ragazzi e ragazze in un collegio ambientato in un’altra epoca. Regole, confessionali, lezioni e conflitti offrono italiano situato, con passaggi tra linguaggio scolastico, emozione e conversazione tra coetanei.',
            personalComment: null,
            levelGuidance: 'Da B1 con il sostegno delle immagini e del contesto scolastico; B2—C1 per ironia, confessionali e cambi di registro.',
            sampleVideo: { id: 'IdSrcNv9TMo', title: 'Le regole del collegio — prima puntata' },
            links: [
                { label: 'Instagram', url: 'https://www.instagram.com/ilcollegioufficialerai/' },
                { label: 'Canale YouTube', url: 'https://www.youtube.com/@ilcollegio' },
                { label: 'RaiPlay', url: 'https://www.raiplay.it/programmi/ilcollegio' },
            ],
        },
        {
            id: 'francesco-cicchella',
            name: 'Francesco Cicchella',
            profilePlatform: 'instagram',
            image: 'images/creators/francesco-cicchella.webp',
            categoryId: 'creativita-spettacolo',
            category: 'Comicità e musica',
            cefr: 'B2—C1',
            description: 'Imitazione, musica e racconto comico: una voce per ascoltare ritmo, personaggi e italiano dello spettacolo.',
            longDescription: 'Francesco Cicchella lavora tra comicità, musica e televisione. L’imitazione rende visibili accento, intenzione e registro, mentre le interviste lasciano emergere una voce più personale e discorsiva.',
            personalComment: null,
            levelGuidance: 'Meglio da B2: le scene aiutano a seguire il contesto, ma imitazioni, velocità e riferimenti televisivi chiedono ascolto attento.',
            sampleVideo: null,
            links: [
                { label: 'Instagram', url: 'https://www.instagram.com/frankcicchella/' },
                { label: 'Intervista su Mediaset Infinity', url: 'https://mediasetinfinity.mediaset.it/video/verissimo/francesco-cicchella-lintervista-integrale_F313480501023C03' },
            ],
        },
        {
            id: 'francesca-tocca',
            name: 'Francesca Tocca',
            profilePlatform: 'instagram',
            image: 'images/creators/francesca-tocca.webp',
            categoryId: 'creativita-spettacolo',
            category: 'Danza e televisione',
            cefr: 'B1—C1',
            description: 'Danza televisiva, prove e performance per seguire il lessico del corpo e dello spettacolo.',
            longDescription: 'Francesca Tocca è associata a performance e programmi italiani di danza. Le immagini sostengono la comprensione, mentre prove, presentazioni e contenuti televisivi aprono uno spazio per il linguaggio della tecnica e della scena.',
            personalComment: null,
            levelGuidance: 'Da B1 con il sostegno della performance; B2—C1 per seguire istruzioni, interviste e commenti sul lavoro coreografico.',
            sampleVideo: null,
            links: [
                { label: 'Instagram', url: 'https://www.instagram.com/francescatocca/' },
                { label: 'Scheda su Witty TV', url: 'https://www.wittytv.it/tag/francesca-tocca/' },
            ],
        },
        {
            id: 'carola-lafuenti',
            name: 'Carola Lafuenti',
            profilePlatform: 'instagram',
            image: 'images/creators/carola-lafuenti.webp',
            categoryId: 'arte-voce',
            category: 'Voce e tecnica',
            cefr: 'B1—C1',
            description: 'Tecnica vocale e pratica del canto osservate attraverso una prospettiva italiana contemporanea.',
            longDescription: 'I contenuti di una vocal coach rendono ascoltabili parole come timbro, respirazione, registro e interpretazione. È una porta laterale sull’italiano: si impara mentre si nomina ciò che succede nella voce e nel corpo.',
            personalComment: null,
            levelGuidance: 'Da B1 con i contenuti dimostrativi; B2—C1 per terminologia vocale, spiegazioni tecniche e valutazioni dell’interpretazione.',
            sampleVideo: null,
            links: [
                { label: 'Instagram', url: 'https://www.instagram.com/carola.lafuenti_vocal.coach/' },
            ],
        },
    );
}());
