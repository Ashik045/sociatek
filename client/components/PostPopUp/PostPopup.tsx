import { Context } from "Context/Context";
import Image from "next/image";
import { useContext, useState } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./postpopup.module.scss";

type PopupProps = {
  setPostPopup: React.Dispatch<React.SetStateAction<boolean>>;
};

const PostPopup = ({ setPostPopup }: PopupProps) => {
  const [postText, setPostText] = useState("");
  const [postImg, setPostImg] = useState<string | null>(null);
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

  const handleForm = (e: any) => {
    e.preventDefault();

    try {
      const formInputs = {
        postText: postText,
        postImg: postImg,
      };

      console.log(formInputs);
    } catch (error) {
      console.log(error);
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
            ></textarea>

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

              <input type="submit" value="Post" className={styles.submit_btn} />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostPopup;
