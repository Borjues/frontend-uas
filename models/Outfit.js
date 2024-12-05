const mongoose = require("mongoose");

const outfitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Outfit = mongoose.model("Outfit", outfitSchema);

module.exports = Outfit;
