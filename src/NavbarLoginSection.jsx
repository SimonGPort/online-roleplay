import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal.jsx";
import SignupModal from "./SignupModal.jsx";

class NavbarLoginSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginModal: false,
      signupModal: false,
    };
  }

  handleLogout = async () => {
    const response = await fetch("/logout", { method: "POST" });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      console.log("dispatch logout");
      this.props.dispatch({ type: "logout", login: false });
    }
  };

  removeLoginModal = () => {
    this.setState({ loginModal: false });
  };

  addLoginModal = () => {
    this.setState({ loginModal: true });
  };

  removeSignupModal = () => {
    this.setState({ signupModal: false });
  };

  addSignupModal = () => {
    this.setState({ signupModal: true });
  };

  render = () => (
    <>
      {this.props.login === false ? (
        <div>
          {this.state.loginModal === true && (
            <LoginModal removeLoginModal={this.removeLoginModal} />
          )}
          {this.state.signupModal === true && (
            <SignupModal removeSignupModal={this.removeSignupModal} />
          )}
          <button onClick={this.addLoginModal} className="navbar-button">
            Log in
          </button>
          <button onClick={this.addSignupModal} className="navbar-button">
            Sign up
          </button>
        </div>
      ) : (
        <div>
          <button className="navbar-button option-menu">
            Option
            <div className="sub-option">
              <ul>
                <Link to="/new-event" className="noLinkDecoration">
                  <li>Create event</li>
                </Link>
                <li>My online game</li>
              </ul>
            </div>
          </button>
          <Link to="/" onClick={this.handleLogout} className="navbar-button">
            Log out
          </Link>
        </div>
      )}
    </>
  );
}

let mapStateToProps = (state) => {
  return {
    login: state.login,
  };
};

export default connect(mapStateToProps)(NavbarLoginSection);
