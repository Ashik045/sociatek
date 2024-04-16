import { Context } from "Context/Context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { FaPager, FaTimes, FaUserFriends } from "react-icons/fa";
import noPhoto from "../../images/no-photo.png";
import styles from "./navbar.module.scss";

const Navbar = () => {
  const [toggler, setToggler] = useState(false);
  const [inpVal, setInpVal] = useState("");
  // const [user, setUser] = useState<null | User>(null);
  const [APIData, setAPIData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [selectVal, setSelectVal] = useState("");
  const router = useRouter();

  const { user, dispatch } = useContext(Context);

  // navigate to login page
  const handleClick = () => {
    router.push("/login");
    setToggler(false);
  };

  // The handleLogout function logs the user out by dispatching a logout action, redirecting to the home page, removing the JWT token from local storage, and logging a message to the console
  // user logout function.
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    router.push("/");
    // set the JWT token to null
    localStorage.removeItem("jwtToken");
    console.log("logged out");
  };

  const handleChange = (e: any) => {
    setInpVal(e.target.value);
  };

  // search and get data
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      router.push({
        pathname: selectVal === "users" ? "users" : "/",
        query: { search: inpVal },
      });
      // console.log("input:" + inpVal, selectVal === "users" ? "users" : "posts");
    } catch (error) {
      console.log(error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleClose = () => {
    setInpVal("");
    //   dispatchh({ type: 'SEARCH_CLEAR' });
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbar_main}>
        <div className={styles.nav_brand}>
          <Link href="/" style={{ textDecoration: "none", color: "black" }}>
            <h5>
              SO<span style={{ color: "#FB2576" }}>CIATEK</span>
            </h5>
          </Link>
        </div>

        <div className={styles.nav_right}>
          <div className={styles.search}>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Search.."
                value={inpVal}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
              {inpVal?.length !== 0 && (
                <FaTimes
                  className={styles.search_icon_close}
                  onClick={handleClose}
                />
              )}

              <select
                className={styles.search_option}
                value={selectVal}
                onChange={(e) => setSelectVal(e.target.value)}
              >
                {/* icons are not showing */}
                <option className={styles.search_val} value="posts">
                  <FaPager /> Posts
                </option>
                <option className={styles.search_val} value="users">
                  <FaUserFriends /> Users
                </option>
              </select>
            </form>
          </div>

          <div className={styles.nav_menu}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <p className={router.pathname === "/" ? `${styles.active}` : ""}>
                Home
              </p>
            </Link>
            <Link href="/post" style={{ textDecoration: "none" }}>
              <p
                className={
                  router.pathname === "/post" ? `${styles.active}` : ""
                }
              >
                Post
              </p>
            </Link>
            <Link href={`/users`} style={{ textDecoration: "none" }}>
              <p
                className={
                  router.pathname === "/users" ? `${styles.active}` : ""
                }
              >
                Find Users
              </p>
            </Link>
          </div>

          {/* show popup(logour, view profile) on mousehover */}
          <div className={styles.nav_reg}>
            {user ? (
              <>
                <div className={styles.nav_regg}>
                  <Image
                    className={styles.profilePic}
                    src={user.profilePicture ? user.profilePicture : noPhoto}
                    height={35}
                    width={35}
                    alt="user profile"
                  />
                  <div className={styles.username}>{user?.username}</div>
                  <div className={styles.user_popup}>
                    <Link
                      href={`/user/${user.username}`}
                      style={{ textDecoration: "none" }}
                    >
                      <p>View Profile</p>
                    </Link>
                    <p onClick={handleLogout}>Log Out</p>
                  </div>
                </div>
              </>
            ) : (
              <button type="button" onClick={handleClick}>
                Log in
              </button>
            )}
          </div>

          {/* for responsive device */}
          <div className={styles.res_navbar}>
            {toggler ? (
              <BiX
                size={29}
                onClick={() => setToggler(false)}
                className={styles.res_nav_iconn}
              />
            ) : (
              <BiMenu
                size={29}
                onClick={() => setToggler(true)}
                className={styles.res_nav_iconn}
              />
            )}
            {toggler && (
              <div className={styles.res_nav_menu}>
                <div className={styles.res_nav_menuu}>
                  <Link href="/" style={{ textDecoration: "none" }}>
                    <p
                      onClick={() => setToggler(false)}
                      className={
                        router.pathname === "/" ? `${styles.active}` : ""
                      }
                    >
                      Home
                    </p>
                  </Link>

                  <Link href="/post" style={{ textDecoration: "none" }}>
                    <p
                      onClick={() => setToggler(false)}
                      className={
                        router.pathname === "/post" ? `${styles.active}` : ""
                      }
                    >
                      Post
                    </p>
                  </Link>

                  {user && (
                    <Link
                      href={`/user/${user.username}`}
                      style={{ textDecoration: "none" }}
                    >
                      <p onClick={() => setToggler(false)}>Profile</p>
                    </Link>
                  )}

                  <Link href={`/users`} style={{ textDecoration: "none" }}>
                    <p
                      onClick={() => setToggler(false)}
                      className={
                        router.pathname === "/users" ? `${styles.active}` : ""
                      }
                    >
                      Find Users
                    </p>
                  </Link>

                  <div className={styles.res_nav_reg}>
                    {!user && (
                      <button type="button" onClick={handleClick}>
                        Log In
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
