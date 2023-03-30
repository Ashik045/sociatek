import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaUserCheck, FaUserPlus } from "react-icons/fa";
import { User } from "types.global";
import userProfilePic from "../../images/user2.jpg";
import styles from "./suggestions.module.scss";

interface UserProps {
  users: User[];
}

const Suggestions = () => {
  const [followed, setFollowed] = useState(false);
  // static data
  const users = [
    {
      _id: 1,
      name: "John",
      username: "john123",
      text: "Followed by Doe + others",
      profilepic: userProfilePic,
      followed: true,
    },
    {
      _id: 2,
      name: "David",
      username: "dabid03",
      text: "Followed by john + others",
      profilepic: userProfilePic,
      followed: true,
    },
    {
      _id: 3,
      name: "Marcelo",
      username: "marcelo222",
      text: "Followed by Doe Dev + others",
      profilepic: userProfilePic,
      followed: false,
    },
    {
      _id: 4,
      name: "James",
      username: "j00123",
      text: "Followed by marcelo_dev222 + others",
      profilepic: userProfilePic,
      followed: false,
    },
    {
      _id: 5,
      name: "Karen",
      username: "kj0044",
      text: "Followed by dabid03 + others",
      profilepic: userProfilePic,
      followed: false,
    },
  ];

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
                  src={user.profilepic}
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
                <p className={styles.user_txt}>{user.text}</p>
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
