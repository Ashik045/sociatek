import Post from "components/Post/Post";
import styles from "./homepage.module.scss";

type PostsProps = {
  posts: {
    _id: string;
    categories: string[];
    username: string;
    title: string;
    desc: string;
    photo: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
};

const Homepage = ({ posts }: PostsProps) => {
  return (
    <div className={styles.homepage}>
      <div className={styles.homepage_profile}>Profile(linkedin)</div>

      {/* feed sectioin - (write post, browse post) */}
      <div className={styles.homepage_feed}>
        {posts.length > 0 ? (
          posts.map((post) => {
            return <Post key={post._id} postItems={post} />;
          })
        ) : (
          <p>No post found!</p>
        )}
      </div>

      <div className={styles.homepage_users}>
        Suggestions for you(instagram)
      </div>
    </div>
  );
};

export default Homepage;
