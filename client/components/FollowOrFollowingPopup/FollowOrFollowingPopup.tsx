import UserDiv from "components/UserDiv/UserDiv";
import { FaTimes } from "react-icons/fa";
import { User } from "types.global";
import styles from "./FollowOrFollowingPopup.module.scss";

interface FollowOrFollowingProp {
  users: User[];
  setFollowerOrFollowingPopup: React.Dispatch<React.SetStateAction<boolean>>;
  catchFlwrOrFlwing: boolean;
}

const FollowOrFollowingPopup = ({
  users,
  setFollowerOrFollowingPopup,
  catchFlwrOrFlwing,
}: FollowOrFollowingProp) => {
  // close the popup
  const handleClose = () => {
    setFollowerOrFollowingPopup(false);
  };

  const renderUsers = () => {
    if (users.length === 0) {
      if (catchFlwrOrFlwing) {
        return <p>Currently not being followed by anyone!</p>;
      } else {
        return <p>Haven&apos;t followed anyone yet!</p>;
      }
    }

    return <UserDiv users={users} />;
  };

  return (
    <div className={styles.popup}>
      <span onClick={handleClose} className={styles.close_popup}>
        <FaTimes />
      </span>
      <div className={styles.popup_main}>
        <div className={styles.popup_users}>
          <h3>{catchFlwrOrFlwing ? "Followers" : "Following"}</h3>
          {renderUsers()}
        </div>
      </div>
    </div>
  );
};

export default FollowOrFollowingPopup;
