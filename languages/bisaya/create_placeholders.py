import os

# --- Paste your JavaScript data here, converted to Python syntax ---
# Main changes:
# - `const variableName = [...]` becomes `variable_name = [...]`
# - JavaScript objects `{ key: value }` become Python dictionaries `{ 'key': value }` (keys often need quotes)
# - `//` comments become `#` comments
# - No trailing semicolons

bisaya_creators = [
    # --- Main Talk Show Hosts / Highly Featured ---
    {
     'id': 'chito-samontina',
        'name': 'Chito Samontina',
        'profilePic': 'images/creators/chito_samontina.jpg',
        'altText': 'Chito Samontina - Bisaya Talk Show Host',
        'categoryTags': ['talkshow', 'interview', 'comedy', 'lifestyle'],
        'regionTag': 'Davao',
        'platformTags': ['youtube', 'facebook', 'instagram', 'tiktok'],
        'shortHook': "Ang 'King of Talk' sa Kabisay-an!",
        'longDesc': "Si Chito Samontina, nailhan sa iyang sikat nga programang 'CHITchat, Ato Ni!', diin ga-interview siya'g lain-laing mga Bisdak personalities gikan sa Visayas ug Mindanao. Ang iyang style, natural kaayo ug relatable, mao nga daghan gyud ang nagsuporta. Gikan sa mga sikat nga artista hangtod sa mga ordinaryong tawo nga naay talagsaong estorya, naa tanan kang Chito! Usa siya sa mga nag-una sa pag-promote sa Binisaya online.",
        'mainFeaturedVideo': {
            'videoId': 'sXuO5B4z1vA',
            'title': 'CHITchat with Lucy Torres-Gomez'
        },
        'playlistHighlights': [
            { 'videoId': 'QKkOazG_y2o', 'title': 'CHITchat with Brenda Mage + House and Farm Tour', 'thumbnailUrl': 'https://i.ytimg.com/vi/QKkOazG_y2o/mqdefault.jpg' },
            { 'videoId': 'JdVs58hve2w', 'title': 'CHITchat with Kuya JY (Dongkoy ug Togbens)', 'thumbnailUrl': 'https://i.ytimg.com/vi/JdVs58hve2w/mqdefault.jpg' },
            { 'videoId': 'SNaZkaCwA-s', 'title': 'CHITchat with Richard Gomez', 'thumbnailUrl': 'https://i.ytimg.com/vi/SNaZkaCwA-s/mqdefault.jpg' },
            { 'videoId': '_8hdBxyLpq0', 'title': 'CHITchat with Yamyam Gucong', 'thumbnailUrl': 'https://i.ytimg.com/vi/_8hdBxyLpq0/mqdefault.jpg' }
        ],
        'fullPlaylistUrl': 'https://www.youtube.com/playlist?list=PLLedfUucAwZL3H3hsjZAjhZCWQUCp5JYd',
        'socialLinks': {
            'youtube': 'https://www.youtube.com/@ChitoSamontina',
            'facebook': 'https://www.facebook.com/chitosamontina',
            'instagram': 'https://www.instagram.com/chitosamontina',
            'tiktok': 'https://www.tiktok.com/@chitosamontinastudios',
            'website': 'chitosamontinastudios.com'
        }
    },
    {
        'id': 'kuan-on-one-melai',
        'name': 'Kuan on One (Melai Cantiveros)',
        'profilePic': 'images/creators/melai_cantiveros.jpg',
        'altText': 'Melai Cantiveros - Host of Kuan on One',
        'categoryTags': ['talkshow', 'comedy', 'interview'],
        'regionTag': 'Gensan',
        'platformTags': ['youtube'],
        'shortHook': "Puro chika, puro lingaw uban ni Kuantie Melai!",
        'longDesc': "Ang 'Kuan on One' with Kuantie Melai Cantiveros-Francisco, ang labing unang mainstream talk show sa Binisaya! Kada episode, lain-laing sikat nga Bisaya-speaking celebrity guests ang iyang maka-chika. Natural kaayo ang dagan sa estorya, puno sa katawa, ug Bisdak pride. Produced by ABS-CBN Studios.",
        'mainFeaturedVideo': {
            'videoId': '6ZpStgdGwvs',
            'title': 'Kuan on One with Kim Chiu'
        },
        'playlistHighlights': [
            { 'videoId': '20EBklv1jDs', 'title': 'FELIP: “Kuantie Melai, pwede ko mangihi?”', 'thumbnailUrl': 'https://i.ytimg.com/vi/20EBklv1jDs/mqdefault.jpg' },
            { 'videoId': 'oReU887jI-U', 'title': 'BINI AIAH: "Kanus-a man ta mag-boom..."', 'thumbnailUrl': 'https://i.ytimg.com/vi/oReU887jI-U/mqdefault.jpg' },
            { 'videoId': 'KdO3Khe0xtg', 'title': 'BINI Colet: "Mao to ang pinaka-intense..."', 'thumbnailUrl': 'https://i.ytimg.com/vi/KdO3Khe0xtg/mqdefault.jpg' },
            { 'videoId': 'SbTl17kZZuU', 'title': 'KZ TANDINGAN & TJ MONTERDE: Kinsa ba ning...', 'thumbnailUrl': 'https://i.ytimg.com/vi/SbTl17kZZuU/mqdefault.jpg' }
        ],
        'fullPlaylistUrl': 'https://www.youtube.com/playlist?list=PLPcB0_P-Zlj78aoUWsRdspPIujw9TiZ_9',
        'socialLinks': {
            'youtube_playlist': 'https://www.youtube.com/playlist?list=PLPcB0_P-Zlj78aoUWsRdspPIujw9TiZ_9',
            'youtube_channel': 'https://www.youtube.com/@abscbnentertainment'
        }
    },
    # --- Learning Focused ---
    {
        'id': 'bisayang-panda',
        'name': 'Bisayang Panda',
        'profilePic': 'https://yt3.googleusercontent.com/CAjicOufEHeCr0oxqwZ9PFGdqfUtsCo8SUoVmxas1vKPXX9ZmoH_jp1ZFw5wA4WFB8M04kdx8Q=s900-c-k-c0x00ffffff-no-rj', # This is a URL, script will try to make folders from it.
        'altText': 'Bisayang Panda - Cebuano Language Teacher',
        'categoryTags': ['learning', 'education', 'culture'],
        'regionTag': 'Davao',
        'platformTags': ['youtube', 'facebook', 'instagram', 'tiktok', 'kofi', 'linktree', 'quizlet'],
        'shortHook': 'Imong Bisaya learning buddy!',
        'longDesc': "Si Bisayang Panda, gikan sa Davao, hilig kaayo niya ang pagtudlo'g Cebuano/Bisaya sa moderno ug dali masabtan nga paagi. Perfect para sa mga beginners o sa gusto lang mo-refresh sa ilang Bisaya. Klaro ug kumpleto iyang mga lessons, ug active sad siya sa lain-laing platforms para sa mga learners.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/lI4ZB8OYXcs', 'title': '01 BASICS: What is Cebuano Language?' },
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/S_7ppqxCToA', 'title': '09 BASICS: Learn Days and Months' }
        ],
        'socialLinks': {
            'youtube': 'https://www.youtube.com/@BisayangPanda',
            'facebook': 'https://www.facebook.com/BisayangPanda',
            'instagram': 'https://www.instagram.com/BisayangPanda',
            'tiktok': 'https://www.tiktok.com/@bisayangpanda.ph',
            'kofi': 'https://ko-fi.com/bisayangpanda',
            'linktree': 'https://linktr.ee/bisayangpanda',
            'quizlet': 'https://quizlet.com/BisayangPanda'
        }
    },
    # --- Food & Lifestyle Creators ---
    {
        'id': 'bite-king',
        'name': 'Bite King (James Torres)',
        'profilePic': 'https://p16-common-sign-va.tiktokcdn-us.com/tos-maliva-avt-0068/da42ddfebc080e0cd4dde9950b56d815~tplv-tiktokx-cropcenter:720:720.jpeg?dr=9640&refresh_token=36ba4df8&x-expires=1747677600&x-signature=AaYKhbJxXpLgTHtnPcy79yAOSoM%3D&t=4d5b0474&ps=13740610&shp=a5d48078&shcp=81f88b70&idc=useast5', # This is a URL
        'altText': 'Bite King - Bisaya Food Vlogger',
        'categoryTags': ['food', 'mukbang', 'lifestyle'],
        'regionTag': 'Cebu/Tagum',
        'platformTags': ['youtube', 'facebook', 'tiktok'],
        'shortHook': 'Mukbang King nga humble ug gwapo!',
        'longDesc': "Si James Torres, a.k.a. Bite King, sikat sa iyang mga food vlogs ug mukbang. Gikan Tagum pero pirmi sad makit-an sa Cebu. Bisag gikan sa परिवार nga kaya, down-to-earth kaayo ug relatable iyang dating. Maka-laway iyang mga video, pramis! Ug kamao sad mo-kanta.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/o5cupFwVyf4', 'title': 'CHITchat + House Tour with Bite King (by Chito Samontina)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/BiteKingPH.Official/videos/603616982037085', 'title': 'Rada' }
        ],
        'socialLinks': {
            'youtube': 'https://www.youtube.com/@jamesboyyy',
            'facebook': 'https://www.facebook.com/BiteKingPH.Official',
            'tiktok': 'http://www.tiktok.com/@jamesboyyy'
        }
    },
    {
        'id': 'ms-cynthia',
        'name': 'Ms. Cynthia (Cynthia Alambatin)',
        'profilePic': 'https://yt3.googleusercontent.com/ZiF-gyi7IqKI7NrXT6ImT_viUMUXxBLA2YJBrPYrH9TWCtxiyM1O5aUScJCVR2cew43VkJluUJ8=s160-c-k-c0x00ffffff-no-rj', # This is a URL
        'altText': 'Ms. Cynthia - Boholana Cooking & Lifestyle Vlogger',
        'categoryTags': ['cooking', 'lifestyle', 'provincial'],
        'regionTag': 'Bohol',
        'platformTags': ['facebook', 'youtube'],
        'shortHook': 'Simple provincial cooking gikan sa Bohol.',
        'longDesc': "Si Ms. Cynthia, Bol-anon nga content creator, nagpakita sa yano ug tinuod nga kinabuhi sa probinsya. Sikat iyang mga cooking videos, labi na mga pagkaong Bol-anon. Simple iyang style pero maka-relate kaayo ug makadasig. Makita nimo ang ka-charming sa countryside living.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/aMrRtl_TvKY', 'title': 'CHITchat with Ms. Cynthia (by Chito Samontina)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/mscynthia0325/videos/1199791627291849', 'title': 'Ganap before byaheng norte!' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/mscynthia0325',
            'youtube': 'https://www.youtube.com/channel/UCFBnv0lABx-ZQFjQmgzBOuw'
            'tiktok': 'https://www.tiktok.com/@ms_cynthia25'
        }
    },
    {
        'id': 'lk-fam',
        'name': 'LK Fam (Laag Kagay-an)',
        'profilePic': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2kIrUCWij1tCzJrRgabPWrdETI000IPN8gA&s', # This is a URL
        'altText': 'LK Fam - Cagayan de Oro Food and Travel',
        'categoryTags': ['travel', 'food', 'vlog'],
        'regionTag': 'CDO',
        'platformTags': ['tiktok', 'facebook'],
        'shortHook': 'Laag ug kaon sa Cagayan de Oro!',
        'longDesc': "Ang LK Fam, o Laag Kagay-an, magdala nimo sa mga nindot nga lugar ug lamian nga pagkaon sa Cagayan de Oro ug sa palibot. Kung nangita ka'g bag-ong laaganan or kan-anan sa CDO, sila ang sakto nimo nga giya!",
        'videoEmbeds': [
            { 'type': 'facebook', 'url': 'https://www.facebook.com/laagkagayan/videos/1150021502780335', 'title': 'Karenderya Serye: Maranao Food' }
        ],
        'socialLinks': {
            'tiktok': 'https://www.tiktok.com/@laagkagayan',
            'facebook': 'https://www.facebook.com/laagkagayan',
        }
    },
    # --- Comedy, Skits, Vlogs & Personalities ---
    {
        'id': 'al-moralde',
        'name': 'Al Moralde',
        'profilePic': 'https://viberate-upload.ams3.cdn.digitaloceanspaces.com/prod/entity/artist/al-moralde-SSo6y', # This is a URL
        'altText': 'Al Moralde - Bisaya Musician and Content Creator',
        'categoryTags': ['music', 'vlog', 'comedy', 'skit'],
        'regionTag': 'Cebu',
        'platformTags': ['youtube', 'facebook', 'instagram'],
        'shortHook': 'Original Bisaya music ug lingaw nga vlogs!',
        'longDesc': "Si Al Moralde kay usa ka Cebuano musician ug content creator. Nailhan siya sa iyang mga Bisaya nga kanta sama sa 'Bright Man Unta Ka' ug 'USB'. Naa sad siyay mga vlogs ug ni-star pa sa Bisaya film nga 'Associate'. Chill ug creative iyang style, tatak Bisdak!",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/zaiKzzUF6As', 'title': 'CHITchat with Al Moralde (by Chito Samontina)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/almoraldepage/videos/1364176408190781', 'title': 'Nag-tuo mo nga ma-palit ako’ng botar? 😡😤💸' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/almoraldepage',
            'instagram': 'https://www.instagram.com/almoralde/',
            'youtube': 'https://www.youtube.com/@AlMoralde'
        }
    },
    {
        'id': 'dansoy-vlogs',
        'name': 'Dansoy Vlogs (Dan Colanse)',
        'profilePic': 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2wTbG4wxIWI75sEL9HhyAdm83w3FElHIIfw&s', # This is a URL
        'altText': 'Dansoy Vlogs - Bisaya Comedy and Lifestyle Vlogger',
        'categoryTags': ['comedy', 'lifestyle', 'vlog'],
        'regionTag': 'Cebu',
        'platformTags': ['facebook', 'tiktok', 'youtube'],
        'shortHook': 'Komedya ug laag with BisayaSquad!',
        'longDesc': "Si Dansoy, o Dan Colanse, sikat sa iyang mga kataw-anang vlogs ug isip miyembro sa BisayaSquad. Gikan Bohol pero based na sa Cebu. Ang iyang content, puno sa humor ug adlaw-adlaw nga mga panghitabo. Nagsugod siya sa TikTok hangtod na-discover ni Roy Ucat (Medyo Maldito).",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/uwI4ll9HEMw', 'title': 'CHITchat with Bisaya Squad (Dansoy & Glester)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fdancolanse%2Fvideos%2F1827658264379628%2F&show_text=false&width=560', 'title': 'Dansoy Vlog with BINI' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/dancolanse',
            'tiktok': 'https://www.tiktok.com/@dansoyofficial',
            'youtube': 'https://www.youtube.com/channel/UC[DANSOY_YT_CHANNEL_ID]'
        }
    },
    {
        'id': 'mommy-jupeta',
        'name': 'Mommy Jupeta (Jupiter Dionaldo)',
        'profilePic': 'images/creators/mommy_jupeta_placeholder.jpg',
        'altText': 'Mommy Jupeta - TikTok Queen of Q&A',
        'categoryTags': ['comedy', 'q&a', 'lifestyle', 'inspirational'],
        'regionTag': 'Lanao del Norte',
        'platformTags': ['tiktok', 'facebook'],
        'shortHook': "Ang 'Queen of Q&A' sa TikTok! Inosente pero witty!",
        'longDesc': "Si Mommy Jupeta, o Jupiter Dionaldo, gikan sa Lanao del Norte, naila sa iyang 'bugal-bugal' Q&A sessions sa TikTok. Bisag puno sa komedya, ang iyang kinabuhi naay mga kalisod nga iyang nalampasan. Karon, social work student na siya para makatabang pa sa uban. Grabe ka-resilient ug inspiring!",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/lcoKMHekN4g', 'title': 'CHITchat Ato Ni! - Mommy Jupeta (by Chito Samontina)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/100064105172456/videos/1030733518541071', 'title': 'Mommy Jupeta - Chito Interview Snippet (FB)' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/profile.php?id=100064105172456',
            'tiktok': 'https://www.tiktok.com/@mommyjupetaofficial'
        }
    },
    {
        'id': 'boi-bisaya',
        'name': 'Boi Bisaya (Norman Manuel May)',
        'profilePic': 'images/creators/boi_bisaya_placeholder.jpg',
        'altText': 'Boi Bisaya - German Speaking Fluent Bisaya',
        'categoryTags': ['comedy', 'prank', 'vlog', 'food'],
        'regionTag': 'Cebu',
        'platformTags': ['facebook', 'tiktok', 'youtube'],
        'shortHook': 'German nga mas Bisaya pa nimo mo-prank!',
        'longDesc': "Si Norman, a.k.a. Boi Bisaya, usa ka German national nga nagdako sa Lapu-Lapu City, Cebu. Grabe ka-fluent mo-Binisaya! Sikat iyang mga prank videos diin magpaka-aron ingnon siya nga turista nya kalit lang mo-Bisaya. Funny sad iyang food vlogs. Karon, permanente na siya sa Pinas ug naay planong business uban iyang fiancée.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/9jjKj4_cC0U', 'title': 'CHITchat with Boi Bisaya (by Chito Samontina)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/watch/?v=2091535287915995', 'title': 'Daghanag topics oe. lingaw jud basta kuyog pamilya😎' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/boi.bisaya',
            'tiktok': 'https://www.tiktok.com/@boibisaya_official',
            'youtube': 'https://www.youtube.com/channel/UCIQe7FouXz8HK5uuML7kz5g'
        }
    },
    {
        'id': 'glester-capuno',
        'name': 'Glester Capuno',
        'profilePic': 'images/creators/glester_capuno_placeholder.jpg',
        'altText': 'Glester Capuno - BisayaSquad Vlogger',
        'categoryTags': ['lifestyle', 'vlog', 'comedy', 'family'],
        'regionTag': 'Cebu',
        'platformTags': ['facebook', 'youtube', 'instagram'],
        'shortHook': 'Gikan sa pagka-seaman, karon vlogger na!',
        'longDesc': "Si Glester Capuno, kanhi seaman (engineer), karon full-time vlogger na ug parte sa BisayaSquad. Kasagaran kauban niya iyang igsoon nga si Japet ('Capuno Brothers'). Ang iyang journey, inspiring kaayo, nagpakita nga pwede gyud i-pursue ang passion ug magbag-o ang kinabuhi.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/uwI4ll9HEMw', 'title': 'CHITchat with Bisaya Squad (Glester & Dansoy)' },
           { 'type': 'facebook', 'url': 'https://www.facebook.com/glestergcapuno/videos/1143972586889164', 'title': 'Namunga naman diay among Chicharo (Sweet Pea)' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/glestergcapuno',
            'youtube': 'https://www.youtube.com/channel/UCTByS3360RI6lqiAI7A3TJA',
            'instagram': 'https://www.instagram.com/glestergcapuno/',
            'tiktok':'https://www.tiktok.com/@glestercapuno',
        }
    },
    {
        'id': 'bridgette-jason-ik',
        'name': 'Bridgette & Jason IK',
        'profilePic': 'images/creators/bridgette_jason_ik_placeholder.jpg',
        'altText': 'Bridgette & Jason IK - Bisaya Couple Vloggers',
        'categoryTags': ['comedy', 'couple', 'vlog', 'skit'],
        'regionTag': 'Cebu City',
        'platformTags': ['facebook', 'youtube'],
        'shortHook': 'Couple goals, Bisdak style!',
        'longDesc': "Sila Bridgette ug Jason IK, sikat sa ilang mga funny ug relatable nga couple vlogs ug skits. Base sa Cebu City, ang ilang content kay 'Way buwagay bahalag mag away!' - puro good vibes ug katawa. Daghan silag followers ug highly recommended!",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/Bav1aWWzJjo', 'title': 'Sample YouTube Video' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/watch/?v=1039626997659565', 'title': 'First time nako mag selos' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/profile.php?id=100081281247966',
            'tiktok': 'https://www.tiktok.com/@jasonik',
           
        }
    },
    {
        'id': 'james-ucat',
        'name': 'James Ucat (BaristaBoy Jimboy)',
        'profilePic': 'images/creators/james_ucat_placeholder.jpg',
        'altText': 'James Ucat - BaristaBoy Jimboy',
        'categoryTags': ['lifestyle', 'vlog', 'coffee'],
        'regionTag': 'Cebu City',
        'platformTags': ['facebook'],
        'shortHook': 'Imong friendly Cebuano BaristaBoy!',
        'longDesc': "Si James Ucat, nailhan sad as BaristaBoy Jimboy, usa ka video creator based sa Cebu City. Chill lang iyang mga vlogs, kasagaran about sa iyang adlaw-adlaw nga kinabuhi ug mga laag.",
        'videoEmbeds': [
            { 'type': 'facebook', 'url': 'https://www.facebook.com/jamesucat9/videos/642255698806565', 'title': 'Gisumbong ni Mama si Clingy Sister! 😡' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/jamesucat9',
            'tiktok':'https://www.tiktok.com/@jamesucat',
        }
    },
    {
        'id': 'nikaragwa-official',
        'name': 'Nikaragwa Official (Niko Lusac)',
        'profilePic': 'images/creators/nikaragwa_placeholder.jpg',
        'altText': 'Nikaragwa Official - Creative Bisaya Vlogger',
        'categoryTags': ['comedy', 'skit', 'cooking', 'lifestyle'],
        'regionTag': 'Bukidnon',
        'platformTags': ['youtube', 'facebook', 'tiktok'],
        'shortHook': "Creative kaayo! 'Lupad-lupad' & 'Peke Prutas' master!",
        'longDesc': "Si Niko Lusac, a.k.a. Nikaragwa Official, gikan sa Bukidnon, grabe ka-creative! Sikat iyang 'lupad-lupad' videos, 'peke prutas' skits, ug mga engaging cooking content. Nag-viral siya during pandemic ug nakapatukod na og kaugalingong balay. Truly inspiring!",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/XUei4auZWsc', 'title': 'CHITchat with Nikaragwa Official (by Chito Samontina)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/watch/?v=1682328202353604', 'title': 'Grabe ka CRISPY SA LECHON BELLY, maniudto! 🥳' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/nikaragwaOfficial',
            'youtube': 'https://www.youtube.com/c/NikaragwaVLOGS11',
            'tiktok': 'https://www.tiktok.com/@nikaragwaofficial'
        }
    },
    {
        'id': 'joseph-sabello',
        'name': 'Joseph Sabello (Rich Isog)',
        'profilePic': 'images/creators/joseph_sabello_placeholder.jpg',
        'altText': 'Joseph Sabello - Rich Isog - Ungark King',
        'categoryTags': ['comedy', 'skit', 'inspirational', 'lifestyle'],
        'regionTag': 'Cebu',
        'platformTags': ['youtube', 'facebook'],
        'shortHook': "Ang 'Ungark King' nga naay 'street knowledge' ug inspirasyon!",
        'longDesc': "Si Joseph Sabello, nailhan isip 'Rich Isog' ug ang 'Ungark King', usa sa mga 'Pandemic Stars'. Ang iyang journey, 'rags-to-riches' gyud. Gikan sa 'Chuy Kaayo Ka Si Oe' nga nag-viral, nag-evolve iyang content ngadto sa mas inspirational messages. Naa siyay merchandise line nga 'UA' (Underground Apparel).",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/F68RIk71KUg', 'title': 'CHITchat with Joseph "Ungart" Sabello (by Chito Samontina)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/watch/?v=602583582491558', 'title': 'lets say lang mao na..' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/josephsabellofficial',
            'youtube': 'https://www.youtube.com/@josephsabello/featured',
            'instagram': 'https://www.instagram.com/josephsabello/',
            'tiktok': 'https://www.tiktok.com/@josephsabello2.0',

        }
    },
    {
        'id': 'tats-vlog',
        'name': 'Tats Vlog (Tatzhiana)',
        'profilePic': 'images/creators/tats_vlog_placeholder.jpg',
        'altText': 'Tats Vlog - Bisaya Vlogger',
        'categoryTags': ['vlog', 'lifestyle', 'comedy'],
        'regionTag': 'Unknown',
        'platformTags': ['facebook', 'youtube'],
        'shortHook': "Adlaw-adlaw nga kinabuhi, Bisaya style.",
        'longDesc': "Si Tats Vlog (Tatzhiana) mag-share sa iyang adlaw-adlaw nga kasinatian ug mga lingaw-lingaw sa iyang mga vlogs. Relatable ug simple iyang content, perfect para sa mga gusto lang mo-chill.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/NujQrb8Zdgw', 'title': 'CHITchat with Tats Vlog (by Chito Samontina)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/Tatzhiana06/videos/3153988568073874', 'title': 'seven seas' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/Tatzhiana06',
            'youtube': 'https://www.youtube.com/channel/UC[TATS_YT_CHANNEL_ID]'
        }
    },
    {
        'id': 'papa-vince',
        'name': 'Papa Vince Davao (Vincent Nikkolay Bernales)',
        'profilePic': 'images/creators/papa_vince_placeholder.jpg',
        'altText': 'Papa Vince Davao - Bisaya Character Actor & Vlogger',
        'categoryTags': ['comedy', 'skit', 'vlog'],
        'regionTag': 'Davao',
        'platformTags': ['youtube', 'facebook'],
        'shortHook': "Characters nga tatak Bisdak! 'Linda' to 'Ex-General'.",
        'longDesc': "Si Papa Vince Davao, o Vincent Nikkolay Bernales, sikat sa iyang mga humorous skits diin mag-portray siya'g lain-laing characters sama nila 'Linda' ug 'Ex-General'. Kanhi radio DJ sa Barangay FM, karon full-time content creator ug entrepreneur na. Naa siyay carwash ug spa.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/T5AB9PC1HJA', 'title': 'CHITchat with PapaVince Davao (by Chito Samontina)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/PapaVinceNgDavao/videos/545132164993885', 'title': 'TERROR TEACHER BE LIKE 😅' }
        ],
        'socialLinks': {
            'youtube': 'https://www.youtube.com/channel/UC[PAPAVINCE_YT_CHANNEL_ID]',
            'facebook': 'https://www.facebook.com/PapaVinceNgDavao'
        }
    },
    {
        'id': 'telma-vlog',
        'name': 'Telma',
        'profilePic': 'images/creators/telma_placeholder.jpg',
        'altText': 'Telma - Bisaya Short Skit Comedian',
        'categoryTags': ['comedy', 'skit', 'shortvideo'],
        'regionTag': 'Unknown',
        'platformTags': ['facebook'],
        'shortHook': 'Quick skits, big laughs! Grabe ka-viral!',
        'longDesc': "Si Telma, grabe ka-sikat sa Facebook tungod sa iyang mga mugbo pero hilariously relatable nga mga comedy skits. Ang iyang 'Buang sa Gugma' ug uban pang videos, minilyon gyud ang views! Simple pero effective iyang style.",
        'videoEmbeds': [
            { 'type': 'facebook', 'url': 'https://www.facebook.com/watch/?v=768367475402397', 'title': 'Telma - Buang sa gugma' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/telmavlog'
            'youtube':'https://www.youtube.com/c/JaimeTVOfficial'
        }
    },
    {
        'id': 'wang-isin',
        'name': 'Wang Ising (Joey Mark Patos)',
        'profilePic': 'images/creators/wang_isin_placeholder.jpg',
        'altText': 'Wang Isin - Bisaya Comedian & Vlogger',
        'categoryTags': ['comedy', 'skit', 'vlog', 'lifestyle'],
        'regionTag': 'Davao',
        'platformTags': ['youtube', 'facebook', 'tiktok'],
        'shortHook': 'Stand-up comic turned vlogging star!',
        'longDesc': "Si Wang Isin, o Joey Mark Patos, gikan sa Davao City, naila sa iyang comedy ug vlogs. Nagsugod isip construction worker, dayon stand-up comedian sa Digos Good Vibes. Ang 'Wang' gikan sa grupo, ang 'Isin' sa iyang character nga tsismosa. Karon, nagtukod na'g balay para sa iyang pamilya.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/ZR5zy_w0L0w', 'title': 'CHITchat with Wang Ising (by Chito Samontina)' },
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/jNIEeVQO9M0', 'title': 'Wang Ising Sample YT Video' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/profile.php?id=100063492860284',
            'youtube': 'https://www.youtube.com/@Trendinggg',
            'tiktok': 'https://www.tiktok.com/@wang_ising'
        }
    },
    {
        'id': 'florame-b',
        'name': 'Florame B. (Florame Burato)',
        'profilePic': 'images/creators/florame_b_placeholder.jpg',
        'altText': 'Florame B - Boholana Vlogger',
        'categoryTags': ['lifestyle', 'vlog', 'comedy', 'inspirational', 'provincial'],
        'regionTag': 'Bohol',
        'platformTags': ['youtube', 'facebook'],
        'shortHook': 'Boholana vlogger nga authentic ug inspiring!',
        'longDesc': "Si Florame B., Bol-anon nga vlogger, sikat sa iyang authentic 'life in the province' content ug distinct Boholano accent. Ang iyang 'pangahoy' video nga naka-gown nag-viral! Nalampasan niya ang thyroid cancer, ug karon breadwinner na sa iyang pamilya. Truly inspiring iyang ka-resilient.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/ZCnhT24Ep6Q', 'title': 'CHITchat with Florame B (by Chito Samontina)' },
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/fx1ytKgHbO8', 'title': 'Florame B Sample YT Video' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/florameB',
            'youtube': 'https://www.youtube.com/c/FlorameBoholana'
        }
    },
    {
        'id': 'lou-neria',
        'name': 'Lou Neria Maestre Putian',
        'profilePic': 'images/creators/lou_neria_placeholder.jpg',
        'altText': 'Lou Neria Maestre Putian - CEO of SY Glow',
        'categoryTags': ['business', 'inspirational', 'lifestyle', 'beauty'],
        'regionTag': 'Bohol/Davao',
        'platformTags': ['facebook', 'tiktok', 'youtube'],
        'shortHook': 'Ang CEO sa SY Glow! From poverty to success.',
        'longDesc': "Si Ma'am Lou Putian, ang CEO ug founder sa SY Glow skincare, naay inspiring 'rags-to-riches' story. Gikan sa kalisod sa Bohol, working student sa Davao, hangtod nahimong successful businesswoman. Ang 'SY' sa iyang brand, gikan sa iyang idol nga si Henry Sy ug iyang anak nga si Yuki.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/hv6W1EqYzYs', 'title': 'CHITchat with SY Glow CEO, Mother Lou (by Chito Samontina)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/watch/?v=624843826824837', 'title': 'TRENDING CAKE HONEST REVIEW' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/louneria.putian',
    
        }
    },
    {
        'id': 'zevie-family',
        'name': 'ZEVIE MOMMY and DADDY (Bugais Family)',
        'profilePic': 'images/creators/zevie_family_placeholder.jpg',
        'altText': 'ZEVIE Mommy and Daddy - Bisdak Family Vloggers',
        'categoryTags': ['family', 'lifestyle', 'vlog', 'kids'],
        'regionTag': 'Unknown',
        'platformTags': ['facebook', 'youtube'],
        'shortHook': 'Ang pinaka-cute nga Bisdak family sa internet!',
        'longDesc': "Ang Bugais family—si Zevie, Mommy Rendell, ug Daddy Fernand—sikat sa ilang heartwarming ug authentic family vlogs. Si Zevie, ang bida, grabe ka-charming ug ka-bright. Gipakita nila ang gugma, acceptance, ug open communication sa ilang pamilya.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/LMK3s3yvbt4', 'title': 'CHITchat with Zevie, Mommy, Daddy (by Chito Samontina)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/100087249034082/videos/680767801299255', 'title': 'Na prank lagi ko uy' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/profile.php?id=100087249034082',
            'tiktok': 'https://www.tiktok.com/@bugais_family'
        }
    },
    {
        'id': 'mikyath-ross',
        'name': 'Mikyath Ross (Michelle Mikyath Rosalyn)',
        'profilePic': 'images/creators/mikyath_ross_placeholder.jpg',
        'altText': 'Mikyath Ross - Bisaya Content Creator, Former Teacher',
        'categoryTags': ['lifestyle', 'personal', 'comedy', 'vlog', 'motherhood'],
        'regionTag': 'Davao/Digos/USA',
        'platformTags': ['youtube', 'facebook'],
        'shortHook': 'Real talk, real life. Inspiring ug funny!',
        'longDesc': "Si Mikyath Ross, igsoon ni Wilbert Ross, naay kaugalingong tingog sa social media. Kanhi maestra, karon US-based content creator ug mama sa duha. Known for her candid and humorous take sa kinabuhi, motherhood, ug personal struggles. Nag-pursue sad siya'g doctorate.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/pXMQdpDTyn4', 'title': 'CHITchat with Mikyath Ross (by Chito Samontina)' },
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/HofWhEtTZWg', 'title': 'Mikyath Ross Sample YT Video' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/profile.php?id=100076028268750',
            'youtube': 'https://www.youtube.com/@mikyathross659'
        }
    },
    {
        'id': 'vonny',
        'name': 'Vonny (Stephen Monesit)',
        'profilePic': 'images/creators/vonny_placeholder.jpg',
        'altText': 'Vonny - Bisaya Podcaster and Content Creator',
        'categoryTags': ['podcast', 'talks', 'lifestyle', 'foodreview', 'shortvideo'],
        'regionTag': 'Bohol',
        'platformTags': ['youtube', 'facebook', 'instagram'],
        'shortHook': 'Small talks, Bisaya podcast, ug food reviews!',
        'longDesc': "Si Vonny, o Stephen Monesit, usa ka Bisaya podcaster (Small talks and Podcast) ug content creator gikan sa Bohol. Nailhan siya sa iyang mga short videos nga minilyon ang views ug mga food reviews sa iyang probinsya. Relatable ug insightful iyang mga discussions.",
        'videoEmbeds': [
            { 'type': 'youtube', 'url': 'https://www.youtube.com/embed/psd9hLvmN-w', 'title': 'Vonny - Ngisi ra gyd tas relasyon sa uban (Popular Short)' },
            { 'type': 'facebook', 'url': 'https://www.facebook.com/watch/?v=1403889547279036', 'title': 'depende sa sitwasyon…' }
        ],
        'socialLinks': {
            'youtube': 'https://www.youtube.com/c/StephenMonesit',
            'facebook': 'https://www.facebook.com/voniexx',
       
        }
    },
    {
        'id': 'taho-man-unofficial',
        'name': 'Taho man - Unofficial',
        'profilePic': 'images/creators/taho_man_placeholder.jpg',
        'altText': 'Taho man - Unofficial Bisaya Comedian',
        'categoryTags': ['comedy', 'reels', 'shortvideo'],
        'regionTag': 'Unknown',
        'platformTags': ['facebook'],
        'shortHook': 'Good vibes lang ta diria mga angkol!',
        'longDesc': "Ang Taho man - Unofficial page maghatag nimo'g good vibes pinaagi sa ilang mga kataw-anang reels ug posts. Simple, direct, ug puro lingaw para sa mga angkol nga gwapo (ug sa tanan!).",
        'videoEmbeds': [
            { 'type': 'facebook', 'url': 'https://www.facebook.com/reel/1153747856547800', 'title': 'Taho Man Sample Reel' }
        ],
        'socialLinks': {
            'facebook': 'https://www.facebook.com/profile.php?id=61559160522490'
        }
    }
]

