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
app.use("/uploads", express.static("uploads"));

/////////// APP.POST METHOD

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

app.post("/requestToJoin", uploads.none(), async (req, res) => {
  let user = req.body.user;
  let eventId = req.body.id;
  console.log("user and eventID", user, eventId);
  try {
    await dbo
      .collection("events")
      .updateOne({ eventId: eventId }, { $push: { players: user } });
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("requestToJoin fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/leaveTheQueue", uploads.none(), async (req, res) => {
  let user = req.body.user;
  let eventId = req.body.id;
  console.log("user and eventID", user, eventId);
  try {
    await dbo
      .collection("events")
      .updateOne({ eventId: eventId }, { $pull: { players: user } });
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("leaveTheQueue fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/deleteTheEvent", uploads.none(), async (req, res) => {
  let eventId = req.body.id;
  try {
    await dbo.collection("events").deleteOne({ eventId: eventId });
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("DeleteEvent fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/hostingAEvent", uploads.single("imgFile"), (req, res) => {
  console.log("hostingAEvent BackEnd");
  let sessionId = req.cookies.sid;
  let host = sessions[sessionId];
  let title = req.body.title;
  let type = req.body.type;
  let system = req.body.system;
  let theme = req.body.theme;
  let language = req.body.language;
  let when = req.body.when;
  let time = req.body.time;
  let players = [];
  let chat = [];
  let conventionsGame = [];
  let frequency = req.body.frequency;
  let description = req.body.description;
  let location = req.body.location;
  let numPlayers = req.body.numPlayers;
  let img = "/uploads/" + req.file.filename;
  let eventId = "" + Math.floor(Math.random() * 1000000);
  console.log("image", img);
  if (host === undefined) {
    console.log("The user need to login");
    res.send(JSON.stringify({ success: false }));
    return;
  }
  try {
    dbo.collection("events").insertOne({
      host: host,
      title: title,
      eventId: eventId,
      type: type,
      system: system,
      theme: theme,
      conventionsGame: conventionsGame,
      description: description,
      img: img,
      language: language,
      players: players,
      chat: chat,
      when: when,
      time: time,
      frequency: frequency,
      location: location,
      numPlayers: numPlayers
    });
    console.log("The event has been register");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("/book registration fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/autoLogin", async (req, res) => {
  let sessionId = req.cookies.sid;
  let username = sessions[sessionId];
  if (username === undefined) {
    console.log("an user enter the website without autoLogin");
    res.send(JSON.stringify({ success: false }));
  } else {
    console.log("an user enter the website with autoLogin");
    res.send(
      JSON.stringify({
        success: true,
        username: username
      })
    );
  }
});

app.get("/fetchMessages", async (req, res) => {
  const eventId = req.query.eventId;
  try {
    const event = await dbo.collection("events").findOne({ eventId: eventId });
    if (!event) {
      return res.send(JSON.stringify({ success: false }));
    }
    const chat = event.chat;
    res.send(JSON.stringify({ success: true, chat }));
  } catch (err) {
    console.log("/fetchMessages error", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/postMessage", uploads.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  if (sessions[sessionId] === undefined) {
    res.status(403);
    return res.send(
      JSON.stringify({ success: false, message: "Invalid session" })
    );
  }
  const username = sessions[sessionId];
  const eventId = req.body.eventId;
  let message = req.body.message;

  try {
    await dbo
      .collection("events")
      .updateOne(
        { eventId: eventId },
        { $push: { chat: { username: username, message: message } } }
      );
    console.log("messagePost success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("messagePost fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.get("/fetchEvents", async (req, res) => {
  try {
    const events = await dbo
      .collection("events")
      .find({})
      .toArray();
    res.send(JSON.stringify({ success: true, events: events }));
  } catch (err) {
    console.log("Can't fetch the events in the database", err);
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
