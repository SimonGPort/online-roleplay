import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

export default function GmBar(props) {
  const [selection, setSelection] = useState("Token");
  const [isErasing, setIsErasing] = useState(false);
  const dispatch = useDispatch();
  return (
    <div>
      <div>Hello world</div>
      <Link to={`/new-token-online/${props.host}/${props.eventId}`}>
        New Token
      </Link>
      <div>
        <select
          value={selection}
          onChange={evt => {
            setSelection(evt.target.value);
            dispatch({
              type: "typeSelection",
              typeSelection: evt.target.value
            });
          }}
        >
          <option>Token</option>
          <option>Background</option>
        </select>
      </div>
      <div>
        <button
          onClick={evt => {
            setIsErasing(!isErasing);
            dispatch({
              type: "isErasingToken",
              isErasingToken: !isErasing
            });
          }}
          style={{
            backgroundColor: isErasing === true ? "yellow" : ""
          }}
        >
          Erase
        </button>
      </div>
    </div>
  );
}
