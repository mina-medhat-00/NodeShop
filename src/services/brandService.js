import sharp from "sharp";
import asyncHandler from "express-async-handler";
import { v4 as uuidv4 } from "uuid";

import { uploadSingleImage } from "../middleware/uploadImageMiddleware.js";
import {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
} from "./handlersFactory.js";
import Brand from "../models/brandModel.js";

// Upload Single Image
export const uploadBrandImage = uploadSingleImage("image");

// Image Processing
export const resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `brand-${uuidv4()}-${Date.now()}.jpeg`;
  // images are optional
  if (req.file) {
    await sharp(req.file.buffer)
      .resize(600, 600)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/brands/${filename}`);
  }
  req.body.image = filename;
  next();
});

// @description   Get list of brands
// @route         POST /api/brands
// @access        Public
export const getBrands = getAll(Brand);

// @description   Get specific brand by id
// @route         GET /api/brands/:id
// @access        Public
export const getBrand = getOne(Brand);

// @description   create brand
// @route         POST /api/brands
// @access        Private
export const createBrand = createOne(Brand);

// @description   Update specific brand
// @route         PUT /api/brands/:id
// @access        Private
export const updateBrand = updateOne(Brand);

// @description   Delete specific brand
// @route         DELETE /api/brands/:id
// @access        Private
export const deleteBrand = deleteOne(Brand);
