const mongoose = require("mongoose");

const PersonSchema = new mongoose.Schema({
    name: String,
    age: Number,
    job: String,
    projects: [{
        name:String,
        technology: String,
    }],
    profilePic: String
});

const personModel = mongoose.model("person", PersonSchema);

module.exports = personModel;