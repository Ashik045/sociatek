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

export interface SinglePostProp {
  post: {
    _id: string;
    categories: string[];
    username: string;
    title: string;
    desc: string;
    photo: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

export interface User {
  _id: string;
  name: string;
  usename: string;
  text: string;
  profilepic: string;
}
