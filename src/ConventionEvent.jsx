import React, { Component } from "react";
import Chat from "./Chat.jsx";
import { connect } from "react-redux";
import Queue from "./Queue.jsx";
import ConventionChat from "./ConventionChat.jsx";
import ConventionQueueOfOneEvent from "./ConventionQueueOfOneEvent.jsx";
import { Link } from "react-router-dom";

class ConventionEvent extends Component {
  constructor() {
    super();
  }

  render = () => {
    let event = this.props.events.find((element) => {
      return element.eventId === this.props.eventId;
    });
    let table = event.conventionsGame.find((element) => {
      return element.tableId === this.props.tableId;
    });

    let eventIndex = this.props.events.findIndex((event) => {
      return event.eventId === this.props.eventId;
    });
    let tableIndex = event.conventionsGame.findIndex((table) => {
      return table.tableId === this.props.tableId;
    });
    return this.props.events.length === 0 ? (
      <div>loading ...</div>
    ) : (
      <div className="event-page">
        <div className="event-info-section-container">
          <div className="event-info-top-section">
            <div className="event-information">Information</div>
            <div className="event-info">
              <div>{event.when}</div>
              <div className="event-info-space">{table.time}</div>
              <div className="event-info-space">{table.language}</div>
              <div className="event-info-space">{table.type}</div>
              <div className="event-info-space">{table.system}</div>
            </div>
            <div className="ReturnToTheConvention-button-container">
              <Link
                to={`/event/${this.props.eventId}`}
                class="card-enter-event"
              >
                Back
              </Link>
            </div>
          </div>
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

        <div className="event-center-section">
          <div className="card-title">{table.title}</div>
          <div>Game Master: {table.gm}</div>
          <div>Convention's organizer: {event.host}</div>
          <div>
            <img src={table.img} className="card-img" />
          </div>

          {event.description === "" ? (
            ""
          ) : (
            <div className="event-description-section">
              <div className="event-information">Description</div>

              <div className="event-description">{table.description}</div>
            </div>
          )}
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

      ////vielle page
      // <div className="event-page">
      //   <div>
      //     <div>
      //       <div className="card-title">{table.title}</div>
      //       <div>Game Master: {table.gm}</div>
      //       <div>Convention's organiser: {event.host}</div>
      //       <div>
      //         <img src={table.img} className="card-img" />
      //       </div>
      //       <div>{table.descrition}</div>
      //     </div>

      //     <div>
      //       <ConventionChat
      //         tableIndex={tableIndex}
      //         chat={table.chat}
      //         eventId={this.props.eventId}
      //         tableId={this.props.tableId}
      //       />
      //     </div>
      //   </div>
      //   <div>
      //     <ConventionQueueOfOneEvent
      //       table={table}
      //       eventId={this.props.eventId}
      //       tableId={this.props.tableId}
      //       eventIndex={eventIndex}
      //       tableIndex={tableIndex}
      //       host={event.host}
      //       login={this.props.login}
      //       user={this.props.user}
      //     />
      //   </div>
      // </div>
    );
  };
}

let mapStateToProps = (state) => {
  return {
    events: state.events,
    login: state.login,
    user: state.user,
  };
};
export default connect(mapStateToProps)(ConventionEvent);
