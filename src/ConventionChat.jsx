import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class ConventionChat extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      password: "",
      chatLength: undefined,
    };
  }
  componentDidMount() {
    this.messageInterval = setInterval(this.updateMessages, 500);
    let chatBottom = document.getElementById("chatBottom");
    chatBottom.scrollTop = chatBottom.scrollHeight;
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
    let response = await fetch(
      "/fetchMessagesConvention?eventId=" +
        this.props.eventId +
        "&tableIndex=" +
        this.props.tableIndex +
        "&user=" +
        this.props.user
    );
    let responseBody = await response.text();
    let parsed = JSON.parse(responseBody);
    // if (!parsed.success) {
    //   this.props.dispatch({ type: "logout" });
    //   return;
    // }
    this.props.dispatch({
      type: "set-messages-convention",
      messages: parsed.chat,
      eventId: this.props.eventId,
      tableId: this.props.tableId,
    });

    if (parsed.userHasBeenBan) {
      clearInterval(this.messageInterval);
      this.props.dispatch({
        type: "removeSelectionEvent",
      });
      this.props.history.push("/");
      alert("you've been banned from this event");
    }
  };

  chatInput = (evt) => {
    this.setState({ inputValue: evt.target.value });
  };

  submitHandler = async (evt) => {
    evt.preventDefault();
    let data = new FormData();
    data.append("message", this.state.inputValue);
    data.append("eventId", this.props.eventId);
    data.append("tableIndex", this.props.tableIndex);
    let response = await fetch("/postMessageConvention", {
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
          {this.props.chat
            ? this.props.chat.map((msg, idx) => {
                return (
                  <div key={idx}>
                    {msg.username}: {msg.message}
                  </div>
                );
              })
            : ""}
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

      ////vieux
      // <>
      //   {this.props.chat.map((msg, idx) => {
      //     return (
      //       <div key={idx}>
      //         {msg.username}: {msg.message}
      //       </div>
      //     );
      //   })}

      //   <div>
      //     <form onSubmit={this.submitHandler}>
      //       <input value={this.state.inputValue} onChange={this.chatInput} />
      //       <input type="submit" />
      //     </form>
      //   </div>
      // </>
    );
  };
}

export default withRouter(connect()(ConventionChat));
