// js/data/book_data.js

const publicDomainBooks_data = [
    // --- Spanish Books ---
    {
        id: "es_don_quijote_de_la_mancha",
        title: "Don Quijote de la Mancha",
        author: "Miguel de Cervantes Saavedra",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Novels", "Fiction", "Adventure"],
        recommendedCEFR: "C2",
        coverImg: "https://imgv2-1-f.scribdassets.com/img/word_document/315233472/original/216x287/36867d8558/1752371410?v=1",
        description: "The seminal work of Spanish literature, this novel follows the comedic and epic adventures of a nobleman who, driven mad by reading chivalric romances, sets out to become a knight-errant.",
        pdfLink: null,
        epubLink: "https://drive.google.com/open?id=1e2tynkDTYQz8Mfhx4SLr64suS4E3hzP2&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_cien_anos_de_soledad",
        title: "Cien años de soledad",
        author: "Gabriel García Márquez",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Magic Realism", "Fiction"],
        recommendedCEFR: "C1",
        coverImg: "https://m.media-amazon.com/images/I/91TvVQS7loL._UF1000,1000_QL80_.jpg",
        description: "The multi-generational saga of the Buendía family in the mythical town of Macondo. A masterpiece of magic realism and a cornerstone of Latin American literature.",
        pdfLink: "https://drive.google.com/open?id=1FUO_6q4PQGDK443GjkwkUlOcguNs087K&usp=drive_copy",
        epubLink: "https://drive.google.com/open?id=12VrymDsNdsqZp34ONE36gM48kaXvjFBo&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_el_amor_en_los_tiempos_del_colera",
        title: "El amor en los tiempos del cólera",
        author: "Gabriel García Márquez",
        language: "es",
        languageName: "Español",
        genres: ["Romance", "Classics", "Fiction"],
        recommendedCEFR: "C1",
        coverImg: "https://m.media-amazon.com/images/I/71mKpV0iLdL._UF1000,1000_QL80_.jpg",
        description: "A timeless love story spanning over half a century. Florentino Ariza waits 51 years, 9 months, and 4 days for his beloved, a beautiful meditation on love, aging, and time.",
        pdfLink: null,
        epubLink: "https://drive.google.com/open?id=1aisDiB6Fy2_Iipvtb_YS4pq48MHyALaD&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_del_amor_y_otros_demonios",
        title: "Del amor y otros demonios",
        author: "Gabriel García Márquez",
        language: "es",
        languageName: "Español",
        genres: ["Historical Fiction", "Romance", "Magic Realism"],
        recommendedCEFR: "C1",
        coverImg: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1284242962i/9283798.jpg",
        description: "A tragic and poetic novel about the forbidden love between a supposedly possessed young girl and the priest sent to exorcise her in colonial Cartagena.",
        pdfLink: null,
        epubLink: "https://drive.google.com/open?id=1r8gBlwP-mBufzOuGQpMygINBiNo31N88&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_la_sombra_del_viento",
        title: "La Sombra del Viento",
        author: "Carlos Ruiz Zafón",
        language: "es",
        languageName: "Español",
        genres: ["Mystery", "Historical Fiction", "Thriller"],
        recommendedCEFR: "B2",
        coverImg: "https://m.media-amazon.com/images/I/81CEi-3PbBL._UF1000,1000_QL80_.jpg",
        description: "A literary mystery set in post-war Barcelona. A young boy finds a cursed book, leading him into a web of secrets, love, and tragedy surrounding its mysterious author.",
        pdfLink: "https://drive.google.com/open?id=1OeUcTp9BOl9nstjwcqJz_aRFM8ran8PL&usp=drive_copy",
        epubLink: "https://drive.google.com/open?id=1jGL_h5LeRonWa3KQJ23dSgshWugnqNLr&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_la_casa_de_los_espiritus",
        title: "La casa de los espíritus",
        author: "Isabel Allende",
        language: "es",
        languageName: "Español",
        genres: ["Magic Realism", "Historical Fiction", "Saga"],
        recommendedCEFR: "C1",
        coverImg: "https://m.media-amazon.com/images/I/816xOSfb2XL._UF1000,1000_QL80_.jpg",
        description: "The powerful debut novel from Isabel Allende, chronicling the lives of the Trueba family through several generations against the backdrop of Chile's tumultuous political history.",
        pdfLink: "https://drive.google.com/open?id=1K7hr7ciCXy9TyU84BtaYNOPLyF8CzEux&usp=drive_copy",
        epubLink: "https://drive.google.com/open?id=1O53-ipkEFIqdDd6Y5v1CnJrPVMGrbQ1d&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_como_agua_para_chocolate",
        title: "Como agua para chocolate",
        author: "Laura Esquivel",
        language: "es",
        languageName: "Español",
        genres: ["Magic Realism", "Romance", "Fiction"],
        recommendedCEFR: "B2",
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2Z9ojggK7owtCSjWK1h7ngQEhTZNidE2twg&s",
        description: "A novel where cooking and emotions magically intertwine. Tita, forbidden to marry her true love, expresses her feelings through her recipes, which have magical effects on those who eat them.",
        pdfLink: "https://drive.google.com/open?id=1Meca72Sz2bhImWtd0SJkJU5HiS1g83tF&usp=drive_copy",
        epubLink: "https://drive.google.com/open?id=1BMQaOEG2cIGtBMwB_albDe4XdDt0i9_X&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_confieso_que_he_vivido",
        title: "Confieso Que He Vivido",
        author: "Pablo Neruda",
        language: "es",
        languageName: "Español",
        genres: ["Memoir", "Autobiography", "Poetry"],
        recommendedCEFR: "C2",
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUrVpq6v5e9OYNr3Dwxi4pm738Flip-6c3Ow&s",
        description: "The memoirs of Nobel Prize-winning poet Pablo Neruda. A journey through his travels, loves, political activism, and the creative process behind his celebrated works.",
        pdfLink: "https://drive.google.com/open?id=1Q_4ImgCgkQvhzzMJGxFGn1zjFk0C-LEk&usp=drive_copy",
        epubLink: "https://drive.google.com/open?id=1LzSWpX3Df0yX4wiTzwVcaPndnueRkOsO&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_cinco_esquinas",
        title: "Cinco esquinas",
        author: "Mario Vargas Llosa",
        language: "es",
        languageName: "Español",
        genres: ["Thriller", "Political Fiction", "Novels"],
        recommendedCEFR: "C1",
        coverImg: "https://m.media-amazon.com/images/I/81UhbS5gMrL._UF1000,1000_QL80_.jpg",
        description: "A thriller set during the final months of Fujimori's dictatorship in Peru, exploring how yellow journalism can be weaponized for political ends.",
        pdfLink: "https://drive.google.com/open?id=19SkTyqkeJjLP9pBtQ5qzV1qJ7_OMp8AC&usp=drive_copy",
        epubLink: "https://drive.google.com/open?id=1SUfBXBnXQIr-G80V9lg3Zsoe0_SKpJzp&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_travesuras_de_la_nina_mala",
        title: "Travesuras de la niña mala",
        author: "Mario Vargas Llosa",
        language: "es",
        languageName: "Español",
        genres: ["Romance", "Novels", "Fiction"],
        recommendedCEFR: "C1",
        coverImg: "https://m.media-amazon.com/images/I/81XLlbh7cXL.jpg",
        description: "An obsessive love story that spans four decades and three continents, following Ricardo Somocurcio's tumultuous relationship with an enigmatic woman who constantly reappears in his life under different identities.",
        pdfLink: "https://drive.google.com/open?id=1joVgWsKxn6DizBiU3YUDiGACzlAL7RJS&usp=drive_copy",
        epubLink: "https://drive.google.com/open?id=1XlCQxyWVDoMti3702L7YvZyVfa7Z27Da&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_niebla",
        title: "Niebla",
        author: "Miguel de Unamuno",
        language: "es",
        languageName: "Español",
        genres: ["Philosophy", "Classics", "Fiction"],
        recommendedCEFR: "C2",
        coverImg: "https://m.media-amazon.com/images/I/710G+uFD-YL._UF1000,1000_QL80_.jpg",
        description: "A philosophical novel that breaks the fourth wall. The protagonist, Augusto Pérez, confronts his own author to question his existence. A foundational work of the Generation of '98.",
        pdfLink: null,
        epubLink: "https://drive.google.com/open?id=1qsiG5KvWHDjqQI0DnkxMz7nI_v9uvKwn&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_la_tia_tula",
        title: "La tía Tula",
        author: "Miguel de Unamuno",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Fiction", "Novels"],
        recommendedCEFR: "C1",
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW10yF-yJVZ3gS5pSrPEIg3N2KsLKRiz0WLQ&s",
        description: "An intense psychological portrait of frustrated motherhood and sacrifice in early 20th-century Spain. Tula dedicates her life to raising her deceased sister's children, forgoing her own.",
        pdfLink: null,
        epubLink: "https://drive.google.com/open?id=1EMofCoYVo99pbjgPSGx1--Y1xF0ET5vE&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_del_sentimiento_tragico_de_la_vida",
        title: "Del sentimiento trágico de la vida",
        author: "Miguel de Unamuno",
        language: "es",
        languageName: "Español",
        genres: ["Philosophy", "Essay", "Non-Fiction"],
        recommendedCEFR: "C2",
        coverImg: "https://m.media-amazon.com/images/I/81tI6+WJ2pL._UF1000,1000_QL80_.jpg",
        description: "One of Unamuno's most important philosophical essays, exploring the existential struggle between reason and faith, and the human longing for immortality.",
        pdfLink: null,
        epubLink: "https://drive.google.com/open?id=1cJHGiO4EelQ32666eMv0uMJaF1vo6tZQ&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_amor_y_pedagogia",
        title: "Amor y Pedagogía",
        author: "Miguel de Unamuno",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Satire", "Fiction"],
        recommendedCEFR: "C2",
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1m9GZDnOEWXM3b1mR9zfAnYp5gv0rXfreAw&s",
        description: "A satire on the attempt to create a genius through a purely scientific upbringing. A fierce critique of positivism, championing the importance of love and the irrational.",
        pdfLink: null,
        epubLink: "https://drive.google.com/open?id=1-WTwghZZ9_5q7I53km5GWFWcw3FYBYBz&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_tres_novelas_ejemplares",
        title: "Tres novelas ejemplares y un prólogo",
        author: "Miguel de Unamuno",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Short Stories", "Fiction"],
        recommendedCEFR: "C1",
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN5k4SED4Bku6iP3ZWWzIQ53y2PRsc3cQMGA&s",
        description: "A collection of three short novels where Unamuno's strong protagonists struggle to impose their will against social conventions.",
        pdfLink: null,
        epubLink: "https://drive.google.com/open?id=13UAJVW5iRPe3BnIsHKzqdT5rVkwZ308V&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_resena_veridica_revolucion_filipina",
        title: "Reseña Verídica de la Revolución Filipina",
        author: "Emilio Aguinaldo",
        language: "es",
        languageName: "Español",
        genres: ["History", "Non-Fiction", "Memoir"],
        recommendedCEFR: "C1",
        coverImg: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1481198070i/33242220.jpg",
        description: "A first-person historical account by Emilio Aguinaldo of the events leading to the declaration of Philippine independence, originally written in Spanish.",
        pdfLink: null,
        epubLink: "https://drive.google.com/open?id=1-WTwghZZ9_5q7I53km5GWFWcw3FYBYBz&usp=drive_copy",
        aljohnsNotes: ""
    },
    {
        id: "es_olly_richards_short_stories",
        title: "Short Stories in Spanish for Beginners",
        author: "Olly Richards",
        language: "es",
        languageName: "Español",
        genres: ["Short Stories", "Learning", "Fiction"],
        recommendedCEFR: "B1",
        coverImg: "https://m.media-amazon.com/images/I/71+lEr6-peL._SY466_.jpg",
        description: "A collection of eight unconventional short stories designed for A2-B1 level students. An excellent tool for building reading confidence with controlled vocabulary and comprehension questions.",
        pdfLink: null,
        epubLink: null,
        aljohnsNotes: "This is, without a doubt, the first book I look for every time I start a new language. It's the perfect tool for gaining confidence in reading."
    },
    {
        id: "es_cuentos_que_cuidan",
        title: "Cuentos que cuidan",
        author: "UNICEF (Varios Autores)",
        language: "es",
        languageName: "Español",
        genres: ["Children's Book", "Illustrated", "Fiction"],
        recommendedCEFR: "A2",
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScBJbepHtNxc3XzC5HLhlVVz8Ypv1FLFIv_Q&s",
        description: "A delightful UNICEF collection of illustrated tales designed for early childhood, gently exploring rights like education, inclusion, and health through charming narratives.",
        pdfLink: "https://www.unicef.org/chile/media/5111/file/Cuentos%20que%20cuidan%20.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "es_platero_y_yo",
        title: "Platero y yo",
        author: "Juan Ramón Jiménez",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Fiction", "Poetry"],
        recommendedCEFR: "B2",
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTo8AA_xLcsZDVVj6eSeG1DoFGjePRiG4j4w&s",
        description: "A poetic and elegiac narrative from Nobel laureate Juan Ramón Jiménez, tenderly recounting the life and companionship of his beloved donkey, Platero, in their Andalusian village.",
        pdfLink: "https://www.suneo.mx/literatura/subidas/Juan%20Ram%C3%B3n%20Jim%C3%A9nez%20%20Platero%20y%20yo.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/9980.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "es_fuenteovejuna",
        title: "Fuenteovejuna",
        author: "Lope de Vega",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Theater", "Fiction"],
        recommendedCEFR: "C1",
        coverImg: "https://www.elejandria.com/covers/Fuente_Ovejuna-Lope_de_Vega-lg.png",
        description: "Lope de Vega's powerful Golden Age drama depicting the collective uprising of the village of Fuenteovejuna against a tyrannical and abusive commander.",
        pdfLink: null,
        epubLink: "https://www.gutenberg.org/ebooks/60198.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "es_la_vida_es_sueno",
        title: "La vida es sueño",
        author: "Pedro Calderón de la Barca",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Theater", "Fiction", "Philosophy"],
        recommendedCEFR: "C1",
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO_LMQ640vkGYORKE1H9t4J1a6HAHkpxVBIQ&s",
        description: "Calderón de la Barca's philosophical masterpiece exploring themes of free will, destiny, and the illusion of reality through the story of Prince Segismundo.",
        pdfLink: "https://www.suneo.mx/literatura/subidas/Pedro%20Calder%C3%B3n%20de%20la%20Barca%20La%20vida%20es%20sue%C3%B1o.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "es_noli_me_tangere",
        title: "Noli Me Tángere",
        author: "José Rizal",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Novels", "Fiction", "History"],
        recommendedCEFR: "C1",
        coverImg: "https://m.media-amazon.com/images/I/81IJ4FVDuYL._AC_UF1000,1000_QL80_.jpg",
        description: "José Rizal's seminal novel that courageously exposed the injustices of Spanish colonial rule in the Philippines, igniting a nation's spirit.",
        pdfLink: null,
        epubLink: "https://www.gutenberg.org/ebooks/20228.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "es_el_filibusterismo",
        title: "El Filibusterismo",
        author: "José Rizal",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Novels", "Fiction", "History"],
        recommendedCEFR: "C1",
        coverImg: "https://m.media-amazon.com/images/I/711HLGoYJQL._AC_UF1000,1000_QL80_DpWeblab_.jpg",
        description: "The fiery sequel to 'Noli Me Tángere,' Rizal's 'El Filibusterismo' intensifies the critique of colonialism and explores the difficult path to reform in the Philippines.",
        pdfLink: null,
        epubLink: "https://www.gutenberg.org/ebooks/30903.epub.images",
        aljohnsNotes: ""
    },

    // --- French Books ---
    {
        id: "fr_le_petit_prince",
        title: "Le Petit Prince",
        author: "Antoine de Saint-Exupéry",
        language: "fr",
        languageName: "Français",
        genres: ["Children's Book", "Classics", "Fiction", "Illustrated", "Philosophy"],
        recommendedCEFR: ["A2", "B1"], // Accessible language, deep themes
        coverImg: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1367545443i/157993.jpg",
        description: "A timeless fable where a stranded pilot meets a young prince from another planet, leading to profound reflections on friendship, love, loss, and the essence of life.",
        pdfLink: "https://www.ebooksgratuits.com/pdf/st_exupery_le_petit_prince.pdf",
        epubLink: "https://archive.org/download/le-petit-prince-antoine-st-ex-livre/%20Le_petit_prince%20Antoine%20St%20Ex%20Livre.epub",
        aljohnsNotes: ""
    },
    {
        id: "fr_au_secours_waldo",
        title: "Au secours, Waldo !",
        author: "Wilhelm, Hans",
        language: "fr",
        languageName: "Français",
        genres: ["Children's Book", "Illustrated"],
        recommendedCEFR: "A1", // Very simple children's story
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE8alGAKM4nFeamsdmQk1J6QVUgEWK40vVlA&s",
        description: "A charming illustrated story where three mischievous bunnies learn a lesson in kindness when they unexpectedly need help from old Grandfather Lampe.",
        pdfLink: "https://archive.org/download/AuSecoursWaldo/Au%20secours%2C%20Waldo%20%21.pdf",
        epubLink: "https://archive.org/download/AuSecoursWaldo/Au%20secours%2C%20Waldo%20%21.epub",
        aljohnsNotes: ""
    },
    {
        id: "fr_asterix_gaulois",
        title: "Astérix le Gaulois",
        author: "Goscinny & Uderzo",
        language: "fr",
        languageName: "Français",
        genres: ["Comics", "Fiction", "Illustrated", "Humor"],
        recommendedCEFR: ["A2", "B1"], // Visually supported, conversational
        coverImg: "https://imgv2-1-f.scribdassets.com/img/document/710257348/298x396/98c3e5cc69/1709490711?v=1",
        description: "The first adventure of the indomitable Gaul, Astérix, and his hefty friend Obélix as they defend their village from Roman legions with a little help from magic potion.",
        pdfLink: "http://flo.vas.free.fr/Ast%E9rix%20et%20Ob%E9lix%20by%20florentfr62/Ast%E9rix%20-%2001%20-%20Asterix%20le%20Gaulois.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "fr_asterix_compagnie",
        title: "Astérix et Obélix et Compagnie",
        author: "Goscinny & Uderzo",
        language: "fr",
        languageName: "Français",
        genres: ["Comics", "Fiction", "Illustrated", "Humor", "Satire"],
        recommendedCEFR: ["B1", "B2"], // More wordplay and satire
        coverImg: "https://imgv2-1-f.scribdassets.com/img/document/390672337/original/d79e6976b2/1?v=1",
        description: "Julius Caesar attempts a new strategy to conquer the Gauls: introducing capitalism and big business to their small village, with chaotic results.",
        pdfLink: "https://archive.org/download/23AsterixObelixEtCompagnie/23-asterix-obelix-et-compagnie.pdf",
        epubLink: "https://archive.org/download/23AsterixObelixEtCompagnie/23-asterix-obelix-et-compagnie.epub",
        aljohnsNotes: ""
    },
    {
        id: "fr_asterix_serpe_or",
        title: "La Serpe d'or", // Asterix and the Golden Sickle
        author: "Goscinny & Uderzo",
        language: "fr",
        languageName: "Français",
        genres: ["Comics", "Fiction", "Illustrated", "Humor"],
        recommendedCEFR: ["A2", "B1"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUZApPdJ4zcyCvWmnHMOe0UICBzrnYLPcpcw&s",
        description: "Astérix and Obélix embark on a quest to Lutetia (Paris) to find a new golden sickle for their druid, encountering a notorious band of sickle traffickers.",
        pdfLink: "https://n1other.hjfile.cn/st/2016/08/23/c7edd0d8e401d6612a5dc36a9041211c.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "fr_fables_la_fontaine",
        title: "Les Fables de La Fontaine",
        author: "Jean de La Fontaine",
        language: "fr",
        languageName: "Français",
        genres: ["Classics", "Children's Book", "Fiction", "Poetry"],
        recommendedCEFR: ["B1", "B2"], // Poetic language, allegorical
        coverImg: "https://www.gutenberg.org/cache/epub/56327/pg56327.cover.medium.jpg",
        description: "A celebrated collection of fables in verse, where animals and mythical creatures offer timeless moral lessons and witty observations on human nature.",
        pdfLink: "https://beq.ebooksgratuits.com/vents/Lafontaine-fables-1.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/56327.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "fr_petit_chaperon_rouge",
        title: "Le Petit Chaperon Rouge",
        author: "Charles Perrault",
        language: "fr",
        languageName: "Français",
        genres: ["Children's Book", "Classics", "Fiction", "Folklore"],
        recommendedCEFR: "A2", // Classic fairy tale, simpler language
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl95lEn-wb99DdzqkCV2VtzFcJ10HGuBPYmA&s",
        description: "Charles Perrault's classic version of the beloved fairy tale about a young girl's perilous journey through the woods to visit her grandmother.",
        pdfLink: "https://www.ebooks.education.pf/wp-content/ebooks/albums/Le%20petit%20chaperon.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "fr_voyage_centre_terre",
        title: "Voyage au centre de la Terre",
        author: "Jules Verne",
        language: "fr",
        languageName: "Français",
        genres: ["Classics", "Novels", "Fiction", "Adventure", "Sci-Fi"],
        recommendedCEFR: ["B1", "B2"], // Adventure story, descriptive language
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDHFJRPWr_it3BbVzeIuQIjGmIuydXK19SOA&s",
        description: "Jules Verne's thrilling adventure following Professor Lidenbrock and his nephew Axel as they descend into an Icelandic volcano to reach the Earth's core.",
        pdfLink: "https://beq.ebooksgratuits.com/vents/Verne-centre.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/4791.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "fr_trois_mousquetaires",
        title: "Les Trois Mousquetaires",
        author: "Alexandre Dumas",
        language: "fr",
        languageName: "Français",
        genres: ["Classics", "Novels", "Fiction", "Adventure", "Historical Novel"],
        recommendedCEFR: ["B2", "C1"], // Lengthy, rich vocabulary, historical context
        coverImg: "https://www.gutenberg.org/cache/epub/13951/pg13951.cover.medium.jpg",
        description: "Alexandre Dumas's swashbuckling tale of youthful ambition, camaraderie, and adventure in 17th-century France, following d'Artagnan and the legendary musketeers.",
        pdfLink: "https://beq.ebooksgratuits.com/vents/Dumas_Les_trois_mousquetaires_1.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/13951.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "fr_candide",
        title: "Candide, ou l'Optimisme",
        author: "Voltaire",
        language: "fr",
        languageName: "Français",
        genres: ["Classics", "Novels", "Fiction", "Philosophy", "Satire"],
        recommendedCEFR: "C1", // Philosophical satire, nuanced language
        coverImg: "https://bibliothequenumerique.tv5monde.com/media/img/org/ae/189_Candide.jpg",
        description: "Voltaire's sharp philosophical satire chronicling the tumultuous journey of Candide as he confronts a world of suffering, challenging Leibnizian optimism.",
        pdfLink: "https://www.vousnousils.fr/casden/pdf/id00265.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/4650.epub.images",
        aljohnsNotes: ""
    },

    // --- Indonesian Books ---
    {
        id: "id_bumi_manusia",
        title: "Bumi Manusia",
        author: "Pramoedya Ananta Toer",
        language: "id",
        languageName: "Bahasa Indonesia",
        genres: ["Novels", "Classics", "Fiction", "Historical Novel"],
        recommendedCEFR: ["B2", "C1"], // Significant literary work
        coverImg: "https://pbs.twimg.com/media/FacTS0HXgAAHN7n.jpg",
        description: "Pramoedya Ananta Toer's epic novel, part of the Buru Quartet, exploring love, colonialism, and the awakening of national consciousness in Dutch East Indies.",
        pdfLink: "https://mtsaluswahbergas.sch.id/wp-content/uploads/2024/11/Bumi-Manusia-by-Pramoedya-Ananta-Toer.pdf",
        epubLink: null,
        aljohnsNotes: "Captain's Note: While a treasure, this specific tome still sails under copyright. Seek it through proper channels!"
    },
    {
        id: "id_sitti_nurbaya",
        title: "Sitti Nurbaya: Kasih Tak Sampai",
        author: "Marah Roesli",
        language: "id",
        languageName: "Bahasa Indonesia",
        genres: ["Classics", "Novels", "Fiction", "Romance"],
        recommendedCEFR: ["B1", "B2"], // Classic Indonesian romance
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTykCWxDacahkhIXtH-GTuEaTm15MvFNr5Z6A&s",
        description: "A poignant classic of Indonesian literature by Marah Roesli, narrating the tragic love story of Sitti Nurbaya and Syamsul Bahri, constrained by tradition.",
        pdfLink: "http://pustaka.unp.ac.id/file/abstrak_kki/EBOOKS/Marah%20Rusli%20-%20Siti%20Nurbaya%20Kasih%20Tak%20Sampai.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },

    // --- Swedish Books ---
    {
        id: "sv_kanner_du_pippi",
        title: "Känner du Pippi Långstrump?",
        author: "Astrid Lindgren",
        language: "sv",
        languageName: "Svenska",
        genres: ["Children's Book", "Fiction", "Illustrated"],
        recommendedCEFR: ["A1", "A2"], // Beginner children's book
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS1Brem4Pw3II8DKjLmoScEhzm5-I_eKMapw&s",
        description: "An introduction to the world's strongest and most independent girl, Pippi Longstocking, and her delightful adventures in Villa Villekulla.",
        pdfLink: "https://sfi2c4.wordpress.com/wp-content/uploads/2021/09/svenska.pdf",
        epubLink: null,
        aljohnsNotes: "Captain's Note: A legendary lass, but her tales are still protected by copyright. Seek her adventures lawfully, matey!"
    },
    {
        id: "sv_nils_holgersson",
        title: "Nils Holgerssons underbara resa genom Sverige",
        author: "Selma Lagerlöf",
        language: "sv",
        languageName: "Svenska",
        genres: ["Children's Book", "Classics", "Fiction", "Adventure"],
        recommendedCEFR: ["B1"], // Classic, but longer narrative
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn-6HG9LI4oFsGmj4a79rUiMdnLUGfe3uaNg&s",
        description: "Selma Lagerlöf's Nobel Prize-winning tale of young Nils, transformed into an elf, who embarks on an extraordinary journey across Sweden on the back of a goose.",
        pdfLink: "https://www.lysator.liu.se/~nisse/misc/nils-holgersson.pdf",
        epubLink: "https://archive.org/download/nilsholgerssons00lybegoog/nilsholgerssons00lybegoog.epub",
        aljohnsNotes: ""
    },
    {
        id: "sv_svenska_folksagor",
        title: "Svenska Folksagor",
        author: "Varios (Samlade)",
        language: "sv",
        languageName: "Svenska",
        genres: ["Children's Book", "Classics", "Fiction", "Folklore"],
        recommendedCEFR: ["A2", "B1"], // Collection of traditional tales
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0V3A3snVWFV2Dx60wycd66wUXoXvsyt-7iA&s",
        description: "A captivating collection of traditional Swedish folktales, filled with trolls, princesses, brave heroes, and enchanting magical creatures from Nordic lore.",
        pdfLink: null,
        epubLink: "https://www.gutenberg.org/ebooks/57357.epub.images",
        aljohnsNotes: ""
    },

    // --- German Books ---
    {
        id: "de_mein_kampf",
        title: "Mein Kampf",
        author: "Adolf Hitler",
        language: "de",
        languageName: "Deutsch",
        genres: ["Non-Fiction", "History", "Politics"],
        recommendedCEFR: "C2", // Complex, dense, historically significant but requiring critical context
        coverImg: "https://cdn.britannica.com/16/187816-050-74B41B7B/Cover-edition-Adolf-Hitler-Mein-Kampf-1943.jpg",
        description: "Adolf Hitler's autobiographical manifesto outlining his political ideology and future plans for Germany. A historically significant work requiring extensive critical context.",
        pdfLink: "http://acdc2007.free.fr/meinkampf.pdf",
        epubLink: "https://www.bpb.de/system/files/datei/APuZ_2015-43-45_0.epub",
        aljohnsNotes: "Captain's Warning: This dark tome sails dangerous waters. Handle with extreme caution and critical historical awareness."
    },
    {
        id: "de_grimms_maerchen",
        title: "Grimms Märchen",
        author: "Jacob & Wilhelm Grimm",
        language: "de",
        languageName: "Deutsch",
        genres: ["Children's Book", "Classics", "Fiction", "Folklore"],
        recommendedCEFR: ["A2", "B1"], // Classic fairy tales
        coverImg: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1608460486i/56345887.jpg",
        description: "The renowned collection of German fairy tales by the Brothers Grimm, featuring timeless stories like 'Hansel and Gretel,' 'Cinderella,' and 'Snow White.'",
        pdfLink: "https://www.zebis.ch/sites/default/files/teaching_material/grimm-maerchen.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "de_max_und_moritz",
        title: "Max und Moritz",
        author: "Wilhelm Busch",
        language: "de",
        languageName: "Deutsch",
        genres: ["Children's Book", "Classics", "Illustrated", "Comics", "Humor"],
        recommendedCEFR: ["A2", "B1"], // Rhyming verse, illustrated
        coverImg: "https://liwi-verlag.de/wp-content/uploads/2019/06/35205879_9783965420892_xl.jpg",
        description: "Wilhelm Busch's humorous and cautionary illustrated tale in verse, detailing the seven notorious pranks of the mischievous boys Max and Moritz.",
        pdfLink: "https://www.gutenberg.org/files/17161/17161-pdf.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/17161.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "de_werther",
        title: "Die Leiden des jungen Werthers",
        author: "Johann Wolfgang von Goethe",
        language: "de",
        languageName: "Deutsch",
        genres: ["Classics", "Novels", "Fiction", "Romance"],
        recommendedCEFR: "C1", // Seminal work of Sturm und Drang, rich language
        coverImg: "https://m.media-amazon.com/images/I/71q6yNMj5rL._AC_UF1000,1000_QL80_.jpg",
        description: "Goethe's influential epistolary novel capturing the intense emotions and unrequited love of young Werther, a cornerstone of the Sturm und Drang movement.",
        pdfLink: "https://wolnelektury.pl/media/book/pdf/goethe-die-leiden-des-jungen-werther.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/2407.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "de_zarathustra",
        title: "Also sprach Zarathustra",
        author: "Friedrich Nietzsche",
        language: "de",
        languageName: "Deutsch",
        genres: ["Classics", "Philosophy", "Non-Fiction"],
        recommendedCEFR: "C2", // Dense philosophical work
        coverImg: "https://m.media-amazon.com/images/I/41sTks9qrkL._AC_UF1000,1000_QL80_.jpg",
        description: "Friedrich Nietzsche's profound philosophical novel presenting his concepts of the Übermensch, the death of God, and the will to power through the prophecies of Zarathustra.",
        pdfLink: "http://www.pileface.com/sollers/pdf/Zarathustra.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/7205.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "de_effi_briest",
        title: "Effi Briest",
        author: "Theodor Fontane",
        language: "de",
        languageName: "Deutsch",
        genres: ["Classics", "Novels", "Fiction", "Realism"],
        recommendedCEFR: "C1", // Important work of German realism
        coverImg: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1499908468i/442296.jpg",
        description: "Theodor Fontane's poignant realist novel chronicling the life and tragic societal fate of young Effi Briest within the rigid conventions of 19th-century Prussian society.",
        pdfLink: "http://www.digbib.org/Theodor_Fontane_1819/Effi_Briest_.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/5323.epub.images",
        aljohnsNotes: ""
    },

    // --- Italian Books ---
    {
        id: "it_inferno_dante",
        title: "Inferno (La Divina Commedia)",
        author: "Dante Alighieri",
        language: "it",
        languageName: "Italiano",
        genres: ["Classics", "Fiction", "Poetry"],
        recommendedCEFR: "C2", // Foundational, complex medieval Italian
        coverImg: "https://imgv2-1-f.scribdassets.com/img/document/306929844/149x198/8cf3098350/1606850423?v=1",
        description: "The first part of Dante's epic poem 'The Divine Comedy,' a profound allegorical journey through the nine circles of Hell.",
        pdfLink: "https://wyomingcatholic.edu/wp-content/uploads/dante-01-inferno.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "it_pinocchio",
        title: "Le avventure di Pinocchio",
        author: "Carlo Collodi",
        language: "it",
        languageName: "Italiano",
        genres: ["Children's Book", "Classics", "Fiction"],
        recommendedCEFR: ["A2", "B1"], // Classic children's story
        coverImg: "https://www.gutenberg.org/cache/epub/52484/pg52484.cover.medium.jpg",
        description: "The beloved tale of a wooden puppet's mischievous adventures as he yearns to become a real boy, facing trials and learning life lessons along the way.",
        pdfLink: "http://www.giuliotortello.it/racconti/Pinocchio.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/52484.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "it_promessi_sposi",
        title: "I Promessi Sposi",
        author: "Alessandro Manzoni",
        language: "it",
        languageName: "Italiano",
        genres: ["Classics", "Novels", "Fiction", "Historical Novel"],
        recommendedCEFR: "C1", // Major Italian historical novel
        coverImg: "https://upload.wikimedia.org/wikipedia/commons/c/cc/I_promessi_sposi-008.jpg",
        description: "Alessandro Manzoni's influential historical novel set in 17th-century Lombardy, recounting the trials of two young lovers, Renzo and Lucia, amidst plague and oppression.",
        pdfLink: "https://www.iispandinipiazza.edu.it/wp/wp-content/uploads/2016/09/manzoni_i_promessi_sposi.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "it_il_principe",
        title: "Il Principe",
        author: "Niccolò Machiavelli",
        language: "it",
        languageName: "Italiano",
        genres: ["Classics", "Non-Fiction", "Philosophy", "Politics"],
        recommendedCEFR: "C2", // Foundational political philosophy
        coverImg: "https://m.media-amazon.com/images/I/81zXqxTQ3EL._UF1000,1000_QL80_.jpg",
        description: "Niccolò Machiavelli's seminal 16th-century political treatise offering pragmatic, and often controversial, advice to rulers on acquiring and maintaining power.",
        pdfLink: "https://skypescuola.wordpress.com/wp-content/uploads/2015/05/machiavelli-il-principe.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },

    // --- Portuguese (Brazilian) Books ---
    {
        id: "pt_dom_casmurro",
        title: "Dom Casmurro",
        author: "Machado de Assis",
        language: "pt",
        languageName: "Português (Brasil)",
        genres: ["Classics", "Novels", "Fiction"],
        recommendedCEFR: ["B2", "C1"], // Literary classic, nuanced narrator
        coverImg: "https://suprija.suzano.com.br/on/demandware.static/-/Sites-at_catalog-marketplace/default/dw642aa4d7/products/00f38d89-ffff-af28-a172-6bd94f83d251/swatch-small-medium-large/a0YU600000990nnMAA-img1.jpg",
        description: "A landmark of Brazilian literature by Machado de Assis, narrated by the jealous Bento Santiago, who suspects his wife Capitu of an affair with his best friend.",
        pdfLink: "https://ddcus.org/pdf/summer_reading/11th_grade/Dom_Casmurro-Machado_de_Assis.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/55752.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "pt_memorias_postumas",
        title: "Memórias Póstumas de Brás Cubas",
        author: "Machado de Assis",
        language: "pt",
        languageName: "Português (Brasil)",
        genres: ["Classics", "Novels", "Fiction", "Satire"],
        recommendedCEFR: "C1", // Innovative, ironic, complex
        coverImg: "https://m.media-amazon.com/images/I/91GAAzBixYL._UF1000,1000_QL80_.jpg",
        description: "Machado de Assis's groundbreaking novel, narrated from beyond the grave by the deceased Brás Cubas, who reflects on his life with biting irony and wit.",
        pdfLink: "https://machado.mec.gov.br/obra-completa-lista/item/download/16_ff646a924421ea897f27cf6d21e6bb23",
        epubLink: "https://www.gutenberg.org/ebooks/54829.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "pt_iracema",
        title: "Iracema",
        author: "José de Alencar",
        language: "pt",
        languageName: "Português (Brasil)",
        genres: ["Classics", "Novels", "Fiction", "Romance"],
        recommendedCEFR: "B2", // Romantic, poetic prose
        coverImg: "https://m.media-amazon.com/images/I/81dQ4061MaL.jpg",
        description: "José de Alencar's iconic Indianist novel, a lyrical allegory of Brazil's formation, depicting the tragic romance between the indigenous Iracema and the Portuguese colonist Martim.",
        pdfLink: "http://www.culturatura.com.br/obras/iracema.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/67740.epub.images",
        aljohnsNotes: ""
    },
    {
        id: "pt_os_sertoes",
        title: "Os Sertões",
        author: "Euclides da Cunha",
        language: "pt",
        languageName: "Português (Brasil)",
        genres: ["Classics", "Non-Fiction", "History", "Sociology"],
        recommendedCEFR: "C2", // Dense, complex, journalistic and literary
        coverImg: "https://m.media-amazon.com/images/I/91gnEooIQpL._AC_UF1000,1000_QL80_.jpg",
        description: "Euclides da Cunha's monumental work, a powerful blend of journalism, sociology, and literature, chronicling the brutal Canudos War in the Brazilian backcountry.",
        pdfLink: "https://fundar.org.br/wp-content/uploads/2021/06/os-sertoes.pdf",
        epubLink: "https://archive.org/download/os-sertoes-campanha-de-canudos/Baixar%20-%20Brasiliana%20USP.epub",
        aljohnsNotes: ""
    },
    {
        id: "pt_o_cortico",
        title: "O Cortiço",
        author: "Aluísio Azevedo",
        language: "pt",
        languageName: "Português (Brasil)",
        genres: ["Classics", "Novels", "Fiction", "Naturalism"],
        recommendedCEFR: "B2", // Naturalist novel, descriptive
        coverImg: "https://m.media-amazon.com/images/I/61KSQiD6CsL._AC_UF1000,1000_QL80_.jpg",
        description: "Aluísio Azevedo's seminal naturalist novel vividly portraying life in a Rio de Janeiro tenement, exploring the social and economic forces shaping its diverse inhabitants.",
        pdfLink: "http://www.culturatura.com.br/obras/O%20Corti%C3%A7o.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },

    // --- Russian Books ---
    {
        id: "ru_skazki_pushkina",
        title: "Сказки Пушкина", // Pushkin's Fairy Tales
        author: "Александр Пушкин",
        language: "ru",
        languageName: "Русский",
        genres: ["Children's Book", "Classics", "Fiction", "Poetry", "Folklore"],
        recommendedCEFR: ["B1", "B2"], // Poetic, foundational Russian literature
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTse-Jrghxl0bPfYTCVH-BEutKkX2xZiwaFCQ&s",
        description: "A treasured collection of Alexander Pushkin's fairy tales in verse, including 'The Tale of Tsar Saltan' and 'The Golden Cockerel,' woven from rich Russian folklore.",
        pdfLink: "https://www.cls-tambov.ru/ru/bib_recommendations/pdf/%D0%A1%D0%BA%D0%B0%D0%B7%D0%BE%D1%87%D0%BD%D1%8B%D0%B9%20%D0%BC%D0%B8%D1%80%20%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD%D0%B0.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "ru_voina_i_mir",
        title: "Война и мир", // War and Peace
        author: "Лев Толстой",
        language: "ru",
        languageName: "Русский",
        genres: ["Classics", "Novels", "Fiction", "Historical Novel"],
        recommendedCEFR: "C2", // Epic scale, complex language and philosophy
        coverImg: "https://m.media-amazon.com/images/I/912F83swwRL._UF1000,1000_QL80_.jpg",
        description: "Leo Tolstoy's epic masterpiece chronicling Russian society during the Napoleonic era, interweaving the fates of aristocratic families with grand historical events.",
        pdfLink: "https://tolstoy.ru/upload/iblock/519/voina-i-mir.pdf",
        epubLink: "https://tolstoy.ru/upload/iblock/dac/voina-i-mir.epub",
        aljohnsNotes: ""
    },
    {
        id: "ru_prestuplenie_i_nakazanie",
        title: "Преступление и наказание", // Crime and Punishment
        author: "Фёдор Достоевский",
        language: "ru",
        languageName: "Русский",
        genres: ["Classics", "Novels", "Fiction", "Psychological Novel"],
        recommendedCEFR: "C1", // Deep psychological and philosophical themes
        coverImg: "https://rusneb.ru/local/tools/exalead/thumbnail.php?url=010000_000060_ART-8f382c81-78f9-4575-bf21-4cfcd2439626&width=360&height=460",
        description: "Fyodor Dostoevsky's profound psychological novel exploring the moral torment of Rodion Raskolnikov, an impoverished student who commits murder.",
        pdfLink: "https://rusneb.ru/local/tools/exalead/getFiles.php?book_id=010000_000060_ART-8f382c81-78f9-4575-bf21-4cfcd2439626&name=010000_000060_ART-8f382c81-78f9-4575-bf21-4cfcd2439626-%D0%9F%D1%80%D0%B5%D1%81%D1%82%D1%83%D0%BF%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%20%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B5&doc_type=pdf",
        epubLink: "https://rusneb.ru/local/tools/exalead/getFiles.php?book_id=010000_000060_ART-8f382c81-78f9-4575-bf21-4cfcd2439626&name=010000_000060_ART-8f382c81-78f9-4575-bf21-4cfcd2439626-%D0%9F%D1%80%D0%B5%D1%81%D1%82%D1%83%D0%BF%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%20%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B5&doc_type=epub",
        aljohnsNotes: ""
    },
    {
        id: "ru_mertvye_dushi",
        title: "Мёртвые души", // Dead Souls
        author: "Николай Гоголь",
        language: "ru",
        languageName: "Русский",
        genres: ["Classics", "Novels", "Fiction", "Satire"],
        recommendedCEFR: "C1", // Satirical, rich vocabulary
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC3cplufHEt9k2XdLe6_sGvHHUw012SRiUSA&s",
        description: "Nikolai Gogol's satirical masterpiece following the adventures of Chichikov, a schemer who buys 'dead souls' (deceased serfs) to perpetrate fraud.",
        pdfLink: "https://rusneb.ru/local/tools/exalead/getFiles.php?book_id=000207_000017_RU_RGDB_BIBL_0000354737&name=000207_000017_RU_RGDB_BIBL_0000354737-%D0%9C%D0%B5%D1%80%D1%82%D0%B2%D1%8B%D0%B5%20%D0%B4%D1%83%D1%88%D0%B8%20%D0%9F%D0%BE%D1%8D%D0%BC%D0%B0&doc_type=pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "ru_vishnevy_sad",
        title: "Вишнёвый сад", // The Cherry Orchard
        author: "Антон Чехов",
        language: "ru",
        languageName: "Русский",
        genres: ["Classics", "Theater", "Fiction", "Drama"],
        recommendedCEFR: "B2", // Classic play, conversational but nuanced
        coverImg: "https://www.mann-ivanov-ferber.ru/assets/images/covers/38/32138/1.50x-thumb.png",
        description: "Anton Chekhov's poignant play depicting the decline of the Russian aristocracy at the turn of the century, centered around the sale of a beloved cherry orchard.",
        pdfLink: "https://rusneb.ru/local/tools/exalead/getFiles.php?book_id=010000_000060_ART-33bfc45a-3b08-4ee0-94b8-1902bcfc6828&name=010000_000060_ART-33bfc45a-3b08-4ee0-94b8-1902bcfc6828-%D0%92%D0%B8%D1%88%D0%BD%D0%B5%D0%B2%D1%8B%D0%B9%20%D1%81%D0%B0%D0%B4&doc_type=pdf",
        epubLink: "https://rusneb.ru/local/tools/exalead/getFiles.php?book_id=010000_000060_ART-33bfc45a-3b08-4ee0-94b8-1902bcfc6828&name=010000_000060_ART-33bfc45a-3b08-4ee0-94b8-1902bcfc6828-%D0%92%D0%B8%D1%88%D0%BD%D0%B5%D0%B2%D1%8B%D0%B9%20%D1%81%D0%B0%D0%B4&doc_type=epub",
        aljohnsNotes: ""
    }
];

// --- Language, Genre, and CEFR data for filters ---
const availableLanguages_data = [
    { code: "es", name: "Español", characterId: "sofia" },
    { code: "fr", name: "Français", characterId: "emile" },
    { code: "it", name: "Italiano", characterId: "giorgio" },
    { code: "pt", name: "Português (Brasil)", characterId: "mateus" },
    { code: "de", name: "Deutsch", characterId: "liselotte" },
    { code: "ru", name: "Русский", characterId: "yelena" },
    { code: "sv", name: "Svenska", characterId: "astrid" },
    { code: "id", name: "Bahasa Indonesia", characterId: "rizki" }
];

const availableGenres_data = [
    "Adventure", "Children's Book", "Classics", "Comics", "Drama", "Fiction", 
    "Folklore", "Historical Novel", "History", "Humor", "Illustrated", 
    "Non-Fiction", "Novels", "Philosophy", "Poetry", "Politics", 
    "Psychological Novel", "Realism", "Romance", "Satire", "Sci-Fi", "Sociology", 
    "Theater" // Removed Grammar, Textbook unless you add such books
];
availableGenres_data.sort();

const availableCEFRLevels_data = ["A1", "A2", "B1", "B2", "C1", "C2"];

// --- Make them globally available ---
window.publicDomainBooks = publicDomainBooks_data;
window.availableLanguages = availableLanguages_data;
window.availableGenres = availableGenres_data;
window.availableCEFRLevels = availableCEFRLevels_data;