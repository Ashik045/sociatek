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

  /* The `useEffect` hook is used to fetch the user's profile picture from the server and update the
`userProfilePic` state variable. */
  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${username}`
      );
      const data = res.data.message;

      setUserProfilePic(data.profilePicture);
    };

    fetchUser();
  }, [username]);

  // check if the user is already like the post
  /* The `useEffect` hook is used to check if the current user has already liked the post. It runs
  whenever the `postItems` or `user?._id` (user ID) dependencies change. */
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

  /**
   * The function `handleLike` is used to handle like and unlike requests for a post, updating the like
   * count and liked status accordingly.
   * @param {string} value - The `value` parameter is a string that represents the action to be
   * performed. It can have two possible values: "inc" or any other value.
   * @returns The function `handleLike` returns a Promise.
   */
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
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/post/like/${_id}`,
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
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/post/unlike/${_id}`,
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

  /**
   * The function `handleConfirmDelete` is used to delete a post by sending an API request with the post
   * ID and updating the feed by removing the deleted post.
   * @param {string} id - The `id` parameter is a string that represents the unique identifier of a
   * post. It is used to specify which post should be deleted from the server.
   */
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/post/${id}`,
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

  /**
   * The function `handleLikePopup` is used to fetch and display a list of users who have reacted to a
   * specific post.
   * @param {string} postId - The `postId` parameter is a string that represents the unique identifier
   * of a post. It is used to fetch the list of users who have reacted to that post.
   */
  const handleLikePopup = async (postId: string) => {
    setReactorsPopup(true);

    try {
      setLoading(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/post/${postId}/reactedusers`
      );
      setReactedUsers(res.data?.message);

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
          <p className={styles.cmnt_count}>{cmntCount} comments</p>
        </div>

        {reactorsPopup && reactedUsers.length > 0 && (
          <ReactorsPopup
            users={reactedUsers}
            loading={loading}
            setReactorsPopup={setReactorsPopup}
            visitor={false}
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
