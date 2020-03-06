import React, { Component } from "react";
import Navbar from "./Navbar.jsx";
import { Route, BrowserRouter, Link } from "react-router-dom";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import MainPage from "./MainPage.jsx";
import CreationEvent from "./CreationEvent.jsx";
import { connect } from "react-redux";
import Event from "./Event.jsx";
import CreationConventionTable from "./CreationConventionTable.jsx";
import ConventionEvent from "./ConventionEvent.jsx";
import Online from "./Online.jsx";

class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };
  }

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
    Promise.all([this.fetchSession(), this.fetchEvents()]).then(() =>
      this.setState({ loading: true })
    );
  }

  fetchSession = async () => {
    let response = await fetch("/autoLogin", { method: "POST" });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "login",
        login: true,
        user: body.username
      });
    } else {
      console.log("no autologin");
    }
  };

  fetchEvents = async () => {
    let response = await fetch("/fetchEvents");
    let body = await response.text();
    body = JSON.parse(body);
    console.log("/fetchEvents", body);
    if (body.success) {
      console.log("fetchEvents success");
      this.props.dispatch({
        type: "fetchEvents",
        events: body.events
      });
    } else {
      console.log("fetchEvents error");
    }
  };

  render = () => {
    if (this.state.loading === false) {
      return <div>Loading... </div>;
    }
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
        <Route
          path="/online/:host/:eventId"
          render={routeProps => (
            <Online
              host={routeProps.match.params.host}
              eventId={routeProps.match.params.eventId}
            />
          )}
        />
        <Route
          path="/creation-convention-table/:eventId"
          render={routeProps => {
            console.log(routeProps.match.params.eventId);
            return (
              <CreationConventionTable
                eventId={routeProps.match.params.eventId}
              />
            );
          }}
        />
        <Route
          path="/convention-event/:eventId/:tableId"
          render={routeProps => {
            return (
              <ConventionEvent
                tableId={routeProps.match.params.tableId}
                eventId={routeProps.match.params.eventId}
              />
            );
          }}
        />
      </BrowserRouter>
    );
  };
}

export default connect()(App);
