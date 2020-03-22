import React, { Component } from "react";
import { connect } from "react-redux";

class CreationOnlineToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgFile: "",
      numberOfTokens: 1,
      type: "Token"
    };
  }

  pictureInput = e => {
    this.setState({ imgFile: e.target.files[0] });
  };

  numberOfTokens = evt => {
    if (this.state.numberOfTokens < 0) {
      return this.setState({ numberOfTokens: 1 });
    }
    this.setState({ numberOfTokens: evt.target.value });
  };

  typeInput = evt => {
    this.setState({ type: evt.target.value });
  };

  submitHandler = async evt => {
    evt.preventDefault();
    if (this.props.login === false) {
      alert("you need to login");
      return;
    }
    if (this.state.imgFile === "") {
      alert("You need to add an image for the token");
      return;
    }
    let data = new FormData();
    data.append("numberOfTokens", this.state.numberOfTokens);
    data.append("imgFile", this.state.imgFile);
    data.append("type", this.state.type);
    data.append("page", JSON.stringify(this.props.page));
    data.append("host", this.props.host);
    let response = await fetch("/creatingANewToken", {
      method: "POST",
      body: data
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      alert("Your token is created");
      this.props.dispatch({
        type: "CreationOnlineToken",
        action: false
      });
    } else {
      alert("Can't create your token");
    }
  };

  render = () => {
    return (
      <div>
        <div>
          <button
            onClick={() =>
              this.props.dispatch({
                type: "CreationOnlineToken",
                action: false
              })
            }
          >
            Back
          </button>
        </div>
        <form onSubmit={this.submitHandler}>
          <div>
            <label>token's image</label>
            <input type="file" onChange={this.pictureInput} />
            <label>Number of object</label>
            <input
              type="number"
              value={this.state.numberOfTokens}
              onChange={this.numberOfTokens}
            />
            <label>Type:</label>
            <select value={this.state.type} onChange={this.typeInput}>
              <option>Token</option>
              <option>Background</option>
            </select>
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
    gameView: state.gameView,
    page: state.page.gmPage,
    login: state.login
  };
};

export default connect(mapStateToProps)(CreationOnlineToken);
