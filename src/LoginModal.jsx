import React, { Component } from "react";
import { connect } from "react-redux";

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }

  usernameChange = (evt) => {
    this.setState({ username: evt.target.value });
  };
  passwordChange = (evt) => {
    this.setState({ password: evt.target.value });
  };

  submitHandler = async (evt) => {
    evt.preventDefault();
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("password", this.state.password);
    let response = await fetch("/login", { method: "POST", body: data });
    let body = await response.text();
    console.log("/login response", body);
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "login",
        login: true,
        user: this.state.username,
      });
      this.props.removeLoginModal();
    } else {
      alert("error with the login");
    }
  };

  render = () => {
    return (
      <>
        <div
          className="dark-background"
          onClick={() => {
            this.props.removeLoginModal();
          }}
        ></div>
        <div className="modal-container">
          <div className="LoginModalForm">
            <form onSubmit={this.submitHandler} className="modalElement">
              <div className="modalElement">
                Username
                <input
                  type="text"
                  onChange={this.usernameChange}
                  className="inputModal"
                />
              </div>
              <div className="modalElement">
                Password
                <input
                  type="password"
                  onChange={this.passwordChange}
                  className="inputModal"
                />
              </div>
              <input type="submit" value="login" className="modalSubmit" />
            </form>
          </div>
        </div>
      </>
    );
  };
}

export default connect()(LoginModal);
