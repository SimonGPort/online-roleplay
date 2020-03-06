import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class ConventionQueue extends Component {
  constructor() {
    super();
  }

  gameAccepted = async idx => {
    let data = new FormData();
    data.append("tableIndex", idx);
    data.append("eventId", this.props.eventId);
    let response = await fetch("/gameAcceptedForConvention", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "gameAcceptedConvention",
        eventId: this.props.eventId,
        tableIndex: idx
      });
    } else {
      alert("error, you can't accept this event");
    }
  };

  render = () => {
    return (
      <div>
        <div>//// la liste des parties disponible a faire</div>
        <div>
          {this.props.conventionsGame.map((game, idx) => {
            if (game.visibility !== "Restricted") {
              return (
                <div key={idx}>
                  <Link
                    to={`/convention-event/${this.props.eventId}/${game.tableId}`}
                  >
                    {game.title}
                  </Link>
                </div>
              );
            }
            if (
              game.tableCreator === this.props.user ||
              this.props.host === this.props.user
            ) {
              return (
                <div key={idx}>
                  <Link
                    to={`/convention-event/${this.props.eventId}/${game.tableId}`}
                  >
                    {game.title}
                  </Link>
                  {this.props.host === this.props.user ? (
                    <button onClick={() => this.gameAccepted(idx)}>
                      Accept this game
                    </button>
                  ) : (
                    <div>The organisator need to make this game visible</div>
                  )}
                </div>
              );
            }
          })}
        </div>
        <div>
          <Link to={`/creation-convention-table/${this.props.eventId}`}>
            Create a new table
          </Link>
        </div>
      </div>
    );
  };
}

export default connect()(ConventionQueue);
