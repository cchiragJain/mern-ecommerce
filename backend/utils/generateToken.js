import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    // 30days
    expiresIn: "30d",
  });
};

export default generateToken;
