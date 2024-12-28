const express = require("express");
const requestRouter = express.Router();
const {userAuth} = require("../middlewares/auth")
requestRouter.post("/sendConnectionRequest",userAuth, async(req,res)=>{
    console.log("Sending connection Request");
    res.send(req.user.firstName+" is sending Connnection request send");
  })

module.exports = requestRouter;