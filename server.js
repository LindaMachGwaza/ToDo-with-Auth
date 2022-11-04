//passwords and port stored in env file
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
//import routes
const authRoute = require("./routes/auth");
const toDosRoute = require("./routes/todos");
//import cookie-parser
const cookieParser = require ("cookie-parser");
//initialize express
const app = express();
const path = require('path');

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.get("/api", (req, res) =>{
    res.send("Mern toDo app");
});


//auth and toDos routes
app.use("/api/auth", authRoute);
app.use("/api/todos", toDosRoute);

app.use(express.static(path.resolve(__dirname, "./client/build")));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "./client/build", "index.html"))
})

//connect to mongodb
mongoose.connect(process.env.MONGO_URL).then(() =>{
    console.log("Connected to database!");

//Listening port
app.listen(process.env.PORT, () =>{
    console.log(`Server is running on port http://localhost:${process.env.PORT}`);
});
//log error if failed to connect
}).catch((error) =>{
    console.log(error);
});


//Sources used include Hyperiondev notes, previous Tasks, You Tube, Geeksforgeeks, W3Schools, Google.com and Stackoverflow