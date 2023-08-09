import mongoose from "mongoose";

interface PostType {
  text: string;
  postimage: string;
  username: string;
  userid: string;
  likes: string[];
  comments: string[];
}

/* The code is defining a Mongoose schema for a Post document in a MongoDB database. */
const PostSchema = new mongoose.Schema<PostType>(
  {
    text: {
      type: "string",
      required: true,
    },
    postimage: {
      type: "string",
    },
    username: {
      type: "string",
      required: true,
    },
    userid: {
      type: "string",
      required: true,
    },
    likes: {
      type: [String],
      default: [],
    },
    comments: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Post = mongoose.model<PostType>("Post", PostSchema);

export { Post };
