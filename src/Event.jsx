import React, { Component } from "react";
import Chat from "./Chat.jsx";
import { connect } from "react-redux";

class Event extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  fetchEvents = async () => {
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

  render = () => {
    return (
      <div className="EventPage">
        <div>
          <div>les infos</div>

          <div>
            {/* le id est un test */}
            <Chat id={983205} />
          </div>
        </div>
        <div> Component Queue</div>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    events: state.events
  };
};
export default connect(mapStateToProps)(Event);
