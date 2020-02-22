import React, { Component } from "react";
import { connect } from "react-redux";

class Chat extends Component {
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
    let response = await fetch("/fetchMessages?eventId=" + this.props.id);
    let responseBody = await response.text();
    // console.log('response from messages', responseBody);
    let parsed = JSON.parse(responseBody);
    // console.log('parsed', parsed);
    if (!parsed.success) {
      this.props.dispatch({ type: "logout" });
      return;
    }
    this.props.dispatch({
      type: "set-messages",
      messages: parsed.chat
    });
  };

  chatInput = evt => {
    this.setState({ inputValue: evt.target.value });
  };

  submitHandler = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append("message", this.state.inputValue);
    data.append("eventId", this.props.id);
    console.log("hello my data", data);
    console.log("this.state.inputValue", this.state.inputValue);
    let response = await fetch("/postMessage?eventId=" + this.props.id, {
      method: "POST",
      body: data
    });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      this.setState({ inputValue: "" });
      fetchAndUpdate();
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

let mapStateToProps = state => {
  return {
    events: state.events,
    chat: state.chat
  };
};
export default connect(mapStateToProps)(Chat);
