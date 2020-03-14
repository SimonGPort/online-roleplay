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

  eraseToken = async evt => {
    let data = new FormData();
    data.append("tokenId", this.props.token.tokenId);
    let response = await fetch("/eraseToken", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      console.log("the token is erase");
    }
  };

  hideToken = async evt => {
    let data = new FormData();
    console.log(this.props.token);
    data.append("token", JSON.stringify(this.props.token));
    let response = await fetch("/hideToken", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      console.log("the token is hiding");
    }
  };

  duplicateToken = async evt => {
    let data = new FormData();
    console.log(this.props.token);
    data.append("number", this.props.isDuplicateToken.number);
    data.append("token", JSON.stringify(this.props.token));
    let response = await fetch("/duplicateToken", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "isDuplicate",
        isDuplicate: false
      });
      console.log("the token is duplicate");
    }
  };

  handleMouseDown = ({ clientX, clientY }) => {
    if (
      this.props.isErasingToken &&
      this.props.typeSelection === this.props.token.type
    ) {
      this.eraseToken();
      return;
    }

    if (
      this.props.isDuplicateToken.action &&
      this.props.typeSelection === this.props.token.type
    ) {
      this.duplicateToken();
      return;
    }

    if (
      this.props.isHidingToken &&
      this.props.typeSelection === this.props.token.type
    ) {
      this.hideToken();
      return;
    }

    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
    const child = document.getElementById(this.props.token.tokenId);

    let differenceX = clientX - this.props.token.positionX;
    let differenceY = clientY - this.props.token.positionY;
    if (
      this.props.user === this.props.token.host &&
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
    const child = document.getElementById(this.props.token.tokenId);
    this.setState({
      isDragging: false
    });
    this.props.dispatch({
      type: "draggingEnd"
    });

    this.dragged(
      this.props.token.positionX,
      this.props.token.positionY,
      child.offsetWidth,
      child.offsetHeight
    );
  };

  dragged = async (positionX, positionY, width, height) => {
    let data = new FormData();
    data.append("positionX", positionX);
    data.append("positionY", positionY);
    data.append("width", width);
    data.append("height", height);
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
    typeSelection: state.typeSelection,
    isErasingToken: state.isErasingToken,
    user: state.user,
    isDuplicateToken: state.isDuplicateToken,
    isHidingToken: state.isHidingToken
  };
};

export default connect(mapStateToProps)(Draggable);
