import styles from "./post.module.scss";

type PostsItems = {
  items: {
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

const Post = ({ items }: PostsItems) => {
  // console.log(data);

  return <div className={styles.post_comp}>{items?.title}</div>;
};

export default Post;
