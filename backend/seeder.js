// only to add initial data to our site
// don't run this unnecessarily since on every import the old data gets wiped completely

// this script will not run with any other script so need to import everything here
import mongoose from "mongoose";
import dotenv from "dotenv";

import users from "./data/users.js";
import products from "./data/products.js";
import User from "./models/userModel.js";
import Prodcut from "./models/productModel.js";
import Order from "./models/orderModel.js";
import connectDB from "./config/db.js";

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // delete anything thats already there and then add new data
    await Order.deleteMany();
    await Prodcut.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);

    // first user was declared admin in users.js
    const adminUser = createdUsers[0]._id;

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Prodcut.insertMany(sampleProducts);

    console.log("Data Imported");
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Prodcut.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed");
    process.exit();
  } catch (err) {
    console.error(`${err}`);
    process.exit(1);
  }
};

/* can call this script using node backend/seeder */
/* if -d is passed as well will destroy */
// takes the 2 argument
if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
