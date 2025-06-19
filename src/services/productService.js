import sharp from"sharp";
import asyncHandler from"express-async-handler";
import { v4 as uuidv4 } from "uuid";

import { uploadMultipleImages } from"../middleware/uploadImageMiddleware.js";
import {getOne,getAll,createOne,updateOne,deleteOne} from"./handlersFactory.js";
import Product from"../models/productModel.js";

export const uploadProductImages = uploadMultipleImages([
  {
    name: "imageCover",
    maxCount: 1,
  },
  { name: "images", maxCount: 5 },
]);

export const resizeProductImages = asyncHandler(async (req, res, next) => {
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
export const getProducts = getAll(Product);

// @description   Get specific category by id
// @route         GET /api/v1/products/:id
// @access        Public
export const getProduct = getOne(Product);

// @description   create product
// @route         POST /api/v1/products
// @access        Private
export const createProduct = createOne(Product);

// @description   Update specific product
// @route         PUT /api/v1/products/:id
// @access        Private
export const updateProduct = updateOne(Product);

// @description   Delete specific product
// @route         DELETE /api/v1/products/:id
// @access        Private
export const deleteProduct = deleteOne(Product);
