import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
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
        let myPage = 1;
        if (user === props.host) {
          myPage = page.gmPage;
        } else {
          myPage = page.playersPage;
        }
        myPage = JSON.stringify(myPage);
        let response = await fetch(
          "/fetchGameView?host=" + props.host + "&page=" + myPage
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
  }, [dragging, page]);

  useEffect(() => {
    // dispatch({ type: "newUserOnline", user: user });
    (async () => {
      let data = new FormData();
      data.append("user", user);
      data.append("host", props.host);
      let response = await fetch("/newUserOnline", {
        method: "POST",
        body: data
      });
    })();

    return () => {
      // dispatch({ type: "newUserOffline", user: user });
      (async () => {
        let data = new FormData();
        data.append("user", user);
        data.append("host", props.host);
        let response = await fetch("/newUserOffline", {
          method: "POST",
          body: data
        });
      })();

      dispatch({ type: "removeMasterToken" });
    };
  }, []);

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
