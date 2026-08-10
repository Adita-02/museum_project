import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import Stat from "./models/africa/Stat.js";
import Kingdom from "./models/africa/Kingdom.js";
import Expedition from "./models/africa/Expedition.js";
import AtlasItem from "./models/africa/AtlasItem.js";
import MuseumItem from "./models/africa/MuseumItem.js";
import { stats, kingdoms, expeditions, atlasLarge, atlasSmall, museum } from "./data/africaSeed.js";

mongoose.connect(process.env.MONGO_URI).then(async () => {
  await Promise.all([
    Stat.deleteMany({}), Kingdom.deleteMany({}), Expedition.deleteMany({}),
    AtlasItem.deleteMany({}), MuseumItem.deleteMany({}),
  ]);

  await Stat.insertMany(stats);
  await Kingdom.insertMany(kingdoms);
  await Expedition.insertMany(expeditions);
  await AtlasItem.insertMany([{ ...atlasLarge, size: "large" }, ...atlasSmall.map(a => ({ ...a, size: "small" }))]);
  await MuseumItem.insertMany(museum);

  console.log("✅ Africa data seeded");
  process.exit();
}).catch(err => { console.error(err); process.exit(1); });