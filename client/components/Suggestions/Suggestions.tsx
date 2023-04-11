import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { User } from "types.global";
import styles from "./suggestions.module.scss";

interface UserProps {
  users: User[];
}

const Suggestions = ({ users }: UserProps) => {
  const [followed, setFollowed] = useState(false);

  //  ***********  add a follow request to the user profile ***********
  const setFollow = () => {
    setFollowed(true);
  };

  return (
    <div className={styles.suggestions_component}>
      <div className={styles.suggestions_component_title}>
        <h4>Suggestions for you.</h4>

        <Link href="/users">
          <button type="button" className={styles.seeall_btn}>
            Sea All
          </button>
        </Link>
      </div>

      <div className={styles.suggestions_users}>
        {users.map((user) => {
          return (
            <div className={styles.suggestions_user} key={user._id}>
              <Link href={`/${user._id}`}>
                <Image
                  src={user.profilePicture}
                  height={38}
                  width={38}
                  alt="sociatek user"
                  className={styles.user_profile_pic}
                />
              </Link>

              <div className={styles.user_uname}>
                <Link href={`/${user._id}`} style={{ textDecoration: "none" }}>
                  <p className={styles.user_username}>{user.username}</p>
                </Link>
                <p className={styles.user_txt}>{user.about}</p>
              </div>

              <span className={styles.follow_btns}>
                {user.followed ? (
                  <FaUserCheck
                    onClick={setFollow}
                    className={styles.followed_btn}
                  />
                ) : (
                  <FaUserPlus
                    onClick={setFollow}
                    className={styles.follow_btn}
                  />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Suggestions;
