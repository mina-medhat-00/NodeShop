const slugify = require("slugify");
const CategoryModel = require("../models/categoryModel");
const asyncHandler = require("express-async-handler");

// @description   Get list of categories
// @route         POST /api/v1/categories
// @access        Public
exports.getCategories = asyncHandler(async (req, res) => {
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 5;
  const skip = (page - 1) * limit;
  const categories = await CategoryModel.find({}).skip(skip).limit(limit);
  res.status(200).json({ results: categories.length, page, data: categories });
});

// @description   Get specific category by id
// @route         GET /api/v1/categories/:id
// @access        Public
exports.getCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findById(id);

  if (!category) {
    res.status(404).json({ msg: `No category for this id ${id}` });
  }
  res.status(200).json({ data: category });
});

// @description   create category
// @route         POST /api/v1/categories
// @access        Private
exports.createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name;
  // async await
  const category = await CategoryModel.create({ name, slug: slugify(name) });
  res.status(201).json({ data: category });
});

// @description   Update specific category
// @route         PUT /api/v1/categories/:id
// @access        Private
exports.updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const category = await CategoryModel.findOneAndUpdate(
    { _id: id },
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!category) {
    res.status(404).json({ msg: `No category for this id ${id}` });
  }
  res.status(200).json({ data: category });
});

// @description   Delete specific category
// @route         DELETE /api/v1/categories/:id
// @access        Private
exports.deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    res.status(404).json({ msg: `No category for this id ${id}` });
  }
  res.status(200).send();
});
