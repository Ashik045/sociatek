import { Context } from "Context/Context";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();

  const { user } = useContext(Context);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleClose = () => {
    setPostPopup(false);
  };

  /**
   * The function `handlePostImage` is used to handle the event of selecting a picture file and setting
   * the image as the post image.
   * @param e - React.ChangeEvent<HTMLInputElement>
   */
  const handlePostImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setPostImg(reader.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  /**
   * The handleForm function is responsible for handling form submission, including uploading an image
   * to Cloudinary, checking if the input field is empty, and sending the form data to the server.
   * @param e - The parameter `e` is of type `React.FormEvent`. It represents the form event that is
   * triggered when the form is submitted.
   * @returns nothing.
   */
  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // If loading is true, return immediately to prevent multiple requests
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      let postImage = "";
      let formInputs = {};

      // show error if input field is empty
      if (postText === "") {
        setErrorMessage(true);
        setLoading(false); // Set loading to false to enable submitting again
        return;
      }

      // upload the image to Cloudinary
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

      /* The `formInputs` object is created to store the form data that will be sent to the server. It
      includes the following properties: */
      formInputs = {
        text: postText,
        postimage: postImage,
        username: user?.username,
        userid: user?._id,
      };

      // check if user is authenticated
      const token = localStorage.getItem("jwtToken");

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/post/create`,
          formInputs,
          config
        );

        router.push("/");
      } catch (error) {
        console.log(error);
      }

      // send the form data to the server
      setLoading(false);
      setPostPopup(false);
    } catch (error) {
      console.error(error);
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
              ref={textareaRef}
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
