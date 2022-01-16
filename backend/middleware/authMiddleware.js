import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";

/* verifies the jwt token */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // after Bearer
      token = req.headers.authorization.split(" ")[1];
      // decode using secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // console.log(decoded);

      // also check if the user exists in db
      // exclude the password
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, no token");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

/* verifies if request is by a admin */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized");
  }
};

export { protect, admin };
