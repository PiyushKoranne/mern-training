// route is server only
const express = require("express");
const {addPerson, deletePerson, getPersons, renderEditPersons, updatePerson} = require("../controllers/personController")
const upload = require("../middlewares/fileUploader");
const personRouter = express.Router();

personRouter.post("/add-person", upload.any(), addPerson);
personRouter.post("/update-person", updatePerson);
personRouter.post("/delete-person", deletePerson);
personRouter.get("/get-persons", getPersons);
personRouter.get("/edit-persons", renderEditPersons)

module.exports = personRouter;