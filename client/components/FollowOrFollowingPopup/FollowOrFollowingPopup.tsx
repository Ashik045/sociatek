import UserDiv from "components/UserDiv/UserDiv";
import { FaTimes } from "react-icons/fa";
import { User } from "types.global";
import styles from "./FollowOrFollowingPopup.module.scss";

interface FollowOrFollowingProp {
  users: User[];
  setFollowerOrFollowingPopup: React.Dispatch<React.SetStateAction<boolean>>;
  catchFlwrOrFlwing: boolean;
  userId?: string;
}

const FollowOrFollowingPopup = ({
  users,
  setFollowerOrFollowingPopup,
  catchFlwrOrFlwing,
  userId,
}: FollowOrFollowingProp) => {
  // close the popupp
  const handleClose = () => {
    setFollowerOrFollowingPopup(false);
  };

  /**
   * The function "renderUsers" checks if there are any users and returns a message based on whether the
   * user is being followed by anyone or if they haven't followed anyone yet, otherwise it renders a
   * component with the list of users.
   * @returns The function `renderUsers` returns either a `<p>` element with the text "Currently not
   * being followed by anyone!" if `users` array is empty and `catchFlwrOrFlwing` is true, or a `<p>`
   * element with the text "Haven't followed anyone yet!" if `users` array is empty and
   * `catchFlwrOrFlwing` is false. If
   */
  const renderUsers = () => {
    if (users.length === 0) {
      if (catchFlwrOrFlwing) {
        return <p>Currently not being followed by anyone!</p>;
      } else {
        return <p>Haven&apos;t followed anyone yet!</p>;
      }
    }

    return <UserDiv users={users} userId={userId} />;
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
