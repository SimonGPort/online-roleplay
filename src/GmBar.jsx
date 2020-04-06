import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatOnline from "./ChatOnline.jsx";

export default function GmBar(props) {
  const selection = useSelector((state) => state.typeSelection);
  const isErasing = useSelector((state) => state.isErasingToken);
  const isDuplicate = useSelector((state) => state.isDuplicateToken);
  const isHiding = useSelector((state) => state.isHidingToken);
  const isScanning = useSelector((state) => state.isScanning);
  const typeSelection = useSelector((state) => state.typeSelection);
  const gmPage = useSelector((state) => state.page.gmPage);
  const playersPage = useSelector((state) => state.page.playersPage);
  const erasingCanvas = useSelector((state) => state.erasingCanvas);
  const canvas = useSelector((state) => state.MasterToken.canvas);
  const grid = useSelector((state) => state.MasterToken.grid);
  const [buttonBackgroundSize, setButtonBackgroundSize] = useState(false);
  const [backgroundWidth, setBackgroundWidth] = useState("");
  const [backgroundHeight, setBackgroundHeight] = useState("");

  const [buttonPageChange, setButtonPageChange] = useState(false);
  const [gmPageInput, setGmPageInput] = useState("");
  const [playersPageInput, setPlayersPageInput] = useState("");

  const dispatch = useDispatch();

  let thereIsGrid = async () => {
    let data = new FormData();
    data.append("host", props.host);
    data.append("actionGrid", !grid);
    let response = await fetch("/thereIsGrid", {
      method: "POST",
      body: data,
    });
    console.log("frontend got /thereIsGrid");
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      console.log("thereIsGrid success");
      dispatch({
        type: "thereIsGrid",
        grid: !grid,
      });
    } else {
      alert("thereIsGrid Failure");
    }
  };

  let changeBackgroundSize = async () => {
    let data = new FormData();
    data.append("backgroundWidth", JSON.stringify(backgroundWidth));
    data.append("backgroundHeight", JSON.stringify(backgroundHeight));
    data.append("host", props.host);
    data.append("gmPage", JSON.stringify(gmPage));
    data.append("canvas", JSON.stringify(canvas));
    let response = await fetch("/changingTheBackgroundSize", {
      method: "POST",
      body: data,
    });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      console.log("dispatch changingTheBackgroundSize");
      dispatch({
        type: "changingTheBackgroundSize",
        backgroundWidth: parsed.backgroundWidth,
        backgroundHeight: parsed.backgroundHeight,
        index: parsed.index,
      });
    } else {
      alert("changingTheBackgroundSize Failure");
    }
  };

  let ChangingPageHandler = async () => {
    let data = new FormData();
    data.append("newGmPage", JSON.stringify(gmPageInput));
    data.append("newPlayersPage", JSON.stringify(playersPageInput));
    data.append("prevGmPage", JSON.stringify(gmPage));
    data.append("prevPlayersPage", JSON.stringify(playersPage));
    data.append("host", props.host);
    data.append("canvas", JSON.stringify(canvas));
    let response = await fetch("/ChangingThePage", {
      method: "POST",
      body: data,
    });
    const body = await response.text();
    const parsed = JSON.parse(body);
    console.log("backend work changing page");
    if (parsed.success) {
      console.log("ChangingThePage succes backend, frontend res");
      if (parsed.isChangingTheGmPage) {
        dispatch({
          type: "changingGmPage",
          index: parsed.indexGmPage,
          gmPage: parsed.goingToThisGmPage,
          doesGoingToThisGmPageExist: parsed.doesGoingToThisGmPageExist,
        });
      }

      if (parsed.isChangingThePlayersPage) {
        dispatch({
          type: "changingPlayerPage",
          playersPage: parsed.goingTothisPlayersPage,
        });
      }
    } else {
      console.log("backend changingPage error");
    }
  };

  return (
    <div id="GmBar">
      <button
        onClick={() =>
          dispatch({
            type: "CreationOnlineToken",
            action: true,
          })
        }
      >
        New Token
      </button>
      <div>
        <select
          value={selection}
          onChange={(evt) => {
            dispatch({
              type: "typeSelection",
              typeSelection: evt.target.value,
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
          onClick={(evt) => {
            dispatch({
              type: "isErasingToken",
              isErasingToken: !isErasing,
            });
          }}
          style={{
            backgroundColor: isErasing === true ? "yellow" : "",
          }}
        >
          Erase Token
        </button>
      </div>

      <div>
        {buttonBackgroundSize ? (
          <>
            <button
              style={{ backgroundColor: "yellow" }}
              onClick={() => {
                changeBackgroundSize();
                setButtonBackgroundSize(false);
              }}
            >
              Save Background-Size
            </button>
            <label>Background Width-Squares</label>
            <input
              value={backgroundWidth}
              type="number"
              onChange={({ target: { value } }) => {
                setBackgroundWidth(parseInt(value));
              }}
            />
            <label>Background Height-Squares</label>
            <input
              value={backgroundHeight}
              type="number"
              onChange={({ target: { value } }) =>
                setBackgroundHeight(parseInt(value))
              }
            />
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setButtonBackgroundSize(true);
                setBackgroundWidth(props.widthSquares);
                setBackgroundHeight(props.heightSquares);
              }}
            >
              Edit Background-Size
            </button>
            <label>Background Width-Squares</label>
            <input
              readOnly
              value={props.widthSquares}
              type="number"
              style={{ backgroundColor: "grey" }}
            />
            <label>X </label>
            <label>Background Height-Squares</label>
            <input
              readOnly
              value={props.heightSquares}
              type="number"
              style={{ backgroundColor: "grey" }}
            />
          </>
        )}
      </div>

      <div>
        <button
          onClick={(evt) => {
            dispatch({
              type: "isDuplicate",
              isDuplicate: !isDuplicate.action,
            });
          }}
          style={{
            backgroundColor: isDuplicate.action === true ? "yellow" : "",
          }}
        >
          duplicate
        </button>
        <input
          type="number"
          value={isDuplicate.number}
          onChange={(evt) => {
            dispatch({ type: "duplicateNumber", number: evt.target.value });
          }}
        ></input>
      </div>
      <div>
        <button
          onClick={(evt) => {
            dispatch({
              type: "isHidingToken",
              isHidingToken: !isHiding,
            });
          }}
          style={{
            backgroundColor: isHiding === true ? "yellow" : "",
          }}
        >
          Hide
        </button>
        <div
          style={{
            display: typeSelection === "Draw" ? "block" : "none",
          }}
        >
          <button onClick={props.canvasFill}>Fill</button>
          <button onClick={props.canvasClear}>Clear</button>
          <button
            style={{
              backgroundColor: erasingCanvas === true ? "yellow" : "",
            }}
            onClick={(evt) => {
              dispatch({
                type: "erasingCanvas",
                erasingCanvas: !erasingCanvas,
              });
            }}
          >
            Eraser
          </button>
          <label>Pen Size</label>
          <input
            type="number"
            onChange={(evt) => {
              props.changingPenSize(evt.target.value);
            }}
          />

          <label>Pen Color</label>
          <select
            onChange={(evt) => {
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
          onClick={(evt) => {
            dispatch({
              type: "isScanning",
              isScanning: !isScanning,
            });
          }}
          style={{
            backgroundColor: isScanning === true ? "yellow" : "",
          }}
        >
          Scan {isScanning}
        </button>
        <button
          onClick={(evt) => {
            thereIsGrid();
          }}
          style={{
            backgroundColor: grid === true ? "yellow" : "",
          }}
        >
          Grid
        </button>
      </div>
      <div>
        <div>
          {buttonPageChange ? (
            <>
              <button
                style={{ backgroundColor: "yellow" }}
                onClick={() => {
                  ChangingPageHandler();
                  setButtonPageChange(false);
                }}
              >
                Save Pages
              </button>
              <label>Gm's Page</label>
              <input
                value={gmPageInput}
                type="number"
                onChange={({ target: { value } }) => {
                  setGmPageInput(parseInt(value));
                }}
              />
              <label>Players's Page</label>
              <input
                value={playersPageInput}
                type="number"
                onChange={({ target: { value } }) =>
                  setPlayersPageInput(parseInt(value))
                }
              />
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  setButtonPageChange(true);
                  setGmPageInput(gmPage);
                  setPlayersPageInput(playersPage);
                }}
              >
                Edit Pages
              </button>
              <label>Gm's Page</label>
              <input
                readOnly
                value={gmPage}
                type="number"
                style={{ backgroundColor: "grey" }}
              />
              <label>X </label>
              <label>Players's Page</label>
              <input
                readOnly
                value={playersPage}
                type="number"
                style={{ backgroundColor: "grey" }}
              />
            </>
          )}
        </div>
      </div>
      <div>
        <ChatOnline host={props.host} />
      </div>
    </div>
  );
}
