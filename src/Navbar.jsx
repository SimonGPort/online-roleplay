import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import NavbarLoginSection from "./NavbarLoginSection.jsx";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div id="navbar">
        <div>
          <Link to="/" className="logo-container noLinkDecoration">
            <img src="/images/logo dice20 final.png" className="navbar-logo" />
            <div className="navbar-logo-text">RollPlay </div>
          </Link>
        </div>
        <div></div>
        <NavbarLoginSection />
      </div>
    );
  };
}
