import { createContext } from "react";

const AppContext = createContext();

function reducer(state, action) {
  switch (action.type) {
    case "edit":
      return { ...state, isEditing: !state.isEditing };
    case "run":
      return { ...state, isRunning: true };
    case "stop":
      return { ...state, isRunning: false };
    case "setDelay":
      return { ...state, delay: action.payload };
    case "setCellSize":
      return { ...state, cellSize: action.payload };
    default:
      throw new Error();
  }
}

// function mergeReducer(reducers) {}
export { AppContext, reducer };
