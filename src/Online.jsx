import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GmBar from "./GmBar.jsx";
import GameViewPort from "./GameViewPort.jsx";
import CreationOnlineToken from "./CreationOnlineToken.jsx";

export default function Online(props) {
  const [loading, setLoading] = useState(false);
  const dragging = useSelector(state => state.dragging);
  const page = useSelector(state => state.page);
  const user = useSelector(state => state.user);
  const CreationToken = useSelector(state => state.CreationOnlineToken);
  const dispatch = useDispatch();

  useEffect(() => {
    const updateGameView = () => {
      if (dragging === true) {
        return;
      }
      (async () => {
        let response = await fetch(
          "/fetchGameView?host=" + props.host + "&page=" + page
        );
        let responseBody = await response.text();
        let body = JSON.parse(responseBody);
        if (body.success) {
          dispatch({
            type: "gameUpdate",
            gameView: body.gameViewFilter,
            MasterToken: body.MasterToken
          });
          setLoading(true);
          return;
        }
        console.log("error with the gameViewUpdate");
      })();
    };
    let interval = setInterval(updateGameView, 500);

    if (dragging === true) {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [dragging]);

  useEffect(() => {
    (async () => {
      let data = new FormData();
      data.append("user", user);
      data.append("host", props.host);
      let response = await fetch("/newUserOnline", {
        method: "POST",
        body: data
      });
      let body = await response.text();
      body = JSON.parse(body);
      if (body.success) {
        console.log("newUserOnline success");
      }
    })();

    return () => {
      (async () => {
        let data = new FormData();
        data.append("user", user);
        data.append("host", props.host);
        let response = await fetch("/newUserOffline", {
          method: "POST",
          body: data
        });
        let body = await response.text();
        body = JSON.parse(body);
        if (body.success) {
          console.log("newUserOffline success");
        }
      })();
    };
  }, []);

  if (loading === false) {
    return <div>Loading...</div>;
  }

  return (
    <div className="Online">
      {CreationToken === false ? (
        <>
          <GmBar host={props.host} eventId={props.eventId} />
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
