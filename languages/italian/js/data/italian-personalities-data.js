/*
 * Italian artists and personalities verified against their current official
 * public channels. Portraits are stable local copies of official channel art.
 */
(function extendItalianPersonalities() {
    "use strict";

    const library = window.ITALIAN_CURATED_LIBRARY;
    if (!library || !Array.isArray(library.creators)) return;

    library.creators.push(
        {
            id: "andrea-cerrato",
            name: "Andrea Cerrato",
            image: "images/creators/andrea-cerrato.jpg",
            categoryId: "musica-italiana",
            category: "Cantautorato indipendente",
            cefr: "A2—B2",
            description: "Canzoni originali, sessioni essenziali e brevi racconti sul mestiere di scrivere ciò che a voce resta difficile dire.",
            longDescription: "Andrea Cerrato è un cantautore indipendente italiano. Sul canale ufficiale alterna videoclip, lyric video, frammenti acustici e brevi aggiornamenti sulla scrittura e sulla vita dei brani. La voce resta in primo piano e i testi usano spesso un italiano contemporaneo, emotivo e diretto: un buon passaggio dalla comprensione del ritornello all’ascolto di una strofa intera.",
            personalComment: null,
            levelGuidance: "Da A2 per ritornelli, titoli e video brevi; B1—B2 per seguire immagini poetiche, elisioni del canto e racconti sulla composizione.",
            sampleVideo: { id: "__F1tdt_sJs", title: "Un anno di SMILE!" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/@andreacerrato" },
                { label: "Instagram", url: "https://www.instagram.com/andcerrato/" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/3DqKEMI2QFZlZARJeE0EPN" }
            ]
        },
        {
            id: "alfa",
            name: "ALFA",
            image: "images/creators/alfa.jpg",
            categoryId: "musica-italiana",
            category: "Pop cantautorale",
            cefr: "A2—B2",
            description: "Pop narrativo e confessionale tra videoclip, versioni dal vivo, collaborazioni e ritornelli costruiti sul parlato quotidiano.",
            longDescription: "ALFA porta nel pop italiano una scrittura molto vicina alla conversazione: frasi brevi, dettagli generazionali, ironia e vulnerabilità. I canali ufficiali raccolgono singoli, performance dal vivo, sessioni e brevi contenuti intorno alle canzoni. Il lessico tende a essere accessibile, mentre il canto compresso e il ritmo richiedono attenzione alle parole legate tra loro.",
            personalComment: null,
            levelGuidance: "Da A2 per seguire ritornelli e parole ricorrenti; B1—B2 per strofe veloci, linguaggio colloquiale e passaggi dal canto al parlato.",
            sampleVideo: { id: "X_05BcnQU0U", title: "Il filo rosso — dal vivo a Milano" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/channel/UCZiqJUM_3lMb2oBdNp0uHIQ" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/7GacyaFUp0qkEJglERX9N7" }
            ]
        },
        {
            id: "irama",
            name: "Irama",
            profilePlatform: "instagram",
            image: "images/creators/irama.jpg",
            categoryId: "musica-italiana",
            category: "Pop e scrittura d’autore",
            cefr: "A2—C1",
            description: "Videoclip, live e ballate in cui pop, scrittura melodica e accenti urban passano dalla confidenza all’esplosione vocale.",
            longDescription: "Irama è un cantautore e performer italiano. Il canale ufficiale segue la sua discografia attraverso videoclip, visual, esibizioni e collaborazioni; il repertorio passa da ballate narrative a produzioni pop e urban più serrate. Per chi studia italiano, le canzoni lente rendono visibili immagini e tempi verbali, mentre i brani ritmici allenano contrazioni, pronuncia cantata e cambi di registro.",
            personalComment: null,
            levelGuidance: "Da A2 con le ballate e i testi a schermo; B1—C1 per metafore, velocità delle strofe e dizione modificata dalla melodia.",
            sampleVideo: { id: "K4cPTgkYG9c", title: "Ovunque sarai" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/@iramaofficial" },
                { label: "Instagram", url: "https://www.instagram.com/irama.plume/" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/5iot8OPcosJN9nCl7I5SdK" }
            ]
        },
        {
            id: "olly",
            name: "Olly",
            image: "images/creators/olly.jpg",
            categoryId: "musica-italiana",
            category: "Cantautorato pop",
            cefr: "A2—B2",
            description: "Canzoni, lyric video e concerti con una scrittura genovese contemporanea, energica sul palco e intima nei testi.",
            longDescription: "Olly è un cantautore genovese e vincitore del Festival di Sanremo con «Balorda nostalgia». Il suo archivio ufficiale unisce videoclip, lyric video, collaborazioni e grandi performance dal vivo. Nelle canzoni convivono frasi quotidiane, nostalgia, amicizia e slancio da concerto: un italiano vicino al parlato, ma spesso accelerato o spezzato dalla metrica.",
            personalComment: null,
            levelGuidance: "Da A2 per ritornelli e lyric video; B1—B2 per seguire immagini emotive, pronuncia cantata e ritmo dei live.",
            sampleVideo: { id: "tRP08h4RJ00", title: "Ho un amico — lyric video" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/channel/UCX3CyDro7Y_xioth1PiM_fA" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/25u1DN0MwQVSav4XoJS7hl" }
            ]
        },
        {
            id: "michele-bravi",
            name: "Michele Bravi",
            image: "images/creators/michele-bravi.jpg",
            categoryId: "musica-italiana",
            category: "Musica, cinema e narrazione",
            cefr: "B1—C1",
            description: "Canzoni e progetti narrativi che intrecciano videoclip, cinema, letteratura e conversazioni sul lavoro creativo.",
            longDescription: "Michele Bravi è un cantautore, autore e interprete italiano. Dopo l’esordio musicale, ha costruito una discografia in cui album e singoli dialogano con cinema e narrativa; il progetto «Lo ricordo io per te», dedicato alla memoria e all’Alzheimer, unisce musica, immagini e racconto. Sul canale ufficiale si trovano brani, visual e materiali che premiano un ascolto attento alle metafore e alla costruzione della frase.",
            personalComment: null,
            levelGuidance: "Da B1 per i brani con testo chiaro; B2—C1 per metafore, interviste e lessico legato a memoria, cinema e composizione.",
            sampleVideo: { id: "vJVGUGNAc88", title: "Lo ricordo io per te" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/channel/UChOHBb6xzm4DOKI1-mr2gpg" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/1CF7hrTuWgErEa6HBFJ8d3" }
            ]
        },
        {
            id: "matteo-romano",
            name: "Matteo Romano",
            image: "images/creators/matteo-romano.jpg",
            categoryId: "musica-italiana",
            category: "Nuovo pop italiano",
            cefr: "A2—B2",
            description: "Singoli, videoclip e sessioni pop dalla scrittura ravvicinata, con emozioni quotidiane e melodie molto leggibili.",
            longDescription: "Matteo Romano è un cantautore italiano emerso prima con pubblicazioni digitali e poi sul palco di Sanremo. Il suo canale ufficiale raccoglie singoli, videoclip e brani in cui relazioni, esitazioni e memoria vengono raccontate con un lessico giovane e diretto. La produzione lascia spesso spazio alla voce, utile per riconoscere parole chiave e strutture ripetute.",
            personalComment: null,
            levelGuidance: "Da A2 per ritornelli e lessico emotivo frequente; B1—B2 per seguire l’intero racconto e le sfumature della pronuncia cantata.",
            sampleVideo: { id: "G-crmJGZwNU", title: "Non esisti" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/channel/UCgFC9y87e-cDbelKbKGPdog" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/5Imsy0ZXNi7uWLJpP5dZ8b" }
            ]
        },
        {
            id: "moda",
            name: "Modà",
            image: "images/creators/moda.jpg",
            categoryId: "musica-italiana",
            category: "Pop rock e ballata",
            cefr: "A2—B2",
            description: "Videoclip, live e ballate pop rock costruite su amore, separazione e memoria, con ritornelli ampi e dizione riconoscibile.",
            longDescription: "I Modà sono una band pop rock italiana attiva dai primi anni Duemila, guidata dalla voce e dalla scrittura di Kekko Silvestre. Il canale ufficiale conserva videoclip, esibizioni e brani presentati anche a Sanremo. Le canzoni raccontano soprattutto relazioni e passaggi emotivi con strutture narrative chiare; il registro è accessibile, anche quando la voce allunga o comprime le sillabe.",
            personalComment: null,
            levelGuidance: "Da A2 per i ritornelli e il lessico sentimentale; B1—B2 per strofe narrative, tempi del passato e immagini figurate.",
            sampleVideo: { id: "zmXOx-MGDAc", title: "Non ti dimentico" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/@rockmoda" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/34LniBXZel58HhcdIX0ysN" }
            ]
        },
        {
            id: "showtime-gp",
            name: "Showtime Gp",
            image: "images/creators/showtime-gp.jpg",
            categoryId: "sport-movimento",
            category: "Freestyle e allenamento",
            cefr: "A2—B2",
            description: "Brevi prove atletiche, freestyle, danza e motivazione: il gesto mostra subito il significato delle parole sul corpo.",
            longDescription: "Showtime Gp è il canale di Giampaolo Calvaresi, atleta, freestyler, personal trainer e performer. I contenuti sono soprattutto brevi: esercizi, trasformazioni, sfide, trucchi di movimento e momenti di spettacolo. L’immagine sostiene fortemente la comprensione, mentre comandi, parti del corpo e commenti motivazionali offrono un vocabolario pratico e ripetibile.",
            personalComment: null,
            levelGuidance: "Da A2 grazie al formato visivo e al lessico concreto; B1—B2 per spiegazioni tecniche, ironia e ritmo molto rapido dei video brevi.",
            sampleVideo: { id: "xMaq1PIKlRA", title: "Come dimagrire velocemente" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/@Giampaolo.Calvaresi" }
            ]
        },
        {
            id: "mr-rain",
            name: "Mr.Rain",
            image: "images/creators/mr-rain.jpg",
            categoryId: "musica-italiana",
            category: "Rap melodico e ballata",
            cefr: "A2—B2",
            description: "Videoclip e visual in cui rap melodico, pianoforte e ritornelli corali raccontano fragilità, legami e ripartenze.",
            longDescription: "Mr.Rain è un cantautore e rapper italiano. Il canale ufficiale attraversa la sua musica con videoclip, visual art video e brevi anticipazioni: le strofe alternano parlato ritmico e melodia, mentre i ritornelli tendono a rendere esplicito il centro emotivo del brano. È un ascolto utile per confrontare la stessa frase quando viene rappata, cantata o ripetuta in coro.",
            personalComment: null,
            levelGuidance: "Da A2 per i ritornelli e i visual; B1—B2 per seguire strofe rappate, metafore e cambi di velocità.",
            sampleVideo: { id: "yXbx3xtxyjc", title: "Sempre un po’ di te" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/@MRRAINOFFICIALCHANNEL" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/59MLbXG0jLVwJup3KAd6m1" }
            ]
        },
        {
            id: "emanuele-aloia",
            name: "Emanuele Aloia",
            profilePlatform: "instagram",
            image: "images/creators/emanuele-aloia.jpg",
            categoryId: "musica-italiana",
            category: "Canzone e immaginario artistico",
            cefr: "A2—B2",
            description: "Lyric video e canzoni pop che trasformano quadri, libri e immagini celesti in lessico sentimentale contemporaneo.",
            longDescription: "Emanuele Aloia è un cantautore italiano la cui scrittura usa spesso riferimenti all’arte, alla letteratura e alla storia delle immagini. Il canale ufficiale privilegia lyric video e visual, quindi le parole restano disponibili mentre si ascolta. Titoli e testi mettono in dialogo sentimenti quotidiani con opere e figure culturali: una combinazione utile per fissare vocabolario emotivo e riferimenti italiani ed europei.",
            personalComment: null,
            levelGuidance: "Da A2 grazie ai lyric video; B1—B2 per metafore, riferimenti artistici e forme poetiche del lessico amoroso.",
            sampleVideo: { id: "CSO-TtXAFk4", title: "Si è spenta anche la luna — lyric video" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/@EmanueleAloia" },
                { label: "Instagram", url: "https://www.instagram.com/emanuele.aloia/" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/3vkFU3DBYyYBSUt323pj76" }
            ]
        },
        {
            id: "sarah-toscano",
            name: "Sarah Toscano",
            profilePlatform: "instagram",
            image: "images/creators/sarah-toscano.jpg",
            categoryId: "musica-italiana",
            category: "Pop contemporaneo",
            cefr: "A2—C1",
            description: "Pop italiano, videoclip e performance dal vivo: una voce giovane passa da ritornelli immediati a interviste sul lavoro musicale.",
            longDescription: "Sarah Toscano è una cantante italiana di Vigevano e la vincitrice di Amici 23. Il suo percorso pubblico comprende singoli pop, videoclip, esibizioni televisive e live radiofonici, con una scrittura che alterna energia, relazioni e momenti più introspettivi. Le canzoni aiutano a riconoscere formule e lessico emotivo; le interviste mostrano invece un parlato giovane, spontaneo e più veloce.",
            personalComment: null,
            levelGuidance: "Da A2 per ritornelli, parole ricorrenti e performance sostenute dalle immagini; B1—C1 per interviste, ritmo colloquiale e sfumature della pronuncia cantata.",
            sampleVideo: { id: "QfX0cxlOIIw", title: "Atlantide — Radio2 Live" },
            links: [
                { label: "Instagram", url: "https://www.instagram.com/_sarahtoscano_/" },
                { label: "Profilo su Witty TV", url: "https://www.wittytv.it/allievi2/sarah/" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/3dsL845RhsJDZPc7BdGsN5" }
            ]
        },
        {
            id: "alessia-pecchia",
            name: "Alessia Pecchia",
            profilePlatform: "instagram",
            image: "images/creators/alessia-pecchia.jpg",
            categoryId: "sport-movimento",
            category: "Danza latino-americana",
            cefr: "A2—C1",
            description: "Danza latino-americana, prove e conversazioni sulla formazione: il movimento rende concreto anche il lessico più tecnico.",
            longDescription: "Alessia Pecchia è una ballerina italiana specializzata nelle danze latino-americane e finalista ad Amici 24. Nelle esibizioni lavora su musicalità, precisione e presenza scenica; nelle interviste racconta allenamento, gare, studio e passaggi del proprio percorso professionale. L’appoggio visivo facilita la comprensione delle performance, mentre le conversazioni offrono un lessico più ampio su disciplina, emozioni e obiettivi.",
            personalComment: null,
            levelGuidance: "Da A2 per prove ed esibizioni sostenute dal gesto; B1—C1 per interviste, termini della danza e racconto articolato della formazione.",
            sampleVideo: { id: "3yFB730topI", title: "Dimmi di te — Alessia Pecchia" },
            links: [
                { label: "Instagram", url: "https://www.instagram.com/_alessia_pecchia_/" },
                { label: "Profilo su Witty TV", url: "https://www.wittytv.it/allievi2/alessia-2/" }
            ]
        },
        {
            id: "antonia-nocca",
            name: "Antonia Nocca",
            profilePlatform: "instagram",
            image: "images/creators/antonia-nocca.jpg",
            categoryId: "musica-italiana",
            category: "Pop vocale e interpretazione",
            cefr: "A2—C1",
            description: "Pop vocale, visual e performance in cui l’interpretazione mette in primo piano emozioni, intenzione e chiarezza melodica.",
            longDescription: "Antonia Nocca è una cantante napoletana e finalista ad Amici 24. Il suo repertorio pubblico comprende brani come «Dove ti trovi tu», «Romantica» e «Giganti», oltre a esibizioni e materiali legati all’EP «Relax». La centralità della voce rende leggibile il nucleo emotivo dei brani, mentre interviste e contenuti dietro le quinte permettono di ascoltare un italiano spontaneo e legato al lavoro d’interprete.",
            personalComment: null,
            levelGuidance: "Da A2 per ritornelli e parole emotive ricorrenti; B1—C1 per strofe meno lineari, interviste e differenze tra dizione cantata e parlato naturale.",
            sampleVideo: { id: "ZbwBZmOI_v4", title: "Romantica — visual video" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/@antoniaofficialchannel" },
                { label: "Instagram", url: "https://www.instagram.com/antonianocca/" },
                { label: "Profilo su Witty TV", url: "https://www.wittytv.it/allievi2/antonia/" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/7FHXOCS4B6dXsf5x3KmRr0" }
            ]
        },
        {
            id: "alessio-di-ponzio",
            name: "Alessio Di Ponzio",
            profilePlatform: "instagram",
            image: "images/creators/alessio-di-ponzio.jpg",
            categoryId: "sport-movimento",
            category: "Danza urbana e contemporanea",
            cefr: "A2—C1",
            description: "Coreografie urban, hip-hop e contemporanee, con prove e interviste su tecnica, recupero fisico e crescita professionale.",
            longDescription: "Alessio Di Ponzio è un ballerino italiano di Taranto. Dopo aver dovuto interrompere Amici 24 per un infortunio, è tornato nel programma e ha vinto il circuito danza di Amici 25. Le sue performance attraversano hip-hop, modern e contemporaneo; il gesto sostiene la comprensione immediata, mentre interviste e commenti di prova introducono il lessico della tecnica, della preparazione e del lavoro scenico.",
            personalComment: null,
            levelGuidance: "Da A2 per performance e indicazioni legate al movimento; B1—C1 per interviste, spiegazioni tecniche e racconto di infortunio, recupero e professione.",
            sampleVideo: { id: "NNqaTSj8lIM", title: "Alessio Di Ponzio e Daniele Doria ballano Taki" },
            links: [
                { label: "Instagram", url: "https://www.instagram.com/alessio_di_ponzio/" },
                { label: "Intervista su Mediaset Infinity", url: "https://www.tgcom24.mediaset.it/televisione/amici/25/verissimo-amici-alessio-di-ponzio_112438477-202602k.shtml" }
            ]
        },
        {
            id: "nicolo-filippucci",
            name: "Nicolò Filippucci",
            profilePlatform: "instagram",
            image: "images/creators/nicolo-filippucci.jpg",
            categoryId: "musica-italiana",
            category: "Cantautorato e pop vocale",
            cefr: "A2—C1",
            description: "Canzoni, performance e conversazioni sul mestiere musicale, con una voce pop che passa dall’interpretazione alla scrittura.",
            longDescription: "Nicolò Filippucci è un cantante e cantautore italiano della provincia di Perugia, conosciuto dal pubblico di Amici 24. Il suo materiale pubblico affianca singoli come «Cuore Bucato» a esibizioni e interviste sul percorso artistico, sulla scrittura e sul lavoro in studio. I brani offrono strutture ripetute e un lessico emotivo accessibile; le conversazioni richiedono maggiore attenzione ai tempi del racconto e alle espressioni colloquiali.",
            personalComment: null,
            levelGuidance: "Da A2 per ritornelli e videoclip; B1—C1 per interviste lunghe, lessico della composizione e passaggi spontanei tra esperienza personale e progetto artistico.",
            sampleVideo: { id: "BRB19izLivU", title: "Dimmi di te — Nicolò Filippucci" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/channel/UCOShtIyN-jiiPNQbY9vOabw" },
                { label: "Instagram", url: "https://www.instagram.com/_nicolofilippucci_/" },
                { label: "Profilo su Witty TV", url: "https://www.wittytv.it/allievi2/nicolo-2/" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/5v11UeQ72AbrburRA8fkMi" }
            ]
        },
        {
            id: "luk3",
            name: "LUK3",
            profilePlatform: "instagram",
            image: "images/creators/luk3.jpg",
            categoryId: "musica-italiana",
            category: "Pop giovane e scrittura digitale",
            cefr: "A2—B2",
            description: "Singoli, videoclip e collaborazioni pop con frasi quotidiane, immagini sentimentali e un ritmo vicino ai linguaggi social.",
            longDescription: "LUK3, nome d’arte di Luca Pasquariello, è un giovane cantante e cantautore campano passato da Amici 24. Il suo catalogo comprende brani come «Roma lo sa», «Parigi in motorino» e «Melodrammatica», costruiti su relazioni, distanza e immagini della vita quotidiana. Videoclip e ritornelli rendono accessibili le parole chiave; strofe più rapide e pronuncia cantata allenano invece l’ascolto dell’italiano pop contemporaneo.",
            personalComment: null,
            levelGuidance: "Da A2 per ritornelli, immagini e lessico quotidiano; B1—B2 per strofe veloci, ellissi, riferimenti giovanili e pronuncia modificata dalla melodia.",
            sampleVideo: { id: "e34R7iKmFQU", title: "Melodrammatica — video ufficiale" },
            links: [
                { label: "Canale YouTube", url: "https://www.youtube.com/@Luk3official" },
                { label: "Instagram", url: "https://www.instagram.com/luk3official_/" },
                { label: "Amici su Witty TV", url: "https://www.wittytv.it/amici/luk3-e-il-quarto-eliminato-di-amici-24/" },
                { label: "Profilo Spotify", url: "https://open.spotify.com/artist/0whO28HUyJLt9F0bLNzqU1" }
            ]
        }
    );
}());
