import React, { createContext, useEffect, useReducer } from "react";
import { State } from "types.global";
import { Reducer } from "./Reducer";

type Props = {
  children: React.ReactNode;
};

const isServer = typeof window !== "undefined";

/* The `INITIAL_STATE` constant is defining the initial state of the application. It is an object of
type `State` which contains the following properties: */
export const INITIAL_STATE: State = {
  user:
    isServer && localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user") as string)
      : null,
  isLoading: false,
  error: null,
  dispatch: () => null,
};

export const Context = createContext(INITIAL_STATE);

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

  /* The `useEffect` hook is used to perform side effects in a functional component. In this case, it is
 used to save the `state.user` value to the `localStorage` whenever it changes. */
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(state.user));
  }, [state.user]);

  return (
    <Context.Provider
      value={{
        user: state.user,
        isLoading: state.isLoading,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </Context.Provider>
  );
};
