// backend/data/africaSeed.js
const stats = [
  {
    stat: "50+",
    desc: "Archaeological Regions",
    icon: "📊",
    details: { "Regions Mapped": "52", "Active Digs": "18", "Countries": "12", "Period Covered": "3000 BCE — 1500 CE" },
  },
  {
    stat: "2000+",
    desc: "Recovered Artifacts",
    icon: "📊",
    details: { "Total Recovered": "2,847", "Ceramics": "1,203", "Metal Objects": "892", "Textiles": "126", "Inscriptions": "214" },
  },
  {
    stat: "3000Y",
    desc: "Historical Records",
    icon: "📊",
    details: { "Earliest Record": "3100 BCE", "Latest Record": "1600 CE", "Total Documents": "1,847", "Languages": "9" },
  },
];

const kingdoms = [
  {
    title: "Ancient Egypt", era: "3100 BCE",
    desc: "A civilization built around the Nile. Architecture, astronomy, temples and writing left a global legacy.",
    img: "https://images.unsplash.com/photo-1568322445389-f64ac2515020",
    details: { "Dynasties": "31", "Capital": "Memphis / Thebes", "Writing": "Hieroglyphs", "Known For": "Pyramids, Sphinx, Astronomy" },
    subitems: [
      { title: "Great Pyramid", img: "https://images.unsplash.com/photo-1503177119275-0aa32b3a9368", info: "Largest pyramid, built c. 2560 BCE" },
      { title: "Sphinx", img: "https://i.ibb.co.com/QvqsB08w/sphinix.webp", info: "Lion-bodied statue, guardian of Giza" },
      { title: "Valley Temple", img: "https://images.unsplash.com/photo-1579606032821-4e6161c81bd3", info: "Mortuary temple near the Sphinx" },
    ],
  },
  {
    title: "Kingdom of Kush", era: "1070 BCE",
    desc: "Known for trade, iron production and monumental tombs. A powerful neighbor and rival of Egypt.",
    img: "https://i.ibb.co.com/mrZMmp9F/kingdom.jpg",
    details: { "Capital": "Meroë", "Known For": "Ironworking, Pyramids", "Trade Routes": "Nile, Red Sea", "Period": "1070 BCE — 350 CE" },
    subitems: [
      { title: "Pyramids of Meroë", img: "https://i.ibb.co.com/6G2LZv7/mwrow.jpg", info: "Over 200 pyramids, smaller than Egyptian" },
      { title: "Kushite Pottery", img: "https://i.ibb.co.com/xS6ByvyP/Kushite-Pottery.jpg", info: "Distinctive Nubian ceramic traditions" },
      { title: "Iron Smelting", img: "https://i.ibb.co.com/xKyFDL90/iron.jpg", info: "Advanced iron production in Meroë" },
    ],
  },
  {
    title: "Great Zimbabwe", era: "1100 CE",
    desc: "Massive stone walls, trade routes and cultural identity created one of Africa's most remarkable cities.",
    img: "https://i.ibb.co.com/yc0CZbFK/zimbabwe.jpg",
    details: { "Construction": "Dry stone walls", "Height": "11m walls", "Trade": "Gold, Ivory", "Population": "18,000+" },
    subitems: [
      { title: "Great Enclosure", img: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2", info: "Largest ancient structure in sub-Saharan Africa" },
      { title: "Hill Ruins", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914", info: "Earliest part of the city, built on a hilltop" },
      { title: "Soapstone Birds", img: "https://images.unsplash.com/photo-1579630885531-35bb4ab75e7d", info: "Carved birds, national symbol of Zimbabwe" },
    ],
  },
  {
    title: "Carthage", era: "814 BCE",
    desc: "Maritime power connecting Africa and the Mediterranean. Its influence shaped commerce and warfare.",
    img: "https://i.ibb.co.com/VWXsqJJK/carthage.jpg",
    details: { "Founded": "814 BCE", "Empire": "Mediterranean", "Known For": "Naval power, Trade", "Famous": "Hannibal Barca" },
    subitems: [
      { title: "Byrsa Hill", img: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29", info: "Ancient citadel of Carthage" },
      { title: "Tophet", img: "https://images.unsplash.com/photo-1598902108854-10d8e72f3f8c", info: "Sacred precinct of Carthage" },
      { title: "Punic Ports", img: "https://images.unsplash.com/photo-1586331013509-e8ac7dae929b", info: "Double harbor with naval base" },
    ],
  },
  {
    title: "Kingdom of Aksum", era: "100 CE",
    desc: "A major trading empire in East Africa. Known for its monumental obelisks and early Christian heritage.",
    img: "https://i.ibb.co.com/VW2h7CwL/aksum.jpg",
    details: { "Capital": "Aksum", "Period": "100 — 940 CE", "Trade": "Ivory, Gold, Incense", "Religion": "Christianity" },
    subitems: [
      { title: "Obelisks of Aksum", img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa", info: "Giant carved stone monoliths" },
      { title: "Church of St. Mary", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914", info: "Ancient Christian church in Aksum" },
      { title: "Aksumite Coins", img: "https://images.unsplash.com/photo-1603503364272-cf6b4db96b85", info: "Coins showing Aksumite kings" },
    ],
  },
  {
    title: "Mali Empire", era: "1235 CE",
    desc: "One of the largest and wealthiest empires in West Africa. Famous for Mansa Musa and Timbuktu.",
    img: "https://i.ibb.co.com/LXj9qRx4/mali.jpg",
    details: { "Founded": "1235 CE", "Capital": "Niani", "Wealth": "Gold, Salt", "Famous": "Mansa Musa, Timbuktu" },
    subitems: [
      { title: "Timbuktu", img: "https://images.unsplash.com/photo-1533105079780-92b9be482077", info: "Legendary center of learning and trade" },
      { title: "Djenne Mosque", img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e", info: "Great Mosque of Djenne, UNESCO site" },
      { title: "Mansa Musa Gold", img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04", info: "Gold currency of the Mali Empire" },
    ],
  },
  {
    title: "Ghana Empire", era: "300 — 1200 CE",
    desc: "Known as the 'Land of Gold', the Ghana Empire controlled trans-Saharan trade routes and amassed immense wealth.",
    img: "https://images.unsplash.com/photo-1523805009345-7448845a9e53",
    details: { "Founded": "300 CE", "Capital": "Koumbi Saleh", "Wealth": "Gold, Salt", "Trade": "Trans-Saharan" },
    subitems: [
      { title: "Koumbi Saleh", img: "https://images.unsplash.com/photo-1523805009345-7448845a9e53", info: "Capital city, divided into royal and commercial districts" },
      { title: "Gold Trade", img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04", info: "Gold was the empire's primary export" },
      { title: "Salt Mines", img: "https://images.unsplash.com/photo-1575632569926-282f48bd5a4b", info: "Salt was traded for gold across the Sahara" },
    ],
  },
  {
    title: "Songhai Empire", era: "1464 — 1591 CE",
    desc: "One of the largest Islamic empires in history, known for its scholarly cities of Timbuktu and Gao.",
    img: "https://i.ibb.co.com/XZJYHSMP/songhai.jpg",
    details: { "Founded": "1464 CE", "Capital": "Gao", "Wealth": "Gold, Salt, Trade", "Famous": "Askia Muhammad" },
    subitems: [
      { title: "Timbuktu", img: "https://images.unsplash.com/photo-1533105079780-92b9be482077", info: "Center of Islamic learning and trade" },
      { title: "Gao", img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e", info: "Capital city of the Songhai Empire" },
      { title: "Askia Tomb", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914", info: "UNESCO site, burial place of Askia Muhammad" },
    ],
  },
  {
    title: "Nok Culture", era: "1500 BCE — 500 CE",
    desc: "One of the earliest known civilizations in West Africa, famous for its distinctive terracotta sculptures.",
    img: "https://i.ibb.co.com/cSVkkWdT/nok.jpg",
    details: { "Period": "1500 BCE — 500 CE", "Known For": "Terracotta Sculptures", "Region": "Central Nigeria", "Discovery": "1943" },
    subitems: [
      { title: "Terracotta Head", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914", info: "Distinctive Nok terracotta sculpture" },
      { title: "Nok Figurines", img: "https://images.unsplash.com/photo-1579630885531-35bb4ab75e7d", info: "Human and animal figures in terracotta" },
      { title: "Archaeological Site", img: "https://images.unsplash.com/photo-1523805009345-7448845a9e53", info: "Excavations in central Nigeria" },
    ],
  },
  {
    title: "Kingdom of Benin", era: "1180 — 1897 CE",
    desc: "Famous for its bronze sculptures and ivory work, the kingdom of Benin was one of the most advanced pre-colonial states.",
    img: "https://i.ibb.co.com/cSVkkWdT/nok.jpg",
    details: { "Founded": "1180 CE", "Capital": "Benin City", "Known For": "Bronze Sculptures, Ivory", "Fall": "1897 British invasion" },
    subitems: [
      { title: "Benin Bronzes", img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04", info: "Famous bronze sculptures and plaques" },
      { title: "Ivory Carvings", img: "https://images.unsplash.com/photo-1575632569926-282f48bd5a4b", info: "Intricate ivory masks and carvings" },
      { title: "Benin City", img: "https://images.unsplash.com/photo-1521295121783-8a321d551ad2", info: "The capital city with impressive walls" },
    ],
  },
];

const expeditions = [
  {
    title: "Excavation", icon: "🪨",
    desc: "Hidden structures revealed beneath layers of history. Each dig uncovers stories of daily life, trade, and belief.",
    details: { "Sites Active": "24", "Depth Reached": "18m", "Structures Found": "112", "Periods": "Bronze Age — Medieval" },
  },
  {
    title: "Artifacts", icon: "🏺",
    desc: "Recovered objects preserving daily life — from pottery to ceremonial tools, each piece tells a story.",
    details: { "Total Found": "2,847", "Ceramics": "1,203", "Tools": "674", "Jewelry": "328", "Ritual Objects": "142" },
  },
  {
    title: "Routes", icon: "🧭",
    desc: "Ancient trade routes connected regions across deserts and coasts, enabling cultural and economic exchange.",
    details: { "Major Routes": "7", "Total Distance": "4,200km", "Goods Traded": "Gold, Salt, Ivory", "Cultures Connected": "12+" },
  },
  {
    title: "Records", icon: "📜",
    desc: "Texts and inscriptions preserved identity, laws, and beliefs — written memory of ancient civilizations.",
    details: { "Languages": "9", "Total Inscriptions": "1,847", "Oldest": "c. 2500 BCE", "Topics": "Religion, Law, Trade" },
  },
];

const atlasLarge = {
  title: "Valley of Kings",
  desc: "Royal tombs, hidden chambers and preserved funerary traditions. Explore the resting place of pharaohs.",
  img: "https://images.unsplash.com/photo-1579606032821-4e6161c81bd3",
  details: { "Tombs Discovered": "63", "Pharaohs Buried": "18", "Period": "1539 — 1075 BCE", "Notable": "Tutankhamun, Ramesses" },
};

const atlasSmall = [
  {
    title: "Ancient Capitals", icon: "🏛️",
    desc: "Discover political and cultural centers that once ruled vast territories.",
    details: { "Capitals": "14", "Continent": "Africa", "Period": "3000 BCE — 1600 CE", "Notable": "Memphis, Meroë, Axum" },
  },
  {
    title: "Trade Networks", icon: "🌍",
    desc: "Routes connecting deserts, coasts and kingdoms — the arteries of ancient commerce.",
    details: { "Major Routes": "7", "Total Distance": "4,200km", "Goods": "Gold, Salt, Ivory, Textiles", "Connected": "12+ cultures" },
  },
  {
    title: "Excavation Records", icon: "⛏️",
    desc: "Documented findings from archaeological sites — a chronicle of discovery.",
    details: { "Sites Documented": "87", "Reports": "244", "Periods": "Bronze Age — Medieval", "Institutions": "12" },
  },
];

const museum = [
  {
    title: "Golden Relic", badge: "Artifact",
    desc: "Recovered ceremonial object.", fullDesc: "Recovered ceremonial object from a royal tomb. Intricate craftsmanship reflects the skill of ancient artisans.",
    img: "https://i.ibb.co.com/RGgVHq5b/relic.jpg",
    details: { "Material": "Gold, Lapis Lazuli", "Period": "c. 1300 BCE", "Origin": "Royal Tomb, Thebes", "Current Location": "Cairo Museum" },
  },
  {
    title: "Temple Fragment", badge: "Archive",
    desc: "Architectural remains.", fullDesc: "Architectural remains from a sacred temple. Carved reliefs depict rituals and divine figures.",
    img: "https://i.ibb.co.com/B2m04kJ0/fragment.jpg",
    details: { "Material": "Limestone", "Period": "c. 1200 BCE", "Origin": "Luxor Temple", "Features": "Hieroglyphic inscriptions" },
  },
  {
    title: "Clay Vessel", badge: "Collection",
    desc: "Ancient preserved pottery.", fullDesc: "Ancient preserved pottery used for storage and ritual. Decorated with symbolic patterns.",
    img: "https://i.ibb.co.com/qFdFTGx8/vessel.jpg",
    details: { "Material": "Terracotta", "Period": "c. 500 BCE — 200 CE", "Origin": "Nubia", "Function": "Storage / Ritual" },
  },
  {
    title: "Trade Coin", badge: "Recovered",
    desc: "Economic history remains.", fullDesc: "Economic history remains — a coin that once passed through the hands of merchants across continents.",
    img: "https://i.ibb.co.com/dsDcV2TM/coin.jpg",
    details: { "Material": "Bronze / Silver", "Period": "c. 300 CE", "Origin": "Carthage", "Value": "Equivalent to 1 day's labor" },
  },
  {
    title: "Ivory Carving", badge: "Artifact",
    desc: "Intricately carved ivory panel.", fullDesc: "An intricately carved ivory panel depicting court life, crafted by artisans of the Kingdom of Benin.",
    img: "https://images.unsplash.com/photo-1524634126442-357e0eac3c14",
    details: { "Material": "Ivory", "Period": "c. 1500 CE", "Origin": "Benin City", "Function": "Royal Regalia" },
  },
  {
    title: "Bronze Amulet", badge: "Collection",
    desc: "Protective bronze charm.", fullDesc: "A small bronze amulet believed to have offered spiritual protection to its wearer, found near a burial site.",
    img: "https://images.unsplash.com/photo-1610375461369-d613b564f4c4",
    details: { "Material": "Bronze", "Period": "c. 900 CE", "Origin": "Great Zimbabwe", "Function": "Personal Adornment" },
  },
  {
    title: "Ostrich Egg Beads", badge: "Archive",
    desc: "Ancient decorative necklace.", fullDesc: "A necklace strung from ostrich eggshell beads, among the oldest known forms of personal ornamentation in human history.",
    img: "https://images.unsplash.com/photo-1611085583191-a3b181a88401",
    details: { "Material": "Ostrich Eggshell", "Period": "c. 10,000 BCE", "Origin": "Kalahari Region", "Function": "Ornamentation" },
  },
  {
    title: "Ceremonial Mask", badge: "Recovered",
    desc: "Wooden ritual mask.", fullDesc: "A carved wooden mask used in ceremonial dances, representing ancestral spirits within West African tradition.",
    img: "https://images.unsplash.com/photo-1580136579312-94651dfd596d",
    details: { "Material": "Wood, Pigment", "Period": "c. 1600 CE", "Origin": "West Africa", "Function": "Ceremonial Dance" },
  },
];
export { stats, kingdoms, expeditions, atlasLarge, atlasSmall, museum };