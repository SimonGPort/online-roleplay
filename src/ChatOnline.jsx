import React, { Component } from "react";
import { connect } from "react-redux";

class ChatOnline extends Component {
  constructor() {
    super();
    this.state = {
      inputValue: "",
      password: "",
      initiaveChanging: false,
      UserInitiative: [],
    };
  }

  chatInput = (evt) => {
    this.setState({ inputValue: evt.target.value });
  };

  ButtonInitiative = (value) => {
    if (value) {
      this.props.dispatch({
        type: "startPostingData",
      });
    } else {
      this.props.dispatch({
        type: "endPostingData",
      });
    }
    this.setState({ initiaveChanging: value });
  };

  submitHandler = async (evt) => {
    evt.preventDefault();
    let data = new FormData();
    data.append("message", this.state.inputValue);
    data.append("user", this.props.user);
    data.append("tokenId", this.props.MasterTokenId);
    let response = await fetch("/postMessageChatOnline", {
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

  handleOnChanges = (evt, user) => {
    let playerIndex = this.props.onlineUsers.findIndex((onlineUser) => {
      return onlineUser.user === user.user;
    });
    this.props.dispatch({
      type: "changeInitiative",
      user: user,
      initiative: evt.target.value,
      index: playerIndex,
    });
  };

  PostInitiative = async () => {
    let data = new FormData();
    data.append("onlineUsers", JSON.stringify(this.props.onlineUsers));
    data.append("host", this.props.host);
    let response = await fetch("/playerinitiative", {
      method: "POST",
      body: data,
    });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      console.log("playerinitiative success");
    } else {
      console.log("playerinitiative Failure");
    }
  };
  //   if (this.state.initiaveChanging) {
  //     return;
  //   }
  //   console.log("changing initiative");
  //
  //   data.append("playerinitiative", evt.target.value);
  //   data.append("host", this.props.host);
  //   data.append("user", JSON.stringify(user));
  //   let playerIndex = this.props.onlineUsers.findIndex((onlineUser) => {
  //     return onlineUser.user === user.user;
  //   });
  //   data.append("playerIndex", JSON.stringify(playerIndex));
  //   let response = await fetch("/playerinitiative", {
  //     method: "POST",
  //     body: data,
  //   });
  //   const body = await response.text();
  //   const parsed = JSON.parse(body);
  //   if (parsed.success) {
  //     console.log("playerinitiative success");
  //   } else {
  //     console.log("playerinitiative Failure");
  //   }
  // };

  giveOrRemovePermissionToken = async (permissionValue, user) => {
    let data = new FormData();
    data.append("permissionValue", permissionValue);
    data.append("user", JSON.stringify(user));
    data.append("tokenId", this.props.tokenId);
    let response = await fetch("/giveOrRemovePermissionToken", {
      method: "POST",
      body: data,
    });
    const body = await response.text();
    const parsed = JSON.parse(body);
    if (parsed.success) {
      this.props.dispatch({
        type: "AddOrRemovePermission",
        user: parsed.user,
        shouldRemovePermission: parsed.shouldRemovePermission,
        tokenId: parsed.tokenId,
      });
    }
  };

  treatment = (msg, idx) => {
    let indexOfStartingNum = [];
    let indexOfClosingNum = [];

    for (let i = 0; i < msg.message.length; i++) {
      let letter = msg.message[i];
      if (letter === "(") {
        indexOfStartingNum.push(i);
      }
      if (letter === ")") {
        indexOfClosingNum.push(i);
      }
    }
    let listOfNumber = [];
    for (let i = 0; i < indexOfStartingNum.length; i++) {
      let number = msg.message.slice(
        indexOfStartingNum[i] + 1,
        indexOfClosingNum[i]
      );
      listOfNumber.push(number);
    }
    console.log(
      "treatment",
      indexOfStartingNum,
      indexOfClosingNum,
      listOfNumber
    );

    let completeMessage = [];

    if (listOfNumber.length) {
      let message = msg.message.split("");
      let beforeMessage = undefined;
      let afterMessage = undefined;
      let centerMessage = undefined;
      for (let i = 0; i < listOfNumber.length; i++) {
        completeMessage = [];
        beforeMessage = message.slice(0, indexOfStartingNum[i] - 2 * i);
        afterMessage = message.slice(indexOfClosingNum[i] - 2 * i + 1);
        centerMessage = [
          <div className="dice-chat-image-container">
            <img className="dice-chat-image" src="/images/dice20 chat.png" />
            {listOfNumber[i]}
          </div>,
        ];

        completeMessage = completeMessage.concat(beforeMessage);
        completeMessage = completeMessage.concat(centerMessage);
        completeMessage = completeMessage.concat(afterMessage);
        message = completeMessage;
      }
      console.log("completeMessage", completeMessage);
    } else {
      completeMessage = msg.message;
    }

    return (
      <div key={idx} style={{ display: "flex" }}>
        {msg.username}: {completeMessage}
        {/* {msg.username}: {msg.message} */}
      </div>
    );
  };

  render = () => {
    let userSort = undefined;
    this.props.postingData
      ? (userSort = this.props.onlineUsers)
      : (userSort = this.props.onlineUsers
          .slice()
          .sort((a, b) => b.initiative - a.initiative));
    return (
      <>
        <div className="chatOnline">
          <div className="GmBar-chat-section">
            <div className="GmBar-event-information">Chat</div>
            <div className="GmBar-chat-message-list">
              {this.props.chat.map((msg, idx) => {
                return this.treatment(msg, idx);
              })}
            </div>
            <div>
              <form onSubmit={this.submitHandler} className="chat-form">
                <input
                  className="chat-input"
                  value={this.state.inputValue}
                  onChange={this.chatInput}
                />
                <input
                  type="submit"
                  value="chat"
                  className="event-chat-submit"
                />
              </form>
            </div>
          </div>

          {/* <div>
            {this.props.chat.map((msg, idx) => {
              return (
                <div key={idx}>
                  {msg.username}: {msg.message}
                </div>
              );
            })}

            <div>
              <form onSubmit={this.submitHandler}>
                <input
                  value={this.state.inputValue}
                  onChange={this.chatInput}
                />
                <input type="submit" />
              </form>
            </div>
          </div> */}
          <div className="listOfUsers">
            <div className="event-information">Players</div>
            <div className="GmBar-User-Section">
              {userSort.map((user, idx) => {
                let permissionValue = this.props.permission.includes(user.user);
                return (
                  <div key={idx} className="GmBar-User">
                    <div className="GmBar-user-container">
                      <img src="/images/account_box.svg" /> {user.user}
                    </div>
                    <input
                      className="GmBar-Input"
                      readOnly={!this.state.initiaveChanging}
                      style={{
                        backgroundColor:
                          this.state.initiaveChanging === true ? "" : "grey",
                      }}
                      key={idx}
                      value={
                        !this.state.initiaveChanging ? user.initiative : null
                      }
                      type="number"
                      onChange={(evt) => this.handleOnChanges(evt, user)}
                    />
                    <button
                      onClick={() =>
                        this.giveOrRemovePermissionToken(
                          permissionValue,
                          user.user
                        )
                      }
                      style={{
                        display:
                          this.props.tokenId === "" ||
                          this.props.user !== this.props.host
                            ? "none"
                            : "block",
                      }}
                    >
                      {permissionValue ? "Remove Control" : "Give Control"}
                    </button>
                  </div>
                );
              })}
            </div>
            <div>
              {this.state.initiaveChanging ? (
                <button
                  className="GmBar-button"
                  onClick={() => {
                    this.PostInitiative();
                    this.ButtonInitiative(!this.state.initiaveChanging);
                  }}
                  style={{
                    backgroundColor: "yellow",
                  }}
                >
                  Save Initiative
                </button>
              ) : (
                <button
                  className="GmBar-button-initiative"
                  onClick={() => {
                    this.ButtonInitiative(!this.state.initiaveChanging);
                  }}
                  style={{
                    backgroundColor: "",
                  }}
                >
                  Edit Initiative
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };
}
let mapStateToProps = (state) => {
  return {
    chat: state.MasterToken.chat,
    MasterTokenId: state.MasterToken.tokenId,
    onlineUsers: state.MasterToken.onlineUsers,
    user: state.user,
    permission: state.permissionToken,
    tokenId: state.selectedToken,
    postingData: state.postingData,
  };
};

export default connect(mapStateToProps)(ChatOnline);
