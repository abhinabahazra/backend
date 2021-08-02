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
    const match = [ "video/mp4","video/quicktime","video/x-matroska","","video/x-msvideo","video/x-ms-wmv","video/mpeg"];
    // console.log(file.mimetype);
    if (match.indexOf(file.mimetype) === -1) {
      var message = `${file.originalname} is invalid. Only accept file type.`;
      return callback(message, null);
    }

    var filename = `${Date.now()}-OTT_S4-${file.originalname}`;
    callback(null, filename);
  }
});

var uploadFiles = multer({ storage: storage }).array("txt_trailer2", 1);
// var uploadFiles = multer({ storage: storage }).any();
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;