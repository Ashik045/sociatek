import { Action, State } from "types.global";

export const Reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "LOGIN_START":
      return {
        user: null,
        isLoading: true,
        error: null,
        dispatch: state.dispatch,
      };
    case "LOGIN_SUCCESS":
      return {
        user: action.payload,
        isLoading: false,
        error: null,
        dispatch: state.dispatch,
      };
    case "LOGIN_FAILURE":
      return {
        user: null,
        isLoading: false,
        error: action.payload,
        dispatch: state.dispatch,
      };
    case "LOGOUT":
      return {
        user: null,
        isLoading: false,
        error: null,
        dispatch: state.dispatch,
      };
    case "USER_UPDATE_START":
      return { ...state, isLoading: true, error: null };
    case "USER_UPDATE_SUCCESS":
      return { ...state, user: action.payload, isLoading: false, error: null };
    case "USER_UPDATE_FAILURE":
      return {
        ...state,
        user: state.user,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};
