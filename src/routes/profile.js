const express = require("express");
const profileRouter = express.Router();
// const User = require("./models/user");
const {userAuth} = require("../middlewares/auth")

//Profile of the user
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
      const user = req.user;    
      res.send(user);
    } catch (err) {
      res.status(400).send("Something Went Wrong");
    }
  });

module.exports = profileRouter;