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
