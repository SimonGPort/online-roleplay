import React, { Component, useState } from "react";
import Draggable from "./Draggable.jsx";
import { connect } from "react-redux";

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
      canvas: undefined
    };
  }

  componentDidMount() {
    this.gameInterval = setInterval(this.updateGameView, 500);
    this.canvasDrawingIni();
    window.addEventListener("resize", this.resizeCanvas);
  }

  componentWillUnmount() {
    clearInterval(this.gameInterval);
  }

  updateGameView = async () => {
    if (this.props.dragging === true) {
      return;
    }
    let response = await fetch(
      "/fetchGameView?host=" + this.props.host + "&page=" + this.props.page
    );
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      console.log("body.onlineView", body.gameView);
      this.props.dispatch({ type: "gameUpdate", gameView: body.gameView });
      return;
    }
    console.log("error with the gameViewUpdate");
  };

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
    this.setState({
      canvas: canvas,
      ctx: canvas.getContext("2d")
    });

    // w = canvas.width;
    // h = canvas.height;
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

  resizeCanvas = () => {
    console.log("window.innerWidth", window.innerWidth);
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
  };
  // erase = () => {
  //   var m = confirm("Want to clear");
  //   if (m) {
  //     ctx.clearRect(0, 0, w, h);
  //     document.getElementById("canvasimg").style.display = "none";
  //   }
  // };

  findxy = (status, e) => {
    if (status === "down") {
      this.setState({
        prevX: this.state.currX,
        prevY: this.state.currY,
        currX: e.clientX - this.state.canvas.offsetLeft,
        currY: e.clientY - this.state.canvas.offsetTop,
        localFlag: true
      });

      // this.props.dispatch({
      //   type: "isDrawing",
      //   action: true
      // });

      // dot_flag = true;
      // if (dot_flag) {
      //   ctx.beginPath();
      //   ctx.fillStyle = color;
      //   ctx.fillRect(currX, currY, 2, 2);
      //   ctx.closePath();
      //   dot_flag = false;
      // }
    }
    if (status === "up" || status === "out") {
      this.setState({ localFlag: false });
      // this.props.dispatch({
      //   type: "isDrawing",
      //   action: false
      // });
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

  render = () => {
    console.log("gameView", this.props.gameView);
    return (
      <div>
        {this.props.gameView.map((token, idx) => {
          return (
            <div key={token.tokenId}>
              <Draggable token={token}>
                <div
                  className="draggable-image"
                  id={token.tokenId}
                  style={{
                    backgroundImage: `url(${token.imgFile})`,
                    zIndex: token.zIndex,
                    height: token.height + "px",
                    width: token.width + "px",
                    resize:
                      this.props.user === this.props.host ? "both" : "none",
                    display:
                      this.props.user !== this.props.host && token.hide === true
                        ? "none"
                        : "block",
                    opacity: token.hide === true ? "0.5" : "1"
                  }}
                />
              </Draggable>
            </div>
          );
        })}
        <canvas ref={this.canvasRef} id="can" />
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    dragging: state.dragging,
    gameView: state.gameView,
    page: state.page,
    user: state.user
  };
};

export default connect(mapStateToProps)(GameViewPort);
