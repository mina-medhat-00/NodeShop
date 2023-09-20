const slugify = require("slugify");
const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
const factory = require("./handlersFactory");

const Brand = require("../models/brandModel");

// @description   Get list of brands
// @route         POST /api/v1/brands
// @access        Public
exports.getBrands = asyncHandler(async (req, res) => {
  // Build query
  const documentCount = await Brand.countDocuments();
  const features = new ApiFeatures(Brand.find(), req.query)
    .paginate(documentCount)
    .filter()
    .search()
    .limitFields()
    .sort();
  // Execute query
  const { mongooseQuery, paginationResult } = features;
  const brands = await mongooseQuery;

  res
    .status(200)
    .json({ results: brands.length, paginationResult, data: brands });
});

// @description   Get specific brand by id
// @route         GET /api/v1/brands/:id
// @access        Public
exports.getBrand = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const brand = await Brand.findById(id);

  if (!brand) {
    return next(new ApiError(`No brand for this id ${id}`, 404));
  }
  res.status(200).json({ data: brand });
});

// @description   create brand
// @route         POST /api/v1/brands
// @access        Private
exports.createBrand = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const brand = await Brand.create({ name, slug: slugify(name) });
  res.status(201).json({ data: brand });
});

// @description   Update specific brand
// @route         PUT /api/v1/brands/:id
// @access        Private
exports.updateBrand = factory.updateOne(Brand);

// @description   Delete specific brand
// @route         DELETE /api/v1/brands/:id
// @access        Private
exports.deleteBrand = factory.deleteOne(Brand);
