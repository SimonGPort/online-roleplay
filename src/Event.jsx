import React, { Component } from "react";
import Chat from "./Chat.jsx";
import { connect } from "react-redux";
import Queue from "./Queue.jsx";
import { withRouter } from "react-router-dom";
import MapModal from "./MapModal.jsx";

class Event extends Component {
  constructor() {
    super();
    this.state = {
      mapModal: false,
      deletingEvent: false,
    };
  }

  deletingEventMethod = (evt) => {
    this.setState({ deletingEvent: evt });
  };

  accessToTheOnlineGame = () => {
    let event = this.props.events.find((element) => {
      return element.eventId === this.props.eventId;
    });

    let isOnlineGameIsOpen = () => {
      let today = new Date();
      let year = today.getFullYear();
      let month = today.getMonth() + 1;
      let date = today.getDate();
      let hours = today.getHours();
      let minute = today.getMinutes();
      let yearEvent = parseInt(event.when.slice(0, 4));
      let monthEvent = parseInt(event.when.slice(5, 7));
      let dateEvent = parseInt(event.when.slice(8));
      let hoursEvent = parseInt(event.time.slice(0, 2));
      let minuteEvent = parseInt(event.time.slice(3));
      let time = hours * 60 + minute;
      let timeEvent = hoursEvent * 60 + minuteEvent;
      if (
        (year === yearEvent &&
          month === monthEvent &&
          date === dateEvent &&
          time >= timeEvent &&
          time <= timeEvent + 240 &&
          event.players.includes(this.props.user)) ||
        this.props.user === event.host
      ) {
        return true;
      }
      return false;
    };

    if (isOnlineGameIsOpen()) {
      this.props.history.push(`/online/${event.host}/${event.eventId}`);
    } else {
      alert("The game is not open");
    }
  };

  addMapModal = () => {
    this.setState({ mapModal: true });
  };

  removeMapModal = () => {
    this.setState({ mapModal: false });
  };

  render = () => {
    let event = this.props.events.find((element) => {
      return element.eventId === this.props.eventId;
    });

    return (
      <>
        {this.state.mapModal === true && (
          <div>
            <MapModal
              removeMapModal={this.removeMapModal}
              location={event.location}
            />
          </div>
        )}
        <div className="event-page">
          <div className="event-info-section-container">
            <div className="event-info-top-section">
              <div className="event-information">Information</div>
              <div className="event-info">
                <div>{event.when}</div>
                <div className="event-info-space">{event.time}</div>
                <div className="event-info-space">{event.language}</div>
                <div className="event-info-space">{event.type}</div>
                <div className="event-info-space">{event.system}</div>
              </div>
              {event.type !== "Online" ? (
                <div className="event-info">
                  <div className="event-info-address">{event.address}</div>
                  <div className="event-info-space">
                    <img
                      className="event-map-button"
                      src="/images/explore-24px.svg"
                      onClick={this.addMapModal}
                    />
                  </div>
                </div>
              ) : (
                <div className="access-to-online-game-button-container">
                  <button
                    onClick={() => this.accessToTheOnlineGame()}
                    className="access-to-online-game-button"
                  >
                    Access the online game
                  </button>
                </div>
              )}
            </div>
            <Queue
              deletingEventMethod={this.deletingEventMethod}
              id={this.props.eventId}
              type={event.type}
              players={event.players}
              numPlayers={event.numPlayers}
              conventionsGame={event.conventionsGame}
              host={event.host}
              login={this.props.login}
              user={this.props.user}
            />
          </div>
          <div className="event-center-section">
            <div className="card-title">{event.title}</div>
            {event.type !== "Convention" ? (
              <div>Game Master: {event.host}</div>
            ) : (
              <div>Convention's organizer: {event.host}</div>
            )}
            <div>
              <img src={event.img} className="card-img" />
            </div>

            {event.description === "" ? (
              ""
            ) : (
              <div className="event-description-section">
                <div className="event-information">Description</div>

                <div className="event-description">{event.description}</div>
              </div>
            )}
          </div>
          <div>
            <Chat
              deletingEvent={this.state.deletingEvent}
              id={this.props.eventId}
              user={this.props.user}
              chat={event.chat}
            />
          </div>
        </div>
      </>
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
export default withRouter(connect(mapStateToProps)(Event));
