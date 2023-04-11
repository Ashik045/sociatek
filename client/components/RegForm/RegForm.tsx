import { useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { MdDriveFolderUpload } from "react-icons/md";
import noImage from "../../images/no-image-available-icon-6.png";
import noCoverImage from "../../images/no-photo.png";
import styles from "./regform.module.scss";

type Inputs = {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
  fullname: string;
  about: string;
  phone: string;
  facebook: string;
  profession: string;
};

const RegForm: React.FC = () => {
  const [photo, setPhoto] = useState(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<Inputs>();

  const password = watch("password", "");

  const onSubmit = (data: Inputs) => {
    const { confirmPassword, ...others } = data;
    const userInfo = {
      ...others,
      profilePicture: "https://www.google.com",
      coverPhoto: "https://www.google.com",
    };

    console.log(userInfo);
  };

  const PageTitle = [
    "Email & Pass",
    "Fullname, Username & Bio",
    "Social Links",
  ];

  return (
    <div className={styles.form_container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.upload_imgs}>
          <div className={styles.form_inp_profile_pic}>
            <Image
              src={photo ? URL.createObjectURL(photo) : noImage}
              alt="upload image"
              width={85}
              height={85}
              className={styles.img}
            />
            <label htmlFor="file">
              Profile Image:{" "}
              <MdDriveFolderUpload className={styles.file_icon} />
            </label>

            <input
              type="file"
              name="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setPhoto(e.target.files?.[0])}
            />
          </div>

          <div className={styles.form_inp_profile_cover}>
            <Image
              src={photo ? URL.createObjectURL(photo) : noCoverImage}
              alt="upload image"
              width={200}
              height={80}
              className={styles.cover_img}
            />
            <label htmlFor="file">
              Profile Cover:{" "}
              <MdDriveFolderUpload className={styles.file_icon} />
            </label>

            <input
              type="file"
              name="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setPhoto(e.target.files?.[0])}
            />
          </div>
        </div>

        <div className={styles.form_header}>
          <h3>{PageTitle[page]}</h3>
        </div>

        <div className={styles.form_body}>
          {page === 0 && (
            <>
              <input
                {...register("email", {
                  required: "Email is required!",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Email"
                onBlur={() => {
                  trigger("email");
                }}
                className={styles.exact_form_inp}
              />
              {/* {errors.email && <span>{errors.email.message}</span>} */}
              <span className={styles.form_err}>{errors.email?.message}</span>

              <input
                type="password"
                {...register("password", {
                  required:
                    "Password should be at least 8 characters & should contain at least 1 lowercase, 1 upper case, 1 number & 1 symbol!",
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+|~\-=`{}[\]:;<>?,.@#])[a-zA-Z\d!@#$%^&*()_+|~\-=`{}[\]:;<>?,.@#]{8,}$/,
                    message: "Provide a strong password. Ex: #$As@34jhW@&",
                  },
                })}
                placeholder="Password"
                onBlur={() => {
                  trigger("password");
                }}
                className={styles.exact_form_inp}
              />
              <span className={styles.form_err}>
                {errors.password?.message}
              </span>

              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Password doesn't matched!",
                  validate: (value) =>
                    value === password || "Password doesn't matched!",
                })}
                placeholder="Re-enter your password"
                onBlur={() => {
                  trigger("confirmPassword");
                }}
                className={styles.exact_form_inp}
              />
              <span className={styles.form_err}>
                {errors.confirmPassword?.message}
              </span>
            </>
          )}
          {page === 1 && (
            <>
              <input
                {...register("username", {
                  required: "This field is required",
                })}
                placeholder="username"
                onBlur={() => {
                  trigger("username");
                }}
              />
              {errors.username && <span>{errors.username.message}</span>}
            </>
          )}
          {page === 2 && (
            <>
              <input
                {...register("phone", {
                  required: "This field is required",
                  pattern: {
                    value: /^[\d+]+$/,
                    message: "Invalid phone number",
                  },
                })}
                placeholder="phone"
                onBlur={() => {
                  trigger("phone");
                }}
              />
              {errors.phone && <span>{errors.phone.message}</span>}
            </>
          )}
        </div>

        <div className={styles.form_footer}>
          {page !== 0 && (
            <span
              className={styles.form_btns}
              style={{ marginRight: "3px" }}
              onClick={() => setPage((curr) => curr - 1)}
            >
              Prev
            </span>
          )}
          {page !== PageTitle.length - 1 && (
            <span
              className={styles.form_btns}
              style={{ marginLeft: "3px" }}
              onClick={() => setPage((curr) => curr + 1)}
            >
              Next
            </span>
          )}
        </div>

        {error && (
          <p style={{ color: "red", marginBottom: "-5px" }}>
            Registration failed!
          </p>
        )}
        {page === 2 && (
          <input
            type="submit"
            value={loading ? "Loading..." : "Submit"}
            className={styles.submit_btn}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          />
        )}
        <p style={{ marginTop: "10px" }}>
          <Link href="/login"> Already have an account? Log in here..</Link>
        </p>
      </form>
    </div>
  );
};

export default RegForm;
