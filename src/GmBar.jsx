import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatOnline from "./ChatOnline.jsx";

export default function GmBar(props) {
  const selection = useSelector(state => state.typeSelection);
  const isErasing = useSelector(state => state.isErasingToken);
  const isDuplicate = useSelector(state => state.isDuplicateToken);
  const isHiding = useSelector(state => state.isHidingToken);
  const isScanning = useSelector(state => state.isScanning);
  const typeSelection = useSelector(state => state.typeSelection);
  const gmPage = useSelector(state => state.page.gmPage);
  const playersPage = useSelector(state => state.page.playersPage);
  const erasingCanvas = useSelector(state => state.erasingCanvas);

  const dispatch = useDispatch();

  return (
    <div id="GmBar">
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
          Erase Token
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
        <div
          style={{
            display: typeSelection === "Draw" ? "block" : "none"
          }}
        >
          <button onClick={props.canvasFill}>Fill</button>
          <button onClick={props.canvasClear}>Clear</button>
          <button
            style={{
              backgroundColor: erasingCanvas === true ? "yellow" : ""
            }}
            onClick={evt => {
              dispatch({
                type: "erasingCanvas",
                erasingCanvas: !erasingCanvas
              });
            }}
          >
            Eraser
          </button>
          <label>Pen Size</label>
          <input
            type="number"
            onChange={evt => {
              props.changingPenSize(evt.target.value);
            }}
          />

          <label>Pen Color</label>
          <select
            onChange={evt => {
              props.changingPenColor(evt.target.value);
            }}
          >
            <option>Black</option>
            <option>Red</option>
            <option>Blue</option>
            <option>Green</option>
            <option>Yellow</option>
            <option>Pink</option>
            <option>White</option>
          </select>
        </div>
      </div>
      <div>
        <button
          onClick={evt => {
            dispatch({
              type: "isScanning",
              isScanning: !isScanning
            });
          }}
          style={{
            backgroundColor: isScanning === true ? "yellow" : ""
          }}
        >
          Scan {isScanning}
        </button>
      </div>
      <div>
        <div>
          <label>GM's page</label>
          <input
            value={gmPage}
            type="number"
            onChange={async evt => {
              let data = new FormData();
              data.append("gmPage", evt.target.value);
              data.append("host", props.host);
              data.append("playersPage", playersPage);
              let response = await fetch("/newPage", {
                method: "POST",
                body: data
              });
              const body = await response.text();
              const parsed = JSON.parse(body);
              if (parsed.success) {
                dispatch({
                  type: "changingGmPage",
                  gmPage: parsed.gmPage,
                  playersPage: parsed.playersPage
                });
              } else {
                alert("newPage Failure");
              }
            }}
          />
        </div>
        <div>
          <label>Players's page</label>
          <input
            value={playersPage}
            type="number"
            onChange={async evt => {
              let data = new FormData();
              data.append("playersPage", evt.target.value);
              data.append("host", props.host);
              data.append("gmPage", gmPage);
              let response = await fetch("/newPage", {
                method: "POST",
                body: data
              });
              const body = await response.text();
              const parsed = JSON.parse(body);
              if (parsed.success) {
                dispatch({
                  type: "changingPlayerPage",
                  gmPage: parsed.gmPage,
                  playersPage: parsed.playersPage
                });
              } else {
                alert("newPage Failure");
              }
            }}
          />
        </div>
      </div>
      <div>
        <ChatOnline host={props.host} />
      </div>
    </div>
  );
}
