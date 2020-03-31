import React, { Component } from "react";

class Grid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.resizeGrid);
  }

  resizeGrid = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  render = () => {
    let numberOfRows = Math.ceil(this.state.height / 70);
    let numberOfCol = Math.ceil(this.state.width / 70);
    let gridRows = [];
    let gridCol = [];

    for (let j = 0; j < numberOfCol; j++) {
      gridCol.push(<div className="grid-case" key={j} />);
    }

    for (let i = 0; i < numberOfRows; i++) {
      gridRows.push(
        <div className="grid-row" key={i}>
          {gridCol}
        </div>
      );
    }

    console.log("grid", gridRows);

    return (
      <div
        className="grid"
        style={{
          display: this.props.grid === true ? "block" : "none"
        }}
      >
        {gridRows}
      </div>
    );
  };
}

export default Grid;
