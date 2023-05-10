import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import { User } from "types.global";
import styles from "./updatemoda.module.scss";

type Inputs = {
  [key: string]: string;
  email: string;
  username: string;
  fullname: string;
  about: string;
  phone: string;
  location: string;
  facebook: string;
  profession: string;
};

interface PageProp {
  user: User;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdateModal = ({ user, setOpenModal }: PageProp) => {
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<Inputs>({
    username: user?.username || "",
    email: user?.email || "",
    fullname: user?.fullname || "",
    about: user?.about || "",
    phone: user?.phone || "",
    location: user?.location || "",
    facebook: user?.facebook || "",
    profession: user?.profession || "",
  });
  const [uncngError, setUncngError] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit = async (data: Inputs) => {
    try {
      setLoading(true);
      // check if there is any change in the data
      const hasChanged = Object.entries(data).some(([key, value]) => {
        return values[key] !== value;
      });

      // if not changed then show error
      if (!hasChanged) {
        setUncngError(true);
      } else {
        setUncngError(false);

        // if everything is good then send the data to the server
        console.log(values);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <div className={styles.user_upd_modal}>
      <span onClick={handleClose} className={styles.close_div}>
        <FaTimes />
      </span>
      <div className={styles.modal_form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Update Profile</h2>
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
            placeholder={user?.username ? user?.username : "Username"}
            value={values.username ? values.username : user?.username}
            onChange={(e) =>
              setValues((prevValues) => ({
                ...prevValues,
                username: e.target.value,
              }))
            }
            onBlur={() => {
              trigger("username");
            }}
            className={styles.exact_form_inp}
          />
          <span className={styles.form_err}>{errors.username?.message}</span>

          <input
            {...register("email", {
              required: "Email is required!",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Invalid email address",
              },
            })}
            placeholder={user?.email ? user?.email : "Email"}
            value={values.email ? values.email : user?.email}
            onChange={(e) =>
              setValues((prevValues) => ({
                ...prevValues,
                email: e.target.value,
              }))
            }
            onBlur={() => {
              trigger("email");
            }}
            className={styles.exact_form_inp}
          />
          {/* error message */}
          <span className={styles.form_err}>{errors.email?.message}</span>

          <input
            {...register("fullname", {
              required: "Fullname is required!",
              minLength: {
                value: 3,
                message: "Minimum length is 3 characters!",
              },
              maxLength: {
                value: 20,
                message: "Maximum length is 20 characters!",
              },
            })}
            placeholder={user?.fullname ? user?.fullname : "Fullname"}
            value={values.fullname ? values.fullname : user?.fullname}
            onChange={(e) =>
              setValues((prevValues) => ({
                ...prevValues,
                fullname: e.target.value,
              }))
            }
            onBlur={() => {
              trigger("fullname");
            }}
            className={styles.exact_form_inp}
          />
          {/* error message */}
          <span className={styles.form_err}>{errors.fullname?.message}</span>

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
            placeholder={user?.about ? user?.about : "About yourself"}
            value={values.about ? values.about : user?.about}
            onChange={(e) =>
              setValues((prevValues) => ({
                ...prevValues,
                about: e.target.value,
              }))
            }
            onBlur={() => {
              trigger("about");
            }}
            className={styles.textarea}
            rows={3}
            cols={70}
          />
          {/* error message */}
          <span className={styles.form_err}>{errors.about?.message}</span>

          <input
            {...register("phone", {
              required: "Phone is required!",
              pattern: {
                value: /^[\d+]+$/,
                message: "Invalid phone number!",
              },
            })}
            placeholder={user?.phone ? user?.phone : "Phone Number"}
            value={values.phone ? values.phone : user?.phone}
            onChange={(e) =>
              setValues((prevValues) => ({
                ...prevValues,
                phone: e.target.value,
              }))
            }
            onBlur={() => {
              trigger("phone");
            }}
            className={styles.exact_form_inp}
          />
          <span className={styles.form_err}>{errors.phone?.message}</span>

          <input
            {...register("location", {
              required: "Location is required!",
            })}
            placeholder={user?.location ? user?.location : "Location"}
            value={values.location ? values.location : user?.location}
            onChange={(e) =>
              setValues((prevValues) => ({
                ...prevValues,
                location: e.target.value,
              }))
            }
            onBlur={() => {
              trigger("location");
            }}
            className={styles.exact_form_inp}
          />
          <span className={styles.form_err}>{errors.location?.message}</span>

          <input
            {...register("facebook", {
              required: false,
            })}
            placeholder={
              user?.facebook ? user?.facebook : "Facebook account link"
            }
            value={values.facebook ?? user?.facebook ?? ""}
            onChange={(e) =>
              setValues((prevValues) => ({
                ...prevValues,
                facebook: e.target.value,
              }))
            }
            className={styles.exact_form_inp}
          />
          <span className={styles.form_err}>{errors.facebook?.message}</span>

          <label className={styles.form_profession}>
            <b>Profession:</b>
            <input
              type="radio"
              value="student"
              {...register("profession", {
                required: "Profession is required!",
              })}
              checked={values.profession === "student"}
              onChange={(e) =>
                setValues({ ...values, profession: e.target.value })
              }
            />{" "}
            Student
            <input
              type="radio"
              value="worker"
              {...register("profession", {
                required: "Profession is required!",
              })}
              checked={values.profession === "worker"}
              onChange={(e) =>
                setValues({ ...values, profession: e.target.value })
              }
            />{" "}
            Worker
          </label>
          <span className={styles.form_err}>{errors.profession?.message}</span>

          <input
            type="submit"
            value={loading ? "Loading..." : "Update"}
            className={styles.submit_btn}
            style={{ cursor: loading ? "not-allowed" : "pointer" }}
          />

          {uncngError && (
            <p className={styles.unchangeErr}>
              You haven&apos;t made any changes!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default UpdateModal;
