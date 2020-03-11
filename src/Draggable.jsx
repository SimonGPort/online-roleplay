import React, { Component } from "react";
// import styled, { css } from "styled-components";
import { connect } from "react-redux";

class Draggable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,
      prevPositionX: 0,
      prevPositionY: 0,
      isResizing: false
    };
  }
  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown = ({ clientX, clientY }) => {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
    const child = document.getElementById(this.props.token.tokenId);

    console.log("child", child.offsetWidth);
    let differenceX = clientX - this.props.token.positionX;
    let differenceY = clientY - this.props.token.positionY;
    if (
      differenceX >= child.offsetWidth * 0.9 &&
      differenceY >= child.offsetHeight * 0.9
    ) {
      return;
    }

    this.setState({
      isDragging: true,
      prevPositionX: clientX,
      prevPositionY: clientY
    });
    this.props.dispatch({
      type: "draggingStart",
      tokenIdDragged: this.props.token.tokenId
    });
  };

  handleMouseMove = ({ clientX, clientY }) => {
    const { isDragging, isResizing } = this.state;

    if (!isDragging) {
      return;
    }
    if (isResizing) {
      return;
    }
    if (this.props.token.type !== this.props.typeSelection) {
      return;
    }

    let differenceX = clientX - this.state.prevPositionX;
    let differenceY = clientY - this.state.prevPositionY;
    this.props.dispatch({
      type: "MouseMoveToken",
      positionX: Number(this.props.token.positionX) + differenceX,
      positionY: Number(this.props.token.positionY) + differenceY,
      tokenId: this.props.token.tokenId
    });
    this.setState({
      prevPositionX: clientX,
      prevPositionY: clientY
    });
  };

  handleMouseUp = ({ clientX, clientY }) => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    this.setState({
      isDragging: false
    });
    this.props.dispatch({
      type: "draggingEnd"
    });

    this.dragged(this.props.token.positionX, this.props.token.positionY);
  };

  dragged = async (positionX, positionY) => {
    let data = new FormData();
    data.append("positionX", positionX);
    data.append("positionY", positionY);
    data.append("tokenId", this.props.token.tokenId);
    await fetch("/dragged", { method: "POST", body: data });
  };

  render() {
    const { children } = this.props;

    return (
      <div>
        <div
          className="online-container"
          style={{
            position: "absolute",
            top: `${this.props.token.positionY}px`,
            left: `${this.props.token.positionX}px`
          }}
          onMouseDown={this.handleMouseDown}
        >
          {children}
        </div>
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    typeSelection: state.typeSelection
  };
};

export default connect(mapStateToProps)(Draggable);
