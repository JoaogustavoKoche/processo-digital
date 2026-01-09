const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const uploadFolder = path.resolve(__dirname, "..", "..", "uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const hash = crypto.randomBytes(8).toString("hex");
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${hash}${ext}`);
  },
});

const upload = multer({ storage });

module.exports = upload;
