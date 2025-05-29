// js/data/book_data.js
// No 'use strict' here as this file primarily defines data.

const publicDomainBooks_data = [ // Renamed to avoid conflict
    // Spanish Books
    {
        id: "es_cuentos_que_cuidan",
        title: "Cuentos que cuidan",
        author: "UNICEF (Varios Autores)",
        language: "es", // Spanish
        languageName: "Español",
        genres: ["Children's Book", "Illustrated", "Fiction"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScBJbepHtNxc3XzC5HLhlVVz8Ypv1FLFIv_Q&s",
        description: "La colección “Cuentos que cuidan”, con textos escritos e ilustrados por artistas de reconocida trayectoria, aborda el derecho a la educación, la inclusión, la equidad, la salud y la protección de manera accesible y apropiada a través de historias y personajes pensados y diseñados para niñas y niños en su primera infancia...",
        pdfLink: "https://www.unicef.org/chile/media/5111/file/Cuentos%20que%20cuidan%20.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "es_cuentos_ilustrados_alicante",
        title: "Recopilación de Cuentos Ilustrados",
        author: "Varios Autores (Programa Alicante Cultura)",
        language: "es",
        languageName: "Español",
        genres: ["Children's Book", "Illustrated", "Fiction"],
        coverImg: "https://online.pubhtml5.com/tvma/njco/files/large/1.jpg?1634903875",
        description: "RECOPILACIÓN DE CUENTOS ILUSTRADOS REALIZADOS EN LOS CURSOS “ESCRITURA CREATIVA” “ILUSTRACIÓN DE ALBUMES INFANTILES” PROGRAMA ALICANTE CULTURA Edición 2010 - 2011...",
        pdfLink: "https://www.miguelturra.es/sites/default/files/generico_archivos/cuento_cuentos_ilustrados.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "es_don_quijote",
        title: "Don Quijote de la Mancha",
        author: "Miguel de Cervantes",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Novels", "Fiction"],
        coverImg: "https://www.elejandria.com/covers/Don_Quijote_de_la_Mancha-Cervantes_Miguel-lg.png",
        description: "El ingenioso hidalgo Don Quijote de la Mancha narra las aventuras de Alonso Quijano, un hidalgo pobre que de tanto leer novelas de caballería acaba enloqueciendo y creyendo ser un caballero andante, nombrándose a sí mismo como Don Quijote de la Mancha.",
        pdfLink: "https://www.suneo.mx/literatura/subidas/Miguel%20de%20Cervantes%20El%20Ingenioso%20Hidalgo%20Don%20Quijote%20de%20la%20Mancha.pdf",
        epubLink: "https://www.elejandria.com/libro/don-quijote-de-la-mancha/cervantes-miguel/77", // Note: Elejandria links to a page, not direct epub
        aljohnsNotes: ""
    },
    {
        id: "es_platero_y_yo",
        title: "Platero y yo",
        author: "Juan Ramón Jiménez",
        language: "es",
        languageName: "Español",
        genres: ["Classics", "Fiction", "Illustrated"], // Often illustrated
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTo8AA_xLcsZDVVj6eSeG1DoFGjePRiG4j4w&s",
        description: "Una narración lírica que recrea poéticamente la vida y muerte del burrito Platero. Es un texto elegiaco que el poeta dedica a la memoria del burro con el que compartió su infancia y juventud.",
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
        coverImg: "https://www.elejandria.com/covers/Fuente_Ovejuna-Lope_de_Vega-lg.png",
        description: "Drama teatral que narra la sublevación del pueblo de Fuenteovejuna contra el Comendador Fernán Gómez de Guzmán, debido a sus abusos de poder y tiranía.",
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
        genres: ["Classics", "Theater", "Fiction"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTO_LMQ640vkGYORKE1H9t4J1a6HAHkpxVBIQ&s",
        description: "Obra de teatro que reflexiona sobre la libertad, el destino y la condición humana a través de la historia del príncipe Segismundo, encerrado desde su nacimiento.",
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
        genres: ["Classics", "Novels", "Fiction"],
        coverImg: "https://m.media-amazon.com/images/I/81IJ4FVDuYL._AC_UF1000,1000_QL80_.jpg",
        description: "Una novela crítica sobre la sociedad filipina bajo el dominio español, exponiendo la corrupción y los abusos del clero y el gobierno colonial.",
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
        genres: ["Classics", "Novels", "Fiction"],
        coverImg: "https://m.media-amazon.com/images/I/711HLGoYJQL._AC_UF1000,1000_QL80_DpWeblab_.jpg",
        description: "Secuela de Noli Me Tángere, esta novela continúa la crítica social y política, explorando temas de revolución y reforma en Filipinas.",
        pdfLink: null,
        epubLink: "https://www.gutenberg.org/ebooks/30903.epub.images",
        aljohnsNotes: ""
    },

    // French Books
    {
        id: "fr_le_petit_prince",
        title: "Le Petit Prince",
        author: "Antoine de Saint-Exupéry",
        language: "fr",
        languageName: "Français",
        genres: ["Children's Book", "Classics", "Fiction", "Illustrated"],
        coverImg: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1367545443i/157993.jpg",
        description: "Un pilote échoué dans le désert rencontre un jeune prince venu d'une autre planète. Une fable poétique et philosophique sur l'amitié, l'amour, la perte et le sens de la vie.",
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
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE8alGAKM4nFeamsdmQk1J6QVUgEWK40vVlA&s", // Added a placeholder path, you should replace this
        description: "Trois lapins malpolis se moquent du vieux Grand-père Lampe jusqu'à ce qu'ils tombent dans un ruisseau glacé et aient besoin de son aide.",
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
        genres: ["Comics", "Fiction", "Illustrated"],
        coverImg: "https://imgv2-1-f.scribdassets.com/img/document/710257348/298x396/98c3e5cc69/1709490711?v=1",
        description: "La première aventure d'Astérix et Obélix, où ils défendent leur village gaulois contre les Romains grâce à la potion magique du druide Panoramix.",
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
        genres: ["Comics", "Fiction", "Illustrated"],
        coverImg: "https://imgv2-1-f.scribdassets.com/img/document/390672337/original/d79e6976b2/1?v=1",
        description: "Les Romains tentent de corrompre le village gaulois en introduisant le capitalisme et la production de menhirs en masse.",
        pdfLink: "https://archive.org/download/23AsterixObelixEtCompagnie/23-asterix-obelix-et-compagnie.pdf",
        epubLink: "https://archive.org/download/23AsterixObelixEtCompagnie/23-asterix-obelix-et-compagnie.epub",
        aljohnsNotes: ""
    },
    {
        id: "fr_asterix_serpe_or",
        title: "La Serpe d'or",
        author: "Goscinny & Uderzo",
        language: "fr",
        languageName: "Français",
        genres: ["Comics", "Fiction", "Illustrated"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUZApPdJ4zcyCvWmnHMOe0UICBzrnYLPcpcw&s",
        description: "Astérix et Obélix partent à la recherche d'une serpe d'or pour le druide Panoramix, affrontant des bandits et des trafiquants.",
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
        genres: ["Classics", "Children's Book", "Fiction"],
        coverImg: "https://www.gutenberg.org/cache/epub/56327/pg56327.cover.medium.jpg",
        description: "Une collection célèbre de fables en vers mettant en scène des animaux pour illustrer des morales et des leçons de vie.",
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
        genres: ["Children's Book", "Classics", "Fiction"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSl95lEn-wb99DdzqkCV2VtzFcJ10HGuBPYmA&s",
        description: "Le conte classique d'une jeune fille qui rencontre un loup en allant rendre visite à sa grand-mère.",
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
        genres: ["Classics", "Novels", "Fiction"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDHFJRPWr_it3BbVzeIuQIjGmIuydXK19SOA&s",
        description: "Un professeur et son neveu entreprennent une expédition audacieuse vers le centre de la Terre, découvrant un monde souterrain préhistorique.",
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
        genres: ["Classics", "Novels", "Fiction"],
        coverImg: "https://www.gutenberg.org/cache/epub/13951/pg13951.cover.medium.jpg",
        description: "Les aventures du jeune d'Artagnan et de ses amis mousquetaires Athos, Porthos et Aramis dans la France du XVIIe siècle.",
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
        genres: ["Classics", "Novels", "Fiction", "Philosophy"], // Satire/Philosophy
        coverImg: "https://bibliothequenumerique.tv5monde.com/media/img/org/ae/189_Candide.jpg",
        description: "Une satire philosophique qui suit les mésaventures de Candide alors qu'il est confronté aux dures réalités du monde, remettant en question l'optimisme.",
        pdfLink: "https://www.vousnousils.fr/casden/pdf/id00265.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/4650.epub.images",
        aljohnsNotes: ""
    },


    // Indonesian Books
    {
        id: "id_bumi_manusia",
        title: "Bumi Manusia",
        author: "Pramoedya Ananta Toer",
        language: "id",
        languageName: "Bahasa Indonesia",
        genres: ["Novels", "Classics", "Fiction"],
        coverImg: "https://pbs.twimg.com/media/FacTS0HXgAAHN7n.jpg",
        description: "Kisah Minke, seorang pribumi Jawa di era kolonial Belanda, yang berjuang untuk cinta, pendidikan, dan martabat di tengah rasisme dan ketidakadilan.",
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
        genres: ["Classics", "Novels", "Fiction"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTykCWxDacahkhIXtH-GTuEaTm15MvFNr5Z6A&s",
        description: "Sebuah novel klasik Indonesia yang mengisahkan cinta tragis antara Sitti Nurbaya dan Syamsul Bahri, terhalang oleh adat dan paksaan.",
        pdfLink: "http://pustaka.unp.ac.id/file/abstrak_kki/EBOOKS/Marah%20Rusli%20-%20Siti%20Nurbaya%20Kasih%20Tak%20Sampai.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },

    // Swedish Books
    {
        id: "sv_kanner_du_pippi",
        title: "Känner du Pippi Långstrump?",
        author: "Astrid Lindgren",
        language: "sv",
        languageName: "Svenska",
        genres: ["Children's Book", "Fiction", "Illustrated"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS1Brem4Pw3II8DKjLmoScEhzm5-I_eKMapw&s",
        description: "Introduktion till Pippi Långstrump, världens starkaste och mest oberoende flicka, och hennes äventyr i Villa Villekulla.",
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
        genres: ["Children's Book", "Classics", "Fiction"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRn-6HG9LI4oFsGmj4a79rUiMdnLUGfe3uaNg&s",
        description: "Pojken Nils förvandlas till en pyssling och reser på ryggen av en gås genom Sverige, lär sig om landets geografi och kultur.",
        pdfLink: "https://www.lysator.liu.se/~nisse/misc/nils-holgersson.pdf",
        epubLink: "https://archive.org/download/nilsholgerssons00lybegoog/nilsholgerssons00lybegoog.epub",
        aljohnsNotes: ""
    },
    {
        id: "sv_svenska_folksagor",
        title: "Svenska Folksagor",
        author: "Varios (Samlade)", // "Various (Collected)"
        language: "sv",
        languageName: "Svenska",
        genres: ["Children's Book", "Classics", "Fiction"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR0V3A3snVWFV2Dx60wycd66wUXoXvsyt-7iA&s",
        description: "En samling traditionella svenska folksagor fyllda med troll, prinsessor, och magiska varelser.",
        pdfLink: null,
        epubLink: "https://www.gutenberg.org/ebooks/57357.epub.images",
        aljohnsNotes: ""
    },


    // German Books
    {
        id: "de_mein_kampf",
        title: "Mein Kampf",
        author: "Adolf Hitler",
        language: "de",
        languageName: "Deutsch",
        genres: ["Non-Fiction", "History", "Politics"], // More accurate genres
        coverImg: "https://cdn.britannica.com/16/187816-050-74B41B7B/Cover-edition-Adolf-Hitler-Mein-Kampf-1943.jpg",
        description: "Adolf Hitlers politisches Manifest und Autobiographie, in der er seine Ideologie und Pläne für die Zukunft Deutschlands darlegt. Erfordert kritische historische Kontextualisierung.",
        pdfLink: "http://acdc2007.free.fr/meinkampf.pdf",
        epubLink: "https://www.bpb.de/system/files/datei/APuZ_2015-43-45_0.epub", // This is an EPUB related to "Mein Kampf" from bpb.de, likely an analysis or edition.
        aljohnsNotes: "Captain's Warning: This dark tome sails dangerous waters. Handle with extreme caution and critical historical awareness."
    },
    {
        id: "de_grimms_maerchen",
        title: "Grimms Märchen",
        author: "Jacob & Wilhelm Grimm",
        language: "de",
        languageName: "Deutsch",
        genres: ["Children's Book", "Classics", "Fiction", "Folklore"],
        coverImg: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1608460486i/56345887.jpg",
        description: "Eine berühmte Sammlung deutscher Volksmärchen der Brüder Grimm, darunter 'Hänsel und Gretel', 'Aschenputtel' und 'Schneewittchen'.", // German description
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
        genres: ["Children's Book", "Classics", "Illustrated", "Comics"],
        coverImg: "https://liwi-verlag.de/wp-content/uploads/2019/06/35205879_9783965420892_xl.jpg",
        description: "Eine illustrierte Geschichte in Versen über die unartigen Jungen Max und Moritz und ihre sieben bösen Streiche.", // German description
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
        coverImg: "https://m.media-amazon.com/images/I/71q6yNMj5rL._AC_UF1000,1000_QL80_.jpg",
        description: "Ein Briefroman, der die unglückliche Liebe und die intensiven Gefühle des jungen Werther schildert; ein zentrales Werk der Sturm-und-Drang-Bewegung.", // German description
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
        coverImg: "https://m.media-amazon.com/images/I/41sTks9qrkL._AC_UF1000,1000_QL80_.jpg",
        description: "Ein philosophisches Werk, das Nietzsches Ideen vom Übermenschen, dem Tod Gottes und dem Willen zur Macht durch die Reden des Propheten Zarathustra vorstellt.", // German description
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
        coverImg: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1499908468i/442296.jpg",
        description: "Ein realistischer Roman, der die Ehe und den gesellschaftlichen Fall der jungen Effi Briest innerhalb der strengen Konventionen der preußischen Gesellschaft darstellt.", // German description
        pdfLink: "http://www.digbib.org/Theodor_Fontane_1819/Effi_Briest_.pdf",
        epubLink: "https://www.gutenberg.org/ebooks/5323.epub.images",
        aljohnsNotes: ""
    },

    // Italian Books
    {
        id: "it_inferno_dante",
        title: "Inferno (La Divina Commedia)",
        author: "Dante Alighieri",
        language: "it",
        languageName: "Italiano",
        genres: ["Classics", "Fiction", "Poetry"], // Epic Poem
        coverImg: "https://imgv2-1-f.scribdassets.com/img/document/306929844/149x198/8cf3098350/1606850423?v=1",
        description: "La prima cantica della Divina Commedia di Dante, che narra il suo viaggio attraverso i nove cerchi dell'Inferno.", // Italian description
        pdfLink: "https://wyomingcatholic.edu/wp-content/uploads/dante-01-inferno.pdf", // This is English translation; ideally find Italian PDF
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
        coverImg: "https://www.gutenberg.org/cache/epub/52484/pg52484.cover.medium.jpg",
        description: "La storia di un burattino di legno che sogna di diventare un bambino vero, e le sue numerose avventure e disavventure.", // Italian description
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
        coverImg: "https://upload.wikimedia.org/wikipedia/commons/c/cc/I_promessi_sposi-008.jpg",
        description: "Un influente romanzo storico italiano ambientato nel XVII secolo, che segue la storia d'amore tra Renzo e Lucia.", // Italian description
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
        coverImg: "https://m.media-amazon.com/images/I/81zXqxTQ3EL._UF1000,1000_QL80_.jpg", // Added a placeholder path
        description: "Un trattato politico del XVI secolo che offre consigli ai governanti su come acquisire e mantenere il potere politico.", // Italian description
        pdfLink: "https://skypescuola.wordpress.com/wp-content/uploads/2015/05/machiavelli-il-principe.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },


    // Portuguese (Brazilian) Books
    {
        id: "pt_dom_casmurro",
        title: "Dom Casmurro",
        author: "Machado de Assis",
        language: "pt",
        languageName: "Português (Brasil)",
        genres: ["Classics", "Novels", "Fiction"],
        coverImg: "https://suprija.suzano.com.br/on/demandware.static/-/Sites-at_catalog-marketplace/default/dw642aa4d7/products/00f38d89-ffff-af28-a172-6bd94f83d251/swatch-small-medium-large/a0YU600000990nnMAA-img1.jpg",
        description: "Um clássico brasileiro narrado pelo ciumento Bento Santiago, que suspeita da infidelidade de sua esposa Capitu.", // Portuguese description
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
        genres: ["Classics", "Novels", "Fiction"],
        coverImg: "https://m.media-amazon.com/images/I/91GAAzBixYL._UF1000,1000_QL80_.jpg",
        description: "Um romance inovador narrado do túmulo pelo falecido Brás Cubas, que reflete sobre sua vida com ironia e sagacidade.", // Portuguese description
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
        coverImg: "https://m.media-amazon.com/images/I/81dQ4061MaL.jpg",
        description: "Um romance romântico que retrata o amor entre o colonizador português Martim e a indígena Iracema, uma alegoria da formação do Brasil.", // Portuguese description
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
        coverImg: "https://m.media-amazon.com/images/I/91gnEooIQpL._AC_UF1000,1000_QL80_.jpg",
        description: "Uma obra monumental que retrata a Guerra de Canudos no sertão brasileiro, combinando história, sociologia e literatura.", // Portuguese description
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
        coverImg: "https://m.media-amazon.com/images/I/61KSQiD6CsL._AC_UF1000,1000_QL80_.jpg",
        description: "Um romance naturalista que retrata a vida em um cortiço no Rio de Janeiro e as forças sociais e econômicas que moldam seus habitantes.", // Portuguese description
        pdfLink: "http://www.culturatura.com.br/obras/O%20Corti%C3%A7o.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },

    // Russian Books
    {
        id: "ru_skazki_pushkina",
        title: "Сказки Пушкина",
        author: "Александр Пушкин",
        language: "ru",
        languageName: "Русский",
        genres: ["Children's Book", "Classics", "Fiction", "Poetry", "Folklore"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTse-Jrghxl0bPfYTCVH-BEutKkX2xZiwaFCQ&s",
        description: "Сборник знаменитых сказок Александра Пушкина, таких как 'Сказка о царе Салтане' и 'Золотой петушок'.",
        pdfLink: "https://www.cls-tambov.ru/ru/bib_recommendations/pdf/%D0%A1%D0%BA%D0%B0%D0%B7%D0%BE%D1%87%D0%BD%D1%8B%D0%B9%20%D0%BC%D0%B8%D1%80%20%D0%9F%D1%83%D1%88%D0%BA%D0%B8%D0%BD%D0%B0.pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "ru_voina_i_mir",
        title: "Война и мир",
        author: "Лев Толстой",
        language: "ru",
        languageName: "Русский",
        genres: ["Classics", "Novels", "Fiction", "Historical Novel"],
        coverImg: "https://m.media-amazon.com/images/I/912F83swwRL._UF1000,1000_QL80_.jpg",
        description: "Эпический роман, описывающий русское общество во время наполеоновских войн и судьбы нескольких аристократических семей.",
        pdfLink: "https://tolstoy.ru/upload/iblock/519/voina-i-mir.pdf",
        epubLink: "https://tolstoy.ru/upload/iblock/dac/voina-i-mir.epub",
        aljohnsNotes: ""
    },
    {
        id: "ru_prestuplenie_i_nakazanie",
        title: "Преступление и наказание",
        author: "Фёдор Достоевский",
        language: "ru",
        languageName: "Русский",
        genres: ["Classics", "Novels", "Fiction", "Psychological Novel"],
        coverImg: "https://rusneb.ru/local/tools/exalead/thumbnail.php?url=010000_000060_ART-8f382c81-78f9-4575-bf21-4cfcd2439626&width=360&height=460",
        description: "Психологический роман о бедном студенте Раскольникове, который совершает убийство, и его последующих моральных терзаниях.",
        pdfLink: "https://rusneb.ru/local/tools/exalead/getFiles.php?book_id=010000_000060_ART-8f382c81-78f9-4575-bf21-4cfcd2439626&name=010000_000060_ART-8f382c81-78f9-4575-bf21-4cfcd2439626-%D0%9F%D1%80%D0%B5%D1%81%D1%82%D1%83%D0%BF%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%20%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B5&doc_type=pdf",
        epubLink: "https://rusneb.ru/local/tools/exalead/getFiles.php?book_id=010000_000060_ART-8f382c81-78f9-4575-bf21-4cfcd2439626&name=010000_000060_ART-8f382c81-78f9-4575-bf21-4cfcd2439626-%D0%9F%D1%80%D0%B5%D1%81%D1%82%D1%83%D0%BF%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B8%20%D0%BD%D0%B0%D0%BA%D0%B0%D0%B7%D0%B0%D0%BD%D0%B8%D0%B5&doc_type=epub",
        aljohnsNotes: ""
    },
    {
        id: "ru_mertvye_dushi",
        title: "Мёртвые души",
        author: "Николай Гоголь",
        language: "ru",
        languageName: "Русский",
        genres: ["Classics", "Novels", "Fiction", "Satire"],
        coverImg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTC3cplufHEt9k2XdLe6_sGvHHUw012SRiUSA&s",
        description: "Сатирический роман о Чичикове, который скупает 'мертвые души' (крепостных, умерших после последней переписи) для мошеннических схем.",
        pdfLink: "https://rusneb.ru/local/tools/exalead/getFiles.php?book_id=000207_000017_RU_RGDB_BIBL_0000354737&name=000207_000017_RU_RGDB_BIBL_0000354737-%D0%9C%D0%B5%D1%80%D1%82%D0%B2%D1%8B%D0%B5%20%D0%B4%D1%83%D1%88%D0%B8%20%D0%9F%D0%BE%D1%8D%D0%BC%D0%B0&doc_type=pdf",
        epubLink: null,
        aljohnsNotes: ""
    },
    {
        id: "ru_vishnevy_sad",
        title: "Вишнёвый сад",
        author: "Антон Чехов",
        language: "ru",
        languageName: "Русский",
        genres: ["Classics", "Theater", "Fiction", "Drama"],
        coverImg: "https://www.mann-ivanov-ferber.ru/assets/images/covers/38/32138/1.50x-thumb.png",
        description: "Пьеса, изображающая упадок русской аристократии на рубеже веков через историю продажи вишневого сада.",
        pdfLink: "https://rusneb.ru/local/tools/exalead/getFiles.php?book_id=010000_000060_ART-33bfc45a-3b08-4ee0-94b8-1902bcfc6828&name=010000_000060_ART-33bfc45a-3b08-4ee0-94b8-1902bcfc6828-%D0%92%D0%B8%D1%88%D0%BD%D0%B5%D0%B2%D1%8B%D0%B9%20%D1%81%D0%B0%D0%B4&doc_type=pdf",
        epubLink: "https://rusneb.ru/local/tools/exalead/getFiles.php?book_id=010000_000060_ART-33bfc45a-3b08-4ee0-94b8-1902bcfc6828&name=010000_000060_ART-33bfc45a-3b08-4ee0-94b8-1902bcfc6828-%D0%92%D0%B8%D1%88%D0%BD%D0%B5%D0%B2%D1%8B%D0%B9%20%D1%81%D0%B0%D0%B4&doc_type=epub",
        aljohnsNotes: ""
    }
];

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
    "Children's Book", "Classics", "Comics", "Drama", "Fiction", "Folklore",
    "Grammar", "Historical Novel", "History", "Illustrated", "Non-Fiction",
    "Novels", "Philosophy", "Poetry", "Politics", "Psychological Novel",
    "Realism", "Romance", "Satire", "Sociology", "Textbook", "Theater"
];
availableGenres_data.sort(); // Keep sorted for display

// --- NEW: Static list of CEFR levels for the filter dropdown order ---
const availableCEFRLevels_data = ["A1", "A2", "B1", "B2", "C1", "C2"];


// --- Make them globally available ---
window.publicDomainBooks = publicDomainBooks_data;
window.availableLanguages = availableLanguages_data;
window.availableGenres = availableGenres_data;
window.availableCEFRLevels = availableCEFRLevels_data; // Make CEFR levels globally available