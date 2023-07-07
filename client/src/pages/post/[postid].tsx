import { Context } from "Context/Context";
import axios from "axios";
import Navbar from "components/Navbar/Navbar";
import OtherPosts from "components/OtherPosts/OtherPosts";
import ReactorsPopup from "components/ReactorsPopup/ReactorsPopup";
import UpdPostModal from "components/UpdPostModal/UpdPostModal";
import { formatDistanceToNow } from "date-fns";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FaEllipsisV, FaHeart, FaRegComment, FaRegHeart } from "react-icons/fa";
import { MdOutlineShortcut } from "react-icons/md";
import { Post, User } from "types.global";
import nophoto from "../../../images/no-photo.png";
import styles from "../../styles/singlepost.module.scss";

interface PostProp {
  post: Post;
  posts: Post[];
}

const SinglePost = ({ post, posts }: PostProp) => {
  const [timeAgo, setTimeAgo] = useState("");
  const [postHandle, setPostHandle] = useState(false);
  const [updPopup, setUpdPopup] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length);
  const [cmntCount, setCmntCount] = useState(post.comments?.length);
  const [liked, setLiked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [reactedUsers, setReactedUsers] = useState<User[]>([]);
  const [reactorsPopup, setReactorsPopup] = useState(false);
  const [loading, setLoading] = useState(false);

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
  } = post;

  const { user } = useContext(Context);
  const router = useRouter();

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

  // check if the user is already like the post
  useEffect(() => {
    if (post && user?._id) {
      const isFollower = post.likes?.includes(user?._id);

      if (isFollower) {
        setLiked(true);
      }
    } else {
      console.log("Not Liked");
    }
  }, [post, user?._id]);

  const handleLike = async (value: string) => {
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

    if (value === "inc" && !liked) {
      try {
        // add a like request
        const response = await axios.post(
          `https://sociatek-api.onrender.com/api/post/like/${_id}`,
          {},
          config
        );

        // Success message
        console.log(response.data.message);

        setLikeCount(likeCount + 1);
        setLiked(!liked);
      } catch (error) {
        console.log(error);
      }
    } else {
      // add a unlike request
      try {
        const response = await axios.post(
          `https://sociatek-api.onrender.com/api/post/unlike/${_id}`,
          {},
          config
        );

        // Success message
        console.log(response.data.message);
      } catch (error) {
        console.error(error);
      }
      console.log("Unlike the post");
      setLikeCount(likeCount - 1);
      setLiked(!liked);
    }
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

      console.log(res.data.message);
      router.push("/");

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
    <div className={styles.singlePost}>
      <Navbar />
      <div className={styles.singlePost_main}>
        <div className={styles.singlePost_detail}>
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

                <p className={styles.post_date}>{timeAgo}</p>
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
                  <Link
                    href={`/user/${username}`}
                    style={{ textDecoration: "none" }}
                  >
                    <p>View user profile</p>
                  </Link>

                  {user?.username === username ? (
                    <p onClick={() => setUpdPopup(!updPopup)}>Edit post</p>
                  ) : (
                    <p>Report post</p>
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
            {updPopup && <UpdPostModal post={post} setUpdPopup={setUpdPopup} />}
          </div>

          {reactorsPopup && reactedUsers.length > 0 && (
            <ReactorsPopup
              users={reactedUsers}
              loading={loading}
              setReactorsPopup={setReactorsPopup}
            />
          )}

          <div className={styles.post_detail}>
            {post.postimage && (
              <Image
                src={post.postimage}
                alt="noimg"
                height={400}
                width={700}
                layout="responsive"
              />
            )}

            <div className={styles.post_text}>
              <p>{text}</p>
            </div>

            <div className={styles.post_like_cmnt}>
              <div className={styles.post_like_line}></div>
              <div className={styles.like_cmnt_count}>
                <p onClick={() => handleLikePopup(_id)}>
                  <span
                    className={
                      liked ? `${styles.like_animation}` : `${styles.like}`
                    }
                  >
                    {likeCount}
                  </span>{" "}
                  {likeCount > 1 ? "likes" : "like"}
                </p>
                <p>{cmntCount} comments</p>
              </div>
              <div className={styles.post_like_line}></div>

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
              <div className={styles.post_like_line}></div>
            </div>
          </div>
        </div>

        <div className={styles.popular_post_sec}>
          <h3>Other posts of {username}</h3>

          {posts
            .filter((item) => item._id !== post._id)
            .map((post) => {
              return (
                <Link
                  href={post._id}
                  key={post._id}
                  style={{ textDecoration: "none" }}
                >
                  <OtherPosts post={post} />
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SinglePost;

export const getServerSideProps: GetServerSideProps<PostProp> = async (
  context
) => {
  const postId = context.query.postid;

  const res = await axios.get(`https://sociatek-api.onrender.com/api/post/${postId}`);
  const data = await res.data.message;

  // Get the username from the fetched post data
  const username = data?.username;

  // fetch other posts of the user
  const res2 = await axios.get(
    `https://sociatek-api.onrender.com/api/posts/all?user=${username}`
  );
  const data2 = await res2.data.message;

  // Randomly select 5 posts
  const randomPosts = getRandomPosts(data2, 4);

  return {
    props: {
      post: data,
      posts: randomPosts,
    },
  };
};

// Utility function to get random posts
const getRandomPosts = (posts: Post[], count: number): Post[] => {
  const shuffled = posts.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};
