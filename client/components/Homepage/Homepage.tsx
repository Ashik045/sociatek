import { Context } from "Context/Context";
import axios from "axios";
import Post from "components/Post/Post";
import PostComponent from "components/PostComponent/PostComponent";
import Profile from "components/Profile/Profile";
import Suggestions from "components/Suggestions/Suggestions";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Postt, User } from "types.global";
import styles from "./homepage.module.scss";

// types
interface PostAndUserProps {
  initialPosts: Postt[]; // Initial posts from the server
  users: User[];
  setAllPosts: React.Dispatch<React.SetStateAction<Postt[]>>;
  hasMore: boolean;
  setHasMore: React.Dispatch<React.SetStateAction<boolean>>;
}

const Homepage = ({
  initialPosts,
  users,
  setAllPosts: setAllPostsState,
  hasMore,
  setHasMore,
}: PostAndUserProps) => {
  const [allPosts, setAllPosts] = useState(initialPosts);

  useEffect(() => {
    setAllPosts(initialPosts);
  }, [initialPosts]);

  /**
   * The function fetches more data from an API based on the user's scroll and ID of the last post in the current list and
   * updates the state with the new posts.
   */
  const fetchMoreData = async () => {
    try {
      const lastPost = allPosts[allPosts.length - 1]; // Get the last post in the current list

      // Fetch more data from the API using the _id of the last post
      const res = await axios.get(
        `https://sociatek.onrender.com/api/posts/all?limit=10&lastPostId=${lastPost._id}`
      );

      const newPosts = res.data.message;

      if (newPosts.length === 0) {
        setHasMore(false); // Stop fetching if there are no more posts
      } else {
        // Update the state with the new posts
        setAllPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
    } catch (error) {
      console.log("Error fetching more data:", error);
    }
  };

  const { user } = useContext(Context);

  return (
    <div className={styles.homepage}>
      <div className={styles.homepage_profile}>
        {user ? (
          <Profile />
        ) : (
          <p style={{ padding: "10px", textAlign: "center" }}>
            Please{" "}
            <Link href="/login" style={{ color: "black" }}>
              sign in
            </Link>{" "}
            to see all the features of Sociatek.
          </p>
        )}
      </div>

      {/* feed sectioin - (write post, browse post) */}
      <div className={styles.homepage_feed}>
        {/* write post component */}
        <PostComponent />

        {/* render all the posts from database */}
        {/* The `<InfiniteScroll>` component is a wrapper component that enables infinite scrolling
        functionality. It allows you to load more data as the user scrolls down the page.  */}
        <InfiniteScroll
          dataLength={allPosts.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className={styles.loader_div}>
              <span className={styles.loader}></span>
            </div>
          }
        >
          {allPosts.length > 0 ? (
            allPosts.map((post) => {
              return (
                <Post
                  key={post._id}
                  postItems={post}
                  setAllPosts={setAllPosts}
                />
              );
            })
          ) : (
            <p style={{ textAlign: "center" }}>No post found!</p>
          )}
        </InfiniteScroll>
      </div>

      <div className={styles.homepage_users}>
        <Suggestions users={users} />
      </div>
    </div>
  );
};

export default Homepage;
