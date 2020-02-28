import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

class ConventionQueue extends Component {
  constructor() {
    super();
  }
  render = () => {
    return (
      <div>
        <div>//// la liste des parties disponible a faire</div>
        <div>
          {this.props.conventionsGame.map((game, idx) => {
            if (game.visibility !== "Restricted") {
              return (
                <div key={idx}>
                  <Link to={`/convention-table/${game.tableId}`}>
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
                    <button>Make this event visible for all</button>
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
