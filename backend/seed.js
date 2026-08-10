import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import Place from "./models/Place.js";
import Stat from "./models/africa/Stat.js";
import Kingdom from "./models/africa/Kingdom.js";
import Expedition from "./models/africa/Expedition.js";
import AtlasItem from "./models/africa/AtlasItem.js";
import MuseumItem from "./models/africa/MuseumItem.js";

import { places } from "./data/placesSeed.js";
import { stats, kingdoms, expeditions, atlasLarge, atlasSmall, museum } from "./data/africaSeed.js";

mongoose.connect(process.env.MONGO_URI).then(async () => {
  // Places
  await Place.deleteMany({});
  const cleanedPlaces = places.map(({ id, ...rest }) => rest);
  await Place.insertMany(cleanedPlaces);
  console.log("✅ Seeded", cleanedPlaces.length, "places");

  // Stats
  await Stat.deleteMany({});
  await Stat.insertMany(stats);
  console.log("✅ Seeded", stats.length, "stats");

  // Kingdoms
  await Kingdom.deleteMany({});
  await Kingdom.insertMany(kingdoms);
  console.log("✅ Seeded", kingdoms.length, "kingdoms");

  // Expeditions
  await Expedition.deleteMany({});
  await Expedition.insertMany(expeditions);
  console.log("✅ Seeded", expeditions.length, "expeditions");

  // Atlas items (large + small combined, tagged with size)
  await AtlasItem.deleteMany({});
  const atlasCombined = [
    { ...atlasLarge, size: "large" },
    ...atlasSmall.map(item => ({ ...item, size: "small" })),
  ];
  await AtlasItem.insertMany(atlasCombined);
  console.log("✅ Seeded", atlasCombined.length, "atlas items");

  // Museum
  await MuseumItem.deleteMany({});
  await MuseumItem.insertMany(museum);
  console.log("✅ Seeded", museum.length, "museum items");

  process.exit();
}).catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});