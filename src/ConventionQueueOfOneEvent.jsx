import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

class ConventionQueueOfOneEvent extends Component {
  constructor() {
    super();
  }
  requestToJoin = async evt => {
    if (this.props.login === false) {
      return alert("you need to login");
    }
    let data = new FormData();
    data.append("eventId", this.props.eventId);
    data.append("tableIndex", this.props.tableIndex);
    let response = await fetch("/requestToJoinConventionEvent", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "joinEventConvention",
        user: this.props.user,
        eventIndex: this.props.eventIndex,
        tableIndex: this.props.tableIndex
      });
    } else {
      alert("you can't join this event");
    }
  };

  leaveTheQueue = async evt => {
    let data = new FormData();
    data.append("eventId", this.props.eventId);
    data.append("tableIndex", this.props.tableIndex);
    let response = await fetch("/leaveTheQueueConvention", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "leaveEventConvention",
        user: this.props.user,
        eventIndex: this.props.eventIndex,
        tableIndex: this.props.tableIndex
      });
    } else {
      alert("error, you can't leave this event");
    }
  };

  newGm = async evt => {
    if (this.props.login === false) {
      return alert("you need to login");
    }
    let data = new FormData();
    data.append("eventIndex", this.props.eventIndex);
    data.append("user", this.props.user);
    data.append("tableIndex", this.props.tableIndex);
    let response = await fetch("/newGmEventConvention", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "newGmEventConvention",
        eventIndex: this.props.eventIndex,
        user: this.props.user,
        tableIndex: this.props.tableIndex
      });
    } else {
      alert("error, you can't delete this event");
    }
  };

  deleteEvent = async evt => {
    if (window.confirm("Do you really want to delete the event?")) {
      let data = new FormData();
      data.append("eventIndex", this.props.eventIndex);
      data.append("tableIndex", this.props.tableIndex);
      data.append("tableId", this.props.tableId);
      data.append("eventId", this.props.eventId);
      let response = await fetch("/deleteTheEventConvention", {
        method: "POST",
        body: data
      });
      let body = await response.text();
      body = JSON.parse(body);
      if (body.success) {
        this.props.history.push(`/event/${this.props.eventId}`);
        this.props.dispatch({
          type: "DeleteEventConvention",
          eventIndex: this.props.eventIndex,
          tableIndex: this.props.tableIndex
        });
      } else {
        alert("error, you can't delete this event");
      }
    }
  };

  render = () => {
    return (
      <div>
        <div>
          <Link to={`/event/${this.props.eventId}`}>
            Return to the convention's page
          </Link>
        </div>
        <div>
          {"Number of persons "}
          {this.props.table.gm === ""
            ? Number(parseInt(this.props.table.players.length)) +
              "/" +
              Number(parseInt(this.props.table.numPlayers))
            : Number(parseInt(this.props.table.players.length) + 1) +
              "/" +
              Number(parseInt(this.props.table.numPlayers) + 1)}
        </div>
        <div>
          {this.props.user === this.props.host ||
          this.props.user === this.props.table.tableCreator ? (
            <div>
              Delete the event
              <button onClick={this.deleteEvent} />
            </div>
          ) : this.props.table.players.includes(this.props.user) ? (
            <div>
              Leave the queue
              <button onClick={this.leaveTheQueue} />
            </div>
          ) : (
            <div>
              Request to join
              <button onClick={this.requestToJoin} />
            </div>
          )}
        </div>
        <div>
          Game Master:{" "}
          {this.props.table.gm !== "" ? (
            this.props.table.gm
          ) : (
            <button onClick={this.newGm}>
              Become the Game Master of this table
            </button>
          )}
        </div>
        <div>
          {this.props.table.players.map((player, idx) => {
            if (idx <= this.props.table.players.length) {
              return <div>Attendees: {player}</div>;
            }
            return <div>On the waiting list: {player}</div>;
          })}
        </div>
      </div>
    );
  };
}

export default withRouter(connect()(ConventionQueueOfOneEvent));
