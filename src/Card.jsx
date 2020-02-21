import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Card extends Component {
  constructor() {
    super();
  }

  cardEvent() {
    return this.props.events.find(event => {
      return event.eventId === this.props.eventId;
    });
  }

  render = () => {
    let cardEvent = this.cardEvent();
    return (
      <div className="card">
        <div>
          {this.props.eventId}

          <div>{cardEvent.title}</div>
          <div>{cardEvent.type}</div>
          <div>{cardEvent.when}</div>
          <div>{cardEvent.location}</div>
          <div>{cardEvent.system}</div>
        </div>
        <Link to={`/event/${this.props.eventId}`}>Enter</Link>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    events: state.events
  };
};

export default connect(mapStateToProps)(Card);
