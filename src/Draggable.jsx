import React, { Component } from "react";
// import styled, { css } from "styled-components";
import { connect } from "react-redux";

class Draggable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDragging: false,

      originalX: 0,
      originalY: 0,

      translateX: 0,
      translateY: 0,

      // translateX: this.props.token.translateX,
      // translateY: this.props.token.translateY,

      lastTranslateX: 0,
      lastTranslateY: 0
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
      originalX: clientX,
      originalY: clientY,
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
    this.setState(prevState => ({
      translateX: clientX - prevState.originalX + prevState.lastTranslateX,
      translateY: clientY - prevState.originalY + prevState.lastTranslateY
    }));
  };

  handleMouseUp = () => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    this.setState({
      originalX: 0,
      originalY: 0,
      lastTranslateX: this.state.translateX,
      lastTranslateY: this.state.translateY,

      isDragging: false
    });
    this.props.dispatch({
      type: "draggingEnd"
    });
    this.dragged();
  };

  dragged = async evt => {
    let data = new FormData();
    data.append("translateX", this.state.translateX);
    data.append("translateY", this.state.translateY);
    data.append("tokenId", "1");
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
            transform: `translate(${this.state.translateX}px, ${this.state.translateY}px)`
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
