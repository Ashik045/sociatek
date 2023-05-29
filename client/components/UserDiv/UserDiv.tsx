import { Context } from "Context/Context";
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
  setFollow: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDiv = ({ users, setFollow }: UserProp) => {
  const [followed, setFollowed] = useState(false);
  const { user } = useContext(Context);
  const router = useRouter();
  // console.log(user);

  useEffect(() => {
    if (user && user._id) {
      const followedUserIds = user.following;
      // console.log(followedUserIds);

      const filteredUsers = users.filter((user) =>
        followedUserIds.includes(user._id)
      );

      const isFollowing = filteredUsers.length > 0;
      console.log(isFollowing);
      setFollowed(isFollowing);
    } else {
      console.log("no user!");
    }
  }, [user, users]);

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
              {userr._id !== user?._id && followed ? (
                <FaUserCheck
                  onClick={() => setFollow(true)}
                  className={styles.followed_btn}
                />
              ) : (
                userr._id !== user?._id && (
                  <FaUserPlus
                    onClick={() => setFollow(true)}
                    className={styles.follow_btn}
                  />
                )
                // )
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default UserDiv;
