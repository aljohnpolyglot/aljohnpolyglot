// js/bisaya-data.js

const bisayaCreators = [
    // --- Main Talk Show Hosts / Highly Featured ---
    {
     id: 'chito-samontina',
        name: 'Chito Samontina',
        profilePic: 'images/creators/chito_samontina.jpg', // Replace with actual path
        altText: 'Chito Samontina - Bisaya Talk Show Host',
        categoryTags: ['talkshow', 'interview', 'comedy', 'lifestyle'],
        regionTag: 'Davao',
        platformTags: ['youtube', 'facebook', 'instagram', 'tiktok'],
        shortHook: "Ang 'King of Talk' sa Kabisay-an!",
        longDesc: "Si Chito Samontina, nailhan sa iyang sikat nga programang 'CHITchat, Ato Ni!', diin ga-interview siya'g lain-laing mga Bisdak personalities gikan sa Visayas ug Mindanao. Ang iyang style, natural kaayo ug relatable, mao nga daghan gyud ang nagsuporta. Gikan sa mga sikat nga artista hangtod sa mga ordinaryong tawo nga naay talagsaong estorya, naa tanan kang Chito! Usa siya sa mga nag-una sa pag-promote sa Binisaya online.",
        mainFeaturedVideo: {
            videoId: 'sXuO5B4z1vA',
            title: 'CHITchat with Lucy Torres-Gomez'
        },
        playlistHighlights: [
            { videoId: 'QKkOazG_y2o', title: 'CHITchat with Brenda Mage + House and Farm Tour', thumbnailUrl: 'https://i.ytimg.com/vi/QKkOazG_y2o/mqdefault.jpg' },
            { videoId: 'JdVs58hve2w', title: 'CHITchat with Kuya JY (Dongkoy ug Togbens)', thumbnailUrl: 'https://i.ytimg.com/vi/JdVs58hve2w/mqdefault.jpg' },
            { videoId: 'SNaZkaCwA-s', title: 'CHITchat with Richard Gomez', thumbnailUrl: 'https://i.ytimg.com/vi/SNaZkaCwA-s/mqdefault.jpg' },
            { videoId: '_8hdBxyLpq0', title: 'CHITchat with Yamyam Gucong', thumbnailUrl: 'https://i.ytimg.com/vi/_8hdBxyLpq0/mqdefault.jpg' }
        ],
        fullPlaylistUrl: 'https://www.youtube.com/playlist?list=PLLedfUucAwZL3H3hsjZAjhZCWQUCp5JYd', // <<< ADDED/CONFIRMED
        socialLinks: {
            youtube: 'https://www.youtube.com/@ChitoSamontina',
            facebook: 'https://www.facebook.com/chitosamontina',
            instagram: 'https://www.instagram.com/chitosamontina',
            tiktok: 'https://www.tiktok.com/@chitosamontinastudios',
            website: 'chitosamontinastudios.com'
        }
    },
    {
        id: 'kuan-on-one-melai',
        name: 'Kuan on One (Melai Cantiveros)',
        profilePic: 'images/creators/melai_cantiveros.jpg', // Replace with actual path
        altText: 'Melai Cantiveros - Host of Kuan on One',
        categoryTags: ['talkshow', 'comedy', 'interview'],
        regionTag: 'Gensan',
        platformTags: ['youtube'],
        shortHook: "Puro chika, puro lingaw uban ni Kuantie Melai!",
        longDesc: "Ang 'Kuan on One' with Kuantie Melai Cantiveros-Francisco, ang labing unang mainstream talk show sa Binisaya! Kada episode, lain-laing sikat nga Bisaya-speaking celebrity guests ang iyang maka-chika. Natural kaayo ang dagan sa estorya, puno sa katawa, ug Bisdak pride. Produced by ABS-CBN Studios.",
        mainFeaturedVideo: {
            videoId: '6ZpStgdGwvs',
            title: 'Kuan on One with Kim Chiu'
        },
        playlistHighlights: [
            { videoId: '20EBklv1jDs', title: 'FELIP: “Kuantie Melai, pwede ko mangihi?”', thumbnailUrl: 'https://i.ytimg.com/vi/20EBklv1jDs/mqdefault.jpg' },
            { videoId: 'oReU887jI-U', title: 'BINI AIAH: "Kanus-a man ta mag-boom..."', thumbnailUrl: 'https://i.ytimg.com/vi/oReU887jI-U/mqdefault.jpg' },
            { videoId: 'KdO3Khe0xtg', title: 'BINI Colet: "Mao to ang pinaka-intense..."', thumbnailUrl: 'https://i.ytimg.com/vi/KdO3Khe0xtg/mqdefault.jpg' },
            { videoId: 'SbTl17kZZuU', title: 'KZ TANDINGAN & TJ MONTERDE: Kinsa ba ning...', thumbnailUrl: 'https://i.ytimg.com/vi/SbTl17kZZuU/mqdefault.jpg' }
        ],
        fullPlaylistUrl: 'https://www.youtube.com/playlist?list=PLPcB0_P-Zlj78aoUWsRdspPIujw9TiZ_9', // <<< ADDED/CONFIRMED
        socialLinks: {
            youtube_playlist: 'https://www.youtube.com/playlist?list=PLPcB0_P-Zlj78aoUWsRdspPIujw9TiZ_9',
            youtube_channel: 'https://www.youtube.com/@abscbnentertainment'
        }
    },

    // --- Learning Focused ---
    {
        id: 'bisayang-panda',
        name: 'Bisayang Panda',
        profilePic: 'https://yt3.googleusercontent.com/CAjicOufEHeCr0oxqwZ9PFGdqfUtsCo8SUoVmxas1vKPXX9ZmoH_jp1ZFw5wA4WFB8M04kdx8Q=s900-c-k-c0x00ffffff-no-rj', // Placeholder
        altText: 'Bisayang Panda - Cebuano Language Teacher',
        categoryTags: ['learning', 'education', 'culture'],
        regionTag: 'Davao',
        platformTags: ['youtube', 'facebook', 'instagram', 'tiktok',],
        shortHook: 'Imong Bisaya learning buddy!',
        longDesc: "Si Bisayang Panda, gikan sa Davao, hilig kaayo niya ang pagtudlo'g Cebuano/Bisaya sa moderno ug dali masabtan nga paagi. Perfect para sa mga beginners o sa gusto lang mo-refresh sa ilang Bisaya. Klaro ug kumpleto iyang mga lessons, ug active sad siya sa lain-laing platforms para sa mga learners.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/lI4ZB8OYXcs', title: 'We Asked Dabawenyos About Love' },
            
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/@BisayangPanda',
            facebook: 'https://www.facebook.com/BisayangPanda',
            instagram: 'https://www.instagram.com/BisayangPanda',
            tiktok: 'https://www.tiktok.com/@bisayangpanda.ph',
         
        }
    },

    // --- Food & Lifestyle Creators ---
    {
        id: 'bite-king',
        name: 'Bite King',
        profilePic: 'images/creators/bite_king.png', // Use actual: https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNNCTkrrix5lB6EFxQeXIGbmPxJvhQ4SjCjg&s
        altText: 'Bite King - Bisaya Food Vlogger',
        categoryTags: ['food', 'mukbang', 'lifestyle'],
        regionTag: 'Cebu',
        platformTags: ['youtube', 'facebook', 'tiktok'],
        shortHook: 'Mukbang King nga humble ug gwapo!',
        longDesc: "Si James Torres, a.k.a. Bite King, sikat sa iyang mga food vlogs ug mukbang. Gikan Tagum pero pirmi sad makit-an sa Cebu. Bisag gikan sa परिवार nga kaya, down-to-earth kaayo ug relatable iyang dating. Maka-laway iyang mga video, pramis! Ug kamao sad mo-kanta.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/o5cupFwVyf4', title: 'CHITchat + House Tour with Bite King (by Chito Samontina)' },
            { type: 'facebook', url: 'https://www.facebook.com/BiteKingPH.Official/videos/603616982037085', title: 'Rada' }
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/@jamesboyyy',
            facebook: 'https://www.facebook.com/BiteKingPH.Official',
            tiktok: 'http://www.tiktok.com/@jamesboyyy'
        }
    },
    {
        id: 'ms-cynthia',
        name: 'Ms. Cynthia',
        profilePic: 'https://yt3.googleusercontent.com/ZiF-gyi7IqKI7NrXT6ImT_viUMUXxBLA2YJBrPYrH9TWCtxiyM1O5aUScJCVR2cew43VkJluUJ8=s160-c-k-c0x00ffffff-no-rj', // Use actual: https://yt3.googleusercontent.com/ZiF-gyi7IqKI7NrXT6ImT_viUMUXxBLA2YJBrPYrH9TWCtxiyM1O5aUScJCVR2cew43VkJluUJ8=s160-c-k-c0x00ffffff-no-rj
        altText: 'Ms. Cynthia - Boholana Cooking & Lifestyle Vlogger',
        categoryTags: ['cooking', 'lifestyle', 'provincial'],
        regionTag: 'Bohol',
        platformTags: ['facebook', 'youtube'], // Assuming YT based on Chito interview
        shortHook: 'Simple provincial cooking gikan sa Bohol.',
        longDesc: "Si Ms. Cynthia (Cynthia Alambatin), Bol-anon nga content creator, nagpakita sa yano ug tinuod nga kinabuhi sa probinsya. Sikat iyang mga cooking videos, labi na mga pagkaong Bol-anon. Simple iyang style pero maka-relate kaayo ug makadasig. Makita nimo ang ka-charming sa countryside living.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/aMrRtl_TvKY', title: 'CHITchat with Ms. Cynthia (by Chito Samontina)' },
            { type: 'facebook', url: 'https://www.facebook.com/mscynthia0325/videos/1199791627291849', title: 'Ganap before byaheng norte!' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/mscynthia0325',
            youtube: 'https://www.youtube.com/channel/UCFBnv0lABx-ZQFjQmgzBOuw' // Placeholder - find her YT channel ID
        }
    },
    {
        id: 'lk-fam',
        name: 'LK Fam (Laag Kagay-an)',
        profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2kIrUCWij1tCzJrRgabPWrdETI000IPN8gA&s',
        altText: 'LK Fam - Cagayan de Oro Food and Travel',
        categoryTags: ['travel', 'food', 'vlog'],
        regionTag: 'CDO',
        platformTags: ['tiktok', 'facebook'],
        shortHook: 'Laag ug kaon sa Cagayan de Oro!',
        longDesc: "Ang LK Fam, o Laag Kagay-an, magdala nimo sa mga nindot nga lugar ug lamian nga pagkaon sa Cagayan de Oro ug sa palibot. Kung nangita ka'g bag-ong laaganan or kan-anan sa CDO, sila ang sakto nimo nga giya!",
        videoEmbeds: [
            { type: 'facebook', url: 'https://www.facebook.com/laagkagayan/videos/1150021502780335', title: 'Karenderya Serye: Maranao Food' }
        ],
        socialLinks: {
            tiktok: 'https://www.tiktok.com/@laagkagayan',
            facebook: 'https://www.facebook.com/laagkagayan',
           
        }
    },

    // --- Comedy, Skits, Vlogs & Personalities ---
    {
        id: 'al-moralde',
        name: 'Al Moralde',
        profilePic: 'https://viberate-upload.ams3.cdn.digitaloceanspaces.com/prod/entity/artist/al-moralde-SSo6y',
        altText: 'Al Moralde - Bisaya Musician and Content Creator',
        categoryTags: ['music', 'vlog', 'comedy', 'skit'],
        regionTag: 'Cebu',
        platformTags: ['youtube', 'facebook', 'instagram'],
        shortHook: 'Original Bisaya music ug lingaw nga vlogs!',
        longDesc: "Si Al Moralde kay usa ka Cebuano musician ug content creator. Nailhan siya sa iyang mga Bisaya nga kanta sama sa 'Bright Man Unta Ka' ug 'USB'. Naa sad siyay mga vlogs ug ni-star pa sa Bisaya film nga 'Associate'. Chill ug creative iyang style, tatak Bisdak!",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/zaiKzzUF6As', title: 'CHITchat with Al Moralde (by Chito Samontina)' },
            { type: 'facebook', url: 'https://www.facebook.com/almoraldepage/videos/1364176408190781', title: 'Nag-tuo mo nga ma-palit ako’ng botar? 😡😤💸' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/almoraldepage',
            instagram: 'https://www.instagram.com/almoralde/',
            youtube: 'https://www.youtube.com/@AlMoralde' // Placeholder for Al Moralde's YT Channel
        }
    },
    {
        id: 'dansoy-vlogs',
        name: 'Dansoy Vlogs',
        profilePic: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2wTbG4wxIWI75sEL9HhyAdm83w3FElHIIfw&s',
        altText: 'Dansoy Vlogs - Bisaya Comedy and Lifestyle Vlogger',
        categoryTags: ['comedy', 'lifestyle', 'vlog'],
        regionTag: 'Cebu', // From Bohol, but part of Cebu-based BisayaSquad
        platformTags: ['facebook', 'tiktok', 'youtube'],
        shortHook: 'Komedya ug laag with BisayaSquad!',
        longDesc: "Si Dansoy, o Dan Colanse, sikat sa iyang mga kataw-anang vlogs ug isip miyembro sa BisayaSquad. Gikan Bohol pero based na sa Cebu. Ang iyang content, puno sa humor ug adlaw-adlaw nga mga panghitabo. Nagsugod siya sa TikTok hangtod na-discover ni Roy Ucat (Medyo Maldito).",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/uwI4ll9HEMw', title: 'CHITchat with Bisaya Squad (Dansoy & Glester)' },
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fdancolanse%2Fvideos%2F1827658264379628%2F&show_text=false&width=560', title: 'Dansoy Vlog with BINI' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/dancolanse',
            tiktok: 'https://www.tiktok.com/@dansoyofficial', // Assuming handle, verify
            youtube: 'https://www.youtube.com/channel/UC[DANSOY_YT_CHANNEL_ID]' // Placeholder
        }
    },
    {
        id: 'mommy-jupeta',
        name: 'Mommy Jupeta',
        profilePic: 'images/creators/mommy_jupeta_placeholder.jpg',
        altText: 'Mommy Jupeta - TikTok Queen of Q&A',
        categoryTags: ['comedy', 'q&a', 'lifestyle', 'inspirational'],
        regionTag: 'lanao-del-norte',
        platformTags: ['tiktok', 'facebook'],
        shortHook: "Ang 'Queen of Q&A' sa TikTok! Inosente pero witty!",
        longDesc: "Si Mommy Jupeta, o Jupiter Dionaldo, gikan sa Lanao del Norte, naila sa iyang 'bugal-bugal' Q&A sessions sa TikTok. Bisag puno sa komedya, ang iyang kinabuhi naay mga kalisod nga iyang nalampasan. Karon, social work student na siya para makatabang pa sa uban. Grabe ka-resilient ug inspiring!",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/lcoKMHekN4g', title: 'CHITchat Ato Ni! - Mommy Jupeta (by Chito Samontina)' },
            { type: 'facebook', url: 'https://www.facebook.com/100064105172456/videos/1030733518541071', title: 'Mommy Jupeta - Chito Interview Snippet (FB)' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/profile.php?id=100064105172456',
            tiktok: 'https://www.tiktok.com/@mommyjupetaofficial' // Assuming official handle
        }
    },
    {
        id: 'boi-bisaya',
        name: 'Boi Bisaya',
        profilePic: 'images/creators/boi_bisaya_placeholder.jpg',
        altText: 'Boi Bisaya - German Speaking Fluent Bisaya',
        categoryTags: ['comedy', 'prank', 'vlog', 'food'],
        regionTag: 'Cebu',
        platformTags: ['facebook', 'tiktok', 'youtube'],
        shortHook: 'German nga mas Bisaya pa nimo mo-prank!',
        longDesc: "Si Norman Manuel May, a.k.a. Boi Bisaya, usa ka German national nga nagdako sa Lapu-Lapu City, Cebu. Grabe ka-fluent mo-Binisaya! Sikat iyang mga prank videos diin magpaka-aron ingnon siya nga turista nya kalit lang mo-Bisaya. Funny sad iyang food vlogs. Karon, permanente na siya sa Pinas ug naay planong business uban iyang fiancée.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/9jjKj4_cC0U', title: 'CHITchat with Boi Bisaya (by Chito Samontina)' },
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fboi.bisaya%2Fvideos%2F1CZ1aDAZm7%2F&show_text=false&width=560', title: 'Boi Bisaya - Sample Prank Video (FB)' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/boi.bisaya',
            tiktok: 'https://www.tiktok.com/@boibisaya_official', // Assuming official
            youtube: 'https://www.youtube.com/channel/UC[BOIBISAYA_YT_CHANNEL_ID]' // Placeholder
        }
    },
    {
        id: 'glester-capuno',
        name: 'Glester Capuno',
        profilePic: 'images/creators/glester_capuno_placeholder.jpg',
        altText: 'Glester Capuno - BisayaSquad Vlogger',
        categoryTags: ['lifestyle', 'vlog', 'comedy', 'family'],
        regionTag: 'Cebu', // Part of BisayaSquad
        platformTags: ['facebook', 'youtube', 'instagram'],
        shortHook: 'Gikan sa pagka-seaman, karon vlogger na!',
        longDesc: "Si Glester Capuno, kanhi seaman (engineer), karon full-time vlogger na ug parte sa BisayaSquad. Kasagaran kauban niya iyang igsoon nga si Japet ('Capuno Brothers'). Ang iyang journey, inspiring kaayo, nagpakita nga pwede gyud i-pursue ang passion ug magbag-o ang kinabuhi.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/uwI4ll9HEMw', title: 'CHITchat with Bisaya Squad (Glester & Dansoy)' },
            { type: 'youtube', url: 'https://www.youtube.com/embed/GTSajSUKOTw', title: 'Glester Capuno Sample YT Video' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/glestergcapuno',
            youtube: 'https://www.youtube.com/channel/UCTByS3360RI6lqiAI7A3TJA',
            instagram: 'https://www.instagram.com/glestergcapuno/'
        }
    },
    {
        id: 'bridgette-jason-ik',
        name: 'Bridgette & Jason IK',
        profilePic: 'images/creators/bridgette_jason_ik_placeholder.jpg',
        altText: 'Bridgette & Jason IK - Bisaya Couple Vloggers',
        categoryTags: ['comedy', 'couple', 'vlog', 'skit'],
        regionTag: 'Cebu',
        platformTags: ['facebook', 'youtube'],
        shortHook: 'Couple goals, Bisdak style!',
        longDesc: "Sila Bridgette ug Jason IK, sikat sa ilang mga funny ug relatable nga couple vlogs ug skits. Base sa Cebu City, ang ilang content kay 'Way buwagay bahalag mag away!' - puro good vibes ug katawa. Daghan silag followers ug highly recommended!",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/Bav1aWWzJjo', title: 'Sample YouTube Video' },
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D1147871479776713&show_text=false&width=560', title: 'Sample FB Video (from watch link)' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/profile.php?id=100081281247966',
            youtube: 'https://www.youtube.com/channel/UC[THEIR_YT_CHANNEL_ID]' // Placeholder
        }
    },
    {
        id: 'james-ucat',
        name: 'James Ucat (BaristaBoy Jimboy)',
        profilePic: 'images/creators/james_ucat_placeholder.jpg',
        altText: 'James Ucat - BaristaBoy Jimboy',
        categoryTags: ['lifestyle', 'vlog', 'coffee'],
        regionTag: 'Cebu',
        platformTags: ['facebook'],
        shortHook: 'Imong friendly Cebuano BaristaBoy!',
        longDesc: "Si James Ucat, nailhan sad as BaristaBoy Jimboy, usa ka video creator based sa Cebu City. Chill lang iyang mga vlogs, kasagaran about sa iyang adlaw-adlaw nga kinabuhi ug mga laag.",
        videoEmbeds: [
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D1098797364528224&show_text=false&width=560', title: 'Sample FB Video' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/jamesucat9'
        }
    },
    {
        id: 'nikaragwa-official',
        name: 'Nikaragwa Official',
        profilePic: 'images/creators/nikaragwa_placeholder.jpg',
        altText: 'Nikaragwa Official - Creative Bisaya Vlogger',
        categoryTags: ['comedy', 'skit', 'cooking', 'lifestyle'],
        regionTag: 'Bukidnon',
        platformTags: ['youtube', 'facebook', 'tiktok'],
        shortHook: "Creative kaayo! 'Lupad-lupad' & 'Peke Prutas' master!",
        longDesc: "Si Niko Lusac, a.k.a. Nikaragwa Official, gikan sa Bukidnon, grabe ka-creative! Sikat iyang 'lupad-lupad' videos, 'peke prutas' skits, ug mga engaging cooking content. Nag-viral siya during pandemic ug nakapatukod na og kaugalingong balay. Truly inspiring!",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/XUei4auZWsc', title: 'CHITchat with Nikaragwa Official (by Chito Samontina)' },
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FnikaragwaOfficial%2Fvideos%2F977915457147221%2F&show_text=false&width=560', title: 'Sample FB Video' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/nikaragwaOfficial',
            youtube: 'https://www.youtube.com/channel/UC[NIKARAGWA_YT_CHANNEL_ID]', // Placeholder
            tiktok: 'https://www.tiktok.com/@[NIKARAGWA_TIKTOK_HANDLE]' // Placeholder
        }
    },
    {
        id: 'joseph-sabello',
        name: 'Joseph Sabello (Rich Isog)',
        profilePic: 'images/creators/joseph_sabello_placeholder.jpg',
        altText: 'Joseph Sabello - Rich Isog - Ungark King',
        categoryTags: ['comedy', 'skit', 'inspirational', 'lifestyle'],
        regionTag: 'Cebu',
        platformTags: ['youtube', 'facebook'],
        shortHook: "Ang 'Ungark King' nga naay 'street knowledge' ug inspirasyon!",
        longDesc: "Si Joseph Sabello, nailhan isip 'Rich Isog' ug ang 'Ungark King', usa sa mga 'Pandemic Stars'. Ang iyang journey, 'rags-to-riches' gyud. Gikan sa 'Chuy Kaayo Ka Si Oe' nga nag-viral, nag-evolve iyang content ngadto sa mas inspirational messages. Naa siyay merchandise line nga 'UA' (Underground Apparel).",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/F68RIk71KUg', title: 'CHITchat with Joseph "Ungart" Sabello (by Chito Samontina)' },
            { type: 'youtube', url: 'https://www.youtube.com/embed/iAAb4cQKpbA', title: 'Joseph Sabello Sample YT Video' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/josephsabellofficial',
            youtube: 'https://www.youtube.com/@josephsabello/featured'
        }
    },
    {
        id: 'tats-vlog',
        name: 'Tats Vlog (Tatzhiana)',
        profilePic: 'images/creators/tats_vlog_placeholder.jpg',
        altText: 'Tats Vlog - Bisaya Vlogger',
        categoryTags: ['vlog', 'lifestyle', 'comedy'],
        regionTag: 'Unknown', // Not specified
        platformTags: ['facebook', 'youtube'],
        shortHook: "Adlaw-adlaw nga kinabuhi, Bisaya style.",
        longDesc: "Si Tats Vlog (Tatzhiana) mag-share sa iyang adlaw-adlaw nga kasinatian ug mga lingaw-lingaw sa iyang mga vlogs. Relatable ug simple iyang content, perfect para sa mga gusto lang mo-chill.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/NujQrb8Zdgw', title: 'CHITchat with Tats Vlog (by Chito Samontina)' },
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FTatzhiana06%2Fvideos%2F1BSDHx6Boj%2F&show_text=false&width=560', title: 'Tats Vlog Sample FB Video' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/Tatzhiana06',
            youtube: 'https://www.youtube.com/channel/UC[TATS_YT_CHANNEL_ID]' // Placeholder
        }
    },
    {
        id: 'papa-vince',
        name: 'Papa Vince Davao',
        profilePic: 'images/creators/papa_vince_placeholder.jpg',
        altText: 'Papa Vince Davao - Bisaya Character Actor & Vlogger',
        categoryTags: ['comedy', 'skit', 'vlog'],
        regionTag: 'Davao',
        platformTags: ['youtube', 'facebook'],
        shortHook: "Characters nga tatak Bisdak! 'Linda' to 'Ex-General'.",
        longDesc: "Si Papa Vince Davao, o Vincent Nikkolay Bernales, sikat sa iyang mga humorous skits diin mag-portray siya'g lain-laing characters sama nila 'Linda' ug 'Ex-General'. Kanhi radio DJ sa Barangay FM, karon full-time content creator ug entrepreneur na. Naa siyay carwash ug spa.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/T5AB9PC1HJA', title: 'CHITchat with PapaVince Davao (by Chito Samontina)' },
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2FPapaVinceNgDavao%2Fvideos%2F19PihJYE2n%2F&show_text=false&width=560', title: 'Papa Vince Sample FB Video' }
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/channel/UC[PAPAVINCE_YT_CHANNEL_ID]', // Placeholder
            facebook: 'https://www.facebook.com/PapaVinceNgDavao'
        }
    },
    {
        id: 'telma-vlog',
        name: 'Telma',
        profilePic: 'images/creators/telma_placeholder.jpg',
        altText: 'Telma - Bisaya Short Skit Comedian',
        categoryTags: ['comedy', 'skit', 'shortvideo'],
        regionTag: 'Unknown', // Not specified
        platformTags: ['facebook'],
        shortHook: 'Quick skits, big laughs! Grabe ka-viral!',
        longDesc: "Si Telma, grabe ka-sikat sa Facebook tungod sa iyang mga mugbo pero hilariously relatable nga mga comedy skits. Ang iyang 'Buang sa Gugma' ug uban pang videos, minilyon gyud ang views! Simple pero effective iyang style.",
        videoEmbeds: [
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Ftelmavlog%2Fvideos%2F16mtAugVGf%2F&show_text=false&width=560', title: 'Telma - Sample Viral Skit' } // From doc
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/telmavlog'
        }
    },
    {
        id: 'wang-isin',
        name: 'Wang Isin',
        profilePic: 'images/creators/wang_isin_placeholder.jpg',
        altText: 'Wang Isin - Bisaya Comedian & Vlogger',
        categoryTags: ['comedy', 'skit', 'vlog', 'lifestyle'],
        regionTag: 'Davao',
        platformTags: ['youtube', 'facebook', 'tiktok'],
        shortHook: 'Stand-up comic turned vlogging star!',
        longDesc: "Si Wang Isin, o Joey Mark Patos, gikan sa Davao City, naila sa iyang comedy ug vlogs. Nagsugod isip construction worker, dayon stand-up comedian sa Digos Good Vibes. Ang 'Wang' gikan sa grupo, ang 'Isin' sa iyang character nga tsismosa. Karon, nagtukod na'g balay para sa iyang pamilya.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/ZR5zy_w0L0w', title: 'CHITchat with Wang Ising (by Chito Samontina)' },
            { type: 'youtube', url: 'https://www.youtube.com/embed/jNIEeVQO9M0', title: 'Wang Ising Sample YT Video' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/profile.php?id=100063492860284',
            youtube: 'https://www.youtube.com/@Trendinggg',
            tiktok: 'https://www.tiktok.com/@wang_ising'
        }
    },
    {
        id: 'florame-b',
        name: 'Florame B.',
        profilePic: 'images/creators/florame_b_placeholder.jpg',
        altText: 'Florame B - Boholana Vlogger',
        categoryTags: ['lifestyle', 'vlog', 'comedy', 'inspirational', 'provincial'],
        regionTag: 'Bohol',
        platformTags: ['youtube', 'facebook'],
        shortHook: 'Boholana vlogger nga authentic ug inspiring!',
        longDesc: "Si Florame B. (Florame Burato), Bol-anon nga vlogger, sikat sa iyang authentic 'life in the province' content ug distinct Boholano accent. Ang iyang 'pangahoy' video nga naka-gown nag-viral! Nalampasan niya ang thyroid cancer, ug karon breadwinner na sa iyang pamilya. Truly inspiring iyang ka-resilient.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/ZCnhT24Ep6Q', title: 'CHITchat with Florame B (by Chito Samontina)' },
            { type: 'youtube', url: 'https://www.youtube.com/embed/fx1ytKgHbO8', title: 'Florame B Sample YT Video' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/florameB',
            youtube: 'https://www.youtube.com/c/FlorameBoholana'
        }
    },
    {
        id: 'lou-neria',
        name: 'Lou Neria Maestre Putian',
        profilePic: 'images/creators/lou_neria_placeholder.jpg',
        altText: 'Lou Neria Maestre Putian - CEO of SY Glow',
        categoryTags: ['business', 'inspirational', 'lifestyle', 'beauty'],
        regionTag: ['Bohol','Davao'], // Grew up Bohol, studied/started business Davao
        platformTags: ['facebook', 'tiktok', 'youtube'],
        shortHook: 'Ang CEO sa SY Glow! From poverty to success.',
        longDesc: "Si Ma'am Lou Putian, ang CEO ug founder sa SY Glow skincare, naay inspiring 'rags-to-riches' story. Gikan sa kalisod sa Bohol, working student sa Davao, hangtod nahimong successful businesswoman. Ang 'SY' sa iyang brand, gikan sa iyang idol nga si Henry Sy ug iyang anak nga si Yuki.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/hv6W1EqYzYs', title: 'CHITchat with SY Glow CEO, Mother Lou (by Chito Samontina)' },
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Flouneria.putian%2Fvideos%2F14wEjQCUew%2F&show_text=false&width=560', title: 'Lou Neria Sample FB Video' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/louneria.putian',
            tiktok: 'https://www.tiktok.com/@motherlouph', // Assuming, based on her story
            youtube: 'https://www.youtube.com/channel/UC[LOUNERIA_YT_CHANNEL_ID]' // Placeholder
        }
    },
    {
        id: 'zevie-family',
        name: 'ZEVIE MOMMY and DADDY (Bugais Family)',
        profilePic: 'images/creators/zevie_family_placeholder.jpg',
        altText: 'ZEVIE Mommy and Daddy - Bisdak Family Vloggers',
        categoryTags: ['family', 'lifestyle', 'vlog', 'kids'],
        regionTag: 'Unknown', // Not specified
        platformTags: ['facebook', 'youtube'],
        shortHook: 'Ang pinaka-cute nga Bisdak family sa internet!',
        longDesc: "Ang Bugais family—si Zevie, Mommy Rendell, ug Daddy Fernand—sikat sa ilang heartwarming ug authentic family vlogs. Si Zevie, ang bida, grabe ka-charming ug ka-bright. Gipakita nila ang gugma, acceptance, ug open communication sa ilang pamilya.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/LMK3s3yvbt4', title: 'CHITchat with Zevie, Mommy, Daddy (by Chito Samontina)' },
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fprofile.php%3Fid%3D100087249034082%2Fvideos%2F19JRK1RUxd%2F&show_text=false&width=560', title: 'ZEVIE Family Sample FB Video' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/profile.php?id=100087249034082',
            youtube: 'https://www.youtube.com/channel/UC[ZEVIE_YT_CHANNEL_ID]' // Placeholder
        }
    },
    {
        id: 'mikyath-ross',
        name: 'Mikyath Ross',
        profilePic: 'images/creators/mikyath_ross_placeholder.jpg',
        altText: 'Mikyath Ross - Bisaya Content Creator, Former Teacher',
        categoryTags: ['lifestyle', 'personal', 'comedy', 'vlog', 'motherhood'],
        regionTag: 'Davao/Digos/USA', // Multiple locations
        platformTags: ['youtube', 'facebook'],
        shortHook: 'Real talk, real life. Inspiring ug funny!',
        longDesc: "Si Mikyath Ross, igsoon ni Wilbert Ross, naay kaugalingong tingog sa social media. Kanhi maestra, karon US-based content creator ug mama sa duha. Known for her candid and humorous take sa kinabuhi, motherhood, ug personal struggles. Nag-pursue sad siya'g doctorate.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/pXMQdpDTyn4', title: 'CHITchat with Mikyath Ross (by Chito Samontina)' },
            { type: 'youtube', url: 'https://www.youtube.com/embed/HofWhEtTZWg', title: 'Mikyath Ross Sample YT Video' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/profile.php?id=100076028268750', // mikyath ross v2
            youtube: 'https://www.youtube.com/@mikyathross659'
        }
    },
    {
        id: 'vonny',
        name: 'Vonny',
        profilePic: 'images/creators/vonny_placeholder.jpg',
        altText: 'Vonny - Bisaya Podcaster and Content Creator',
        categoryTags: ['podcast', 'talks', 'lifestyle', 'foodreview', 'shortvideo'],
        regionTag: 'Bohol',
        platformTags: ['youtube', 'facebook', 'instagram'],
        shortHook: 'Small talks, Bisaya podcast, ug food reviews!',
        longDesc: "Si Vonny, o Stephen Monesit, usa ka Bisaya podcaster (Small talks and Podcast) ug content creator gikan sa Bohol. Nailhan siya sa iyang mga short videos nga minilyon ang views ug mga food reviews sa iyang probinsya. Relatable ug insightful iyang mga discussions.",
        videoEmbeds: [
            { type: 'youtube', url: 'https://www.youtube.com/embed/psd9hLvmN-w', title: 'Vonny - Ngisi ra gyd tas relasyon sa uban (Popular Short)' },
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fvoniexx%2Fvideos%2F15pMzL52gM%2F&show_text=false&width=560', title: 'Vonny - Matawag ba na cheating? (FB Video)' }
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/c/StephenMonesit',
            facebook: 'https://www.facebook.com/voniexx',
            instagram: 'https://www.instagram.com/step'
        }
    },
    {
        id: 'taho-man-unofficial',
        name: 'Taho man - Unofficial',
        profilePic: 'images/creators/taho_man_placeholder.jpg',
        altText: 'Taho man - Unofficial Bisaya Comedian',
        categoryTags: ['comedy', 'reels', 'shortvideo'],
        regionTag: 'Unknown', // Not specified
        platformTags: ['facebook'],
        shortHook: 'Good vibes lang ta diria mga angkol!',
        longDesc: "Ang Taho man - Unofficial page maghatag nimo'g good vibes pinaagi sa ilang mga kataw-anang reels ug posts. Simple, direct, ug puro lingaw para sa mga angkol nga gwapo (ug sa tanan!).",
        videoEmbeds: [
            { type: 'facebook', url: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F1215078726597546&show_text=false&width=560', title: 'Taho Man Sample Reel' }
        ],
        socialLinks: {
            facebook: 'https://www.facebook.com/profile.php?id=61559160522490'
        }
    }
];
const chitoMelaiCollabs = [
    {
        id: 'collab-chito-on-kuan',
        videoId: 'nsZtcPWRkng',
        title: 'CHITO SAMONTINA:”Kung wala nako ‘to naagian...” | KUAN ON ONE S2 Ep11',
        thumbnailUrl: 'https://i.ytimg.com/vi/nsZtcPWRkng/mqdefault.jpg',
        platform: 'Kuan on One (ABS-CBN Ent.)',
        duration: '59:55'
    },
    {
        id: 'collab-melai-on-chitchat-1',
        videoId: 'yKyzejIZirU',
        title: 'CHITchat with Melai Cantiveros-Francisco | by Chito Samontina',
        thumbnailUrl: 'https://i.ytimg.com/vi/yKyzejIZirU/mqdefault.jpg',
        platform: 'CHITchat, Ato Ni! (Chito Samontina)',
        duration: '40:58'
    },
    {
        id: 'collab-chito-bday-on-chitchat',
        videoId: '4pGcQmVhv5w',
        title: 'CHITchat with Chito Samontina | by Melai Cantiveros-Francisco (Birthday Special)',
        thumbnailUrl: 'https://i.ytimg.com/vi/4pGcQmVhv5w/mqdefault.jpg',
        platform: 'CHITchat, Ato Ni! (Chito Samontina)',
        duration: '25:16'
    },
    {
        id: 'collab-melai-maamchief-on-chitchat',
        videoId: 'zjvq_ojRyV4',
        title: 'CHITchat with "Maam Chief" Melai Cantiveros-Francisco | by Chito Samontina',
        thumbnailUrl: 'https://i.ytimg.com/vi/zjvq_ojRyV4/mqdefault.jpg',
        platform: 'CHITchat, Ato Ni! (Chito Samontina)',
        duration: '24:20'
    }
];
const bisayaKDramas = [
    {
        id: 'true-beauty-bisaya',
        title: 'True Beauty (Bisaya)',
        posterSrc: 'https://upload.wikimedia.org/wikipedia/en/7/76/True_Beauty_TV_series_poster.jpg',
        altText: 'True Beauty K-Drama Bisaya Version Poster',
        shortSynopsis: "Si Ju Kyung, gi-bully sa iyang looks, ni-transform gamit ang makeup. Pero tago gihapon iyang tinuod nga nawong...",
        longSynopsis: "Si Ju Kyung kay gi-bully sa eskwelahan tungod sa iyang hitsura. Dili siya ka-fit in. Pag-high school niya, ni-decide siya nga magbag-o gamit iyang makeup skills. Pero, di gihapon siya happy kay kabalo siya nga ang iyang mga bag-ong amigo, ganahan lang niya tungod sa iyang nawong nga naay makeup. Samtang nag-survive siya kada adlaw nga gitago iyang tinuod nga hitsura, naay na-meet nga laki nga naay sad story sad. Nag-comfort sila sa usag-usa ug nangita'g kusog para mubalik sa kalibutan nga ilang gidalagan.",
        platformLink: 'https://www.viu.com/ott/ph/en/vod/2080292/True-Beauty-Bisaya',
        platformName: 'Viu',
        VideoPreview:'https://www.facebook.com/viuthephilippines/videos/1714725888870747',
      genres: ["Romance", "Comedy", "Youth"],
    starring: "Moon Ga-young, Cha Eun-woo, Hwang In-youp, Park Yoo-na"
    },
    {
        id: 'dots-bisaya',
        title: 'Descendants of the Sun (Bisaya)',
        posterSrc: 'images/shows/dots_poster.jpg',
        altText: 'Descendants of the Sun K-Drama Bisaya Version Poster',
        shortSynopsis: "Paspas nahigugma si Captain Yoo Si-jin ug Dr. Kang Mo-yeon, pero nabuwag tungod sa trabaho...",
        longSynopsis: "Paspas nga nahigugma sina Yoo Si-jin, ang captain sa usa sa South Korean Special Forces unit, ug si Dr Kang Mo-yeon, usa ka dedicated nga doctor, apan kinahanglang magbulag tungod sa ilang pagkalainlain sa trabaho ug gituohan. Nagkita sila usab ug nahibal-an nila nga naa pa sila feelings. Ang kini nga drama bahin sa kung giunsa malampasan sa mga batan-ong doktor ug sundalo ang mga kalisud ug gitukod ang ilang mga kalabutan sa layo nga nasud sa Urk.",
        platformLink: 'https://www.viu.com/ott/ph/en/vod/402888/Descendants-of-the-Sun-Bisaya',
        platformName: 'Viu',
        VideoPreview:'https://www.facebook.com/viuthephilippines/videos/1714725888870747',
        genres: ["Action", "Romance", "Melodrama"],
    starring: "Song Joong-ki, Song Hye-kyo, Jin Goo, Kim Ji-won"
    },
    {
        id: 'doom-at-your-service-bisaya',
        title: 'Doom at Your Service (Bisaya)',
        posterSrc: 'images/shows/doom_at_your_service_poster.jpg',
        altText: 'Doom at Your Service K-Drama Bisaya Version Poster',
        shortSynopsis: "Si Tak Dong Kyung, naay sakit nga di maayo. 100 days na lang, nag-wish siya'g 'doom'...",
        longSynopsis: "Si Tak Dong Kyung, usa ka babaye nga naay sakit nga dili na maayo. 100 ka adlaw na lang iyang kinabuhi, nag-wish siya sa mga bituon dili para kwarta o kasikatan, apan para sa 'doom' o kalaglagan. Bisag pulong lang to para niya, naminaw ang mga bituon. Usa ka estranghero nga si Myul Mang, nagpakita sa iyang pultahan, nag-ingon nga siya ang kalaglagan sa kalibutan. Kini estorya tali sa babaye nga gusto mabuhi og malipayon sa nahabilin niyang panahon, ug sa lalaki nga nakaagi na sa pinakakangitngit nga 'doom'.",
        platformLink: 'https://www.viu.com/ott/ph/en/vod/2231198/Doom-at-Your-Service-Bisaya',
        platformName: 'Viu',
        VideoPreview:'https://www.facebook.com/watch/?v=6651918494831054',
        genres: ["Fantasy", "Romance", "Melodrama"],
    starring: "Park Bo-young, Seo In-guk, Lee Soo-hyuk, Kang Tae-oh, Shin Do-hyun"

    },
    {
        id: 'a-beautiful-angel-bisaya',
        title: 'A Beautiful Angel (Bisaya)', // Indonesian series
        posterSrc: 'images/shows/a_beautiful_angel_poster.jpg',
        altText: 'A Beautiful Angel Bisaya Version Poster',
        shortSynopsis: "Si Ayna, modern Islamic woman, naay mga damgo. Nahigugma kang Gus Afif...",
        longSynopsis: "Isip usa ka moderno nga babaye nga Muslim, si Ayna naay mga damgo nga gusto niyang makab-ot sa kinabuhi. Labi na kay nahigugma siya sa unang higayon kang Gus Afif, usa ka diosnon nga batan-ong lalaki ug tag-iya sa Islamic Boarding School diin nagtuon si Ayna. Apan kung ang mga tawong duol niya naay laing plano, kinahanglan atubangon ni Ayna ang mga hagit para matuman iyang damgo ug mahiusa sa lalaking iyang gipili.",
        platformLink: 'https://www.viu.com/ott/ph/en/vod/2290138/A-Beautiful-Angel-Bisaya',
        platformName: 'Viu',
        videoPreview: 'https://www.facebook.com/watch/?v=748757113805016',
        Genres: ["Fantasy", "Romance"],
    starring: "Raffi Ahmad, Nagita Slavina, Fadil Jaidi, Keanu Agl"
    }
];

