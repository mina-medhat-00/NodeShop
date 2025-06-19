import express from "express";
import subcategoriesRoute from "./subCategoryRoute.js";
import { auth, allow } from "../services/authService.js";
import {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../utils/validator/categoryValidator.js";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} from "../services/categoryService.js";

const router = express.Router();
router.use("/:categoryId/subcategories", subcategoriesRoute);

// add auth route
router.use(auth, allow("admin", "manager"));

router
  .route("/")
  .get(getCategories)
  .post(
    uploadCategoryImage,
    resizeImage,
    createCategoryValidator,
    createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, getCategory)
  .put(
    uploadCategoryImage,
    resizeImage,
    updateCategoryValidator,
    updateCategory
  )
  .delete(auth, allow("admin"), deleteCategoryValidator, deleteCategory);

export default router;
