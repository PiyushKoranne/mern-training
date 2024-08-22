const mongoose = require("mongoose");

const TestSchema = new mongoose.Schema({
    subject: String,
    marks: Number,
    isPass: Boolean 
});

const testModel = mongoose.model("merntest", TestSchema);

module.exports = testModel;