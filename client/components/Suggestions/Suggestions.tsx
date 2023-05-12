import UserDiv from "components/UserDiv/UserDiv";
import Link from "next/link";
import { useState } from "react";
import { User } from "types.global";
import styles from "./suggestions.module.scss";

interface UserProps {
  users: User[];
}

const Suggestions = ({ users }: UserProps) => {
  const [followed, setFollowed] = useState(false);

  //  ***********  add a follow request to the user profile ***********
  const setFollow = () => {
    setFollowed(true);
  };

  return (
    <div className={styles.suggestions_component}>
      <div className={styles.suggestions_component_title}>
        <h4>Suggestions for you.</h4>

        <Link href="/users">
          <button type="button" className={styles.seeall_btn}>
            Sea All
          </button>
        </Link>
      </div>

      <UserDiv users={users} setFollow={setFollow} />
    </div>
  );
};

export default Suggestions;
