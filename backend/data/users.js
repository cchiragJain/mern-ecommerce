import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Chirag Jain",
    email: "chirag@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Fake User",
    email: "fake@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

export default users;
