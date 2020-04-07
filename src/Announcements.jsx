import React, { Component } from "react";
import Card from "./Card.jsx";

///Mettre l'ID de l'eventSponsored dans un array, exemple: ["255215"]
const eventSponsored = "904373";

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
              Welcome to <span className="navbar-logo-text">RollPlay</span>
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

export default Announcements;
