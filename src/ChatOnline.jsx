import React, { Component } from "react";
import { connect } from "react-redux";

class ChatOnline extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      password: ""
    };
  }
  // componentDidMount() {
  //   this.messageInterval = setInterval(this.updateMessages, 500);
  // }

  // componentWillUnmount() {
  //   clearInterval(this.messageInterval);
  // }

  // updateMessages = async () => {
  //   let response = await fetch("/fetchMessages?eventId=" + this.props.id);
  //   let responseBody = await response.text();
  //   // console.log('response from messages', responseBody);
  //   let parsed = JSON.parse(responseBody);
  //   // console.log('parsed', parsed);
  //   if (!parsed.success) {
  //     this.props.dispatch({ type: "logout" });
  //     return;
  //   }
  //   this.props.dispatch({
  //     type: "set-messages",
  //     messages: parsed.chat,
  //     eventId: this.props.id
  //   });
  // };

  chatInput = evt => {
    this.setState({ inputValue: evt.target.value });
  };

  submitHandler = async evt => {
    evt.preventDefault();
    let data = new FormData();
    data.append("message", this.state.inputValue);
    data.append("user", this.props.user);
    data.append("tokenId", this.props.MasterTokenId);
    let response = await fetch("/postMessageChatOnline", {
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

  handleOnChanges = async (evt, user) => {
    let data = new FormData();
    data.append("playerinitiative", evt.target.value);
    data.append("host", this.props.host);
    data.append("user", JSON.stringify(user));
    let playerIndex = this.props.onlineUsers.findIndex(onlineUser => {
      return onlineUser.user === user.user;
    });
    data.append("playerIndex", JSON.stringify(playerIndex));
    let response = await fetch("/playerinitiative", {
      method: "POST",
      body: data
    });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      console.log("playerinitiative success");
    } else {
      console.log("playerinitiative Failure");
    }
  };

  giveOrRemovePermissionToken = async (permissionValue, user) => {
    let data = new FormData();
    data.append("permissionValue", permissionValue);
    data.append("user", JSON.stringify(user));
    data.append("tokenId", this.props.tokenId);
    let response = await fetch("/giveOrRemovePermissionToken", {
      method: "POST",
      body: data
    });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      this.props.dispatch({
        type: "AddOrRemovePermission",
        user: parsed.user,
        shouldRemovePermission: parsed.shouldRemovePermission,
        tokenId: parsed.tokenId
      });

      this.props.dispatch({ type: "logout" });
    }
  };

  render = () => {
    let userSort = this.props.onlineUsers
      .slice()
      .sort((a, b) => b.initiative - a.initiative);
    return (
      <div>
        <div>
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
        </div>
        <div>
          {userSort.map((user, idx) => {
            let permissionValue = this.props.permission.includes(user.user);
            return (
              <div key={idx}>
                {user.user}/
                <input
                  key={idx}
                  value={user.initiative}
                  type="number"
                  onChange={evt => this.handleOnChanges(evt, user)}
                />
                <button
                  onClick={() =>
                    this.giveOrRemovePermissionToken(permissionValue, user.user)
                  }
                >
                  {permissionValue ? "Remove Control" : "Give Control"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
}
let mapStateToProps = state => {
  return {
    chat: state.MasterToken.chat,
    MasterTokenId: state.MasterToken.tokenId,
    onlineUsers: state.MasterToken.onlineUsers,
    user: state.user,
    permission: state.permissionToken,
    tokenId: state.selectedToken
  };
};

export default connect(mapStateToProps)(ChatOnline);
