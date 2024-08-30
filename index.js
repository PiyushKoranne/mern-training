const express = require("express");

const server = express();
const mongoose = require("mongoose");
const cors = require('cors');
const ejs = require("ejs");
const expressLayouts = require('express-ejs-layouts');
const authRouter = require("./routes/authRoutes");

server.set('view engine', 'ejs');



mongoose.connect('mongodb://localhost:27017/mernstackdb');

// static
server.use(express.static("public"));
server.use(expressLayouts);
server.use(express.json());
server.use(express.urlencoded());
server.use(cors({origin:'http://localhost:5173'}))


server.get("/", (req, res) =>{ res.status(200).json({msg:"Server is runnign"})})
server.use("/auth", authRouter);

mongoose.connection.once("connected", ()=>{
    console.log("Database is connected");
    server.listen(4000, ()=>{
        console.log("server is listening");
    })
})

