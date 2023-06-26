import { Context } from "Context/Context";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { User } from "types.global";
import noPhoto from "../../images/no-photo.png";
import styles from "./userdiv.module.scss";

interface UserProp {
  users: User[];
}

const UserDiv = ({ users }: UserProp) => {
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, dispatch } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    console.log("user");
  }, [user]);

  // follow or unfollow a user
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

        setFollowed(false);
        setLoading(true);

        // send an unfollow request to the user
        if (!loading) {
          const response = await axios.post(
            `http://localhost:4000/api/user/unfollow/${userId}`,
            {},
            config
          );

          // if successful
          if (response && response.data) {
            setLoading(false);
            dispatch({
              type: "USER_UPDATE_SUCCESS",
              payload: response.data?.message,
            });
          }
        }
      } else {
        if (loading) return; // Do not proceed if already loading
        setFollowed(true);
        setLoading(true);

        // send a follow request to the server
        if (!loading) {
          const response = await axios.post(
            `http://localhost:4000/api/user/follow/${userId}`,
            {},
            config
          );

          // if successful
          if (response && response.data) {
            setLoading(false);
            dispatch({
              type: "USER_UPDATE_SUCCESS",
              payload: response.data?.message,
            });
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.suggestions_users}>
      {(router.pathname === "/"
        ? users.filter((item) => item._id !== user?._id)
        : users
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
              {user?.following.includes(userr._id) ? (
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
    </div>
  );
};

export default UserDiv;
