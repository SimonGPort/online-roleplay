import React, { Component } from "react";
import { connect } from "react-redux";
import SimpleMap from "./SimpleMap.jsx";

class LoginModal extends Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <>
        <div
          className="dark-background"
          onClick={() => {
            this.props.removeMapModal();
          }}
        ></div>
        <div className="modal-container">
          <div className="map-modal-simple-map ">
            <SimpleMap
              lat={this.props.location.lat}
              lng={this.props.location.lng}
            />
            {/* <form onSubmit={this.submitHandler} className="modalElement">
              <div className="modalElement">
                Username
                <input
                  type="text"
                  onChange={this.usernameChange}
                  className="inputModal"
                />
              </div>
              <div className="modalElement">
                Password
                <input
                  type="text"
                  onChange={this.passwordChange}
                  className="inputModal"
                />
              </div>
              <input type="submit" value="login" className="modalSubmit" />
            </form> */}
          </div>
        </div>
      </>
    );
  };
}

export default connect()(LoginModal);