bisaya_k_dramas = [
    {
        'id': 'true-beauty-bisaya',
        'title': 'True Beauty (Bisaya)',
        'posterSrc': 'https://upload.wikimedia.org/wikipedia/en/7/76/True_Beauty_TV_series_poster.jpg', # This is a URL
        'altText': 'True Beauty K-Drama Bisaya Version Poster',
        'shortSynopsis': "Si Ju Kyung, gi-bully sa iyang looks, ni-transform gamit ang makeup. Pero tago gihapon iyang tinuod nga nawong...",
        'longSynopsis': "Si Ju Kyung kay gi-bully sa eskwelahan tungod sa iyang hitsura. Dili siya ka-fit in. Pag-high school niya, ni-decide siya nga magbag-o gamit iyang makeup skills. Pero, di gihapon siya happy kay kabalo siya nga ang iyang mga bag-ong amigo, ganahan lang niya tungod sa iyang nawong nga naay makeup. Samtang nag-survive siya kada adlaw nga gitago iyang tinuod nga hitsura, naay na-meet nga laki nga naay sad story sad. Nag-comfort sila sa usag-usa ug nangita'g kusog para mubalik sa kalibutan nga ilang gidalagan.",
        'platformLink': 'https://www.viu.com/ott/ph/en/vod/2080292/True-Beauty-Bisaya',
        'platformName': 'Viu'
    },
    {
        'id': 'dots-bisaya',
        'title': 'Descendants of the Sun (Bisaya)',
        'posterSrc': 'images/shows/dots_poster.jpg',
        'altText': 'Descendants of the Sun K-Drama Bisaya Version Poster',
        'shortSynopsis': "Paspas nahigugma si Captain Yoo Si-jin ug Dr. Kang Mo-yeon, pero nabuwag tungod sa trabaho...",
        'longSynopsis': "Paspas nga nahigugma sina Yoo Si-jin, ang captain sa usa sa South Korean Special Forces unit, ug si Dr Kang Mo-yeon, usa ka dedicated nga doctor, apan kinahanglang magbulag tungod sa ilang pagkalainlain sa trabaho ug gituohan. Nagkita sila usab ug nahibal-an nila nga naa pa sila feelings. Ang kini nga drama bahin sa kung giunsa malampasan sa mga batan-ong doktor ug sundalo ang mga kalisud ug gitukod ang ilang mga kalabutan sa layo nga nasud sa Urk.",
        'platformLink': 'https://www.viu.com/ott/ph/en/vod/402888/Descendants-of-the-Sun-Bisaya',
        'platformName': 'Viu'
    },
    {
        'id': 'doom-at-your-service-bisaya',
        'title': 'Doom at Your Service (Bisaya)',
        'posterSrc': 'images/shows/doom_at_your_service_poster.jpg',
        'altText': 'Doom at Your Service K-Drama Bisaya Version Poster',
        'shortSynopsis': "Si Tak Dong Kyung, naay sakit nga di maayo. 100 days na lang, nag-wish siya'g 'doom'...",
        'longSynopsis': "Si Tak Dong Kyung, usa ka babaye nga naay sakit nga dili na maayo. 100 ka adlaw na lang iyang kinabuhi, nag-wish siya sa mga bituon dili para kwarta o kasikatan, apan para sa 'doom' o kalaglagan. Bisag pulong lang to para niya, naminaw ang mga bituon. Usa ka estranghero nga si Myul Mang, nagpakita sa iyang pultahan, nag-ingon nga siya ang kalaglagan sa kalibutan. Kini estorya tali sa babaye nga gusto mabuhi og malipayon sa nahabilin niyang panahon, ug sa lalaki nga nakaagi na sa pinakakangitngit nga 'doom'.",
        'platformLink': 'https://www.viu.com/ott/ph/en/vod/2231198/Doom-at-Your-Service-Bisaya',
        'platformName': 'Viu'
    },
    {
        'id': 'a-beautiful-angel-bisaya',
        'title': 'A Beautiful Angel (Bisaya)',
        'posterSrc': 'images/shows/a_beautiful_angel_poster.jpg',
        'altText': 'A Beautiful Angel Bisaya Version Poster',
        'shortSynopsis': "Si Ayna, modern Islamic woman, naay mga damgo. Nahigugma kang Gus Afif...",
        'longSynopsis': "Isip usa ka moderno nga babaye nga Muslim, si Ayna naay mga damgo nga gusto niyang makab-ot sa kinabuhi. Labi na kay nahigugma siya sa unang higayon kang Gus Afif, usa ka diosnon nga batan-ong lalaki ug tag-iya sa Islamic Boarding School diin nagtuon si Ayna. Apan kung ang mga tawong duol niya naay laing plano, kinahanglan atubangon ni Ayna ang mga hagit para matuman iyang damgo ug mahiusa sa lalaking iyang gipili.",
        'platformLink': 'https://www.viu.com/ott/ph/en/vod/2290138/A-Beautiful-Angel-Bisaya',
        'platformName': 'Viu'
    }
]

