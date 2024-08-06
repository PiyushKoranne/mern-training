const express = require("express");
const icecreamRouter = require("./routes/icecreamRoutes");
const fruitsRouter = require("./routes/fruitsRoutes");
const server = express();

// static
server.use(express.static("public"));
server.use(express.json());

server.use("/icecreams", icecreamRouter);
server.use("/fruits", fruitsRouter);

server.get("/", (req, res)=>{
    console.log(req.query)
    res.status(201).send(`<h1 style="color:#2271b1;font-weight:bold">Hello ${req.query.name}. Server is running</h1>`);
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


server.listen(4000, ()=>{
    console.log("server is listening");
})