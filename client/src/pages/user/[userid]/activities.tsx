import { NextPage } from "next";

interface ActivityProps {
  activities: string[];
}

const activities: NextPage<ActivityProps> = ({ activities }) => {
  //   console.log(activities);

  return <div>activities</div>;
};

export default activities;

// SSR - get called on every request
// export const getServerSideProps: GetServerSideProps<ActivityProps> = async (
//   context
// ) => {
//   // const { userid } = context.params;

//   // Fetch the activities for the user with the given userId
//   // const res = await axios.get(
//   //   `http://localhost:4000/api/users/${userid}/activities`
//   // );
//   const res = await axios.get("https://weblog-backend.onrender.com/api/activities");
//   const activities = await res.data.message;

//   return {
//     props: {
//       activities: activities,
//     },
//   };
// };
