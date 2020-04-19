import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { connect } from "react-redux";
import Announcements from "./Announcements.jsx";

console.log(momentLocalizer);
console.log(moment);

// new Date(year, month, day, hours, minutes, seconds, milliseconds)
const localizer = momentLocalizer(moment); // or globalizeLocalizer

class MainPage extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = async () => {
    let response = await fetch("/fetchEvents");
    let body = await response.text();
    body = JSON.parse(body);
    console.log("/fetchEvents", body);
    if (body.success) {
      this.props.dispatch({
        type: "fetchEvents",
        events: body.events,
      });
    } else {
      console.log("fetchEvents error");
    }
  };

  handleSubmit = (evt) => {
    this.props.dispatch({
      type: "addSelectionEvent",
      selection: evt.resource,
    });
    // console.log("evt:", evt);
    // this.setState({ selection: evt.resource });
  };

  render = () => {
    if (this.props.events.length === 0) {
      return (
        <div className="main-page">
          <Announcements announcements={this.props.selection} />
          <Calendar
            localizer={localizer}
            events={this.props.events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
            views={["month"]}
            onSelectEvent={this.handleSubmit}
          />
        </div>
      );
    }
    return (
      <div className="main-page">
        <Announcements announcements={this.props.selection} />
        <Calendar
          localizer={localizer}
          events={this.props.events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={["month"]}
          onSelectEvent={this.handleSubmit}
        />
      </div>
    );
  };
}

let mapStateToProps = (state) => {
  const reducedList = state.events.reduce((accumulator, eventToAdd) => {
    const eventFound = accumulator.find((event) => {
      return event.when === eventToAdd.when && event.type === eventToAdd.type;
    });
    if (eventFound) {
      eventFound.eventId = [...eventFound.eventId, eventToAdd.eventId];
      return accumulator;
    }
    // eventToAdd.eventId = [eventToAdd.eventId];
    return [...accumulator, { ...eventToAdd, eventId: [eventToAdd.eventId] }];
  }, []);

  let eventsReformatted = reducedList.map((event) => {
    let eventTransform = {};
    eventTransform.title = event.type + " (" + event.eventId.length + ")";
    eventTransform.resource = event.eventId;
    let year = parseInt(event.when.slice(0, 5));
    let month = parseInt(event.when.slice(6, 8)) - 1;
    let day = parseInt(event.when.slice(8));
    let hour = parseInt(event.when.slice(0, 2));
    let minute = parseInt(event.when.slice(3));
    eventTransform.start = new Date(year, month, day, hour, minute, 0, 0);
    eventTransform.end = new Date(year, month, day, hour + 4, minute, 0, 0);
    return eventTransform;
  });

  return {
    events: eventsReformatted,
  };
};

export default connect(mapStateToProps)(MainPage);
