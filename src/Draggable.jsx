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
      isResizing: false,
      positionX: undefined,
      positionY: undefined,
    };
  }

  componentDidMount() {
    this.setState({
      positionX: this.props.token.positionX,
      positionY: this.props.token.positionY,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  eraseToken = async (evt) => {
    let data = new FormData();
    data.append("tokenId", this.props.token.tokenId);
    let response = await fetch("/eraseToken", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      console.log("the token is erase");
    }
  };

  hideToken = async (evt) => {
    let data = new FormData();
    console.log(this.props.token);
    data.append("token", JSON.stringify(this.props.token));
    let response = await fetch("/hideToken", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      console.log("the token is hiding");
    }
  };

  duplicateToken = async (evt) => {
    let data = new FormData();
    console.log(this.props.token);
    data.append("number", this.props.isDuplicateToken.number);
    data.append("token", JSON.stringify(this.props.token));
    let response = await fetch("/duplicateToken", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "isDuplicate",
        isDuplicate: false,
      });
      console.log("the token is duplicate");
    }
  };

  handleMouseDown = ({ clientX, clientY }) => {
    this.props.dispatch({
      type: "permissionToken",
      permissionToken: this.props.token.permission,
      tokenId: this.props.token.tokenId,
    });

    if (!this.props.token.permission.includes(this.props.user)) {
      return;
    }

    if (this.props.fitToTheMap) {
      this.props.fitToMap(this.props.token.tokenId);
      return;
    }

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

    let rectChild = child.getBoundingClientRect();
    let differenceX = clientX - rectChild.left;
    let differenceY = clientY - rectChild.top;
    // let differenceX = clientX - this.state.positionX;
    // let differenceY = clientY - this.state.positionY;
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
      prevPositionY: clientY,
    });
    this.props.dispatch({
      type: "Operation_ComponentDBRedux_Complete",
      action: false,
    });
    this.props.dispatch({
      type: "draggingStart",
      tokenIdDragged: this.props.token.tokenId,
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
    // this.props.dispatch({
    //   type: "MouseMoveToken",
    //   positionX: Number(this.state.positionX) + differenceX,
    //   positionY: Number(this.state.positionY) + differenceY,
    //   tokenId: this.props.token.tokenId,
    // });
    this.setState({
      positionX: Number(this.state.positionX) + differenceX,
      positionY: Number(this.state.positionY) + differenceY,
      prevPositionX: clientX,
      prevPositionY: clientY,
    });
  };

  handleMouseUp = ({ clientX, clientY }) => {
    if (this.props.fitToTheMap) {
      return;
    }
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
    const child = document.getElementById(this.props.token.tokenId);
    this.setState({
      isDragging: false,
    });

    this.dragged(
      this.state.positionX,
      this.state.positionY,
      child.offsetWidth,
      child.offsetHeight
    );

    this.props.dispatch({
      type: "draggingEnd",
    });
  };

  dragged = async (positionX, positionY, width, height) => {
    let data = new FormData();
    data.append("positionX", positionX);
    data.append("positionY", positionY);
    data.append("width", width);
    data.append("height", height);
    data.append("tokenId", this.props.token.tokenId);
    data.append("host", this.props.token.host);

    this.props.dispatch({
      type: "startPostingData",
    });

    let response = await fetch("/dragged", { method: "POST", body: data });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      console.log("/dragged success");
      this.props.dispatch({
        type: "endPostingData",
      });
    }
  };

  render() {
    const { children } = this.props;

    return (
      <div>
        <div
          className="online-container"
          id="draggable-container"
          style={{
            display: this.props.grid === true ? "block" : "none",
          }}
          style={{
            position: "absolute",
            top: this.props.Operation_ComponentDBRedux_Complete
              ? `${this.props.token.positionY}px`
              : `${this.state.positionY}px`,
            left: this.props.Operation_ComponentDBRedux_Complete
              ? `${this.props.token.positionX}px`
              : `${this.state.positionX}px`,
          }}
          onMouseDown={this.handleMouseDown}
        >
          {children}
        </div>
      </div>
    );
  }
}

let mapStateToProps = (state) => {
  return {
    typeSelection: state.typeSelection,
    isErasingToken: state.isErasingToken,
    user: state.user,
    isDuplicateToken: state.isDuplicateToken,
    isHidingToken: state.isHidingToken,
    Operation_ComponentDBRedux_Complete:
      state.Operation_ComponentDBRedux_Complete,
    fitToTheMap: state.fitToTheMap,
  };
};

export default connect(mapStateToProps)(Draggable);
