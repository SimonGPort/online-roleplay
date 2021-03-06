import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      email: "",
      password: "",
    };
  }

  usernameChange = (evt) => {
    this.setState({ username: evt.target.value });
  };
  emailChange = (evt) => {
    this.setState({ email: evt.target.value });
  };
  passwordChange = (evt) => {
    this.setState({ password: evt.target.value });
  };

  submitHandler = async (evt) => {
    evt.preventDefault();
    let data = new FormData();
    data.append("username", this.state.username);
    data.append("email", this.state.email);
    data.append("password", this.state.password);
    let response = await fetch("/signup", { method: "POST", body: data });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "signup",
        login: true,
        user: this.state.username,
      });
      this.props.history.push("/");
    } else {
      alert("error");
    }
  };

  render = () => {
    return (
      <form onSubmit={this.submitHandler} className="modalPage">
        <div className="modalElement">
          Username
          <input
            type="text"
            onChange={this.usernameChange}
            className="inputModal"
          />
        </div>
        <div className="modalElement">
          Email
          <input
            type="text"
            onChange={this.emailChange}
            className="inputModal"
          />
        </div>
        <div className="modalElement">
          Password
          <input
            type="text"
            onChange={this.passwordChange}
            className="inputModal"
          />
        </div>
        <input type="submit" value="signup" className="modalPageSubmit" />
      </form>
    );
  };
}

export default withRouter(connect()(Signup));
