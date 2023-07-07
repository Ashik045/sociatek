import { Context } from "Context/Context";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import { Post } from "types.global";
import styles from "./updpostmodal.module.scss";

interface PostUpdProp {
  post: Post;
  setUpdPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdPostModal = ({ post, setUpdPopup }: PostUpdProp) => {
  const [postText, setPostText] = useState(post.text);
  const [errorMessage, setErrorMessage] = useState(false);
  const [postImg, setPostImg] = useState<string | null>(post.postimage);
  const [loading, setLoading] = useState(false);
  const [uncngError, setUncngError] = useState(false);

  const { user } = useContext(Context);
  const router = useRouter();

  const handleClose = () => {
    setUpdPopup(false);
  };

  // handle the post picture
  const handlePostImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setPostImg(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    let formInputs = {};
    let postImage = "";

    try {
      setLoading(true);
      // check if there is any change in the data
      //   const hasChanged = Object.entries(data).some(([key, value]) => {
      //     return postText !== value;
      //   });

      // upload the image in cloudinary
      if (postImg) {
        const formData = new FormData();
        formData.append("file", postImg);
        formData.append("upload_preset", "uploads");

        const {
          data: { url },
        } = await axios.post(
          "https://api.cloudinary.com/v1_1/dqctmbhde/image/upload",
          formData
        );

        postImage = url;
      }

      // Compare the initial value with the current value
      if (postText === post.text) {
        setUncngError(true);
        return;
      }

      // if not changed then show error

      formInputs = {
        text: postText,
        postimage: postImage,
        username: user?.username,
        userid: user?._id,
      };

      // check if user is not authenticated
      const token = localStorage.getItem("jwtToken");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      // if everything is good then send the data to the server
      try {
        const res = await axios.put(
          `https://sociatek-api.onrender.com/api/post/${post._id}`,
          formInputs,
          config
        );

        router.push(`/post/${res.data?.message._id}`);
        setUpdPopup(false);
      } catch (error: any) {
        console.log(error?.response?.data.error);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.post_popup}>
      <span onClick={handleClose} className={styles.close_popup}>
        <FaTimes />
      </span>

      <div className={styles.post_popup_main}>
        <h3>
          Posting by <span>{post?.username}</span>{" "}
        </h3>

        <div className={styles.post_something}>
          <form onSubmit={handleForm}>
            <textarea
              name="sociatek post"
              cols={30}
              rows={10}
              placeholder="What do you want to talk about?"
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
              required
            ></textarea>
            {errorMessage && (
              <p className={styles.error_message}>Please enter some text..</p>
            )}

            <div className={styles.form_btm}>
              <div className={styles.form_btm_img}>
                <label htmlFor="image">
                  <FaImage className={styles.file_icon} />
                </label>
                <input
                  type="file"
                  name="image"
                  id="image"
                  style={{ display: "none" }}
                  onChange={handlePostImage}
                />

                {postImg && (
                  <Image
                    src={postImg}
                    width={50}
                    height={40}
                    alt="sociatek"
                    className={styles.post_img}
                  />
                )}
              </div>

              {loading ? (
                <div className={styles.loader_div}>
                  <span className={styles.loader}></span>
                </div>
              ) : (
                <input
                  type="submit"
                  value="Post"
                  className={styles.submit_btn}
                />
              )}
            </div>
          </form>
        </div>

        {uncngError && (
          <p className={styles.unchangeErr}>
            You haven&apos;t made any changes!
          </p>
        )}
      </div>
    </div>
  );
};

export default UpdPostModal;
