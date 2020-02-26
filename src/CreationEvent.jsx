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
      type: "Event",
      theme: "",
      system: "",
      language: "English",
      when: "",
      time: "",
      frequency: "Just once",
      description: "",
      location: {},
      numPlayers: 5,
      imgFile: ""
    };
  }

  titleInput = evt => {
    this.setState({ title: evt.target.value });
  };
  typeInput = evt => {
    this.setState({ type: evt.target.value });
  };
  themeInput = evt => {
    this.setState({ theme: evt.target.value });
  };
  systemInput = evt => {
    this.setState({ system: evt.target.value });
  };
  languageInput = evt => {
    this.setState({ language: evt.target.value });
  };
  whenInput = evt => {
    this.setState({ when: evt.target.value });
  };
  timeInput = evt => {
    this.setState({ time: evt.target.value });
  };
  frequencyInput = evt => {
    this.setState({ frequency: evt.target.value });
  };
  descriptionInput = evt => {
    this.setState({ description: evt.target.value });
  };
  numPlayersInput = evt => {
    this.setState({ numPlayers: evt.target.value });
  };
  locationInput = location => {
    this.setState({ location });
  };
  pictureInput = e => {
    this.setState({ imgFile: e.target.files[0] });
  };

  submitHandler = async evt => {
    evt.preventDefault();
    if (
      this.state.title === "" ||
      this.state.theme === "" ||
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
    data.append("system", this.state.theme);
    data.append("language", this.state.language);
    data.append("when", this.state.when);
    data.append("time", this.state.time);
    data.append("frequency", this.state.frequency);
    data.append("description", this.state.description);
    data.append("location", this.state.location);
    data.append("numPlayers", this.state.numPlayers);
    data.append("imgFile", this.state.imgFile);
    let response = await fetch("/hostingAEvent", {
      method: "POST",
      body: data
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

  render = () => {
    return (
      <div>
        {this.props.login === false ? (
          <div>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
          </div>
        ) : (
          <div>
            <form onSubmit={this.submitHandler}>
              <label>Event's name</label>
              <input onChange={this.titleInput} />
              <label>Type</label>
              <select onChange={this.typeInput}>
                <option>Event</option>
                <option>Convention</option>
                <option>Online</option>
              </select>
              <label>System</label>
              <select onChange={this.systemInput}>
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
                <option>Fiasco</option>
                <option>GURPS</option>
                <option>Pathfinder</option>
                <option>Pathfinder 2E</option>
                <option>Runequest</option>
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
              <label>Theme</label>
              <select onChange={this.themeInput}>
                <option></option>
                <option>Cyberpunk</option>
                <option>Fantastic</option>
                <option>Futuristic</option>
                <option>Historic</option>
                <option>Horror</option>
                <option>Modern</option>
                <option>Mystery</option>
              </select>
              <label>Language</label>
              <select onChange={this.languageInput}>
                <option>English</option>
                <option>French</option>
              </select>
              <label>When</label>
              <input type="date" onChange={this.whenInput} />
              <label>Time</label>
              <input type="time" onChange={this.timeInput} />
              <label>How often do you want to host this</label>
              <select onChange={this.frequencyInput}>
                <option>Just once</option>
                <option>Every week</option>
                <option>Every 2 weeks</option>
                <option>Every month</option>
              </select>
              <label>Picture</label>
              <input type="file" onChange={this.pictureInput} />
              <label>Description</label>
              <textarea
                rows="6"
                cols="20"
                maxLength="500"
                onChange={this.descriptionInput}
              ></textarea>
              {this.state.type !== "Convention" && (
                <>
                  <label>How many players on your table?</label>{" "}
                  <select
                    onChange={this.numPlayersInput}
                    value={this.state.numPlayers}
                  >
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                  </select>
                </>
              )}

              {this.state.type !== "Online" && (
                <>
                  <div>
                    <label>Address</label>
                    {/* onChange={this.locationInput}  */}
                    <SearchLocation setLocation={this.locationInput} />
                  </div>
                  <div>
                    <SimpleMap
                      lat={this.state.location.lat}
                      lng={this.state.location.lng}
                    />
                  </div>
                </>
              )}
              <input type="submit" value="Submit" />
            </form>
          </div>
        )}
      </div>
    );
  };
}

let mapStateToProps = state => {
  return {
    login: state.login,
    user: state.user
  };
};

export default withRouter(connect(mapStateToProps)(CreationEvent));
