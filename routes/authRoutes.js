const express = require("express");
const userModel = require("../models/userModel");
const nodemailer = require("nodemailer");
const router  = express.Router();
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res)=>{
    try {
        console.log("registering", req.body);
        const {name, email, password, confirmPassword} = req.body;
        const userMatch = await userModel.findOne({email: email});
        if(userMatch) return res.status(400).json({success: false, message:"User is alerady registered, please login."});

        const createOTP = () => {
            let otp = '';
            for(let i=0; i<5; i++){
                otp += String(Math.floor(Math.random()*10));
            }
            return otp;
        }

        const otp = createOTP()
        // SMTP_MAIL=
        // SMTP_MAIL_PSWD=
        const newUser = new userModel({
            name,
            email,
            password,
            otp: otp,
            role:"USER",
            verified: false
        });
        await newUser.save();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: `citstestjitu@gmail.com`, // generated user
                pass: `ftscrdbjqllvqxto`  // generated password
            }
        });


        const mailOptions = {
            from: 'hrashikeshapandey@gmail.com',
            to: email,
            subject: 'Email Verification OTP',
            html: `<p>Dear sir, please enter this otp <span style="display:inline-block;padding:5px;background-color:#f1f5f9; color:#059669;font-weight:600;">${otp}</span> to verify your email</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                log('Email sent: ' + info.response);
            }
        });

        res.status(200).json({success: true, message:"Registration successful"});

    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:"Internal Server Error"})
    }
})

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log("Logging in", req.body);
        const match = await userModel.findOne({email: email});
        if(!match) return res.status(400).json({success: false, message:"Please check your credentials"});
        if(match.password === password){
            const token = await jwt.sign({email: email}, "SECRET_KEY")
            res.status(200).json({success: true, message:"Logged In", access_token: token});
        } else {
            res.status(400).json({success: false, message:"Email and/or password incorrect"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:"Internal server error"});
    }
})

router.post("/forgot-password", async (req, res) => {
    try {
        const {email} = req.body;
        const token = await jwt.sign({email: email}, "SECRET_KEY");
        const match = await userModel.findOne({email: email});
        if(!match) return res.status(400).json({success: false, message:"Please check your credentials"});
        match.forgotPassword.isForgotten = true;
        match.forgotPassword.forgotToken = token;

        await match.save();

        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: `citstestjitu@gmail.com`, // generated user
                pass: `ftscrdbjqllvqxto`  // generated password
            }
        });


        const mailOptions = {
            from: 'hrashikeshapandey@gmail.com',
            to: email,
            subject: 'Email Verification OTP',
            html: `<p>Dear sir, please use this link <a href="http://localhost:4000/auth/render-forgot?token=${token}" style="display:inline-block;padding:5px;background-color:#f1f5f9; color:#059669;font-weight:600;">Reset Link</a> to reset your password.</p>`
        }
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                log('Email sent: ' + info.response);
            }
        });
        res.status(200).json({success: true, message:"Email sent"})
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:"Internal server error"});
    }
})

router.post("/verify-registration", async (req, res) => {
    try {
        const {otp, email} = req.body;

        const userMatch = await userModel.findOne({email: email});
        if(!userMatch) return res.status(400).json({success: false, message:"User Not Found"});

        if(otp === userMatch.otp){
            userMatch.verified = true;
            await userMatch.save();
            res.status(200).json({success: true, message:"verified"})
        } else {
            res.status(400).json({success: false, message:"Please enter correct OTP"});
        }

        
    } catch (err){
        res.status(500).json({success: false, message:"Internal Server Error"})
    }
})

router.get("/render-forgot", async (req, res) => {
    const token = req.query.token;
    res.render('forgotpassword', {
        token: token
    })
})

router.post("/reset-password", async (req, res) => {
    try {
        const {token, newPassword, confirmPassword} = req.body;
        const decoded = await jwt.verify(token, "SECRET_KEY");
        const match = await userModel.findOne({email: decoded.email});
        if(newPassword === confirmPassword) {
            match.password = newPassword;
            match.forgotPassword.isForgotten = false;
            await match.save();
            res.status(200).json({success: true, message: "Password is reset"})
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message:"Internal Server Error"})
    }
})


router.get("/verify-session", async (req, res)=>{
    const bearerToken = req.headers['Authorization'] || req.headers['authorization'];
    const token = bearerToken.split(" ")[1];
    const decoded = await jwt.verify(token, 'SECRET_KEY');
    if(decoded){
        console.log("Session Verified")
        res.status(200).json({success: true, message:"Session Verified"})
    }
})

module.exports = router