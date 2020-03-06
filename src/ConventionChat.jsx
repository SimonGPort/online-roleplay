import React, { Component } from "react";
import { connect } from "react-redux";

class ConventionChat extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      password: ""
    };
  }
  componentDidMount() {
    this.messageInterval = setInterval(this.updateMessages, 500);
  }

  componentWillUnmount() {
    clearInterval(this.messageInterval);
  }

  updateMessages = async () => {
    let response = await fetch(
      "/fetchMessagesConvention?eventId=" +
        this.props.eventId +
        "&tableIndex=" +
        this.props.tableIndex
    );
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    if (!parsed.success) {
      this.props.dispatch({ type: "logout" });
      return;
    }
    this.props.dispatch({
      type: "set-messages-convention",
      messages: parsed.chat,
      eventId: this.props.eventId,
      tableId: this.props.tableId
    });
  };

  chatInput = evt => {
    this.setState({ inputValue: evt.target.value });
  };

  submitHandler = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append("message", this.state.inputValue);
    data.append("eventId", this.props.eventId);
    data.append("tableIndex", this.props.tableIndex);
    let response = await fetch("/postMessageConvention", {
      method: "POST",
      body: data
    });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      this.setState({ inputValue: "" });
    } else {
      alert("You need to login");
    }
  };

  render = () => {
    return (
      <>
        {this.props.chat.map((msg, idx) => {
          return (
            <div key={idx}>
              {msg.username}: {msg.message}
            </div>
          );
        })}

        <div>
          <form onSubmit={this.submitHandler}>
            <input value={this.state.inputValue} onChange={this.chatInput} />
            <input type="submit" />
          </form>
        </div>
      </>
    );
  };
}

export default connect()(ConventionChat);
