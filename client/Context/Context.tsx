import React, { createContext, useEffect, useReducer } from "react";
import { State } from "types.global";
import { Reducer } from "./Reducer";

type Props = {
  children: React.ReactNode;
};

export const INITIAL_STATE: State = {
  user: null,
  isLoading: false,
  error: null,
  dispatch: () => null,
};

export const Context = createContext(INITIAL_STATE);

export const ContextProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, INITIAL_STATE);

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
