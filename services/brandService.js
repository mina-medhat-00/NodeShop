const factory = require("./handlersFactory");
const Brand = require("../models/brandModel");

// @description   Get list of brands
// @route         POST /api/v1/brands
// @access        Public
exports.getBrands = factory.getAll(Brand);

// @description   Get specific brand by id
// @route         GET /api/v1/brands/:id
// @access        Public
exports.getBrand = factory.getOne(Brand);

// @description   create brand
// @route         POST /api/v1/brands
// @access        Private
exports.createBrand = factory.createOne(Brand);

// @description   Update specific brand
// @route         PUT /api/v1/brands/:id
// @access        Private
exports.updateBrand = factory.updateOne(Brand);

// @description   Delete specific brand
// @route         DELETE /api/v1/brands/:id
// @access        Private
exports.deleteBrand = factory.deleteOne(Brand);
