const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

const Product = require("../models/productModel");

// @description   Get list of products
// @route         POST /api/v1/products
// @access        Public
exports.getProducts = asyncHandler(async (req, res) => {
  // Build query
  const documentCount = await Product.countDocuments();
  const features = new ApiFeatures(Product.find(), req.query)
    .paginate(documentCount)
    .filter()
    .search("Products")
    .limitFields()
    .sort();

  // Execute query
  const { mongooseQuery, paginationResult } = features;
  const products = await mongooseQuery;

  res
    .status(200)
    .json({ results: products.length, paginationResult, data: products });
});

// @description   Get specific category by id
// @route         GET /api/v1/products/:id
// @access        Public
exports.getProduct = factory.getOne(Product);

// @description   create product
// @route         POST /api/v1/products
// @access        Private
exports.createProduct = factory.createOne(Product);

// @description   Update specific product
// @route         PUT /api/v1/products/:id
// @access        Private
exports.updateProduct = factory.updateOne(Product);

// @description   Delete specific product
// @route         DELETE /api/v1/products/:id
// @access        Private
exports.deleteProduct = factory.deleteOne(Product);
