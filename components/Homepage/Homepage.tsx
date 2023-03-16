import Post from "components/Post/Post";
import styles from "./homepage.module.scss";

const Homepage = () => {
  return (
    <div className={styles.homepage}>
      <div className={styles.homepage_profile}>Profile</div>

      <div className={styles.homepage_feed}>
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
        <Post />
      </div>

      <div className={styles.homepage_users}>Suggestions for you</div>
    </div>
  );
};

export default Homepage;
