import { Context } from "Context/Context";
import axios from "axios";
import Homepage from "components/Homepage/Homepage";
import jwtDecode from "jwt-decode";
import { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { Postt, User } from "types.global";
import Navbar from "../../components/Navbar/Navbar";

/* The `interface HomePageProps` is defining the shape of the props that the `Home` component will
receive. It specifies that the `posts` prop should be an array of `Postt` objects and the `users`
prop should be an array of `User` objects. This allows TypeScript to enforce type checking and
provide autocomplete suggestions when accessing these props within the component. */
interface HomePageProps {
  posts: Postt[];
  users: User[];
}

// export const revalidate = 30;
// export const runtime = "edge"; // 'nodejs' (default) | 'edge'
// export const runtime = "experimental-edge"; // 'nodejs' (default) | 'experimental-edge'

const Home: NextPage<HomePageProps> = ({ posts, users }) => {
  const [allPosts, setAllPosts] = useState(posts);
  const [hasMore, setHasMore] = useState(true);
  const { dispatch } = useContext(Context);
  const router = useRouter();

  const token =
    typeof window !== "undefined" && localStorage.getItem("jwtToken"); // Retrieve the token from localStorage or wherever it is stored

  /* This code block is checking if a token exists and if it is expired. */
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
        <Homepage
          initialPosts={posts}
          users={users}
          setAllPosts={setAllPosts}
          hasMore={hasMore}
          setHasMore={setHasMore}
        />
      </main>
    </>
  );
};

export default Home;

// SSR - get called on every request
/**
 * The above function is an implementation of the `getServerSideProps` function in a TypeScript React
 * application, which fetches posts and users data from an API and returns them as props for the home
 * page component.
 * @returns The `getServerSideProps` function is returning an object with a `props` property. The
 * `props` property contains the `posts` and `users` data fetched from the API. If there is an error
 * during the API request, it will return an object with empty arrays for `posts` and `users`.
 */
export const getServerSideProps: GetServerSideProps<
  HomePageProps
> = async () => {
  try {
    const postsRes = await axios.get(
      "https://sociatek.onrender.com/api/posts/all?limit=10"
    );
    const usersRes = await axios.get(
      "https://sociatek.onrender.com/api/users/all?limit=7"
    );

    const posts = postsRes.data.message;
    const users = usersRes.data.message;

    return {
      props: {
        posts,
        users,
      },
    };
  } catch (error) {
    // Handle errors
    console.error(error);
    return {
      props: {
        posts: [],
        users: [],
      },
    };
  }
};

// using SSG for avoiding "504 - server timeout" error
// export const getStaticProps: GetStaticProps<HomePageProps> = async () => {
//   try {
//     const postsRes = await axios.get(
//       "https://sociatek.onrender.com/api/posts/all?limit=10"
//     );
//     const usersRes = await axios.get(
//       "https://sociatek.onrender.com/api/users/all?limit=7"
//     );

//     const posts = postsRes.data.message;
//     const users = usersRes.data.message;

//     return {
//       props: {
//         posts,
//         users,
//       },
//       revalidate: 2, // in 2 seconds
//     };
//   } catch (error) {
//     // Handle errors
//     console.error(error);
//     return {
//       props: {
//         posts: [],
//         users: [],
//       },
//     };
//   }
// };
