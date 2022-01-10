import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// can use environment variables using dotenv
dotenv.config();

connectDB();

// initialise app
const app = express();

// logging library
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use("/api/products", productRoutes);

// 404 pages
app.use(notFound);

// error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
