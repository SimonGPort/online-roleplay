import { createStore } from "redux";
import produce from "immer";

let reducer = (state, action) => {
  if (action.type === "logout") {
    return { ...state, login: action.login, user: "" };
  }

  if (action.type === "signup") {
    return { ...state, login: action.login, user: action.username };
  }
  if (action.type === "login") {
    return { ...state, login: action.login, user: action.user };
  }

  if (action.type === "fetchEvents") {
    return { ...state, events: action.events };
  }

  if (action.type === "set-messages") {
    return { ...state, chat: action.messages };
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
    users: [],
    login: false,
    chat: [],
    events: [],
    language: "english"
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
