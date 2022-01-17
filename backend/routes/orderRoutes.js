import express from "express";

import {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

//prettier-ignore
{
router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);
router
  .route("/myorders")
  .get(protect, getMyOrders);
router
  .route("/:id")
  .get(protect, getOrderById);
router
  .route("/:id/pay")
  .put(protect, updateOrderToPaid);
}
export default router;
