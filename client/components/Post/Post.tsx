import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import nophoto from "../../images/no-photo.png";
import styles from "./post.module.scss";

import { Context } from "Context/Context";
import UpdPostModal from "components/UpdPostModal/UpdPostModal";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { FaEllipsisV, FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { MdOutlineShortcut } from "react-icons/md";
import { Post } from "types.global";

type PostsItems = {
  postItems: Post;
};

const Post = ({ postItems }: PostsItems) => {
  const [timeAgo, setTimeAgo] = useState("");
  const [postHandle, setPostHandle] = useState(false);
  const [updPopup, setUpdPopup] = useState(false);
  const [likeCount, setLikeCount] = useState(postItems.likes.length);
  const [cmntCount, setCmntCount] = useState(postItems.comments.length);
  const [liked, setLiked] = useState(false);

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

  const handleLike = (value: string) => {
    setLiked(!liked);
    if (value === "inc") {
      setLikeCount(likeCount + 1);
    } else {
      setLikeCount(likeCount - 1);
    }
  };

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

      <div className={styles.post_like_cmnt}>
        <div className={styles.post_like_line}></div>
        <div className={styles.like_cmnt_count}>
          <p>
            <span
              className={liked ? `${styles.like_animation}` : `${styles.like}`}
            >
              {likeCount}
            </span>{" "}
            likes
          </p>
          <p>{cmntCount} comments</p>
        </div>

        <div className={styles.add_like_cmnt}>
          <p>
            {liked ? (
              <FaHeart onClick={() => handleLike("dec")} />
            ) : (
              <FaRegHeart onClick={() => handleLike("inc")} />
            )}
          </p>
          <p>
            <FaRegComment />
          </p>

          <p>
            <MdOutlineShortcut />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Post;
