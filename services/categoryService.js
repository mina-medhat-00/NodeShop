const factory = require("./handlersFactory");
const Category = require("../models/categoryModel");

// @description   Get list of categories
// @route         POST /api/v1/categories
// @access        Public
exports.getCategories = factory.getAll(Category);

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
