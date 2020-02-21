import React, { Component } from "react";
import Navbar from "./Navbar.jsx";
import { Route, BrowserRouter, Link } from "react-router-dom";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import MainPage from "./MainPage.jsx";
import CreationEvent from "./CreationEvent.jsx";
import { connect } from "react-redux";
import Event from "./Event.jsx";

class App extends Component {
  renderMainPage = () => {
    return <MainPage />;
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
  renderCreationEventPage = () => {
    return <CreationEvent />;
  };

  componentDidMount() {
    this.fetchSession();
  }

  fetchSession = async () => {
    let response = await fetch("/autoLogin", { method: "POST" });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "login",
        login: true,
        username: body.username
      });
    } else {
      console.log("no autologin");
    }
  };

  render = () => {
    return (
      <BrowserRouter>
        <Navbar />
        <Route path="/" exact={true} render={this.renderMainPage} />
        <Route path="/login" exact={true} render={this.renderLoginPage} />
        <Route path="/signup" exact={true} render={this.renderSignupPage} />
        <Route path="/profil" exact={true} render={this.renderProfilPage} />
        <Route
          path="/new-event"
          exact={true}
          render={this.renderCreationEventPage}
        />
        <Route
          path="/event/:eventId"
          render={routeProps => (
            <Event eventId={routeProps.match.params.eventId} />
          )}
        />
      </BrowserRouter>
    );
  };
}

export default connect()(App);
