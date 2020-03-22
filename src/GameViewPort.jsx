import React, { Component, useState } from "react";
import Draggable from "./Draggable.jsx";
import { connect } from "react-redux";
import GmBar from "./GmBar.jsx";

class GameViewPort extends Component {
  constructor(props) {
    super(props);
    this.canvasRef = React.createRef();
    this.state = {
      currX: 0,
      currY: 0,
      prevX: 0,
      prevY: 0,
      localFlag: false,
      ctx: undefined,
      canvas: undefined,
      canvasUrl: undefined
    };
  }

  componentDidMount() {
    this.canvasDrawingIni();
    window.addEventListener("resize", this.resizeCanvas);
    // this.drawCanvas(this.state.ctx);
  }

  componentDidUpdate() {
    if (this.state.canvasUrl !== this.props.MasterToken.canvas.src) {
      this.drawCanvas(this.state.ctx);
    }
  }
  ///// method for the canvas
  // color = obj => {
  //   switch (obj.id) {
  //     case "green":
  //       color = "green";
  //       break;
  //     case "blue":
  //       color = "blue";
  //       break;
  //     case "red":
  //       color = "red";
  //       break;
  //     case "yellow":
  //       color = "yellow";
  //       break;
  //     case "orange":
  //       color = "orange";
  //       break;
  //     case "black":
  //       color = "black";
  //       break;
  //     case "white":
  //       color = "white";
  //       break;
  //   }
  //   if (color == "white") y = 14;
  //   else y = 2;
  // };
  // componentDidMount() {
  //   this.canvasDrawingIni();
  // }

  canvasDrawingIni = () => {
    if (this.props.isDrawingAble === false) {
      return;
    }
    let canvas = this.canvasRef.current;
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
    // this.state.ctx.fillStyle = "black";
    this.state.ctx.fillRect(0, 0, width, height);

    let data = new FormData();
    data.append("src", this.canvasRef.current.toDataURL());
    data.append("host", this.props.host);
    data.append("width", this.state.canvas.width);
    data.append("height", this.state.canvas.height);
    data.append("clear", JSON.stringify(false));
    await fetch("/drawData", { method: "POST", body: data });
  };

  canvasClear = async () => {
    const { width, height } = this.state.canvas;
    // this.state.ctx.fillStyle = "blue";
    this.state.ctx.clearRect(0, 0, width, height);
    let data = new FormData();
    data.append("src", this.canvasRef.current.toDataURL());
    data.append("host", this.props.host);
    data.append("width", this.state.canvas.width);
    data.append("height", this.state.canvas.height);
    data.append("clear", JSON.stringify(true));
    await fetch("/drawData", { method: "POST", body: data });
  };

  resizeCanvas = () => {
    console.log("window.innerWidth", window.innerWidth);
    console.log("window.innerHeight", window.innerHeight);
    this.state.canvas.width = window.innerWidth;
    this.state.canvas.height = window.innerHeight;
  };

  draw = () => {
    this.state.ctx.beginPath();
    this.state.ctx.moveTo(this.state.prevX, this.state.prevY);
    this.state.ctx.lineTo(this.state.currX, this.state.currY);
    this.state.ctx.strokeStyle = "black";
    this.state.ctx.lineWidth = 2;
    this.state.ctx.stroke();
    this.state.ctx.closePath();
    this.setState({ canvasUrl: this.state.canvas.toDataURL() });
  };

  // erase = () => {
  //   var m = confirm("Want to clear");
  //   if (m) {
  //     ctx.clearRect(0, 0, w, h);
  //     document.getElementById("canvasimg").style.display = "none";
  //   }
  // };

  findxy = async (status, e) => {
    if (this.props.typeSelection !== "Draw") {
      return;
    }

    if (status === "down") {
      console.log("helloworld");
      console.log("client", e.clientX, e.clientY);
      this.setState({
        prevX: this.state.currX,
        prevY: this.state.currY,
        currX: e.clientX - this.state.canvas.offsetLeft,
        currY: e.clientY - this.state.canvas.offsetTop,
        localFlag: true
      });
      // this.props.dispatch({
      //   type: "draggingStart",
      //   tokenIdDragged: null
      // });
    }

    if (status === "up" || status === "out") {
      if (this.state.localFlag === false) {
        return;
      }
      this.setState({ localFlag: false });

      let data = new FormData();
      data.append("src", this.canvasRef.current.toDataURL());
      data.append("host", this.props.host);
      data.append("width", this.state.canvas.width);
      data.append("height", this.state.canvas.height);
      data.append("clear", JSON.stringify(false));
      await fetch("/drawData", { method: "POST", body: data });
    }

    if (status === "move") {
      if (this.state.localFlag) {
        this.setState({
          prevX: this.state.currX,
          prevY: this.state.currY,
          currX: e.clientX - this.state.canvas.offsetLeft,
          currY: e.clientY - this.state.canvas.offsetTop
        });
        this.draw();
      }
    }
  };

  drawCanvas = async ctx => {
    if (!this.props.MasterToken.canvas) {
      return;
    }
    const { width, height, src, clear } = this.props.MasterToken.canvas;
    let img = new Image(width, height);
    img.onload = () => {
      if (clear === true) {
        const { width, height } = this.state.canvas;
        this.state.ctx.clearRect(0, 0, width, height);
      }
      ctx.drawImage(img, 0, 0);
    };
    img.src = src;
    this.setState({ canvasUrl: this.props.MasterToken.canvas.src });

    let data = new FormData();
    data.append("src", this.canvasRef.current.toDataURL());
    data.append("host", this.props.host);
    data.append("width", this.state.canvas.width);
    data.append("height", this.state.canvas.height);
    data.append("clear", JSON.stringify(false));
    await fetch("/drawData", { method: "POST", body: data });
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
              position: "fixed",
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
        />
        <div onMouseDown={this.handleMouseDown}>
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
    isScanning: state.isScanning
  };
};

export default connect(mapStateToProps)(GameViewPort);
