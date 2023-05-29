import { Context } from "Context/Context";
import axios from "axios";
import Navbar from "components/Navbar/Navbar";
import UserDiv from "components/UserDiv/UserDiv";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { User } from "types.global";
import styles from "../../styles/users.module.scss";

interface HomePageProps {
  users: User[];
}

const Users: NextPage<HomePageProps> = ({ users }) => {
  const [followed, setFollowed] = useState(false);
  const [userNav, setUserNav] = useState("allusers");
  const [userss, setUserss] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(Context);
  const router = useRouter();

  useEffect(() => {
    setUserss(users);
  }, [users]);

  //  ***********  add a follow request to the user profile ***********
  const setFollow = () => {
    setFollowed(true);
  };

  // reveive the nav data when user clicks on it
  const handleUserNav = async (nav: string) => {
    setUserNav(nav);

    if (nav === "followers") {
      setLoading(true);
      if (!user) return router.push("/login");

      try {
        const response = await axios.get(
          `http://localhost:4000/api/user/${user?._id}/followers`
        );
        const followers = response.data.message;
        setUserss(followers);
      } catch (error) {
        console.error("Error fetching followers:", error);
        setUserss([]);
      }
      setLoading(false);
    } else if (nav === "followings") {
      setLoading(true);
      if (!user) return router.push("/login");

      try {
        const response = await axios.get(
          `http://localhost:4000/api/user/${user?._id}/followings`
        );
        const followings = response.data.message;
        setUserss(followings);
      } catch (error) {
        console.error("Error fetching followings:", error);
        setUserss([]);
      }
      setLoading(false);
    } else {
      // Reset to all users if no specific nav is selected
      setUserss(users);
      setLoading(false);
    }
  };

  return (
    <div className={styles.users_page}>
      <Head>
        <title>Users</title>
        <meta name="description" content="Generated by sociatek" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />

      <div className={styles.users_page_main}>
        <div className={styles.users_page_nav}>
          {/* Render user navigation buttons */}
          <div className={styles.users_page_nav_main}>
            <p
              className={
                userNav === "allusers"
                  ? `${styles.active}`
                  : `${styles.notactive}`
              }
              onClick={() => handleUserNav("allusers")}
            >
              All Users
            </p>
            <p
              className={
                userNav === "followers"
                  ? `${styles.active}`
                  : `${styles.notactive}`
              }
              onClick={() => handleUserNav("followers")}
            >
              Followers
            </p>
            <p
              className={
                userNav === "followings"
                  ? `${styles.active}`
                  : `${styles.notactive}`
              }
              onClick={() => handleUserNav("followings")}
            >
              Followings
            </p>
          </div>
        </div>

        {/* if there is no followers then show the message  */}
        {!loading && userss.length === 0 && userNav === "followers" && (
          <p style={{ textAlign: "center" }}>
            Currently not being followed by anyone!
          </p>
        )}

        {/* if there is no followings then show the message  */}
        {!loading && userss.length === 0 && userNav === "followings" && (
          <p style={{ textAlign: "center" }}>
            Haven&apos;t followed anyone yet!
          </p>
        )}

        {loading ? (
          <span className={styles.loader}></span>
        ) : (
          <UserDiv users={userss} setFollow={setFollow} />
        )}
      </div>
    </div>
  );
};

export default Users;

// SSR - get called on every request
export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async () => {
  const res2 = await axios.get("http://localhost:4000/api/users/all");
  const data2 = await res2.data;

  return {
    props: {
      users: data2.message,
    },
  };
};