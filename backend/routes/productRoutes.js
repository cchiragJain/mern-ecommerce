import express from "express";
// using asyncHandler so no need to use try-catch blocks
import asyncHandler from "express-async-handler";

import Product from "../models/productModel.js";

const router = express.Router();

// @desc Fetch all products
// @route GET /api/products
// @access Public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await Product.find({});
    // setTimeout(() => {}, 1000);
    res.json(products);
  })
);

// @desc Fetch single products
// @route GET /api/products/:id
// @access Public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

export default router;
