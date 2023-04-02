import { useState } from "react";
import style from "./formcomponent.module.scss";

function PersonalInfo({ fnVal, lnVal, unVal, fnChng, lnChng, usChng }) {
  const [focus, setFocus] = useState(false);

  const onBlur = () => {
    setFocus(true);
  };

  return (
    <div className={style.exact_form}>
      <input
        className={style.exact_form_inp}
        type="text"
        placeholder="Fullname"
        value={fnVal}
        onChange={fnChng}
        onBlur={onBlur}
        focused={focus.toString()}
      />
      <p
        className={style.form_err}
        style={{
          color: "red",
          marginTop: "-13px",
          fontSize: "14px",
          marginBottom: "10px",
        }}
      >
        Name is required!
      </p>
      <input
        className={style.exact_form_inp}
        type="text"
        placeholder="Username"
        value={unVal}
        onChange={usChng}
        onBlur={onBlur}
        focused={focus.toString()}
        pattern="^[A-Za-z0-9]{5,15}$"
      />
      <p
        className={style.form_err}
        style={{
          color: "red",
          marginTop: "-13px",
          fontSize: "14px",
          marginBottom: "10px",
        }}
      >
        Username should be 5-15 characters and should not include any special
        character!
      </p>
      <textarea
        className={style.textarea}
        // type="text"
        placeholder="About yourself"
        value={lnVal}
        onChange={lnChng}
        onBlur={onBlur}
        focused={focus.toString()}
        rows={4}
        cols={70}
      />
      <p
        className={style.form_err}
        style={{
          color: "red",
          marginTop: "-13px",
          fontSize: "14px",
          marginBottom: "10px",
        }}
      >
        About field is required!
      </p>
    </div>
  );
}

export default PersonalInfo;
