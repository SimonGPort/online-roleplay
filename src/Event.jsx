import React, { Component } from "react";
import Chat from "./Chat.jsx";
import { connect } from "react-redux";
import Queue from "./Queue.jsx";

class Event extends Component {
  constructor() {
    super();
  }

  // componentDidMount() {
  //   this.fetchEvents();
  // }

  // fetchEvents = async () => {
  //   let response = await fetch("/fetchEvents");
  //   let body = await response.text();
  //   body = JSON.parse(body);
  //   console.log("/fetchEvents", body);
  //   if (body.success) {
  //     this.props.dispatch({
  //       type: "fetchEvents",
  //       events: body.events
  //     });
  //   } else {
  //     console.log("fetchEvents error");
  //   }
  // };

  render = () => {
    let event = this.props.events.find(element => {
      console.log("element.eventId", element.eventId);
      console.log("this.props.eventId", this.props.eventId);
      return element.eventId === this.props.eventId;
    });
    return (
      <div className="event-page">
        <div>
          <div className="event-infos">
            <div>{event.title}</div>
            <div>{event.descrition}</div>
            <div>{event.host}</div>
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
            username={this.props.username}
          />
        </div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    events: state.events,
    login: state.login
  };
};
export default connect(mapStateToProps)(Event);
