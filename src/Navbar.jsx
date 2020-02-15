import React, { Component, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import NavbarLoginSection from "./NavbarLoginSection.jsx";

export default class Navbar extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div className="navbar">
        <div>
          <Link to="/">
            <img src="/images/DnD logo.jpg" className="navbar-logo" />
          </Link>
        </div>
        <div>
          <Link to="/new-event">Create an event</Link>
        </div>
        <NavbarLoginSection />
      </div>
    );
  };
}