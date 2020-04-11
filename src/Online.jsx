import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import GameViewPort from "./GameViewPort.jsx";
import CreationOnlineToken from "./CreationOnlineToken.jsx";

export default function Online(props) {
  let [loading, setLoading] = useState(false);
  let dragging = useSelector((state) => state.dragging);
  let page = useSelector((state) => state.page);
  let user = useSelector((state) => state.user);
  let CreationToken = useSelector((state) => state.CreationOnlineToken);
  let dispatch = useDispatch();
  let MasterToken = useSelector((state) => state.MasterToken);
  let gameView = useSelector((state) => state.gameView);
  let postingData = useSelector((state) => state.postingData);
  let interval = useRef();
  let updating = useRef(false);
  let gameUpdateVersion = useRef(1);
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
      gameUpdateVersion.current = Math.floor(Math.random() * 1000000);
      interval.current = setInterval(updateGameView2, 100);
    } else {
      IntervalCleanup();
    }
  }, [postingData]);

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
      if (body.gameUpdateVersion.current !== gameUpdateVersion.current) {
        updating.current = false;
        return;
      }

      if (body.success) {
        dispatch({
          type: "gameUpdate2",
          gameView: body.gameViewFilter,
          MasterToken: body.MasterToken,
        });
        setLoading(true);
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
