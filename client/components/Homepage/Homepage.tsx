import { Context } from "Context/Context";
import Post from "components/Post/Post";
import PostComponent from "components/PostComponent/PostComponent";
import Profile from "components/Profile/Profile";
import Suggestions from "components/Suggestions/Suggestions";
import { useContext, useEffect, useState } from "react";
import { Postt, User } from "types.global";
import styles from "./homepage.module.scss";

interface PostAndUserProps {
  posts: Postt[];
  users: User[];
}

const Homepage = ({ posts, users }: PostAndUserProps) => {
  const [allPosts, setAllPosts] = useState(posts);

  useEffect(() => {
    setAllPosts(posts);
  }, [posts]);

  const { user } = useContext(Context);
  return (
    <div className={styles.homepage}>
      <div className={styles.homepage_profile}>
        {user ? (
          <Profile />
        ) : (
          <p>
            Banner / Intro of this application. Sign in to achieve all the
            features of Sociatek.
          </p>
        )}
      </div>

      {/* feed sectioin - (write post, browse post) */}
      <div className={styles.homepage_feed}>
        {/* write post component */}
        <PostComponent />

        {/* render all the posts from database */}
        {posts.length > 0 ? (
          allPosts.map((post) => {
            return (
              <Post key={post._id} postItems={post} setAllPosts={setAllPosts} />
            );
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
