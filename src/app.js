const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error("Email is not valid");
    }
    const isPasswordValid = bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      //create a JWT
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder123");
      //attach the token to the cookie and send the response back to the user
      res.cookie("token", token);
      res.send("Login Successful");
    } else throw new Error("Password is not valid");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

//Profile of the user
app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;

    const { token } = cookies;
    //validate the token
    if (!token) throw new Error("Invalid Token");
    const decoded = await jwt.verify(token, "DEV@Tinder123");
    const { _id } = decoded;

    const user = await User.findOne({ _id });
    if (!user) throw new Error("User doesn't exist");
    res.send(user);
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});
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

//FEED API - Get all the user from the database
app.get("/feed", async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.send(allUsers);
  } catch (err) {
    res.status(400).send("something went wrong");
  }
});

//delete the user based on _id
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  //findByIdAndDelete(id) is a shorthand for findOneAndDelete({ _id: id })
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    res.send(deletedUser);
  } catch (err) {
    res.status(400).send("Something went Wrong");
  }
});

//update the user
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = ["photoUrl", "about", "gender", "age", "skills"];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    res.send("User Updated Successfully" + updatedUser);
  } catch (err) {
    res.status(400).send("Something went Wrong" + err);
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
