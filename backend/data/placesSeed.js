// backend/data/placesSeed.js
export const places = [
  {
    id: 1,
    title: "Mohenjo-daro",
    country: "Indus Valley, Pakistan",
    cover: "https://i.ibb.co.com/ksL5tm9R/mohenjodaro.webp",
    era: "2500 – 1900 BCE",
    yearStart: -2500,
    status: "Lost Civilization",
    decline: "Likely abandoned due to river course shifts in the Indus and prolonged drought weakening agriculture.",
    description: "One of the world's earliest planned cities, built on a strict street grid with covered drainage running beneath nearly every home — centuries before such sanitation existed anywhere else.",
    culture: ["Urban Planning", "Indus Script", "Trade Seals"],
    museum: "National Museum of Pakistan, Karachi",
    artifacts: "Steatite seals, terracotta figurines, the bronze 'Dancing Girl' statuette, and standardized stone weights used in trade.",
    react: 410, comment: 94, share: 33,
    artifactList: [
      { name: "Steatite Seal", desc: "Carved with unicorn motif and Indus script symbols", img: "https://i.ibb.co.com/4gKgFKYq/Steatite-Seal.jpg", category: "Seal", period: "2500 BCE", discoveredBy: "Sir John Marshall", discoveredYear: "1920s", housedAt: "National Museum of Pakistan, Karachi" },
      { name: "Dancing Girl", desc: "Bronze figurine, one of the earliest known pieces of bronze sculpture", img: "https://i.ibb.co.com/7xWqLsWp/dancing-Girl.avif", category: "Sculpture", period: "2500 BCE", discoveredBy: "Sir John Marshall", discoveredYear: "1926", housedAt: "National Museum of Pakistan, Karachi" },
      { name: "Mother Goddess", desc: "Terracotta idol representing fertility and worship", img: "https://i.ibb.co.com/YBFmw8CQ/Mother-Goddess-fotor-2026061823218.png", category: "Figurine", period: "2500 BCE", discoveredBy: "R.D. Banerji", discoveredYear: "1922", housedAt: "National Museum of Pakistan, Karachi" },
      { name: "Standard Weight", desc: "Chert stone weight used for trade across the Indus region", img: "https://i.ibb.co.com/pBwjXytj/Standard-Weight.jpg", category: "Trade", period: "2500 BCE", discoveredBy: "Sir John Marshall", discoveredYear: "1920s", housedAt: "National Museum of Pakistan, Karachi" }
    ]
  },
  {
    id: 2,
    title: "Petra",
    country: "Nabataean Kingdom, Jordan",
    cover: "https://i.ibb.co.com/Pv4YrtbY/petra.webp",
    era: "312 BCE – 106 CE",
    yearStart: -312,
    status: "Lost Civilization",
    decline: "Trade routes shifted after Roman annexation, and a major earthquake in 363 CE devastated the city's water system.",
    description: "Carved directly into rose-colored sandstone cliffs, Petra controlled the incense and spice routes between Arabia, Egypt, and the Mediterranean.",
    culture: ["Rock Architecture", "Trade Routes", "Water Engineering"],
    museum: "Petra Museum, Jordan",
    artifacts: "Nabataean pottery, carved tomb facades, hydraulic channel systems, and inscribed altars.",
    react: 333, comment: 53, share: 22,
    artifactList: [
      { name: "Nabataean Pottery", desc: "Fine painted ceramics with geometric patterns", img: "https://i.ibb.co.com/994ZDHFm/nabataean.jpg", category: "Pottery", period: "1st c. CE", discoveredBy: "John L. Burckhardt", discoveredYear: "1812", housedAt: "Petra Museum, Jordan" },
      { name: "Tomb Facade", desc: "Elaborate rock-cut façade from the Royal Tombs", img: "https://i.ibb.co.com/Qqs0P2T/tomb.jpg", category: "Architecture", period: "1st c. CE", discoveredBy: "Various Explorers", discoveredYear: "19th c.", housedAt: "Petra Museum, Jordan" },
      { name: "Inscribed Altar", desc: "Altar stone with Nabataean Aramaic inscription", img: "https://i.ibb.co.com/tpfdMmmR/altar.jpg", category: "Inscription", period: "1st c. CE", discoveredBy: "Archaeological Team", discoveredYear: "1990s", housedAt: "Petra Museum, Jordan" },
      { name: "Hydraulic Channel", desc: "Fragment of the sophisticated water conduit system", img: "https://i.ibb.co.com/Kv3H8Kr/channel.webp", category: "Engineering", period: "1st c. CE", discoveredBy: "Various Explorers", discoveredYear: "19th c.", housedAt: "Petra Museum, Jordan" }
    ]
  },
  {
    id: 3,
    title: "Göbekli Tepe",
    country: "Upper Mesopotamia, Turkey",
    cover: "https://i.ibb.co.com/sdcdcf0q/G-bekli-Tepe.jpg",
    era: "c. 9500 BCE",
    yearStart: -9500,
    status: "Lost Civilization",
    decline: "Deliberately buried by its own builders for unknown ritual reasons around 8000 BCE, then forgotten for ten millennia.",
    description: "Predating Stonehenge by six thousand years, this hilltop sanctuary of carved megaliths challenges assumptions about when organized religion and monumental construction began.",
    culture: ["Megaliths", "Ritual Sites", "Pre-Pottery Neolithic"],
    museum: "Şanlıurfa Archaeology Museum, Turkey",
    artifacts: "T-shaped limestone pillars carved with animal reliefs, ritual vessels, and some of the earliest known monumental sculpture.",
    react: 287, comment: 61, share: 19,
    artifactList: [
      { name: "T-shaped Pillar", desc: "Limestone pillar with carved fox relief", img: "https://i.ibb.co.com/ksYPtyBm/pillar.jpg", category: "Monument", period: "9500 BCE", discoveredBy: "Klaus Schmidt", discoveredYear: "1994", housedAt: "Şanlıurfa Archaeology Museum, Turkey" },
      { name: "Animal Relief", desc: "Intricate carving of snake and fox", img: "https://i.ibb.co.com/FSDyhqQ/animal.jpg", category: "Carving", period: "9500 BCE", discoveredBy: "Klaus Schmidt", discoveredYear: "1994", housedAt: "Şanlıurfa Archaeology Museum, Turkey" },
      { name: "Ritual Vessel", desc: "Stone ceremonial bowl used in rituals", img: "https://i.ibb.co.com/fJjt3bX/vassel.webp", category: "Ritual", period: "9500 BCE", discoveredBy: "Archaeological Team", discoveredYear: "1994", housedAt: "Şanlıurfa Archaeology Museum, Turkey" },
      { name: "Monumental Art", desc: "Early Neolithic sculptural tradition", img: "https://i.ibb.co.com/ZpSgS3cS/monumental.jpg", category: "Sculpture", period: "9500 BCE", discoveredBy: "Klaus Schmidt", discoveredYear: "1994", housedAt: "Şanlıurfa Archaeology Museum, Turkey" }
    ]
  },
  {
    id: 4,
    title: "Ur",
    country: "Sumer, Iraq",
    cover: "https://i.ibb.co.com/dJQG3g4x/ur.webp",
    era: "3800 – 500 BCE",
    yearStart: -3800,
    status: "Lost Civilization",
    decline: "Slow desertification and the silting of the Euphrates pushed the river away from the city until it could no longer sustain itself.",
    description: "Capital of Sumer and birthplace of the patriarch Abraham according to tradition, Ur's Great Ziggurat once anchored a city of canals, granaries, and the earliest cuneiform archives.",
    culture: ["Cuneiform", "Ziggurats", "Sumerian Law"],
    museum: "Iraq Museum, Baghdad",
    artifacts: "Royal tombs of Ur treasures including the Golden Lyre, cylinder seals, and thousands of cuneiform administrative tablets.",
    react: 356, comment: 72, share: 28,
    artifactList: [
      { name: "Golden Lyre", desc: "Lyre decorated with gold and lapis lazuli from Royal Tombs", img: "https://i.ibb.co.com/GQkLxKB9/golden.jpg", category: "Music", period: "2600 BCE", discoveredBy: "Sir Leonard Woolley", discoveredYear: "1922-1934", housedAt: "Iraq Museum, Baghdad" },
      { name: "Cylinder Seal", desc: "Cylinder seal with cuneiform inscription", img: "https://i.ibb.co.com/7dCQx4Dn/cylinder.webp", category: "Writing", period: "2600 BCE", discoveredBy: "Sir Leonard Woolley", discoveredYear: "1922-1934", housedAt: "Iraq Museum, Baghdad" },
      { name: "Cuneiform Tablet", desc: "Administrative record in early Sumerian script", img: "https://i.ibb.co.com/5h52XNtG/tablet.jpg", category: "Writing", period: "2600 BCE", discoveredBy: "Sir Leonard Woolley", discoveredYear: "1922-1934", housedAt: "Iraq Museum, Baghdad" },
      { name: "Royal Treasure", desc: "Gold jewelry and artifacts from the Royal Cemetery", img: "https://i.ibb.co.com/Tqq28Z6s/royal.avif", category: "Jewelry", period: "2600 BCE", discoveredBy: "Sir Leonard Woolley", discoveredYear: "1922-1934", housedAt: "Iraq Museum, Baghdad" }
    ]
  },
  {
    id: 5,
    title: "Persepolis",
    country: "Achaemenid Persia, Iran",
    cover: "https://i.ibb.co.com/cX2XFx8m/Persepolis.jpg",
    era: "550 – 330 BCE",
    yearStart: -550,
    status: "Lost Civilization",
    decline: "Burned and looted by Alexander the Great's army in 330 BCE, ending it as a functioning capital almost overnight.",
    description: "Built as a ceremonial seat for the Achaemenid kings, its grand staircases and relief carvings depicted tribute-bearers from every corner of the empire.",
    culture: ["Royal Road", "Imperial Architecture", "Tribute Reliefs"],
    museum: "National Museum of Iran, Tehran",
    artifacts: "Stone reliefs of tribute processions, gold and silver vessels, and the Cyrus Cylinder's related administrative archive.",
    react: 302, comment: 65, share: 24,
    artifactList: [
      { name: "Tribute Relief", desc: "Stone relief showing tribute bearers from across the empire", img: "https://i.ibb.co.com/FLz9vrP3/tribute.webp", category: "Relief", period: "500 BCE", discoveredBy: "Various Explorers", discoveredYear: "17th c.", housedAt: "National Museum of Iran, Tehran" },
      { name: "Gold Vessel", desc: "Achaemenid gold drinking cup with lion motif", img: "https://i.ibb.co.com/jPY4rj4R/gold-vassel.jpg", category: "Metalwork", period: "500 BCE", discoveredBy: "Archaeological Team", discoveredYear: "19th c.", housedAt: "National Museum of Iran, Tehran" },
      { name: "Silver Plate", desc: "Silver plate with royal inscription in Old Persian", img: "https://i.ibb.co.com/7MSwpxj/silver-plate.jpg", category: "Metalwork", period: "500 BCE", discoveredBy: "Archaeological Team", discoveredYear: "19th c.", housedAt: "National Museum of Iran, Tehran" },
      { name: "Cyrus Cylinder", desc: "Administrative archive foundation deposit", img: "https://i.ibb.co.com/DP2tsx74/cyrus.avif", category: "Writing", period: "500 BCE", discoveredBy: "Hormuzd Rassam", discoveredYear: "1879", housedAt: "National Museum of Iran, Tehran" }
    ]
  },
  {
    id: 6,
    title: "Angkor",
    country: "Khmer Empire, Cambodia",
    cover: "https://i.ibb.co.com/Xk2Rbsp1/Angkor.jpg",
    era: "802 – 1431 CE",
    yearStart: 802,
    status: "Lost Civilization",
    decline: "A combination of severe drought-then-flood cycles overwhelmed the city's reservoir system, while repeated invasions hastened its abandonment.",
    description: "Once the largest pre-industrial urban center on Earth, Angkor's network of temples and reservoirs supported a population that may have exceeded a million.",
    culture: ["Temple Cities", "Hydraulic Engineering", "Devaraja Cult"],
    museum: "National Museum of Cambodia, Phnom Penh",
    artifacts: "Sandstone devata reliefs, bronze Buddhist and Hindu statuary, and inscribed stelae detailing Khmer royal genealogy.",
    react: 218, comment: 48, share: 21,
    artifactList: [
      { name: "Devata Relief", desc: "Sandstone relief of celestial dancer from Angkor Wat", img: "https://i.ibb.co.com/4ZyNZyqQ/devata.webp", category: "Relief", period: "12th c.", discoveredBy: "Various Explorers", discoveredYear: "19th c.", housedAt: "National Museum of Cambodia, Phnom Penh" },
      { name: "Bronze Buddha", desc: "Khmer bronze Buddha in meditation posture", img: "https://i.ibb.co.com/tpzZQj6f/bronze-buddha.webp", category: "Sculpture", period: "12th c.", discoveredBy: "Various Explorers", discoveredYear: "19th c.", housedAt: "National Museum of Cambodia, Phnom Penh" },
      { name: "Inscribed Stele", desc: "Stele detailing Khmer royal genealogy", img: "https://i.ibb.co.com/23GKmybJ/stele.jpg", category: "Inscription", period: "12th c.", discoveredBy: "Various Explorers", discoveredYear: "19th c.", housedAt: "National Museum of Cambodia, Phnom Penh" },
      { name: "Vishnu Statue", desc: "Bronze statue of Vishnu from the Khmer period", img: "https://i.ibb.co.com/RGw7pJ5q/vishnu.jpg", category: "Sculpture", period: "12th c.", discoveredBy: "Various Explorers", discoveredYear: "19th c.", housedAt: "National Museum of Cambodia, Phnom Penh" }
    ]
  },
  {
    id: 7,
    title: "Loulan",
    country: "Tarim Basin, Xinjiang",
    cover: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e",
    era: "176 BCE – 630 CE",
    yearStart: -176,
    status: "Lost Civilization",
    decline: "The Tarim River changed course away from the city, and the surrounding land turned to desert, forcing total abandonment.",
    description: "A vital waystation on the Silk Road through the Taklamakan Desert, Loulan vanished so completely that its exact location was lost until early 20th-century explorers rediscovered it.",
    culture: ["Silk Road", "Desert Trade", "Tarim Mummies"],
    museum: "Xinjiang Regional Museum, Ürümqi",
    artifacts: "Preserved silk textiles, wooden tablets in Kharosthi script, and naturally mummified remains including the 'Beauty of Loulan.'",
    react: 246, comment: 41, share: 17,
    artifactList: [
      { name: "Silk Textile", desc: "Han dynasty silk textile preserved in desert conditions", img: "https://i.ibb.co.com/7xpVvXxq/silk.jpg", category: "Textile", period: "200 CE", discoveredBy: "Sven Hedin", discoveredYear: "1900", housedAt: "Xinjiang Regional Museum, Ürümqi" },
      { name: "Wooden Tablet", desc: "Tablet with Kharosthi script recording trade", img: "https://i.ibb.co.com/8LPvg1dp/wooden.jpg", category: "Writing", period: "200 CE", discoveredBy: "Sven Hedin", discoveredYear: "1900", housedAt: "Xinjiang Regional Museum, Ürümqi" },
      { name: "Tarim Mummy", desc: "Naturally preserved remains from the desert", img: "https://i.ibb.co.com/ksFVBzkR/tarim-mummy.jpg", category: "Mummy", period: "200 CE", discoveredBy: "Sven Hedin", discoveredYear: "1900", housedAt: "Xinjiang Regional Museum, Ürümqi" },
      { name: "Beauty of Loulan", desc: "Famous well-preserved mummy of a young woman", img: "https://i.ibb.co.com/hxcPz5KJ/beauty.jpg", category: "Mummy", period: "200 CE", discoveredBy: "Sven Hedin", discoveredYear: "1900", housedAt: "Xinjiang Regional Museum, Ürümqi" }
    ]
  },
  {
    id: 8,
    title: "Borobudur's Mataram",
    country: "Sailendra Kingdom, Indonesia",
    cover: "https://i.ibb.co.com/Ngf8w5kz/borobudur.webp",
    era: "8th – 10th century CE",
    yearStart: 750,
    status: "Lost Civilization",
    decline: "A volcanic eruption from nearby Mount Merapi, combined with a political shift of power to East Java, led to the temple's gradual abandonment.",
    description: "The Sailendra dynasty raised Borobudur as the largest Buddhist monument on Earth, then vanished from the historical record so thoroughly that the temple lay buried under volcanic ash.",
    culture: ["Mahayana Buddhism", "Volcanic Stone Architecture", "Pilgrimage Routes"],
    museum: "Karmawibhangga Museum, Borobudur",
    artifacts: "Carved relief panels depicting Buddhist cosmology, stone stupas, and Buddha statues recovered during 20th-century restoration.",
    react: 298, comment: 48, share: 18,
    artifactList: [
      { name: "Cosmology Relief", desc: "Buddhist cosmology panel showing the universe", img: "https://i.ibb.co.com/vNh8G8S/cosmology.jpg", category: "Relief", period: "9th c.", discoveredBy: "Sir Thomas Stamford Raffles", discoveredYear: "1814", housedAt: "Karmawibhangga Museum, Borobudur" },
      { name: "Stone Stupa", desc: "Miniature stupa replica from the temple complex", img: "https://i.ibb.co.com/cPK0Ycp/stupa.jpg", category: "Architecture", period: "9th c.", discoveredBy: "Sir Thomas Stamford Raffles", discoveredYear: "1814", housedAt: "Karmawibhangga Museum, Borobudur" },
      { name: "Buddha Statue", desc: "Seated Buddha in dhyana mudra", img: "https://i.ibb.co.com/wZB12Rhy/buddha-statue.webp", category: "Sculpture", period: "9th c.", discoveredBy: "Sir Thomas Stamford Raffles", discoveredYear: "1814", housedAt: "Karmawibhangga Museum, Borobudur" },
      { name: "Relief Panel", desc: "Narrative relief depicting Buddhist stories", img: "https://i.ibb.co.com/fYKxD7sB/panel.jpg", category: "Relief", period: "9th c.", discoveredBy: "Sir Thomas Stamford Raffles", discoveredYear: "1814", housedAt: "Karmawibhangga Museum, Borobudur" }
    ]
  },
  {
    id: 9,
    title: "Qin Xianyang",
    country: "Qin Dynasty, China",
    cover: "https://i.ibb.co.com/qMkbhqrX/Qin-Xianyang.webp",
    era: "350 – 206 BCE",
    yearStart: -350,
    status: "Lost Civilization",
    decline: "Razed and burned following the dynasty's collapse shortly after the first emperor's death, with rebel forces destroying the palace complex.",
    description: "Capital of the first unified Chinese empire, Xianyang oversaw the standardization of writing, currency, and law — and the construction of the emperor's vast underground guard.",
    culture: ["Imperial Unification", "Legalism", "Underground Mausoleum"],
    museum: "Shaanxi History Museum & Terracotta Army Museum, Xi'an",
    artifacts: "Over 8,000 individually sculpted terracotta soldiers, bronze chariots, and standardized weight and measure sets.",
    react: 429, comment: 71, share: 34,
    artifactList: [
      { name: "Terracotta Warrior", desc: "Life-sized clay soldier from the Terracotta Army", img: "https://i.ibb.co.com/1f8tBPQP/warriors.jpg", category: "Sculpture", period: "210 BCE", discoveredBy: "Local Farmers", discoveredYear: "1974", housedAt: "Terracotta Army Museum, Xi'an" },
      { name: "Bronze Chariot", desc: "Bronze war chariot from the emperor's mausoleum", img: "https://i.ibb.co.com/HvVW7hm/chariot.jpg", category: "Metalwork", period: "210 BCE", discoveredBy: "Archaeological Team", discoveredYear: "1974", housedAt: "Terracotta Army Museum, Xi'an" },
      { name: "Standardized Weight", desc: "Qin dynasty bronze weight for measurement", img: "https://i.ibb.co.com/sp9spvG8/weight.jpg", category: "Trade", period: "210 BCE", discoveredBy: "Archaeological Team", discoveredYear: "1974", housedAt: "Shaanxi History Museum, Xi'an" },
      { name: "Terracotta Army", desc: "Full army formation of 8,000+ soldiers", img: "https://i.ibb.co.com/Wp68kNNT/army.jpg", category: "Sculpture", period: "210 BCE", discoveredBy: "Local Farmers", discoveredYear: "1974", housedAt: "Terracotta Army Museum, Xi'an" }
    ]
  }
];