bisaya_podcasts = [
    {
        'id': 'barok-takya',
        'title': 'Barok and Takya Bisaya Podcast',
        'coverSrc': 'https://i.scdn.co/image/ab6765630000ba8a03d570c10feff07b3f9fff69', # This is a URL
        'altText': 'Barok and Takya Bisaya Podcast Cover Art',
        'shortDesc': "Lively couple Barok and Takya, talks about Filipino society and culture in Bisaya.",
        'longDesc': "Maminaw ta sa top Filipino Podcast sa Cebuano language, Barok and Takya Bisaya Podcast! Kining bibo nga magtiayon, si Barok ug Takya, maghisgot bahin sa mga butang nga importante sa daghang Pinoy: pamilya, tradisyon, ug kulturang Pinoy. Makalingaw sila nga pares nga makapakatawa nimo samtang magtudlo'g bag-ong insights sa Filipino values.",
        'platformLinks': {
            'apple': 'https://podcasts.apple.com/us/podcast/barok-and-takya-bisaya-podcast-a-filipino-pinoy-podcast/id1445558228',
            'spotify': 'https://open.spotify.com/show/1fqta72GpjeslUAMskhcVr',
            'youtube': 'https://www.youtube.com/@BisayaPodcast',
            'website': 'https://barokandtakya.com/'
        }
    },
    {
        'id': 'dili-ni-advice',
        'title': 'Dili Ni Advice',
        'coverSrc': 'images/podcasts/dili_ni_advice_cover.jpg',
        'altText': 'Dili Ni Advice Podcast Cover Art',
        'shortDesc': "Hosted by Darling and Kringkay, two millennials from Davao City discussing modern society...",
        'longDesc': "Ang Dili Ni Advice kay Bisaya podcast nila Darling ug Kringkay, duha ka millennial gikan sa Davao City. Kada semana, maghisgot sila unsay init—o dili—sa modernong katilingban ug pop culture. Murag chika lang sa imong mga amiga! Relaxed ug relatable kaayo.",
        'platformLinks': {
            'spotify': 'https://open.spotify.com/show/6dz2XDpaUZFi3pfRk1lf5u',
            'website': 'https://www.diliniadvice.com/'
        }
    },
    {
        'id': 'storyang-kinabuhi',
        'title': 'Storyang Kinabuhi (Bisaya Podcast)',
        'coverSrc': 'images/podcasts/storyang_kinabuhi_cover.jpg',
        'altText': 'Storyang Kinabuhi Podcast Cover Art',
        'shortDesc': "Hosted by Ador Flores, talking about life, career, relationships, finances, ug uban pa!",
        'longDesc': "Ang Storyang Kinabuhi kay Bisaya Podcast ni Ador Flores diin maghisgot sila bahin sa kinabuhi, career, relasyon, kwarta, ug uban pa. Mga lawom nga diskusyon ug mga debate nga makapahunahuna gyud nimo og maayo. Great for deep thinking!",
        'platformLinks': {
            'spotify': 'https://open.spotify.com/show/0bFrqG9KLMLWeXK9coEIxD'
        }
    },
    {
        'id': 'bisaya-podcasts-ph',
        'title': 'Bisaya Podcasts PH',
        'coverSrc': 'images/podcasts/bisaya_podcasts_ph_cover.jpg',
        'altText': 'Bisaya Podcasts PH Cover Art',
        'shortDesc': "Aims to unite Bisaya Podcasts around the world. Features long episodes.",
        'longDesc': "Hello! Welcome sa Bisaya Podcasts PH! Lisod mangita og Bisaya podcasts, ug mas lisod mangita og audience. Kini nga podcast, gusto i-unite ang mga Bisaya Podcasts para dali ra ta mag-connect. Usually tag-duha ka oras ang episode, perfect pang-binge!",
        'platformLinks': {
            'spotify': 'https://open.spotify.com/show/2zuMvYQ3F0Vo9RUJR4azyU'
        }
    },
    {
        'id': 'katikaran',
        'title': 'KATIKaran',
        'coverSrc': 'images/podcasts/katikaran_cover.jpg',
        'altText': 'KATIKaran Podcast Cover Art',
        'shortDesc': "Dive into the vibrant world of Bisaya Gen Z stories, dreams, and daily adventures.",
        'longDesc': "Suhira ang madasigon nga kalibutan sa mga Bisaya Gen Z samtang mag-share sila'g mga estorya, damgo, ug adlaw-adlaw nga laag. Gisaulog nila ang atong kultura ug nagtukod og taytayan tali sa mga henerasyon. Join for laughs, insights, and heartwarming tales—tanan sa Binisaya!",
        'platformLinks': {
            'spotify': 'https://open.spotify.com/show/0F2iVfTueC0fFfObZpKLfY'
        }
    },
    {
        'id': 'unsay-cheka-sa-parlor',
        'title': 'Unsa’y Cheka Sa Parlor',
        'coverSrc': 'images/podcasts/unsay_cheka_cover.jpg',
        'altText': 'Unsa’y Cheka Sa Parlor Podcast Cover Art',
        'shortDesc': "Hosted by Lyle Go and Shaneee, inspired by Bisaya gay lingo for 'What's the tea?'",
        'longDesc': "Ang UCSP, o Unsa'y Cheka Sa Parlor?, usa ka podcast inspired sa sikat nga phrase sa Bisaya gay lingo. Hosted by Lyle Go ug Shaneee, murag 'What's the tea?' sa English. Expect lots of fun and juicy chika!",
        'platformLinks': {
            'spotify': 'https://open.spotify.com/show/7nsEse7Qm07RMto0P1ypRP'
        }
    },
    {
        'id': 'pagilok-bisaya',
        'title': 'Pagilok Bisaya The Podcast',
        'coverSrc': 'images/podcasts/pagilok_bisaya_cover.jpg',
        'altText': 'Pagilok Bisaya The Podcast Cover Art',
        'shortDesc': "Mga sugilanon nga binisaya nga nagdala'g pagilok sa imahinasyon. Audio drama.",
        'longDesc': "Pagilok Bisaya! Mga sugilanon nga binisaya nga magdala'g kurog ug pagilok sa inyong imahinasyon. Kini usa ka audio drama podcast, perfect para sa mga ganahan og horror ug true crime type nga mga estorya.",
        'platformLinks': {
            'spotify': 'https://open.spotify.com/show/5oB0tEcvwR0hcLAsVVvw2Q'
        }
    },
    {
        'id': 'sweeto-podcast',
        'title': 'SweeTo - A Bisayang VA Podcast',
        'coverSrc': 'images/podcasts/sweeto_cover.jpg',
        'altText': 'SweeTo - A Bisayang VA Podcast Cover Art',
        'shortDesc': "Tony and his wife, Sween, talking about the life of a Virtual Assistant - raw and unfiltered.",
        'longDesc': "Sila si Tony ug iyang asawa nga si Sween, maghisgot bahin sa kinabuhi sa usa ka Virtual Assistant—raw and unfiltered. Dili sila magduha-duha ug Binisaya na naay gamayng English. Helpful kaayo para sa mga aspiring VAs!",
        'platformLinks': {
            'spotify': 'https://open.spotify.com/show/6mscCzJ9dZWimn4RBoNt4o'
        }
    },
    {
        'id': 'storytelling-with-ziwi',
        'title': 'Storytelling with Ziwi (Bisaya Podcast)',
        'coverSrc': 'images/podcasts/storytelling_ziwi_cover.jpg',
        'altText': 'Storytelling with Ziwi Podcast Cover Art',
        'shortDesc': "A podcast about random stories. Ziwi talks about her personal experiences and life lessons.",
        'longDesc': "Usa ka podcast bahin sa mga random nga estorya. Si Ziwi mag-share sa iyang mga personal nga kasinatian ug mga leksyon sa kinabuhi. Murag chika lang sa imong amiga, #ChikaMinute style. Relaxed ug relatable!",
        'platformLinks': {
            'spotify': 'https://open.spotify.com/show/7KFWNwy1nVxTD3PdrsY0aY'
        }
    },
    {
        'id': 'bisaya-talks',
        'title': 'Bisaya Talks!',
        'coverSrc': 'images/podcasts/bisaya_talks_cover.jpg',
        'altText': 'Bisaya Talks! Podcast Cover Art',
        'shortDesc': "A podcast exclusive to all BisDak people. Talks about life learning experiences nga naay pagka binugoy.",
        'longDesc': "Ang 'Bisaya Talks!' kay podcast para gyud sa tanang BisDak! Maghisgot sila bahin sa mga life learning experiences nga naay sagol pagka-binugoy. Lingaw ug naay makutlo nga pagtulun-an.",
        'platformLinks': {
            'spotify': 'https://open.spotify.com/show/5lONjhRODsBpAepgUFlFh3'
        }
    },
    {
        'id': 'bisdakball',
        'title': 'Bisdakball',
        'coverSrc': 'images/podcasts/bisdakball_cover.jpg',
        'altText': 'Bisdakball Podcast Cover Art',
        'shortDesc': "Storya lang tag basketball ani tibuok adlaw! Para sa mga Bisdak nga adik sa basketball.",
        'longDesc': "Kung adik ka sa basketball sama nako, para gyud ni nimo! Ang Bisdakball kay podcast nga puro hisgot bahin sa basketball, sa Binisaya nga pinulongan. Perfect para sa mga basketball addicts nga Bisdak! Sayang lang kay murag ni-undang na sila, pero ang mga daan nga episodes, sulit gihapon paminawon.",
        'platformLinks': {
            'spotify': 'https://open.spotify.com/show/1452x5Gc965t7pSXEeZPQA'
        }
    }
]


