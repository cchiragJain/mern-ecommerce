import express from "express";

import { authUser, getUserProfile } from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/login").post(authUser);

// protect middleware will run when we access that route
router.route("/profile").get(protect, getUserProfile);

export default router;
