const mongoose = require("mongoose");
const Product = require("../Model/Product");
const axios = require("axios");
const URL = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";
//Db connect
const db = mongoose
  .connect(process.env.Mongo_URI)
  .then(() => {
    console.log("Succesfully connected to the DataBase");
  })
  .catch((error) => {
    console.log(error);
  });

const ConnectDb = mongoose.connection;
//Data seeding
ConnectDb.once("open", async () => {
  if ((await Product.countDocuments().exec()) > 0) return;
  try {
    const getData = await axios.get(URL);
    const products = getData.data;
    await Product.insertMany(products);
    console.log(`Data seeded successfully`);
  } catch (error) {
    console.error("Error seeding data:", error);
  }
});

module.exports = { db, ConnectDb };
