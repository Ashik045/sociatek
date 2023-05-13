import UserDiv from "components/UserDiv/UserDiv";
import { FaTimes } from "react-icons/fa";
import { User } from "types.global";
import styles from "./FollowOrFollowingPopup.module.scss";

interface FollowOrFollowingProp {
  users: User[];
  setFollowerOrFollowingPopup: React.Dispatch<React.SetStateAction<boolean>>;
  setFollow: React.Dispatch<React.SetStateAction<boolean>>;
  followersList: User[];
}

const FollowOrFollowingPopup = ({
  users,
  setFollowerOrFollowingPopup,
  setFollow,
  followersList,
}: FollowOrFollowingProp) => {
  // close the popup
  const handleClose = () => {
    setFollowerOrFollowingPopup(false);
  };
  return (
    <div className={styles.popup}>
      <span onClick={handleClose} className={styles.close_popup}>
        <FaTimes />
      </span>
      <div className={styles.popup_main}>
        <div className={styles.popup_users}>
          <h3>{followersList.length > 0 ? "Followers " : "Following"} </h3>
          <UserDiv users={users} setFollow={setFollow} />
        </div>
      </div>
    </div>
  );
};

export default FollowOrFollowingPopup;
