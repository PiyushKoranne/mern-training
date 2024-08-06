// route is server only
const express = require("express");

const fruitsRouter = express.Router();

fruitsRouter.get("/mango", (req, res)=>{
    res.status(200).send("Mango Icecream");
})

fruitsRouter.get("/Apple", (req, res)=>{
    res.status(200).send("Apple Icecream");
})

module.exports = fruitsRouter;