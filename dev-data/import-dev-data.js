const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("../models/productModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE_STRING;

console.log(DB);

mongoose.connect(DB).then((con) => {
  //   console.log(con.connections);
  console.log("DB Connection Successful");
});
// console.log(DB);

// READING JSON FILE
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, "utf-8")
);

// IMPORTING ALL THE DATA INTO DATABASE

const importData = async () => {
  try {
    // Tour.create can also accept an array
    await Product.create(products);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
};

// TO DELETE ALL DATA IN THE DATABASE
const deleteData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Deleted Successfully!");
  } catch (err) {
    console.log(err);
  }
};

// We'll execute both the deleteData and importData from the Command line
// So we're going to run this file using the Command Line

console.log(process.argv);

if (process.argv[2] === "--import") {
  importData();
  // process.exit();
} else if (process.argv[2] === "--delete") {
  console.log("Deleteing.....");
  deleteData();
  // process.exit();
}
