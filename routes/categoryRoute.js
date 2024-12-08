const express = require("express");

const router = express.Router();

const subcategoriesRoute = require("./subCategoryRoute");
const authService = require("../services/authService");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../utils/validator/categoryValidator");

const {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategoryImage,
  resizeImage,
} = require("../services/categoryService");

router.use("/:categoryId/subcategories", subcategoriesRoute);

// add auth route
router.use(authService.auth, authService.allow("admin", "manager"));

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
  .delete(
    authService.auth,
    authService.allow("admin"),
    deleteCategoryValidator,
    deleteCategory
  );

module.exports = router;
