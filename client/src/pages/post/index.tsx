import { Context } from "Context/Context";
import Navbar from "components/Navbar/Navbar";
import PostPopup from "components/PostPopUp/PostPopup";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

const Index = () => {
  const [postPopup, setPostPopup] = useState(false);

  const { user } = useContext(Context);
  const router = useRouter();

  if (!user) router.push("/login");

  useEffect(() => {
    const timer = setTimeout(() => {
      setPostPopup(true);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Navbar />
      {postPopup && <PostPopup setPostPopup={setPostPopup} />}
    </div>
  );
};

export default Index;
