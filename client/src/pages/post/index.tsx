import Navbar from "components/Navbar/Navbar";
import PostPopup from "components/PostPopUp/PostPopup";
import { useEffect, useState } from "react";

const Index = () => {
  const [postPopup, setPostPopup] = useState(false);

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
