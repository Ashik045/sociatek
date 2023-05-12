import { Context } from "Context/Context";
import axios from "axios";
import Navbar from "components/Navbar/Navbar";
import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
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
import UpdateModal from "components/UpdateModal/UpdateModal";
import noCover from "../../../../images/no-image-available-icon-6.png";
import noProfilePhoto from "../../../../images/no-photo.png";

interface UserProps {
  userr: User;
  posts: Postt[];
}

// interface Follower {
//   _id: string;
//   username: string;
//   fullname: string;
//   email: string;
//   // ... other follower properties
// }

// interface Following {
//   _id: string;
//   username: string;
//   fullname: string;
//   email: string;
//   // ... other following properties
// }

const Index: React.FC<UserProps> = ({ userr, posts }) => {
  const [activity, setActivity] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [followersList, setFollowersList] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followerOrFollowingPopup, setFollowerOrFollowingPopup] =
    useState(false);

  const router = useRouter();

  const userName = router.query.username;

  const { user } = useContext(Context);

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
      `http://localhost:4000/api/user/${userr._id}/followers`
    );
    const followers = response.data.message;
    setFollowersList(followers);
    console.log(followersList);

    setFollowerOrFollowingPopup(true);
  };

  // Fetch the following list when the user clicks on the following section
  const handleFollowingClick = async (userId: string) => {
    // You can use the user's following array to display the list
    const response = await axios.get(
      `http://localhost:4000/api/user/${userr._id}/followings`
    );
    const followings = response.data.message;
    setFollowingList(followings);
    console.log(followingList);

    setFollowerOrFollowingPopup(true);
  };

  // Close the followers&following popup
  const closeFollowerOrFollowinigPopup = () => {
    setFollowerOrFollowingPopup(false);
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
                <div className={styles.follow_user}>
                  <p>Follow</p>
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
                <span>{userr?.followers?.length}</span> Followers
              </p>
              <p
                className={styles.follow_sec}
                onClick={() => handleFollowingClick(userr._id)}
              >
                <span>{userr?.following?.length}</span> Following
              </p>
            </div>

            {/* Render the following popup */}
            {followerOrFollowingPopup && (
              <FollowOrFollowingPopup
                users={followersList || followingList}
                setFollowerOrFollowingPopup={setFollowerOrFollowingPopup}
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
                    <p style={{ marginBottom: "4px", marginLeft: "4px" }}>
                      Not Signed!
                    </p>
                  )}
                </div>
              </div>

              <div className={styles.contact_btm_join}>
                <MdOutlineCalendarMonth className={styles.contact_btm_icon} />
                Joined: {date}
              </div>
            </div>
          </div>
        </div>

        {/* activities section. showing users post and activities */}
        <div className={styles.user_posts_and_activities}>
          <div className={styles.posts_and_activities_nav}>
            <p
              className={activity ? `${styles.notactive}` : `${styles.active}`}
              onClick={() => setActivity(false)}
            >
              Posts
            </p>
            <p
              className={activity ? `${styles.active}` : `${styles.notactive}`}
              onClick={() => setActivity(true)}
            >
              Activities
            </p>
          </div>

          {/* conditionally render the posts or activities */}
          {activity ? (
            <p>User Activities. (Page Updating..)</p>
          ) : (
            <div>
              {posts.map((post) => {
                return <Post postItems={post} key={post._id} />;
              })}
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
  console.log(params);

  const res = await axios.get(
    `http://localhost:4000/api/user/${params?.username}`
  );
  const res2 = await axios.get("https://weblog-backend.onrender.com/api/posts");

  const data = await res.data.message;
  const data2 = await res2.data.message;

  return {
    props: {
      userr: data,
      posts: data2,
    },
  };
};
