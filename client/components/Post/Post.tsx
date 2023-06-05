import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import styles from "./post.module.scss";

import Image from "next/image";
import { useEffect, useState } from "react";

type PostsItems = {
  postItems: {
    _id: string;
    categories: string[];
    username: string;
    userid: string;
    text: string;
    postimage: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

const Post = ({ postItems }: PostsItems) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const updateTimeAgo = () => {
      setTimeAgo(
        formatDistanceToNow(new Date(postItems.createdAt), { addSuffix: true })
      );
    };

    // Update the time every minute (you can adjust the interval as needed)
    const intervalId = setInterval(updateTimeAgo, 60000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [postItems.createdAt]);

  return (
    <div className={styles.post_comp}>
      <div className={styles.post_info}>
        <div className={styles.post_cat}>
          <p className={styles.username}>
            Posted by:
            <Link
              href={`/users/?user=${postItems.username}`}
              style={{ color: "#16213E" }}
            >
              <span> {postItems.username}</span>
            </Link>
          </p>

          <p className={styles.post_date}>
            <i>{timeAgo}</i>
          </p>
        </div>

        <p className={styles.post_text}>{postItems.text}</p>
      </div>

      {postItems.postimage && (
        <Link href={`/post/${postItems._id}`} className={styles.post_title}>
          <Image
            src={postItems.postimage && postItems.postimage}
            alt="Blog image"
            width={500}
            height={300}
            className={styles.post_image}
            objectFit="cover"
            layout="responsive"
          />
        </Link>
      )}
    </div>
  );
};

export default Post;
