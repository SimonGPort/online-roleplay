import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ChatOnline from "./ChatOnline.jsx";

export default function GmBar(props) {
  let selection = useSelector((state) => state.typeSelection);
  let isErasing = useSelector((state) => state.isErasingToken);
  let isDuplicate = useSelector((state) => state.isDuplicateToken);
  let isHiding = useSelector((state) => state.isHidingToken);
  let isScanning = useSelector((state) => state.isScanning);
  let typeSelection = useSelector((state) => state.typeSelection);
  let gmPage = useSelector((state) => state.page.gmPage);
  let playersPage = useSelector((state) => state.page.playersPage);
  let erasingCanvas = useSelector((state) => state.erasingCanvas);
  let canvas = useSelector((state) => state.MasterToken.canvas);
  let grid = useSelector((state) => state.MasterToken.grid);
  let [buttonBackgroundSize, setButtonBackgroundSize] = useState(false);
  let [backgroundWidth, setBackgroundWidth] = useState("");
  let [backgroundHeight, setBackgroundHeight] = useState("");
  let pageInDB = useSelector((state) => state.MasterToken.pageInDB);
  let fitToMap = useSelector((state) => state.fitToTheMap);
  let user = useSelector((state) => state.user);

  let [buttonPageChange, setButtonPageChange] = useState(false);
  let [gmPageInput, setGmPageInput] = useState("");
  let [playersPageInput, setPlayersPageInput] = useState("");

  let dispatch = useDispatch();

  let thereIsGrid = async () => {
    dispatch({
      type: "startPostingData",
    });

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
    dispatch({
      type: "endPostingData",
    });
  };

  let changeBackgroundSize = async () => {
    let data = new FormData();
    data.append("backgroundWidth", JSON.stringify(backgroundWidth));
    data.append("backgroundHeight", JSON.stringify(backgroundHeight));
    data.append("host", props.host);
    data.append("gmPage", JSON.stringify(gmPage));
    // data.append("canvas", JSON.stringify(canvas));
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
      });
      setButtonBackgroundSize(false);
    } else {
      alert("changingTheBackgroundSize Failure");
    }
    dispatch({
      type: "endPostingData",
    });
  };

  let Unselect = () => {
    dispatch({ type: "Unselect" });
  };

  let fitToTheMap = (evt) => {
    dispatch({ type: "fitToTheMap", action: evt });
  };

  let ChangingPageHandler = async () => {
    // dispatch({
    //   type: "startPostingData",
    // });

    let data = new FormData();
    data.append("newGmPage", JSON.stringify(gmPageInput));
    data.append("newPlayersPage", JSON.stringify(playersPageInput));
    data.append("prevGmPage", JSON.stringify(gmPage));
    data.append("prevPlayersPage", JSON.stringify(playersPage));
    data.append("host", props.host);
    // data.append("canvas", JSON.stringify(canvas));
    data.append("pageInDB", JSON.stringify(pageInDB));
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
          // index: parsed.indexGmPage,
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
    setButtonPageChange(false);
    dispatch({
      type: "endPostingData",
    });
  };

  return (
    <div className="GmBar">
      <div className="GmBar-Gm-Section">
        <div style={{ display: user === props.host ? "block" : "none" }}>
          <div className="event-information">Gm's Tools</div>
          <div className="GmBar-Gm-Sub-Section">
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
          <div className="GmBar-Gm-Sub-Section">
            <button
              className="GmBar-button-right-Margin event-chat-submit"
              onClick={() =>
                dispatch({
                  type: "CreationOnlineToken",
                  action: true,
                })
              }
            >
              New Token
            </button>
            <button
              className="event-chat-submit"
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
          <div className="GmBar-Gm-Sub-Section">
            <button
              className="GmBar-button-right-Margin event-chat-submit"
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
            <button
              className="event-chat-submit"
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
              Duplicate
            </button>
            <input
              type="number"
              className="GmBar-Input"
              value={isDuplicate.number}
              onChange={(evt) => {
                dispatch({ type: "duplicateNumber", number: evt.target.value });
              }}
            ></input>
          </div>
          <div className="GmBar-Gm-Sub-Section">
            <button
              className="GmBar-button-right-Margin event-chat-submit"
              onClick={(evt) => {
                thereIsGrid();
              }}
              style={{
                backgroundColor: grid === true ? "yellow" : "",
              }}
            >
              Grid
            </button>
            <button
              className="event-chat-submit"
              onClick={() => {
                fitToTheMap(!fitToMap);
              }}
              style={{
                backgroundColor: fitToMap === true ? "yellow" : "",
              }}
            >
              Fit to map
            </button>
          </div>
          <div className="GmBar-Gm-Sub-Section ">
            {buttonBackgroundSize ? (
              <>
                <div style={{ display: "flex" }}>
                  <button
                    className="event-chat-submit GmBar-button-right-Margin"
                    style={{ backgroundColor: "yellow" }}
                    onClick={() => {
                      changeBackgroundSize();
                    }}
                  >
                    Save Size
                  </button>

                  <div className="GmBar-button-right-Margin">
                    <label>Width-Squares</label>
                    <input
                      value={backgroundWidth}
                      className="GmBar-Input"
                      type="number"
                      onChange={({ target: { value } }) => {
                        setBackgroundWidth(parseInt(value));
                      }}
                    />
                  </div>
                  <div className="GmBar-button-right-Margin"></div>
                  <label>Height-Squares</label>
                  <input
                    value={backgroundHeight}
                    className="GmBar-Input"
                    type="number"
                    onChange={({ target: { value } }) =>
                      setBackgroundHeight(parseInt(value))
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex" }}>
                  <button
                    className="GmBar-button-right-Margin event-chat-submit"
                    onClick={() => {
                      setButtonBackgroundSize(true);
                      setBackgroundWidth(props.widthSquares);
                      setBackgroundHeight(props.heightSquares);
                      dispatch({
                        type: "startPostingData",
                      });
                    }}
                  >
                    Edit Size
                  </button>
                  <div className="GmBar-button-right-Margin">
                    <div className="GmBar-button-right-Margin">
                      <label>Width-Squares</label>
                      <input
                        readOnly
                        className="GmBar-Input"
                        value={props.widthSquares}
                        type="number"
                        style={{ backgroundColor: "grey" }}
                      />
                    </div>
                  </div>
                  <div className="GmBar-button-right-Margin"></div>
                  <label>Height-Squares</label>
                  <input
                    readOnly
                    className="GmBar-Input"
                    value={props.heightSquares}
                    type="number"
                    style={{ backgroundColor: "grey" }}
                  />
                </div>
              </>
            )}
          </div>
          <div className="GmBar-Gm-Sub-Section" style={{ display: "flex" }}>
            {buttonPageChange ? (
              <>
                <button
                  style={{ backgroundColor: "yellow" }}
                  onClick={() => {
                    ChangingPageHandler();
                  }}
                >
                  Save Pages
                </button>
                <div className="GmBar-button-right-Margin">
                  <label>Gm's Page</label>
                  <input
                    value={gmPageInput}
                    type="number"
                    className="GmBar-Input"
                    onChange={({ target: { value } }) => {
                      setGmPageInput(parseInt(value));
                    }}
                  />
                </div>
                <label>Players's Page</label>
                <input
                  value={playersPageInput}
                  className="GmBar-Input"
                  type="number"
                  onChange={({ target: { value } }) =>
                    setPlayersPageInput(parseInt(value))
                  }
                />
              </>
            ) : (
              <>
                <button
                  className="GmBar-button-right-Margin event-chat-submit"
                  onClick={() => {
                    setButtonPageChange(true);
                    setGmPageInput(gmPage);
                    setPlayersPageInput(playersPage);
                    dispatch({
                      type: "startPostingData",
                    });
                  }}
                >
                  Edit Pages
                </button>
                <div className="GmBar-button-right-Margin">
                  <label>Gm's Page</label>
                  <input
                    readOnly
                    className="GmBar-Input"
                    value={gmPage}
                    type="number"
                    style={{ backgroundColor: "grey" }}
                  />
                </div>
                <label>Players's Page</label>
                <input
                  readOnly
                  className="GmBar-Input"
                  value={playersPage}
                  type="number"
                  style={{ backgroundColor: "grey" }}
                />
              </>
            )}
          </div>
          <div
            className="GmBar-Gm-Sub-Section"
            style={{
              display: typeSelection === "Draw" ? "flex" : "none",
            }}
          >
            <button
              onClick={props.canvasFill}
              className="event-chat-submit GmBar-button-right-Margin"
            >
              Fill
            </button>
            <button
              onClick={props.canvasClear}
              className="event-chat-submit GmBar-button-right-Margin"
            >
              Clear
            </button>
            <button
              className="event-chat-submit GmBar-button-right-Margin"
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
            <div className="GmBar-button-right-Margin">
              <label>Pen Size</label>
              <input
                className="GmBar-Input"
                type="number"
                onChange={(evt) => {
                  props.changingPenSize(evt.target.value);
                }}
              />
            </div>
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
      </div>
      <div>
        <ChatOnline host={props.host} />
      </div>
      <div>
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
        </div>
        <div>
          <button
            onClick={() => {
              Unselect();
            }}
          >
            Unselect
          </button>
        </div>
      </div>
    </div>
  );
}
