import React, { Component } from "react";
import Chat from "./Chat.jsx";
import { connect } from "react-redux";
import Queue from "./Queue.jsx";

class ConventionEvent extends Component {
  constructor() {
    super();
  }

  render = () => {
    let event = this.props.events.find(element => {
      return element.eventId === this.props.eventId;
    });
    console.log("event", event);
    let table = event.conventionsGame.find(element => {
      return element.tableId === this.props.tableId;
    });

    return this.props.events.length === 0 ? (
      <div>loading ...</div>
    ) : (
      <div className="event-page">
        <div>
          <div className="event-infos">
            <div>{table.title}</div>
            <div>{table.descrition}</div>
            <div>Game Master: {table.gm}</div>
            <div>
              <img src={table.img} />
            </div>
          </div>

          <div>
            {/* faire un nouveau component qui prends en consideration la tableId */}
            {/* <Chat eventId={this.props.eventId} tableId={this.props.tableId}/> */}
          </div>
        </div>
        <div>
          {/* faire un nouveau component qui prends en consideration la tableId */}
          {/* <Queue
            id={this.props.eventId}
            type={event.type}
            players={event.players}
            numPlayers={event.numPlayers}
            conventionsGame={event.conventionsGame}
            host={event.host}
            login={this.props.login}
            user={this.props.user}
          /> */}
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
export default connect(mapStateToProps)(ConventionEvent);
