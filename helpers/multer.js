const multer = require('multer');

const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg',
};

// Uploading files to the backend
// const storage gets the destination of the file and the filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValidFileType = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid Image Type');
    if (isValidFileType) {
      uploadError = null;
    }
    cb(uploadError, 'public/uploads');
  },
  // the filename has to be specific for each file so that they are not overwritten or lost due to same file naming
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace([' ', '  '], '-');
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`); // ivinpic-outside-2022344.jpg
  },
});

const uploadOptions = multer({ storage: storage });

module.exports = uploadOptions;
