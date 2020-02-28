import React, { Component } from "react";
import Chat from "./Chat.jsx";
import { connect } from "react-redux";
import Queue from "./Queue.jsx";

class Event extends Component {
  constructor() {
    super();
  }

  render = () => {
    let event = this.props.events.find(element => {
      return element.eventId === this.props.eventId;
    });

    return (
      <div className="event-page">
        <div>
          <div className="event-infos">
            <div>{event.title}</div>
            <div>{event.descrition}</div>
            <div>Organiser of this event: {event.host}</div>
            <div>
              <img src={event.img} />
            </div>
          </div>

          <div>
            <Chat id={this.props.eventId} />
          </div>
        </div>
        <div>
          <Queue
            id={this.props.eventId}
            type={event.type}
            players={event.players}
            numPlayers={event.numPlayers}
            conventionsGame={event.conventionsGame}
            host={event.host}
            login={this.props.login}
            user={this.props.user}
          />
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    events: state.events,
    login: state.login,
    user: state.user
  };
};
export default connect(mapStateToProps)(Event);
