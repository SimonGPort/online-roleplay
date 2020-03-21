import { createStore } from "redux";
import produce from "immer";

let reducer = (state, action) => {
  if (action.type === "logout") {
    return { ...state, login: action.login, user: "" };
  }

  if (action.type === "removeMasterToken") {
    return { ...state, MasterToken: {} };
  }

  if (action.type === "CreationOnlineToken") {
    return { ...state, CreationOnlineToken: action.action };
  }

  if (action.type === "signup") {
    return { ...state, login: action.login, user: action.user };
  }
  if (action.type === "login") {
    return { ...state, login: action.login, user: action.user };
  }

  if (action.type === "fetchEvents") {
    return { ...state, events: action.events };
  }

  if (action.type === "typeSelection") {
    return { ...state, typeSelection: action.typeSelection };
  }

  if (action.type === "isErasingToken") {
    return { ...state, isErasingToken: action.isErasingToken };
  }
  if (action.type === "isHidingToken") {
    return { ...state, isHidingToken: action.isHidingToken };
  }

  if (action.type === "isScanning") {
    return { ...state, isScanning: action.isScanning };
  }

  if (action.type === "duplicateNumber") {
    if (action.number < 0) {
      action.number = 1;
    }
    console.log(action.number);
    return produce(state, draftState => {
      draftState.isDuplicateToken.number = action.number;
    });
  }

  if (action.type === "isDuplicate") {
    return produce(state, draftState => {
      draftState.isDuplicateToken.action = action.isDuplicate;
    });
  }

  if (action.type === "draggingStart") {
    return { ...state, dragging: true, tokenIdDragged: action.tokenIdDragged };
  }
  if (action.type === "draggingEnd") {
    return { ...state, dragging: false, tokenIdDragged: "" };
  }

  if (action.type === "gameUpdate") {
    return {
      ...state,
      gameView: action.gameView,
      MasterToken: action.MasterToken
    };
  }

  if (action.type === "set-messages") {
    let eventId = action.eventId;
    let messages = action.messages;

    const index = state.events.findIndex(event => {
      return event.eventId === eventId;
    });

    return produce(state, draftState => {
      draftState.events[index].chat = messages;
    });
  }

  if (action.type === "set-messages-convention") {
    let eventId = action.eventId;
    let messages = action.messages;
    let tableId = action.tableId;

    const eventIndex = state.events.findIndex(event => {
      return event.eventId === eventId;
    });
    const tableIndex = state.events[eventIndex].conventionsGame.findIndex(
      table => {
        return table.tableId === tableId;
      }
    );

    return produce(state, draftState => {
      draftState.events[eventIndex].conventionsGame[tableIndex].chat = messages;
    });
  }

  if (action.type === "newGmEventConvention") {
    let eventId = action.eventId;
    let user = action.user;
    let tableIndex = action.tableIndex;

    return produce(state, draftState => {
      draftState.events[eventIndex].conventionsGame[tableIndex].gm = user;
    });
  }

  if (action.type === "MouseMoveToken") {
    let tokenId = action.tokenId;
    let positionX = action.positionX;
    let positionY = action.positionY;

    const tokenIndex = state.gameView.findIndex(token => {
      return token.tokenId === tokenId;
    });

    return produce(state, draftState => {
      draftState.gameView[tokenIndex].positionX = positionX;
      draftState.gameView[tokenIndex].positionY = positionY;
    });
  }

  if (action.type === "gameAcceptedConvention") {
    let eventId = action.eventId;
    let tableIndex = action.tableIndex;
    let eventIndex = state.events.findIndex(event => {
      return event.eventId === eventId;
    });
    return produce(state, draftState => {
      draftState.events[eventIndex].conventionsGame[tableIndex].visibility =
        "NotRestricted";
    });
  }

  if (action.type === "newGmEventConvention") {
    let eventIndex = action.eventIndex;
    let user = action.user;
    let tableIndex = action.tableIndex;
    return produce(state, draftState => {
      draftState.events[eventIndex].conventionsGame[tableIndex].gm = user;
    });
  }

  if (action.type === "joinEventConvention") {
    let eventIndex = action.eventIndex;
    let user = action.user;
    let tableIndex = action.tableIndex;
    return produce(state, draftState => {
      draftState.events[eventIndex].conventionsGame[tableIndex].players.push(
        user
      );
    });
  }

  if (action.type === "leaveEventConvention") {
    let eventIndex = action.eventIndex;
    let user = action.user;
    let tableIndex = action.tableIndex;
    const indexPlayer = state.events[eventIndex].conventionsGame[
      tableIndex
    ].players.findIndex(player => {
      return player === user;
    });
    return produce(state, draftState => {
      draftState.events[eventIndex].conventionsGame[tableIndex].players.splice(
        indexPlayer,
        1
      );
    });
  }

  if (action.type === "DeleteEventConvention") {
    let eventIndex = action.eventIndex;
    let tableIndex = action.tableIndex;
    return produce(state, draftState => {
      draftState.events[eventIndex].conventionsGame.splice(tableIndex, 1);
    });
  }

  if (action.type === "joinEvent") {
    let eventId = action.id;
    let user = action.user;

    const index = state.events.findIndex(event => {
      return event.eventId === eventId;
    });
    return produce(state, draftState => {
      draftState.events[index].players.push(user);
    });
  }

  if (action.type === "newUserOnline") {
    let user = {};
    user.user = action.user;
    user.initiative = null;

    return produce(state, draftState => {
      draftState.usersOnline.push(user);
    });
  }

  if (action.type === "newUserOffline") {
    console.log(action.user);
    return produce(state, draftState => {
      draftState.userOnline = draftState.usersOnline.filter(
        user => user.user !== action.user
      );
    });
  }

  if (action.type === "leaveEvent") {
    let eventId = action.id;
    let user = action.user;

    const indexEvent = state.events.findIndex(event => {
      return event.eventId === eventId;
    });
    const indexPlayer = state.events[indexEvent].players.findIndex(player => {
      return player === user;
    });

    return produce(state, draftState => {
      draftState.events[indexEvent].players.splice(indexPlayer, 1);
    });
  }

  return state;
};

const store = createStore(
  reducer,
  {
    sessions: [],
    dragging: false,
    tokenIdDragged: "",
    usersOnline: [],
    user: "",
    login: false,
    events: [],
    language: "english",
    gameView: [],
    page: 1,
    typeSelection: "Token",
    isErasingToken: false,
    isDuplicateToken: { action: false, number: 1 },
    isHidingToken: false,
    isScanning: false,
    CreationOnlineToken: false,
    MasterToken: {}
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
