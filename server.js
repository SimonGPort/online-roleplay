let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
let multer = require("multer");
let uploads = multer({
  dest: __dirname + "/uploads"
});
let mongodb = require("mongodb");
let MongoClient = mongodb.MongoClient;
// let stripe = require("stripe")("sk_test_B6PEcUDOSFm8P086vEseWkiG00d8thvwtz");
let ObjectId = mongodb.ObjectID;
let dbo = undefined;
let url =
  "mongodb+srv://bob:bobsue@cluster0-moshr.azure.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useUnifiedTopology: true })
  .then(client => {
    dbo = client.db("Roleplay");
  })
  .catch(err => console.log(err));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const users = [];
const sessions = {};

reloadMagic(app);

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets

/////////// APP METHOD

app.post("/login", uploads.none(), async (req, res) => {
  let username = req.body.username;
  let pwd = req.body.password;
  console.log("name", username);
  try {
    const user = await dbo
      .collection("users")
      .findOne({ username: username, password: pwd });
    if (user) {
      let sessionId = "" + Math.floor(Math.random() * 1000000);
      sessions[sessionId] = req.body.username;
      res.cookie("sid", sessionId);
      res.send(JSON.stringify({ success: true }));
      return;
    }
    return;
  } catch (err) {
    console.log("login error", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/signup", uploads.none(), async (req, res) => {
  let username = req.body.username;
  let pwd = req.body.password;
  let email = req.body.email;
  console.log("name", username);
  try {
    const user = await dbo.collection("users").findOne({ username: username });
    if (user) {
      return res.send(JSON.stringify({ success: false }));
    }
    await dbo
      .collection("users")
      .insertOne({ username: username, password: pwd, email: email });
    let sessionId = "" + Math.floor(Math.random() * 1000000);
    sessions[sessionId] = req.body.username;
    res.cookie("sid", sessionId);
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("/signup error", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/login", uploads.none(), async (req, res) => {
  let username = req.body.username;
  let pwd = req.body.password;
  console.log("name", username);
  try {
    const user = await dbo
      .collection("users")
      .findOne({ username: username, password: pwd });
    if (user) {
      let sessionId = "" + Math.floor(Math.random() * 1000000);
      sessions[sessionId] = req.body.username;
      res.cookie("sid", sessionId);
      res.send(JSON.stringify({ success: true }));
      return;
    }
    return;
  } catch (err) {
    console.log("login error", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/logout", (req, res) => {
  const sessionId = req.cookies.sid;
  delete sessions[sessionId];
  console.log("logout sucess");
  res.send(JSON.stringify({ success: true }));
});

app.all("/*", (req, res, next) => {
  // needed for react router
  res.sendFile(__dirname + "/build/index.html");
});

app.listen(4000, "0.0.0.0", () => {
  console.log("Server running on port 4000");
});
