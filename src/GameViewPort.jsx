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

  render = () => {
    return (
      <div>
        {this.props.gameView.map((token, idx) => {
          return (
            <div key={token.tokenId}>
              <Draggable token={token}>
                <div
                  className="draggable-image resizer"
                  id={token.tokenId}
                  style={{
                    backgroundImage: `url(${token.imgFile})`,
                    zIndex: token.zIndex,
                    height: token.height + "px",
                    width: token.width + "px"
                  }}
                />
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
    gameView: state.gameView,
    page: state.page
  };
};

export default connect(mapStateToProps)(GameViewPort);
