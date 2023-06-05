import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import nophoto from "../../images/no-photo.png";
import styles from "./post.module.scss";

import { Context } from "Context/Context";
import UpdPostModal from "components/UpdPostModal/UpdPostModal";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { Post } from "types.global";

type PostsItems = {
  postItems: Post;
};

const Post = ({ postItems }: PostsItems) => {
  const [timeAgo, setTimeAgo] = useState("");
  const [postHandle, setPostHandle] = useState(false);
  const [updPopup, setUpdPopup] = useState(false);

  const {
    _id,
    categories,
    username,
    userid,
    text,
    postimage,
    createdAt,
    updatedAt,
  } = postItems;

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const distance = formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
      });

      setTimeAgo(distance);
    };
    calculateTimeAgo(); // Update the time immediately

    // Update the time every minute (you can adjust the interval as needed)
    const intervalId = setInterval(calculateTimeAgo, 60000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [createdAt]);

  if (timeAgo.startsWith("about ")) {
    setTimeAgo(timeAgo.slice(5));
  }

  const { user } = useContext(Context);

  return (
    <div className={styles.post_comp}>
      <div className={styles.post_info}>
        <div className={styles.post_cat}>
          <div className={styles.post_user}>
            <Link href={`/user/${username}`}>
              <Image
                src={user?.profilePicture ? user?.profilePicture : nophoto}
                height={40}
                width={40}
                alt="sociatek"
                className={styles.user_profile}
              />
            </Link>

            <div className={styles.post_user_nameandtime}>
              <Link
                href={`/user/${username}`}
                style={{ textDecoration: "none" }}
              >
                <p className={styles.username}>{username}</p>
              </Link>

              <p className={styles.post_date}>
                <i>{timeAgo}</i>
              </p>
            </div>
          </div>

          <div className={styles.handle_post}>
            <p
              className={styles.edit_icon}
              onClick={() => setPostHandle(!postHandle)}
            >
              <FaEllipsisV />
            </p>

            {postHandle && (
              <div className={styles.post_popup}>
                <Link href={`/post/${_id}`} style={{ textDecoration: "none" }}>
                  <p>View Post</p>
                </Link>

                {user?.username === username ? (
                  <p onClick={() => setUpdPopup(!updPopup)}>Edit Post</p>
                ) : (
                  <p>Report Post</p>
                )}
              </div>
            )}
          </div>

          {updPopup && (
            <UpdPostModal post={postItems} setUpdPopup={setUpdPopup} />
          )}
        </div>
      </div>

      <Link href={`/post/${_id}`} style={{ textDecoration: "none" }}>
        <p className={styles.post_detail_text}>{text}</p>
      </Link>
      {postimage && (
        <Link href={`/post/${_id}`}>
          <Image
            src={postimage && postimage}
            alt="Blog image"
            width={500}
            height={300}
            className={styles.post_image}
            objectFit="cover"
            layout="responsive"
          />
        </Link>
      )}
    </div>
  );
};

export default Post;
