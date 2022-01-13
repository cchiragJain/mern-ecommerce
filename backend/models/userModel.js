import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      // don't want users with the same id
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// this method will be accessible whereever we use the User model
// .compare will compare the plaintext password with the encrypted password stored
// can't use arrow function because of this keyword :(
userSchema.methods.matchPassword = async function (enteredPassword) {
  // returns a promise
  return await bcrypt.compare(enteredPassword, this.password);
};

// pre saving the data by mongo
userSchema.pre("save", async function (next) {
  // isModified is from mongoose
  // pass in the field you want to check
  // don't want to create new hash
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
