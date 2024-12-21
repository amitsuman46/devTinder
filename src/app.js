const express = require("express");

const app = express();

//the below callback function is known as request handler, app.use is known as the middleware

app.use("/hello", (req, res)=>{
    res.send("Hello from the Hello")
})

app.use("/test", (req, res)=>{
    res.send("Hello from the test")
})

app.use("/", (req, res)=>{
    res.send("Hello from the dashboard")
})

//app.listen takes port number and callback function as the parameter 
app.listen(7777, ()=>{
    console.log("Server is successfully listening on port 3000")
});

