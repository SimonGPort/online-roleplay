import React, { Component } from "react";
import Card from "./Card.jsx";

///Mettre l'ID de l'eventSponsored dans un array, exemple: ["255215"]
const eventSponsored = "255215";

class Announcements extends Component {
  constructor() {
    super();
  }

  render = () => {
    if (this.props.announcements.length === 0) {
      return (
        <div>
          <Card eventId={eventSponsored} />
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
