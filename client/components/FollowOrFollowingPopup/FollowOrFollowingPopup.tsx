import { FaTimes } from "react-icons/fa";
import styles from "./FollowOrFollowingPopup.module.scss";

interface FollowOrFollowingProp {
  users: string[];
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
        <p>followers | following</p>
      </div>
    </div>
  );
};

export default FollowOrFollowingPopup;
