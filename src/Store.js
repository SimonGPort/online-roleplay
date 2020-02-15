import { createStore } from "redux";

let reducer = (state, action) => {
  if (action.type === "logout") {
    return { ...state, login: action.login, user: "" };
  }

  if (action.type === "signup") {
    return { ...state, login: action.login, user: action.username };
  }
  if (action.type === "login") {
    return { ...state, login: action.login, user: action.username };
  }

  //   if (action.type === "signup") {
  //     return { ...state, login: action.login, user: action.username };
  //   }
  //   if (action.type === "login") {
  //     return { ...state, login: action.login, user: action.username };
  //   }
  //   if (action.type === "logout") {
  //     return { ...state, login: action.login, user: "", cart: [] };
  //   }

  return state;
};
const store = createStore(
  reducer,
  {
    sessions: [],
    users: [],
    login: false,
    chat: [],
    username: "",
    language: "english"
  },
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;
