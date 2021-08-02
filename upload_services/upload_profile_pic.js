const util = require("util");
const path = require("path");
const multer = require("multer");

var storage = multer.diskStorage({

  destination: (req, file, callback) => {
    var ftype = file.mimetype.split("/");
    if (ftype[0] == "video") {
      callback(null, path.join(`${__dirname}/../upload/video`));
    } else {
      callback(null, path.join(`${__dirname}/../upload/image`));
    }
  },
  filename: (req, file, callback) => {
    const match = ["image/png", "image/jpeg", "video/mp4"];
    // console.log(file.mimetype);
    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept file type.`;
      return callback(message, null);
    }

    var filename = `${Date.now()}-OTT-${file.originalname}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("txt_profile_pic", 1);
// var uploadFiles = multer({ storage: storage }).any();
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;