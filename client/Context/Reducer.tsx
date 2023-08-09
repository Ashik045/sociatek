import { Action, State } from "types.global";

/**
 * The Reducer function is used to update the state based on different action types in a TypeScript
 * React application.
 * @param {State} state - The `state` parameter represents the current state of the application. It is
 * an object that contains various properties and their corresponding values.
 * @param {Action} action - The `action` parameter is an object that represents the action being
 * dispatched. It typically has a `type` property that describes the type of action being performed,
 * and may also have a `payload` property that contains additional data related to the action.
 * @returns The Reducer function returns a new state object based on the action type. The returned
 * state object includes properties such as "user", "isLoading", "error", and "dispatch". The specific
 * properties and their values depend on the action type and payload.
 */
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
