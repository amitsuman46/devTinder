const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");

app.use(express.json());
app.post("/signup", async (req, res) => {
  try {
    //validation of the data
    validateSignUpData(req);
    //Encrpt the data
    const {firstName, lastName, email, password} = req.body;
    const passwordHash = await bcrypt.hash(password, 10)
    console.log(passwordHash)
    const user = new User({firstName, lastName, email, password:passwordHash});
    await user.save();
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
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
