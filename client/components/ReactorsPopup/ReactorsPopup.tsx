import ReactorUser from "components/ReactorUser/ReactorUser";
import React from "react";
import { FaTimes } from "react-icons/fa";
import { User } from "types.global";
import styles from "./reactorspopup.module.scss";

interface ReactorsProps {
  users: User[];
  setReactorsPopup: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
}

const ReactorsPopup = ({ users, setReactorsPopup, loading }: ReactorsProps) => {
  // close the popup
  const handleClose = () => {
    setReactorsPopup(false);
  };

  return (
    <div className={styles.reactors_popup}>
      <span onClick={handleClose} className={styles.close_popup}>
        <FaTimes />
      </span>
      <div className={styles.popup_main}>
        <div className={styles.popup_users}>
          <h3>Reactions</h3>

          {loading ? (
            <div className={styles.loader_div}>
              <span className={styles.loader}></span>
            </div>
          ) : (
            users.map((user) => {
              return <ReactorUser key={user._id} user={user} />;
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ReactorsPopup;
