const INDONESIAN_BOOK_ORDER = ["id_bumi_manusia", "id_sitti_nurbaya"];

const localizedBookCopy = {
    id_bumi_manusia: {
        category: "Roman sejarah",
        shortDescription: "Awal Tetralogi Buru: Minke, cinta, pendidikan, dan kesadaran kebangsaan di Hindia Belanda.",
        longDescription: "Bumi Manusia membuka Tetralogi Buru melalui kehidupan Minke, seorang pemuda priyayi yang bersekolah di HBS. Kisah cinta, ketidakadilan kolonial, pendidikan, dan pertumbuhan kesadaran kebangsaan bergerak bersama dalam sebuah novel yang menuntut perhatian pada bahasa sekaligus sejarah.",
        guidance: "Baca per bab dan simpan daftar singkat tokoh serta hubungan mereka. Pada tingkat B2, utamakan alur dan konflik; pada C1, perhatikan perubahan register, istilah kolonial, serta cara Minke memandang identitas dan kekuasaan.",
        sourceLabel: "Edisi Lentera Dipantara",
        sourceAction: "Lihat edisi resmi"
    },
    id_sitti_nurbaya: {
        category: "Roman klasik",
        shortDescription: "Cinta Sitti Nurbaya dan Samsulbahri berhadapan dengan utang, adat, tekanan keluarga, dan kuasa sosial.",
        longDescription: "Sitti Nurbaya: Kasih Tak Sampai mengikuti cinta Sitti Nurbaya dan Samsulbahri yang terhalang oleh persoalan keluarga, adat, utang, serta tekanan sosial. Novel ini menjadi pintu masuk penting ke sastra Indonesia awal dan memperlihatkan benturan antara keinginan generasi muda dengan tradisi yang membatasi.",
        guidance: "Mulailah dengan membaca untuk mengikuti hubungan antartokoh. Kosakata dan susunan kalimat yang lebih lama mungkin terasa asing; tandai kata yang berulang, lalu bandingkan dengan penggunaan Bahasa Indonesia masa kini setelah satu bab selesai.",
        sourceLabel: "Edisi Balai Pustaka",
        sourceAction: "Lihat pratinjau buku"
    }
};

const canonicalIndonesianBooks = Array.isArray(window.publicDomainBooks)
    ? window.publicDomainBooks.filter((book) => book.language === "id")
    : [];

export const indonesianBooks = INDONESIAN_BOOK_ORDER
    .map((id) => canonicalIndonesianBooks.find((book) => book.id === id))
    .filter(Boolean)
    .map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        levels: Array.isArray(book.recommendedCEFR)
            ? book.recommendedCEFR
            : [book.recommendedCEFR].filter(Boolean),
        coverImage: book.coverImg,
        coverWidth: book.coverWidth,
        coverHeight: book.coverHeight,
        coverAlt: `Sampul ${book.title} karya ${book.author}`,
        officialLink: book.officialLink,
        ...localizedBookCopy[book.id]
    }));
