const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const userRouter = express.Router();

const SAFE_USER_DATA = [
  "firstName",
  "lastName",
  "age",
  "gender",
  "photoUrl",
  "about",
];

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", SAFE_USER_DATA);
    res.json({ message: "Data fetched Succefully", connectionRequest });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", SAFE_USER_DATA)
      .populate("toUserId", SAFE_USER_DATA);

    const data = connectionRequest.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString())
        return row.toUserId;
      return row.fromUserId;
    });

    res.json({ message: "Connection Found Succefully", connectionRequest: data });
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = userRouter;
