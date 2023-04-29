import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Image from "next/image";
import Link from "next/link";
// import coverImg from "../../images/no-image-available-icon-6.png";
// import userImg from "../../images/user1.jpg";
import { Context } from "Context/Context";
import { useContext } from "react";
import styles from "./profile.module.scss";

const Profile = () => {
  // const [user, setUser] = useState<null | User>(null);

  const { user } = useContext(Context);

  // useEffect(() => {
  //   const userData = localStorage.getItem("user");

  //   if (typeof window !== "undefined" && userData) {
  //     setUser(JSON.parse(userData));
  //   }
  // }, []);

  return (
    <div className={styles.profile_component}>
      <div className={styles.profile_owner}>
        <div suppressHydrationWarning>
          <Image
            src={user?.coverPhoto ? user?.coverPhoto : ""}
            alt="sociatek cover img"
            height={90}
            width={300}
            className={styles.profile_cover}
          />
        </div>

        <div suppressHydrationWarning>
          <Link href={`/user/${user?._id}`}>
            <Image
              src={user?.profilePicture ? user?.profilePicture : ""}
              height={80}
              width={80}
              alt="sociatek user img"
              className={styles.profile_pic}
            />
          </Link>
        </div>

        <div className={styles.owner_details}>
          <Link href={`/user/${user?._id}`}>
            <h3>{user?.fullname}</h3>
          </Link>
          <p>{user?.about}</p>
          <p>{user?.location}</p>

          <div className={styles.user_activities}>
            <div className={styles.follow_sec}>
              <ThumbUpAltIcon className={styles.user_act_icon} />
              <span>{user?.activities?.length}</span>
            </div>
            <div className={styles.follow_sec}>
              <GroupAddIcon className={styles.user_act_icon} />
              <span>{user?.followers?.length}</span>
            </div>
            <div className={styles.follow_sec}>
              <GroupRemoveIcon className={styles.user_act_icon} />
              <span>{user?.following?.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
