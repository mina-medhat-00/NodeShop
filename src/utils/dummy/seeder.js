import fs from "fs";
import mongoose from "mongoose";
import "dotenv/config";
import Product from "../../models/productModel.js";

console.log(process.env.DB_URI);

// connect to DB
mongoose
  .connect(process.env.DB_URI)
  .then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`);
  })
  .catch((error) => {
    console.log(error);
  });

// Read data
const products = JSON.parse(fs.readFileSync("./src/utils/dummy/products.json"));

// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);
    console.log("Data Inserted");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log("Data Destroyed");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// run the script: node seeder.js -d (destroy) or node seeder.js -i (insert)
if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