const bisayaPodcasts = [
    {
        id: 'barok-takya',
        title: 'Barok and Takya Bisaya Podcast',
        coverSrc: 'https://i.scdn.co/image/ab6765630000ba8a03d570c10feff07b3f9fff69',
        altText: 'Barok and Takya Bisaya Podcast Cover Art',
        shortDesc: "Lively couple Barok and Takya, talks about Filipino society and culture in Bisaya.",
        longDesc: "Maminaw ta sa top Filipino Podcast sa Cebuano language, Barok and Takya Bisaya Podcast! Kining bibo nga magtiayon, si Barok ug Takya, maghisgot bahin sa mga butang nga importante sa daghang Pinoy: pamilya, tradisyon, ug kulturang Pinoy. Makalingaw sila nga pares nga makapakatawa nimo samtang magtudlo'g bag-ong insights sa Filipino values.",
        platformLinks: {
            apple: 'https://podcasts.apple.com/us/podcast/barok-and-takya-bisaya-podcast-a-filipino-pinoy-podcast/id1445558228',
            spotify: 'https://open.spotify.com/show/1fqta72GpjeslUAMskhcVr',
            youtube: 'https://www.youtube.com/@BisayaPodcast',
            website: 'https://barokandtakya.com/'
        }
    },
    {
        id: 'dili-ni-advice',
        title: 'Dili Ni Advice',
        coverSrc: 'images/podcasts/dili_ni_advice_cover.jpg',
        altText: 'Dili Ni Advice Podcast Cover Art',
        shortDesc: "Hosted by Darling and Kringkay, two millennials from Davao City discussing modern society...",
        longDesc: "Ang Dili Ni Advice kay Bisaya podcast nila Darling ug Kringkay, duha ka millennial gikan sa Davao City. Kada semana, maghisgot sila unsay init—o dili—sa modernong katilingban ug pop culture. Murag chika lang sa imong mga amiga! Relaxed ug relatable kaayo.",
        platformLinks: {
            spotify: 'https://open.spotify.com/show/6dz2XDpaUZFi3pfRk1lf5u',
            website: 'https://www.diliniadvice.com/'
        }
    },
    {
        id: 'storyang-kinabuhi',
        title: 'Storyang Kinabuhi (Bisaya Podcast)',
        coverSrc: 'images/podcasts/storyang_kinabuhi_cover.jpg',
        altText: 'Storyang Kinabuhi Podcast Cover Art',
        shortDesc: "Hosted by Ador Flores, talking about life, career, relationships, finances, ug uban pa!",
        longDesc: "Ang Storyang Kinabuhi kay Bisaya Podcast ni Ador Flores diin maghisgot sila bahin sa kinabuhi, career, relasyon, kwarta, ug uban pa. Mga lawom nga diskusyon ug mga debate nga makapahunahuna gyud nimo og maayo. Great for deep thinking!",
        platformLinks: {
            spotify: 'https://open.spotify.com/show/0bFrqG9KLMLWeXK9coEIxD'
        }
    },
    {
        id: 'bisaya-podcasts-ph',
        title: 'Bisaya Podcasts PH',
        coverSrc: 'images/podcasts/bisaya_podcasts_ph_cover.jpg',
        altText: 'Bisaya Podcasts PH Cover Art',
        shortDesc: "Aims to unite Bisaya Podcasts around the world. Features long episodes.",
        longDesc: "Hello! Welcome sa Bisaya Podcasts PH! Lisod mangita og Bisaya podcasts, ug mas lisod mangita og audience. Kini nga podcast, gusto i-unite ang mga Bisaya Podcasts para dali ra ta mag-connect. Usually tag-duha ka oras ang episode, perfect pang-binge!",
        platformLinks: {
            spotify: 'https://open.spotify.com/show/2zuMvYQ3F0Vo9RUJR4azyU'
        }
    },
    {
        id: 'katikaran',
        title: 'KATIKaran',
        coverSrc: 'images/podcasts/katikaran_cover.jpg',
        altText: 'KATIKaran Podcast Cover Art',
        shortDesc: "Dive into the vibrant world of Bisaya Gen Z stories, dreams, and daily adventures.",
        longDesc: "Suhira ang madasigon nga kalibutan sa mga Bisaya Gen Z samtang mag-share sila'g mga estorya, damgo, ug adlaw-adlaw nga laag. Gisaulog nila ang atong kultura ug nagtukod og taytayan tali sa mga henerasyon. Join for laughs, insights, and heartwarming tales—tanan sa Binisaya!",
        platformLinks: {
            spotify: 'https://open.spotify.com/show/0F2iVfTueC0fFfObZpKLfY'
        }
    },
    {
        id: 'unsay-cheka-sa-parlor',
        title: 'Unsa’y Cheka Sa Parlor',
        coverSrc: 'images/podcasts/unsay_cheka_cover.jpg',
        altText: 'Unsa’y Cheka Sa Parlor Podcast Cover Art',
        shortDesc: "Hosted by Lyle Go and Shaneee, inspired by Bisaya gay lingo for 'What's the tea?'",
        longDesc: "Ang UCSP, o Unsa'y Cheka Sa Parlor?, usa ka podcast inspired sa sikat nga phrase sa Bisaya gay lingo. Hosted by Lyle Go ug Shaneee, murag 'What's the tea?' sa English. Expect lots of fun and juicy chika!",
        platformLinks: {
            spotify: 'https://open.spotify.com/show/7nsEse7Qm07RMto0P1ypRP'
        }
    },
    {
        id: 'pagilok-bisaya',
        title: 'Pagilok Bisaya The Podcast',
        coverSrc: 'images/podcasts/pagilok_bisaya_cover.jpg',
        altText: 'Pagilok Bisaya The Podcast Cover Art',
        shortDesc: "Mga sugilanon nga binisaya nga nagdala'g pagilok sa imahinasyon. Audio drama.",
        longDesc: "Pagilok Bisaya! Mga sugilanon nga binisaya nga magdala'g kurog ug pagilok sa inyong imahinasyon. Kini usa ka audio drama podcast, perfect para sa mga ganahan og horror ug true crime type nga mga estorya.",
        platformLinks: {
            spotify: 'https://open.spotify.com/show/5oB0tEcvwR0hcLAsVVvw2Q'
        }
    },
    {
        id: 'sweeto-podcast',
        title: 'SweeTo - A Bisayang VA Podcast',
        coverSrc: 'images/podcasts/sweeto_cover.jpg',
        altText: 'SweeTo - A Bisayang VA Podcast Cover Art',
        shortDesc: "Tony and his wife, Sween, talking about the life of a Virtual Assistant - raw and unfiltered.",
        longDesc: "Sila si Tony ug iyang asawa nga si Sween, maghisgot bahin sa kinabuhi sa usa ka Virtual Assistant—raw and unfiltered. Dili sila magduha-duha ug Binisaya na naay gamayng English. Helpful kaayo para sa mga aspiring VAs!",
        platformLinks: {
            spotify: 'https://open.spotify.com/show/6mscCzJ9dZWimn4RBoNt4o'
        }
    },
    {
        id: 'storytelling-with-ziwi',
        title: 'Storytelling with Ziwi (Bisaya Podcast)',
        coverSrc: 'images/podcasts/storytelling_ziwi_cover.jpg',
        altText: 'Storytelling with Ziwi Podcast Cover Art',
        shortDesc: "A podcast about random stories. Ziwi talks about her personal experiences and life lessons.",
        longDesc: "Usa ka podcast bahin sa mga random nga estorya. Si Ziwi mag-share sa iyang mga personal nga kasinatian ug mga leksyon sa kinabuhi. Murag chika lang sa imong amiga, #ChikaMinute style. Relaxed ug relatable!",
        platformLinks: {
            spotify: 'https://open.spotify.com/show/7KFWNwy1nVxTD3PdrsY0aY'
        }
    },
    {
        id: 'bisaya-talks',
        title: 'Bisaya Talks!',
        coverSrc: 'images/podcasts/bisaya_talks_cover.jpg',
        altText: 'Bisaya Talks! Podcast Cover Art',
        shortDesc: "A podcast exclusive to all BisDak people. Talks about life learning experiences nga naay pagka binugoy.",
        longDesc: "Ang 'Bisaya Talks!' kay podcast para gyud sa tanang BisDak! Maghisgot sila bahin sa mga life learning experiences nga naay sagol pagka-binugoy. Lingaw ug naay makutlo nga pagtulun-an.",
        platformLinks: {
            spotify: 'https://open.spotify.com/show/5lONjhRODsBpAepgUFlFh3'
        }
    },
    {
        id: 'bisdakball',
        title: 'Bisdakball',
        coverSrc: 'images/podcasts/bisdakball_cover.jpg',
        altText: 'Bisdakball Podcast Cover Art',
        shortDesc: "Storya lang tag basketball ani tibuok adlaw! Para sa mga Bisdak nga adik sa basketball.",
        longDesc: "Kung adik ka sa basketball sama nako, para gyud ni nimo! Ang Bisdakball kay podcast nga puro hisgot bahin sa basketball, sa Binisaya nga pinulongan. Perfect para sa mga basketball addicts nga Bisdak! Sayang lang kay murag ni-undang na sila, pero ang mga daan nga episodes, sulit gihapon paminawon.",
        platformLinks: {
            spotify: 'https://open.spotify.com/show/1452x5Gc965t7pSXEeZPQA'
        }
    }
];
// js/bisaya-data.js

