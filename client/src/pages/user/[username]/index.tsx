import { Context } from "Context/Context";
import axios from "axios";
import Navbar from "components/Navbar/Navbar";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import {
  MdFacebook,
  MdLocationPin,
  MdOutbond,
  MdOutlineCalendarMonth,
  MdPhone,
  MdWork,
} from "react-icons/md";
import { Postt, User } from "types.global";
import styles from "../../../styles/user.module.scss";

import FollowOrFollowingPopup from "components/FollowOrFollowingPopup/FollowOrFollowingPopup";
import Post from "components/Post/Post";
import PostComponent from "components/PostComponent/PostComponent";
import UpdateModal from "components/UpdateModal/UpdateModal";
import UserActivities from "components/UserActivities/UserActivities";
import noCover from "../../../../images/no-image-available-icon-6.png";
import noProfilePhoto from "../../../../images/no-photo.png";

interface UserProps {
  userr: User;
  posts: Postt[];
}

const Index: React.FC<UserProps> = ({ userr, posts }) => {
  const [activity, setActivity] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [followersList, setFollowersList] = useState(userr?.followers || []);
  const [followers, setFollowers] = useState(0);
  const [followingList, setFollowingList] = useState(userr?.following || []);
  const [followings, setFollowings] = useState(0);
  const [followerOrFollowingPopup, setFollowerOrFollowingPopup] =
    useState(false);
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [catchFlwrOrFlwing, setcatchFlwrOrFlwing] = useState(false);
  const { user, dispatch } = useContext(Context);
  const [allPosts, setAllPosts] = useState(posts);
  const [activities, setActivities] = useState([]);

  const router = useRouter();
  const userName = router.query.username;

  useEffect(() => {
    setAllPosts(posts);
    setFollowerOrFollowingPopup(false);
    setActivities([]);
    setActivity(false);
  }, [posts]);

  // set the followings and followers
  useEffect(() => {
    setFollowers(userr?.followers.length);

    setFollowings(userr?.following.length);
  }, [userr?.followers.length, userr?.following.length]);

  // check if the user is already a follower
  useEffect(() => {
    if (userr && user?._id) {
      const isFollower = userr.followers.includes(user?._id);

      if (isFollower) {
        setFollowed(true);
      }

      if (!isFollower) setFollowed(false);
    } else {
      console.log("no user!");
    }
  }, [userr, user?._id]);

  // update the user active status
  useEffect(() => {
    // Function to update active status on the server
    const updateActiveStatus = async () => {
      try {
        // Send a request to the server endpoint /api/user/active
        await axios.get(`http://localhost:4000/api/user/active/${user?._id}`);
      } catch (error) {
        console.error("Failed to update active status:", error);
      }
    };

    // Update active status initially when the component mounts
    updateActiveStatus();

    // Update active status every 10 minutes
    const interval = setInterval(() => {
      updateActiveStatus();
    }, 10 * 60 * 1000); // 10 minutes in milliseconds

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [user?._id]);

  // format the date
  const createAt = new Date(userr?.createdAt);
  const date = Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(createAt);

  const handleEditProfile = () => {
    setOpenModal(true);
  };

  // Fetch the followers list when the user clicks on the followers section
  const handleFollowersClick = async (userId: string) => {
    // You can use the user's followers array to display the list
    const response = await axios.get(
      `http://localhost:4000/api/user/${userId}/followers`
    );
    const followers = await response.data.message;
    setFollowersList(followers);

    // set the following list to empty
    setFollowingList([]);

    setFollowerOrFollowingPopup(true);
    setcatchFlwrOrFlwing(true);
  };

  // Fetch the following list when the user clicks on the following section
  const handleFollowingClick = async (userId: string) => {
    // You can use the user's following array to display the list
    const response = await axios.get(
      `http://localhost:4000/api/user/${userId}/followings`
    );
    const followings = await response.data.message;
    setFollowingList(followings);

    // set the following list to empty
    setFollowersList([]);

    setFollowerOrFollowingPopup(true);
    setcatchFlwrOrFlwing(false);
  };

  // Close the followers&following popup
  const closeFollowerOrFollowinigPopup = () => {
    setFollowerOrFollowingPopup(false);
  };

  // follow or unfollow a user
  const handleFollow = async (prev: boolean) => {
    // check if user is authenticated
    const token = localStorage.getItem("jwtToken");
    if (!user) {
      router.push("/login");
    }

    try {
      dispatch({ type: "USER_UPDATE_START" });

      const newFollowed = followed ? !prev : true;
      setFollowed(newFollowed);
      // send a follow request to the database using axios
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (!followed) {
        if (loading) return; // Do not proceed if already loading
        setLoading(true);

        // send a follow request to the user
        if (!loading) {
          const response = await axios.post(
            `http://localhost:4000/api/user/follow/${userr?._id}`,
            {},
            config
          );
          // if successful
          if (response && response.data) {
            setLoading(false);
            dispatch({
              type: "USER_UPDATE_SUCCESS",
              payload: response.data?.message,
            });
          }
          setFollowers((prev) => prev + 1);
        }
      } else {
        if (loading) return;
        setLoading(true);

        // send a unfollow request to the user
        if (!loading) {
          const response = await axios.post(
            `http://localhost:4000/api/user/unfollow/${userr?._id}`,
            {},
            config
          );
          // if successful
          if (response && response.data) {
            setLoading(false);

            dispatch({
              type: "USER_UPDATE_SUCCESS",
              payload: response.data?.message,
            });
          }

          setFollowers((prev) => prev - 1);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  };

  const handlePostOrActivity = async (values: string, userId: string) => {
    if (values === "posts") {
      setActivity(false);
    } else {
      setActivity(true);
      setLoading2(true);
      // fetch the activity of a user
      const res = await axios.get(
        `http://localhost:4000/api/user/activities/${userId}`
      );

      const activity = await res.data.message;

      setActivities(activity);
      setLoading2(false);
    }
  };

  return (
    <div className={styles.user_profile}>
      <Head>
        <title>{userr?.fullname}</title>
        <meta name="description" content="Generated by sociatek" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <div className={styles.user_profile_main}>
        {/* profile section. showing user info */}
        <div className={styles.user_profilee}>
          <Image
            src={userr?.coverPhoto ? userr?.coverPhoto : noCover}
            alt="sociatek user cover"
            height={150}
            width={400}
            className={styles.user_cover}
          />
          <Image
            src={userr?.profilePicture ? userr?.profilePicture : noProfilePhoto}
            alt="sociatek user profile"
            height={120}
            width={120}
            className={styles.user_dp}
          />

          <div className={styles.user_profile_detail}>
            <div className={styles.user_active_status}>
              {userr?.isActive ? (
                <p className={styles.online}>Online</p>
              ) : (
                <p className={styles.offline}>Offline</p>
              )}
            </div>

            <h2>
              {userr?.fullname}
              <span> ({userr?.username})</span>
            </h2>
            {userr?.about && <p>{userr?.about}</p>}

            {/* if the user is same than show the eidt profile button if not then show follow user */}
            <div className={styles.follow_or_edit}>
              {userName === user?.username ? (
                <div
                  className={styles.edit_profile}
                  onClick={handleEditProfile}
                >
                  <p>
                    <FaEdit style={{ marginRight: "5px" }} /> Edit Profile
                  </p>
                </div>
              ) : (
                <div
                  className={styles.follow_user}
                  onClick={() => handleFollow(followed)}
                >
                  <p style={{ cursor: loading ? "not-allowed" : "pointer" }}>
                    {loading ? (
                      <span className={styles.loader}></span>
                    ) : followed ? (
                      <span>Following</span>
                    ) : (
                      <span>Follow</span>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* when user click on edit profile open a modal with the user inifo */}
            {openModal && (
              <UpdateModal user={userr} setOpenModal={setOpenModal} />
            )}

            <div className={styles.user_activities}>
              <p
                className={styles.follow_sec}
                onClick={() => handleFollowersClick(userr._id)}
              >
                <span>{followers}</span> Followers
              </p>
              <p
                className={styles.follow_sec}
                onClick={() => handleFollowingClick(userr._id)}
              >
                <span>{followings}</span> Following
              </p>
            </div>

            {/* Render the following popup */}
            {followerOrFollowingPopup && (
              <FollowOrFollowingPopup
                users={catchFlwrOrFlwing ? followersList : followingList}
                setFollowerOrFollowingPopup={setFollowerOrFollowingPopup}
                catchFlwrOrFlwing={catchFlwrOrFlwing}
              />
            )}

            <div className={styles.user_profile_contact}>
              {userr?.location && (
                <p>
                  <MdLocationPin className={styles.contact_icon} />{" "}
                  {userr?.location}
                </p>
              )}
              {userr?.phone && (
                <p>
                  <MdPhone className={styles.contact_icon} /> {userr?.phone}
                </p>
              )}
              <p style={{ textTransform: "capitalize" }}>
                <MdWork className={styles.contact_icon} /> {userr?.profession}
              </p>
            </div>

            <div className={styles.contact_btm}>
              <div className={styles.contact_btmm}>
                <MdFacebook className={styles.contact_btm_icon} />
                Facebook:
                <div className={styles.contact_btm_fb}>
                  {userr?.facebook ? (
                    <p style={{ cursor: "pointer" }}>
                      <Link
                        href={userr?.facebook}
                        style={{ color: "rgba(0, 0, 0, 0.795)" }}
                        target="blank"
                      >
                        <MdOutbond
                          style={{
                            marginBottom: "-13px",
                            fontSize: "25px",
                            marginLeft: "4px",
                          }}
                        />
                      </Link>
                    </p>
                  ) : (
                    <p style={{ marginBottom: "4px", marginLeft: "3px" }}>
                      Not Signed!
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.contact_btm_join}>
                <MdOutlineCalendarMonth className={styles.contact_btm_icon} />
                Joined:{" "}
                <p style={{ marginBottom: "4px", marginLeft: "2px" }}>{date}</p>
              </div>
            </div>
          </div>
        </div>

        {/* activities section. showing users post and activities */}
        <div className={styles.user_posts_and_activities}>
          <div className={styles.posts_and_activities_nav}>
            <p
              className={activity ? `${styles.notactive}` : `${styles.active}`}
              onClick={() => handlePostOrActivity("posts", userr._id)}
            >
              Posts
            </p>
            <p
              className={activity ? `${styles.active}` : `${styles.notactive}`}
              onClick={() => handlePostOrActivity("activities", userr._id)}
            >
              Activities
            </p>
          </div>

          {/* conditionally render the posts or activities */}
          {activity ? (
            <UserActivities
              activities={activities}
              pusername={userr.username}
              loading={loading2}
            />
          ) : (
            <div>
              {allPosts.length > 0 ? (
                allPosts.map((post) => {
                  return (
                    <Post
                      postItems={post}
                      key={post._id}
                      setAllPosts={setAllPosts}
                    />
                  );
                })
              ) : (
                <div className={styles.user_posts_empty}>
                  <p>Haven&apos;t shared any post yet!</p>

                  {userName === user?.username && (
                    <>
                      <p style={{ marginTop: "40px" }}>
                        <b>Want to share anything?</b>
                      </p>
                      <PostComponent />
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

// Fetch the list of user IDs from an API or database
export const getStaticPaths: GetStaticPaths = async () => {
  const res = await axios.get("http://localhost:4000/api/users/all");
  const users = await res.data.message;

  const paths = users.map((user: User) => ({
    params: {
      username: user.username,
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

//  Fetch the user data based on the ID from an API or database
export const getStaticProps: GetStaticProps<UserProps> = async (context) => {
  const { params } = context;
  // console.log(params);

  const res = await axios.get(
    `http://localhost:4000/api/user/${params?.username}`
  );
  const res2 = await axios.get(
    `http://localhost:4000/api/posts/all?user=${params?.username}`
  );

  const data = await res.data.message;
  const data2 = await res2.data.message;

  return {
    props: {
      userr: data,
      posts: data2,
    },
  };
};
