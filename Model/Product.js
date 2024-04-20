const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String },
  description: { type: String },
  price: { type: Number },
  category: { type: String },
  image: { type: String },
  sold: { type: Boolean },
  dateOfSale: { type: Date },
});

ProductSchema.index({
  title: "text",
  description: "text",
});

ProductSchema.index({
  price: 1,
});

ProductSchema.index({
  dateOfSale: 1,
});

module.exports = mongoose.model("Product", ProductSchema);
