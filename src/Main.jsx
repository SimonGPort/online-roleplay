import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

console.log(momentLocalizer);
console.log(moment);

// new Date(year, month, day, hours, minutes, seconds, milliseconds)
const localizer = momentLocalizer(moment); // or globalizeLocalizer
console.log(localizer);
const myEventsList = [
  {
    title: "convention",
    start: new Date(2020, 1, 16, 11, 30, 30, 0),
    end: new Date(2020, 1, 16, 12, 30, 30, 0)
  }
];

const MyCalendar = props => <div></div>;

class Main extends Component {
  constructor() {
    super();
    this.state = {
      selection: "convention2020"
    };
  }

  handleSubmit = evt => {
    console.log("evt:", evt);
    this.setState({ selection: evt.title });
  };

  render = () => {
    return (
      <div className="MainPage">
        <div>{this.state.selection}</div>
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

export default Main;
