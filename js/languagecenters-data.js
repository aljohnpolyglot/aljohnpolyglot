// js/languagecenters-data.js

const culturalInstitutesData = [
    {
        id: "cervantes-manila",
        name: "Instituto Cervantes de Manila",
        languageKey: "spanish",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSMBAgg_X1quHa29B84HDuyK0nMeDI1gVyVQ&s",
        flag: "https://flagcdn.com/w40/es.png",
        brandPalette: {
           cardBackground: "#cc0000", // Red background
            cardText: "#ffffff",       // White text
            buttonAccent: "#ffffff",   // Spanish Yellow for buttons (example, adjust if needed)
            buttonText: "#cc0000",     // Red text on yellow buttons
            socialIconHoverColor: "#FFC400" // Explicitly Spanish Yellow for social hover
        },
        previewDescription: "Official Spanish cultural center offering courses, DELE exams, and vibrant cultural events.",
        description: "The official Spanish government institution responsible for promoting Spanish language and culture. Offers a wide range of courses, official DELE exams, and a rich calendar of cultural events including film festivals and literary gatherings.",
        myExperience: "I'm a regular at their library and cultural events, especially 'Día del Libro' and film screenings. Their Makati center is a fantastic hub for Spanish learners. We've also collaborated on a video showcasing their offerings!",
        website: "https://manila.cervantes.es/en/default.shtm",
        facebook: "https://www.facebook.com/InstitutoCervantesManila/",
        instagram: "https://www.instagram.com/institutocervantesmanila/?hl=en",
        contact: "(+63) 9455670745, cenmni@cervantes.es",
        addresses: [
            "Makati: The Enterprise Center Tower 1, Units 1-3A, Level 11, 6766 Ayala Avenue, corner Paseo de Roxas, Makati, 1226 Metro Manila",
            "Intramuros (Library & Cultural): Calle Real, Plaza San Luis Complex, Intramuros, Manila 1002"
        ],
        keyOfferings: ["Spanish Language Courses (A1-C2)", "DELE & SIELE Exam Center", "Teacher Training", "Cultural Events", "Library Services"],
        featuredVideo: "https://www.youtube.com/embed/g0zSWDoM4Ms",
        photoGallery: [
            "images/languagecenters/cervantes_dia_del_libro_2024_with_Eric_Martinez.JPEG",
            "images/languagecenters/cervantes_aljohn_sabado_boardgames.jpg",
            "images/languagecenters/cervantes_aljohn_sabado_boardgames2.jpg",
            "images/languagecenters/cervantes_aljohn_sabado_boardgames3.jpg",
            "images/languagecenters/cervantes_aljohn_sabado_boardgames4.jpg",
            "images/languagecenters/cervantes_pelicula_spanishfilmfest_2024_fullpic_pressscreening.jpg",
            "images/languagecenters/cervantes_pelicula_spanishfilmfest_2024_fullpic_pressscreening_mainevent.JPEG",
            "images/languagecenters/cervantes_pelicula_spanishfilmfest_2024_selfie_pressscreening.jpg"
        ],
        photoCaptions: [
            "With Eric Martinez at Día del Libro 2024", "Sabado Board Games session", "More fun at board games!", "Learning and playing", "Always a good time at Cervantes",
            "Press screening for the Spanish Film Festival 2024", "At the main event of the Spanish Film Festival", "Selfie during the film fest press screening"
        ],
        communityPost: {
            link: "https://www.facebook.com/share/p/169c1NZkvQ/",
            text: "Algunas imágenes de nuestra sesión de juegos de la biblioteca del sábado 18 de enero. ¡Gracias a los que habéis asistido!"
        },
        mapEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.711999914345!2d121.02237067588487!3d14.558532777746745!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c918ffffffff%3A0xb18069596b50a7ed!2sInstituto%20Cervantes%20de%20Manila!5e0!3m2!1sen!2sph!4v1716000000000!5m2!1sen!2sph" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
        id: "af-manille",
        name: "Alliance Française de Manille",
        languageKey: "french",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgffLTBXq3GTbhW7MXoYhgWB7qmpE5QLJ-Nw&s",
        flag: "https://flagcdn.com/w40/fr.png",
        brandPalette: {
         cardBackground: "#ffffff", 
            cardText: "#003366",       
            buttonAccent: "#003366",   // Dark French Blue buttons
            buttonText: "#ffffff",
            socialIconHoverColor: "#EF4135" // French Red for social hover
        },
        previewDescription: "Historic French cultural center in Makati. Courses, exams, and a rich library.",
        description: "A historic institution offering French courses (DELF/DALF, TEF/TEFAQ), cultural events, and a fantastic library. Perfect for a deep dive into French language and culture!",
        myExperience: "I practically live in their library on weekends! It's an amazing spot for immersion and a peaceful study environment. We also filmed a great video feature showcasing the Alliance and its vibrant community.",
        website: "https://www.alliance.ph/accueil-en/",
        facebook: "https://www.facebook.com/alliancefrancaisedemanille/",
        instagram: "https://www.instagram.com/afmanille/?hl=en",
        contact: "(+63) 939 902 4688, info@alliance.ph",
        addresses: ["209 Nicanor Garcia Street, Bel-Air II, Makati City 1209"],
        keyOfferings: ["French Language Courses", "DELF/DALF & TEF/TEFAQ Exams", "Cultural Events", "Library & Media Center"],
        featuredVideo: "https://www.youtube.com/embed/TupMAAUIgoE",
        photoGallery: [
            "images/languagecenters/Alliance_Manille_SaturdayVisit_2025_Collage.png",
            "images/languagecenters/alliance_manille_library_reading.JPG",
            "images/languagecenters/alliance_manille_cinema_selfie.JPG"
        ],
        photoCaptions: [
            "A collage from a Saturday visit in 2025!", "Immersed in reading at their Médiathèque.", "Quick selfie before a film screening."
        ],
        communityPost: null,
        mapEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.4080188610973!2d121.01969687588513!3d14.57573927761384!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c90c9c703023%3A0x98b7cb5559518075!2sAlliance%20Fran%C3%A7aise%20de%20Manille!5e0!3m2!1sen!2sph!4v1716000000001!5m2!1sen!2sph" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
        id: "af-cebu",
        name: "Alliance Française de Cebu",
        languageKey: "french",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzAZUQNBYMNHdGVh1qoG3Srfgj-64eb8NV-g&s",
        flag: "https://flagcdn.com/w40/fr.png",
        brandPalette: { // Same as AF Manille or can be slightly different
           cardBackground: "#ffffff",
            cardText: "#003366",
            buttonAccent: "#003366",
            buttonText: "#ffffff",
            socialIconHoverColor: "#EF4135" // French Red for social hover
        },
        previewDescription: "Your French connection in the Visayas! Language classes, exams, and cultural happenings.",
        description: "Bringing French language and culture to the Visayas with classes, certifications, and engaging cultural events. It collaborates with local universities to promote francophone culture.",
        myExperience: "A fantastic resource in Cebu! We had a great time filming there and interviewing French speakers. They were very welcoming and even featured our collaboration on their page!",
        website: "https://alliancefr.ph/",
        facebook: "https://www.facebook.com/AFcebu/",
        instagram: "https://www.instagram.com/afcebu/?hl=en",
        contact: "(+63) 915 433 8785, school@alliancefr.ph",
        addresses: ["371 Gorordo Avenue, Lahug, Cebu City 6000"],
        keyOfferings: ["French Language Classes", "DELF/DALF Certifications", "Cultural Events", "Art Workshops"],
        featuredVideo: "https://www.youtube.com/embed/dRswor7uF_Y",
        photoGallery: [
            "images/languagecenters/alliance_cebu_aljohn_with_cebu_filipinofrench_speakers_group.jpg",
            "images/languagecenters/alliance_cebu_aljohn_with_cebu_filipinofrench_speakers_bts.jpg",
            "images/languagecenters/alliance_cebu_aljohn_with_cebu_filipinofrench_speakers_bts_2.jpg"
        ],
        photoCaptions: [
            "Group photo with French speakers in Cebu!", "Behind the scenes of our video shoot.", "More fun moments during filming."
        ],
        communityPost: {
            link: "https://www.facebook.com/share/p/1AfBzQ7xLA/",
            text: "Alliance Française is pleased to be featured in Sir Aljohn’s youtube video about French speakers in Cebu! ... Watch out for our video feature soon!"
        },
        mapEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3925.2477681057756!2d123.9058800758186!3d10.322999065449516!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a999c2bffffff%3A0x829a11a2a38325de!2sAlliance%20Fran%C3%A7aise%20de%20Cebu!5e0!3m2!1sen!2sph!4v1716000000003!5m2!1sen!2sph" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
       id: "pia",
        name: "Philippine Italian Association",
        languageKey: "italian",
        // partnerId: "dante-manila", // No longer needed if they are listed separately
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxDSSc1WSb7Kvf4pYjuyIUOU8vfwmMqPHixg&s",
        flag: "https://flagcdn.com/w40/it.png",
        brandPalette: {
          cardBackground: "#ffffff",
          cardText: "#006400",
          buttonAccent: "#006400", // Dark Green buttons
          buttonText: "#ffffff",
          socialIconHoverColor: "#CE2B37" // Italian Red
        },
        previewDescription: "Historic association promoting Italian culture, now also managing Società Dante Alighieri Manila. Focuses on major cultural events & community (Patronato) services.",
        description: "Established in 1962, the Philippine Italian Association (PIA) has a long history of promoting Italian culture through diverse events like film festivals (e.g., Cine Europa), cooking classes, and art exhibitions. PIA also provides vital Patronato services to the Italian community and Filipino OFWs regarding pensions. Since December 2024, PIA and Società Dante Alighieri Manila operate under a unified administration, though as distinct entities. PIA continues its focus on large-scale cultural programming and Patronato services, while language courses and translation are now primarily handled by Dante Manila.",
        myExperience: "My internship at PIA was incredibly enriching! I was involved in cultural events, gave a presentation for Dantedì, and gained insight into their diverse operations, especially on Social Media and Content Creation.",
        partnershipDescription: "Operates in close partnership with Società Dante Alighieri Manila under a unified administration.", // For modal if needed
        website: "https://www.philippineitalianassociation.org/",
        facebook: "https://www.facebook.com/philippineitalianassociation/",
        instagram: "https://www.instagram.com/philitalian/",
        contact: "+63(2) 5310 4974,philippineitalianassociation@gmail.com",
        addresses: ["2/F Zeta Building, 191 Salcedo Street, Legaspi Village, Makati City 1229"],
        keyOfferings: [
            "Major Cultural Events (Cine Europa, Art, Food Collaborations)",
            "Patronato Services (Pensions, Italian Community Support)",
            "Collaboration with Embassies & EU",
            "University Partnerships",
            "Administrative Oversight of Società Dante Alighieri Manila"
        ],
        featuredVideo: null,
        videoPlaceholderText: "Our video feature highlighting PIA & Dante Manila's work is coming soon!",
        photoGallery: [
            "images/languagecenters/pia_aljohn_dantedi_group_pic_upstudents.jpg",
            "images/languagecenters/pia_aljohn_dantedi_giving_lecture.jpg",
            "images/languagecenters/pia_aljohn_dantedi_giving_lecture_2.jpg",
            "images/languagecenters/pia_aljohn_dantedi_giving_lecture_3.jpg",
            "images/languagecenters/pia_aljohn_dantedi_ust_seminar_bypia_.jpg",
            "images/languagecenters/pia_aljohn_restaurantfeature_caruso_video_project.PNG"
        ],
        photoCaptions: [
            "Group photo after the Dantedì event with UP students.", "Giving a lecture during my internship at PIA for Dantedì.", "Presenting on Dante Alighieri's influence.", "More from the Dantedì lecture.", "At the UST seminar organized by PIA.", "Filming a video project at Caruso Ristorante Italiano for PIA."
        ],
        communityPost: { link: "https://www.facebook.com/share/p/1Ky5qz91gi/", text: "Dantedì at DEL-dalan 2025! Celebrated with UPD and UP Piccola Italia. Aljohn (intern) gave a lecture." },
        mapEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.709507955976!2d121.02048607588488!3d14.558662677743877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9163c6d2337%3A0xe4e7754570927990!2sPhilippine%20Italian%20Association!5e0!3m2!1sen!2sph!4v1716000000002!5m2!1sen!2sph" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
        id: "dante-manila",
        name: "Società Dante Alighieri Manila",
        languageKey: "italian",
        // partnerId: "pia", // No longer needed
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZ6xeJZsHuplrW3VykiLFXDZRzWAUG8QuOdg&s",
        flag: "https://flagcdn.com/w40/it.png",
        brandPalette: {
          cardBackground: "#5ac5ef", // Bright Blue background
          cardText: "#ffffff",
          buttonAccent: "#ffffff",   // White buttons
          buttonText: "#000000",
          socialIconHoverColor: "#000000" // Black
        },
        previewDescription: "Official center for Italian language courses (A1-C2), CILS exams, and professional translations. Operates in partnership with the Philippine Italian Association.",
        description: "Società Dante Alighieri (SDA) Manila is the primary center for Italian language courses (A1-C2) and official CILS certifications in the Philippines. It also offers professional translation services and organizes cultural events and language exchange sessions. Since December 2024, SDA Manila and the Philippine Italian Association (PIA) operate under a unified administration, with SDA Manila focusing specifically on language education, translation, and related cultural activities.",
        myExperience: "I've attended and collaborated on several language exchange sessions and cultural events here. They provide excellent, structured language courses and are the go-to for official Italian exams and translation needs. The team, including Rose and Maris, is dedicated to promoting Italian language learning.",
        partnershipDescription: "Operates in close partnership with the Philippine Italian Association under a unified administration.", // For modal if needed
        website: "https://ladantemanila.com/",
        facebook: "https://www.facebook.com/SDA.Manila/",
        instagram: "https://www.instagram.com/ladantemanila/",
        contact: " +63(2) 5310 4974 , dantemanila.sda@gmail.com",
        addresses: ["Unit 45, 4/F Zeta Building, 191 Salcedo Street, Legaspi Village, Makati City"],
        keyOfferings: [
            "Italian Language Courses (All levels A1-C2)",
            "Official CILS Exam Center",
            "Professional Translation Services",
            "Cultural Events & Language Exchange Sessions",
            "Teacher Training for Italian Language"
        ],
        featuredVideo: "https://www.youtube.com/embed/jUYWE5d7ykU",
        photoGallery: [
            "images/languagecenters/dante_lunch_languageexchange_2024_bgc_a_mano_restaurant.jpg",
            "images/languagecenters/dante_lunch_languageexchange_2024_bgc_a_mano_restaurant2.jpg",
            "images/languagecenters/dante_lunch_languageexchange_2024_makati_casa_mia_resturant.jpg",
            "images/languagecenters/dante_lunch_languageexchange_2023_bgc_restaurant_ponte_realto_with_actress_ina_feleo_.jpg"
        ],
        photoCaptions: [ "Language exchange at A Mano, BGC (2024).", "More from our A Mano language exchange.", "Chatting in Italian at Casa Mia, Makati (2024).", "Fun language exchange at Ponte Realto, BGC (2023) with actress Ina Feleo." ],
        communityPost: { link: "https://www.facebook.com/share/p/1AQvFRQvBh/", text: "Last Saturday’s language exchange session..." },
        mapEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.709507955976!2d121.02048607588488!3d14.558662677743877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c9163c6d2337%3A0xe4e7754570927990!2sPhilippine%20Italian%20Association!5e0!3m2!1sen!2sph!4v1716000000002!5m2!1sen!2sph" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
        id: "kbri-manila",
        name: "KBRI Manila - Kelas BIPA",
        languageKey: "indonesian",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiKtXhKqgBhobkNHRX76uo1WlHwEVKJaottQ&s",
        flag: "https://flagcdn.com/w40/id.png",
        brandPalette: {
         cardBackground: "#ffffff", 
            cardText: "#000000",       
            buttonAccent: "#f32b2b",   // Red buttons (from coat of arms)
            buttonText: "#ffffff",
            socialIconHoverColor: "#f32b2b" // Already good, but can be explicit
        },
        previewDescription: "Learn Bahasa Indonesia directly from the Indonesian Embassy through their Kelas BIPA courses and cultural events.",
        description: "The Indonesian Embassy in Manila (KBRI Manila) offers Bahasa Indonesia courses for non-native speakers (Kelas BIPA), emphasizing conversational and cultural fluency. They also host fantastic cultural events to promote Indonesian language and heritage.",
        myExperience: "I'm frequently featured in videos from their vibrant embassy events like Independence Day (HUT RI) and the 75th Anniversary of PH-ID diplomatic relations! They create a wonderful and welcoming atmosphere for learning and cultural exchange.",
        website: "https://www.kemlu.go.id/manila/en",
        facebook: "https://www.facebook.com/KBRI.Manila/",
        instagram: "https://www.instagram.com/indonesiainmanila/?hl=en",
        contact: "(+63) 2 8892 5061, manila.kbri@kemlu.go.id",
        addresses: ["185 Salcedo Street, Legaspi Village, Makati City 1229"],
        keyOfferings: ["Bahasa Indonesia Courses (Kelas BIPA)", "Cultural Immersion Events & Festivals", "Promotion of Indonesian Language & Culture"],
        featuredVideo: "https://www.youtube.com/embed/w7dMZQkwX0g",
        photoGallery: [
            "images/languagecenters/kbri_kemerdekaan_2024_group_pic_with_ambassador.jpg",
            "images/languagecenters/kbri_75_Anniversary_PH_INDO_BilateralRelations_Pic_with_Indonesian_Ambassador_AgusWidjojo_.jpg",
            "images/languagecenters/kbri_kemerdekaan_2024_awarding_kompetisi_nyanyi_juara 3.JPEG",
            "images/languagecenters/kbri_kemerdekaan_2024_indo-filipino_family.JPEG",
            "images/languagecenters/kbri_kemerdekaan_2024_selfie.JPEG",
            "images/languagecenters/kbri_kemerdekaan_2024_selfie2.JPEG",
            "images/languagecenters/kbri_75_Anniversary_PH_INDO_BilateralRelations_Pic_with_Troy_IndonesianSpeaker_Filipino.jpg",
            "images/languagecenters/kbri_75_Anniversary_PH_INDO_BilateralRelations_SoloPic.jpg"
        ],
        photoCaptions: [ /* Add captions for these */ ],
        communityPost: { link: "https://www.facebook.com/share/p/1YnUmyPNXb/", text: "DIRGAHAYU REPUBLIK INDONESIA - HUT RI KE 79!! 🇮🇩" },
        mapEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.721734406656!2d121.01800467588487!3d14.557964277739422!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c916e951ac4b%3A0x90a67afc773aced9!2sEmbassy%20of%20the%20Republic%20of%20Indonesia!5e0!3m2!1sen!2sph!4v1716000000004!5m2!1sen!2sph" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    },
    {
        id: "goethe-institut",
        name: "Goethe-Institut Philippinen",
        languageKey: "german",
        logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwMUtJLUAYiavrdn5AbaT6CbCcAqaPkCkgQg&s",
        flag: "https://flagcdn.com/w40/de.png",
        brandPalette: {
         cardBackground: "#a0c814", 
            cardText: "#ffffff",       
            buttonAccent: "#ffffff",   
            buttonText: "#000000",
            socialIconHoverColor: "#FF0000" // German Red for social hover
        },
        previewDescription: "Official German cultural institute offering courses, exams, and diverse cultural programs.",
        description: "The Goethe-Institut is the Federal Republic of Germany’s official cultural institute, active worldwide. It promotes the study of German abroad and encourages international cultural exchange. They offer comprehensive German courses, official Goethe-Zertifikat exams, and a wide range of cultural events.",
        myExperience: "The primary destination for anyone serious about learning German in the Philippines and connecting with German culture through their events and library.",
        website: "https://www.goethe.de/ins/ph/en/index.html",
        facebook: "https://www.facebook.com/goetheinstitut.philippinen/",
        instagram: "https://www.instagram.com/goetheinstitut_philippinen/",
        contact: "(+63) 2 8840 5723, info-manila@goethe.de",
        addresses: ["5/F Adamson Centre, 121 L.P. Leviste Street, Salcedo Village, Makati City 1227"],
        keyOfferings: ["German Language Courses (All levels)", "Goethe-Zertifikat Exams", "Library and Information Center", "Teacher Training", "Cultural Programs (Film, Music, Exhibitions, Literature)"],
        featuredVideo: null,
        videoPlaceholderText: "Future collaborations with Goethe-Institut planned! Stay tuned for video features.",
        photoGallery: [],
        photoCaptions: [],
        communityPost: null,
        mapEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.6015785801027!2d121.02200097588496!3d14.564791677686002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c910096973e1%3A0x279633ada67d2666!2sGoethe-Institut%20Philippinen!5e0!3m2!1sen!2sph!4v1716000000005!5m2!1sen!2sph" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    }
    /*
    ,{
        id: "french-embassy-events",
        name: "French Embassy Event Experiences",
        languageKey: "french",
        logo: "https://intellectual-property-helpdesk.ec.europa.eu/sites/default/files/styles/oe_theme_medium_no_crop/public/2020-11/105541128_3277427755622013_4308961293736078993_n.png?itok=41qs2JgU",
        flag: "https://flagcdn.com/w40/fr.png",
        brandPalette: {
            primary: "#0055a4", 
            secondary: "#ED2939", 
            accent: "#FFFFFF",   
            textOnPrimary: "#FFFFFF",
            textOnAccent: "#0055a4"
        },
        previewDescription: "Experience Francophone culture through exciting embassy-led events like film festivals and karaoke nights.",
        description: "The French Embassy in the Philippines actively promotes Francophone culture through a diverse array of engaging events, often in collaboration with partners like Alliance Française. These events provide fantastic opportunities for language practice and cultural immersion.",
        myExperience: "I've had the honor of being invited to several fantastic events by the French Embassy, including performing at their Francophonie Karaoke Night and attending the French Film Festival red carpet. These are amazing opportunities to practice French and connect with the vibrant Francophone community!",
        website: "https://ph.ambafrance.org/-English-",
        facebook: "https://www.facebook.com/FrenchEmbassyPH/",
        instagram: "https://www.instagram.com/frenchembassyph/?hl=en",
        contact: "(02) 8857 6900 (Embassy General Line)",
        addresses: ["Embassy: 21/F Ayala Triangle Gardens Tower 2, Paseo de Roxas cor Makati Ave, Makati. Event venues vary."],
        keyOfferings: ["Francophonie Week Celebrations", "Annual French Film Festival", "Cultural Exchange Programs", "Promotion of French Language & Culture"],
        featuredVideo: "https://www.youtube.com/embed/l8QRZCdYWnU",
        photoGallery: [
            "images/languagecenters/fr_embassy_paris2024olympics_opening_pic_with_ambassador_marie_fontanel_should_be_at_front.jpg",
            "images/languagecenters/fr_embassy_2024_filmfestival.jpg",
            "images/languagecenters/fr_embassy_2024_filmfestival_pba_players_joe_devance_jared_dillinger.jpg",
            "images/languagecenters/fr_embassy_2024_filmfestival_with_embassy_cultural_attache_martin_macalintal.jpg",
            "images/languagecenters/fr_embassy_2024_filmfestival2.jpg"
        ],
        photoCaptions: [
             "With Ambassador Marie Fontanel at the Paris 2024 Olympics kick-off.",
             "At the 27th French Film Festival.",
             "With PBA players Joe Devance and Jared Dillinger.",
             "With Cultural Attaché Martin Macalintal.",
             "More from the French Film Festival."
        ],
        communityPost: {
            link: "https://www.facebook.com/share/p/1EWcT3otJk/",
            text: "Aljohn Polyglot at the red carpet for the 27th French Film Festival: Feminist! Admission is FREE..."
        },
        mapEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3861.741809606479!2d121.02439517588482!3d14.556820077730453!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397c91700000001%3A0x8c679f65bec05070!2sFrench%20Embassy!5e0!3m2!1sen!2sph!4v1716000000006!5m2!1sen!2sph" width="100%" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
    }
    */
];

// Data for language filter buttons
const languageFilters = [
    { name: "Spanish", key: "spanish", flag: "https://flagcdn.com/w40/es.png" },
    { name: "French", key: "french", flag: "https://flagcdn.com/w40/fr.png" },
    { name: "Italian", key: "italian", flag: "https://flagcdn.com/w40/it.png" },
    { name: "German", key: "german", flag: "https://flagcdn.com/w40/de.png" },
    { name: "Indonesian", key: "indonesian", flag: "https://flagcdn.com/w40/id.png" }
    // Add other languages like Russian, Swedish, Portuguese if they have centers
];