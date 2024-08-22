// // kaha ?
// // kis naam se ?
// // filter

const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: path.join(__dirname, "../public"),
    filename: (req, file, cb)=>{
        cb(null, 'MERN_DEV_'+file.originalname)
    },
});

const upload = multer({ storage: storage });

module.exports = upload;