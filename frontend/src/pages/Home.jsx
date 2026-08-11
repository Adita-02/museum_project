
// src/pages/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';

// ---------- STATIC DATA ----------
// ---------- STATIC DATA ----------
const arts = [
  { id: 1, name: "Narmer Palette", civ: "Ancient Egypt", era: "3200 BCE", desc: "The Narmer Palette depicts the unification of Upper and Lower Egypt under Pharaoh Narmer — one of the most significant finds in Egyptology.", emoji: "🏺", type: "3D", origin: "Cairo, Egypt", mat: "Greywacke stone", mus: "Egyptian Museum, Cairo", r: "africa", img: "https://claudemariottini.com/wp-content/uploads/2011/05/narmer-palet-21.jpg" },
  { id: 2, name: "Mohenjo-daro Priest-King", civ: "Indus Valley", era: "2500 BCE", desc: "A steatite sculpture found at Mohenjo-daro depicting a bearded figure in a decorated robe, possibly a priest or ruler.", emoji: "🗿", type: "AR", origin: "Pakistan", mat: "Steatite", mus: "National Museum of Pakistan", r: "asia", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTB2m0OB6hPQcB1BAuJj26eJkzecGxr09Y9vX7QWBwUEA&s=10" },
  { id: 3, name: "Code of Hammurabi", civ: "Babylon", era: "1750 BCE", desc: "One of the oldest deciphered writings of significant length — a Babylonian law code comprising 282 laws inscribed on a diorite stele.", emoji: "📜", type: "New", origin: "Babylon, Iraq", mat: "Diorite stele", mus: "Louvre Museum, Paris", r: "asia", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlpYTPbuWY4Et1Jn25n79P8r92NPz4wc5NipWc8JsGMQ&s=10" },
  { id: 4, name: "Greek Amphora", civ: "Ancient Greece", era: "530 BCE", desc: "A terracotta amphora painted in the red-figure technique, depicting scenes from Greek mythology with remarkable artistic precision.", emoji: "⚱️", type: "", origin: "Athens, Greece", mat: "Terracotta", mus: "British Museum, London", r: "europe", img: "https://media.istockphoto.com/id/1452226966/photo/an-ancient-greek-amphora-wine-and-grain-storage-vessel.jpg?s=612x612&w=0&k=20&c=dHPIRc0Qnj5s5_yQabsvpdOQjvkvipJQDaBUPouzFkM=" },
  { id: 5, name: "Roman Forum Relief", civ: "Roman Empire", era: "75 BCE", desc: "A detailed marble relief from the Roman Forum depicting scenes of triumphal processions and imperial grandeur at Rome's height.", emoji: "🏛️", type: "VR", origin: "Rome, Italy", mat: "Marble", mus: "Vatican Museums", r: "europe", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT0VC8pi9q7Ss1de3CAPiWFdkYkBuK_m5zhvAVZekUmDLIY10ScYHHO0Ks&s=10" },
  { id: 6, name: "Athenian Tetradrachm", civ: "Ancient Greece", era: "480 BCE", desc: "A silver coin featuring Athena on the obverse and an owl on the reverse — symbol of Athenian wisdom and naval power.", emoji: "🪙", type: "", origin: "Athens, Greece", mat: "Silver", mus: "Numismatic Museum, Athens", r: "europe", img: "https://assets.iflscience.com/assets/articleNo/79189/aImg/83841/ancient-greek-owl-coin-s.jpg" },
  { id: 7, name: "Rosetta Stone", civ: "Ancient Egypt", era: "196 BCE", desc: "Inscribed in three scripts, this stele was the key to deciphering ancient Egyptian hieroglyphs — one of the greatest archaeological breakthroughs.", emoji: "🗿", type: "3D", origin: "Rosetta, Egypt", mat: "Granodiorite", mus: "British Museum, London", r: "africa", img: "https://media.cnn.com/api/v1/images/stellar/prod/221007123240-07-rosetta-stone-british-museum-200-year-anniversary.jpg?c=original" },
  { id: 8, name: "Terracotta Army Warrior", civ: "Qin Dynasty", era: "210 BCE", desc: "One of 8,000+ life-size terracotta soldiers buried with Emperor Qin Shi Huang to protect him in the afterlife.", emoji: "⚔️", type: "AR", origin: "Xi'an, China", mat: "Terracotta", mus: "Museum of Qin Terra-cotta Warriors", r: "asia", img: "https://www.worldhistory.org/img/c/p/2400x1254/7541.jpg" },
  { id: 9, name: "Stonehenge Sarsen Stone", civ: "Neolithic Britain", era: "3000 BCE", desc: "A massive sarsen megalith from Britain's greatest prehistoric monument — aligned with the summer solstice sunrise.", emoji: "🪨", type: "VR", origin: "Wiltshire, England", mat: "Sarsen sandstone", mus: "On-site, Stonehenge", r: "europe", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdtlQDuYDKlyMQjA9wSkRiaAKieROJGCSP3RIA6ATLK5ggYOYYLpVitsLn&s=10" },
  { id: 10, name: "Venus of Willendorf", civ: "Paleolithic", era: "25,000 BCE", desc: "One of the world's oldest known sculptures — a limestone figurine representing early human artistic and spiritual expression.", emoji: "🪆", type: "", origin: "Willendorf, Austria", mat: "Oolitic limestone", mus: "Naturhistorisches Museum, Vienna", r: "europe", img: "https://culturefrontier.com/wp-content/uploads/2023/09/Birth-of-Venus.jpg" },
  { id: 11, name: "Mask of Agamemnon", civ: "Mycenaean", era: "1550 BCE", desc: "A gold funeral mask found at Mycenae by Heinrich Schliemann — believed to belong to a Mycenaean king, possibly Agamemnon.", emoji: "😮", type: "3D", origin: "Mycenae, Greece", mat: "Gold", mus: "National Archaeological Museum, Athens", r: "europe", img: "https://www.arthistoryproject.com/site/assets/files/23902/aegean_civilizations-the_mask_of_agamemnon--1500-trivium-art-history-2.webp" },
  { id: 12, name: "Maya Jade Mask", civ: "Maya", era: "683 CE", desc: "An elaborate jade mosaic funerary mask from the tomb of Pakal the Great at Palenque — a masterpiece of Maya craftsmanship.", emoji: "🎭", type: "3D", origin: "Palenque, Mexico", mat: "Jade mosaic", mus: "National Museum of Anthropology, Mexico", r: "americas", img: "https://sothebys-md.brightspotcdn.com/dims4/default/2749668/2147483647/strip/true/crop/1619x2000+0+0/resize/4096x5060!/quality/90/?url=http%3A%2F%2Fsothebys-brightspot.s3.amazonaws.com%2Fmedia-desk%2Fwebnative%2Fimages%2F09%2F96%2F117ea8464fe8bdae89c4acb558f1%2Fl24264-cg2xq-t1-10.jpg" },
  { id: 13, name: "Aztec Sun Stone", civ: "Aztec", era: "1427 CE", desc: "A massive basalt monolith known as the Aztec Calendar Stone — depicting the five suns of Aztec cosmology. Weighs 24 tons.", emoji: "☀️", type: "AR", origin: "Tenochtitlan, Mexico", mat: "Basalt", mus: "National Museum of Anthropology, Mexico", r: "americas", img: "https://i.pinimg.com/736x/71/d4/a5/71d4a5a130148b5bf8560b04c9115b1e.jpg" },
  { id: 14, name: "Inca Gold Llama", civ: "Inca", era: "1400 CE", desc: "A solid gold llama figurine used as a ritual offering at sacred shrines throughout the Inca Empire in the Andes.", emoji: "🦙", type: "New", origin: "Peru", mat: "Gold", mus: "Larco Museum, Lima", r: "americas", img: "https://ichef.bbci.co.uk/images/ic/1200x675/p01gw87d.jpg" },
  { id: 15, name: "Olmec Colossal Head", civ: "Olmec", era: "900 BCE", desc: "A massive basalt head carved by the Olmec — the earliest major Mesoamerican civilization — depicting rulers with distinctive helmets.", emoji: "🗿", type: "VR", origin: "Veracruz, Mexico", mat: "Basalt", mus: "Jalapa Museum, Mexico", r: "americas", img: "https://cdn.mos.cms.futurecdn.net/646wYi4XcqPmDYaFjMF2hB-1000-80.jpg" },
  { id: 16, name: "Minoan Snake Goddess", civ: "Minoan", era: "1600 BCE", desc: "A faience statuette of a female figure holding snakes, associated with religious rituals of Europe's first advanced civilization.", emoji: "🏺", type: "", origin: "Knossos, Crete", mat: "Faience", mus: "Heraklion Archaeological Museum", r: "europe", img: "https://media.printables.com/media/prints/989679/images/7539539_da391514-1568-4f1e-a9a7-659cdbe485e2_6138e806-6e05-4cbf-89ef-be7db43b99d4/thumbs/inside/1280x960/png/msg.webp" },
  { id: 17, name: "Lucy Fossil", civ: "Australopithecus", era: "3.2 MYA", desc: "The 3.2 million-year-old remains of Australopithecus afarensis, discovered in Ethiopia in 1974 — one of the oldest known hominid fossils.", emoji: "🦴", type: "3D", origin: "Afar Region, Ethiopia", mat: "Bone", mus: "National Museum of Ethiopia", r: "africa", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqUmzhWHT2BRSnTHKYcSqnOPm4WR5Hep-rPq1mDJcoqAaeGYAytSGFfioT&s=10" },
  { id: 18, name: "Great Zimbabwe Birds", civ: "Great Zimbabwe", era: "1100 CE", desc: "Soapstone bird sculptures from the ancient city of Great Zimbabwe — symbols of royal power and national identity.", emoji: "🦅", type: "", origin: "Masvingo, Zimbabwe", mat: "Soapstone", mus: "Great Zimbabwe Monument", r: "africa", img: "https://visitzimbabwe.b-cdn.net/guides/historical-sites/zimbabwe-bird-origin-meaning-museum-1767765335887.jpg" },
  { id: 19, name: "Axum Obelisk", civ: "Axumite Empire", era: "300 CE", desc: "A 24-meter tall granite obelisk from the Kingdom of Axum — marking royal tombs and demonstrating sophisticated engineering.", emoji: "🗿", type: "VR", origin: "Axum, Ethiopia", mat: "Granite", mus: "Axum Archaeological Site", r: "africa", img: "https://study.com/cimages/videopreview/jw681nc8xt.jpg" },
  { id: 20, name: "Mohenjo-daro Dancing Girl", civ: "Indus Valley", era: "2500 BCE", desc: "A bronze statuette of a young dancer — one of the finest examples of Indus Valley metalworking and artistic achievement.", emoji: "💃", type: "3D", origin: "Mohenjo-daro, Pakistan", mat: "Bronze", mus: "National Museum, New Delhi", r: "asia", img: "https://smarthistory.org/wp-content/uploads/2023/03/bourne1860s.jpg" },
  { id: 21, name: "Oracle Bones", civ: "Shang Dynasty", era: "1200 BCE", desc: "The earliest known Chinese writing — inscriptions on turtle shells and ox bones used for divination by Shang kings.", emoji: "🦴", type: "AR", origin: "Anyang, China", mat: "Bone", mus: "National Museum of China", r: "asia", img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9sgDWkNDqddN6Oae4Y2sWZScI_yAfxGu2YUY-3vC3Y-KQOzdtgnPfd5TX&s=10" },
  { id: 22, name: "Persepolis Relief", civ: "Persian Empire", era: "500 BCE", desc: "Intricate stone reliefs from the ceremonial capital of the Achaemenid Empire — depicting delegates bringing tribute from across the empire.", emoji: "🏛️", type: "VR", origin: "Persepolis, Iran", mat: "Limestone", mus: "Persepolis Museum", r: "asia", img: "https://media.istockphoto.com/id/620975756/photo/achaemenid-bas-relief-on-staircase-in-persepolis-of-shiraz.jpg?s=612x612&w=0&k=20&c=jg2lMM7g0pcH4_PadoBuOUiFW2GAc2TTt6aJXE38gaw=" }
];

const civs = [
  {
    name: "Ancient Egypt",
    period: "3100 – 30 BCE",
    image: "https://cdn.britannica.com/39/155939-159-C83534D3/Pyramids-Giza-Cairo-Egypt.jpg", 
    desc: "One of history's longest-lasting civilizations, flourishing along the Nile for 3,000+ years with monumental architecture and hieroglyphic writing.",
    tags: ["Pharaohs", "Hieroglyphs", "Pyramids", "Nile", "Mummification"],
    slug: "ancient-egypt"
  },
  {
    name: "Mesopotamia",
    period: "3500 – 539 BCE",
    image: "https://miro.medium.com/1*4IYpI6Soe5MWN_eIaZFO_w.jpeg",
    desc: "The Cradle of Civilization between the Tigris and Euphrates — birthplace of writing, the wheel, and the first cities.",
    tags: ["Cuneiform", "Ziggurats", "City-States", "Code of Law", "Trade"],
    slug: "mesopotamia"
  },
  {
    name: "Indus Valley",
    period: "3300 – 1300 BCE",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsuBsjr2qieGgV18OgWa4_jDLDXL-K1HoGh3_6Lz0IlTXQPNENO1O4Crc&s=10",
    desc: "A Bronze Age civilization in South Asia featuring remarkably advanced urban planning, drainage, and an undeciphered script.",
    tags: ["Harappa", "Mohenjo-daro", "Urban Planning", "Seals", "Trade"],
    slug: "indus-valley"
  },
  {
    name: "Ancient Greece",
    period: "800 – 146 BCE",
    image: "https://images.twinkl.co.uk/tw1n/image/private/t_630_eco/website/uploaded/unnamed-5-1629805418.jpg",
    desc: "The cradle of Western civilization — democracy, philosophy, theatre, the Olympic Games, and foundations of science and art.",
    tags: ["Democracy", "Philosophy", "Olympics", "Theatre", "Sculpture"],
    slug: "ancient-greece"
  },
  {
    name: "Roman Empire",
    period: "27 BCE – 476 CE",
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwO35YKNmBqM_oX7fA7hsCdKtMK7QUigh5G0ittapdKNeES4XKIVFUlEzAd3Ak8xmmcYMFJWPwl2WYp86PXnon8eBYYzY2vZFVvSX-GhR2wM11Dz6HQmCjhJyow1nQan9SrqO8RD1bq7A/s1600/pax-romana.jpg",
    desc: "At its height, Rome controlled the Mediterranean world. Its legacy of law, Latin, and engineering shaped Western civilization.",
    tags: ["Republic", "Legion", "Engineering", "Law", "Aqueducts"],
    slug: "roman-empire"
  },
  {
    name: "Ancient China",
    period: "2100 – 221 BCE",
    image: "https://i0.wp.com/www.viewofchina.com/wp-content/uploads/2017/02/military-expedition.jpg?fit=880%2C581&ssl=1&w=640",
    desc: "The cradle of East Asian civilization — silk, gunpowder, Confucianism, the Great Wall, and the Terracotta Army.",
    tags: ["Silk Road", "Great Wall", "Confucianism", "Porcelain", "Dynasties"],
    slug: "ancient-china"
  }
];

const euCivs = [
  { name: "Ancient Greece", period: "800 – 146 BCE", icon: "Ω", desc: "The cradle of Western civilization — democracy, philosophy, theatre, the Olympic Games, and foundational works of art.", tags: ["Democracy", "Philosophy", "Olympics", "Theatre", "Sculpture"] },
  { name: "Roman Empire", period: "27 BCE – 476 CE", icon: "SPQR", desc: "At its height, Rome controlled the Mediterranean world. Its legacy — law, Latin, engineering — shaped Western civilization for millennia.", tags: ["Republic", "Legion", "Engineering", "Law", "Aqueducts"] },
  { name: "Minoan Civilization", period: "3000 – 1100 BCE", icon: "⚡", desc: "Europe's first advanced civilization on Crete — sophisticated art, palace complexes, and the undeciphered Linear A script.", tags: ["Palace", "Linear A", "Fresco", "Trade", "Labyrinth"] },
  { name: "Neolithic Europe", period: "7000 – 2000 BCE", icon: "🪨", desc: "The builders of Stonehenge, megalithic tombs, and the first farming communities that transformed the European landscape.", tags: ["Megaliths", "Stonehenge", "Farming", "Burial", "Stone Tools"] }
];

const amCivs = [
  { name: "Maya Civilization", period: "2000 BCE – 1500 CE", icon: "🔺", desc: "One of Mesoamerica's greatest civilizations — advanced writing, mathematics, astronomy, and magnificent stepped pyramids.", tags: ["Pyramids", "Calendar", "Hieroglyphs", "Astronomy", "Jade"] },
  { name: "Aztec Empire", period: "1300 – 1521 CE", icon: "☀️", desc: "A powerful empire at Tenochtitlan, featuring sophisticated urban planning, tribute networks, and the famous Sun Stone calendar.", tags: ["Tenochtitlan", "Sun Stone", "Tribute", "Cacao", "Feathers"] },
  { name: "Inca Empire", period: "1438 – 1533 CE", icon: "🦙", desc: "The largest empire in pre-Columbian America, stretching 4,000 km along the Andes — known for Machu Picchu and remarkable stonework.", tags: ["Machu Picchu", "Quipu", "Gold", "Andes", "Roads"] },
  { name: "Olmec", period: "1500 – 400 BCE", icon: "🗿", desc: "The 'mother culture' of Mesoamerica — creators of colossal stone heads and the art styles that influenced all later civilizations.", tags: ["Colossal Heads", "Jade", "Jaguar", "Ceremonial", "La Venta"] }
];

const afCivs = [
  { name: "Ancient Egypt", period: "3100 – 30 BCE", icon: "𓂀", desc: "One of history's longest-lasting civilizations, flourishing along the Nile for 3,000+ years with monumental architecture and hieroglyphic writing.", tags: ["Pharaohs", "Pyramids", "Hieroglyphs", "Nile", "Mummies"] },
  { name: "Kingdom of Kush", period: "1070 BCE – 350 CE", icon: "𓃀", desc: "A powerful Nubian kingdom that conquered Egypt and ruled as pharaohs of the 25th Dynasty — known for its pyramids at Meroë.", tags: ["Nubia", "Pyramids", "Meroë", "Archers", "Gold"] },
  { name: "Axumite Empire", period: "100 – 940 CE", icon: "👑", desc: "A major trading empire in Ethiopia that adopted Christianity as state religion in the 4th century — famous for its massive obelisks.", tags: ["Obelisks", "Trade", "Christianity", "Ge'ez", "Gold"] },
  { name: "Great Zimbabwe", period: "1100 – 1450 CE", icon: "🦅", desc: "A medieval city of granite towers and walls built without mortar — capital of a powerful trading kingdom in southern Africa.", tags: ["Stone City", "Trade", "Soapstone Birds", "Granite", "Zimbabwe"] },
  { name: "Carthage", period: "814 – 146 BCE", icon: "⚓", desc: "A Phoenician colony in North Africa that became a powerful maritime empire — rival of Rome until its destruction in the Punic Wars.", tags: ["Phoenician", "Hannibal", "Maritime", "Trade", "Purple Dye"] },
  { name: "Nok Culture", period: "1500 BCE – 500 CE", icon: "🎭", desc: "West Africa's earliest known civilization — famous for distinctive terracotta sculptures of human heads and figures.", tags: ["Terracotta", "Sculpture", "Iron Working", "Nigeria", "Figurines"] }
];

const asCivs = [
  { name: "Mesopotamia", period: "3500 – 539 BCE", icon: "𒀭", desc: "The Cradle of Civilization between the Tigris and Euphrates — birthplace of writing, the wheel, and the first cities.", tags: ["Cuneiform", "Ziggurats", "City-States", "Code of Law", "Trade"] },
  { name: "Indus Valley", period: "3300 – 1300 BCE", icon: "𑀩", desc: "A Bronze Age civilization in South Asia featuring remarkably advanced urban planning, drainage, and an undeciphered script.", tags: ["Harappa", "Mohenjo-daro", "Urban Planning", "Seals", "Trade"] },
  { name: "Ancient China", period: "2100 – 221 BCE", icon: "龙", desc: "The cradle of East Asian civilization — silk, gunpowder, Confucianism, the Great Wall, and the Terracotta Army.", tags: ["Silk Road", "Great Wall", "Confucianism", "Porcelain", "Dynasties"] },
  { name: "Persian Empire", period: "550 – 330 BCE", icon: "🦁", desc: "The largest empire of the ancient world — stretching from India to Egypt — known for its system of roads, provinces, and religious tolerance.", tags: ["Achaemenid", "Persepolis", "Royal Road", "Satrapies", "Cyrus"] },
  { name: "Babylonian Empire", period: "1894 – 539 BCE", icon: "⚖️", desc: "A Mesopotamian empire that reached its height under Hammurabi — famous for its law code, the Hanging Gardens, and Ishtar Gate.", tags: ["Hammurabi", "Code of Law", "Ishtar Gate", "Ziggurat", "Astronomy"] },
  { name: "Khmer Empire", period: "802 – 1431 CE", icon: "🏯", desc: "A powerful empire in Southeast Asia that built Angkor Wat — the world's largest religious monument — and dominated much of the region.", tags: ["Angkor Wat", "Hinduism", "Buddhism", "Hydraulics", "Temples"] }
];

const tlEvents = [
  { id: 1, year: "25,000 BCE", ev: "Venus of Willendorf", civ: "Paleolithic", reg: "Europe", desc: "One of the world's oldest sculptures created in Austria — evidence of early human artistic and spiritual expression.", extra: "Over 200 similar Venus figurines have been found across Europe, suggesting widespread cultural exchange and shared beliefs about fertility and the feminine form in prehistoric society.", col: "#6b7280" },
  { id: 2, year: "3500 BCE", ev: "First Writing System", civ: "Sumer", reg: "Asia", desc: "The Sumerians develop cuneiform script in Mesopotamia — humanity's earliest known writing system.", extra: "Cuneiform began as accounting symbols for grain and trade. It evolved into a full writing system capable of recording literature — including the Epic of Gilgamesh, the world's oldest story.", col: "#d97706" },
  { id: 3, year: "3100 BCE", ev: "Unification of Egypt", civ: "Ancient Egypt", reg: "Africa", desc: "Pharaoh Narmer unifies Upper and Lower Egypt, founding one of history's longest-lasting civilizations.", extra: "Egypt would remain a major civilization for over 3,000 years. The Narmer Palette — one of the earliest historical records — depicts this momentous unification event.", col: "#c9a84c" },
  { id: 4, year: "3000 BCE", ev: "Stonehenge Construction", civ: "Neolithic Britain", reg: "Europe", desc: "The first stage of Stonehenge is built in Wiltshire, England. Construction continues for over 1,500 years.", extra: "The sarsen stones weigh up to 25 tons and were transported from 25 miles away. The monument aligns precisely with the summer solstice sunrise — a remarkable feat of prehistoric astronomy.", col: "#9ca3af" },
  { id: 5, year: "2560 BCE", ev: "Great Pyramid of Giza", civ: "Ancient Egypt", reg: "Africa", desc: "Construction of the Great Pyramid of Khufu — the only surviving wonder of the ancient world.", extra: "Contains ~2.3 million stone blocks each weighing 2.5–15 tons. It remained the tallest man-made structure on Earth for 3,800 years. Precision of alignment is within 0.05 degrees.", col: "#c9a84c" },
  { id: 6, year: "2000 BCE", ev: "Maya Civilization Emerges", civ: "Maya", reg: "Americas", desc: "The Maya begin establishing settlements in Mesoamerica — one of humanity's most sophisticated ancient cultures.", extra: "The Maya developed advanced writing, complex calendars (predicting solar eclipses with remarkable accuracy), mathematics including the concept of zero, and cities rivaling ancient Rome in population.", col: "#10b981" },
  { id: 7, year: "1750 BCE", ev: "Code of Hammurabi", civ: "Babylon", reg: "Asia", desc: "King Hammurabi establishes one of history's earliest complete written legal codes — 282 laws on a towering stele.", extra: "Including the principle of 'an eye for an eye', it covers commerce, family law, property, and wages. It represents a crucial early step toward the rule of law and concept of justice.", col: "#d97706" },
  { id: 8, year: "800 BCE", ev: "Greek City-States Rise", civ: "Ancient Greece", reg: "Europe", desc: "The polis system emerges in Greece — eventually producing the world's first democracy in Athens around 508 BCE.", extra: "Athens introduced direct democracy under Cleisthenes. While limited to free male citizens, it was the world's first experiment in self-governance and directly inspired modern democratic systems.", col: "#3b82f6" },
  { id: 9, year: "509 BCE", ev: "Roman Republic Founded", civ: "Roman", reg: "Europe", desc: "Rome transitions from monarchy to republic, establishing the Senate and elected consuls — foundations of Western government.", extra: "The Roman Republic's institutions — the Senate, separation of powers, concepts of citizenship and law — profoundly influenced the founders of the United States and modern democratic republics.", col: "#ef4444" },
  { id: 10, year: "221 BCE", ev: "China Unified", civ: "Qin Dynasty", reg: "Asia", desc: "Qin Shi Huang becomes the first Emperor of China, unifying warring states and standardizing language and currency.", extra: "He ordered the construction of the Great Wall and was buried with over 8,000 life-size terracotta warriors. He standardized weights, measures, and writing — transforming China into a unified civilization.", col: "#f59e0b" },
  { id: 11, year: "900 BCE", ev: "Olmec Colossal Heads", civ: "Olmec", reg: "Americas", desc: "The Olmec carve massive stone heads in Mexico — America's earliest great civilization leaves its iconic mark.", extra: "The 17 known colossal heads stand up to 3.4 meters tall and weigh up to 50 tons. They were carved from single basalt boulders transported 50 miles away — without wheels or metal tools.", col: "#10b981" },
  { id: 12, year: "336 BCE", ev: "Alexander's Conquests", civ: "Macedonia", reg: "Europe", desc: "Alexander the Great begins campaigns that create the largest empire of the ancient world — from Greece to India.", extra: "At just 20 years old, Alexander conquered the Persian Empire, Egypt, and reached modern Pakistan — never losing a single battle. His campaigns spread Greek culture across three continents.", col: "#3b82f6" }
];

const euFacts = [
  '"The Parthenon in Athens was not originally white — it was painted in vivid reds, blues, and golds, making it one of the most colorful buildings of the ancient world."',
  '"The Roman Colosseum could hold 50,000–80,000 spectators with 76 numbered entrances — designed to fill and empty in minutes, rivaling modern stadium engineering."',
  '"Stonehenge predates the Druids by about 2,000 years. Its true builders and exact purpose remain one of archaeology\'s most enduring mysteries."',
  "\"Ancient Greek athletes competed in the Olympics completely naked. The word 'gymnasium' literally means 'school for naked exercise' in Greek.\"",
  '"The Romans built over 400,000 km of roads — enough to circle the Earth 10 times. Many are still in use or visible today across Europe."'
];
const amFacts = [
  '"The Maya independently invented the concept of zero — one of the most important mathematical discoveries in human history — around 350 CE."',
  '"Machu Picchu was built without mortar. The stones fit so precisely that not even a blade of grass can be inserted between them — even after 600 years."',
  '"The Aztec capital Tenochtitlan had a population of 200,000–400,000 — making it larger than any city in 15th century Europe, including London and Paris."',
  '"The Inca built over 40,000 km of roads through the Andes, with a relay runner system that could carry messages 2,500 km in under a week."',
  '"The Olmec invented the Mesoamerican ballgame — played with a solid rubber ball — over 3,000 years ago. Losers (or winners, historians debate) were sometimes sacrificed."'
];
const afFacts = [
  '"The Great Pyramid of Giza was the tallest man-made structure on Earth for over 3,800 years — until the completion of Lincoln Cathedral in England in 1311 CE."',
  '"The Kingdom of Kush, south of Egypt, conquered and ruled Egypt as the 25th Dynasty — black pharaohs who built more pyramids than the Egyptians themselves."',
  '"The Axumite Empire in Ethiopia was one of the first major empires to adopt Christianity as state religion — in the 4th century CE, before Rome."',
  '"Great Zimbabwe\'s massive stone walls were built without mortar — yet have stood for over 700 years. Its name means "houses of stone" in Shona."',
  '"Hannibal of Carthage crossed the Alps with war elephants in 218 BCE — one of the greatest military feats of the ancient world."'
];
const asFacts = [
  '"The Indus Valley city of Mohenjo-daro had a sophisticated water system with over 700 wells and advanced drainage — unmatched until the Roman Empire 2,000 years later."',
  '"The Babylonian king Hammurabi\'s law code (1754 BCE) is one of the oldest deciphered writings of significant length — predating the Ten Commandments by centuries."',
  '"The Terracotta Army of China\'s first emperor includes over 8,000 life-size soldiers, each with unique facial features — no two are exactly alike."',
  '"The Persian Royal Road stretched over 2,500 km from Susa to Sardis — with relay stations that could carry messages in just 7 days, a journey that took 90 days on foot."',
  '"Angkor Wat in Cambodia is the largest religious monument in the world — covering an area 5 times larger than the Vatican City."'
];

// ---------- Helper components ----------
const FactBox = ({ fact, onNext }) => (
  <div className="ffbox bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] rounded-2xl p-10 mt-16 text-center relative overflow-hidden">
    <div className="fflabel text-[9px] tracking-[4px] uppercase text-[var(--gold)] mb-3">⚡ Did You Know?</div>
    <p className="fftext font-['Crimson_Pro',serif] text-xl text-[var(--sand)] leading-relaxed italic max-w-[700px] mx-auto mb-5">{fact}</p>
    <button className="ffbtn px-6 py-2.5 rounded-full text-[10px] tracking-[2px] uppercase border border-[rgba(201,168,76,0.3)] text-[var(--gold)] bg-transparent cursor-none transition-all duration-200 hover:bg-[rgba(201,168,76,0.1)]" onClick={onNext}>Next Fact →</button>
  </div>
);

// ---------- Main Home Component ----------
export default function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const isMounted = useRef(true);

  // --- Loader state ---
  const [loaderVisible, setLoaderVisible] = useState(true);

  // Hide loader after 2.4s
  useEffect(() => {
    const timer = setTimeout(() => setLoaderVisible(false), 2400);
    return () => clearTimeout(timer);
  }, []);

  const getActivePageFromPath = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/gallery') return 'gallery';
    if (path === '/civs') return 'civs';
    if (path === '/timeline') return 'timeline';
    if (path === '/team') return 'team';
    if (path === '/africa') return 'africa';
    if (path === '/asia') return 'asia';
    if (path === '/europe') return 'europe';
    if (path === '/americas') return 'americas';
    return 'home';
  };

  const activePage = getActivePageFromPath();

  // ---------- State ----------
  const [galleryFilter, setGalleryFilter] = useState('All');
  const [gallerySearch, setGallerySearch] = useState('');
  const [tlFilter, setTlFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapPopupOpen, setMapPopupOpen] = useState(false);
  const [mapRegion, setMapRegion] = useState(null);
  const mapContainerRef = useRef(null);
  const [popupMapInstance, setPopupMapInstance] = useState(null);
  const [euFactIndex, setEuFactIndex] = useState(0);
  const [amFactIndex, setAmFactIndex] = useState(0);
  const [afFactIndex, setAfFactIndex] = useState(0);
  const [asFactIndex, setAsFactIndex] = useState(0);

  // ---------- Navigation ----------
  const handlePageChange = (page) => {
    if (page === 'home') navigate('/');
    else if (page === 'gallery') navigate('/gallery');
    else if (page === 'civs') navigate('/civs');
    else if (page === 'timeline') navigate('/timeline');
    else if (page === 'team') navigate('/team');
    else if (page === 'africa') navigate('/africa');
    else if (page === 'asia') navigate('/asia');
    else if (page === 'europe') navigate('/europe');
    else if (page === 'americas') navigate('/americas');
    else navigate('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ---------- Timeline helpers ----------
  const getFilteredTimeline = () => {
    if (tlFilter === 'All') return tlEvents;
    return tlEvents.filter(e => e.reg === tlFilter);
  };

  const toggleTimelineExtra = (id) => {
    const el = document.getElementById(`tlx-${id}`);
    const arr = document.getElementById(`tlarr-${id}`);
    if (el && arr) {
      el.classList.toggle('open');
      arr.textContent = el.classList.contains('open') ? '▼' : '▶';
    }
  };

  const animateTimeline = () => {
    const items = document.querySelectorAll('.tli');
    items.forEach((item, idx) => {
      setTimeout(() => item.classList.add('vis'), idx * 100);
    });
  };

  useEffect(() => {
    if (activePage === 'timeline') {
      setTimeout(animateTimeline, 300);
    }
  }, [activePage]);

  // ---------- Fact navigation ----------
  const nextFact = (region) => {
    if (region === 'eu') setEuFactIndex((prev) => (prev + 1) % euFacts.length);
    else if (region === 'am') setAmFactIndex((prev) => (prev + 1) % amFacts.length);
    else if (region === 'af') setAfFactIndex((prev) => (prev + 1) % afFacts.length);
    else if (region === 'as') setAsFactIndex((prev) => (prev + 1) % asFacts.length);
  };

  // ---------- Map popup ----------
  const openMapPopup = (regionName, regionKey) => {
    setMapRegion({ name: regionName, key: regionKey });
    setMapPopupOpen(true);
    setTimeout(() => {
      if (mapContainerRef.current && window.L) {
        if (popupMapInstance) popupMapInstance.remove();
        const map = window.L.map(mapContainerRef.current).setView([20, 0], 2);
        window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
          attribution: '&copy; OpenStreetMap & CARTO',
          subdomains: 'abcd',
          maxZoom: 18,
        }).addTo(map);
        const markers = getRegionMarkers(regionKey);
        markers.forEach((m) => {
          window.L.marker(m.coords).addTo(map).bindPopup(`<b>${m.name}</b><br>${m.desc}`);
        });
        if (markers.length > 0) {
          const bounds = markers.map((m) => m.coords);
          map.fitBounds(bounds, { padding: [30, 30] });
        }
        setTimeout(() => map.invalidateSize(), 200);
        setPopupMapInstance(map);
      }
    }, 150);
  };

  const closeMapPopup = () => {
    setMapPopupOpen(false);
    if (popupMapInstance) { popupMapInstance.remove(); setPopupMapInstance(null); }
  };

  const getRegionMarkers = (region) => {
    const mapData = {
      africa: [{ coords: [30.0444, 31.2357], name: 'Giza, Egypt', desc: 'Great Pyramids of Giza' }, { coords: [9.0222, 38.7468], name: 'Axum, Ethiopia', desc: 'Kingdom of Axum' }, { coords: [-20.2678, 30.9167], name: 'Great Zimbabwe', desc: 'Ancient City' }, { coords: [36.8065, 10.1815], name: 'Carthage, Tunisia', desc: 'Phoenician Empire' }, { coords: [-0.0236, 37.9062], name: 'Olduvai Gorge, Tanzania', desc: 'Cradle of Humankind' }],
      asia: [{ coords: [30.3753, 69.3451], name: 'Mohenjo-Daro, Pakistan', desc: 'Indus Valley Civilization' }, { coords: [34.3416, 62.203], name: 'Persepolis, Iran', desc: 'Persian Empire' }, { coords: [32.5363, 44.4208], name: 'Babylon, Iraq', desc: 'Babylonian Empire' }, { coords: [34.3416, 108.9398], name: "Xi'an, China", desc: 'Terracotta Army' }, { coords: [13.4125, 103.866], name: 'Angkor Wat, Cambodia', desc: 'Khmer Empire' }],
      europe: [{ coords: [37.9838, 23.7275], name: 'Athens, Greece', desc: 'Ancient Greece' }, { coords: [41.9028, 12.4964], name: 'Rome, Italy', desc: 'Roman Empire' }, { coords: [51.1789, -1.8262], name: 'Stonehenge, England', desc: 'Neolithic Monument' }, { coords: [35.3397, 25.1342], name: 'Knossos, Crete', desc: 'Minoan Civilization' }, { coords: [40.6253, 22.9486], name: 'Thessaloniki, Greece', desc: 'Byzantine Heritage' }],
      americas: [{ coords: [17.222, -89.6237], name: 'Tikal, Guatemala', desc: 'Maya Civilization' }, { coords: [19.6925, -98.8432], name: 'Teotihuacan, Mexico', desc: 'Aztec Empire' }, { coords: [-13.1631, -72.545], name: 'Machu Picchu, Peru', desc: 'Inca Empire' }, { coords: [18.105, -96.15], name: 'La Venta, Mexico', desc: 'Olmec Civilization' }, { coords: [19.427, -99.1276], name: 'Tenochtitlan, Mexico', desc: 'Aztec Capital' }]
    };
    return mapData[region] || mapData.europe;
  };

  // ---------- Render helpers ----------
  const renderArtifactCards = (items) => {
  return items.map((a) => (
    <div
      key={a.id}
      className="ac bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] border border-[rgba(201,168,76,0.15)] rounded-xl overflow-hidden transition-all duration-300 cursor-none relative hover:-translate-y-1.5 hover:border-[rgba(201,168,76,0.4)] hover:shadow-2xl"
      onClick={() => openArtifactModal(a.id)}
    >
      <div className="ai h-[200px] bg-gradient-to-br from-[#1c1510] to-[#2c1e0a] flex items-center justify-center text-7xl relative overflow-hidden">
        <span className="ae absolute top-3 left-3 bg-[rgba(13,11,7,0.85)] border border-[rgba(201,168,76,0.3)] px-2.5 py-1 rounded text-[9px] tracking-[2px] uppercase text-[var(--gold)] z-10 font-['Cinzel',serif]">{a.era}</span>
        {a.type && <span className={`at absolute top-3 right-3 px-2.5 py-1 rounded text-[9px] tracking-[1px] uppercase z-10 font-bold ${a.type === '3D' ? 'bg-[rgba(59,130,246,0.2)] border border-[rgba(59,130,246,0.4)] text-[#93c5fd]' : a.type === 'AR' ? 'bg-[rgba(139,92,246,0.2)] border border-[rgba(139,92,246,0.4)] text-[#c4b5fd]' : a.type === 'New' ? 'bg-[rgba(201,168,76,0.2)] border border-[rgba(201,168,76,0.4)] text-[var(--gold-light)]' : 'bg-[rgba(16,185,129,0.2)] border border-[rgba(16,185,129,0.4)] text-[#6ee7b7]'}`}>{a.type}</span>}

        {/* এখানে real ছবি render হবে, না পেলে emoji fallback */}
        {a.img ? (
          <img
            src={a.img}
            alt={a.name}
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <span
          style={{ fontSize: '72px', display: a.img ? 'none' : 'flex' }}
          className="absolute inset-0 items-center justify-center"
        >
          {a.emoji}
        </span>
      </div>
      <div className="ab p-5">
        <div className="aciv text-[9px] tracking-[3px] uppercase text-[rgba(201,168,76,0.55)] mb-1.5">{a.civ}</div>
        <div className="an font-['Cinzel',serif] text-base text-[var(--gold-light)] font-semibold mb-1.5">{a.name}</div>
        <div className="ad font-['Crimson_Pro',serif] text-sm text-[rgba(212,196,160,0.55)] leading-relaxed mb-4">{a.desc.substring(0, 88)}…</div>
        <div className="am flex justify-between items-center border-t border-[rgba(201,168,76,0.1)] pt-3">
          <span className="adate text-[11px] text-[rgba(212,196,160,0.4)]">{a.era}</span>
          <span className="aorg text-[11px] text-[rgba(212,196,160,0.4)]">{a.origin.split(',')[0]}</span>
          <button className="aact w-8 h-8 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] flex items-center justify-center text-sm transition-all duration-200 cursor-none hover:bg-[rgba(201,168,76,0.2)] hover:border-[var(--gold)]">→</button>
        </div>
      </div>
    </div>
  ));
};

  const renderCivCards = (data) => {
    return data.map((c, idx) => (
      <div
        key={idx}
        className="cc rounded-xl overflow-hidden border border-[rgba(201,168,76,0.15)] transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:border-[rgba(201,168,76,0.4)] hover:shadow-2xl"
      >
        <div
          className="cb2 h-[140px] flex items-end p-5 relative overflow-hidden"
          style={{
            backgroundImage: `url(${c.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#1c1510',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(0,0,0,0.7)] to-transparent" />
          <span className="relative z-10 text-4xl opacity-50">{c.icon}</span>
        </div>
        <div className="cbb p-5 bg-[rgba(20,15,8,0.9)]">
          <div className="cp text-[9px] tracking-[3px] uppercase text-[rgba(201,168,76,0.55)] mb-1.5">{c.period}</div>
          <div className="cn font-['Cinzel',serif] text-xl text-[var(--gold-light)] font-bold mb-2">{c.name}</div>
          <div className="cd font-['Crimson_Pro',serif] text-sm text-[rgba(212,196,160,0.55)] leading-relaxed mb-4">{c.desc}</div>
          <div className="ctags flex gap-1.5 flex-wrap">
            {c.tags.map((tag, i) => (
              <span key={i} className="ctag px-2.5 py-0.5 rounded-full text-[9px] tracking-[1px] uppercase bg-[rgba(201,168,76,0.08)] border border-[rgba(201,168,76,0.2)] text-[rgba(201,168,76,0.6)]">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  const renderTimelineItems = () => {
    const items = getFilteredTimeline();
    return items.map((e) => (
      <div key={e.id} className="tli flex justify-end pr-[calc(50%+48px)] mb-9 relative transition-all duration-500 ease-out" style={{ opacity: 0, transform: 'translateX(-20px)' }}>
        <div className="tldot absolute left-1/2 top-5 w-3.5 h-3.5 rounded-full transform -translate-x-1/2 border-2 border-[var(--bg)] cursor-none transition-transform duration-200 hover:scale-150" style={{ background: e.col, boxShadow: `0 0 0 2px #0d0b07, 0 0 0 3px ${e.col}, 0 0 20px ${e.col}55` }}></div>
        <div className="tlcard bg-[rgba(28,21,16,0.85)] border border-[rgba(201,168,76,0.15)] rounded-xl p-5 max-w-[420px] transition-all duration-300 cursor-none relative overflow-hidden hover:border-[rgba(201,168,76,0.4)] hover:shadow-2xl">
          <div className="tlyear font-['Cinzel',serif] text-xs text-[var(--gold)] mb-1.5 tracking-[2px]">{e.year}</div>
          <div className="tlevent font-['Cinzel',serif] text-lg text-[var(--gold-light)] font-semibold mb-2">{e.ev}</div>
          <div className="tlbody font-['Crimson_Pro',serif] text-sm text-[rgba(212,196,160,0.6)] leading-relaxed">{e.desc}</div>
          <span className="tlcivtag inline-block px-3 py-0.5 rounded-full text-[9px] tracking-[2px] uppercase mt-3 border border-[rgba(201,168,76,0.25)] text-[rgba(201,168,76,0.7)]" style={{ background: `${e.col}18`, borderColor: `${e.col}44`, color: e.col }}>{e.civ} · {e.reg}</span>
          <br/>
          <button className="tlmore mt-3 text-[11px] text-[rgba(201,168,76,0.5)] tracking-[1px] cursor-none bg-transparent border-none p-0 transition-colors duration-200 flex items-center gap-1.5 hover:text-[var(--gold-light)]" onClick={() => toggleTimelineExtra(e.id)}>
            <span id={`tlarr-${e.id}`}>▶</span> Read more
          </button>
          <div className="tlextra hidden mt-3.5 pt-3.5 border-t border-[rgba(201,168,76,0.1)]" id={`tlx-${e.id}`}>
            <p className="font-['Crimson_Pro',serif] text-sm text-[rgba(212,196,160,0.55)] leading-relaxed">{e.extra}</p>
          </div>
        </div>
      </div>
    ));
  };

  // ---------- Modal functions ----------
  const openArtifactModal = (id) => {
    const art = arts.find(a => a.id === id);
    setSelectedArtifact(art);
    setModalOpen(true);
  };
  const closeModal = () => { setModalOpen(false); setSelectedArtifact(null); };

  // ---------- Search modal ----------
  const handleSearchChange = (e) => setSearchQuery(e.target.value);
  const getSearchResults = () => {
    if (searchQuery.length < 2) return [];
    return arts.filter(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.civ.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.era.includes(searchQuery)
    );
  };

  // ---------- Effects with proper cleanup ----------
  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  // Particles
  useEffect(() => {
    const container = document.getElementById('particles');
    if (!container) return;
    const particles = [];
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'ptcl absolute w-[2px] h-[2px] bg-[var(--gold)] rounded-full opacity-0 animate-float';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = 10 + Math.random() * 14 + 's';
      p.style.animationDelay = Math.random() * 12 + 's';
      p.style.width = p.style.height = 1 + Math.random() * 2 + 'px';
      container.appendChild(p);
      particles.push(p);
    }
    return () => {
      particles.forEach(p => {
        if (p && p.parentNode) p.remove();
      });
    };
  }, []);

  // Counters
  useEffect(() => {
    let timers = [];
    const animateCounter = (id, target, suffix = '') => {
      let current = 0;
      const el = document.getElementById(id);
      if (!el) return;
      const step = target / 80;
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          if (isMounted.current) el.textContent = Math.floor(target).toLocaleString() + suffix;
          clearInterval(timer);
        } else {
          if (isMounted.current) el.textContent = Math.floor(current).toLocaleString() + suffix;
        }
      }, 25);
      timers.push(timer);
    };
    const timeout = setTimeout(() => {
      animateCounter('c1', 12400, '+');
      animateCounter('c2', 84);
      animateCounter('c3', 230, '+');
      animateCounter('c4', 18);
    }, 2400);
    return () => {
      clearTimeout(timeout);
      timers.forEach(t => clearInterval(t));
    };
  }, []);

  // Close modals on ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        if (modalOpen) closeModal();
        if (searchModalOpen) setSearchModalOpen(false);
        if (mapPopupOpen) closeMapPopup();
      }
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [modalOpen, searchModalOpen, mapPopupOpen]);

  // ---------- Render ----------
  return (
    <>
      {/* Loader – conditionally rendered */}
      {loaderVisible && (
        <div id="loader" className="fixed inset-0 bg-[#0d0b07] z-[99999] flex flex-col items-center justify-center transition-opacity duration-800">
          <div className="loader-title font-['Cinzel',serif] text-5xl font-black text-[var(--gold-light)] tracking-[8px] animate-pulse">ARCHÆUM</div>
          <div className="loader-sub text-[11px] tracking-[5px] uppercase text-[rgba(201,168,76,0.4)] mt-2">World Museum of Archaeology</div>
          <div className="loader-names flex gap-6 mt-5">
            <span className="loader-name font-['Cinzel',serif] text-[13px] text-[rgba(201,168,76,0.35)] tracking-[3px]">Adita</span>
            <span className="loader-name text-[rgba(201,168,76,0.55)]">✦</span>
            <span className="loader-name font-['Cinzel',serif] text-[13px] text-[rgba(201,168,76,0.35)] tracking-[3px]">Warisa</span>
            <span className="loader-name text-[rgba(201,168,76,0.55)]">✦</span>
            <span className="loader-name font-['Cinzel',serif] text-[13px] text-[rgba(201,168,76,0.35)] tracking-[3px]">Anisa</span>
          </div>
          <div className="loader-bar w-[220px] h-px bg-[rgba(201,168,76,0.15)] mt-9 rounded overflow-hidden">
            <div className="loader-fill h-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent animate-load"></div>
          </div>
        </div>
      )}

      {/* Particles container */}
      <div id="particles" className="fixed inset-0 pointer-events-none z-10 overflow-hidden"></div>

      {/* ========== PAGE CONTENT ========== */}
      <div className="pt-[72px]">
        {/* ===== HOME ===== */}
        <div className={`page-section ${activePage === 'home' ? 'active' : ''}`}>
          <section id="hero" className="min-h-screen bg-[radial-gradient(ellipse_at_30%_60%,rgba(139,74,43,0.15),transparent_60%),radial-gradient(ellipse_at_80%_20%,rgba(201,168,76,0.08),transparent_50%),linear-gradient(160deg,#0d0b07,#1a1208,#0d0b07)] flex items-center justify-center relative overflow-hidden px-10 pt-[100px] pb-16">
            <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-60">
  <source src={`${import.meta.env.BASE_URL}mus.mp4`} type="video/mp4" />
</video>
<div className="absolute inset-0 bg-gradient-to-br from-[rgba(13,11,7,0.55)] via-[rgba(13,11,7,0.35)] to-[rgba(13,11,7,0.55)] z-10"></div>
            <div className="hero-bg absolute font-['Cinzel',serif] text-[220px] font-black tracking-[-10px] text-[rgba(201,168,76,0.03)] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none z-20">ARCHÆUM</div>
            <div className="hc text-center relative z-30 max-w-[900px]">
              <h1 className="ht font-['Cinzel',serif] text-[clamp(40px,7vw,80px)] font-black leading-[1.05] text-transparent bg-gradient-to-br from-[#e8c97a] via-[#c9a84c] via-40% via-[#f0d898] via-70% to-[#a07830] bg-clip-text mb-4 animate-fadeUp">Explore the<br />Ancient World</h1>
              <p className="hs font-['Crimson_Pro',serif] text-[22px] italic text-[var(--papyrus)] opacity-70 mb-12 animate-fadeUp animation-delay-200">Journey through 12,000+ artifacts spanning 5,000 years of human civilization</p>
              <div className="hero-cta flex gap-4 justify-center flex-wrap animate-fadeUp animation-delay-400">
                <button className="btn-gold bg-gradient-to-br from-[var(--gold)] to-[#a07830] text-[#0d0b07] border-none px-8 py-3.5 font-['Cinzel',serif] text-[11px] tracking-[3px] uppercase font-bold rounded transition-all duration-300 shadow-[0_0_30px_rgba(201,168,76,0.2)] hover:-translate-y-0.5 hover:shadow-[0_8px_40px_rgba(201,168,76,0.35)] cursor-none" onClick={() => handlePageChange('gallery')}>Explore Gallery</button>
                <button className="btn-outline bg-transparent text-[var(--gold-light)] border border-[rgba(201,168,76,0.4)] px-8 py-3.5 font-['Cinzel',serif] text-[11px] tracking-[3px] uppercase font-semibold rounded transition-all duration-300 cursor-none hover:border-[var(--gold)] hover:bg-[rgba(201,168,76,0.08)]" onClick={() => handlePageChange('timeline')}>Interactive Timeline</button>
                <button className="btn-outline bg-transparent text-[var(--gold-light)] border border-[rgba(201,168,76,0.4)] px-8 py-3.5 font-['Cinzel',serif] text-[11px] tracking-[3px] uppercase font-semibold rounded transition-all duration-300 cursor-none hover:border-[var(--gold)] hover:bg-[rgba(201,168,76,0.08)]" style={{ borderColor: 'rgba(201,168,76,0.6)', color: 'var(--gold)' }} onClick={() => handlePageChange('team')}>Meet Our Team</button>
              </div>
              <div className="stats-row grid grid-cols-4 gap-px border border-[rgba(201,168,76,0.15)] rounded-lg overflow-hidden mt-16 bg-[rgba(201,168,76,0.06)] animate-fadeUp animation-delay-600">
                <div className="stat p-6 text-center bg-[rgba(13,11,7,0.6)] border-r border-[rgba(201,168,76,0.1)]"><div className="stat-n font-['Cinzel',serif] text-4xl text-[var(--gold-light)] font-bold" id="c1">0</div><div className="stat-l text-[10px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Artifacts</div></div>
                <div className="stat p-6 text-center bg-[rgba(13,11,7,0.6)] border-r border-[rgba(201,168,76,0.1)]"><div className="stat-n font-['Cinzel',serif] text-4xl text-[var(--gold-light)] font-bold" id="c2">0</div><div className="stat-l text-[10px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Civilizations</div></div>
                <div className="stat p-6 text-center bg-[rgba(13,11,7,0.6)] border-r border-[rgba(201,168,76,0.1)]"><div className="stat-n font-['Cinzel',serif] text-4xl text-[var(--gold-light)] font-bold" id="c3">0</div><div className="stat-l text-[10px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Excavation Sites</div></div>
                <div className="stat p-6 text-center bg-[rgba(13,11,7,0.6)]"><div className="stat-n font-['Cinzel',serif] text-4xl text-[var(--gold-light)] font-bold" id="c4">0</div><div className="stat-l text-[10px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Virtual Tours</div></div>
              </div>
            </div>
          </section>

          <section className="sw px-10 max-w-[1400px] mx-auto" style={{ paddingTop: '70px', paddingBottom: '60px' }}>
            <div className="sh text-center mb-16">
              <div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>WHERE HISTORY LIVES<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div>
              <h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">REGIONS OF THE ANCIENT WORLD</h2>
              <p className="sd font-['Crimson_Pro',serif] text-lg text-[rgba(212,196,160,0.6)] italic mt-2.5">Journey through four magnificent regions — where human history first began</p>
            </div>

            <div className="region-cards-track-wrap">
              <div className="region-cards-track">
                {/* Asia */}
                <div className="region-card" onClick={() => { navigate('/asia'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  <div className="region-card-imgframe">
                    <img src={`${import.meta.env.BASE_URL}asia.png`} alt="Asia" className="region-card-img" />
                  </div>
                  <div className="region-card-body">
                    <h3 className="region-card-title">Asia — Cradle of Civilization</h3>
                    <div className="region-card-desc">
                      <p>🌏 Birthplace of the world's oldest civilizations — Mesopotamia, Indus Valley, Ancient China, and Persia.</p>
                      <p>🏺 Key sites: Mohenjo-Daro, the Terracotta Army, Persepolis.</p>
                    </div>
                    <span className="region-card-cta">Explore Region →</span>
                  </div>
                </div>

                {/* Africa */}
                <div className="region-card" onClick={() => { navigate('/africa'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  <div className="region-card-imgframe">
                    <img src={`${import.meta.env.BASE_URL}africa.png`} alt="Africa" className="region-card-img" />
                  </div>
                  <div className="region-card-body">
                    <h3 className="region-card-title">Africa — Cradle of Humankind</h3>
                    <div className="region-card-desc">
                      <p>🦴 Holds the deepest roots of humanity — from 3.2 million-year-old Lucy to the pyramids of Egypt.</p>
                      <p>🏛️ Highlights: Pyramids of Giza, Great Zimbabwe, Lalibela.</p>
                    </div>
                    <span className="region-card-cta">Explore Region →</span>
                  </div>
                </div>

                {/* Europe */}
                <div className="region-card" onClick={() => { navigate('/europe'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  <div className="region-card-imgframe">
                    <img src={`${import.meta.env.BASE_URL}europe.png`} alt="Europe" className="region-card-img" />
                  </div>
                  <div className="region-card-body">
                    <h3 className="region-card-title">Europe — Classical & Megalithic Heritage</h3>
                    <div className="region-card-desc">
                      <p>🏺 Home to the Minoans, Greeks, Romans, and the builders of Stonehenge.</p>
                      <p>🏛️ Must-see: The Acropolis, Colosseum, Pompeii, Stonehenge.</p>
                    </div>
                    <span className="region-card-cta">Explore Region →</span>
                  </div>
                </div>

                {/* Americas */}
                <div className="region-card" onClick={() => { navigate('/americas'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                  <div className="region-card-imgframe">
                    <img src={`${import.meta.env.BASE_URL}america.png`} alt="Americas" className="region-card-img" />
                  </div>
                  <div className="region-card-body">
                    <h3 className="region-card-title">Americas — Pyramids of the New World</h3>
                    <div className="region-card-desc">
                      <p>🗿 The Maya, Aztec, Inca, and Olmec civilizations built massive pyramids and mastered astronomy.</p>
                      <p>🌽 Key discoveries: Machu Picchu, Teotihuacan, Chichen Itza.</p>
                    </div>
                    <span className="region-card-cta">Explore Region →</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="sw px-10 max-w-[1400px] mx-auto" style={{ paddingTop: '60px' }}>
            <div className="sh text-center mb-16">
              <div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Curated Selection<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div>
              <h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">Featured Artifacts</h2>
              <p className="sd font-['Crimson_Pro',serif] text-lg text-[rgba(212,196,160,0.6)] italic mt-2.5">Masterworks from the ancient world, digitally preserved</p>
            </div>
            <div className="ag grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderArtifactCards(arts.slice(0, 6))}
            </div>
            <div className="text-center mt-10">
              <button className="btn-outline bg-transparent text-[var(--gold-light)] border border-[rgba(201,168,76,0.4)] px-8 py-3.5 font-['Cinzel',serif] text-[11px] tracking-[3px] uppercase font-semibold rounded transition-all duration-300 cursor-none hover:border-[var(--gold)] hover:bg-[rgba(201,168,76,0.08)]" onClick={() => handlePageChange('gallery')}>View Full Collection →</button>
            </div>
          </section>
        </div>

        {/* ===== GALLERY ===== */}
        <div className={`page-section ${activePage === 'gallery' ? 'active' : ''}`} style={{ paddingTop: '70px' }}>
          <div className="sw px-10 max-w-[1400px] mx-auto">
            <div className="sh text-center mb-16">
              <div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Collection<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div>
              <h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">Artifacts Gallery</h2>
              <p className="sd font-['Crimson_Pro',serif] text-lg text-[rgba(212,196,160,0.6)] italic mt-2.5">Browse our complete collection</p>
            </div>
            <input className="si w-full bg-[rgba(28,21,16,0.8)] border border-[rgba(201,168,76,0.25)] rounded-lg px-5 py-3 text-[var(--sand)] text-sm font-['DM_Sans',sans-serif] outline-none transition-colors duration-200 focus:border-[var(--gold)] placeholder:text-[rgba(212,196,160,0.3)]" style={{ marginBottom: '24px' }} type="text" placeholder="Search artifacts…" value={gallerySearch} onChange={(e) => setGallerySearch(e.target.value)} />
            <div className="fb flex flex-wrap gap-2.5 justify-center mb-9">
              <button className={`fbtn px-5 py-2 rounded-full text-[11px] tracking-[1.5px] uppercase font-semibold cursor-none transition-all duration-200 border border-[rgba(201,168,76,0.25)] ${galleryFilter === 'All' ? 'bg-[rgba(201,168,76,0.15)] border-[var(--gold)] text-[var(--gold-light)]' : 'text-[rgba(212,196,160,0.6)] bg-transparent hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]'}`} onClick={() => setGalleryFilter('All')}>All</button>
              <button className={`fbtn px-5 py-2 rounded-full text-[11px] tracking-[1.5px] uppercase font-semibold cursor-none transition-all duration-200 border border-[rgba(201,168,76,0.25)] ${galleryFilter === 'africa' ? 'bg-[rgba(201,168,76,0.15)] border-[var(--gold)] text-[var(--gold-light)]' : 'text-[rgba(212,196,160,0.6)] bg-transparent hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]'}`} onClick={() => setGalleryFilter('africa')}>Africa</button>
              <button className={`fbtn px-5 py-2 rounded-full text-[11px] tracking-[1.5px] uppercase font-semibold cursor-none transition-all duration-200 border border-[rgba(201,168,76,0.25)] ${galleryFilter === 'asia' ? 'bg-[rgba(201,168,76,0.15)] border-[var(--gold)] text-[var(--gold-light)]' : 'text-[rgba(212,196,160,0.6)] bg-transparent hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]'}`} onClick={() => setGalleryFilter('asia')}>Asia</button>
              <button className={`fbtn px-5 py-2 rounded-full text-[11px] tracking-[1.5px] uppercase font-semibold cursor-none transition-all duration-200 border border-[rgba(201,168,76,0.25)] ${galleryFilter === 'europe' ? 'bg-[rgba(201,168,76,0.15)] border-[var(--gold)] text-[var(--gold-light)]' : 'text-[rgba(212,196,160,0.6)] bg-transparent hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]'}`} onClick={() => setGalleryFilter('europe')}>Europe</button>
              <button className={`fbtn px-5 py-2 rounded-full text-[11px] tracking-[1.5px] uppercase font-semibold cursor-none transition-all duration-200 border border-[rgba(201,168,76,0.25)] ${galleryFilter === 'americas' ? 'bg-[rgba(201,168,76,0.15)] border-[var(--gold)] text-[var(--gold-light)]' : 'text-[rgba(212,196,160,0.6)] bg-transparent hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]'}`} onClick={() => setGalleryFilter('americas')}>Americas</button>
            </div>
            <div className="ag grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderArtifactCards(arts.filter(a => {
                if (galleryFilter === 'All') return true;
                return a.r === galleryFilter.toLowerCase();
              }).filter(a => {
                if (!gallerySearch) return true;
                const q = gallerySearch.toLowerCase();
                return a.name.toLowerCase().includes(q) || a.civ.toLowerCase().includes(q);
              }))}
            </div>
          </div>
        </div>

        {/* ===== CIVILIZATIONS ===== */}
        <div className={`page-section ${activePage === 'civs' ? 'active' : ''}`} style={{ paddingTop: '70px' }}>
          <div className="sw px-10 max-w-[1400px] mx-auto">
            <div className="sh text-center mb-16">
              <div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Heritage<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div>
              <h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">Ancient Civilizations</h2>
              <p className="sd font-['Crimson_Pro',serif] text-lg text-[rgba(212,196,160,0.6)] italic mt-2.5">The great cultures that shaped human history</p>
            </div>
            <div className="cg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {renderCivCards(civs)}
            </div>
          </div>
        </div>

        {/* ===== AFRICA ===== */}
        <div className={`page-section ${activePage === 'africa' ? 'active' : ''}`}>
          <div className="rh min-h-[50vh] flex items-center justify-center relative overflow-hidden px-10 pt-[120px] pb-16" style={{ background: 'radial-gradient(ellipse at 40% 50%,rgba(201,168,76,0.15),transparent 60%),linear-gradient(160deg,#0d0b07,#1a1508,#0d0b07)' }}>
            <div className="rhe absolute text-[280px] opacity-5 select-none pointer-events-none">𓃀</div>
            <div className="rhc text-center relative z-10">
              <div className="rtag text-[9px] tracking-[5px] uppercase text-[var(--gold)] mb-4 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Member 2 · Anisa · Africa<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div>
              <h1 className="rtitle font-['Cinzel',serif] text-[clamp(36px,6vw,72px)] font-black text-[var(--gold-light)] mb-3">The Cradle of Humankind</h1>
              <p className="rsub font-['Crimson_Pro',serif] text-xl italic text-[rgba(212,196,160,0.6)]">From the pyramids of Egypt to the rock-hewn churches of Ethiopia — the birthplace of humanity</p>
            </div>
          </div>
          <div className="sw px-10 max-w-[1400px] mx-auto" style={{ paddingTop: '60px' }}>
            <div className="hs3 grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">3.2 MYA</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Lucy Fossil</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">The 3.2 million-year-old remains of Australopithecus afarensis discovered in Ethiopia — one of humanity's oldest known ancestors.</div>
              </div>
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">3100 BCE</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Ancient Egypt</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">One of history's longest-lasting civilizations, flourishing along the Nile for 3,000+ years with monumental pyramids and hieroglyphic writing.</div>
              </div>
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">1000 CE</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Great Zimbabwe</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">A medieval city of granite towers and walls built without mortar — capital of a powerful trading kingdom in southern Africa.</div>
              </div>
            </div>
            <div className="sh text-center mb-16"><div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>African Artifacts<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div><h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">Treasures of Africa</h2><p className="sd font-['Crimson_Pro',serif] text-lg text-[rgba(212,196,160,0.6)] italic mt-2.5">From the earliest human tools to the riches of ancient kingdoms</p></div>
            <div className="ag grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderArtifactCards(arts.filter(a => a.r === 'africa'))}
            </div>
            <div className="sh text-center mt-20 mb-16"><div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Civilizations<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div><h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">African Civilizations</h2></div>
            <div className="cg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {renderCivCards(afCivs)}
            </div>
            <FactBox fact={afFacts[afFactIndex]} onNext={() => nextFact('af')} />
          </div>
        </div>

        {/* ===== ASIA ===== */}
        <div className={`page-section ${activePage === 'asia' ? 'active' : ''}`}>
          <div className="rh min-h-[50vh] flex items-center justify-center relative overflow-hidden px-10 pt-[120px] pb-16" style={{ background: 'radial-gradient(ellipse at 60% 50%,rgba(200,150,100,0.15),transparent 60%),linear-gradient(160deg,#0d0b07,#1a1208,#0d0b07)' }}>
            <div className="rhe absolute text-[280px] opacity-5 select-none pointer-events-none">𒀭</div>
            <div className="rhc text-center relative z-10">
              <div className="rtag text-[9px] tracking-[5px] uppercase text-[var(--gold)] mb-4 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Member 2 · Anisa · Asia<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div>
              <h1 className="rtitle font-['Cinzel',serif] text-[clamp(36px,6vw,72px)] font-black text-[var(--gold-light)] mb-3">The Cradle of Civilization</h1>
              <p className="rsub font-['Crimson_Pro',serif] text-xl italic text-[rgba(212,196,160,0.6)]">Where writing, cities, and empires first arose — from Mesopotamia to the Indus Valley and beyond</p>
            </div>
          </div>
          <div className="sw px-10 max-w-[1400px] mx-auto" style={{ paddingTop: '60px' }}>
            <div className="hs3 grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">3500 BCE</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">First Writing</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">The Sumerians develop cuneiform script in Mesopotamia — humanity's earliest known writing system, invented for recording trade and grain.</div>
              </div>
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">2500 BCE</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Indus Valley</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">Remarkably advanced cities with grid planning, indoor plumbing, and the world's first urban sanitation systems — equal to anything in the ancient world.</div>
              </div>
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">221 BCE</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">China Unified</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">Qin Shi Huang becomes first Emperor of China, uniting warring states and beginning the construction of the Great Wall.</div>
              </div>
            </div>
            <div className="sh text-center mb-16"><div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Asian Artifacts<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div><h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">Treasures of Asia</h2><p className="sd font-['Crimson_Pro',serif] text-lg text-[rgba(212,196,160,0.6)] italic mt-2.5">Masterworks from the world's first cities and greatest empires</p></div>
            <div className="ag grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderArtifactCards(arts.filter(a => a.r === 'asia'))}
            </div>
            <div className="sh text-center mt-20 mb-16"><div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Civilizations<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div><h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">Asian Civilizations</h2></div>
            <div className="cg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {renderCivCards(asCivs)}
            </div>
            <FactBox fact={asFacts[asFactIndex]} onNext={() => nextFact('as')} />
          </div>
        </div>

        {/* ===== EUROPE ===== */}
        <div className={`page-section ${activePage === 'europe' ? 'active' : ''}`}>
          <div className="rh min-h-[50vh] flex items-center justify-center relative overflow-hidden px-10 pt-[120px] pb-16" style={{ background: 'radial-gradient(ellipse at 40% 50%,rgba(59,100,200,0.12),transparent 60%),linear-gradient(160deg,#0d0b07,#0f1520,#0d0b07)' }}>
            <div className="rhe absolute text-[280px] opacity-5 select-none pointer-events-none">🏛️</div>
            <div className="rhc text-center relative z-10">
              <div className="rtag text-[9px] tracking-[5px] uppercase text-[var(--gold)] mb-4 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Member 3 · Warisa · Europe<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div>
              <h1 className="rtitle font-['Cinzel',serif] text-[clamp(36px,6vw,72px)] font-black text-[var(--gold-light)] mb-3">Ancient Europe</h1>
              <p className="rsub font-['Crimson_Pro',serif] text-xl italic text-[rgba(212,196,160,0.6)]">From the stones of Stonehenge to the marble of the Parthenon</p>
            </div>
          </div>
          <div className="sw px-10 max-w-[1400px] mx-auto" style={{ paddingTop: '60px' }}>
            <div className="hs3 grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">3000 BCE</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Stonehenge Begins</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">Britain's greatest prehistoric monument, built in stages over 1,500 years by Neolithic peoples.</div>
              </div>
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">800 BCE</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Greek City-States Rise</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">Athens, Sparta, Corinth — the polis system that gave birth to democracy and Western civilization.</div>
              </div>
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">27 BCE</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Roman Empire Begins</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">Augustus becomes the first Roman Emperor, ruling a territory stretching from Britain to Mesopotamia.</div>
              </div>
            </div>
            <div className="sh text-center mb-16"><div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>European Artifacts<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div><h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">Treasures of Europe</h2><p className="sd font-['Crimson_Pro',serif] text-lg text-[rgba(212,196,160,0.6)] italic mt-2.5">From prehistoric Britain to the glory of Rome and Greece</p></div>
            <div className="ag grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderArtifactCards(arts.filter(a => a.r === 'europe'))}
            </div>
            <div className="sh text-center mt-20 mb-16"><div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Civilizations<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div><h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">European Civilizations</h2></div>
            <div className="cg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {renderCivCards(euCivs)}
            </div>
            <FactBox fact={euFacts[euFactIndex]} onNext={() => nextFact('eu')} />
          </div>
        </div>

        {/* ===== AMERICAS ===== */}
        <div className={`page-section ${activePage === 'americas' ? 'active' : ''}`}>
          <div className="rh min-h-[50vh] flex items-center justify-center relative overflow-hidden px-10 pt-[120px] pb-16" style={{ background: 'radial-gradient(ellipse at 60% 50%,rgba(139,74,43,0.18),transparent 60%),linear-gradient(160deg,#0d0b07,#1a1008,#0d0b07)' }}>
            <div className="rhe absolute text-[280px] opacity-5 select-none pointer-events-none">🗿</div>
            <div className="rhc text-center relative z-10">
              <div className="rtag text-[9px] tracking-[5px] uppercase text-[var(--gold)] mb-4 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Member 3 · Warisa · Americas<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div>
              <h1 className="rtitle font-['Cinzel',serif] text-[clamp(36px,6vw,72px)] font-black text-[var(--gold-light)] mb-3">Ancient Americas</h1>
              <p className="rsub font-['Crimson_Pro',serif] text-xl italic text-[rgba(212,196,160,0.6)]">From the jungles of the Maya to the peaks of the Inca</p>
            </div>
          </div>
          <div className="sw px-10 max-w-[1400px] mx-auto" style={{ paddingTop: '60px' }}>
            <div className="hs3 grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">2000 BCE</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Maya Civilization</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">Sophisticated calendar systems, hieroglyphic writing, and monumental temple-pyramids deep in the rainforest.</div>
              </div>
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">1345 CE</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Aztec Empire Founded</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">Tenochtitlan, built on an island in Lake Texcoco, became one of the largest cities in the world.</div>
              </div>
              <div className="hc3 rounded-xl p-7 border border-[rgba(201,168,76,0.15)] bg-gradient-to-br from-[rgba(28,21,16,0.8)] to-[rgba(20,15,8,0.9)] transition-all duration-300 cursor-none hover:border-[rgba(201,168,76,0.4)] hover:-translate-y-1">
                <div className="hn font-['Cinzel',serif] text-[34px] text-[var(--gold)] font-bold">1438 CE</div>
                <div className="hl text-[11px] tracking-[2px] uppercase text-[rgba(212,196,160,0.4)] mt-1">Inca Empire at Peak</div>
                <div className="hd font-['Crimson_Pro',serif] text-[15px] text-[rgba(212,196,160,0.6)] mt-3 leading-relaxed">The largest empire in pre-Columbian America, stretching 4,000 km along the Andes mountains.</div>
              </div>
            </div>
            <div className="sh text-center mb-16"><div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>American Artifacts<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div><h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">Treasures of the Americas</h2><p className="sd font-['Crimson_Pro',serif] text-lg text-[rgba(212,196,160,0.6)] italic mt-2.5">Magnificent civilizations that flourished before European contact</p></div>
            <div className="ag grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {renderArtifactCards(arts.filter(a => a.r === 'americas'))}
            </div>
            <div className="sh text-center mt-20 mb-16"><div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Civilizations<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div><h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">American Civilizations</h2></div>
            <div className="cg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {renderCivCards(amCivs)}
            </div>
            <FactBox fact={amFacts[amFactIndex]} onNext={() => nextFact('am')} />
          </div>
        </div>

        {/* ===== TIMELINE ===== */}
        <div className={`page-section ${activePage === 'timeline' ? 'active' : ''}`} style={{ paddingTop: '70px' }}>
          <div className="sw px-10 max-w-[1400px] mx-auto">
            <div className="sh text-center mb-16">
              <div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>Member 3 · Warisa · Interactive Feature<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div>
              <h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">Archaeological Timeline</h2>
              <p className="sd font-['Crimson_Pro',serif] text-lg text-[rgba(212,196,160,0.6)] italic mt-2.5">Click any event to expand · Filter by region</p>
            </div>
            <div className="tlf flex flex-wrap gap-2 justify-center mb-10">
              <button className={`tlbtn px-4 py-1.5 rounded-full text-[10px] tracking-[2px] uppercase font-semibold cursor-none transition-all duration-200 border border-[rgba(201,168,76,0.2)] ${tlFilter === 'All' ? 'bg-[rgba(201,168,76,0.15)] border-[var(--gold)] text-[var(--gold-light)]' : 'text-[rgba(212,196,160,0.5)] bg-transparent hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]'}`} onClick={() => setTlFilter('All')}>All</button>
              <button className={`tlbtn px-4 py-1.5 rounded-full text-[10px] tracking-[2px] uppercase font-semibold cursor-none transition-all duration-200 border border-[rgba(201,168,76,0.2)] ${tlFilter === 'Europe' ? 'bg-[rgba(201,168,76,0.15)] border-[var(--gold)] text-[var(--gold-light)]' : 'text-[rgba(212,196,160,0.5)] bg-transparent hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]'}`} onClick={() => setTlFilter('Europe')}>Europe</button>
              <button className={`tlbtn px-4 py-1.5 rounded-full text-[10px] tracking-[2px] uppercase font-semibold cursor-none transition-all duration-200 border border-[rgba(201,168,76,0.2)] ${tlFilter === 'Africa' ? 'bg-[rgba(201,168,76,0.15)] border-[var(--gold)] text-[var(--gold-light)]' : 'text-[rgba(212,196,160,0.5)] bg-transparent hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]'}`} onClick={() => setTlFilter('Africa')}>Africa</button>
              <button className={`tlbtn px-4 py-1.5 rounded-full text-[10px] tracking-[2px] uppercase font-semibold cursor-none transition-all duration-200 border border-[rgba(201,168,76,0.2)] ${tlFilter === 'Asia' ? 'bg-[rgba(201,168,76,0.15)] border-[var(--gold)] text-[var(--gold-light)]' : 'text-[rgba(212,196,160,0.5)] bg-transparent hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]'}`} onClick={() => setTlFilter('Asia')}>Asia</button>
              <button className={`tlbtn px-4 py-1.5 rounded-full text-[10px] tracking-[2px] uppercase font-semibold cursor-none transition-all duration-200 border border-[rgba(201,168,76,0.2)] ${tlFilter === 'Americas' ? 'bg-[rgba(201,168,76,0.15)] border-[var(--gold)] text-[var(--gold-light)]' : 'text-[rgba(212,196,160,0.5)] bg-transparent hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--gold)] hover:text-[var(--gold-light)]'}`} onClick={() => setTlFilter('Americas')}>Americas</button>
            </div>
            <div className="tlwrap relative py-5 pb-10">
              <div className="tll absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--gold)] via-8% via-[var(--gold)] via-92% to-transparent transform -translate-x-1/2 opacity-25"></div>
              {renderTimelineItems()}
            </div>
          </div>
        </div>

      {/* ===== TEAM ===== */}
        <div className={`page-section ${activePage === 'team' ? 'active' : ''}`} style={{ paddingTop: '70px' }}>
          <div className="sw px-10 max-w-[1400px] mx-auto">
            <div className="sh text-center mb-16">
              <div className="so text-[10px] tracking-[5px] uppercase text-[var(--gold)] mb-3 flex items-center justify-center gap-3"><span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span>The Creators<span className="w-[30px] h-px bg-[var(--gold)] opacity-50"></span></div>
              <h2 className="st font-['Cinzel',serif] text-[38px] text-[var(--gold-light)] font-bold">Our Team</h2>
              <p className="sd font-['Crimson_Pro',serif] text-lg text-[rgba(212,196,160,0.6)] italic mt-2.5">The brilliant minds behind ARCHÆUM Digital Museum</p>
            </div>
            <div className="tgrid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-12">
              {/* ─── Adita ─── */}
              <div className="tcard group relative bg-gradient-to-br from-[rgba(28,21,16,0.9)] to-[rgba(20,15,8,0.95)] border border-[rgba(201,168,76,0.18)] rounded-2xl p-8 pt-10 pb-7 text-center transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-2 hover:border-[rgba(201,168,76,0.45)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.55),0_0_40px_rgba(201,168,76,0.18)]">
                {/* Corner brackets */}
                <span className="pointer-events-none absolute top-2 left-2 w-5 h-5 border-t border-l border-[rgba(201,168,76,0.45)] rounded-tl-md transition-all duration-500 group-hover:w-7 group-hover:h-7 group-hover:border-[var(--gold)]" />
                <span className="pointer-events-none absolute top-2 right-2 w-5 h-5 border-t border-r border-[rgba(201,168,76,0.45)] rounded-tr-md transition-all duration-500 group-hover:w-7 group-hover:h-7 group-hover:border-[var(--gold)]" />
                <span className="pointer-events-none absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[rgba(201,168,76,0.45)] rounded-bl-md transition-all duration-500 group-hover:w-7 group-hover:h-7 group-hover:border-[var(--gold)]" />
                <span className="pointer-events-none absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[rgba(201,168,76,0.45)] rounded-br-md transition-all duration-500 group-hover:w-7 group-hover:h-7 group-hover:border-[var(--gold)]" />

                {/* Animated ring on hover */}
                <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.08), transparent 60%)' }} />

                {/* Member sigil */}
                <div className="tnum relative inline-block mb-4">
                  <span className="block text-[9px] tracking-[4px] uppercase text-[rgba(201,168,76,0.55)] font-['Cinzel',serif] relative z-10">◆ Member I ◆</span>
                </div>

                {/* Avatar */}
                <div className="tav relative w-[88px] h-[88px] mx-auto mb-5">
                  <span className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle, rgba(232,213,154,0.35), transparent 65%)' }} />
                  <span className="absolute inset-0 rounded-full border border-[rgba(201,168,76,0.25)] group-hover:border-[var(--gold)] transition-colors duration-500" />
                  <span className="absolute -inset-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(232,213,154,0.6) 60deg, transparent 120deg)', animation: 'tcSpin 3s linear infinite' }} />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[rgba(201,168,76,0.25)] to-[rgba(139,74,43,0.2)] border-2 border-[rgba(201,168,76,0.4)] flex items-center justify-center text-4xl overflow-hidden group-hover:border-[var(--gold)] transition-colors duration-500">
                    <span className="tav-fallback relative z-10">👑</span>
                    <img className="tphoto absolute inset-0 w-full h-full object-cover rounded-full z-20" src={`${import.meta.env.BASE_URL}adita.jpeg`} alt="Adita" onError={(e) => e.target.style.display='none'} />
                  </div>
                </div>

                {/* Name */}
                <div className="tmname font-['Cinzel',serif] text-[24px] text-[var(--gold-light)] font-bold mb-1 tracking-wide">Adita</div>

                {/* Decorative ornament */}
                <div className="flex items-center justify-center gap-2 my-2.5 opacity-70">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.6)]" />
                  <span className="text-[var(--gold)] text-[10px]">✦</span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-[rgba(201,168,76,0.6)]" />
                </div>

                {/* Role */}
                <div className="tmrole font-['Crimson_Pro',serif] text-[14px] text-[rgba(212,196,160,0.7)] italic mb-3">UI Lead · Home & Navigation</div>

                {/* Bio */}
                <div className="tbio font-['Crimson_Pro',serif] text-[13px] italic text-[rgba(212,196,160,0.55)] leading-relaxed mb-5 px-1">"Designs the museum's front doors — every click should feel like turning a page in history."</div>

                {/* Divider */}
                <div className="tdivider relative h-px my-3">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.25)] to-transparent" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-[rgba(20,15,8,0.95)] text-[var(--gold)] text-[8px]">◆</span>
                </div>

                {/* Contact */}
                <div className="tcontact flex gap-2 justify-center flex-wrap mt-4">
                  <a href="https://github.com/Adita-02" className="tsoc inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] tracking-[1.5px] uppercase font-['Cinzel',serif] font-semibold bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.22)] text-[rgba(201,168,76,0.7)] no-underline transition-all duration-300 hover:bg-[rgba(201,168,76,0.18)] hover:border-[var(--gold)] hover:text-[var(--gold-light)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(201,168,76,0.25)]" target="_blank" rel="noopener">GitHub</a>
                  <a href="https://linkedin.com/in/aditamutsuddi" className="tsoc inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] tracking-[1.5px] uppercase font-['Cinzel',serif] font-semibold bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.22)] text-[rgba(201,168,76,0.7)] no-underline transition-all duration-300 hover:bg-[rgba(201,168,76,0.18)] hover:border-[var(--gold)] hover:text-[var(--gold-light)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(201,168,76,0.25)]" target="_blank" rel="noopener">LinkedIn</a>
                </div>
              </div>

              {/* ─── Warisa (Lead) ─── */}
              <div className="tcard group relative bg-gradient-to-br from-[rgba(32,24,18,0.92)] to-[rgba(22,16,9,0.96)] border border-[rgba(201,168,76,0.32)] rounded-2xl p-8 pt-10 pb-7 text-center transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-2 hover:border-[rgba(201,168,76,0.6)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.6),0_0_50px_rgba(201,168,76,0.25)]" style={{ borderColor: 'rgba(201,168,76,0.35)' }}>

                {/* Corner brackets */}
                <span className="pointer-events-none absolute top-2 left-2 w-5 h-5 border-t border-l border-[rgba(232,213,154,0.5)] rounded-tl-md transition-all duration-500 group-hover:w-7 group-hover:h-7" />
                <span className="pointer-events-none absolute top-2 right-2 w-5 h-5 border-t border-r border-[rgba(232,213,154,0.5)] rounded-tr-md transition-all duration-500 group-hover:w-7 group-hover:h-7" />
                <span className="pointer-events-none absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[rgba(232,213,154,0.5)] rounded-bl-md transition-all duration-500 group-hover:w-7 group-hover:h-7" />
                <span className="pointer-events-none absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[rgba(232,213,154,0.5)] rounded-br-md transition-all duration-500 group-hover:w-7 group-hover:h-7" />

                {/* Larger glow */}
                <span className="pointer-events-none absolute inset-0 rounded-2xl" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(232,213,154,0.10), transparent 60%)' }} />

                {/* Member sigil */}
                <div className="tnum relative inline-block mb-4 mt-2">
                  <span className="block text-[9px] tracking-[4px] uppercase text-[var(--gold)] font-['Cinzel',serif] relative z-10">◆ Member II ◆</span>
                </div>

                {/* Avatar */}
                <div className="tav relative w-[88px] h-[88px] mx-auto mb-5">
                  <span className="absolute -inset-2 rounded-full" style={{ background: 'radial-gradient(circle, rgba(232,213,154,0.35), transparent 65%)' }} />
                  <span className="absolute inset-0 rounded-full border border-[rgba(232,213,154,0.4)]" />
                  <span className="absolute -inset-[3px] rounded-full" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(232,213,154,0.7) 60deg, transparent 120deg)', animation: 'tcSpin 4s linear infinite' }} />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[rgba(232,213,154,0.35)] to-[rgba(139,74,43,0.2)] border-2 border-[var(--gold)] flex items-center justify-center text-4xl overflow-hidden" style={{ fontSize: '36px' }}>
                    <span className="tav-fallback relative z-10">🏛️</span>
                    <img className="tphoto absolute inset-0 w-full h-full object-cover rounded-full z-20" src={`${import.meta.env.BASE_URL}was.jpeg`} alt="Warisa" onError={(e) => e.target.style.display='none'} />
                  </div>
                </div>

                {/* Name with gold gradient */}
                <div className="tmname font-['Cinzel',serif] text-[28px] font-bold mb-1 tracking-wide" style={{ background: 'linear-gradient(135deg,#fff3c2,#e8c97a 50%,#c9a84c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Warisa</div>


                {/* Role */}
                <div className="tmrole font-['Crimson_Pro',serif] text-[14px] italic mb-3" style={{ color: 'rgba(212,196,160,0.85)' }}>Interactive Lead · Europe, Americas & Timeline</div>

                {/* Bio */}
                <div className="tbio font-['Crimson_Pro',serif] text-[13px] italic leading-relaxed mb-5 px-1" style={{ color: 'rgba(212,196,160,0.65)' }}>"Builds the bridges between data and wonder — turning timelines and maps into living stories."</div>

                {/* Divider */}
                <div className="tdivider relative h-px my-3">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(232,213,154,0.35)] to-transparent" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-[rgba(22,16,9,0.95)] text-[var(--gold)] text-[8px]">◆</span>
                </div>

                {/* Contact */}
                <div className="tcontact flex gap-2 justify-center flex-wrap mt-4">
                  <a href="https://github.com/aisraw" className="tsoc inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] tracking-[1.5px] uppercase font-['Cinzel',serif] font-semibold border no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(232,213,154,0.35)]" style={{ background: 'rgba(201,168,76,0.10)', borderColor: 'rgba(232,213,154,0.4)', color: 'var(--gold-light)' }} target="_blank" rel="noopener">GitHub</a>
                  <a href="https://www.linkedin.com/in/warisaahmed/" className="tsoc inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] tracking-[1.5px] uppercase font-['Cinzel',serif] font-semibold border no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_14px_rgba(232,213,154,0.35)]" style={{ background: 'rgba(201,168,76,0.10)', borderColor: 'rgba(232,213,154,0.4)', color: 'var(--gold-light)' }} target="_blank" rel="noopener">LinkedIn</a>
                </div>
              </div>

              {/* ─── Anisa ─── */}
              <div className="tcard group relative bg-gradient-to-br from-[rgba(28,21,16,0.9)] to-[rgba(20,15,8,0.95)] border border-[rgba(201,168,76,0.18)] rounded-2xl p-8 pt-10 pb-7 text-center transition-all duration-500 cursor-pointer overflow-hidden hover:-translate-y-2 hover:border-[rgba(201,168,76,0.45)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.55),0_0_40px_rgba(201,168,76,0.18)]">
                {/* Corner brackets */}
                <span className="pointer-events-none absolute top-2 left-2 w-5 h-5 border-t border-l border-[rgba(201,168,76,0.45)] rounded-tl-md transition-all duration-500 group-hover:w-7 group-hover:h-7 group-hover:border-[var(--gold)]" />
                <span className="pointer-events-none absolute top-2 right-2 w-5 h-5 border-t border-r border-[rgba(201,168,76,0.45)] rounded-tr-md transition-all duration-500 group-hover:w-7 group-hover:h-7 group-hover:border-[var(--gold)]" />
                <span className="pointer-events-none absolute bottom-2 left-2 w-5 h-5 border-b border-l border-[rgba(201,168,76,0.45)] rounded-bl-md transition-all duration-500 group-hover:w-7 group-hover:h-7 group-hover:border-[var(--gold)]" />
                <span className="pointer-events-none absolute bottom-2 right-2 w-5 h-5 border-b border-r border-[rgba(201,168,76,0.45)] rounded-br-md transition-all duration-500 group-hover:w-7 group-hover:h-7 group-hover:border-[var(--gold)]" />

                {/* Animated ring on hover */}
                <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(201,168,76,0.08), transparent 60%)' }} />

                {/* Member sigil */}
                <div className="tnum relative inline-block mb-4">
                  <span className="block text-[9px] tracking-[4px] uppercase text-[rgba(201,168,76,0.55)] font-['Cinzel',serif] relative z-10">◆ Member III ◆</span>
                </div>

                {/* Avatar */}
                <div className="tav relative w-[88px] h-[88px] mx-auto mb-5">
                  <span className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'radial-gradient(circle, rgba(232,213,154,0.35), transparent 65%)' }} />
                  <span className="absolute inset-0 rounded-full border border-[rgba(201,168,76,0.25)] group-hover:border-[var(--gold)] transition-colors duration-500" />
                  <span className="absolute -inset-[3px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, rgba(232,213,154,0.6) 60deg, transparent 120deg)', animation: 'tcSpin 3s linear infinite' }} />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-[rgba(201,168,76,0.25)] to-[rgba(139,74,43,0.2)] border-2 border-[rgba(201,168,76,0.4)] flex items-center justify-center text-4xl overflow-hidden group-hover:border-[var(--gold)] transition-colors duration-500">
                    <span className="tav-fallback relative z-10">🌍</span>
                    <img className="tphoto absolute inset-0 w-full h-full object-cover rounded-full z-20" src={`${import.meta.env.BASE_URL}anisa.jpeg`} alt="Anisa" onError={(e) => e.target.style.display='none'} />
                  </div>
                </div>

                {/* Name */}
                <div className="tmname font-['Cinzel',serif] text-[24px] text-[var(--gold-light)] font-bold mb-1 tracking-wide">Anisa</div>

                {/* Decorative ornament */}
                <div className="flex items-center justify-center gap-2 my-2.5 opacity-70">
                  <span className="h-px w-8 bg-gradient-to-r from-transparent to-[rgba(201,168,76,0.6)]" />
                  <span className="text-[var(--gold)] text-[10px]">✦</span>
                  <span className="h-px w-8 bg-gradient-to-l from-transparent to-[rgba(201,168,76,0.6)]" />
                </div>

                {/* Role */}
                <div className="tmrole font-['Crimson_Pro',serif] text-[14px] text-[rgba(212,196,160,0.7)] italic mb-3">Content Lead · Africa & Asia</div>

                {/* Bio */}
                <div className="tbio font-['Crimson_Pro',serif] text-[13px] italic text-[rgba(212,196,160,0.55)] leading-relaxed mb-5 px-1">"Researches and writes the stories that bring 5,000 years of history to life."</div>

                {/* Divider */}
                <div className="tdivider relative h-px my-3">
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(201,168,76,0.25)] to-transparent" />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2 bg-[rgba(20,15,8,0.95)] text-[var(--gold)] text-[8px]">◆</span>
                </div>

                {/* Contact */}
                <div className="tcontact flex gap-2 justify-center flex-wrap mt-4">
                  <a href="https://github.com/afianisa" className="tsoc inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] tracking-[1.5px] uppercase font-['Cinzel',serif] font-semibold bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.22)] text-[rgba(201,168,76,0.7)] no-underline transition-all duration-300 hover:bg-[rgba(201,168,76,0.18)] hover:border-[var(--gold)] hover:text-[var(--gold-light)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(201,168,76,0.25)]" target="_blank" rel="noopener">GitHub</a>
                  <a href="https://bd.linkedin.com/in/afiaanisa" className="tsoc inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] tracking-[1.5px] uppercase font-['Cinzel',serif] font-semibold bg-[rgba(201,168,76,0.06)] border border-[rgba(201,168,76,0.22)] text-[rgba(201,168,76,0.7)] no-underline transition-all duration-300 hover:bg-[rgba(201,168,76,0.18)] hover:border-[var(--gold)] hover:text-[var(--gold-light)] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(201,168,76,0.25)]" target="_blank" rel="noopener">LinkedIn</a>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ===== MODALS ===== */}
        {modalOpen && selectedArtifact && (
          <div className="mo fixed inset-0 bg-[rgba(0,0,0,0.88)] z-500 flex items-center justify-center p-5 backdrop-blur-sm open">
            <div className="mb bg-gradient-to-br from-[#1c1510] to-[#120e08] border border-[rgba(201,168,76,0.3)] rounded-2xl max-w-[720px] w-full max-h-[85vh] overflow-y-auto animate-minIn">
              <div className="mh px-8 py-7 border-b border-[rgba(201,168,76,0.15)] flex items-start justify-between">
                <div>
                  <div className="text-[9px] tracking-[3px] uppercase text-[var(--gold)] mb-1.5">{selectedArtifact.civ}</div>
                  <h3 className="font-['Cinzel',serif] text-[22px] text-[var(--gold-light)]">{selectedArtifact.name}</h3>
                </div>
                <button className="mc w-8 h-8 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] text-[var(--gold)] cursor-none flex items-center justify-center text-base transition-all duration-200 hover:bg-[rgba(201,168,76,0.25)]" onClick={closeModal}>✕</button>
              </div>
              <div className="mbd px-8 py-7">
                <span className="meg text-8xl text-center block mb-5">{selectedArtifact.emoji}</span>
                <p className="font-['Crimson_Pro',serif] text-lg text-[rgba(212,196,160,0.7)] leading-relaxed">{selectedArtifact.desc}</p>
                <div className="mdg grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                  <div className="mdi bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.12)] rounded-lg p-3.5"><div className="mdl text-[9px] tracking-[2px] uppercase text-[rgba(201,168,76,0.5)] mb-1">Period</div><div className="mdv font-['Crimson_Pro',serif] text-[15px] text-[var(--sand)]">{selectedArtifact.era}</div></div>
                  <div className="mdi bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.12)] rounded-lg p-3.5"><div className="mdl text-[9px] tracking-[2px] uppercase text-[rgba(201,168,76,0.5)] mb-1">Origin</div><div className="mdv font-['Crimson_Pro',serif] text-[15px] text-[var(--sand)]">{selectedArtifact.origin}</div></div>
                  <div className="mdi bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.12)] rounded-lg p-3.5"><div className="mdl text-[9px] tracking-[2px] uppercase text-[rgba(201,168,76,0.5)] mb-1">Material</div><div className="mdv font-['Crimson_Pro',serif] text-[15px] text-[var(--sand)]">{selectedArtifact.mat}</div></div>
                  <div className="mdi bg-[rgba(201,168,76,0.05)] border border-[rgba(201,168,76,0.12)] rounded-lg p-3.5"><div className="mdl text-[9px] tracking-[2px] uppercase text-[rgba(201,168,76,0.5)] mb-1">Museum</div><div className="mdv font-['Crimson_Pro',serif] text-[15px] text-[var(--sand)]">{selectedArtifact.mus}</div></div>
                </div>
              </div>
            </div>
          </div>
        )}

      
{searchModalOpen && (
  <div className="mo open fixed inset-0 bg-[rgba(0,0,0,0.88)] z-500 flex items-center justify-center p-5 backdrop-blur-sm">
    <div className="mb bg-gradient-to-br from-[#1c1510] to-[#120e08] border border-[rgba(201,168,76,0.3)] rounded-2xl max-w-[600px] w-full max-h-[85vh] overflow-y-auto">
      <div className="mh px-8 py-7 border-b border-[rgba(201,168,76,0.15)] flex items-start justify-between">
        <h3 className="font-['Cinzel',serif] text-lg text-[var(--gold-light)]">Search Collection</h3>
        <button className="mc w-8 h-8 rounded-full bg-[rgba(201,168,76,0.1)] border border-[rgba(201,168,76,0.2)] text-[var(--gold)] cursor-none flex items-center justify-center text-base transition-all duration-200 hover:bg-[rgba(201,168,76,0.25)]" onClick={() => setSearchModalOpen(false)}>✕</button>
      </div>
      <div className="mbd px-8 py-7">
        <input className="si w-full bg-[rgba(28,21,16,0.8)] border border-[rgba(201,168,76,0.25)] rounded-lg px-5 py-3 text-[var(--sand)] text-sm font-['DM_Sans',sans-serif] outline-none transition-colors duration-200 focus:border-[var(--gold)] placeholder:text-[rgba(212,196,160,0.3)]" style={{ marginBottom: '20px' }} type="text" placeholder="Search artifacts, civilizations, eras…" value={searchQuery} onChange={handleSearchChange} />
        <div className="flex flex-col gap-2.5">
          {getSearchResults().slice(0, 6).map((a) => (
            <div key={a.id} onClick={() => { setSearchModalOpen(false); openArtifactModal(a.id); }} className="flex gap-3.5 items-center p-3 border border-[rgba(201,168,76,0.15)] rounded-lg cursor-none transition-colors duration-200 bg-[rgba(28,21,16,0.6)] hover:border-[rgba(201,168,76,0.4)]">
              <span className="text-3xl">{a.emoji}</span>
              <div><div className="font-['Cinzel',serif] text-sm text-[var(--gold-light)]">{a.name}</div><div className="text-xs text-[rgba(212,196,160,0.5)] mt-0.5">{a.civ} · {a.era}</div></div>
            </div>
          ))}
          {searchQuery.length >= 2 && getSearchResults().length === 0 && <p className="text-center text-[rgba(212,196,160,0.4)] font-['Crimson_Pro',serif] py-5">No artifacts found</p>}
        </div>
      </div>
    </div>
  </div>
)}

        {/* Map Popup */}
        {mapPopupOpen && (
          <div className="map-popup fixed inset-0 bg-[rgba(0,0,0,0.85)] z-[99999] flex items-center justify-center p-8 backdrop-blur-sm open" onClick={(e) => { if (e.target === e.currentTarget) closeMapPopup(); }}>
            <div className="map-popup-content max-w-[90vw] max-h-[90vh] bg-[#1a1510] border border-[rgba(201,168,76,0.3)] rounded-3xl p-5 shadow-2xl relative animate-minIn w-full h-full flex flex-col">
              <button className="map-popup-close absolute top-2.5 right-4 bg-[rgba(0,0,0,0.6)] border border-[rgba(201,168,76,0.4)] text-[var(--gold)] w-10 h-10 rounded-full text-2xl cursor-none flex items-center justify-center transition-colors duration-200 z-10 hover:bg-[rgba(201,168,76,0.2)]" onClick={closeMapPopup}>✕</button>
              <div className="map-popup-title font-['Cinzel',serif] text-lg text-[var(--gold-light)] mb-3 text-center tracking-[2px]">{mapRegion?.name} — Ancient Civilizations</div>
              <div id="popupMap" ref={mapContainerRef} className="flex-1 rounded-xl overflow-hidden border border-[rgba(201,168,76,0.15)]"></div>
            </div>
          </div>
        )}

        {/* Back to Top button */}
        <button id="backToTop" className="fixed bottom-7 right-7 w-[46px] h-[46px] rounded-full bg-[rgba(13,11,7,0.92)] border border-[rgba(201,168,76,0.4)] text-[var(--gold)] font-['Cinzel',serif] text-base font-bold flex items-center justify-center cursor-none z-200 opacity-0 pointer-events-none translate-y-3 transition-all duration-300 ease backdrop-blur-md hover:bg-[rgba(201,168,76,0.15)] hover:border-[var(--gold)] hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] hover:-translate-y-0.5" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Æ</button>
      </div>
    </>
  );
}