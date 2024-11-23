import { Context } from "Context/Context";
import axios from "axios";
import Navbar from "components/Navbar/Navbar";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useRef, useState } from "react";
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
import styles from "../../styles/user.module.scss";

import FollowOrFollowingPopup from "components/FollowOrFollowingPopup/FollowOrFollowingPopup";
import Post from "components/Post/Post";
import PostComponent from "components/PostComponent/PostComponent";
import ProfileVisitors from "components/ProfileVisitors/ProfileVisitors";
import ReactorsPopup from "components/ReactorsPopup/ReactorsPopup";
import UpdateModal from "components/UpdateModal/UpdateModal";
import UserActivities from "components/UserActivities/UserActivities";
import InfiniteScroll from "react-infinite-scroll-component";
import noCover from "../../../images/no-image-available-icon-6.png";
import noProfilePhoto from "../../../images/no-photo.png";

interface UserProps {
  userr: User;
  posts: Postt[];
}

const Index: React.FC<UserProps> = ({ userr, posts }) => {
  const [activity, setActivity] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [followersList, setFollowersList] = useState<User[]>([]);
  const [followers, setFollowers] = useState(0);
  const [followingList, setFollowingList] = useState<User[]>([]);
  const [followings, setFollowings] = useState(0);
  const [followerOrFollowingPopup, setFollowerOrFollowingPopup] =
    useState(false);
  const [followed, setFollowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);
  const [catchFlwrOrFlwing, setcatchFlwrOrFlwing] = useState(false);
  const { user, dispatch } = useContext(Context);
  const [allPosts, setAllPosts] = useState(posts);
  const [activities, setActivities] = useState([]);
  const [profileVisitors, setProfileVisitors] = useState([]);
  const [visitorsPopup, setVisitorsPopup] = useState(false);
  const visitedRef = useRef(false);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();
  const userName = router.query.username;

  useEffect(() => {
    setAllPosts(posts);
    setFollowerOrFollowingPopup(false);
    setActivities([]);
    setActivity(false);
    setVisitorsPopup(false);
  }, [posts]);

  // send the visiting userId to the server
  /* The above code is a useEffect hook in a TypeScript React component. It is responsible for sending a
request to the server to record a user visit when certain conditions are met. */
  useEffect(() => {
    const alreadyVisited =
      userr?.profileVisitors && user?._id
        ? userr.profileVisitors.includes(user._id)
        : false;

    if (!user) return;

    if (!visitedRef.current && !alreadyVisited && userr?._id !== user?._id) {
      const sendVisitingUserId = async () => {
        try {
          // Make the API request to send the visiting user ID to the server
          const token = localStorage.getItem("jwtToken");
          const config = {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          };

          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/visit/${userr?._id}`,
            config
          );

          console.log(res.data?.message);
        } catch (error) {
          console.error("Failed to send visit:", error);
          // Handle the error scenario
        }
      };

      sendVisitingUserId();
      visitedRef.current = true;
    }
  }, [userr?._id, user?._id, userr.profileVisitors, user]);

  // get the profile visitors
  /* The above code is a useEffect hook in a TypeScript React component. It is responsible for fetching
  profile visitors data from an API endpoint. */
  useEffect(() => {
    if (!user) return;

    const getProfileVisotors = async () => {
      setLoading3(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${userr?._id}/visitors`
        );
        setProfileVisitors(res.data?.message);

        setLoading3(false);
      } catch (error) {
        console.error(error);
        setLoading3(false);
      }
    };

    getProfileVisotors();
  }, [userr?._id, user]);

  // set the followings and followers
  /* The above code is a useEffect hook in a TypeScript React component. It is fetching the followers and
following data from a server API and updating the state variables `followersList`, `followers`,
`followingList`, and `followings` with the fetched data. The useEffect hook is triggered whenever
the `userr._id` value changes. */
  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        // Fetch the followers data from the server
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${userr._id}/followers`
        );
        const followers = await response.data.message;

        // Update the followers list state
        setFollowersList(followers);
        setFollowers(followers.length);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchFollowing = async () => {
      try {
        // Fetch the following data from the server
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${userr._id}/followings`
        );
        const followings = await response.data.message;

        // Update the following list state
        setFollowingList(followings);
        setFollowings(followings.length);
      } catch (error) {
        console.error(error);
      }
    };

    // Call the fetch functions
    fetchFollowers();
    fetchFollowing();
  }, [userr._id]);

  // check if the user is already a follower
  /* The above code is a useEffect hook in a TypeScript React component. It is making an asynchronous API
call to retrieve user data from a specific endpoint. */
  useEffect(() => {
    const userCall = async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${userr?.username}`
      );

      const userrr = await res.data?.message;

      if (userrr && user?._id) {
        const isFollower = userrr.followers?.includes(user?._id);
        if (isFollower) {
          setFollowed(true);
        } else {
          setFollowed(false);
        }
      } else {
        console.log("no user!");
      }
    };

    userCall();
  }, [userr, user?._id]);

  /* The above code is a React useEffect hook that updates the active status of a user. */
  // update the user active status
  useEffect(() => {
    if (!user) return;
    if (user.username === userr.username) return;
    // Function to update active status on the server
    const updateActiveStatus = async () => {
      try {
        // Send a request to the server endpoint /api/user/active
        await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/active/${user?._id}`
        );
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
  }, [user?._id, user, userr.username]);

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
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${userId}/followers`
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
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${userId}/followings?limit=10`
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

  /**
   * The above function handles the follow/unfollow functionality for a user, making API requests to
   * the server and updating the state accordingly.
   * @param {boolean} prev - The `prev` parameter is a boolean value that represents the previous state
   * of the follow status. It indicates whether the user was previously followed or not.
   * @returns The function `handleFollow` does not have a return statement, so it does not explicitly
   * return anything.
   */
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
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/follow/${userr?._id}`,
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
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/unfollow/${userr?._id}`,
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/activities/${userId}?limit=10`
      );

      const activity = await res.data.message;

      setActivities(activity);
      setLoading2(false);
    }
  };

  // handle the profile visitor popup
  /**
   * The function `handleVisitorsPopup` sets a state variable to display a visitors popup, then makes
   * an API call to retrieve the profile visitors for a specific post.
   * @param {string} postId - The `postId` parameter is a string that represents the ID of a post.
   */
  const handleVisitorsPopup = async (postId: string) => {
    setVisitorsPopup(true);

    try {
      setLoading3(true);
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${userr?._id}/visitors`
      );
      setProfileVisitors(res.data?.message);

      setLoading3(false);
    } catch (error) {
      console.error(error);
      setLoading3(false);
    }
  };

  // fetcj more data when user scrolls
  /**
   * The function fetches more data from an API based on the ID of the last post in the current list
   * and updates the state with the new posts.
   */
  const fetchMoreData = async () => {
    try {
      const lastPost = allPosts[allPosts.length - 1]; // Get the last post in the current list

      // Fetch more data from the API using the _id of the last post
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/all?user=${userName}&limit=10&lastPostId=${lastPost._id}`
      );

      const newPosts = res.data.message;

      if (newPosts.length === 0) {
        setHasMore(false); // Stop fetching if there are no more posts
      } else {
        // Update the state with the new posts
        setAllPosts((prevPosts) => [...prevPosts, ...newPosts]);
      }
    } catch (error) {
      console.log("Error fetching more data:", error);
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
        <div>
          <div className={styles.user_profilee}>
            <Image
              src={userr?.coverPhoto ? userr?.coverPhoto : noCover}
              alt="sociatek user cover"
              height={150}
              width={400}
              className={styles.user_cover}
            />
            <Image
              src={
                userr?.profilePicture ? userr?.profilePicture : noProfilePhoto
              }
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
                  userId={userr._id}
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
                      <p style={{ cursor: "pointer", fontSize: "15px" }}>
                        <Link
                          href={userr?.facebook}
                          style={{ color: "rgba(0, 0, 0, 0.795)" }}
                          target="blank"
                        >
                          <MdOutbond
                            style={{
                              marginBottom: "-13px",
                              fontSize: "23px",
                            }}
                          />
                        </Link>
                      </p>
                    ) : (
                      <p
                        style={{
                          marginBottom: "4px",
                          marginLeft: "2px",
                          fontSize: "15px",
                        }}
                      >
                        Not Signed!
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.contact_btm_join}>
                  <MdOutlineCalendarMonth className={styles.contact_btm_icon} />
                  Joined:{" "}
                  <p
                    style={{
                      marginBottom: "4px",
                      marginLeft: "2px",
                      fontSize: "15px",
                    }}
                  >
                    {date}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.profile_visitors}>
            <div className={styles.profile_visitor_top}>
              <h3>Profile Visitors</h3>

              <p onClick={() => handleVisitorsPopup(userr._id)}>See All</p>
            </div>

            {userr?._id && visitorsPopup && profileVisitors.length > 0 && (
              <ReactorsPopup
                users={profileVisitors}
                loading={loading3}
                setReactorsPopup={setVisitorsPopup}
                visitor={true}
              />
            )}

            {loading3 ? (
              <div className={styles.profile_visitors_loader}>
                <span className={styles.loader}></span>
              </div>
            ) : (
              <ProfileVisitors visitors={profileVisitors} />
            )}
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
              userId={userr?._id}
              loading={loading2}
            />
          ) : (
            <div>
              <InfiniteScroll
                dataLength={allPosts.length}
                next={fetchMoreData}
                hasMore={hasMore}
                loader={
                  allPosts.length > 0 && (
                    <div className={styles.loader_div}>
                      <span className={styles.loader}></span>
                    </div>
                  )
                }
              >
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
              </InfiniteScroll>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;

export const getServerSideProps: GetServerSideProps<UserProps> = async (
  context
) => {
  const { params } = context;

  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${params?.username}`
  );
  const res2 = await axios.get(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/all?user=${params?.username}&limit=10`
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

// Fetch the list of user IDs from an API or database
// export const getStaticPaths: GetStaticPaths = async () => {
//   const res = await axios.get($"{process.env.NEXT_PUBLIC_SERVER_URL}/api/users/all");
//   const users = await res.data.message;

//   const paths = users?.map((user: User) => ({
//     params: {
//       username: user.username,
//     },
//   }));

//   return {
//     paths,
//     fallback: true,
//   };
// };

// export const getStaticProps: GetStaticProps<UserProps> = async ({ params }) => {
//   const username = params?.username;

//   const res = await axios.get(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/${username}`
//   );
//   const res2 = await axios.get(
//     `${process.env.NEXT_PUBLIC_SERVER_URL}/api/posts/all?user=${username}&limit=10`
//   );

//   const data = await res.data.message;
//   const data2 = await res2.data.message;

//   return {
//     props: {
//       userr: data,
//       posts: data2,
//     },
//   };
// };

//  Fetch the user data based on the ID from an API or database
