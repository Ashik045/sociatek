import Image from "next/image";
import Link from "next/link";
import { User } from "types.global";
import noPhoto from "../../images/no-photo.png";
import styles from "./profileVisitors.module.scss";

type ProfileVisitorProp = {
  visitors: User[];
};

const ProfileVisitors = ({ visitors }: ProfileVisitorProp) => {
  //
  return (
    <div className={styles.profile_visitors}>
      {/* The code block `{visitors.length <= 0 ? ... : ...}` is a conditional statement that checks if
      the `visitors` array is empty or not.  */}
      {visitors.length <= 0 ? (
        <p className={styles.no_profile_visitor}>
          This profile has not been visited by anyone.
        </p>
      ) : (
        visitors.slice(0, 4).map((visitor) => {
          return (
            <div className={styles.profile_visitor} key={visitor._id}>
              <Link href={`/user/${visitor?.username}`}>
                <Image
                  src={
                    visitor.profilePicture ? visitor.profilePicture : noPhoto
                  }
                  height={38}
                  width={38}
                  alt="sociatek user"
                  className={styles.user_profile_pic}
                />
              </Link>

              <div className={styles.user_uname}>
                <Link
                  href={`/user/${visitor?.username}`}
                  style={{ textDecoration: "none" }}
                >
                  <p className={styles.user_username}>{visitor.username}</p>
                </Link>
                <p className={styles.user_txt}>{visitor.about}</p>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ProfileVisitors;
