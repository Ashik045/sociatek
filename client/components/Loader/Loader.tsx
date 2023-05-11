import Navbar from "components/Navbar/Navbar";
import styles from "./loader.module.scss";

const Loader = () => {
  return (
    <>
      <Navbar />
      <span className={styles.loader}></span>
    </>
  );
};

export default Loader;
