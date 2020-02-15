import React, { Component } from "react";
import Navbar from "./Navbar.jsx";
import { Route, BrowserRouter, Link } from "react-router-dom";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import Main from "./Main.jsx";

class App extends Component {
  renderMainPage = () => {
    return <Main />;
  };

  renderLoginPage = () => {
    return <Login />;
  };

  renderSignupPage = () => {
    return <Signup />;
  };
  renderProfilPage = () => {
    return <div>Hello ProfilPage</div>;
  };

  render = () => {
    return (
      <BrowserRouter>
        <Navbar />
        <Route path="/" exact={true} render={this.renderMainPage} />
        <Route path="/login" exact={true} render={this.renderLoginPage} />
        <Route path="/signup" exact={true} render={this.renderSignupPage} />
        <Route path="/profil" exact={true} render={this.renderProfilPage} />
      </BrowserRouter>
    );
  };
}

export default App;
