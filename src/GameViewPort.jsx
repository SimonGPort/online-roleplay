import React, { Component, useState } from "react";
import Draggable from "./Draggable.jsx";
import { connect } from "react-redux";
import GmBar from "./GmBar.jsx";
import Grid from "./Grid.jsx";
import Scan from "./Scan.jsx";

class GameViewPort extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      prevX: 0,
      prevY: 0,
      localFlag: false,
      ctx: undefined,
      canvas: undefined,
      canvasUrl: undefined,
      width: 0,
      height: 0,
      penSize: 5,
      penColor: "black",
      GmBarDisplay: false,
    };
  }
  componentDidMount() {
    this.canvasDrawingIni();
  }
  componentDidUpdate() {
    this.resizeCanvasDimensions();
    if (this.state.localFlag) {
      return;
    }

    if (this.props.postingData) {
      return;
    }
    if (this.canvasRef.current.toDataURL() !== this.props.canvas.src) {
      this.drawCanvas(this.state.ctx, this.state.canvas);
    }
  }
  canvasDrawingIni = () => {
    if (this.props.isDrawingAble === false) {
      return;
    }
    let canvas = this.canvasRef.current;
    let rect = canvas.getBoundingClientRect();
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - rect.y - 6;
    let ctx = canvas.getContext("2d");

    this.setState({
      canvas: canvas,
      height: canvas.height,
      width: canvas.width,
      ctx: ctx,
      canvasUrl: canvas.toDataURL(),
    });
    canvas.addEventListener("mousemove", (evt) => {
      this.findxy("move", evt);
    });
    canvas.addEventListener("mousedown", (evt) => {
      this.findxy("down", evt);
    });
    canvas.addEventListener("mouseup", (evt) => {
      this.findxy("up", evt);
    });
    canvas.addEventListener("mouseout", (evt) => {
      this.findxy("out", evt);
    });
  };
  canvasFill = async () => {
    this.props.dispatch({
      type: "startPostingData",
    });
    // let pageDiplay = undefined;
    // if (this.props.user === this.props.host) {
    //   pageDiplay = this.props.page.gmPage;
    // } else {
    //   pageDiplay = this.props.page.playersPage;
    // }
    // let canvasIndex = this.props.MasterToken.canvas.findIndex((canvas) => {
    //   return canvas.page === pageDiplay;
    // });
    // if (canvasIndex === -1) {
    //   let canvas = this.canvasRef.current;
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    // }

    const { width, height } = this.state.canvas;
    this.state.ctx.fillStyle = this.state.penColor;
    this.state.ctx.fillRect(0, 0, width, height);
    let data = new FormData();
    // data.append("canvas", JSON.stringify(this.props.MasterToken.canvas));
    data.append("page", this.props.page.gmPage);
    data.append("src", this.canvasRef.current.toDataURL());
    data.append("host", this.props.host);
    data.append("width", this.state.canvas.width);
    data.append("height", this.state.canvas.height);
    data.append("clear", JSON.stringify(false));
    data.append("pageInDB", JSON.stringify(this.props.MasterToken.pageInDB));
    let response = await fetch("/drawData", { method: "POST", body: data });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      console.log("draw post success");
      this.props.dispatch({
        type: "changeCanvasAfterDraw",
        clear: false,
        src: this.canvasRef.current.toDataURL(),
        canvasIndex: canvasIndex,
      });
      this.props.dispatch({
        type: "endPostingData",
      });
    } else {
      console.log("draw post failure");
      this.props.dispatch({
        type: "endPostingData",
      });
    }
  };

  canvasClear = async () => {
    this.props.dispatch({
      type: "startPostingData",
    });
    // let pageDiplay = undefined;
    // if (this.props.user === this.props.host) {
    //   pageDiplay = this.props.page.gmPage;
    // } else {
    //   pageDiplay = this.props.page.playersPage;
    // }
    // let canvasIndex = this.props.MasterToken.canvas.findIndex((canvas) => {
    //   return canvas.page === pageDiplay;
    // });
    // if (canvasIndex === -1) {
    //   let canvas = this.canvasRef.current;
    //   ctx.clearRect(0, 0, canvas.width, canvas.height);
    // }

    const { width, height } = this.state.canvas;
    this.state.ctx.clearRect(0, 0, width, height);
    let data = new FormData();
    data.append("page", this.props.page.gmPage);
    data.append("canvas", JSON.stringify(this.props.MasterToken.canvas));
    data.append("src", "");
    data.append("host", this.props.host);
    data.append("width", this.state.canvas.width);
    data.append("height", this.state.canvas.height);
    data.append("clear", JSON.stringify(true));
    data.append("pageInDB", JSON.stringify(this.props.MasterToken.pageInDB));
    let response = await fetch("/drawData", { method: "POST", body: data });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      console.log("draw post success");

      this.props.dispatch({
        type: "changeCanvasAfterDraw",
        clear: true,
        src: this.canvasRef.current.toDataURL(),
        canvasIndex: canvasIndex,
      });
      this.props.dispatch({
        type: "endPostingData",
      });
    } else {
      console.log("draw post failure");
      this.props.dispatch({
        type: "endPostingData",
      });
    }
  };

  resizeCanvasDimensions = () => {
    // let pageDiplay = undefined;
    // if (this.props.user === this.props.host) {
    //   pageDiplay = this.props.page.gmPage;
    // } else {
    //   pageDiplay = this.props.page.playersPage;
    // }
    // let canvasDisplay = this.props.MasterToken.canvas.find((canvas) => {
    //   return canvas.page === pageDiplay;
    // });

    if (Object.entries(this.props.canvas).length === 0) {
      return;
    }

    if (
      this.props.canvas.width === this.state.canvas.width &&
      this.props.canvas.height === this.state.canvas.height
    ) {
      return;
    }
    let canvas = this.canvasRef.current;
    canvas.width = this.props.canvas.width;
    canvas.height = this.props.canvas.height;
    this.setState({ canvas, height: canvas.height, width: canvas.width });
    this.drawCanvas(this.state.ctx, this.state.canvas);
  };

  draw = (e) => {
    if (this.props.erasingCanvas) {
      this.state.ctx.globalCompositeOperation = "destination-out";
    } else {
      this.state.ctx.globalCompositeOperation = "source-over";
    }
    this.state.ctx.beginPath();
    this.state.ctx.moveTo(this.state.prevX, this.state.prevY);
    this.state.ctx.lineTo(e.offsetX, e.offsetY);
    this.state.ctx.strokeStyle = this.state.penColor;
    this.state.ctx.lineWidth = this.state.penSize;
    this.state.ctx.stroke();
    this.state.ctx.closePath();
    this.setState({
      prevX: e.offsetX,
      prevY: e.offsetY,
    });
  };

  findxy = async (status, e) => {
    if (this.props.typeSelection !== "Draw") {
      return;
    }
    if (status === "down") {
      this.setState({
        prevX: e.offsetX,
        prevY: e.offsetY,
        localFlag: true,
      });
      this.props.dispatch({
        type: "draggingStart",
        tokenIdDragged: null,
      });
      this.props.dispatch({
        type: "startPostingData",
      });
      console.log("down");
    }
    if (status === "up" || status === "out") {
      if (this.state.localFlag === false) {
        return;
      }
      this.props.dispatch({ type: "draggingEnd" });
      console.log("up");
      this.setState({
        localFlag: false,
      });

      // let pageDiplay = undefined;
      // if (this.props.user === this.props.host) {
      //   pageDiplay = this.props.page.gmPage;
      // } else {
      //   pageDiplay = this.props.page.playersPage;
      // }
      // let canvasIndex = this.props.MasterToken.canvas.findIndex((canvas) => {
      //   return canvas.page === pageDiplay;
      // });
      // if (canvasIndex === -1) {
      //   let canvas = this.canvasRef.current;
      //   ctx.clearRect(0, 0, canvas.width, canvas.height);
      // }

      this.props.dispatch({
        type: "changeCanvasAfterDraw",
        clear: this.props.erasingCanvas,
        src: this.canvasRef.current.toDataURL(),
      });
      let data = new FormData();
      data.append("src", this.canvasRef.current.toDataURL());
      data.append("host", this.props.host);
      data.append("width", this.state.canvas.width);
      data.append("height", this.state.canvas.height);
      data.append("clear", JSON.stringify(this.props.erasingCanvas));
      data.append("page", this.props.page.gmPage);
      // data.append("canvas", JSON.stringify(this.props.canvas));
      data.append("pageInDB", JSON.stringify(this.props.MasterToken.pageInDB));
      let response = await fetch("/drawData", { method: "POST", body: data });
      const body = await response.text();
      const parsed = JSON.parse(body);
      if (parsed.success) {
        console.log("draw post success");
        this.props.dispatch({
          type: "endPostingData",
        });
      } else {
        console.log("draw post failure");
        this.props.dispatch({
          type: "endPostingData",
        });
      }
    }
    if (status === "move") {
      if (this.state.localFlag) {
        this.draw(e);
      }
    }
  };
  drawCanvas = async (ctx, canvas) => {
    if (Object.entries(this.props.canvas).length === 0) {
      return;
    }

    const { width, height, src, clear } = this.props.canvas;
    let img = new Image(width, height);
    if (clear) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    img.onload = async () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(img, 0, 0);
      // this.props.dispatch({
      //   type: "changeMaster",
      //   src: this.canvasRef.current.toDataURL(),
      //   clear: undefined,
      //   canvasIndex: canvasIndex,
      // });
    };
    img.src = src;
  };
  handleMouseDown = async (evt) => {
    if (this.props.isScanning === false) {
      return;
    }
    let time = {};
    let today = new Date();
    time.year = today.getFullYear();
    time.month = today.getMonth() + 1;
    time.date = today.getDate();
    time.hours = today.getHours();
    time.minute = today.getMinutes();
    time.second = today.getSeconds();
    let data = new FormData();
    data.append("positionX", evt.pageX);
    data.append("positionY", evt.pageY);
    data.append("time", JSON.stringify(time));
    data.append("user", this.props.user);
    data.append("host", this.props.host);
    let response = await fetch("/scan", { method: "POST", body: data });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      console.log("Your scan is post");
    } else {
      console.log("Can't scan");
    }
    this.props.dispatch({
      type: "isScanning",
      isScanning: false,
    });
  };

  changingPenSize = (e) => this.setState({ penSize: e });
  changingPenColor = (e) => this.setState({ penColor: e });
  fitToMap = async (tokenId) => {
    let rect = canvas.getBoundingClientRect();
    let data = new FormData();
    data.append("positionX", 0);
    data.append("positionY", 0);

    // data.append("positionX", window.pageXOffset + rect.left);
    // data.append("positionY", window.pageYOffset + rect.top);
    data.append("width", rect.width);
    data.append("height", rect.height);
    data.append("tokenId", tokenId);
    data.append("host", this.props.host);

    this.props.dispatch({
      type: "startPostingData",
    });

    let response = await fetch("/fitToMap", { method: "POST", body: data });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "fitToTheMap",
        action: false,
      });
      console.log("/dragged success");
      this.props.dispatch({
        type: "endPostingData",
      });
    }
  };

  ToggleGmBar = () => {
    this.setState({
      GmBarDisplay: !this.state.GmBarDisplay,
    });
  };

  render = () => {
    let scan = this.props.MasterToken.scan.find((scan) => {
      let timeNow = {};
      let today = new Date();
      timeNow.year = today.getFullYear();
      timeNow.month = today.getMonth() + 1;
      timeNow.date = today.getDate();
      timeNow.hours = today.getHours();
      timeNow.minute = today.getMinutes();
      timeNow.second = today.getSeconds();
      return (
        scan.time.year === timeNow.year &&
        scan.time.month === timeNow.month &&
        scan.time.date === timeNow.date &&
        scan.time.hours === timeNow.hours &&
        scan.time.minute === timeNow.minute &&
        scan.time.second <= timeNow.second &&
        scan.time.second + 2 >= timeNow.second
      );
    });

    let hideProperty = (token) => {
      return this.props.user !== this.props.host && token.hide === true;
    };

    let widthSquares = this.state.width / 70;
    let heightSquares = this.state.height / 70;

    return (
      <div>
        <div className="GmBar-Menu-Button-container" onClick={this.ToggleGmBar}>
          <img className="GmBar-Menu-Button" src="/images/library_books.svg" />
        </div>
        {scan && <Scan scan={scan} />}

        <GmBar
          GmBarDisplay={this.state.GmBarDisplay}
          host={this.props.host}
          eventId={this.props.eventId}
          canvasFill={this.canvasFill}
          canvasClear={this.canvasClear}
          changingPenSize={this.changingPenSize}
          changingPenColor={this.changingPenColor}
          pageIndex={this.state.pageIndex}
          height={this.state.height}
          width={this.state.width}
          widthSquares={widthSquares}
          heightSquares={heightSquares}
        />
        <div
          onMouseDown={this.handleMouseDown}
          className="GameViewPort_Playfield"
        >
          {this.props.gameView.map((token) => {
            return (
              <div key={token.tokenId}>
                <Draggable token={token} fitToMap={this.fitToMap}>
                  <div
                    className="draggable-image"
                    id={token.tokenId}
                    style={{
                      backgroundImage: `url(${token.imgFile})`,
                      zIndex:
                        (this.props.user === this.props.host &&
                          this.props.typeSelection === "Background" &&
                          token.type === "Background") ||
                        (this.props.typeSelection === "Token" &&
                          token.type === "Token" &&
                          token.permission.includes(this.props.user))
                          ? "4"
                          : token.zIndex,
                      height: token.height + "px",
                      width: token.width + "px",
                      resize:
                        this.props.user === this.props.host ? "both" : "none",
                      display: hideProperty(token) ? "none" : "block",
                      opacity: token.hide === true ? "0.5" : "1",
                      border:
                        this.props.selectedToken === token.tokenId
                          ? "1px solid yellow"
                          : "",
                      boxSizing: "border-box",
                    }}
                  />
                </Draggable>
              </div>
            );
          })}
          <canvas ref={this.canvasRef} id="canvas" />
          <Grid
            grid={this.props.MasterToken.grid}
            height={this.state.height}
            width={this.state.width}
          />
        </div>
      </div>
    );
  };
}
let mapStateToProps = (state) => {
  return {
    dragging: state.dragging,
    gameView: state.gameView,
    page: state.page,
    user: state.user,
    typeSelection: state.typeSelection,
    MasterToken: state.MasterToken,
    isScanning: state.isScanning,
    erasingCanvas: state.erasingCanvas,
    grid: state.grid,
    postingData: state.postingData,
    canvas: state.canvas,
    selectedToken: state.selectedToken,
  };
};
export default connect(mapStateToProps)(GameViewPort);
