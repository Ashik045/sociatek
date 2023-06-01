import { Context } from "Context/Context";
import PostPopup from "components/PostPopUp/PostPopup";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import nophoto from "../../images/no-photo.png";
import styles from "./postcomponent.module.scss";

const PostComponent = () => {
  const [postPopup, setPostPopup] = useState(false);
  const { user } = useContext(Context);
  const router = useRouter();

  const handlePopUp = () => {
    setPostPopup(true);
  };

  const handleUserLogin = () => {
    if (!user) router.push("/login");
  };

  return (
    <div className={styles.post_comp} onClick={handleUserLogin}>
      <Link href={user ? `/user/${user?.username}` : "/login"}>
        <Image
          src={user?.profilePicture ? user?.profilePicture : nophoto}
          height={40}
          width={40}
          alt="sociatek"
          className={styles.user_profile}
        />
      </Link>

      <input
        type="text"
        placeholder="What is happening?"
        onClick={handlePopUp}
      />

      {postPopup && <PostPopup setPostPopup={setPostPopup} />}
    </div>
  );
};

export default PostComponent;
