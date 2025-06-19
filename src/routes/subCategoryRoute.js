import express from "express";
import { auth, allow } from "../services/authService.js";
import {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} from "../utils/validator/subCategoryValidator.js";
import {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} from "../services/subCategoryService.js";

// mergeParams: access parameters on other routers
const router = express.Router({ mergeParams: true });

// add auth route
router.use(auth, allow("admin", "manager"));

router
  .route("/")
  .post(setCategoryIdToBody, createSubCategoryValidator, createSubCategory)
  .get(createFilterObj, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(auth, allow("admin"), deleteSubCategoryValidator, deleteSubCategory);

export default router;
