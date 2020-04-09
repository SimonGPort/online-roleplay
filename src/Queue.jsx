import React, { Component } from "react";
import { connect } from "react-redux";
import ConventionQueue from "./ConventionQueue.jsx";
import { withRouter } from "react-router-dom";

class Queue extends Component {
  constructor() {
    super();
  }
  requestToJoin = async (evt) => {
    if (this.props.login === false) {
      return alert("you need to login");
    }
    let data = new FormData();
    data.append("id", this.props.id);
    data.append("user", this.props.user);
    let response = await fetch("/requestToJoin", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "joinEvent",
        user: this.props.user,
        id: this.props.id,
      });
    } else {
      alert("you can't join this event");
    }
  };

  leaveTheQueue = async (evt) => {
    let data = new FormData();
    data.append("id", this.props.id);
    data.append("user", this.props.user);
    let response = await fetch("/leaveTheQueue", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "leaveEvent",
        user: this.props.user,
        id: this.props.id,
      });
    } else {
      alert("error, you can't leave this event");
    }
  };

  deleteEvent = async (evt) => {
    if (window.confirm("Do you really want to delete the event?")) {
      let data = new FormData();
      data.append("id", this.props.id);
      let response = await fetch("/deleteTheEvent", {
        method: "POST",
        body: data,
      });
      let body = await response.text();
      body = JSON.parse(body);
      if (body.success) {
        this.props.dispatch({
          type: "DeleteEvent",
          id: this.props.id,
        });
        this.props.dispatch({
          type: "removeSelectionEvent",
        });
        this.props.history.push("/");
      } else {
        alert("error, you can't delete this event");
      }
    }
  };

  render = () => {
    if (this.props.type === "Convention") {
      return (
        <div>
          <ConventionQueue
            eventId={this.props.id}
            host={this.props.host}
            user={this.props.user}
            conventionsGame={this.props.conventionsGame}
          />
        </div>
      );
    }
    return (
      <div>
        <div>
          {this.props.user === this.props.host ? (
            <div className="event-attend-section">
              <button onClick={this.deleteEvent} className="card-enter">
                Delete the event
              </button>
              <div>
                Spots available {parseInt(this.props.players.length) + 1}/
                {parseInt(this.props.numPlayers) + 1}
              </div>
            </div>
          ) : this.props.players.includes(this.props.user) ? (
            <div className="event-attend-section">
              <button onClick={this.leaveTheQueue} className="card-enter">
                Leave the queue
              </button>
              <div>
                Spots available {parseInt(this.props.players.length) + 1}/
                {parseInt(this.props.numPlayers) + 1}
              </div>
            </div>
          ) : (
            <div className="event-attend-section">
              <button onClick={this.requestToJoin} className="card-enter">
                Attend
              </button>
              <div>
                Spots available {parseInt(this.props.players.length) + 1}/
                {parseInt(this.props.numPlayers) + 1}
              </div>
            </div>
          )}
        </div>
        <div>
          <div>Game Master: {this.props.host} </div>
          <div>
            {this.props.players.map((player, idx) => {
              if (idx <= this.props.players.length) {
                return <div className="Attendees">Attendees: {player}</div>;
              }
              return (
                <div className="Attendees">On the waiting list: {player}</div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };
}

export default withRouter(connect()(Queue));
