import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

// can use environment variables using dotenv
dotenv.config();

connectDB();

// initialise app
const app = express();

// middleware that will parse json fromm post requests
app.use(express.json());

// logging library
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Api is running");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);

// 404 pages
app.use(notFound);

// error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
