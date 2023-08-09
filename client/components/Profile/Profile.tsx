import { Context } from "Context/Context";
import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { MdGroupAdd, MdGroupRemove } from "react-icons/md";
import noCover from "../../images/no-image-available-icon-6.png";
import noPhoto from "../../images/no-photo.png";
import styles from "./profile.module.scss";

const Profile = () => {
  // const [user, setUser] = useState<null | User>(null);

  const { user } = useContext(Context);

  return (
    <div className={styles.profile_component}>
      <div className={styles.profile_owner}>
        <div suppressHydrationWarning>
          <Image
            src={user?.coverPhoto ? user?.coverPhoto : noCover}
            alt="sociatek cover img"
            height={90}
            width={300}
            className={styles.profile_cover}
          />
        </div>

        <div suppressHydrationWarning>
          <Link href={`/user/${user?.username}`}>
            <Image
              src={user?.profilePicture ? user?.profilePicture : noPhoto}
              height={80}
              width={80}
              alt="sociatek user img"
              className={styles.profile_pic}
            />
          </Link>
        </div>

        <div className={styles.owner_details}>
          <Link
            href={`/user/${user?.username}`}
            style={{ textDecoration: "none" }}
          >
            <h3>{user?.fullname}</h3>
          </Link>
          <p>{user?.about}</p>
          <p>{user?.location}</p>

          <div className={styles.user_activities}>
            <div className={styles.follow_sec}>
              <FaThumbsUp className={styles.user_act_icon} size={16} />
              <span>{user?.activities?.length}</span>
            </div>
            <div className={styles.follow_sec}>
              <MdGroupAdd className={styles.user_act_icon} />
              <span>{user?.followers?.length}</span>
            </div>
            <div className={styles.follow_sec}>
              <MdGroupRemove className={styles.user_act_icon} />
              <span>{user?.following?.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
