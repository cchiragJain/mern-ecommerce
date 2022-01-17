import mongoose from "mongoose";

const Schema = mongoose.Schema;

const reviewSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    // this is the individual review rating and not the average rating
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new Schema(
  {
    user: {
      // to know which user(admin) created the product
      type: Schema.Types.ObjectId,
      required: true,
      // adds a realtion b/w the user and product models
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    // will have different review documents inside it
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
