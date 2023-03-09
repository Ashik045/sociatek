import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import noPhoto from "../../images/no-photo.png";
import styles from "./navbar.module.scss";

const Navbar = () => {
  const [toggler, setToggler] = useState(false);
  const [user, setuser] = useState(false);
  const [inpVal, setInpVal] = useState("");
  const [APIData, setAPIData] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  // const { user, dispatch } = useContext(Context);
  // const { input, dispatchh } = useContext(InpContext);
  // const navigate = useNavigate();
  const router = useRouter();

  //   useEffect(() => {
  //     axios.get(`https://weblog-backend.onrender.com/api/posts`).then((response) => {
  //         setAPIData(response.data.message);
  //     });
  // }, []);

  // navigate to login page
  const handleClick = () => {
    router.push("/login");
    setToggler(false);
  };

  // const handleClick2 = () => {
  //     navigate('/');
  // };

  // user logout function
  // const logOut = () => {
  //     // setUser(false);
  //     setToggler(false);
  //     dispatch({ type: 'LOGOUT' });
  //     navigate('/');
  // };

  const handleChange = (e) => {
    setInpVal(e.target.value);
  };

  // search and get data
  const handleSubmit = (e) => {
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
          <h5>
            WE<span style={{ color: "#FB2576" }}>BLOG</span>
          </h5>
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
            <Link href="/seetings" style={{ textDecoration: "none" }}>
              <p>Profile</p>
            </Link>
            <Link href="/write" style={{ textDecoration: "none" }}>
              <p>Post</p>
            </Link>
            {/* {user && (
                            <Link href={`users/?user=${user.username}`}>
                                <a href="">My Posts</a>
                            </Link>
                        )} */}
            <Link href={`users/`} style={{ textDecoration: "none" }}>
              <p>My Posts</p>
            </Link>
          </div>

          {/* nav reg sec */}
          <div className={styles.nav_reg}>
            {user ? (
              <>
                <Image
                  onClick={() => router.push("/seetings")}
                  className="profilePic"
                  src={noPhoto}
                  alt="user profile"
                />
              </>
            ) : (
              <button type="button" onClick={handleClick}>
                Log in
              </button>
            )}
          </div>

          {/* for responsive device */}
          <div className="res_navbar">
            {/* {toggler ? (
                            <BiX size={29} onClick={() => setToggler(false)} />
                        ) : (
                            <BiMenu size={29} onClick={() => setToggler(true)} />
                        )} */}
            {/* {toggler && (
                            <div className="res_nav_menu">
                                <NavLink to="/">
                                    <a onClick={() => setToggler(false)} href="">
                                        Home
                                    </a>
                                </NavLink>
                                <NavLink to="/">
                                    <a onClick={() => setToggler(false)} href="">
                                        About
                                    </a>
                                </NavLink>
                                <NavLink to="/seetings">
                                    <a onClick={() => setToggler(false)} href="">
                                        Profile
                                    </a>
                                </NavLink>
                                <NavLink to="/write">
                                    <a onClick={() => setToggler(false)} href="">
                                        Write
                                    </a>
                                </NavLink>
                                {user && (
                                    <NavLink to={`users/?user=${user.username}`}>
                                        <a href="#" onClick={() => setToggler(false)}>
                                            My Posts
                                        </a>
                                    </NavLink>
                                )} */}

            {/* <div className="res_nav_reg">
                                    {user ? (
                                        <button type="button" onClick={logOut}>
                                            Log out
                                        </button>
                                    ) : (
                                        <button type="button" onClick={handleClick}>
                                            Log In
                                        </button>
                                    )}
                                </div> */}
            {/* </div> */}
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
