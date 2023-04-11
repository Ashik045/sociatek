import { useState } from "react";
import style from "./formcomponent.module.scss";

function SocialLink({
  facebookUrl,
  facebookUrlChng,
  twitterUrl,
  twitterUrlChng,
  phnChng,
  phoneUrl,
}) {
  const [focus, setFocus] = useState(false);

  const onBlur = () => {
    setFocus(true);
  };

  return (
    <div className={style.exact_form}>
      <input
        className={style.exact_form_inp}
        type="text"
        placeholder="Phone Number"
        value={phoneUrl}
        onChange={phnChng}
        required
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
        Phone is required.
      </p>
      <input
        className={style.exact_form_inp}
        type="text"
        placeholder="Facebook Link"
        value={facebookUrl}
        onChange={facebookUrlChng}
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
        Facebook is required.
      </p>

      <div className={style.profession}>
        <span className={style.profession_title}>Select Profession:</span>
        <input type="radio" id="html" name="fav_language" value="student" />
        <label htmlFor="html">Student</label>

        <input type="radio" id="html2" name="fav_language" value="wroker" />
        <label htmlFor="html2">Wroker</label>
      </div>
    </div>
  );
}

export default SocialLink;
