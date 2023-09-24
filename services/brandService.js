const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const { uploadSingleImage } = require("../middleware/uploadImageMiddleware");
const factory = require("./handlersFactory");
const Brand = require("../models/brandModel");

// Upload Single Image
exports.uploadBrandImage = uploadSingleImage("image");

// Image Processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 95 })
    .toFile(`uploads/brands/${filename}`);

  req.body.image = filename;
  next();
});

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
