import React, { Component } from "react";
import ConventionQueue from "./ConventionQueue.jsx";

class Queue extends Component {
  constructor() {
    super();
  }
  //   requestToJoinHandle = evt => {
  //     if (this.props.login === false) {
  //       return alert("you need to login");
  //     }
  //     ....... a faire
  //   };

  //   LeaveTheQueue=evt=>{
  //       a faire aussi
  //   }

  render = () => {
    if (this.props.type === "Convention") {
      return (
        <div>
          <ConventionQueue
            id={this.props.id}
            conventionsGame={this.props.conventionsGame}
          />
        </div>
      );
    }

    return (
      <div>
        <div>
          number of persons {parseInt(this.props.players.length) + 1}/
          {parseInt(this.props.numPlayers) + 1}
        </div>
        <div>
          {/* (il faut une logique si on est le GM, il peut pas y avoir de bouton join, mais delete event) */}
          {this.props.players.includes(this.props.username) ? (
            <div>
              Leave the queue
              <button onClick={this.LeaveTheQueue} />
            </div>
          ) : (
            <div>
              Request to join
              <button onClick={this.requestToJoinHandle} />
            </div>
          )}
        </div>
        <div>Game Master: {this.props.host} </div>
        <div>
          {this.props.players.map((player, idx) => {
            if (idx <= this.props.players.length) {
              return <div>Attendees: player</div>;
            }
            return <div>On the waiting list: player</div>;
          })}
        </div>
      </div>
    );
  };
}

export default Queue;
