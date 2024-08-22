const express = require("express");
const icecreamRouter = require("./routes/icecreamRoutes");
const fruitsRouter = require("./routes/fruitsRoutes");
const personRouter = require("./routes/personRoutes");
const server = express();
const mongoose = require("mongoose");
const testModel = require("./models/testModel");
const cors = require('cors');
const ejs = require("ejs");
const expressLayouts = require('express-ejs-layouts');
const verifyLogin = require("./middlewares/verifyLogin");

server.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/mernstackdb');

// static
server.use(express.static("public"));
server.use(expressLayouts);
server.use(express.json());
server.use(express.urlencoded());
server.use(cors({origin:'http://localhost:5173'}))

server.use("/icecreams", icecreamRouter);
server.use("/fruits", fruitsRouter);
server.use("/person", personRouter);

server.get("/", verifyLogin, (req, res)=>{
    console.log(req.query)
    res.status(201).send(`<h1 style="color:#2271b1;font-weight:bold">Hello ${req.query.name}. Server is running</h1>`);
})

server.get("/render", (req, res) => {
    res.render('fruit', {fruits: ["Pineapple", "Mango", "Strawberry"]});
})

server.post("/", (req, res)=>{
    console.log("This is the post data =>",req.body);
    // process
    const name = req.body.name;
    const age = req.body.age;

    res.status(200).json({msg:`Hello ${name}. You are ${age} years old.`})
    // database
})

server.get("/image", (req, res)=>{
    res.status(200).json({msg: "okay on image"})
})


server.get("/add-data", async (req, res)=>{
    const newTest = new testModel({
        subject:"Commerce",
        marks: 70,
        isPass: true,
        fruit: "apple"
    });
    await newTest.save();
    res.status(200).json({msg:"database entry created"})
})

server.get("/get-data", async (req, res)=>{
    const data = await testModel.findOne({subject:"Maths"})
    res.status(200).send(`<h1 style="color:green;">Mongodb Data:</h1><p>Name: ${data.subject}, marks: ${data.marks}, ${data.isPass ? '<span style="width:10px;height:10px;background-color:green;display:inline-block"></span>': '<span style="width:10px;height:10px;background-color:red;display:inline-block"></span>'}</p>`)
})

server.post("/form-add", async (req,res)=>{
    console.log("HERE =>",req.body);
    const subject = req.body.subject;
    const marks = parseInt(req.body.marks);
    const isPass = req.body.isPass === 'on'? true : false;
    const newTest = new testModel({
        subject:subject,
        marks: marks,
        isPass: isPass,
    });
    await newTest.save();
}) 

mongoose.connection.once("connected", ()=>{
    console.log("Database is connected");
    server.listen(4000, ()=>{
        console.log("server is listening");
    })
})

