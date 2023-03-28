import axios from "axios";
import Navbar from "components/Navbar/Navbar";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BiTrash } from "react-icons/bi";
import { MdBorderColor } from "react-icons/md";
import Skeleton from "react-loading-skeleton";
import { SinglePostProp } from "types.global";
import postt from "../../../images/no-image-available-icon-6.png";

import styles from "../../styles/singlepost.module.scss";

const SinglePost = ({ post }: SinglePostProp) => {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [updMode, setUpdMode] = useState(false);
  const [user, setUser] = useState(false);
  // update functionalities

  return (
    <div className={styles.singlePost}>
      <Navbar />
      <div className={styles.singlePost_main}>
        <div className={styles.singlePost_detail}>
          {loading ? (
            <>
              <Skeleton height={500} />
              <Skeleton height={70} />
              <Skeleton count={5} />
            </>
          ) : (
            <>
              {post.photo ? (
                <Image src={post.photo} alt="noimg" height={400} width={700} />
              ) : (
                <Image
                  src={postt}
                  alt="sociatek image"
                  height={400}
                  width={700}
                />
              )}

              <div className={styles.title_updel}>
                {updMode ? (
                  <input
                    className={styles.post_title_inp}
                    type="text"
                    value={post.title}
                    // eslint-disable-next-line jsx-a11y/no-autofocus
                    autoFocus
                    onChange={(e) => setTitle(e.target.value)}
                  />
                ) : (
                  <h3 className={styles.post_title}>{post.title}</h3>
                )}

                {post.username === "ashik00" && (
                  <div className={styles.updel}>
                    {!updMode && (
                      <MdBorderColor
                        // onClick={updatePost}
                        size={26}
                        color="#182747"
                        style={{ cursor: "pointer" }}
                        className={styles.updel_btnn}
                        onClick={() => setUpdMode(true)}
                      />
                    )}
                    <BiTrash
                      size={26}
                      color="#E94560"
                      style={{ marginLeft: "20px", cursor: "pointer" }}
                      className={styles.updel_btnn}
                    />
                  </div>
                )}
              </div>
              <div className={styles.post_text}>
                <p>
                  Author:{" "}
                  <Link
                    href={`/users/?user=${post.username}`}
                    className={styles.authorName}
                  >
                    <b>{post.username}</b>
                  </Link>{" "}
                  <i className={styles.text_muted}>
                    <small style={{ marginLeft: "20px", fontSize: "14px" }}>
                      {new Date(post.createdAt).toDateString()}
                    </small>
                  </i>
                </p>

                {updMode ? (
                  <textarea
                    rows={8}
                    typeof="text"
                    value={post.desc}
                    // onChange={(e) => setDesc(e.target.value)}
                    className={styles.textDesc_inp}
                  />
                ) : (
                  <p className={styles.textDesc}>
                    {post.desc || <Skeleton count={6} />}
                  </p>
                )}

                {updMode && (
                  <button
                    type="submit"
                    // onClick={handleUpdate}
                    style={{
                      cursor: loading ? "not-allowed" : "pointer",
                      position: "relative",
                    }}
                    className={styles.update_post}
                  >
                    Update Post
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className={styles.popular_post_sec}>
          {/* <h4 style={{ color: '#ff577ec5', letterSpacing: '2px' }}>MOST POPULAR</h4>
                {loading ? (
                    <>
                        <Skeleton height={100} style={{ marginBottom: '15px' }} />
                        <Skeleton height={100} style={{ marginBottom: '15px' }} />
                        <Skeleton height={100} style={{ marginBottom: '15px' }} />
                    </>
                ) : (
                    popularPost
                        .filter((item) => item._id !== post._id)
                        .slice(0, 3)
                        .map((popularpost) => (
                            <PopularPost key={popularpost._id} post={popularpost} />
                        ))
                )} */}
          <h3>Popular Posts / Recent Users</h3>
        </div>
      </div>
    </div>
  );
};

export default SinglePost;

export const getServerSideProps: GetServerSideProps<SinglePostProp> = async (
  context
) => {
  const postId = context.query.postid;

  const res = await axios.get(
    `https://weblog-backend.onrender.com/api/posts/${postId}`
  );
  const data = await res.data.message;

  return {
    props: {
      post: data,
    },
  };
};
