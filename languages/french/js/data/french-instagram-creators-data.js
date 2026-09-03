/*
 * Public Instagram accounts that Aljohn follows and that fit the existing
 * French shelves. The following export is used only as private evidence;
 * personal notes stay deliberately editable when no specific memory is
 * documented yet.
 */
(function extendFrenchInstagramLibrary() {
    const library = window.frenchCuratedChannelsData;
    if (!library || !Array.isArray(library.channels)) return;

    library.channels.push(
        {
            id: 'matt-pokora',
            name: 'M. Pokora',
            profilePlatform: 'instagram',
            imageAlt: 'Portrait de M. Pokora',
            profilePic: 'images/creators/matt-pokora.webp',
            shortDescription: 'Une présence pop et scénique suivie dans les clips, les refrains et les grandes performances françaises.',
            longDescription: 'M. Pokora circule entre pop, danse, spectacle et télévision. Les clips offrent un point d’entrée clair pour la diction et les refrains, tandis que les interviews et les scènes permettent d’entendre un français plus spontané autour du travail artistique.',
            aljohnComment: null,
            levels: ['A2', 'B1', 'B2'],
            categories: ['personnalites', 'musique'],
            sampleVideo: { id: 'qcA07gL7WEw', title: 'M. Pokora — Les planètes (clip officiel)' },
            links: { instagram: 'https://www.instagram.com/mattpokora/', youtube: 'https://www.youtube.com/user/mpofficial', spotify: 'https://open.spotify.com/artist/6euPnGzBlDysAC5ecVguNZ' },
        },
        {
            id: 'kendji',
            name: 'Kendji Girac',
            profilePlatform: 'instagram',
            imageAlt: 'Portrait de Kendji Girac',
            profilePic: 'images/creators/kendji.webp',
            shortDescription: 'Chanson française, guitare et héritage gitan : une voix suivie entre The Voice, clips et scènes.',
            longDescription: 'Kendji Girac apporte à l’écoute une articulation très musicale, des refrains mémorables et un parcours qui relie The Voice à la chanson populaire. Les chansons donnent un contexte immédiat avant de passer aux interviews et aux échanges plus rapides.',
            aljohnComment: null,
            levels: ['A2', 'B1', 'B2'],
            categories: ['personnalites', 'musique'],
            sampleVideo: { id: '4ySIi8EtEQg', title: 'Kendji Girac — Si seulement… (clip officiel)' },
            links: { instagram: 'https://www.instagram.com/kendji/', youtube: 'https://www.youtube.com/@KendjiGirac', spotify: 'https://open.spotify.com/artist/4IS4EyXNmiI2w5SRCjMtEF' },
        },
        {
            id: 'amel-bent',
            name: 'Amel Bent',
            profilePlatform: 'instagram',
            imageAlt: 'Portrait d’Amel Bent',
            profilePic: 'images/creators/amel-bent.webp',
            shortDescription: 'Une voix narrative entre chanson, télévision et textes où les émotions restent faciles à suivre.',
            longDescription: 'Les chansons d’Amel Bent mettent l’accent sur la phrase, l’adresse directe et la nuance émotionnelle. Ses passages télévisés ajoutent un français parlé différent du texte chanté, avec des réponses, des réactions et des récits personnels.',
            aljohnComment: null,
            levels: ['A2', 'B1', 'B2'],
            categories: ['personnalites', 'musique'],
            sampleVideo: { id: 'Uzuspeneepc', title: 'Amel Bent — Ton nom (clip officiel)' },
            links: { instagram: 'https://www.instagram.com/amelbent/', youtube: 'https://www.youtube.com/@amelbentvideo', spotify: 'https://open.spotify.com/artist/15jZ8OLtnGATWHlQkltG7f' },
        },
        {
            id: 'danse-avec-les-stars',
            name: 'Danse Avec Les Stars',
            profilePlatform: 'instagram',
            imageAlt: 'Logo de Danse Avec Les Stars',
            profilePic: 'images/creators/danse-avec-les-stars.webp',
            shortDescription: 'Danse, musique et réactions de plateau : le français d’un spectacle qui se regarde autant qu’il s’écoute.',
            longDescription: 'Le programme combine présentation, consignes, commentaires du jury et récits de participants. Les chorégraphies rendent la situation lisible, puis les échanges permettent de travailler le vocabulaire de l’effort, de la scène et de l’émotion.',
            aljohnComment: null,
            levels: ['A2', 'B1', 'B2'],
            categories: ['personnalites', 'culture'],
            sampleVideo: { id: 'Lg2CpczgiNw', title: 'La promesse de Billy Crawford dans Danse Avec Les Stars' },
            links: { instagram: 'https://www.instagram.com/dals_tf1/', youtube: 'https://www.youtube.com/@Danseaveclesstarstf1' },
        },
        {
            id: 'comedie-francaise',
            name: 'Comédie-Française',
            profilePlatform: 'instagram',
            imageAlt: 'Emblème de la Comédie-Française',
            profilePic: 'images/creators/comedie-francaise.webp',
            shortDescription: 'Théâtre, poésie et transmission : une institution pour entendre le français porté par le texte.',
            longDescription: 'La Comédie-Française réunit spectacles, émissions, lectures et ressources en ligne. Les extraits de théâtre et de poésie donnent accès à une diction travaillée, à des textes classiques et à des registres que les conversations quotidiennes ne montrent pas toujours.',
            aljohnComment: null,
            levels: ['B2', 'C1', 'C2'],
            categories: ['culture'],
            sampleVideo: { id: 'zyE5HW4zfWM', title: 'Le Tartuffe ou l’Hypocrite — bande-annonce' },
            links: {
                instagram: 'https://www.instagram.com/comedie.francaise.officiel/',
                youtube: 'https://www.youtube.com/@LaComedieFrancaise',
                website: 'https://www.comedie-francaise.fr/',
            },
        },
    );
}());
