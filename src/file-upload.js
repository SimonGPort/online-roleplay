let aws = require("aws-sdk");
let multer = require("multer");
let multerS3 = require("multer-s3");

aws.config.update({
  secretAccessKey: "AKIAIJ3D6FBU4R6XWN2A",
  accessKeyId: "HoZveXbDUQMjdqrcZZjYWAVHbN+5EwgVem+48cKZ",
  region: "us-east-1",
});

let s3 = new aws.S3();

let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "glorious-roll",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

module.exports = { upload };
