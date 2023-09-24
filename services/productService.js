const multer = require("multer");
const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

const { uploadMultipleImages } = require("../middleware/uploadImageMiddleware");
const ApiError = require("../utils/apiError");
const factory = require("./handlersFactory");
const Product = require("../models/productModel");

// const multerStorage = multer.memoryStorage();

// const multerFilter = function (req, file, cb) {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new ApiError("Only images allowed", 400), false);
//   }
// };

// const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadProductImages = uploadMultipleImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  { name: "images", maxCount: 5 },
]);

exports.resizeProductImages = asyncHandler(async (req, res, next) => {
  //   1.Image Cover
  if (req.files.imageCover) {
    const imageCoverFilename = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;

    await sharp(req.files.imageCover[0].buffer)
      .resize(2000, 1333)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/products/${imageCoverFilename}`);
    // store in db
    req.body.imageCover = imageCoverFilename;
  }

  //   2.Images
  if (req.files.images) {
    await Promise.all(
      req.files.images.map(async (img, index) => {
        req.body.images = [];
        const imageName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          .resize(2000, 1333)
          .toFormat("jpeg")
          .jpeg({ quality: 95 })
          .toFile(`uploads/products/${imageName}`);
        // store in db
        req.body.images.push(imageName);
      })
    );
  }
  next();
});

// @description   Get list of products
// @route         POST /api/v1/products
// @access        Public
exports.getProducts = factory.getAll(Product);

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
