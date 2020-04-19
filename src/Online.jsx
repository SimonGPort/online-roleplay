import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import GameViewPort from "./GameViewPort.jsx";
import CreationOnlineToken from "./CreationOnlineToken.jsx";
import { useHistory } from "react-router";

export default function Online(props) {
  let [loading, setLoading] = useState(false);
  let dragging = useSelector((state) => state.dragging);
  let page = useSelector((state) => state.page);
  let user = useSelector((state) => state.user);
  let events = useSelector((state) => state.events);
  let CreationToken = useSelector((state) => state.CreationOnlineToken);
  let dispatch = useDispatch();
  let MasterToken = useSelector((state) => state.MasterToken);
  let gameView = useSelector((state) => state.gameView);
  let postingData = useSelector((state) => state.postingData);
  let interval = useRef();
  let updating = useRef(false);
  let gameUpdateVersion = useRef(1);
  let history = useHistory();
  // let [gameUpdateVersion, setGameUpdateVersion] = useState(1);

  // useEffect(() => {
  //   if (!dragging) {
  //     IntervalCleanup();
  //     console.log("nouvel interval", MasterToken.MasterTokenUpdateId);
  //     interval.current = setInterval(updateGameView, 100);
  //     console.log("nouvel interval", interval.current);
  //   }

  //   if (dragging === true) {
  //     console.log("intervalClear");
  //     IntervalCleanup();
  //   }
  // }, [
  //   dragging,
  //   gameView,
  //   MasterToken,
  //   postingData,
  //   props.host,
  //   user,
  //   updating,
  // ]);

  useEffect(() => {
    if (!postingData) {
      IntervalCleanup();
      // gameUpdateVersion.current = Math.floor(Math.random() * 1000000);
      interval.current = setInterval(updateGameView2, 500);
    } else {
      // gameUpdateVersion.current = Math.floor(Math.random() * 1000000);
      IntervalCleanup();
    }
  }, [postingData]);

  useEffect(() => {
    gameUpdateVersion.current = Math.floor(Math.random() * 1000000);
  }, [dragging]);

  useEffect(() => {
    window.addEventListener("beforeunload", IntervalCleanup);
    return () => {
      window.removeEventListener("beforeunload", IntervalCleanup);
      IntervalCleanup();
    };
  }, []);

  let IntervalCleanup = () => {
    clearInterval(interval.current);
    interval.current = undefined;
  };

  let updateGameView2 = () => {
    if (updating.current) {
      return;
    }
    updating.current = true;
    (async () => {
      let gameUpdateVersionStrigify = JSON.stringify(gameUpdateVersion);
      let response = await fetch(
        "/fetchGameView?host=" +
          props.host +
          "&user=" +
          user +
          "&gameUpdateVersion=" +
          gameUpdateVersionStrigify
      );
      let responseBody = await response.text();
      let body = JSON.parse(responseBody);

      if (body.gameUpdateVersion !== gameUpdateVersion.current) {
        updating.current = false;
        return;
      }

      if (body.success) {
        dispatch({
          type: "gameUpdate",
          gameView: body.gameViewFilter,
          MasterToken: body.MasterToken,
          canvas: body.canvas,
        });
        setLoading(true);
        gameUpdateVersion.current = Math.floor(Math.random() * 1000000);
        updating.current = false;
        return;
      }
      console.log("error with the gameViewUpdate");
    })();
  };

  // let updateGameView = () => {
  //   if (dragging === true || postingData === true || updating.current) {
  //     return;
  //   }
  //   updating.current = true;
  //   (async () => {
  //     let response = await fetch(
  //       "/fetchGameView?host=" + props.host + "&user=" + user
  //     );
  //     let responseBody = await response.text();
  //     let body = JSON.parse(responseBody);
  //     if (body.success) {
  //       let sameGameView =
  //         JSON.stringify(gameView) === JSON.stringify(body.gameViewFilter);
  //       let sameMasterToken =
  //         JSON.stringify(MasterToken) === JSON.stringify(body.MasterToken);

  //       if (sameGameView && sameMasterToken) {
  //         console.log(
  //           "an old gameUpdate has been stopped",
  //           body.MasterToken.MasterTokenUpdateId,
  //           MasterToken.MasterTokenUpdateId
  //         );
  //         updating.current = false;
  //         return;
  //       }

  //       console.log(
  //         "same MasterTokenUpdateID:",
  //         body.MasterToken.MasterTokenUpdateId,
  //         MasterToken.MasterTokenUpdateId
  //       );

  //       dispatch({
  //         type: "gameUpdate",
  //         gameView: body.gameViewFilter,
  //         MasterToken: body.MasterToken,
  //       });

  //       setLoading(true);
  //       // IntervalCleanup();
  //       updating.current = false;
  //       return;
  //     }
  //     console.log("error with the gameViewUpdate");
  //   })();
  // };

  useEffect(() => {
    // dispatch({ type: "newUserOnline", user: user });
    console.log("useEffect");
    let access = verifyIfAccessToTheOnlineGame(
      user,
      events,
      props.host,
      props.eventId
    );
    if (access === false) {
      dispatch({
        type: "removeSelectionEvent",
      });
      history.push("/");
      alert("you dont have access to this event");
      return;
    }

    (async () => {
      let data = new FormData();
      data.append("user", user);
      data.append("host", props.host);
      let response = await fetch("/newUserOnline", {
        method: "POST",
        body: data,
      });
    })();
    window.addEventListener("beforeunload", componentCleanup);
    return () => {
      window.removeEventListener("beforeunload", componentCleanup);
      componentCleanup();
    };
  }, []);

  let verifyIfAccessToTheOnlineGame = (user, events, host, eventId) => {
    if (user === "") {
      return false;
    }

    if (eventId === "GM" && user !== host) {
      return false;
    }

    if (eventId === "GM" && user === host) {
      return true;
    }

    let event = events.find((event) => event.eventId === eventId);
    if (!event.players.includes(user)) {
      return false;
    }
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth() + 1;
    let date = today.getDate();
    let hours = today.getHours();
    let minute = today.getMinutes();
    let yearEvent = parseInt(event.when.slice(0, 4));
    let monthEvent = parseInt(event.when.slice(5, 7));
    let dateEvent = parseInt(event.when.slice(8));
    let hoursEvent = parseInt(event.time.slice(0, 2));
    let minuteEvent = parseInt(event.time.slice(3));
    let time = hours * 60 + minute;
    let timeEvent = hoursEvent * 60 + minuteEvent;
    if (
      year === yearEvent &&
      month === monthEvent &&
      date === dateEvent &&
      time >= timeEvent &&
      time <= timeEvent + 240
    ) {
      return true;
    }
    return false;
  };

  let componentCleanup = () => {
    // dispatch({ type: "newUserOffline", user: user });
    (async () => {
      let data = new FormData();
      data.append("user", user);
      data.append("host", props.host);
      let response = await fetch("/newUserOffline", {
        method: "POST",
        body: data,
      });
    })();

    dispatch({ type: "removeMasterToken" });
  };

  if (loading === false) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Online">
      {CreationToken === false ? (
        <>
          <GameViewPort host={props.host} eventId={props.eventId} />
        </>
      ) : (
        <>
          <CreationOnlineToken host={props.host} eventId={props.eventId} />
        </>
      )}
    </div>
  );
}
