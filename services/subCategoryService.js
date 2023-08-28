const slugify = require("slugify");
const asyncHandler = require("express-async-handler");

const SubCategory = require("../models/categoryModel");

// @description   create category
// @route         POST /api/v1/categories
// @access        Private
exports.createSubCategory = asyncHandler(async (req, res) => {
  const { name, category } = req.body;
  const subCategory = await SubCategory.create({
    name,
    slug: slugify(name),
    category,
  });
  res.status(201).json({ data: subCategory });
});
