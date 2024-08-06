// route is server only
const express = require("express");

const icecreamRouter = express.Router();

icecreamRouter.get("/chocolate", (req, res)=>{
    res.status(200).send("Chocolate Icecream");
})

icecreamRouter.get("/vanilla", (req, res)=>{
    res.status(200).send("Vanilla Icecream");
})

module.exports = icecreamRouter;