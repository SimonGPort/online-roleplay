import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class Card extends Component {
  constructor() {
    super();
  }

  cardEvent() {
    return this.props.events.find((event) => {
      return event.eventId === this.props.eventId;
    });
  }

  render = () => {
    let cardEvent = this.cardEvent();
    return (
      <div className={this.props.Sponsored ? "card-sponsored" : "card"}>
        <div>
          <div className="card-info">
            <div>{cardEvent.when}</div>
            <div className="card-info-space">{cardEvent.time}</div>
            <div className="card-info-space">{cardEvent.type}</div>
            <div className="card-info-space">{cardEvent.system}</div>
          </div>
          <div className="card-title">{cardEvent.title}</div>
          <div className="card-info">{cardEvent.location}</div>
          <div className="card-img-container">
            <Link to={`/event/${this.props.eventId}`} className="card-enter">
              Enter
            </Link>{" "}
            <img src={cardEvent.img} className="card-img" />
          </div>
        </div>
      </div>
    );
  };
}

let mapStateToProps = (state) => {
  return {
    events: state.events,
  };
};

export default connect(mapStateToProps)(Card);
