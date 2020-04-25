let express = require("express");
let router = express.Router();
let upload = require("./file-upload.js");

let simgleUpload = upload.single("image");

router.post("/image-upload", function (req, res) {
  simgleUpload(req, res, function (err) {
    return res.json({ imageUrl: req.file.location });
  });
});

module.exports = { router };
