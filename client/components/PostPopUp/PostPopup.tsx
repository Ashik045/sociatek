import { Context } from "Context/Context";
import axios from "axios";
import Image from "next/image";
import { useContext, useState } from "react";
import { FaImage, FaTimes } from "react-icons/fa";
import styles from "./postpopup.module.scss";

type PopupProps = {
  setPostPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostPopup = ({ setPostPopup }: PopupProps) => {
  const [postText, setPostText] = useState("");
  const [postImg, setPostImg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const { user } = useContext(Context);

  const handleClose = () => {
    setPostPopup(false);
  };

  // handle the profile picture
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
    setLoading(true);

    try {
      let postImage = "";
      let formInputs = {};

      // show error if input field is empty
      if (postText === "") {
        setErrorMessage(true);
      }

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

      formInputs = {
        postText: postText,
        postImg: postImage,
      };

      // send the form data to the server
      console.log(formInputs);
      setLoading(false);
      setPostPopup(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setPostPopup(false);
    }
  };

  return (
    <div className={styles.post_popup}>
      <span onClick={handleClose} className={styles.close_popup}>
        <FaTimes />
      </span>

      <div className={styles.post_popup_main}>
        <h3>
          Posting by <span>{user?.username}</span>{" "}
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
      </div>
    </div>
  );
};

export default PostPopup;
