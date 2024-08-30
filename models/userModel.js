const mongoose = require("mongoose")

const UserSchema  = mongoose.Schema({
    name:String,
    email:String,
    password: String,
    otp: String,
    verified: Boolean,
    role:{
        type: String,
        enum: ['ADMIN', 'MANAGER', 'USER']
    },
    forgotPassword:{
        isForgotten: Boolean,
        forgotToken: String,
    }
})


const userModel = mongoose.model("user", UserSchema);

module.exports = userModel;