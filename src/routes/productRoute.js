import express from "express";
import { auth, allow } from "../services/authService.js";
import {
  getProductValidator,
  createProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../utils/validator/productValidator.js";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  resizeProductImages,
} from "../services/productService.js";

const router = express.Router();
// add auth route
router.use(auth, allow("admin", "manager"));

router
  .route("/")
  .get(getProducts)
  .post(
    uploadProductImages,
    resizeProductImages,
    createProductValidator,
    createProduct
  );

router
  .route("/:id")
  .get(getProductValidator, getProduct)
  .put(
    uploadProductImages,
    resizeProductImages,
    updateProductValidator,
    updateProduct
  )
  .delete(auth, allow("admin"), deleteProductValidator, deleteProduct);

export default router;
