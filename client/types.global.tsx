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
  username: string;
  fullname: string;
  email: string;
  password?: string;
  about: string;
  phone: string;
  location: string;
  profession: string;
  profilePicture: string;
  coverPhoto: string;
  followers: string[];
  following: string[];
  activities: string[];
  createdAt: Date;
  updatedAt: Date;
}
