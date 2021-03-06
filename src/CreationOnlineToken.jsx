import React, { Component } from "react";
import { connect } from "react-redux";

class CreationOnlineToken extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgFile: "",
      numberOfTokens: 1,
      type: "Token",
    };
  }

  pictureInput = (e) => {
    this.setState({ imgFile: e.target.files[0] });
  };

  numberOfTokens = (evt) => {
    if (this.state.numberOfTokens < 0) {
      return this.setState({ numberOfTokens: 1 });
    }
    this.setState({ numberOfTokens: evt.target.value });
  };

  typeInput = (evt) => {
    this.setState({ type: evt.target.value });
  };

  submitHandler = async (evt) => {
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
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      alert("Your element is created");
      this.props.dispatch({
        type: "CreationOnlineToken",
        action: false,
      });
      this.props.dispatch({
        type: "typeSelection",
        typeSelection: this.state.type,
      });
    } else {
      alert("Can't create your token");
    }
  };

  render = () => {
    return (
      <div>
        <form onSubmit={this.submitHandler}>
          <div className="creation-online-token-section">
            <label>Type</label>
            <select
              value={this.state.type}
              onChange={this.typeInput}
              className="GmBar-button-right-Margin-NewToken"
            >
              <option>Token</option>
              <option>Background</option>
            </select>
            <label>Quantity</label>
            <input
              className="GmBar-button-right-Margin-NewToken GmBar-button"
              type="number"
              value={this.state.numberOfTokens}
              onChange={this.numberOfTokens}
            />
            <label>Image</label>
            <input type="file" onChange={this.pictureInput} />
          </div>
          <div className="creation-online-token-section">
            <input
              type="submit"
              value="Submit"
              className="GmBar-button GmBar-button-right-Margin-NewToken"
            />
            <button
              className="GmBar-button"
              onClick={() =>
                this.props.dispatch({
                  type: "CreationOnlineToken",
                  action: false,
                })
              }
            >
              Back
            </button>
          </div>
        </form>
      </div>
    );
  };
}

let mapStateToProps = (state) => {
  return {
    gameView: state.gameView,
    page: state.page.gmPage,
    login: state.login,
  };
};

export default connect(mapStateToProps)(CreationOnlineToken);
