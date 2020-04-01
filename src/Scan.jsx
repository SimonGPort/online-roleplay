import React, { Component } from "react";

class Scan extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showScan: true
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ showScan: false });
    }, 2000);
  }

  render = () => {
    console.log(
      "scan position:",
      this.props.scan.positionX,
      this.props.scan.positionY
    );
    return (
      this.state.showScan && (
        <img
          src="/images/scan.gif"
          className="scan"
          style={{
            top: `${this.props.scan.positionY}px`,
            left: `${this.props.scan.positionX}px`,
            position: "absolute",
            zIndex: 5
          }}
        />
      )
    );
  };
}

export default Scan;
