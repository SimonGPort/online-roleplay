import React, { Component } from "react";
import Card from "./Card.jsx";
import { connect } from "react-redux";

///Mettre l'ID de l'eventSponsored en string, exemple: "221641"
const eventSponsored = "221641";

class Announcements extends Component {
  constructor() {
    super();
  }

  render = () => {
    if (this.props.announcements.length === 0) {
      return (
        <div className="announcements-zone">
          <div className="welcome-card">
            <p>
              Welcome to <span className="navbar-logo-text">GloriousRoll</span>
            </p>
            <p>
              Take a closer look at this role-playing plateform and find out why
              millions of players worldwide have stepped into the boots of
              mighty heroes to create their own stories. We encourage you to
              start your own game and feel free to take part!
            </p>
          </div>
          <div className="event-sponsored-banner">Event Sponsored</div>
          <Card eventId={eventSponsored} Sponsored={true} />
        </div>
      );
    } else {
      return (
        <div>
          {this.props.announcements.map((id, index) => {
            return (
              <div key={index}>
                <Card eventId={id} />
              </div>
            );
          })}
        </div>
      );
    }
  };
}

let mapStateToProps = (state) => {
  return {
    announcements: state.selectionEvent,
  };
};

export default connect(mapStateToProps)(Announcements);
