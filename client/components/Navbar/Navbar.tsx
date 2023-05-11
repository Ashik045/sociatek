import { Context } from "Context/Context";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { BiMenu, BiX } from "react-icons/bi";
import { FaSearch, FaTimes } from "react-icons/fa";
import styles from "./navbar.module.scss";

const Navbar = () => {
  const [toggler, setToggler] = useState(false);
  const [inpVal, setInpVal] = useState("");
  // const [user, setUser] = useState<null | User>(null);
  const [APIData, setAPIData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const router = useRouter();

  // useEffect(() => {
  //   const userData = localStorage.getItem("user");

  //   if (typeof window !== "undefined" && userData) {
  //     setUser(JSON.parse(userData));
  //   }
  // }, []);

  const { user, dispatch } = useContext(Context);

  // navigate to login page
  const handleClick = () => {
    router.push("/login");
    setToggler(false);
  };

  // user logout function
  const handleLogout = () => {
    dispatch({ type: "LOGOUT" });
    router.push("/");
    console.log("logged out");
  };

  const handleChange = (e: any) => {
    setInpVal(e.target.value);
  };

  // search and get data
  const handleSubmit = (e: any) => {
    //   e.preventDefault();
    //   setInpVal(e.target.value);
    //   if (inpVal?.length > 0) {
    //       navigate('/');
    //       dispatchh({ type: 'SEARCH_START' });
    //       // eslint-disable-next-line no-unused-vars
    //       const filterData = APIData.filter((item) =>
    //           Object.values(item.title).join('').toLowerCase().includes(inpVal.toLowerCase())
    //       );
    //       setFilteredResults(filterData);
    //       dispatchh({ type: 'SEARCH_END', payload: inpVal });
    //       // console.log(filterData);
    //   } else {
    //       setFilteredResults(APIData);
    //       dispatchh({ type: 'SEARCH_CLEAR' });
    //   }
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
              />
              {inpVal?.length !== 0 && (
                <FaTimes
                  className={styles.search_icon_close}
                  onClick={handleClose}
                />
              )}
              <button type="submit">
                <FaSearch className={styles.search_icon} />
              </button>
            </form>
          </div>

          <div className={styles.nav_menu}>
            <Link href="/" style={{ textDecoration: "none" }}>
              <p>Home</p>
            </Link>
            <Link href="/write" style={{ textDecoration: "none" }}>
              <p>Post</p>
            </Link>
            <Link href={`users/`} style={{ textDecoration: "none" }}>
              <p>Find Users</p>
            </Link>
          </div>

          {/* show popup(logour, view profile) on mousehover */}
          <div className={styles.nav_reg}>
            {user ? (
              <>
                <div className={styles.nav_regg}>
                  <Image
                    className={styles.profilePic}
                    src={user.profilePicture}
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
                <Link href="/" style={{ textDecoration: "none" }}>
                  <p onClick={() => setToggler(false)}>Home</p>
                </Link>

                <Link href="/write" style={{ textDecoration: "none" }}>
                  <p onClick={() => setToggler(false)}>Write</p>
                </Link>
                {user && (
                  <Link href={`users/`} style={{ textDecoration: "none" }}>
                    <p onClick={() => setToggler(false)}>Find Users</p>
                  </Link>
                )}

                <div className={styles.res_nav_reg}>
                  {!user && (
                    <button type="button" onClick={handleClick}>
                      Log In
                    </button>
                  )}
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
