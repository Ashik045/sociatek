import { Context } from "Context/Context";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import InfiniteScroll from "react-infinite-scroll-component";
import { User } from "types.global";
import noPhoto from "../../images/no-photo.png";
import styles from "./userdiv.module.scss";

interface UserProp {
  users: User[];
  userNav?: string;
  setFollow?: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDiv = ({ users, userNav }: UserProp) => {
  const [allUsers, setAllUsers] = useState(users);
  const [hasMore, setHasMore] = useState(true);
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, dispatch } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    setAllUsers(users);
    console.log("user");
  }, [user, users]);

  /**
   * The function fetches more data from an API based on the last post ID and updates the state with the
   * new posts.
   */
  const fetchMoreData = async () => {
    try {
      const lastPost = allUsers[allUsers.length - 1]; // Get the last post in the current list

      // Fetch more data from the API using the _id of the last post
      if (userNav === "allusers") {
        const res = await axios.get(
          `https://sociatek.onrender.com/api/users/all?limit=15&lastPostId=${lastPost._id}`
        );

        const newPosts = res.data.message;

        if (newPosts.length === 0) {
          setHasMore(false); // Stop fetching if there are no more posts
        } else {
          // Update the state with the new posts
          setAllUsers((prevPosts) => [...prevPosts, ...newPosts]);
        }
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error fetching more data:", error);
    }
  };

  /**
  * The function `handleFollow` is used to handle the follow/unfollow functionality for a user in a
  * React application, making API requests to the server and updating the user's state accordingly.
  * @param {boolean} prev - The `prev` parameter is a boolean value that represents the previous state
  * of the follow action. It indicates whether the user was previously following the specified `userId`
  * or not.
  * @param {string} userId - The `userId` parameter is a string that represents the ID of the user that
  * the follow/unfollow action is being performed on.
  
  */
  const handleFollow = async (prev: boolean, userId: string) => {
    // check if user is not authenticated
    if (!user) router.push("/login");

    const token = localStorage.getItem("jwtToken");

    try {
      dispatch({ type: "USER_UPDATE_START" });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const isFollowing = user?.following.includes(userId);
      if (isFollowing) {
        if (loading) return; // Do not proceed if already loading

        setLoading(true); // Set loading to true before making the request

        // send an unfollow request to the user
        try {
          const response = await axios.post(
            `https://sociatek.onrender.com/api/user/unfollow/${userId}`,
            {},
            config
          );

          // if successful
          if (response && response.data) {
            setLoading(false); // Set loading to false after the request is complete
            setFollowed(false);
            dispatch({
              type: "USER_UPDATE_SUCCESS",
              payload: response.data?.message,
            });
          }
        } catch (error) {
          setLoading(false); // Set loading to false if there's an error
          console.error(error);
        }
      } else {
        if (loading) return; // Do not proceed if already loading

        setLoading(true); // Set loading to true before making the request

        // send a follow request to the server
        try {
          const response = await axios.post(
            `https://sociatek.onrender.com/api/user/follow/${userId}`,
            {},
            config
          );

          // if successful
          if (response && response.data) {
            setLoading(false); // Set loading to false after the request is complete
            setFollowed(true);
            dispatch({
              type: "USER_UPDATE_SUCCESS",
              payload: response.data?.message,
            });
          }
        } catch (error) {
          setLoading(false); // Set loading to false if there's an error
          console.error(error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.suggestions_users}>
      {allUsers.length > 0 ? (
        <InfiniteScroll
          dataLength={allUsers.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={
            <div className={styles.loader_div}>
              <span className={styles.loader}></span>
            </div>
          }
        >
          {(router.pathname === "/"
            ? allUsers.filter((item) => item._id !== user?._id)
            : allUsers
          ).map((userr) => {
            return (
              <div className={styles.suggestions_user} key={userr._id}>
                <Link href={`/user/${userr?.username}`}>
                  <Image
                    src={userr.profilePicture ? userr.profilePicture : noPhoto}
                    height={38}
                    width={38}
                    alt="sociatek user"
                    className={styles.user_profile_pic}
                  />
                </Link>

                <div className={styles.user_uname}>
                  <Link
                    href={`/user/${userr?.username}`}
                    style={{ textDecoration: "none" }}
                  >
                    <p className={styles.user_username}>{userr.username}</p>
                  </Link>
                  <p className={styles.user_txt}>{userr.about}</p>
                </div>

                <span className={styles.follow_btns}>
                  {user?.following?.includes(userr._id) ? (
                    <FaUserCheck
                      onClick={() => handleFollow(false, userr._id)}
                      className={styles.followed_btn}
                      style={{ cursor: loading ? "not-allowed" : "pointer" }}
                    />
                  ) : (
                    userr._id !== user?._id && ( // remove the follow icon for the logged in user
                      <FaUserPlus
                        onClick={() => handleFollow(true, userr._id)}
                        className={styles.follow_btn}
                        style={{ cursor: loading ? "not-allowed" : "pointer" }}
                      />
                    )
                  )}
                </span>
              </div>
            );
          })}
        </InfiniteScroll>
      ) : (
        <p style={{ textAlign: "center", color: "rgba(0, 0, 0, 0.614)" }}>
          No user found!
        </p>
      )}
    </div>
  );
};

export default UserDiv;
