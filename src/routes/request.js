const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status Type: " + status });
      }
      //check if touserId exist in DB
      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.status(400).json({ message: "User is not defined" });
      }

      //IF there is an existing connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .json({ message: "Connection Request already exist" });
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: `${req.user.firstName} is ${status} in ${toUser.firstName}`,
        data,
      });
    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try{
      const loggedInUser = req.user;
      const {status, requestId} = req.params;
      console.log(requestId)
      //validation the status
      //validate the requestID
      //toUserID === loggedInUserID
      //status= interested
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status Type: " + status });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested"
      })
      if(!connectionRequest){
        res.status(404).json({message:"Connnection Not Found"})
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: `Connection Request ${status}`,
        data
      })
    }catch(err){
      res.status(400).send("Error:"+err.message)
    }
  }
);

module.exports = requestRouter;
