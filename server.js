let express = require("express");
let app = express();
let reloadMagic = require("./reload-magic.js");
let multer = require("multer");
let uploads = multer({
  dest: __dirname + "/uploads",
});
let mongodb = require("mongodb");
let MongoClient = mongodb.MongoClient;
// let stripe = require("stripe")("sk_test_B6PEcUDOSFm8P086vEseWkiG00d8thvwtz");
let ObjectId = mongodb.ObjectID;
let dbo = undefined;
let url =
  "mongodb+srv://bob:bobsue@cluster0-moshr.azure.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useUnifiedTopology: true })
  .then((client) => {
    dbo = client.db("Roleplay");
  })
  .catch((err) => console.log(err));
const cookieParser = require("cookie-parser");
app.use(cookieParser());

const users = [];
const sessions = {};

reloadMagic(app);

app.use("/", express.static("build")); // Needed for the HTML and JS files
app.use("/", express.static("public")); // Needed for local assets
app.use("/uploads", express.static("uploads"));

/////////// APP. METHOD

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
    await dbo.collection("tokens").insertOne({
      host: username,
      type: "MasterToken",
      tokenId: "" + Math.floor(Math.random() * 1000000),
      imgFile: null,
      positionY: null,
      positionX: null,
      page: { gmPage: 1, playersPage: 1 },
      zIndex: null,
      permission: null,
      height: null,
      width: null,
      hide: null,
      chat: [],
      scan: [],
      canvas: [],
      // canvas: [{ page: 1, src: "", width: null, height: null, clear: false }],
      onlineUsers: [],
      grid: false,
    });
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

