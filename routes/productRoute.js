const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../utils/validator/productValidator");

const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} = require("../services/productService");

router
  .route("/")
  .get(getProducts)
  .post(
    authService.auth,
    authService.allow("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    authService.auth,
    authService.allow("admin", "manager"),
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(
    authService.auth,
    authService.allow("admin"),
    deleteProductValidator,
    deleteProduct
  );

module.exports = router;
