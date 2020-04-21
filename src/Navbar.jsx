import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import NavbarLoginSection from "./NavbarLoginSection.jsx";

class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  removeSelectionEvent = () => {
    this.props.dispatch({
      type: "removeSelectionEvent",
    });
  };

  render = () => {
    return (
      <div id="navbar">
        <div>
          <Link
            to="/"
            className="logo-container noLinkDecoration"
            onClick={this.removeSelectionEvent}
          >
            <img src="/Images/dice20_logo3.png" className="navbar-logo" />
            <div className="navbar-logo-text">GloriousRoll </div>
          </Link>
        </div>
        <div></div>
        <NavbarLoginSection />
      </div>
    );
  };
}

export default connect()(Navbar);
