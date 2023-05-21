import { Context } from "Context/Context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { User } from "types.global";
import noPhoto from "../../images/no-photo.png";
import styles from "./userdiv.module.scss";

interface UserProp {
  users: User[];
  setFollow: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserDiv = ({ users, setFollow }: UserProp) => {
  const { user } = useContext(Context);
  const router = useRouter();

  return (
    <div className={styles.suggestions_users}>
      {(router.pathname === "/"
        ? users.filter((item) => item._id !== user?._id)
        : users
      ).map((user) => {
        return (
          <div className={styles.suggestions_user} key={user._id}>
            <Link href={`/user/${user?.username}`}>
              <Image
                src={user.profilePicture ? user.profilePicture : noPhoto}
                height={38}
                width={38}
                alt="sociatek user"
                className={styles.user_profile_pic}
              />
            </Link>

            <div className={styles.user_uname}>
              <Link
                href={`/user/${user?.username}`}
                style={{ textDecoration: "none" }}
              >
                <p className={styles.user_username}>{user.username}</p>
              </Link>
              <p className={styles.user_txt}>{user.about}</p>
            </div>

            <span className={styles.follow_btns}>
              {user.followed ? (
                <FaUserCheck
                  onClick={() => setFollow(true)}
                  className={styles.followed_btn}
                />
              ) : (
                <FaUserPlus
                  onClick={() => setFollow(true)}
                  className={styles.follow_btn}
                />
              )}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default UserDiv;
