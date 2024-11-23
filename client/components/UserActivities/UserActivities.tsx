import { Context } from "Context/Context";
import axios from "axios";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import { Post } from "types.global";
import styles from "./userActivities.module.scss";

type ActivityProp = {
  activities: Post[];
  pusername: string;
  loading: boolean;
  userId: string;
};

const UserActivities = ({
  activities,
  pusername,
  loading,
  userId,
}: ActivityProp) => {
  const [hasMore, setHasMore] = useState(true);
  const [allActivities, setAllActivities] = useState(activities);

  useEffect(() => {
    setAllActivities(activities);
  }, [activities]);

  const { user } = useContext(Context);

  /**
   * The function fetches more activities from an API based on the last activity ID and updates the
   * state with the new activities.
   */
  const fetchMoreActivities = async () => {
    try {
      const lastPost = allActivities[allActivities.length - 1]; // Get the last activity in the current list

      // Fetch more activities from the API using the last activity ID
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/activities/${userId}?limit=10&lastPostId=${lastPost._id}`
      );

      const newActivities = res.data.message;

      if (newActivities.length === 0) {
        setHasMore(false); // Stop fetching if there are no more activities
      } else {
        // Update the state with the new activities
        setAllActivities((prevActivities) => [
          ...prevActivities,
          ...newActivities,
        ]);
      }
    } catch (error) {
      console.log("Error fetching more data:", error);
    }
  };

  return (
    <div className={styles.user_activities}>
      {loading ? (
        <div className={styles.loader_div}>
          <span className={styles.loader}></span>
        </div>
      ) : activities.length <= 0 ? (
        <p style={{ color: " rgba(0, 0, 0, 0.76)" }}>No user activity!</p>
      ) : (
        <InfiniteScroll
          dataLength={allActivities.length}
          next={fetchMoreActivities}
          hasMore={hasMore}
          loader={
            <div className={styles.loader_div}>
              <span className={styles.loader}></span>
            </div>
          }
        >
          {" "}
          {allActivities.map((post) => {
            return (
              <div key={post._id}>
                <div className={styles.activity}>
                  <Link
                    href={`/post/${post._id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <p className={styles.post_text}> {post.text}</p>
                  </Link>

                  <div className={styles.like_icon_div}>
                    <FaHeart className={styles.like_icon} />
                    {post.username === user?.username ? (
                      <p className={styles.post_userrr}>
                        You reacted
                        {post.username === user?.username
                          ? " your post"
                          : `${post.username}'s post`}
                        .
                      </p>
                    ) : (
                      <p className={styles.post_userrr}>
                        {user?.username === pusername ? "You" : pusername}{" "}
                        reacted {post.username}&apos;s post.
                      </p>
                    )}
                  </div>
                </div>
                <div className={styles.post_like_line}></div>
              </div>
            );
          })}
        </InfiniteScroll>
      )}
    </div>
  );
};

export default UserActivities;
