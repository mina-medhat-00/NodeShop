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
import Category from "../models/categoryModel.js";

// Upload Single Image
export const uploadCategoryImage = uploadSingleImage("image");

// Image Processing
export const resizeImage = asyncHandler(async (req, res, next) => {
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
// @route         POST /api/categories
// @access        Public
export const getCategories = getAll(Category);

// @description   Get specific category by id
// @route         GET /api/categories/:id
// @access        Public
export const getCategory = getOne(Category);

// @description   create category
// @route         POST /api/categories
// @access        Private
export const createCategory = createOne(Category);

// @description   Update specific category
// @route         PUT /api/categories/:id
// @access        Private
export const updateCategory = updateOne(Category);

// @description   Delete specific category
// @route         DELETE /api/categories/:id
// @access        Private
export const deleteCategory = deleteOne(Category);
