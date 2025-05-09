const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const {
  validateEditProfileData,
  validatePasswordChange,
} = require("../utils/validation");

//Profile of the user
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("Something Went Wrong");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req.body)) {
      throw new Error("Invalid Edit Request");
    }
    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const isPasswordValid =  validatePasswordChange(req);
    const loggedInUser = req.user;
    if (isPasswordValid) {
      // Update the password and hash it before saving (assuming the user model handles password hashing in a pre-save hook)
      loggedInUser.password = newPassword;
      await loggedInUser.save();
    }

    res.json({
      message: `${loggedInUser.firstName}, your password has been updated successfully`,
    });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = profileRouter;
