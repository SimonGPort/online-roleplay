import { connect } from "react-redux";

async function handleBanPlayer(eventId, user) {
  if (window.confirm("Do you want to ban this player?")) {
    let data = new FormData();
    data.append("eventId", eventId);
    data.append("user", user);
    let response = await fetch("/BanPlayerNormalQueue", {
      method: "POST",
      body: data,
    });
    let body = await response.text();
    body = JSON.parse(body);
    if (body.success) {
      console.log("ban success");
      this.props.dispatch({
        type: BanPlayerNormalQueue,
        eventId: eventId,
        user: user,
      });
    } else {
      console.log("ban fail");
    }
  }
}

async function handleBanPlayerConvention(eventId, tableIndex, user) {
  if (window.confirm("Do you want to ban this player?")) {
    let data = new FormData();
    data.append("eventId", eventId);
    data.append("tableId", tableId);
    data.append("tableIndex", tableIndex);
    data.append("user", user);
    let response = await fetch("/BanPlayerConventionQueue", {
      method: "POST",
      body: data,
    });
  }
}

module.exports = { handleBanPlayer };
