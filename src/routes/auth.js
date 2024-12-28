const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    //validation of the data
    validateSignUpData(req);
    //Encrpt the data
    const { firstName, lastName, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

//login API
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Email is not valid");
    }
    const isPasswordValid = user.validatePassword(password);
    if (isPasswordValid) {
      //create a JWT
      const token = await user.getJWT();
      //attach the token to the cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successful");
    } else throw new Error("Password is not valid");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logout Successfully");
});
module.exports = authRouter;
