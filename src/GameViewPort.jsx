import React, { Component, useState } from "react";
import Draggable from "./Draggable.jsx";
import { connect } from "react-redux";

class GameViewPort extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.gameInterval = setInterval(this.updateGameView, 500);
  }

  // componentWillUnmount() { a faire, il faut enlever le updateGameView
  // }

  updateGameView = async () => {
    if (this.props.dragging === true) {
      return;
    }
    let response = await fetch("/fetchGameView");
    // "/fetchGameView?eventId=" + this.props.id
    let responseBody = await response.text();
    let body = JSON.parse(responseBody);
    if (body.success) {
      console.log("body.onlineView", body.gameView);
      this.props.dispatch({ type: "gameUpdate", gameView: body.gameView });
      return;
    }
    console.log("error with the gameViewUpdate");
  };

  render = () => {
    return (
      <div>
        {this.props.gameView.map((token, idx) => {
          return (
            <div key={idx}>
              <Draggable token={token}>
                <div className="draggable-image" />
              </Draggable>
            </div>
          );
        })}
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    dragging: state.dragging,
    gameView: state.gameView
  };
};

export default connect(mapStateToProps)(GameViewPort);
