import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class ConventionQueue extends Component {
  constructor() {
    super();
  }

  gameAccepted = async (idx) => {
    let data = new FormData();
    data.append("tableIndex", idx);
    data.append("eventId", this.props.eventId);
    let response = await fetch("/gameAcceptedForConvention", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      this.props.dispatch({
        type: "gameAcceptedConvention",
        eventId: this.props.eventId,
        tableIndex: idx,
      });
    } else {
      alert("error, you can't accept this event");
    }
  };

  render = () => {
    return (
      <div>
        <div className="event-information">List of the games</div>
        <div>
          {this.props.conventionsGame.map((game, idx) => {
            if (game.visibility !== "Restricted") {
              return (
                <div key={idx}>
                  <Link
                    className="convention-game-button"
                    to={`/convention-event/${this.props.eventId}/${game.tableId}`}
                  >
                    • {game.title}
                  </Link>
                </div>
              );
            }
            if (
              game.tableCreator === this.props.user ||
              this.props.host === this.props.user
            ) {
              return (
                <div key={idx} style={{ display: "flex" }}>
                  <Link
                    to={`/convention-event/${this.props.eventId}/${game.tableId}`}
                    className="convention-game-button"
                  >
                    • {game.title}
                  </Link>
                  {this.props.host === this.props.user ? (
                    <div className="iconGameConvertion-icon-container">
                      <img
                        src="/Images/visibility_off.svg"
                        className="visibility_off-iconGameConvention"
                        onClick={() => this.gameAccepted(idx)}
                      />
                      <p class="img-description-gameConvention">
                        Accept this game
                      </p>
                    </div>
                  ) : (
                    <div className="iconGameConvertion-icon-container">
                      <img
                        src="/Images/visibility_off.svg"
                        className="visibility_off-iconGameConvention"
                      />
                      <p class="img-description-gameConvention">
                        The organizer need to accept the game
                      </p>
                    </div>
                  )}
                </div>
              );
            }
          })}
        </div>
        <div className="card-enter-event">
          <Link
            to={`/creation-convention-table/${this.props.eventId}`}
            className="convention-createANewTable-button"
          >
            New Table
          </Link>
        </div>
      </div>
    );
  };
}

export default connect()(ConventionQueue);
