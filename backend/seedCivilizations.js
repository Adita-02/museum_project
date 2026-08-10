// seedCivilizations.js
//  node seedCivilizations.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import Civilization from "./models/Civilization.js";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const civilizationsData = [
  {
    continent: "americas",
    img: "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?w=600&q=75",
    era: "Paleoindian",
    period: "12,000 – 10,000 BCE",
    name: "Clovis People",
    desc: "The earliest confirmed inhabitants of North America — master hunters who shaped the continent's first culture with iconic fluted spear points.",
    region: "North America",
    order: 1,
  },
  {
    continent: "americas",
    img: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=600&q=75",
    era: "Archaic",
    period: "3,500 – 1,800 BCE",
    name: "Norte Chico",
    desc: "The earliest complex civilization in the Americas — monumental mounds rising from Peru's coast, built without a writing system.",
    region: "South America",
    order: 2,
  },
  {
    continent: "americas",
    img: "/history1.jpg",
    era: "Formative",
    period: "1,200 – 400 BCE",
    name: "Olmec",
    desc: "The mother culture of Mesoamerica — creators of colossal basalt heads, long-distance trade, and the region's earliest glyphs.",
    region: "Mesoamerica",
    order: 3,
  },
  {
    continent: "americas",
    img: "https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=600&q=75",
    era: "Woodland",
    period: "200 BCE – 700 CE",
    name: "Hopewell",
    desc: "Masters of earthwork and continent-spanning trade, whose burial mounds still crown Ohio's valleys with silent grandeur.",
    region: "Eastern Woodlands",
    order: 4,
  },
  {
    continent: "americas",
    img: "/history2.jpg",
    era: "Classic",
    period: "250 – 900 CE",
    name: "Maya Classic",
    desc: "Astronomers and architects who raised jungle pyramids and wrote in glyphs — a civilization of breathtaking intellectual achievement.",
    region: "Mesoamerica",
    order: 5,
  },
  {
    continent: "americas",
    img: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=600&q=75",
    era: "Imperial",
    period: "1,400 – 1,533 CE",
    name: "Inca Empire",
    desc: "The largest pre-Columbian empire — mountain road-builders whose terraced farms and sacred cities defy modern comprehension.",
    region: "South America",
    order: 6,
  },
];
const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected ✅");
   
    await Civilization.deleteMany({ continent: "americas" });
    await Civilization.insertMany(civilizationsData);
    console.log("6টা civilization insert হয়ে গেছে ✅");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed ❌", err);
    process.exit(1);
  }
};
seedDB();