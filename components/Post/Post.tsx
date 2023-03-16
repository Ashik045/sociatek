import Link from "next/link";
import styles from "./post.module.scss";

import Image from "next/image";
import postImg from "../../images/no-image-available-icon-6.png";

type PostsItems = {
  postItems: {
    _id: string;
    categories: string[];
    username: string;
    title: string;
    desc: string;
    photo: string;
    createdAt: Date;
    updatedAt: Date;
  };
};

const Post = ({ postItems }: PostsItems) => {
  return (
    <div className={styles.post_comp}>
      <Link href={`/post/${postItems._id}`} className={styles.post_title}>
        <Image
          src={postItems.photo ? postItems.photo : postImg}
          alt="Blog image"
          width={500}
          height={300}
          className={styles.post_image}
          objectFit="cover"
          layout="responsive"
        />
      </Link>

      <div className={styles.post_info}>
        <div className={styles.post_cat}>
          <p className={styles.username}>
            Author:
            <Link
              href={`/users/?user=${postItems.username}`}
              style={{ color: "#16213E" }}
            >
              <span> {postItems.username}</span>
            </Link>
          </p>

          <p className={styles.post_date}>
            <i>{new Date(postItems.createdAt).toDateString()}</i>
          </p>
        </div>

        <Link href={`/post/${postItems._id}`} className={styles.post_title}>
          {postItems.title}
        </Link>

        <p className={styles.post_text}>{postItems.desc}</p>
      </div>
    </div>
  );
};

export default Post;
