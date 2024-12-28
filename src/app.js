const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);

//Get User by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const fetchedUser = await User.find({ email: userEmail });
    if (fetchedUser.length === 0) {
      res.status(404).send("User Not Found");
    }
    res.send(fetchedUser);
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

connectDB()
  .then(() => {
    console.log("Database Connection established");
    app.listen(7777, () => {
      console.log("Server is successfully listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected");
  });
