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
          <Link to="/">
            <img src="/images/DnD logo.jpg" className="navbar-logo" />
          </Link>
        </div>
        <div></div>
        <NavbarLoginSection />
      </div>
    );
  };
}
