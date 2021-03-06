import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";

import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
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

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);
app.get("/api/config/paypal", (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// __dirname not available in es modules syntax
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

/* RUN IN PRODUCTION ONLY */
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("Api is running");
  });
}

// 404 pages
app.use(notFound);

// error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}`)
);
