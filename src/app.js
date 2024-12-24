const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());
app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
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
    if(fetchedUser.length===0){
      res.status(404).send("User Not Found")
    }
    res.send(fetchedUser)
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

//FEED API - Get all the user from the database
app.get("/feed", async (req, res) => {
  try{
    const allUsers = await User.find({});
    res.send(allUsers)
  }catch(err){
    res.status(400).send("something went wrong");
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
