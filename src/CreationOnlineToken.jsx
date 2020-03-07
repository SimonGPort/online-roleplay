import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

class CreationOnlineToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgFile: "",
      numberOfTokens: 1
    };
  }

  pictureInput = e => {
    this.setState({ imgFile: e.target.files[0] });
  };

  numberOfTokens = evt => {
    this.setState({ numberOfTokens: evt.target.value });
  };

  submitHandler = async evt => {
    evt.preventDefault();
    if (this.state.imgFile === "") {
      alert("You need to add an image for the token");
      return;
    }
    let data = new FormData();
    data.append("numberOfTokens", this.state.numberOfTokens);
    data.append("imgFile", this.state.imgFile);
    let response = await fetch("/creatingANewToken", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    body = JSON.parse(body);
    debugger;
    if (body.success) {
      alert("Your token is created");
      this.props.history.push(`/online/${event.host}/${event.eventId}`);
    } else {
      alert("Can't create your token");
    }
  };

  render = () => {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <div>
            <label>token's image</label>
            <input type="file" onChange={this.pictureInput} />
            <label>Number of token</label>
            <input
              type="number"
              value={this.state.numberOfTokens}
              onChange={this.numberOfTokens}
            />
          </div>
          <div>
            <input type="submit" value="Submit" />
          </div>
        </form>
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    gameView: state.gameView
  };
};

export default withRouter(connect(mapStateToProps)(CreationOnlineToken));
