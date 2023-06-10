import { Inter } from "@next/font/google";
import { Context } from "Context/Context";
import axios from "axios";
import Homepage from "components/Homepage/Homepage";
import jwtDecode from "jwt-decode";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Postt, User } from "types.global";
import Navbar from "../../components/Navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });

interface HomePageProps {
  posts: Postt[];
  users: User[];
}

export const revalidate = 30;

const Home: NextPage<HomePageProps> = ({ posts, users }) => {
  const { dispatch } = useContext(Context);
  const router = useRouter();

  const token =
    typeof window !== "undefined" && localStorage.getItem("jwtToken"); // Retrieve the token from localStorage or wherever it is stored

  if (token) {
    const decodedToken = jwtDecode(token) as { exp: number }; // Type assertion to define the shape of the decoded token
    const expirationTime = decodedToken.exp * 1000; // Convert expiration time to milliseconds

    const currentTime = Date.now(); // Get the current time in milliseconds

    if (currentTime > expirationTime) {
      // Token has expired
      //  Clear token from localStorage and redirect to login page
      dispatch({ type: "LOGOUT" });
      router.push("/");
      localStorage.removeItem("jwtToken");
    }
  }

  return (
    <>
      <Head>
        <title>Sociatek</title>
        <meta name="description" content="Generated by ashikur045" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="main">
        <Navbar />

        {/* main section of this application */}
        <Homepage posts={posts} users={users} />
      </main>
    </>
  );
};

// SSR - get called on every request
export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async () => {
  const res = await axios.get("http://localhost:4000/api/posts/all");
  const data = await res.data;
  const res2 = await axios.get("http://localhost:4000/api/users/all");
  const data2 = await res2.data;

  const reversePosts = data.message.reverse();

  return {
    props: {
      posts: reversePosts,
      users: data2.message.slice(0, 7),
    },
  };
};

export default Home;
