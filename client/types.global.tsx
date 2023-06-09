export interface Postt {
  _id: string;
  categories: string[];
  username: string;
  title: string;
  desc: string;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  _id: string;
  categories: string[];
  username: string;
  userid: string;
  text: string;
  postimage: string;
  likes: Array<string>;
  comments: Array<string>;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  password?: string;
  about: string;
  phone: string;
  location: string;
  facebook: string;
  profession: string;
  profilePicture: string;
  coverPhoto: string;
  followers: string[];
  following: string[];
  activities: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type State = {
  user: null | User;
  isLoading: boolean;
  error: null | string;
  dispatch: React.Dispatch<Action>;
};

export type Action =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: State["user"] }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "USER_UPDATE_START" }
  | { type: "USER_UPDATE_SUCCESS"; payload: State["user"] }
  | { type: "USER_UPDATE_FAILURE"; payload: string };
