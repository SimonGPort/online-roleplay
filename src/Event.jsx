import React, { Component } from "react";
import Chat from "./Chat.jsx";
import { connect } from "react-redux";
import Queue from "./Queue.jsx";
import { withRouter } from "react-router-dom";

class Event extends Component {
  constructor() {
    super();
  }

  accessToTheOnlineGame = () => {
    let event = this.props.events.find(element => {
      return element.eventId === this.props.eventId;
    });

    let isOnlineGameIsOpen = () => {
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let date = today.getDate();
      let hours = today.getHours();
      let minute = today.getMinutes();
      let yearEvent = parseInt(event.when.slice(0, 4));
      let monthEvent = parseInt(event.when.slice(5, 7));
      let dateEvent = parseInt(event.when.slice(8));
      let hoursEvent = parseInt(event.time.slice(0, 2));
      let minuteEvent = parseInt(event.time.slice(3));
      let time = hours * 60 + minute;
      let timeEvent = hoursEvent * 60 + minuteEvent;
      if (
        (year === yearEvent &&
          month === monthEvent &&
          date === dateEvent &&
          time >= timeEvent &&
          time <= timeEvent + 60 &&
          event.players.includes(this.props.user)) ||
        this.props.user === event.host
      ) {
        return true;
      }
      return false;
    };

    if (isOnlineGameIsOpen()) {
      this.props.history.push(`/online/${event.host}/${event.eventId}`);
    } else {
      alert("The game is not open");
    }
  };

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
            {event.type === "Online" && (
              <div>
                <button onClick={() => this.accessToTheOnlineGame()}>
                  Access to the online game
                </button>
                <div>{event.time}</div>
              </div>
            )}
          </div>

          <div>
            <Chat
              id={this.props.eventId}
              user={this.props.user}
              chat={event.chat}
            />
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
export default withRouter(connect(mapStateToProps)(Event));
