const multer = require('multer');
const path = require('path');

module.exports = multer({
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename: (req, file, cb) => {
      const nome = Date.now() + '-' + file.originalname;
      cb(null, nome);
    },
  }),
});
