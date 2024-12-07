const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const factory = require("./handlersFactory");
const Category = require("../models/categoryModel");

// Upload Single Image
exports.uploadCategoryImage = uploadSingleImage("image");

// Image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `category-${uuidv4()}-${Date.now()}.jpeg`;
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/categories/${filename}`);
  }
  req.body.image = filename;
  next();
});

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
