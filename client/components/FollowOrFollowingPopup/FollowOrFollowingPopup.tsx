import Suggestions from "components/Suggestions/Suggestions";
import { FaTimes } from "react-icons/fa";
import { User } from "types.global";
import styles from "./FollowOrFollowingPopup.module.scss";

interface FollowOrFollowingProp {
  users: User[];
  setFollowerOrFollowingPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const FollowOrFollowingPopup = ({
  users,
  setFollowerOrFollowingPopup,
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
        <Suggestions users={users} />
      </div>
    </div>
  );
};

export default FollowOrFollowingPopup;
