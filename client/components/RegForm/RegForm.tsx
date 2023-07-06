import { useEffect, useRef, useState } from "react";

import axios, { AxiosError } from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
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
  location: string;
  facebook: string;
  profession: string;
};

type PageProp = {
  page: number;
  setPage(value: number): void;
  loading: boolean;
  setLoading(value: boolean): void;
};

const RegForm = ({ page, setPage, loading, setLoading }: PageProp) => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [coverImg, setCoverImg] = useState<File | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const router = useRouter();

  console.log("Errors:", errorMessages);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors, touchedFields, isValid },
    watch,
    reset,
    trigger,
  } = useForm<Inputs>();
  const [isFormValid, setIsFormValid] = useState<boolean>(isValid);
  useEffect(() => {
    setIsFormValid(isValid);
  }, [isValid]);

  console.log(isFormValid);

  const password = watch("password", "");

  // handle the profile picture
  const handleProfilePictureChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePic(e.target.files[0]);
    }
  };

  // handle the cover photo
  const handleCoverPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCoverImg(e.target.files[0]);
    }
  };

  const onSubmit = async (data: Inputs) => {
    setLoading(true);
    const { confirmPassword, ...others } = data;

    if (isValid) {
      // Perform form submission
      console.log("Form submitted:", data);
    } else {
      console.log("Form is not valid. Please fill in all required fields.");
    }

    try {
      let profilePicture = "";
      let coverPhoto = "";
      let newUser = {};

      // Upload profile picture and cover photo code...

      newUser = {
        ...others,
        profilePicture: profilePicture,
        coverPhoto: coverPhoto,
      };

      try {
        const response = await axios.post(
          "http://localhost:4000/api/auth/signup",
          newUser
        );
        console.log(response.data.message);
        setLoading(false);

        reset();
        if (response.data.message) {
          router.push("/login");
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const axiosError = error as AxiosError;
          if (
            axiosError.response &&
            axiosError.response.data &&
            axiosError.response.data.errors
          ) {
            const { errors } = axiosError.response.data;
            console.log(errors);
            setErrorMessages(errors);
          }
        }

        setLoading(false);
        reset({ ...others });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const fullnameRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fullnameRef.current) {
      fullnameRef.current.focus();
    }
  }, []);

  const PageTitle = [
    "Email & Pass",
    "Fullname, Username & Bio",
    "Phone, Facebook & Profession",
  ];

  return (
    <div className={styles.form_container}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.upload_imgs}>
          <div className={styles.form_inp_profile_pic}>
            <Image
              src={profilePic ? URL.createObjectURL(profilePic) : noImage}
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
              onChange={handleProfilePictureChange}
              // onChange={(e) => setProfilePicture(e.target.files?.[0])}
            />
          </div>

          <div className={styles.form_inp_profile_cover}>
            <Image
              src={coverImg ? URL.createObjectURL(coverImg) : noCoverImage}
              alt="upload image"
              width={200}
              height={80}
              className={styles.cover_img}
            />
            <label htmlFor="file2">
              Profile Cover:{" "}
              <MdDriveFolderUpload className={styles.file_icon} />
            </label>

            <input
              type="file"
              name="file"
              id="file2"
              style={{ display: "none" }}
              onChange={handleCoverPhotoChange}
            />
          </div>
        </div>

        <div className={styles.form_header}>
          <h3>{PageTitle[page]}</h3>
        </div>

        <div className={styles.form_body}>
          {/* Email, username & Pass section */}
          {page === 2 && (
            <>
              <input
                {...register("username", {
                  required: "Username should be 3-15 characters!",
                  minLength: {
                    value: 3,
                    message: "Minimum length is 3 characters!",
                  },
                  maxLength: {
                    value: 15,
                    message: "Maximum length is 15 characters!",
                  },
                })}
                placeholder="Username*"
                onBlur={() => {
                  trigger("username");
                }}
                className={styles.exact_form_inp}
              />
              <span className={styles.form_err}>
                {touchedFields.username && formErrors?.username?.message}
              </span>

              <input
                {...register("email", {
                  required: "Email is required!",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Email*"
                onBlur={() => {
                  trigger("email");
                }}
                className={styles.exact_form_inp}
              />
              {/* error message */}
              <span className={styles.form_err}>
                {formErrors?.email?.message}
              </span>

              <input
                type="password"
                {...register("password", {
                  required:
                    "Password should be at least 6 characters & should contain at least 1 lowercase, 1 upper case, 1 number & 1 symbol!",
                  pattern: {
                    value:
                      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+|~\-=`{}[\]:;<>?,.@#])[a-zA-Z\d!@#$%^&*()_+|~\-=`{}[\]:;<>?,.@#]{6,}$/,
                    message:
                      "Provide at least 6 characters & should contain at least 1 lowercase, 1 upper case, 1 number & 1 symbol!",
                  },
                  minLength: {
                    value: 6,
                    message: "Minimum length is 6 characters!",
                  },
                })}
                placeholder="Password*"
                onBlur={() => {
                  trigger("password");
                }}
                className={styles.exact_form_inp}
              />
              <span className={styles.form_err}>
                {formErrors?.password?.message}
              </span>

              <input
                type="password"
                {...register("confirmPassword", {
                  required: "Password doesn't matched!",
                  validate: (value) =>
                    value === password || "Password doesn't matched!",
                })}
                placeholder="Re-enter your password*"
                onBlur={() => {
                  trigger("confirmPassword");
                }}
                className={styles.exact_form_inp}
              />
              <span className={styles.form_err}>
                {formErrors?.confirmPassword?.message}
              </span>
            </>
          )}

          {/* Fullname, Phone & Bio section */}
          {page === 0 && (
            <>
              <input
                {...register("fullname", {
                  required: "Fullname is required!",
                  minLength: {
                    value: 3,
                    message: "Minimum length is 3 characters!",
                  },
                  maxLength: {
                    value: 20,
                    message: "Maximum length is 25 characters!",
                  },
                })}
                placeholder="Fullname*"
                onBlur={() => {
                  trigger("fullname");
                }}
                className={styles.exact_form_inp}
                // ref={(el) => {
                //   fullnameRef.current = el;
                // }}
              />
              {/* error message */}
              <span className={styles.form_err}>
                {formErrors?.fullname?.message}
              </span>

              <textarea
                {...register("about", {
                  required: "About field is required!!",
                  minLength: {
                    value: 10,
                    message: "Minimum length is 10 characters!",
                  },
                  maxLength: {
                    value: 400,
                    message: "Maximum length is 400 characters!",
                  },
                })}
                placeholder="About yourself*"
                onBlur={() => {
                  trigger("about");
                }}
                className={styles.textarea}
                rows={3}
                cols={70}
                required
              />
              {/* error message */}
              <span className={styles.form_err}>
                {formErrors?.about?.message}
              </span>

              <input
                {...register("phone", {
                  required: "Phone is required!",
                  pattern: {
                    value: /^[\d+]+$/,
                    message: "Invalid phone number!",
                  },
                })}
                placeholder="Phone Number"
                onBlur={() => {
                  trigger("phone");
                }}
                className={styles.exact_form_inp}
              />
              <span className={styles.form_err}>
                {formErrors?.phone?.message}
              </span>
            </>
          )}

          {/* Facebook & Profession */}
          {page === 1 && (
            <>
              <input
                {...register("location", {
                  required: "Location is required!",
                })}
                placeholder="Location*"
                onBlur={() => {
                  trigger("location");
                }}
                className={styles.exact_form_inp}
              />
              <span className={styles.form_err}>
                {formErrors?.location?.message}
              </span>
              <input
                {...register("facebook", {
                  required: false,
                })}
                placeholder="Facebook account link"
                className={styles.exact_form_inp}
              />
              <span className={styles.form_err}>
                {formErrors?.facebook?.message}
              </span>

              <label className={styles.form_profession}>
                <b>Profession:</b>
                <input
                  type="radio"
                  value="student"
                  {...register("profession", {
                    required: "Profession is required!",
                  })}
                />{" "}
                Student
                <input
                  type="radio"
                  value="worker"
                  {...register("profession", {
                    required: "Profession is required!",
                  })}
                />{" "}
                Worker
              </label>
              <span className={styles.form_err}>
                {formErrors?.profession?.message}
              </span>
            </>
          )}
        </div>

        <div className={styles.form_footer}>
          {page !== 0 && (
            <span
              className={styles.form_btns}
              style={{ marginRight: "3px" }}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </span>
          )}
          {page !== PageTitle.length - 1 && (
            <span
              className={styles.form_btns}
              style={{ marginLeft: "3px" }}
              onClick={() => setPage(page + 1)}
            >
              Next
            </span>
          )}
        </div>

        {page === 2 && (
          <input
            type="submit"
            value={loading ? "Loading..." : "Submit"}
            className={styles.submit_btn}
            style={{
              cursor: loading || !isFormValid ? "not-allowed" : "pointer",
            }}
            disabled={!isFormValid}
          />
        )}

        <p style={{ marginTop: "15px" }}>
          <Link href="/login" style={{ color: "black" }}>
            {" "}
            Already have an account? Log in here..
          </Link>
        </p>

        {Object.keys(formErrors).length > 0 && (
          <div className={styles.form_errorss}>
            {Object.values(formErrors).map((error, index) => (
              <p key={index} className={styles.f_error}>
                {error.message}
              </p>
            ))}
          </div>
        )}

        {(formErrors.fullname ||
          formErrors.about ||
          formErrors.location ||
          formErrors.username ||
          formErrors.email ||
          formErrors.password) &&
          !isFormValid && (
            <p className={styles.required_error}>
              Please fill all the required* fields.
            </p>
          )}
      </form>

      {/* not working */}
      {errorMessages.map((errorMessage, index) => (
        <p key={index}>{errorMessage}</p>
      ))}
    </div>
  );
};

export default RegForm;
