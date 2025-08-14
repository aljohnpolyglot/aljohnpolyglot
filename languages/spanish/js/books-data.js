

// D:\website\languages\spanish\js\books-data.js

const booksData = [
    {
        id: 'don-quijote-de-la-mancha',
        title: 'Don Quijote de la Mancha',
        author: 'Miguel de Cervantes Saavedra',
        coverImage: 'https://imgv2-1-f.scribdassets.com/img/word_document/315233472/original/216x287/36867d8558/1752371410?v=1', // Placeholder
        shortDesc: 'La obra cumbre de la literatura española. Una aventura épica y cómica.',
        longDesc: 'Considerada la primera novela moderna, narra las aventuras de un hidalgo que enloquece leyendo libros de caballerías y decide convertirse en caballero andante. Es una obra fundamental para entender la cultura y el idioma español, aunque su lenguaje del Siglo de Oro es un desafío gratificante.',
        cefr: ['C1', 'C2'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1e2tynkDTYQz8Mfhx4SLr64suS4E3hzP2&usp=drive_copy'
        }
    },
    {
        id: 'cien-anos-de-soledad',
        title: 'Cien años de soledad',
        author: 'Gabriel García Márquez',
        coverImage: 'https://m.media-amazon.com/images/I/91TvVQS7loL._UF1000,1000_QL80_.jpg', // Placeholder
        shortDesc: 'La saga de la familia Buendía y el realismo mágico en su máxima expresión.',
        longDesc: 'Esta novela narra la historia de siete generaciones de la familia Buendía en el pueblo ficticio de Macondo. Es una obra maestra del realismo mágico, llena de eventos fantásticos, soledad, amor y destino. Un pilar de la literatura latinoamericana.',
        cefr: ['B2', 'C1'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=12VrymDsNdsqZp34ONE36gM48kaXvjFBo&usp=drive_copy',
            pdf: 'https://drive.google.com/open?id=1FUO_6q4PQGDK443GjkwkUlOcguNs087K&usp=drive_copy'
        }
    },
    {
        id: 'el-amor-en-los-tiempos-del-colera',
        title: 'El amor en los tiempos del cólera',
        author: 'Gabriel García Márquez',
        coverImage: 'https://m.media-amazon.com/images/I/71mKpV0iLdL._UF1000,1000_QL80_.jpg', // Placeholder
        shortDesc: 'Una historia de amor eterno que espera más de medio siglo para realizarse.',
        longDesc: 'Florentino Ariza y Fermina Daza se enamoran en su juventud, pero ella lo rechaza. Él le jura amor eterno y espera 51 años, 9 meses y 4 días para estar con ella. Es una hermosa meditación sobre el amor, la vejez y el paso del tiempo.',
        cefr: ['B2', 'C1'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1aisDiB6Fy2_Iipvtb_YS4pq48MHyALaD&usp=drive_copy'
        }
    },
    {
        id: 'del-amor-y-otros-demonios',
        title: 'Del amor y otros demonios',
        author: 'Gabriel García Márquez',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1284242962i/9283798.jpg', // Placeholder
        shortDesc: 'Un amor prohibido entre una niña supuestamente poseída y un sacerdote en la Colombia colonial.',
        longDesc: 'Basada en una leyenda, la novela cuenta la historia de Sierva María de Todos los Ángeles, una joven marquesa que es mordida por un perro con rabia. Enviada a un convento, un sacerdote encargado de su exorcismo termina enamorándose de ella. Una historia trágica y poética.',
        cefr: ['B2', 'C1'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1r8gBlwP-mBufzOuGQpMygINBiNo31N88&usp=drive_copy'
        }
    },
    {
        id: 'la-sombra-del-viento',
        title: 'La Sombra del Viento',
        author: 'Carlos Ruiz Zafón',
        coverImage: 'https://m.media-amazon.com/images/I/81CEi-3PbBL._UF1000,1000_QL80_.jpg', // Placeholder
        shortDesc: 'Un misterio literario en la Barcelona de posguerra centrado en un libro maldito.',
        longDesc: 'Daniel Sempere descubre "La Sombra del Viento", un libro de un autor misterioso llamado Julián Carax. Su obsesión por encontrar otras obras del autor lo sumerge en una trama de secretos, amor y tragedia en una Barcelona gótica y fascinante.',
        cefr: ['B1', 'B2'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1jGL_h5LeRonWa3KQJ23dSgshWugnqNLr&usp=drive_copy',
            pdf: 'https://drive.google.com/open?id=1OeUcTp9BOl9nstjwcqJz_aRFM8ran8PL&usp=drive_copy'
        }
    },
    {
        id: 'la-casa-de-los-espiritus',
        title: 'La casa de los espíritus',
        author: 'Isabel Allende',
        coverImage: 'https://m.media-amazon.com/images/I/816xOSfb2XL._UF1000,1000_QL80_.jpg', // Placeholder
        shortDesc: 'La saga de la familia Trueba en Chile, mezclando lo personal y lo político.',
        longDesc: 'La primera novela de Isabel Allende narra la vida de la familia Trueba a lo largo de varias generaciones, con la historia política de Chile como telón de fondo. Es una obra poderosa de realismo mágico, amor, y revolución.',
        cefr: ['B2', 'C1'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1O53-ipkEFIqdDd6Y5v1CnJrPVMGrbQ1d&usp=drive_copy',
            pdf: 'https://drive.google.com/open?id=1K7hr7ciCXy9TyU84BtaYNOPLyF8CzEux&usp=drive_copy'
        }
    },
    {
        id: 'como-agua-para-chocolate',
        title: 'Como agua para chocolate',
        author: 'Laura Esquivel',
        coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2Z9ojggK7owtCSjWK1h7ngQEhTZNidE2twg&s', // Placeholder
        shortDesc: 'Una novela donde la cocina y las emociones se entrelazan mágicamente.',
        longDesc: 'La historia de Tita, quien no puede casarse con el amor de su vida y expresa sus emociones a través de la cocina. Cada platillo que prepara tiene efectos mágicos en quienes lo comen. Una obra icónica del realismo mágico mexicano, ideal para aprender vocabulario culinario.',
        cefr: ['B1', 'B2'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1BMQaOEG2cIGtBMwB_albDe4XdDt0i9_X&usp=drive_copy',
            pdf: 'https://drive.google.com/open?id=1Meca72Sz2bhImWtd0SJkJU5HiS1g83tF&usp=drive_copy'
        }
    },
    {
        id: 'confieso-que-he-vivido',
        title: 'Confieso Que He Vivido',
        author: 'Pablo Neruda',
        coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUrVpq6v5e9OYNr3Dwxi4pm738Flip-6c3Ow&s', // Placeholder
        shortDesc: 'Las memorias del poeta chileno Pablo Neruda, Premio Nobel de Literatura.',
        longDesc: 'Un recorrido autobiográfico por la vida de una de las figuras más importantes de la poesía del siglo XX. Neruda narra sus viajes, sus amores, su activismo político y el proceso creativo detrás de su obra. Un libro denso pero profundamente enriquecedor.',
        cefr: ['C1', 'C2'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1LzSWpX3Df0yX4wiTzwVcaPndnueRkOsO&usp=drive_copy',
            pdf: 'https://drive.google.com/open?id=1Q_4ImgCgkQvhzzMJGxFGn1zjFk0C-LEk&usp=drive_copy'
        }
    },
    {
        id: 'cinco-esquinas',
        title: 'Cinco esquinas',
        author: 'Mario Vargas Llosa',
        coverImage: 'https://m.media-amazon.com/images/I/81UhbS5gMrL._UF1000,1000_QL80_.jpg', // Placeholder
        shortDesc: 'Un thriller ambientado en el Perú de Fujimori que explora el poder del periodismo amarillo.',
        longDesc: 'La novela se desarrolla durante los últimos meses de la dictadura de Fujimori. A través de una trama que involucra chantaje, erotismo y política, Vargas Llosa reflexiona sobre cómo el periodismo sensacionalista puede ser utilizado como un arma política.',
        cefr: ['C1'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1SUfBXBnXQIr-G80V9lg3Zsoe0_SKpJzp&usp=drive_copy',
            pdf: 'https://drive.google.com/open?id=19SkTyqkeJjLP9pBtQ5qzV1qJ7_OMp8AC&usp=drive_copy'
        }
    },
    {
        id: 'travesuras-de-la-nina-mala',
        title: 'Travesuras de la niña mala',
        author: 'Mario Vargas Llosa',
        coverImage: 'https://m.media-amazon.com/images/I/81XLlbh7cXL.jpg', // Placeholder
        shortDesc: 'Una historia de amor obsesivo que se extiende por cuatro décadas y tres continentes.',
        longDesc: 'Ricardo Somocurcio se enamora perdidamente de una enigmática mujer que aparece y desaparece de su vida bajo diferentes identidades. La novela es un retrato de los cambios sociales y políticos de la segunda mitad del siglo XX a través de esta tumultuosa relación.',
        cefr: ['B2', 'C1'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1XlCQxyWVDoMti3702L7YvZyVfa7Z27Da&usp=drive_copy',
            pdf: 'https://drive.google.com/open?id=1joVgWsKxn6DizBiU3YUDiGACzlAL7RJS&usp=drive_copy'
        }
    },
    {
        id: 'niebla',
        title: 'Niebla',
        author: 'Miguel de Unamuno',
        coverImage: 'https://m.media-amazon.com/images/I/710G+uFD-YL._UF1000,1000_QL80_.jpg', // Placeholder
        shortDesc: 'Una novela filosófica que rompe la cuarta pared y cuestiona la existencia.',
        longDesc: 'Augusto Pérez, el protagonista, sufre una crisis existencial y decide enfrentarse a su propio autor, Miguel de Unamuno. "Niebla" es una obra fundamental de la Generación del 98 que acuñó el término "nivola" para describirse a sí misma, un género donde la ficción y la realidad se fusionan.',
        cefr: ['C1', 'C2'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1qsiG5KvWHDjqQI0DnkxMz7nI_v9uvKwn&usp=drive_copy'
        }
    },
    {
        id: 'la-tia-tula',
        title: 'La tía Tula',
        author: 'Miguel de Unamuno',
        coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW10yF-yJVZ3gS5pSrPEIg3N2KsLKRiz0WLQ&s', // Placeholder
        shortDesc: 'Un profundo retrato de la maternidad frustrada y el sacrificio en la España de principios del siglo XX.',
        longDesc: 'Tula dedica su vida a cuidar de los hijos de su hermana fallecida, renunciando a su propia vida amorosa y a la maternidad biológica. La novela es un análisis psicológico intenso sobre la vocación, la represión y el papel de la mujer en la sociedad tradicional.',
        cefr: ['C1'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1EMofCoYVo99pbjgPSGx1--Y1xF0ET5vE&usp=drive_copy'
        }
    },
    {
        id: 'del-sentimiento-tragico-de-la-vida',
        title: 'Del sentimiento trágico de la vida',
        author: 'Miguel de Unamuno',
        coverImage: 'https://m.media-amazon.com/images/I/81tI6+WJ2pL._UF1000,1000_QL80_.jpg', // Placeholder
        shortDesc: 'Un ensayo filosófico sobre la lucha entre la razón y la fe, y el anhelo de inmortalidad.',
        longDesc: 'No es una novela, sino una de las obras filosóficas más importantes de Unamuno. Explora la angustia existencial del ser humano, atrapado entre el conocimiento racional de su mortalidad y el deseo irracional de no morir nunca. Lectura muy avanzada y profunda.',
        cefr: ['C2'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1cJHGiO4EelQ32666eMv0uMJaF1vo6tZQ&usp=drive_copy'
        }
    },
    {
        id: 'amor-y-pedagogia',
        title: 'Amor y Pedagogía',
        author: 'Miguel de Unamuno',
        coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1m9GZDnOEWXM3b1mR9zfAnYp5gv0rXfreAw&s', // Placeholder
        shortDesc: 'Una sátira sobre la pretensión de crear un genio a través de una educación puramente científica.',
        longDesc: 'Don Avito Carrascal intenta aplicar una "pedagogía sociológica" para criar a su hijo y convertirlo en un genio, eliminando cualquier rastro de espontaneidad o emoción. La obra es una crítica feroz al positivismo y al racionalismo extremo, defendiendo la importancia del "amor" y lo irracional.',
        cefr: ['C1', 'C2'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1-WTwghZZ9_5q7I53km5GWFWcw3FYBYBz&usp=drive_copy'
        }
    },
    {
        id: 'tres-novelas-ejemplares',
        title: 'Tres novelas ejemplares y un prólogo',
        author: 'Miguel de Unamuno',
        coverImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTN5k4SED4Bku6iP3ZWWzIQ53y2PRsc3cQMGA&s', // Placeholder
        shortDesc: 'Tres novelas cortas donde Unamuno explora la voluntad y la pasión de sus personajes.',
        longDesc: 'Este volumen incluye tres "novelas ejemplares" donde los protagonistas, a menudo mujeres fuertes, luchan por imponer su voluntad contra las convenciones sociales. El prólogo es famoso por ser una profunda reflexión de Unamuno sobre su propia obra y la creación literaria.',
        cefr: ['C1'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=13UAJVW5iRPe3BnIsHKzqdT5rVkwZ308V&usp=drive_copy'
        }
    },
    {
        id: 'una-historia-de-pasion',
        title: 'Una Historia de Pasión',
        author: 'Abel Sánchez',
        coverImage: 'https://m.media-amazon.com/images/I/71YlLtepVRL._UF894,1000_QL80_.jpg', // Placeholder
        shortDesc: 'Un título genérico que podría referirse a varias obras de temática romántica.',
        longDesc: 'El título "Una Historia de Pasión" es bastante común en la literatura romántica. Sin un autor específico, es difícil identificar la obra exacta. Generalmente, este tipo de novelas se centran en relaciones intensas y emocionales, a menudo con obstáculos y dramas.',
        cefr: ['B1'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1Rni9xxVFHU5u97SYSjbQaoH8ndZt3HZM&usp=drive_copy'
        }
    },
    {
        id: 'resena-veridica-revolucion-filipina',
        title: 'Reseña Verídica de la Revolución Filipina',
        author: 'Emilio Aguinaldo',
        coverImage: 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1481198070i/33242220.jpg', // Placeholder
        shortDesc: 'La perspectiva de Emilio Aguinaldo sobre la Revolución Filipina, escrita originalmente en español.',
        longDesc: 'Este documento histórico es el relato en primera persona de Emilio Aguinaldo sobre los eventos que llevaron a la declaración de independencia de Filipinas. Escrito en español, es una fuente primaria invaluable para entender este período crucial de la historia filipina desde la perspectiva de uno de sus líderes.',
        cefr: ['C1'],
        gdriveLinks: {
            epub: 'https://drive.google.com/open?id=1-WTwghZZ9_5q7I53km5GWFWcw3FYBYBz&usp=drive_copy'
        }
    }
];