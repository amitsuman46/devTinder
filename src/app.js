const express = require("express");

const app = express();

//the below callback function is known as request handler, app.use is known as the middleware

app.get("/user", (req, res)=>{
    res.send({fisrtName: "Amit", lastName: "Suman"})
})

app.post("/user", (req, res)=>{
    res.send("Data Successfully send to Database")
})

app.delete("/user", (req, res)=>{
    res.send("Data Successfully deleted to Database")
})

app.use("/test", (req, res)=>{
    res.send("Hello from the test")
})

//app.listen takes port number and callback function as the parameter 
app.listen(7777, ()=>{
    console.log("Server is successfully listening on port 3000")
});

