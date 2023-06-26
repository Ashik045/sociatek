import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Post } from "types.global";
import styles from "./otherposts.module.scss";

type PostProp = {
  post: Post;
};

const OtherPosts = ({ post }: PostProp) => {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const calculateTimeAgo = () => {
      const now = new Date();
      const distance = formatDistanceToNow(new Date(post.createdAt), {
        addSuffix: true,
      });

      setTimeAgo(distance);
    };
    calculateTimeAgo(); // Update the time immediately

    // Update the time every minute (you can adjust the interval as needed)
    const intervalId = setInterval(calculateTimeAgo, 60000);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [post.createdAt]);

  if (timeAgo.startsWith("about ")) {
    setTimeAgo(timeAgo.slice(5));
  }

  return (
    <div className={styles.other_posts}>
      {post.postimage && (
        <Image
          src={post.postimage}
          alt="sociatek post image"
          height={60}
          width={85}
          className={styles.other_posts_img}
          // layout="responsive"
        />
      )}

      <div className={styles.other_posts_detail}>
        <p className={styles.other_post_text}>{post.text}</p>
        <p className={styles.post_date}>{timeAgo}</p>
      </div>
    </div>
  );
};

export default OtherPosts;
