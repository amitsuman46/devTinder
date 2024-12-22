const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://admin:Amit123@cluster1.12h69to.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
