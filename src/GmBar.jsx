import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatOnline from "./ChatOnline.jsx";

export default function GmBar(props) {
  const selection = useSelector(state => state.typeSelection);
  const isErasing = useSelector(state => state.isErasingToken);
  const isDuplicate = useSelector(state => state.isDuplicateToken);
  const isHiding = useSelector(state => state.isHidingToken);

  const dispatch = useDispatch();
  return (
    <div>
      <div>Hello world</div>
      <button
        onClick={() =>
          dispatch({
            type: "CreationOnlineToken",
            action: true
          })
        }
      >
        New Token
      </button>
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
          <option>Draw</option>
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
      <div>
        <button
          onClick={evt => {
            dispatch({
              type: "isHidingToken",
              isHidingToken: !isHiding
            });
          }}
          style={{
            backgroundColor: isHiding === true ? "yellow" : ""
          }}
        >
          Hide
        </button>
      </div>
      <div>
        <ChatOnline />
      </div>
    </div>
  );
}
