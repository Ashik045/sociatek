import { State } from "types.global";

export const LoginStart = (loginData: { email: string; password: string }) => ({
  type: "LOGIN_START",
});

export const LoginSuccess = (user: State["user"]) => ({
  type: "LOGIN_SUCCESS",
  payload: user,
});

export const LoginFailure = () => ({
  type: "LOGIN_FAILURE",
});

export const Logout = () => ({
  type: "LOGOUT",
});

export const UserUpdateStart = () => ({
  type: "USER_UPDATE_START",
});

export const UserUpdateSuccess = (user: State["user"]) => ({
  type: "USER_UPDATE_SUCCESS",
  payload: user,
});

export const UserUpdateFailure = (error: string) => ({
  type: "USER_UPDATE_FAILURE",
  payload: error,
});