// ... (existing bisayaCreators, chitoMelaiCollabs, bisayaKDramas, bisayaPodcasts) ...

const bisayaMusicArtists = [
    {
        id: 'juan-karlos',
        name: 'juan karlos',
        coverArt: 'https://cdn-images.dzcdn.net/images/cover/871a4489a8f5307e8e40eab0eb57f0cd/0x1900-000000-80-0-0.jpg',
        spotifyLink: 'https://open.spotify.com/artist/0a4r2EnsevvHCukoJ1xFwJ',
        location: 'Consolacion, Cebu',
        longDesc: "Si Juan Karlos Labajo, garbo sa Consolacion, Cebu, usa sa mga stars sa OPM. Sumikat isip The Voice Kids alumnus, karon frontman sa bandang Juan Karlos. Bisag sikat na sa mainstream, active gihapon siya sa paghimo og Bisaya songs nga maka-touch sa kasingkasing. Iyahang mga kanta, gikan sa kalalim sa kasingkasing!",
        bisayaSongs: [ // Only include their Bisaya songs here
            { title: 'Kasing Kasing (Official Live Performance) ft. Kyle Echarri', videoId: 'PVgH0K9J6eg' },
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/channel/UC14oPNk-BubCU2aCmtHosLg',
            instagram: 'https://www.instagram.com/juankarlos/?hl=en/' // Verified IG handle
        }
    },
    {
        id: 'tj-monterde',
        name: 'TJ Monterde',
        coverArt: 'https://i.scdn.co/image/ab6761610000e5eb80272b2bfc4ada39a96f984a',
        spotifyLink: 'https://open.spotify.com/artist/7LvDTuFCBv08xm6u1pOMK0',
        location: 'Cagayan de Oro',
        longDesc: "Si TJ Monterde, lumad taga Cagayan de Oro, sikat sa iyang viral YouTube videos ug orihinal nga kanta. Bisag paborito sa love songs, active gihapon siya sa paghimo og Bisaya tracks nga maka-relate kaayo. Iyahang 'Puhon', solid gyud! Isa sa mga pioneer sa Bisaya mainstream sa YouTube.",
        bisayaSongs: [
            { title: 'Puhon', videoId: 'GcgPbu5CxX8' }
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/channel/UCzJxqvJG_aVsSpMcWxy0d7A',
            instagram: 'https://www.instagram.com/tjmusicmonterde//'
        }
    },
    {
        id: 'kurt-fick',
        name: 'Kurt Fick',
        coverArt: 'https://i.scdn.co/image/ab6761610000e5eb2664bb2b894edf003aa133f4',
        spotifyLink: 'https://open.spotify.com/artist/5owmqj7huSBTrfT3vCwtuG',
        location: 'Cebu City',
        longDesc: "Si Kurt Fick, gi-dub nga Vispop Superstar, duna'y hits sama sa 'HAHAHAHasula' ug 'DI NA'. Kanunay siyang mo-break og boundaries ug mo-establish og bag-ong tunog sa Bisaya music. Gikan sa melancholic acoustic ballads ngadto sa groovy, funky earworms, si Kurt Fick, tatak Bisdak!",
        bisayaSongs: [
            { title: 'HAHAHAHasula (Official Music Video)', videoId: 'eTXN9CyPPF4' }
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/channel/UCAm5szodUXb_1YYdcrvE5VQ',
            facebook: 'https://www.facebook.com/kurtfickmusic/',
            instagram: 'https://www.instagram.com/kurtficktures/?hl=en/'
        }
    },
    {
        id: 'jacky-chang',
        name: 'Jacky Chang',
        coverArt: 'https://i.scdn.co/image/ab676161000051744d62d4945b79303edb4f416b',
        spotifyLink: 'https://open.spotify.com/artist/4H5Wsa3sUVdJfjk5JI7TFl',
        location: 'Cebu City',
        longDesc: "Si Jacky Chang, ang Sinulog Idol Grand Winner, nailhan isip 'Maoy Diva of Cebu' sa iyang mga kanta sama sa 'Pero Atik Ra'. Kanunay siya mo-embrace og pop girl status, ug i-combine iyang Cebuano ug Korean roots sa iyang empowering lyrics. Ready for new territories, Bisaya pop star gyud ni!",
        bisayaSongs: [
            { title: 'Pero Atik Ra (Official Music Video)', videoId: 'GNqlmRFsq-o' }
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/@jackychang6969', // Verified YT Channel
            facebook: 'https://www.facebook.com/JackyChangOfficial',
            instagram: 'https://www.instagram.com/jacky_chang_/' // Verified IG
        }
    },
    {
        id: 'felip',
        name: 'FELIP',
        coverArt: 'https://i.scdn.co/image/ab67616d0000b273c7b784a2f533b334b0bf90b8',
        spotifyLink: 'https://open.spotify.com/artist/2tEFDBihLXytoPl4xdResl',
        location: 'Zamboanga del Sur',
        longDesc: "Si FELIP, o Ken sa SB19, usa ka multi-talented Filipino artist. Siya ang main dancer, lead rapper, ug producer sa SB19. Sa iyang solo projects, nirelease siya'g 'Palayo', 'Bulan', ug ang iyahang debut solo EP 'Complex'. Unique iyang deep voice ug hip hop artistry, Bisaya pride gyud ni!",
        bisayaSongs: [
            { title: 'Kanako (Band Version Official Music Video)', videoId: 'd5mnBBP2w4U' }
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/@FELIP_Official',
            instagram: 'https://www.instagram.com/felipsuperior/'
        }
    },
    {
        id: 'hey-joe-show',
        name: 'Hey Joe Show',
        coverArt: 'https://i.scdn.co/image/ab67616d0000b2735d09f0b21c5cac869ecec4a0',
        spotifyLink: 'https://open.spotify.com/artist/1vvD9XGQVmNtKsyPW7TFcZ',
        location: 'USA (Bisaya Content)',
        longDesc: "Ang Hey Joe Show, grupo sa mga Amerikano, dedicated sa pag-celebrate ug pag-expose sa Filipino culture sa global audience. Sikat sila sa mga American take sa Filipino customs ug sa mga popular songs nga gi-translate sa Bisaya. Kanunay silang maka-pahiyom sa mga Pinoy. Bisdak kaayo sila mo-Binisaya!",
        bisayaSongs: [
            { title: 'My Morena Girl (Official Music Video)', videoId: 'rMePbAhBOd8' }
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/@HeyJoeShow',
            facebook: 'https://www.facebook.com/HeyJoeShowOfficial', // Verified FB
        }
    },
    {
        id: 'colet',
        name: 'Colet (BINI)',
        coverArt: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRhfr6SuQN_ZIWjzj6nCNmbtShFx0KrmUZ0NQ&s',
        spotifyLink: 'https://open.spotify.com/artist/7tNO3vJC9zlHy2IJOx34ga', // BINI's spotify
        location: 'Tagbilaran, Bohol',
        longDesc: "Si Ma. Nicolette Florenosos Vergara, o Colet sa BINI, usa ka multi-talented artist gikan sa Bohol. Siya ang main vocalist, dancer, ug rapper sa P-pop girl group BINI. Gisuwat pud niya ang lyrics sa ilang single nga '8'. Bright ug versatile, garbo sa Bohol ug sa Pilipinas!",
        bisayaSongs: [
            { title: 'Padayon Lyrics (Unreleased Bisaya Song)', videoId: 'ls9IpcUZ0Fk' }
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/@BINI_ph', // BINI's official channel
            instagram: 'https://www.instagram.com/bini_colet/' 
        }
    },
    {
        id: 'aiah',
        name: 'Aiah (BINI)',
        coverArt: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW3uqM7Lkm7aIGjglEDqDrnPgsRBZBeGEwxw&s',
        spotifyLink: 'https://open.spotify.com/artist/7tNO3vJC9zlHy2IJOx34ga', // BINI's spotify
        location: 'Lapu-Lapu City, Cebu',
        longDesc: "Si Maraiah Queen Arceta, o Aiah sa BINI, usa ka singer, rapper, dancer, ug model gikan sa Lapu-Lapu City, Cebu. Nahimo siyang Miss Silka Philippines 2018. Gisuwat pud niya ang rap verse sa ilang single nga 'Kapit Lang'. Active gihapon sa modeling, ug supporter sa komunidad pinaagi sa iyahang Aiahdvocacy. Multi-talented Bisdak!",
        bisayaSongs: [
             // Found video for Karera BINI
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/@BINI_ph',
            instagram: 'https://www.instagram.com/bini_aiah/'
        }
    },
    {
        id: 'kyle-echarri',
        name: 'Kyle Echarri',
        coverArt: 'https://i.scdn.co/image/ab6761610000e5eb933a75fcd5931fef4d84008b',
        spotifyLink: 'https://open.spotify.com/artist/53qa1XIZ6pZuhrGDetCGew',
        location: 'Cebu (based)',
        longDesc: "Si Kyle Echarri, sikat nga singer ug aktor nga mi-gain og recognition isip semi-finalist sa The Voice Kids. Nirelease siya'g debut album ug nidaog sa Box Office Entertainment Award. Active gihapon sa TV series. Bisag American-Filipino, duna siyay koneksyon sa Bisaya music, sama sa 'Kasing Kasing' kauban si Juan Karlos.",
        bisayaSongs: [
            { title: 'Kasing Kasing (Live Performance) ft. juan karlos', videoId: 'PVgH0K9J6eg' }
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/@KyleEcharriOfficial',
            instagram: 'https://www.instagram.com/kyleecharri/'
        }
    },
    {
        id: 'janine-berdin',
        name: 'Janine Berdin',
        coverArt: 'https://i.scdn.co/image/ab6761610000e5ebcb00f94051db52a48179a88c',
        spotifyLink: 'https://open.spotify.com/artist/4qPhnQfRgdgcZEdXgENOnr',
        location: 'Lapu-Lapu City, Cebu',
        longDesc: "Si Janine Berdin, garbo sa Lapu-Lapu City, Cebu, Grand Champion sa Tawag ng Tanghalan. Iyahang single nga 'Mahika' with Adie ni-reach sa No. 1 sa Billboard Philippines Songs chart. Human sa hiatus, nirelease siya'g 'Sitwasyonship' ug 'Alas Dos Na!!!' isip independent artist. Iyahang mga kanta, puno sa 'feels' ug garbo sa Bisaya!",
        bisayaSongs: [
            { title: 'Bulalakaw (Music Video) feat. Joanna Ang', videoId: 'YI3c8bOQ46Q' }
        ],
        socialLinks: {
            youtube: 'https://www.youtube.com/@JanineBerdinOfficial',
            instagram: 'https://www.instagram.com/janineberdin/'
        }
    }
];