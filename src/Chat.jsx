import React, { Component } from "react";
import { connect } from "react-redux";

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      password: "",
      chatLength: undefined,
    };
  }
  componentDidMount() {
    let chatBottom = document.getElementById("chatBottom");
    chatBottom.scrollTop = chatBottom.scrollHeight;
    this.messageInterval = setInterval(this.updateMessages, 500);
    this.setState({ chatLength: this.props.chat.length });
  }

  componentDidUpdate() {
    if (this.state.chatLength !== this.props.chat.length) {
      let chatBottom = document.getElementById("chatBottom");
      chatBottom.scrollTop = chatBottom.scrollHeight;
      this.setState({ chatLength: this.props.chat.length });
    }
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
      messages: parsed.chat,
      eventId: this.props.id,
    });
  };

  chatInput = (evt) => {
    this.setState({ inputValue: evt.target.value });
  };

  submitHandler = async (evt) => {
    evt.preventDefault();
    let data = new FormData();
    data.append("message", this.state.inputValue);
    data.append("eventId", this.props.id);
    let response = await fetch("/postMessage", {
      method: "POST",
      body: data,
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
      <div className="chat-section">
        <div className="event-information">Chat</div>
        <div className="chat-message-list" id="chatBottom">
          {this.props.chat.map((msg, idx) => {
            return (
              <div key={idx}>
                {msg.username}: {msg.message}
              </div>
            );
          })}
        </div>
        <div>
          <form onSubmit={this.submitHandler} className="chat-form">
            <input
              value={this.state.inputValue}
              onChange={this.chatInput}
              className="chat-input"
            />
            <button type="submit" className="event-chat-submit">
              Chat
            </button>
          </form>
        </div>
      </div>
    );
  };
}

export default connect()(Chat);
