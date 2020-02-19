import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { connect } from "react-redux";

console.log(momentLocalizer);
console.log(moment);

// new Date(year, month, day, hours, minutes, seconds, milliseconds)
const localizer = momentLocalizer(moment); // or globalizeLocalizer
let myEventsList = [
  // {
  //   title: "convention",
  //   start: new Date(2020, 1, 16, 11, 30, 30, 0),
  //   end: new Date(2020, 1, 16, 12, 30, 30, 0),
  //   resource: "any"
  // }
];

class MainPage extends Component {
  constructor() {
    super();
    this.state = {
      selection: "convention2020"
    };
  }
  componentDidMount() {
    this.fetchSession();
  }

  fetchSession = async () => {
    let response = await fetch("/fetchEvents", { method: "POST" });
    let body = await response.text();
    body = JSON.parse(body);
    console.log("/fetchEvents", body);
    if (body.success) {
      this.props.dispatch({
        type: "fetchEvents",
        events: body.events
      });
    } else {
      console.log("fetchEvents error");
    }
  };

  fetchEvents = () => {
    this.props.events.forEach(event => {
      let eventTransform = {};
      eventTransform.title = event.title + " (" + event.type + ")";
      eventTransform.resource = event.eventID;
      let year = parseInt(event.when.slice(0, 5));
      let month = parseInt(event.when.slice(6, 8)) - 1;
      let day = parseInt(event.when.slice(9));
      let hour = parseInt(event.when.slice(0, 2));
      let minute = parseInt(event.when.slice(3));
      console.log("time:", year, month, day, hour, minute);
      eventTransform.start = new Date(year, month, day, hour, minute, 0, 0);
      eventTransform.end = new Date(year, month, day, hour + 4, minute, 0, 0);
      console.log("eventTransform", eventTransform);
      myEventsList.push(eventTransform);
      console.log("newMyEventsList", myEventsList);
    });
  };

  handleSubmit = evt => {
    console.log("evt:", evt);
    this.setState({ selection: evt.title });
  };

  render = () => {
    return (
      <div className="MainPage">
        <div>{this.state.selection}</div>
        {this.fetchEvents()}
        <Calendar
          localizer={localizer}
          events={myEventsList}
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

let mapStateToProps = state => {
  return {
    events: state.events
  };
};

export default connect(mapStateToProps)(MainPage);
