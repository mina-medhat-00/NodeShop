import express from "express";
import { auth, allow } from "../services/authService.js";
import {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} from "../utils/validator/brandValidator.js";
import {
  getBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
  uploadBrandImage,
  resizeImage,
} from "../services/brandService.js";

const router = express.Router();
// add auth route
router.use(auth, allow("admin", "manager"));

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, resizeImage, createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getBrandValidator, getBrand)
  .put(uploadBrandImage, resizeImage, updateBrandValidator, updateBrand)
  .delete(auth, allow("admin"), deleteBrandValidator, deleteBrand);

export default router;
