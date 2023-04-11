import Post from "components/Post/Post";
import Profile from "components/Profile/Profile";
import Suggestions from "components/Suggestions/Suggestions";
import { Postt, User } from "types.global";
import styles from "./homepage.module.scss";

interface PostAndUserProps {
  posts: Postt[];
  users: User[];
}

const Homepage = ({ posts, users }: PostAndUserProps) => {
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
        <Suggestions users={users} />
      </div>
    </div>
  );
};

export default Homepage;
