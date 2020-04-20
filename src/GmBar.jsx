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
  let [GmBarPositionBottom, setGmBarPositionBottom] = useState(true);
  let [buttonPageChange, setButtonPageChange] = useState(false);
  let [gmPageInput, setGmPageInput] = useState("");
  let [playersPageInput, setPlayersPageInput] = useState("");

  let dispatch = useDispatch();

  let thereIsGrid = async () => {
    debugger;
    dispatch({
      type: "startPostingData",
    });

    dispatch({
      type: "draggingGridStart",
    });

    let data = new FormData();
    data.append("host", props.host);
    data.append("actionGrid", !grid);
    let response = await fetch("/thereIsGrid", {
      method: "POST",
      body: data,
    });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      dispatch({
        type: "thereIsGrid",
        grid: !grid,
      });
    } else {
      alert("thereIsGrid Failure");
    }
    dispatch({
      type: "draggingGridEnd",
    });
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
    if (parsed.success) {
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
    <div
      className="GmBar"
      style={{
        display: props.GmBarDisplay ? "" : "none",
        top: GmBarPositionBottom ? "" : "0",
        bottom: GmBarPositionBottom ? "0" : "",
      }}
    >
      <div className="GmBar-Gm-Section">
        <div style={{ display: user === props.host ? "block" : "none" }}>
          <div className="event-information">Gm's Tools</div>
          <div className="GmBar-Gm-Sub-Section">
            <select
              className="GmBar-button-right-Margin"
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
            <button
              className="GmBar-button-right-Margin GmBar-button"
              onClick={() =>
                dispatch({
                  type: "CreationOnlineToken",
                  action: true,
                })
              }
            >
              New Element
            </button>
            <button
              className="GmBar-button GmBar-button-right-Margin"
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
              Erase Element
            </button>
            <button
              className="GmBar-button-right-Margin GmBar-button"
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
              Hide Element
            </button>
            <button
              className="GmBar-button"
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
              Duplicate Element
            </button>
            <input
              type="number"
              className="GmBar-Input translate-input"
              value={isDuplicate.number}
              onChange={(evt) => {
                dispatch({
                  type: "duplicateNumber",
                  number: evt.target.value,
                });
              }}
            ></input>
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
                  className="GmBar-button-right-Margin GmBar-button"
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
            className="GmBar-Gm-Sub-Section "
            style={{
              display: typeSelection === "Background" ? "flex" : "none",
            }}
          >
            {buttonBackgroundSize ? (
              <>
                <div style={{ display: "flex" }}>
                  <button
                    className="GmBar-button GmBar-button-right-Margin"
                    style={{ backgroundColor: "yellow" }}
                    onClick={() => {
                      changeBackgroundSize();
                    }}
                  >
                    Save Squares
                  </button>
                  {/* <div className="GmBar-button-right-Margin"> */}
                  <label>Width</label>
                  <input
                    value={backgroundWidth}
                    className="GmBar-Input"
                    type="number"
                    onChange={({ target: { value } }) => {
                      setBackgroundWidth(parseInt(value));
                    }}
                  />
                  {/* </div> */}
                  <div className="GmBar-button-right-Margin"></div>
                  <label>Height</label>
                  <input
                    value={backgroundHeight}
                    className="GmBar-Input GmBar-button-right-Margin"
                    type="number"
                    onChange={({ target: { value } }) =>
                      setBackgroundHeight(parseInt(value))
                    }
                  />
                  <button
                    className="GmBar-button-right-Margin GmBar-button"
                    onClick={(evt) => {
                      thereIsGrid();
                    }}
                    style={{
                      backgroundColor: grid === true ? "yellow" : "",
                    }}
                  >
                    Map Grid
                  </button>
                  <button
                    className="GmBar-button"
                    onClick={() => {
                      fitToTheMap(!fitToMap);
                    }}
                    style={{
                      backgroundColor: fitToMap === true ? "yellow" : "",
                    }}
                  >
                    Fit to Map
                  </button>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex" }}>
                  <button
                    className="GmBar-button-right-Margin GmBar-button"
                    onClick={() => {
                      setButtonBackgroundSize(true);
                      setBackgroundWidth(props.widthSquares);
                      setBackgroundHeight(props.heightSquares);
                      dispatch({
                        type: "startPostingData",
                      });
                    }}
                  >
                    Edit Squares
                  </button>
                  {/* <div className="GmBar-button-right-Margin"> */}
                  <label>Width</label>
                  <input
                    readOnly
                    className="GmBar-Input"
                    value={props.widthSquares}
                    type="number"
                    style={{ backgroundColor: "grey" }}
                  />
                  {/* </div> */}
                  <div className="GmBar-button-right-Margin"></div>
                  <label>Height</label>
                  <input
                    readOnly
                    className="GmBar-Input GmBar-button-right-Margin"
                    value={props.heightSquares}
                    type="number"
                    style={{ backgroundColor: "grey" }}
                  />
                  <button
                    className="GmBar-button-right-Margin GmBar-button"
                    onClick={(evt) => {
                      thereIsGrid();
                    }}
                    style={{
                      backgroundColor: grid === true ? "yellow" : "",
                    }}
                  >
                    Map Grid
                  </button>
                  <button
                    className="GmBar-button"
                    onClick={() => {
                      fitToTheMap(!fitToMap);
                    }}
                    style={{
                      backgroundColor: fitToMap === true ? "yellow" : "",
                    }}
                  >
                    Fit to Map
                  </button>
                </div>
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
              className="GmBar-button GmBar-button-right-Margin"
            >
              Fill
            </button>
            <button
              onClick={props.canvasClear}
              className="GmBar-button GmBar-button-right-Margin"
            >
              Clear
            </button>
            <button
              className="GmBar-button GmBar-button-right-Margin"
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
              <label>Size</label>
              <input
                className="GmBar-Input"
                type="number"
                onChange={(evt) => {
                  props.changingPenSize(evt.target.value);
                }}
              />
            </div>
            <label>Color</label>
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
        <div className="event-information">Selection</div>
        <div>
          <button
            className="GmBar-button GmBar-button-right-Margin"
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
            className="GmBar-button"
            onClick={() => {
              Unselect();
            }}
          >
            Unselect
          </button>
          <div>
            <button
              style={{ marginTop: "10px" }}
              className="GmBar-button"
              onClick={() => {
                setGmBarPositionBottom(!GmBarPositionBottom);
              }}
            >
              {GmBarPositionBottom === true ? "Top" : "bottom"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
