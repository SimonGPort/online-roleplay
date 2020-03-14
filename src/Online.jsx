import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GmBar from "./GmBar.jsx";
import GameViewPort from "./GameViewPort.jsx";
import CreationOnlineToken from "./CreationOnlineToken.jsx";

export default function Online(props) {
  const user = useSelector(state => state.user);
  const CreationToken = useSelector(state => state.CreationOnlineToken);

  useEffect(() => {
    async () => {
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
    };
    return () => {
      alert("componentWillUnmount");
    };
  }, []);

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
