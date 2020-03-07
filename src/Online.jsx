import React, { useState, useEffect } from "react";
import GmBar from "./GmBar.jsx";
import GameViewPort from "./GameViewPort.jsx";

export default function Online(props) {
  return (
    <div>
      <div>
        <GmBar host={props.host} eventId={props.eventId} />
      </div>
      <div>
        <GameViewPort host={props.host} eventId={props.eventId}></GameViewPort>
      </div>
    </div>
  );
}
