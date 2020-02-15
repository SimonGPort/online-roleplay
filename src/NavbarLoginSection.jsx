import React, { Component, useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class NavbarLoginSection extends Component {
  constructor(props) {
    super(props);
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

  render = () => (
    <>
      {this.props.login === false ? (
        <div>
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </div>
      ) : (
        <div>
          <Link to="/profil">Profil</Link>
          <Link to="/" onClick={this.handleLogout}>
            Log out
          </Link>
        </div>
      )}
    </>
  );
}

let mapStateToProps = state => {
  return {
    login: state.login
  };
};

export default connect(mapStateToProps)(NavbarLoginSection);
