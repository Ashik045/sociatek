import { Context } from "Context/Context";
import Link from "next/link";
import { useContext } from "react";
import { FaHeart } from "react-icons/fa";
import { Post } from "types.global";
import styles from "./userActivities.module.scss";

type ActivityProp = {
  activities: Post[];
  pusername: string;
  loading: boolean;
};

const UserActivities = ({ activities, pusername, loading }: ActivityProp) => {
  //   console.log(activities);

  const { user } = useContext(Context);

  return (
    <div className={styles.user_activities}>
      {loading ? (
        <div className={styles.loader_div}>
          <span className={styles.loader}></span>
        </div>
      ) : activities.length <= 0 ? (
        <p style={{ color: " rgba(0, 0, 0, 0.76)" }}>No user activity!</p>
      ) : (
        activities.map((post) => {
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
                      {user?.username === pusername ? "You" : pusername} reacted{" "}
                      {post.username}&apos;s post.
                    </p>
                  )}
                </div>
              </div>
              <div className={styles.post_like_line}></div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default UserActivities;
