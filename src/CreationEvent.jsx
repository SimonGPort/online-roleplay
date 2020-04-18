import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import SimpleMap from "./SimpleMap.jsx";
import SearchLocation from "./SearchLocation.jsx";

class CreationEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      type: "Traditional",
      theme: "",
      system: "",
      language: "English",
      when: "",
      time: "",
      frequency: "Just once",
      description: "",
      location: {},
      address: "",
      numPlayers: 5,
      imgFile: "",
    };
  }

  titleInput = (evt) => {
    this.setState({ title: evt.target.value });
  };
  typeInput = (evt) => {
    this.setState({ type: evt.target.value });
  };
  themeInput = (evt) => {
    this.setState({ theme: evt.target.value });
  };
  systemInput = (evt) => {
    this.setState({ system: evt.target.value });
  };
  languageInput = (evt) => {
    this.setState({ language: evt.target.value });
  };
  whenInput = (evt) => {
    this.setState({ when: evt.target.value });
  };
  timeInput = (evt) => {
    this.setState({ time: evt.target.value });
  };
  frequencyInput = (evt) => {
    this.setState({ frequency: evt.target.value });
  };
  descriptionInput = (evt) => {
    this.setState({ description: evt.target.value });
  };
  numPlayersInput = (evt) => {
    this.setState({ numPlayers: evt.target.value });
  };
  locationInput = (location) => {
    this.setState({ location });
  };
  pictureInput = (e) => {
    this.setState({ imgFile: e.target.files[0] });
  };

  addressInput = (evt) => {
    this.setState({ address: evt });
  };

  submitHandler = async (evt) => {
    evt.preventDefault();
    if (
      this.state.title === "" ||
      // this.state.theme === "" ||
      this.state.system === "" ||
      this.state.imgFile === "" ||
      this.state.when === "" ||
      this.state.time === "" ||
      (this.state.type !== "Online" && this.state.location === "")
    ) {
      alert("You need to complete the form");
      return;
    }
    let data = new FormData();
    data.append("host", this.props.username);
    data.append("title", this.state.title);
    data.append("type", this.state.type);
    data.append("theme", this.state.theme);
    data.append("system", this.state.system);
    data.append("language", this.state.language);
    data.append("when", this.state.when);
    data.append("time", this.state.time);
    data.append("frequency", this.state.frequency);
    data.append("description", this.state.description);
    data.append("address", this.state.address);
    data.append("location", JSON.stringify(this.state.location));
    data.append("numPlayers", this.state.numPlayers);
    data.append("imgFile", this.state.imgFile);
    let response = await fetch("/hostingAEvent", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      alert("Your event is post");
      this.props.history.push("/");
    } else {
      alert("Can't post your event");
    }
  };

  accessDenied = () => {
    alert("you need to login");
    this.props.history.push("/");
  };

  render = () => {
    if (this.props.login === false) {
      this.accessDenied();
    }

    return (
      <div className="creation-event-page">
        <div></div>
        <form onSubmit={this.submitHandler}>
          <div className="creation-event-category creation-event-welcome">
            Create an event
          </div>
          <div className="creation-event-category">
            <div>
              <label>Title</label>
            </div>
            <input
              onChange={this.titleInput}
              className="creation-event-input"
            />
          </div>
          <div className="creation-event-category">
            <label>Type</label>
            <select
              onChange={this.typeInput}
              className="creation-event-scrollmenu"
            >
              <option>Traditional</option>
              <option>Convention</option>
              <option>Online</option>
            </select>
            <label>Language</label>
            <select
              onChange={this.languageInput}
              className="creation-event-scrollmenu"
            >
              <option>English</option>
              <option>French</option>
            </select>
            {this.state.type !== "Convention" && (
              <>
                <label>Number of attendees</label>
                <select
                  onChange={this.numPlayersInput}
                  value={this.state.numPlayers}
                  className="creation-event-scrollmenu"
                >
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                </select>
              </>
            )}
          </div>
          <div className="creation-event-category">
            <label>System</label>
            <select
              onChange={this.systemInput}
              className="creation-event-scrollmenu"
            >
              <option></option>
              <option>Call of cthulhu</option>
              <option>Burning wheel</option>
              <option>Conan</option>
              <option>Cyberpunk</option>
              <option>D&D 1/2E</option>
              <option>D&D 3E</option>
              <option>Mystery</option>
              <option>D&D 4E</option>
              <option>D&D 5E</option>
              <option>Dungeon world</option>
              <option>Fate</option>
              <option>Fiasco</option>
              <option>GURPS</option>
              <option>Pathfinder</option>
              <option>Pathfinder 2E</option>
              <option>Runequest</option>
              <option>Starfinder</option>
              <option>Starwars FFG</option>
              <option>Stars without number</option>
              <option>Shadowrun</option>
              <option>Dungeon world</option>
              <option>Pokemon</option>
              <option>The witcher</option>
              <option>Warhammer</option>
              <option>World of darkness</option>
              <option>Other</option>
            </select>
            {/* <label>Theme</label>
            <select
              onChange={this.themeInput}
              className="creation-event-scrollmenu"
            >
              <option></option>
              <option>Cyberpunk</option>
              <option>Fantastic</option>
              <option>Futuristic</option>
              <option>Historic</option>
              <option>Horror</option>
              <option>Modern</option>
              <option>Mystery</option>
              <option>Other</option>
            </select> */}
          </div>
          <div className="creation-event-category">
            <label>When</label>
            <input
              type="date"
              onChange={this.whenInput}
              className="creation-event-scrollmenu"
            />
            <label>Time</label>
            <input
              type="time"
              onChange={this.timeInput}
              className="creation-event-scrollmenu"
            />
          </div>
          {/* <label>How often do you want to host this</label>
              <select onChange={this.frequencyInput}>
                <option>Just once</option>
                <option>Every week</option>
                <option>Every 2 weeks</option>
                <option>Every month</option>
              </select> */}
          <div className="creation-event-category">
            <label>Picture</label>
            <input
              type="file"
              onChange={this.pictureInput}
              className="creation-event-scrollmenu"
            />
          </div>
          <div className="creation-event-category">
            <div>
              <label>Description</label>
            </div>
            <textarea
              rows="6"
              cols="20"
              maxLength="500"
              onChange={this.descriptionInput}
              className="creation-event-input"
            ></textarea>
          </div>
          {this.state.type !== "Online" && (
            <div className="creation-event-category">
              <div>
                <label>Address</label>
                <SearchLocation
                  setLocation={this.locationInput}
                  setAddress={this.addressInput}
                  addressLocation={this.state.address}
                />
              </div>
              <div>
                <SimpleMap
                  lat={this.state.location.lat}
                  lng={this.state.location.lng}
                />
              </div>
            </div>
          )}
          <div className="creation-event-enter-container">
            <input type="submit" value="Submit" className="card-enter " />
          </div>
        </form>
        <div></div>
      </div>
    );
  };
}

let mapStateToProps = (state) => {
  return {
    login: state.login,
    user: state.user,
  };
};

export default withRouter(connect(mapStateToProps)(CreationEvent));
