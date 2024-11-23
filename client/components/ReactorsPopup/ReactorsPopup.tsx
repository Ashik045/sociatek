import UserDiv from "components/UserDiv/UserDiv";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { User } from "types.global";
import styles from "./reactorspopup.module.scss";

interface ReactorsProps {
  users: User[];
  setReactorsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  visitor?: boolean;
  userId?: string;
}

const ReactorsPopup = ({
  users,
  setReactorsPopup,
  loading,
  visitor,
  userId,
}: ReactorsProps) => {
  console.log("ReactorsPopup is rendering...");
  console.log("userId in ReactorsPopup:", userId); // Log userId here

  // close the popup
  const handleClose = () => {
    setReactorsPopup(false);
  };

  return (
    <div className={styles.reactors_popup}>
      <div className={styles.reactors_popup_m}>
        <span onClick={handleClose} className={styles.close_popup}>
          <FaTimes />
        </span>

        <div className={styles.popup_users}>
          <h3>{visitor ? "Profile Visitors" : "Reactions"} </h3>

          {loading ? (
            <div className={styles.loader_div}>
              <span className={styles.loader}></span>
            </div>
          ) : (
            <UserDiv users={users} userId={userId} />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactorsPopup;
