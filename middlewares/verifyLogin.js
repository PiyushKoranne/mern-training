const jwt = require("jsonwebtoken");
const personModel = require("../models/personModel");

async function verifyLogin(req, res, next) {
    try {
        const token = req.body.token;
        const chhupi_hui_info = jwt.verify(token, "SECREY_KEY");
        
        if(!chhupi_hui_info) return res.render("login");

        req.jwt = chhupi_hui_info;
        next();

    } catch (error) {
        console.log(error);
        res.render("login");
    }
}

async function handleLogin(req, res) {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const personMatch = await personModel.findOne({email: email});

        if(!personMatch) return res.status(401).json({msg:"Email and / or password incorrect"});

    } catch (error) {
        console.log(error)
    }
}

module.exports = verifyLogin;