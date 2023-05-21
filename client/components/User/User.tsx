import Image from "next/image";
import Link from "next/link";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { User } from "types.global";
import noPhoto from "../../images/no-photo.png";
import styles from "./user.module.scss";

type UserProp = {
  user: User;
};

const User: React.FC<UserProp> = ({ user }) => {
  return (
    <div className={styles.user}>
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
            // onClick={() => setFollow(true)}
            className={styles.followed_btn}
          />
        ) : (
          <FaUserPlus
            // onClick={() => setFollow(true)}
            className={styles.follow_btn}
          />
        )}
      </span>
    </div>
  );
};

export default User;
