import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: ""
    };
  }

  usernameChange = evt => {
    this.setState({ username: evt.target.value });
  };
  passwordChange = evt => {
    this.setState({ password: evt.target.value });
  };

  submitHandler = async evt => {
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
        user: this.state.username
      });
      this.props.history.push("/");
    } else {
      alert("error with the login");
    }
  };

  render = () => {
    return (
      <form onSubmit={this.submitHandler} className="modalPage">
        <div>
          Username
          <input type="text" onChange={this.usernameChange} />
        </div>
        <div>
          Password
          <input type="text" onChange={this.passwordChange} />
        </div>
        <input type="submit" value="login" className="modalPageSubmit" />
      </form>
    );
  };
}

export default withRouter(connect()(Login));
