import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function GmBar(props) {
  const selection = useSelector(state => state.typeSelection);
  const isErasing = useSelector(state => state.isErasingToken);
  const isDuplicate = useSelector(state => state.isDuplicateToken);

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
      <div>
        <button
          onClick={evt => {
            dispatch({
              type: "isDuplicate",
              isDuplicate: !isDuplicate.action
            });
          }}
          style={{
            backgroundColor: isDuplicate.action === true ? "yellow" : ""
          }}
        >
          duplicate
        </button>
        <input
          type="number"
          value={isDuplicate.number}
          onChange={evt => {
            dispatch({ type: "duplicateNumber", number: evt.target.value });
          }}
        ></input>
      </div>
    </div>
  );
}
