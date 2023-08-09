import Image from "next/image";
import Link from "next/link";
import noPhoto from "../../images/no-photo.png";
import styles from "./reactoruser.module.scss";

type ReactorUser = {
  user: {
    _id: string;
    username: string;
    fullname: string;
    email: string;
    password?: string;
    about: string;
    phone: string;
    location: string;
    facebook: string;
    profession: string;
    profilePicture: string;
    coverPhoto: string;
    followers: string[];
    following: string[];
    activities: string[];
    createdAt: Date;
    updatedAt: Date;
  };
};

const ReactorUser = ({ user }: ReactorUser) => {
  /* The line `const { _id, profilePicture, username, about } = user;` is using object destructuring to extract the values of the properties `_id`, `profilePicture`, `username`, and `about` from the
`user` object. */
  const { _id, profilePicture, username, about } = user;

  return (
    <div className={styles.reactor_user} key={_id}>
      <Link href={`/user/${username}`}>
        <Image
          src={profilePicture ? profilePicture : noPhoto}
          height={38}
          width={38}
          alt="sociatek user"
          className={styles.user_profile_pic}
        />
      </Link>

      <div className={styles.user_uname}>
        <Link href={`/user/${username}`} style={{ textDecoration: "none" }}>
          <p className={styles.user_username}>{username}</p>
        </Link>
        <p className={styles.user_txt}>{about}</p>
      </div>
    </div>
  );
};

export default ReactorUser;
