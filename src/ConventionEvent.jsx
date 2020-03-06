import React, { Component } from "react";
import Chat from "./Chat.jsx";
import { connect } from "react-redux";
import Queue from "./Queue.jsx";
import ConventionChat from "./ConventionChat.jsx";
import ConventionQueueOfOneEvent from "./ConventionQueueOfOneEvent.jsx";

class ConventionEvent extends Component {
  constructor() {
    super();
  }

  render = () => {
    let event = this.props.events.find(element => {
      return element.eventId === this.props.eventId;
    });
    let table = event.conventionsGame.find(element => {
      return element.tableId === this.props.tableId;
    });

    let eventIndex = this.props.events.findIndex(event => {
      return event.eventId === this.props.eventId;
    });
    let tableIndex = event.conventionsGame.findIndex(table => {
      return table.tableId === this.props.tableId;
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
            <div>Convention's organiser: {event.host}</div>
            <div>
              <img src={table.img} />
            </div>
          </div>

          <div>
            <ConventionChat
              tableIndex={tableIndex}
              chat={table.chat}
              eventId={this.props.eventId}
              tableId={this.props.tableId}
            />
          </div>
        </div>
        <div>
          <ConventionQueueOfOneEvent
            table={table}
            eventId={this.props.eventId}
            tableId={this.props.tableId}
            eventIndex={eventIndex}
            tableIndex={tableIndex}
            host={event.host}
            login={this.props.login}
            user={this.props.user}
          />
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
