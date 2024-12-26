const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const {userAuth} = require("./middlewares/auth")
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
    const isPasswordValid =  user.validatePassword(password)
    if (isPasswordValid) {
      //create a JWT
      const token = await user.getJWT();
      //attach the token to the cookie and send the response back to the user
      res.cookie("token", token, {expires: new Date(Date.now() + 8 *3600000)});
      res.send("Login Successful");
    } else throw new Error("Password is not valid");
  } catch (err) {
    res.status(400).send("Error saving the user: " + err.message);
  }
});

//Profile of the user
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;    
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

app.post("/sendConnectionRequest",userAuth, async(req,res)=>{
  console.log("Sending connection Request");
  res.send(req.user.firstName+" is sending Connnection request send");
})

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
