const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

const Category = require("../models/categoryModel");

// @description   Get list of categories
// @route         POST /api/v1/categories
// @access        Public
exports.getCategories = asyncHandler(async (req, res) => {
  // Build query
  const documentCount = await Category.countDocuments();
  const features = new ApiFeatures(Category.find(), req.query)
    .paginate(documentCount)
    .filter()
    .search()
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = features;
  const categories = await mongooseQuery;

  res
    .status(200)
    .json({ results: categories.length, paginationResult, data: categories });
});

// @description   Get specific category by id
// @route         GET /api/v1/categories/:id
// @access        Public
exports.getCategory = factory.getOne(Category);

// @description   create category
// @route         POST /api/v1/categories
// @access        Private
exports.createCategory = factory.createOne(Category);

// @description   Update specific category
// @route         PUT /api/v1/categories/:id
// @access        Private
exports.updateCategory = factory.updateOne(Category);

// @description   Delete specific category
// @route         DELETE /api/v1/categories/:id
// @access        Private
exports.deleteCategory = factory.deleteOne(Category);
