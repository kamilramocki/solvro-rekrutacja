const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const { name } = req.body;
        cb(null, `${name}.png`.replaceAll(" ", "_"));
    }
});

const upload = multer({ storage: storage });

module.exports = { upload };