import {
  getOne,
  getAll,
  createOne,
  updateOne,
  deleteOne,
} from "./handlersFactory.js";
import SubCategory from "../models/subCategoryModel.js";

// validation middleware when updating subcategories with no category
export const setCategoryIdToBody = (req, res, next) => {
  // Nested route
  if (!req.body.category) req.body.category = req.params.categoryId;
  next();
};

// Nested Route
// GET /api/categories/:categoryId/subcategories
export const createFilterObj = (req, res, next) => {
  let filterObject = {};
  if (req.params.categoryId) filterObject = { category: req.params.categoryId };
  req.filterObject = filterObject;
  next();
};

// @description   Get list of subcategories
// @route         POST /api/subcategories
// @access        Public
export const getSubCategories = getAll(SubCategory);

// @description   Get specific subCategory by id
// @route         GET /api/subcategories/:id
// @access        Public
export const getSubCategory = getOne(SubCategory);

// @description   create subcategory
// @route         POST /api/subcategories
// @access        Private
export const createSubCategory = createOne(SubCategory);

// @description   Update specific subcategory
// @route         PUT /api/subcategories/:id
// @access        Private
export const updateSubCategory = updateOne(SubCategory);

// @description   Delete specific subcategory
// @route         DELETE /api/subcategories/:id
// @access        Private
export const deleteSubCategory = deleteOne(SubCategory);
