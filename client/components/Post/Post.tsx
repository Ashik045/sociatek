import { Context } from "Context/Context";
import axios from "axios";
import ReactorsPopup from "components/ReactorsPopup/ReactorsPopup";
import UpdPostModal from "components/UpdPostModal/UpdPostModal";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FaEllipsisV, FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { MdOutlineShortcut } from "react-icons/md";
import { Post, User } from "types.global";
import nophoto from "../../images/no-photo.png";
import styles from "./post.module.scss";

type PostsItems = {
  postItems: Post;
  setAllPosts: React.Dispatch<React.SetStateAction<Post[]>>;
};

const Post = ({ postItems, setAllPosts }: PostsItems) => {
  const [timeAgo, setTimeAgo] = useState("");
  const [postHandle, setPostHandle] = useState(false);
  const [updPopup, setUpdPopup] = useState(false);
  const [likeCount, setLikeCount] = useState(postItems.likes?.length);
  const [cmntCount, setCmntCount] = useState(postItems.comments?.length);
  const [liked, setLiked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [reactedUsers, setReactedUsers] = useState<User[]>([]);
  const [reactorsPopup, setReactorsPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState("");

  const { user } = useContext(Context);
  const router = useRouter();

  const {
    _id,
    categories,
    username,
    userid,
    text,
    postimage,
    createdAt,
    likes,
    updatedAt,
  } = postItems;

  // Updating the time every minute
  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const createdDate = new Date(createdAt); // Convert createdAt to a Date object
      const distance = formatDistanceToNow(createdDate, {
        addSuffix: true,
      });

      setTimeAgo(distance);
    };

    if (createdAt) {
      calculateTimeAgo(); // Update the time immediately

      // Update the time every minute (you can adjust the interval as needed)
      const intervalId = setInterval(calculateTimeAgo, 60000);

      // Clear the interval when the component unmounts
      return () => clearInterval(intervalId);
    }
  }, [createdAt]);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `https://sociatek-api.onrender.com/api/user/${username}`
      );
      const data = res.data.message;

      setUserProfilePic(data.profilePicture);
    };

    fetchUser();
  }, [username]);

  // check if the user is already like the post
  useEffect(() => {
    if (postItems && user?._id) {
      const isFollower = postItems.likes?.includes(user?._id);

      if (isFollower) {
        setLiked(true);
      }
    }
  }, [postItems, user?._id]);

  if (timeAgo.startsWith("about ")) {
    setTimeAgo(timeAgo.slice(5));
  }

  const handleLike = async (value: string) => {
    // If likeLoading is true, return immediately to prevent multiple requests
    if (likeLoading) {
      return;
    }

    // Set likeLoading to true
    setLikeLoading(true);

    // check if user is authenticated
    const token = localStorage.getItem("jwtToken");

    if (!user) {
      router.push("/login");
      setLikeLoading(false); // Set likeLoading to false to enable handling likes again
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (value === "inc" && !liked) {
      try {
        // add a like request
        const response = await axios.post(
          `https://sociatek-api.onrender.com/api/post/like/${_id}`,
          {},
          config
        );

        setLikeCount(likeCount + 1);
        setLiked(!liked);
      } catch (error) {
        console.log(error);
      }
    } else {
      // add an unlike request
      try {
        const response = await axios.post(
          `https://sociatek-api.onrender.com/api/post/unlike/${_id}`,
          {},
          config
        );
      } catch (error) {
        console.error(error);
      }
      setLikeCount(likeCount - 1);
      setLiked(!liked);
    }

    // Set likeLoading to false after the request is completed
    setLikeLoading(false);
  };

  // delete  a post
  const handleDelete = () => {
    setShowPopup(true);
  };

  const handleCancel = () => {
    setShowPopup(false);
  };

  const handleConfirmDelete = async (id: string) => {
    // check if user is authenticated
    const token = localStorage.getItem("jwtToken");

    if (!user) {
      router.push("/login");
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      // send a api request
      const res = await axios.delete(
        `https://sociatek-api.onrender.com/api/post/${id}`,
        config
      );

      // Update the feed by removing the deleted post
      setAllPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));

      console.log(res.data.message);

      setShowPopup(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikePopup = async (postId: string) => {
    setReactorsPopup(true);

    try {
      setLoading(true);
      const res = await axios.get(
        `https://sociatek-api.onrender.com/api/post/${postId}/reactedusers`
      );
      const users = await res.data.message;
      setReactedUsers(users);

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.post_comp}>
      <div className={styles.post_info}>
        <div className={styles.post_cat}>
          <div className={styles.post_user}>
            <Link href={`/user/${username}`}>
              <Image
                src={userProfilePic ? userProfilePic : nophoto}
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

                {user?.username === username && (
                  <p
                    onClick={handleDelete}
                    style={{ color: "rgba(255, 0, 0, 0.682)" }}
                  >
                    Delete post
                  </p>
                )}

                {showPopup && (
                  <div className={styles.popup}>
                    <div className={styles.popup_content}>
                      <p>Are you sure you want to delete this post?</p>
                      <div>
                        <button onClick={handleCancel}>Cancel</button>
                        <button onClick={() => handleConfirmDelete(_id)}>
                          Confirm Delete
                        </button>
                      </div>
                    </div>
                  </div>
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
            loading="lazy"
          />
        </Link>
      )}

      <div className={styles.post_like_cmnt}>
        <div className={styles.post_like_line}></div>
        <div className={styles.like_cmnt_count}>
          <p onClick={() => handleLikePopup(_id)}>
            <span
              className={liked ? `${styles.like_animation}` : `${styles.like}`}
            >
              {likeCount}
            </span>{" "}
            {likeCount > 1 ? "likes" : "like"}
          </p>
          <p>{cmntCount} comments</p>
        </div>

        {reactorsPopup && reactedUsers.length > 0 && (
          <ReactorsPopup
            users={reactedUsers}
            loading={loading}
            setReactorsPopup={setReactorsPopup}
          />
        )}

        <div className={styles.add_like_cmnt}>
          <p>
            {liked ? (
              <FaHeart
                className={styles.like_icon}
                onClick={() => handleLike("dec")}
              />
            ) : (
              <FaRegHeart
                className={styles.unlike_icon}
                onClick={() => handleLike("inc")}
              />
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
