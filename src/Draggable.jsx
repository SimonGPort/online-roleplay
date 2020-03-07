import React, { Component } from "react";
// import styled, { css } from "styled-components";
import { connect } from "react-redux";

class Draggable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false
    };
  }
  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown = ({ clientX, clientY }) => {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);

    this.setState({
      isDragging: true
    });
    this.props.dispatch({
      type: "draggingStart",
      tokenIdDragged: "1"
    });
  };

  handleMouseMove = ({ clientX, clientY }) => {
    const { isDragging } = this.state;

    if (!isDragging) {
      return;
    }
    this.props.dispatch({
      type: "MouseMoveToken",
      positionX: clientX,
      positionY: clientY,
      tokenId: this.props.token.tokenId
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
    this.dragged(clientX, clientY);
  };

  dragged = async (clientX, clientY) => {
    let data = new FormData();
    console.log("client", clientX, clientY);
    data.append("positionX", clientX);
    data.append("positionY", clientY);
    data.append("tokenId", this.props.token.tokenId);
    await fetch("/dragged", { method: "POST", body: data });
  };

  // submitHandler = async evt => {
  //   evt.preventDefault();
  //   let data = new FormData();
  //   data.append("username", this.state.username);
  //   data.append("password", this.state.password);
  //   let response = await fetch("/login", { method: "POST", body: data });
  //   let body = await response.text();
  //   console.log("/login response", body);
  //   body = JSON.parse(body);
  //   if (body.success) {
  //     this.props.dispatch({
  //       type: "login",
  //       login: true,
  //       user: this.state.username
  //     });
  //     this.props.history.push("/");
  //   } else {
  //     alert("error with the login");
  //   }
  // };

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

          // isDragging={this.state.isDragging}
        >
          {children}
        </div>
      </div>
    );
  }
}

// let Container = styled.div.attrs({
//   style: ({ x, y }) => ({
//     transform: `translate(${x}px, ${y}px)`
//   })
// });

export default connect()(Draggable);
