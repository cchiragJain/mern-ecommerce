import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";

// @desc Auth user & get token
// @route POST /api/users/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  // able to acess them because using express.json() middleware
  const { email, password } = req.body;

  // find user by email
  const user = await User.findOne({ email });

  // if user exists and the password is same
  // matchPassword uses bcrypt and is stored as a method on the userModel
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: null,
    });
  } else {
    res.status(404);
    throw new Error("Invalid email or password");
  }
});

export { authUser };
