import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => (
  <div>
    <img className="markerOnMap" src="/Images/marker.png" />
  </div>
);

class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 45.5017,
      lng: -73.5673,
    },
    zoom: 11,
  };

  render() {
    const center = this.props.lat
      ? { lat: this.props.lat, lng: this.props.lng }
      : null;

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDBG-liGhU9LnuaRNSMhRjk73bmA1NlJrQ" }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
          center={center}
        >
          {this.props.lat ? (
            <AnyReactComponent
              lat={this.props.lat}
              lng={this.props.lng}
              text="My Marker"
            />
          ) : null}
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
