const personModel = require("../models/personModel");

const addPerson = async (req, res)=>{
    // console.log(req.body, req.files);
    const newPerson = new personModel({
        name: req.body.name,
        age: parseInt(req.body.age),
        job: req.body.job,
        projects:[{
            name: req.body.project,
            technology: req.body.tech,
        }],
        profilePic: req.files[0].filename
    });
    await newPerson.save();
    res.status(200).json({});
}

const getPersons = async (req, res) => {
    const allPersons = await personModel.find({});
    res.status(200).json({persons: allPersons})
}

const renderEditPersons = async (req, res) => {
    const allPersons = await personModel.find({});
    res.render('editperson', {allPersons: allPersons});
}

const deletePerson = async (req, res) => {
    console.log(req.body);
    const personId = req.body.personId;
    await personModel.deleteOne({_id: personId});
    res.status(200).json({msg: "deleted person"})
}

const updatePerson = async (req, res) => {
    console.log("UPDATING PERSON",req.body);
    const personMatch = await personModel.findOneAndUpdate({_id: req.body.personId},{
        $set:{
            name: req.body.name,
            age: req.body.age,
            job: req.body.job,
            projects: [
                {
                    name:req.body.projectName,
                    technology: req.body.tech
                }
            ]
        }
    });
    await personMatch.save();
    res.redirect("/person/edit-persons");
}

module.exports = {addPerson, deletePerson, getPersons, renderEditPersons, updatePerson}