app.post("/newUserOnline", uploads.none(), async (req, res) => {
  let user = req.body.user;
  let host = req.body.host;
  console.log("newUserOnline", user, host);
  try {
    await dbo
      .collection("tokens")
      .updateOne(
        { host: host, type: "MasterToken" },
        { $push: { onlineUsers: { user: user, initiative: "" } } }
      );
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("newUserOnline fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/thereIsGrid", uploads.none(), async (req, res) => {
  let host = req.body.host;
  let grid = JSON.parse(req.body.actionGrid);
  try {
    await dbo
      .collection("tokens")
      .updateOne({ host: host, type: "MasterToken" }, { $set: { grid } });
    console.log("thereIsGrid success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("newUserOnline fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/newUserOffline", uploads.none(), async (req, res) => {
  let user = req.body.user;
  let host = req.body.host;

  try {
    await dbo
      .collection("tokens")
      .updateOne(
        { host: host, type: "MasterToken" },
        { $pull: { onlineUsers: { user } } }
      );
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("newUserOffline fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/requestToJoin", uploads.none(), async (req, res) => {
  let user = req.body.user;
  let eventId = req.body.id;
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

app.post("/dragged", uploads.none(), async (req, res) => {
  let positionX = req.body.positionX;
  let positionY = req.body.positionY;
  let width = req.body.width;
  let height = req.body.height;
  let tokenId = req.body.tokenId;
  try {
    await dbo.collection("tokens").updateOne(
      { tokenId: tokenId },
      {
        $set: {
          positionX: positionX,
          positionY: positionY,
          width: width,
          height: height,
        },
      }
    );
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("dragged error", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/changingTheBackgroundSize", uploads.none(), async (req, res) => {
  let backgroundWidth = JSON.parse(req.body.backgroundWidth);
  let backgroundHeight = JSON.parse(req.body.backgroundHeight);
  backgroundWidth = backgroundWidth * 70;
  backgroundHeight = backgroundHeight * 70;
  let host = req.body.host;
  let gmPage = JSON.parse(req.body.gmPage);
  let canvas = JSON.parse(req.body.canvas);

  const index = canvas.findIndex((canvas) => {
    return canvas.page === gmPage;
  });

  canvas[index].width = backgroundWidth;
  canvas[index].height = backgroundHeight;

  try {
    await dbo.collection("tokens").updateOne(
      { host: host, type: "MasterToken" },
      {
        $set: {
          canvas,
        },
      }
    );
    console.log("changingTheBackgroundSize success");
    res.send(
      JSON.stringify({
        success: true,
        backgroundWidth,
        index,
        backgroundHeight,
      })
    );
  } catch (err) {
    console.log("changingTheBackgroundSize error", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/ChangingThePage", uploads.none(), async (req, res) => {
  let goingToThisGmPage = JSON.parse(req.body.newGmPage);
  let goingTothisPlayersPage = JSON.parse(req.body.newPlayersPage);
  let prevGmPage = JSON.parse(req.body.prevGmPage);
  let prevPlayersPage = JSON.parse(req.body.prevPlayersPage);
  let host = req.body.host;
  let canvas = JSON.parse(req.body.canvas);

  isChangingTheGmPage = goingToThisGmPage !== prevGmPage;
  isChangingThePlayersPage = goingTothisPlayersPage !== prevPlayersPage;

  let indexGmPage = undefined;
  let indexPlayersPage = undefined;
  let doesGoingToThisGmPageExist = undefined;
  let doesgoingTothisPlayersPageExist = undefined;

  if (isChangingTheGmPage) {
    indexGmPage = canvas.findIndex((canvas) => {
      return canvas.page === goingToThisGmPage;
    });

    indexGmPage === -1
      ? (doesGoingToThisGmPageExist = false)
      : (doesGoingToThisGmPageExist = true);

    if (doesGoingToThisGmPageExist) {
      canvas[indexGmPage].clear = true;
    } else {
      canvas.push({
        page: goingToThisGmPage,
        src: "",
        width: 1400,
        height: 1400,
        clear: true,
      });
    }
  }

  if (isChangingThePlayersPage) {
    indexPlayersPage = canvas.findIndex((canvas) => {
      return canvas.page === goingTothisPlayersPage;
    });
    indexPlayersPage === -1
      ? (doesgoingTothisPlayersPageExist = false)
      : (doesgoingTothisPlayersPageExist = true);

    if (doesgoingTothisPlayersPageExist) {
      canvas[indexPlayersPage].clear = true;
    } else {
      canvas.push({
        page: goingTothisPlayersPage,
        src: "",
        width: 1400,
        height: 1400,
        clear: true,
      });
    }
  }

  try {
    await dbo.collection("tokens").updateOne(
      { host: host, type: "MasterToken" },
      {
        $set: {
          page: {
            playersPage: goingTothisPlayersPage,
            gmPage: goingToThisGmPage,
          },
          canvas,
        },
      }
    );
    console.log("ChangingThePage success");
    res.send(
      JSON.stringify({
        success: true,
        goingToThisGmPage,
        goingTothisPlayersPage,
        indexGmPage,
        indexPlayersPage,
        isChangingTheGmPage,
        isChangingThePlayersPage,
        doesGoingToThisGmPageExist,
        doesgoingTothisPlayersPageExist,
      })
    );
  } catch (err) {
    console.log("ChangingThePage error", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/giveOrRemovePermissionToken", uploads.none(), async (req, res) => {
  let permissionValue = JSON.parse(req.body.permissionValue);
  let user = JSON.parse(req.body.user);
  let tokenId = req.body.tokenId;

  let actionType = undefined;
  if (permissionValue) {
    actionType = {
      $pull: { permission: user },
    };
  } else {
    actionType = {
      $push: { permission: user },
    };
  }
  console.log("actionType:", actionType, permissionValue);
  try {
    await dbo.collection("tokens").updateOne({ tokenId: tokenId }, actionType);
    res.send(
      JSON.stringify({
        success: true,
        user,
        shouldRemovePermission: permissionValue,
        tokenId,
      })
    );
  } catch (err) {
    res.send(
      JSON.stringify({
        success: false,
      })
    );
    return;
  }
});

app.post("/playerinitiative", uploads.none(), async (req, res) => {
  let playerinitiative = JSON.parse(req.body.playerinitiative);
  let user = JSON.parse(req.body.user);
  let host = req.body.host;
  let playerIndex = JSON.parse(req.body.playerIndex);
  user.initiative = playerinitiative;
  let field = "onlineUsers." + playerIndex;

  try {
    await dbo.collection("tokens").updateOne(
      { host: host, type: "MasterToken" },
      {
        $set: { [field]: user },
      }
    );
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("dragged error", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/scan", uploads.none(), async (req, res) => {
  let positionX = req.body.positionX;
  let positionY = req.body.positionY;
  let time = JSON.parse(req.body.time);
  let user = req.body.user;
  let host = req.body.host;
  try {
    await dbo.collection("tokens").updateOne(
      { host: host, type: "MasterToken" },
      {
        $push: {
          scan: { positionX, positionY, time, user },
        },
      }
    );
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("dragged error", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/drawData", uploads.none(), async (req, res) => {
  let canvas = JSON.parse(req.body.canvas);
  let src = req.body.src;
  let host = req.body.host;
  let width = JSON.parse(req.body.width);
  let height = JSON.parse(req.body.height);
  let clear = JSON.parse(req.body.clear);
  let page = JSON.parse(req.body.page);
  let index = canvas.findIndex((canvas) => {
    return canvas.page === page;
  });

  if (index === -1 || index === undefined) {
    canvas.push({ src, width, height, clear, page });
  } else {
    canvas[index] = { src, width, height, clear, page };
  }
  try {
    await dbo.collection("tokens").updateOne(
      { host: host, type: "MasterToken" },
      {
        $set: {
          canvas,
        },
      }
    );
    console.log("canvas post success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("dragged error", err);
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

app.post("/deleteTheEventConvention", uploads.none(), async (req, res) => {
  let eventId = req.body.eventId;
  let tableIndex = req.body.tableIndex;
  let tableId = req.body.tableId;
  let field = "conventionsGame." + tableIndex;
  console.log("deleteConventionEvent:", field);
  console.log("je test mes variables", eventId, tableIndex, tableId);
  try {
    await dbo
      .collection("events")
      .update(
        { eventId: eventId },
        { $pull: { conventionsGame: { tableId: tableId } } }
      );
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
  let location = JSON.parse(req.body.location);
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
      numPlayers: numPlayers,
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
        username: username,
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

app.get("/fetchGameView", async (req, res) => {
  let host = req.query.host;
  let page = JSON.parse(req.query.page);

  try {
    const gameView = await dbo
      .collection("tokens")
      .find({ host: host })
      .toArray();
    if (!gameView) {
      return res.send(JSON.stringify({ success: false }));
    }

    let MasterToken = gameView.find((token) => {
      return token.type === "MasterToken";
    });
    let gameViewFilter = gameView.filter((token) => {
      return token.page === page;
    });

    res.send(JSON.stringify({ success: true, gameViewFilter, MasterToken }));
  } catch (err) {
    console.log("/GameView error", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.get("/fetchMessagesConvention", async (req, res) => {
  const eventId = req.query.eventId;
  const tableIndex = req.query.tableIndex;
  try {
    const event = await dbo.collection("events").findOne({ eventId: eventId });
    if (!event) {
      return res.send(JSON.stringify({ success: false }));
    }
    const chat = event.conventionsGame[tableIndex].chat;
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

app.post("/postMessageChatOnline", uploads.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  if (sessions[sessionId] === undefined) {
    res.status(403);
    return res.send(
      JSON.stringify({ success: false, message: "Invalid session" })
    );
  }
  const username = sessions[sessionId];
  const tokenId = req.body.tokenId;
  let message = req.body.message;
  let diceResult = null;
  let firstNumber = "";
  let secondNumber = "";
  let firstCharacter = message.slice(0, 1);
  if (firstCharacter === "/") {
    newMessage = message.slice(1);
    let indexOfD = newMessage.indexOf("d");
    let indexOfPlus = newMessage.indexOf("+");
    let indexOfMinus = newMessage.indexOf("-");
    let indexOfMultiply = newMessage.indexOf("*");
    let indexOfSubtraction = newMessage.indexOf("/");
    firstNumber = parseInt(newMessage.slice(0, indexOfD));
    secondNumber = parseInt(newMessage.slice(indexOfD + 1));
    let diceArray = [];
    for (let i = 0; i < firstNumber; i++) {
      let randomNum = Math.ceil(Math.random() * secondNumber);
      diceResult = diceResult + randomNum;
      randomNum = "(" + randomNum + ")";
      diceArray.push(randomNum);
    }
    let thirdNumber = null;
    if (indexOfPlus !== -1) {
      thirdNumber = parseInt(newMessage.slice(indexOfPlus + 1));
      diceResult = diceResult + thirdNumber;
    } else if (indexOfMinus !== -1) {
      thirdNumber = parseInt(newMessage.slice(indexOfMinus + 1));
      diceResult = diceResult - thirdNumber;
    } else if (indexOfMultiply !== -1) {
      thirdNumber = parseInt(newMessage.slice(indexOfMultiply + 1));
      diceResult = diceResult * thirdNumber;
    } else if (indexOfSubtraction !== -1) {
      thirdNumber = parseInt(newMessage.slice(indexOfSubtraction + 1));
      diceResult = diceResult / thirdNumber;
    }

    diceResult = " Result: " + diceResult;
    for (let i = 0; i < firstNumber; i++) {
      diceResult = diceResult + " " + diceArray[i];
    }

    console.log("dice", firstNumber, secondNumber);
  }
  console.log("dice2", firstNumber, secondNumber);
  if (diceResult) {
    message = message + diceResult;
  }

  try {
    await dbo
      .collection("tokens")
      .updateOne(
        { tokenId: tokenId },
        { $push: { chat: { username, message } } }
      );
    console.log("dicePost success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("dicePost fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/postMessageConvention", uploads.none(), async (req, res) => {
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
  let tableIndex = req.body.tableIndex;
  let field = "conventionsGame." + tableIndex + ".chat";
  console.log("field:", field);

  try {
    await dbo.collection("events").updateOne(
      { eventId: eventId },
      {
        $push: {
          [field]: {
            username: username,
            message: message,
          },
        },
      }
    );
    console.log("messagePost success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("messagePost fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/requestToJoinConventionEvent", uploads.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  if (sessions[sessionId] === undefined) {
    res.status(403);
    return res.send(
      JSON.stringify({ success: false, message: "Invalid session" })
    );
  }
  const user = sessions[sessionId];
  const eventId = req.body.eventId;
  let tableIndex = req.body.tableIndex;
  let field = "conventionsGame." + tableIndex + ".players";
  try {
    await dbo.collection("events").updateOne(
      { eventId: eventId },
      {
        $push: {
          [field]: user,
        },
      }
    );
    console.log("messagePost success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("messagePost fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/leaveTheQueueConvention", uploads.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  if (sessions[sessionId] === undefined) {
    res.status(403);
    return res.send(
      JSON.stringify({ success: false, message: "Invalid session" })
    );
  }
  const user = sessions[sessionId];
  const eventId = req.body.eventId;
  let tableIndex = req.body.tableIndex;
  let field = "conventionsGame." + tableIndex + ".players";
  try {
    await dbo.collection("events").updateOne(
      { eventId: eventId },
      {
        $pull: {
          [field]: user,
        },
      }
    );
    console.log("messagePost success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("messagePost fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/gameAcceptedForConvention", uploads.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  if (sessions[sessionId] === undefined) {
    res.status(403);
    return res.send(
      JSON.stringify({ success: false, message: "Invalid session" })
    );
  }
  const eventId = req.body.eventId;
  let tableIndex = req.body.tableIndex;
  let field = "conventionsGame." + tableIndex + ".visibility";
  try {
    await dbo.collection("events").updateOne(
      { eventId: eventId },
      {
        $set: {
          [field]: "Unrestricted",
        },
      }
    );
    console.log("gameAcceptedForConvention success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("gameAcceptedForConvention fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/newGmEventConvention", uploads.none(), async (req, res) => {
  const sessionId = req.cookies.sid;
  if (sessions[sessionId] === undefined) {
    res.status(403);
    return res.send(
      JSON.stringify({ success: false, message: "Invalid session" })
    );
  }
  const username = sessions[sessionId];
  const eventId = req.body.eventId;
  let tableIndex = req.body.tableIndex;
  let field = "conventionsGame." + tableIndex + ".gm";
  console.log("field:", field);

  try {
    await dbo.collection("events").updateOne(
      { eventId: eventId },
      {
        $set: {
          [field]: username,
        },
      }
    );
    console.log("newGmEventConvention success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("newGmEventConvention fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post(
  "/creatingAConventionTable",
  uploads.single("imgFile"),
  async (req, res) => {
    const sessionId = req.cookies.sid;
    if (sessions[sessionId] === undefined) {
      res.status(403);
      return res.send(
        JSON.stringify({ success: false, message: "Invalid session" })
      );
    }
    let gm = req.body.gm;
    let tableCreator = sessions[sessionId];
    let visibility = "Restricted";
    let eventId = req.body.eventId;
    let title = req.body.title;
    let type = "Convention's table";
    let system = req.body.system;
    let theme = req.body.theme;
    let language = req.body.language;
    let when = req.body.when;
    let time = req.body.time;
    let players = [];
    let chat = [];
    let tableId = "" + Math.floor(Math.random() * 1000000);
    let frequency = "Just once";
    let description = req.body.description;
    // let location = req.body.location;
    let numPlayers = req.body.numPlayers;
    let img = "/uploads/" + req.file.filename;
    let conventionTable = {
      gm: gm,
      tableCreator: tableCreator,
      visibility: visibility,
      tableId: tableId,
      title: title,
      type: type,
      system: system,
      theme: theme,
      language: language,
      when: when,
      time: time,
      players: players,
      chat: chat,
      frequency: frequency,
      description: description,
      numPlayers: numPlayers,
      img: img,
    };
    try {
      await dbo
        .collection("events")
        .updateOne(
          { eventId: eventId },
          { $push: { conventionsGame: conventionTable } }
        );
      console.log("conventionTable creation success");
      res.send(JSON.stringify({ success: true }));
    } catch (err) {
      console.log("conventionTable creation fail", err);
      res.send(JSON.stringify({ success: false }));
      return;
    }
  }
);

app.post("/creatingANewToken", uploads.single("imgFile"), async (req, res) => {
  console.log("helloworld");
  const sessionId = req.cookies.sid;
  if (sessions[sessionId] === undefined) {
    res.status(403);
    return res.send(
      JSON.stringify({ success: false, message: "Invalid session" })
    );
  }
  let host = req.body.host;
  let page = JSON.parse(req.body.page);
  let type = req.body.type;
  console.log("type", type);
  let zIndex = 2;
  if (type === "Background") {
    zIndex = 1;
  }
  let permission = [host];
  let height = 60;
  let width = 60;
  let imgFile = "/uploads/" + req.file.filename;
  let numberOfTokens = Number(req.body.numberOfTokens);
  try {
    await dbo.collection("tokens").insertMany(
      Array.from(new Array(numberOfTokens)).map(() => {
        return {
          tokenId: "" + Math.floor(Math.random() * 1000000),
          imgFile: imgFile,
          positionY: "0",
          positionX: "0",
          host: host,
          page: page,
          type: type,
          zIndex: zIndex,
          permission: permission,
          height: height,
          width: width,
          hide: true,
        };
      })
    );
    console.log("token creation success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("token creation fail", err);
    res.send(JSON.stringify({ success: false }));
  }
});

app.get("/fetchEvents", async (req, res) => {
  try {
    const events = await dbo.collection("events").find({}).toArray();
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

app.post("/eraseToken", uploads.none(), async (req, res) => {
  const tokenId = req.body.tokenId;
  try {
    await dbo.collection("tokens").deleteOne({ tokenId: tokenId });
    console.log("eraseToken success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("eraseToken fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }

  console.log("logout sucess");
  res.send(JSON.stringify({ success: true }));
});

app.post("/hideToken", uploads.none(), async (req, res) => {
  let token = JSON.parse(req.body.token);
  let hide = !token.hide;
  let tokenId = token.tokenId;
  try {
    await dbo
      .collection("tokens")
      .updateOne({ tokenId: tokenId }, { $set: { hide: hide } });
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("hideToken fail", err);
    res.send(JSON.stringify({ success: false }));
    return;
  }
});

app.post("/duplicateToken", uploads.none(), async (req, res) => {
  let number = parseInt(req.body.number);
  console.log(number, "number");
  let token = JSON.parse(req.body.token);
  console.log("token", token);
  let imgFile = token.imgFile;
  let host = token.host;
  let page = token.page;
  let type = token.type;
  let hide = token.hide;
  let zIndex = token.zIndex;
  let permission = token.permission;
  let height = token.height;
  let width = token.width;

  try {
    await dbo.collection("tokens").insertMany(
      Array.from(new Array(number)).map(() => {
        console.log("number", number);
        return {
          tokenId: "" + Math.floor(Math.random() * 1000000),
          imgFile: imgFile,
          positionY: "0",
          positionX: "0",
          host: host,
          page: page,
          type: type,
          zIndex: zIndex,
          permission: permission,
          height: height,
          width: width,
          hide: hide,
        };
      })
    );
    console.log("token duplication success");
    res.send(JSON.stringify({ success: true }));
  } catch (err) {
    console.log("token duplication fail", err);
    res.send(JSON.stringify({ success: false }));
  }

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
