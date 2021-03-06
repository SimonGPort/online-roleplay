import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
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

  onlineAccess = () => {
    this.props.history.push(`/online/${this.props.user}/GM`);
  };

  // linkFacebookGroup = () => {
  //   this.props.history.push("https://www.facebook.com/groups/256791222025595/");
  // };

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
          <a href="https://www.facebook.com/groups/256791222025595/">
            <img
              src="/Images/facebook-icon.png"
              className="facebook-icon"
              // onClick={this.linkFacebookGroup}
            />
          </a>
          <button onClick={this.addLoginModal} className="navbar-button">
            Log in
          </button>
          <button onClick={this.addSignupModal} className="navbar-button">
            Sign up
          </button>
        </div>
      ) : (
        <div>
          <a href="https://www.facebook.com/groups/256791222025595/">
            <img
              src="/Images/facebook-icon.png"
              className="facebook-icon"
              // onClick={this.linkFacebookGroup}
            />
          </a>
          <button className="navbar-button option-menu">
            Option
            <div className="sub-option">
              <ul>
                <Link to="/new-event" className="noLinkDecoration">
                  <li>Create event</li>
                </Link>
                <li onClick={this.onlineAccess}>My online game</li>
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
    user: state.user,
  };
};

export default withRouter(connect(mapStateToProps)(NavbarLoginSection));