# --- Main Script Logic ---

def create_placeholder_file(file_path):
    """Creates directories and an empty file at the given file_path."""
    if not file_path or file_path.startswith(('http://', 'https://')):
        print(f"Skipping URL or invalid path: {file_path}")
        return

    try:
        # Ensure the path uses OS-specific separators (e.g., \ on Windows, / on Linux/Mac)
        normalized_path = os.path.normpath(file_path)

        # Get the directory part of the path
        directory = os.path.dirname(normalized_path)

        # Create directories if they don't exist
        if directory: # Check if directory string is not empty
            os.makedirs(directory, exist_ok=True)
            print(f"Ensured directory exists: {directory}")

        # Create an empty file (or touch it if it exists)
        with open(normalized_path, 'a') as f:
            pass # 'a' mode creates if not exists, and doesn't truncate
        print(f"Created/Ensured placeholder file: {normalized_path}")

    except OSError as e:
        print(f"Error creating {normalized_path}: {e}")
    except Exception as e:
        print(f"An unexpected error occurred with path {file_path}: {e}")

print("Starting placeholder creation process...")

# Process bisayaCreators
print("\nProcessing bisayaCreators...")
for creator in bisaya_creators:
    if 'profilePic' in creator:
        create_placeholder_file(creator['profilePic'])

# Process bisayaKDramas
print("\nProcessing bisayaKDramas...")
for kdrama in bisaya_k_dramas:
    if 'posterSrc' in kdrama:
        create_placeholder_file(kdrama['posterSrc'])

# Process bisayaPodcasts
print("\nProcessing bisayaPodcasts...")
for podcast in bisaya_podcasts:
    if 'coverSrc' in podcast:
        create_placeholder_file(podcast['coverSrc'])

print("\nPlaceholder creation process finished.")