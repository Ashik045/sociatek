import Post from "components/Post/Post";
import Profile from "components/Profile/Profile";
import Suggestions from "components/Suggestions/Suggestions";
import { Postt } from "types.global";
import styles from "./homepage.module.scss";

interface PostProps {
  posts: Postt[];
}

const Homepage = ({ posts }: PostProps) => {
  return (
    <div className={styles.homepage}>
      <div className={styles.homepage_profile}>
        <Profile />
      </div>

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
        <Suggestions />
      </div>
    </div>
  );
};

export default Homepage;
