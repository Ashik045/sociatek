import GroupAddIcon from "@mui/icons-material/GroupAdd";
import GroupRemoveIcon from "@mui/icons-material/GroupRemove";
import ThumbUpAltIcon from "@mui/icons-material/ThumbUpAlt";
import Image from "next/image";
import Link from "next/link";
import coverImg from "../../images/no-image-available-icon-6.png";
import userImg from "../../images/user1.jpg";
import styles from "./profile.module.scss";

const Profile = () => {
  return (
    <div className={styles.profile_component}>
      <div className={styles.profile_owner}>
        <Image
          src={coverImg}
          height={90}
          width={300}
          alt="sociatek cover img"
          className={styles.profile_cover}
        />
        <Link href="/profile">
          <Image
            src={userImg}
            height={80}
            width={80}
            alt="sociatek user img"
            className={styles.profile_pic}
          />
        </Link>

        <div className={styles.owner_details}>
          <h3>User 1</h3>
          <p>Front end developer | MERN stack developer</p>

          <div className={styles.user_activities}>
            <p>
              <ThumbUpAltIcon className={styles.user_act_icon} /> 22
            </p>
            <p>
              <GroupAddIcon className={styles.user_act_icon} /> 109
            </p>
            <p>
              <GroupRemoveIcon className={styles.user_act_icon} /> 13
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
