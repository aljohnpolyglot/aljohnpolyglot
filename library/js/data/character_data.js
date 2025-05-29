// js/data/character_data.js

const libraryCharacters_data = {
    emile: {
        id: "emile",
        name: "Émile Rochefort",
        title: "Le Scribe Rebelle",
        imagePNG: "images/characters/French_Émile_Rochefort.png",
        bioShort: "This rogue Jesuit scholar, once of Marseille's royal archives, now smuggles forbidden philosophies, dealing in dangerous ideas and forgotten texts.",
        bioLong: "Once a luminary in the hushed, dust-filled halls of Marseille's royal archives, Émile’s mind was a finely tuned instrument, dissecting ancient texts with unparalleled precision. His Jesuit training sharpened his intellect, but it was his innate love for the mutable beauty of language that led him down a different path. He discovered that beneath the official narratives lay a trove of suppressed philosophies and radical inquiries, deliberately kept from public discourse. The realization that knowledge was being curated, even weaponized, by those in power ignited a quiet rebellion. Now, this elegant scholar, with his ever-present monocle glinting, uses his profound understanding of over two hundred synonyms for 'to understand' to navigate the treacherous waters of intellectual contraband, smuggling truths long deemed too dangerous for the light of day.",
        languageCode: "fr",
        dialogues: [
            "La vérité, comme un vin rare, ne se livre qu'à ceux qui la cherchent avec patience.",
            "Combien de mondes sont cachés dans les pages que l'autorité craint de voir ouvertes?",
            "L'ignorance est une cage dorée; la connaissance, une clé parfois lourde à porter.",
            "Ils appellent cela 'interdit'. Je l'appelle 'essentiel'. Une simple question de perspective.",
            "Chaque idée sauvée des flammes est une étoile qui refuse de s'éteindre dans leur nuit."
        ]
    },
    liselotte: {
        id: "liselotte",
        name: "Liselotte Kepler",
        title: "Die Chronistin der Schatten",
        imagePNG: "images/characters/German_Liselotte_Kepler.png",
        bioShort: "A stern Prussian cartographer turned renegade historian, she hunts down suppressed chronicles, believing every hidden truth must be charted.",
        bioLong: "With the stern discipline of her Prussian upbringing and the keen eye of a naval cartographer, Liselotte once charted coastlines and currents. Her obsession shifted from the contours of land to the etymology of words when she unearthed evidence of deliberate linguistic manipulation in historical records. She realized that to control a word's history was to control thought itself. Now, this formidable woman, her uniform as sharp as her intellect, captains her own vessel, rumored to house the largest floating index of German compound words ever assembled. She tracks the lineage of every term with the tenacity of a bounty hunter, believing that the unvarnished truth of language is a treasure more potent than any gold, and a contraband worth risking everything for.",
        languageCode: "de",
        dialogues: [
            "Ordnung ist nicht die Abwesenheit von Chaos, sondern das Verstehen seiner Muster.",
            "Sie versuchen, die Vergangenheit umzuschreiben. Aber die Tinte der Wahrheit ist unauslöschlich.",
            "Jedes Wort hat eine Geschichte, und jede Geschichte birgt eine Macht, die sie fürchten.",
            "Manchmal ist der klarste Weg durch die Dunkelheit, nicht drumherum.",
            "Diese Aufzeichnungen sind keine Relikte, sondern Wegweiser für jene, die noch kommen."
        ]
    },
    rizki: {
        id: "rizki",
        name: "Rizki Sutanto",
        title: "Pelindung Jiwa Leluhur",
        imagePNG: "images/characters/Indonesian_Rizki_Sutanto.png", // Corrected filename based on your list
        bioShort: "Guardian of vanishing cultures from the Indonesian archipelago, he sails with scrolls of fading traditions, a lifeline for forgotten peoples.",
        bioLong: "His sun-weathered skin speaks of countless journeys under the equatorial sun, but Rizki's true voyages are through the archipelagos of human expression. A former language teacher whose gentle demeanor belies a fierce protective instinct, he witnessed firsthand the colonial edicts that sought to silence the myriad dialects of his homeland, replacing them with a homogenized tongue. To Rizki, this was not mere policy, but the attempted erasure of entire worlds. He now dedicates his life to safeguarding these endangered tongues, his handwoven sash filled not with weapons, but with bamboo scrolls bearing the vocabularies and stories of vanishing identities. He sees each word as a seed, each book a lifeboat, convinced that within them lies the resilience of a people.",
        languageCode: "id",
        dialogues: [
            "Dalam setiap cerita lama, berdenyut jantung sebuah bangsa yang menolak dilupakan.",
            "Mereka bisa membakar buku, tapi tidak bisa memadamkan ingatan yang hidup di hati.",
            "Identitas itu seperti akar pohon bakau, terjalin erat, memberi kehidupan di tepian.",
            "Suara yang hilang bukanlah keheningan, melainkan bisikan yang menunggu untuk didengar kembali.",
            "Setiap gulungan ini adalah perahu kecil, membawa harapan melintasi lautan kelupaan."
        ]
    },
    giorgio: {
        id: "giorgio",
        name: "Giorgio Caravelli",
        title: "L'Architetto della Conoscenza Proibita",
        imagePNG: "images/characters/Italian_Giorgio_Caravelli.png",
        bioShort: "Ex-Vatican librarian with a scent of ink and rebellion, he fled Rome with stolen maps that charted more than just land—they charted power.",
        bioLong: "From the hallowed, incense-perfumed silence of Vatican City's most secret archives, Giorgio Caravelli once curated knowledge for the privileged few. His dapper appearance and cologne that perpetually smells of old ink and new parchment speak of a life steeped in ancient texts. But his discovery of ancient language maps – charts that revealed not just linguistic evolution but the deep, shared roots of disparate cultures – proved too revolutionary for the institution he served. Choosing enlightenment over obedience, he shared these 'spells of communication' with those who dreamed of a more connected world. Now, a fugitive with a wry smile, he sails under forged names, smuggling grammar codices and syntax charts across troubled waters, a sophisticated rogue ensuring the blueprints of understanding are never again locked away.",
        languageCode: "it",
        dialogues: [
            "La bellezza di una struttura non risiede solo nella forma, ma nella libertà che può svelare.",
            "Hanno sigillato questi saperi, temendo che il mondo potesse cambiare. Avevano ragione.",
            "Ogni mappa che salvo è una crepa nel muro dell'ignoranza imposta.",
            "Il profumo dell'inchiostro antico? È l'odore della rivoluzione silenziosa.",
            "La vera eresia non è mettere in discussione, ma accettare ciecamente."
        ]
    },
    mateus: {
        id: "mateus",
        name: "Mateus Cabral",
        title: "O Místico dos Tomos Perdidos",
        imagePNG: "images/characters/Portuguese_Mateus_Cabral.png",
        bioShort: "An ex-monk whose mystical senses guide him to lost and hidden books, this Portuguese sea mystic rescues forgotten lore from the shadows.",
        bioLong: "They say Brother Mateus, cloistered away in a remote Portuguese monastery, once recited the entirety of Os Lusíadas backwards during a profound mystical trance. He awoke not just changed, but gifted—or perhaps cursed—with 'bibliosmia,' the ability to find lost or hidden books purely by their unique scent. The monastic order, unnerved by such unconventional talents, saw him depart. Now a sea mystic, his monk's cloak weathered by salt and sun, Mateus navigates by ancient proverbs and the fragrant whispers of vellum and ink. He seeks out those tomes whose voices have been muted by time or malice, believing every book has a soul that yearns to be read, and his purpose is to guide them back to willing hands.",
        languageCode: "pt",
        dialogues: [
            "Há mais sabedoria no murmúrio do vento entre as páginas do que em mil sermões.",
            "O que está perdido para os olhos pode ser encontrado pelo coração, se este souber escutar.",
            "Cada livro tem a sua alma, e algumas almas sussurram mais alto na escuridão.",
            "Não confio no que é impresso com facilidade; a verdade muitas vezes se esconde no raro.",
            "O destino, como um rio antigo, encontra sempre o seu caminho para o mar do conhecimento."
        ]
    },
    yelena: {
        id: "yelena",
        name: "Yelena Vetrova",
        title: "Шепот Сопротивления",
        imagePNG: "images/characters/Russian_Yelena_Vetrova.png",
        bioShort: "From Soviet codebreaker to literary smuggler, she champions banned masterpieces with deadpan irony, each rescued book a spark of defiance.",
        bioLong: "Forged in the icy discipline of Soviet codebreaking, Yelena’s mind was a fortress of logic. Yet, within the encrypted communiques of supposed enemies, she found glimpses of a shared humanity that state doctrine denied. The turning point came with a directive to purge 'ideologically unsound' literature – classics that held the very soul of her culture. Something within her fractured. Now, this enigmatic figure, her face often wreathed in the steam of black tea or the smoke from a quiet cigarette, uses her covert skills to smuggle these same banned masterpieces. Her deadpan irony is a shield, her fur-lined cloak a meager defense against the cold, but her belief that language itself is the ultimate act of resistance burns with a fierce, unyielding flame.",
        languageCode: "ru",
        dialogues: [
            "Они строят стены из лжи, но правда, как вода, всегда найдет трещину.",
            "Ирония в том, что чем сильнее они давят, тем ярче горит искра бунта.",
            "Каждая спасенная книга — это не просто слова, это вызов их молчанию.",
            "Свобода мысли — вот единственное оружие, которое они действительно боятся.",
            "Даже в самой темной ночи, одна свеча разума может осветить путь."
        ]
    },
    sofia: {
        id: "sofia",
        name: "Sofía Del Río",
        title: "La Llama de la Imaginación",
        imagePNG: "images/characters/Spanish_Sofía_Del_Río.png",
        bioShort: "Daughter of a pirate queen and a revolutionary playwright, she unleashes the power of banned verses at sea, a fiery muse defying an empire's silence.",
        bioLong: "With the fire of her pirate queen mother and the linguistic artistry of her famous playwright father coursing through her veins, Sofía was born a rebel. She navigates the seas not by conventional maps, but by the metaphors and riddles found in the forbidden poetry she recites aloud to the wind and waves. Hunted by the Inquisition for distributing banned plays that ignite the spirit of dissent across Latin America, she sees herself as a custodian of dangerous beauty. Her dramatic cloak billows like a storm cloud, her golden earrings shaped like quotation marks flash defiance, as she champions the cause of words deemed too powerful, too true, for an empire built on silence.",
        languageCode: "es",
        dialogues: [
            "Donde la tiranía siembra silencio, el arte debe gritar con mil voces.",
            "Dicen que soñar es de locos. Yo digo que es el primer acto de rebelión.",
            "Estas historias son más peligrosas que cualquier espada, pues luchan en el alma.",
            "Que me persigan. Significa que la luz de estas palabras aún les ciega.",
            "La vida es un poema demasiado corto para vivirlo en prosa y con miedo."
        ]
    },
    astrid: {
        id: "astrid",
        name: "Astrid Björnsdotter",
        title: "Väktaren av Uråldriga Ekon",
        imagePNG: "images/characters/Swedish_Astrid_Björnsdotter.png",
        bioShort: "A formidable scholar of the frozen north, she hunts ancient sagas and runestones, seeking the cryptic secrets locked within the oldest stones.",
        bioLong: "From the stark, unforgiving beauty of the Nordic lands, Astrid emerged, her spirit as resilient as the ancient runestones she reveres. A formidable scholar of Old Norse and runology, she believes these cryptic carvings and epic sagas hold more than just history; they are fragments of a 'proto-language,' the mother of all tongues. While academics debated in comfortable halls, Astrid took to the icy fjords, driven by a fierce urgency to rescue these linguistic treasures from oblivion and the casual destruction of modernity. Her braided hair, practical attire, and the weathered runestone fragment she carries are symbols of her direct, pragmatic devotion to preserving the raw, unvarnished power of the most ancient words.",
        languageCode: "sv",
        dialogues: [
            "Stenarna minns det som människor glömmer. Deras tystnad är full av svar.",
            "I de äldsta sagorna finns en råhet, en sanning som nutiden inte vågar möta.",
            "De söker framsteg genom att radera det förflutna. Vilken dårskap.",
            "Isen bevarar inte bara kroppar, utan även visdomen från tidernas gryning.",
            "Vissa sanningar är som norrskenet: flyktiga, vackra och evigt uråldriga."
        ]
    }
};

window.libraryCharacters = libraryCharacters_data;