const mongoose = require("mongoose");

// 1.Create schema
const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category required"],
      unique: [true, "Category must be true"],
      minLength: [3, "Too short category name"],
      maxLength: [32, "Too long category name"],
    },
    //   for example L and M => shop.com/l-and-m
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  { timestamps: true }
);

// 2.Create model
const CategoryModel = mongoose.model("Category", categorySchema);

module.exports = CategoryModel;
