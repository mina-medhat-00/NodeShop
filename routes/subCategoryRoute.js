const express = require("express");

const authService = require("../services/authService");

const {
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../utils/validator/subCategoryValidator");

const {
  createSubCategory,
  getSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory,
  setCategoryIdToBody,
  createFilterObj,
} = require("../services/subCategoryService");

// mergeParams: access parameters on other routers
const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    authService.auth,
    authService.allow("admin", "manager"),
    setCategoryIdToBody,
    createSubCategoryValidator,
    createSubCategory
  )
  .get(createFilterObj, getSubCategories);

router
  .route("/:id")
  .get(getSubCategoryValidator, getSubCategory)
  .put(
    authService.auth,
    authService.allow("admin", "manager"),
    updateSubCategoryValidator,
    updateSubCategory
  )
  .delete(
    authService.auth,
    authService.allow("admin"),
    deleteSubCategoryValidator,
    deleteSubCategory
  );

module.exports = router;
