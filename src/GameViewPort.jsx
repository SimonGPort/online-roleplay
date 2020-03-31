import React, { Component, useState } from "react";
import Draggable from "./Draggable.jsx";
import { connect } from "react-redux";
import GmBar from "./GmBar.jsx";
import Grid from "./Grid.jsx";

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
      penSize: 5,
      penColor: "black"
    };
  }
  componentDidMount() {
    this.canvasDrawingIni();
    window.addEventListener("resize", this.resizeCanvas);
  }
  componentDidUpdate() {
    if (this.state.localFlag) {
      return;
    }
    if (
      this.canvasRef.current.toDataURL() !== this.props.MasterToken.canvas.src
    ) {
      this.drawCanvas(this.state.ctx, this.state.canvas);
    }
  }
  canvasDrawingIni = () => {
    if (this.props.isDrawingAble === false) {
      return;
    }
    let canvas = this.canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log("window size", canvas.width, canvas.height);
    let ctx = canvas.getContext("2d");
    this.setState({
      canvas: canvas,
      ctx: ctx,
      canvasUrl: canvas.toDataURL()
    });
    canvas.addEventListener("mousemove", evt => {
      this.findxy("move", evt);
    });
    canvas.addEventListener("mousedown", evt => {
      this.findxy("down", evt);
    });
    canvas.addEventListener("mouseup", evt => {
      this.findxy("up", evt);
    });
    canvas.addEventListener("mouseout", evt => {
      this.findxy("out", evt);
    });
  };
  canvasFill = async () => {
    const { width, height } = this.state.canvas;
    this.state.ctx.fillStyle = this.state.penColor;
    this.state.ctx.fillRect(0, 0, width, height);
    let data = new FormData();
    data.append("canvas", JSON.stringify(this.props.MasterToken.canvas));
    data.append("page", this.props.page.gmPage);
    data.append("src", this.canvasRef.current.toDataURL());
    data.append("host", this.props.host);
    data.append("width", this.state.canvas.width);
    data.append("height", this.state.canvas.height);
    data.append("clear", JSON.stringify(false));
    await fetch("/drawData", { method: "POST", body: data });
  };

  canvasClear = async () => {
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
    await fetch("/drawData", { method: "POST", body: data });
  };
  resizeCanvas = () => {
    const canvas = { ...this.state.canvas };
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.setState({ canvas });
    this.drawCanvas(this.state.ctx, this.state.canvas);
  };
  draw = e => {
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
      // canvasUrl: this.state.canvas.toDataURL(),
      prevX: e.offsetX,
      prevY: e.offsetY
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
        localFlag: true
      });
      this.props.dispatch({
        type: "draggingStart",
        tokenIdDragged: null
      });
    }
    if (status === "up" || status === "out") {
      console.log("up");
      if (this.state.localFlag === false) {
        return;
      }

      let data = new FormData();
      data.append("src", this.canvasRef.current.toDataURL());
      data.append("host", this.props.host);
      data.append("width", this.state.canvas.width);
      data.append("height", this.state.canvas.height);
      data.append("clear", JSON.stringify(this.props.erasingCanvas));
      data.append("page", this.props.page.gmPage);
      data.append("canvas", JSON.stringify(this.props.MasterToken.canvas));
      await fetch("/drawData", { method: "POST", body: data });

      let pageDiplay = undefined;
      if (this.props.user === this.props.host) {
        pageDiplay = this.props.page.gmPage;
      } else {
        pageDiplay = this.props.page.playersPage;
      }
      let canvasIndex = this.props.MasterToken.canvas.findIndex(canvas => {
        return canvas.page === pageDiplay;
      });

      this.props.dispatch({
        type: "changeMaster",
        clear: this.props.erasingCanvas,
        src: this.canvasRef.current.toDataURL(),
        canvasIndex: canvasIndex
      });
      this.props.dispatch({ type: "draggingEnd" });
      this.setState({
        localFlag: false
      });
    }
    if (status === "move") {
      if (this.state.localFlag) {
        this.draw(e);
      }
    }
  };
  drawCanvas = async (ctx, canvas) => {
    if (this.props.MasterToken.canvas === []) {
      return;
    }
    let pageDiplay = undefined;
    if (this.props.user === this.props.host) {
      pageDiplay = this.props.page.gmPage;
    } else {
      pageDiplay = this.props.page.playersPage;
    }

    let canvasIndex = this.props.MasterToken.canvas.findIndex(canvas => {
      return canvas.page === pageDiplay;
    });
    let canvasDisplay = this.props.MasterToken.canvas.find(canvas => {
      return canvas.page === pageDiplay;
    });
    if (canvasDisplay === undefined) {
      return;
    }

    const { width, height, src, clear } = canvasDisplay;
    let img = new Image(width, height);
    if (clear === true) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    img.onload = async () => {
      ctx.globalCompositeOperation = "source-over";
      ctx.drawImage(img, 0, 0);
      this.props.dispatch({
        type: "changeMaster",
        src: this.canvasRef.current.toDataURL(),
        canvasIndex: canvasIndex
      });
    };
    img.src = src;
  };
  handleMouseDown = async ({ clientX, clientY }) => {
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
    data.append("positionX", clientX);
    data.append("positionY", clientY);
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
      isScanning: false
    });
  };

  changingPenSize = e => this.setState({ penSize: e });
  changingPenColor = e => this.setState({ penColor: e });

  render = () => {
    let scan = this.props.MasterToken.scan.find(scan => {
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
        scan.time.second + 1 >= timeNow.second
      );
    });
    let hideProperty = token => {
      return this.props.user !== this.props.host && token.hide === true;
    };
    return (
      <div>
        {scan !== undefined ? (
          <img
            src="/images/scan.gif"
            className="scan"
            style={{
              top: `${scan.positionY}px`,
              left: `${scan.positionX}px`,
              position: "absolute",
              zIndex: 5
            }}
          />
        ) : (
          ""
        )}
        <GmBar
          host={this.props.host}
          eventId={this.props.eventId}
          canvasFill={this.canvasFill}
          canvasClear={this.canvasClear}
          changingPenSize={this.changingPenSize}
          changingPenColor={this.changingPenColor}
          pageIndex={this.state.pageIndex}
        />
        <div
          onMouseDown={this.handleMouseDown}
          className="GameViewPort_Playfield"
        >
          {this.props.gameView.map(token => {
            return (
              <div key={token.tokenId}>
                <Draggable token={token}>
                  <div
                    className="draggable-image"
                    id={token.tokenId}
                    style={{
                      backgroundImage: `url(${token.imgFile})`,
                      zIndex:
                        (this.props.user === this.props.host &&
                          this.props.typeSelection === "Background" &&
                          token.type === "Background") ||
                        (this.props.user === this.props.host &&
                          this.props.typeSelection === "Token" &&
                          token.type === "Token")
                          ? "4"
                          : token.zIndex,
                      height: token.height + "px",
                      width: token.width + "px",
                      resize:
                        this.props.user === this.props.host ? "both" : "none",
                      display: hideProperty(token) ? "none" : "block",
                      opacity: token.hide === true ? "0.5" : "1"
                    }}
                  />
                </Draggable>
              </div>
            );
          })}
          <canvas ref={this.canvasRef} id="canvas" />
          <Grid grid={this.props.MasterToken.grid} />
        </div>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    dragging: state.dragging,
    gameView: state.gameView,
    page: state.page,
    user: state.user,
    typeSelection: state.typeSelection,
    MasterToken: state.MasterToken,
    canvasFill: state.canvasFill,
    canvasClear: state.canvasClear,
    isScanning: state.isScanning,
    erasingCanvas: state.erasingCanvas,
    grid: state.grid
  };
};
export default connect(mapStateToProps)(GameViewPort);
