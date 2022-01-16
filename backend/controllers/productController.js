// using asyncHandler so no need to use try-catch blocks
import asyncHandler from "express-async-handler";

import Product from "../models/productModel.js";

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  // setTimeout(() => {}, 1000);
  res.json(products);
});

// @desc Fetch single products
// @route GET /api/products/:id
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await Product.findByIdAndDelete(id);
    res.json({ message: "Product removed" });
  } catch {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getProducts, getProductById,deleteProduct };
