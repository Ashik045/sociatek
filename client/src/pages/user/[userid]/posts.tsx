import axios from "axios";
import { GetServerSideProps, NextPage } from "next";
import { Postt } from "types.global";

interface PostProps {
  posts: Postt[];
}

const posts: NextPage<PostProps> = ({ posts }) => {
  console.log(posts);

  return <div>posts</div>;
};

export default posts;

// SSR - get called on every request
export const getServerSideProps: GetServerSideProps<PostProps> = async (
  context
) => {
  // const { userid } = context.params;

  // Fetch the posts for the user with the given userId
  // const res = await axios.get(
  //   `http://localhost:4000/api/users/${userid}/posts`
  // );
  const res = await axios.get("https://weblog-backend.onrender.com/api/posts");
  const posts = await res.data.message;

  return {
    props: {
      posts: posts,
    },
  };
};
