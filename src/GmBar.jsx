import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function GmBar(props) {
  return (
    <div>
      <div>Hello world</div>
      <Link to={`/new-token-online/${props.host}/${props.eventId}`}>
        New Token
      </Link>
    </div>
  );
}
