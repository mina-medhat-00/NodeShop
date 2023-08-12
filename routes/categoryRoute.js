const express = require("express");
const router = express.Router();
const { getCategories } = require("../services/categoryService");

router.post("/", getCategories);

router.get("/", (req, res) => {
  res.send("Test");
});

module.exports = router;
