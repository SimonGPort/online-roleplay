import React, { Component } from "react";
import { connect } from "react-redux";
// import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";

class ConventionQueueOfOneEvent extends Component {
  constructor() {
    super();
  }

  // BanPlayer = require("./BanPlayer.js");

  handleBanPlayer = async (eventId, tableIndex, user) => {
    if (window.confirm("Do you want to ban this player?")) {
      let data = new FormData();
      data.append("eventId", eventId);
      // data.append("tableId", tableId);
      data.append("tableIndex", tableIndex);
      data.append("user", user);
      let response = await fetch("/BanPlayerConventionQueue", {
        method: "POST",
        body: data,
      });
      let body = await response.text();
      body = JSON.parse(body);
      if (body.success) {
        console.log("ban success");
        this.props.dispatch({
          type: "BanPlayerConventionQueue",
          eventId: eventId,
          user: user,
          tableIndex: tableIndex,
        });
      } else {
        console.log("ban fail");
      }
    }
  };

  requestToJoin = async (evt) => {
    if (this.props.login === false) {
      return alert("you need to login");
    }
    let data = new FormData();
    data.append("eventId", this.props.eventId);
    data.append("tableIndex", this.props.tableIndex);
    let response = await fetch("/requestToJoinConventionEvent", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "joinEventConvention",
        user: this.props.user,
        eventIndex: this.props.eventIndex,
        tableIndex: this.props.tableIndex,
      });
    } else {
      alert("you can't join this event");
    }
  };

  leaveTheQueue = async (evt) => {
    let data = new FormData();
    data.append("eventId", this.props.eventId);
    data.append("tableIndex", this.props.tableIndex);
    let response = await fetch("/leaveTheQueueConvention", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "leaveEventConvention",
        user: this.props.user,
        eventIndex: this.props.eventIndex,
        tableIndex: this.props.tableIndex,
      });
    } else {
      alert("error, you can't leave this event");
    }
  };

  newGm = async (evt) => {
    if (this.props.login === false) {
      return alert("you need to login");
    }
    let data = new FormData();
    data.append("eventId", this.props.eventId);
    data.append("user", this.props.user);
    data.append("tableIndex", this.props.tableIndex);
    let response = await fetch("/newGmEventConvention", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      console.log("success newGM");
      this.props.dispatch({
        type: "newGmEventConvention",
        eventIndex: this.props.eventIndex,
        user: this.props.user,
        tableIndex: this.props.tableIndex,
        numPlayers: this.props.table.numPlayers,
      });
    } else {
      alert("error, newGmEventConvention");
    }
  };

  deleteEvent = async (evt) => {
    if (window.confirm("Do you really want to delete the event?")) {
      let data = new FormData();
      data.append("eventIndex", this.props.eventIndex);
      data.append("tableIndex", this.props.tableIndex);
      data.append("tableId", this.props.tableId);
      data.append("eventId", this.props.eventId);
      let response = await fetch("/deleteTheEventConvention", {
        method: "POST",
        body: data,
      });
      let body = await response.text();
      body = JSON.parse(body);
      if (body.success) {
        this.props.history.push(`/event/${this.props.eventId}`);
        this.props.dispatch({
          type: "DeleteEventConvention",
          eventIndex: this.props.eventIndex,
          tableIndex: this.props.tableIndex,
        });
      } else {
        alert("error, you can't delete this event");
      }
    }
  };

  render = () => {
    return (
      <div>
        <div className="event-attend-section">
          {this.props.user === this.props.host ||
          this.props.user === this.props.table.tableCreator ? (
            <div>
              <button onClick={this.deleteEvent} className="card-enter-event ">
                Delete Event
              </button>
            </div>
          ) : (
            ""
          )}
          {this.props.table.players.includes(this.props.user) ? (
            <div>
              <button
                onClick={this.leaveTheQueue}
                className="card-enter-event "
              >
                Leave
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={this.requestToJoin}
                className="card-enter-event "
              >
                Attend
              </button>
            </div>
          )}
          <div>
            Spots available{" "}
            {this.props.table.gm === ""
              ? Number(parseInt(this.props.table.players.length)) +
                "/" +
                Number(parseInt(this.props.table.numPlayers))
              : Number(parseInt(this.props.table.players.length) + 1) +
                "/" +
                Number(parseInt(this.props.table.numPlayers) + 1)}
          </div>
        </div>
        <div>
          Game Master:
          {this.props.table.gm !== "" ? (
            this.props.table.gm
          ) : (
            <button onClick={this.newGm} class="card-enter-event">
              Become GM
            </button>
          )}
        </div>
        <div>
          {this.props.table.players.map((player, idx) => {
            if (idx <= this.props.table.players.length) {
              return (
                <div className="Attendees" key={idx}>
                  Attendees: {player}
                  {this.props.user === this.props.host ? (
                    <span>
                      <img
                        src="/images/Ban Hammer.svg"
                        className="ban-player-button"
                        onClick={() => {
                          this.handleBanPlayer(
                            this.props.eventId,
                            this.props.tableIndex,
                            player
                          );
                        }}
                      />
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              );
            }
            return (
              <div className="Attendees">
                On the waiting list: {player}{" "}
                {this.props.user === this.props.host ? (
                  <span>
                    <img
                      src="/images/Ban Hammer.svg"
                      className="ban-player-button"
                      onClick={() => {
                        this.BanPlayer.handleBanPlayerConvention(
                          this.props.eventId,
                          this.props.tableIndex,
                          player
                        );
                      }}
                    />
                  </span>
                ) : (
                  ""
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
}
export default withRouter(connect()(ConventionQueueOfOneEvent));
