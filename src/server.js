import express from "express";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import "dotenv/config";
import mongoose from "mongoose";

import ApiError from "./utils/apiError.js";
import globalError from "./middleware/errorMiddleware.js";
import dbConnection from "./config/database.js";

// Routes
import categoryRoute from "./routes/categoryRoute.js";
import subCategoryRoute from "./routes/subCategoryRoute.js";
import brandRoute from "./routes/brandRoute.js";
import productRoute from "./routes/productRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";

mongoose
  .connect(process.env.DB_URI)
  .then((conn) => {
    console.log(`Database Connected: ${conn.connection.host}`);
  })
  .catch((error) => {
    console.log(error);
  });

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "uploads")));
// Global error-handling middleware
app.use(globalError);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/categories", categoryRoute);
app.use("/api/subcategories", subCategoryRoute);
app.use("/api/brands", brandRoute);
app.use("/api/products", productRoute);
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.all("*", (req, res, next) => {
  next(new ApiError(`Cannot find this route: ${req.originalUrl}`, 400));
});

const { PORT } = process.env;
const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// Event handle rejections outside express
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});
