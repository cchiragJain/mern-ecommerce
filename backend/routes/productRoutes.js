import express from "express";

import {
  getProducts,
  getProductById,
} from "../controllers/productController.js";

const router = express.Router();

// using .route instead of router.get('/',controller)
// can add different methods to the same route then without explicitly mentioning the path
router.route("/").get(getProducts);

router.route("/:id").get(getProductById);

export default router;
