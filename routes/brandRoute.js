const express = require("express");

const router = express.Router();

const authService = require("../services/authService");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../utils/validator/brandValidator");

const {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} = require("../services/brandService");

router
  .route("/")
  .get(getBrands)
  .post(
    authService.auth,
    authService.allow("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    createBrandValidator,
    createBrand
  );

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(
    authService.auth,
    authService.allow("admin", "manager"),
    uploadBrandImage,
    resizeImage,
    updateBrandValidator,
    updateBrand
  )
  .delete(
    authService.auth,
    authService.allow("admin"),
    deleteBrandValidator,
    deleteBrand
  );

module.exports = router;
