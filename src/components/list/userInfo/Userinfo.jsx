import React from 'react';
import "./userInfo.css";
import { useUserStore } from "../../lib/userStore"; // Import the Zustand store

const Userinfo = () => {
  // Get the current user's data from the Zustand store
  const { currentUser } = useUserStore();

  return (
    <div className='userInfo'>
      <div className="user">
        {/* Display the user's avatar, or a default one if it doesn't exist */}
        <img src={currentUser.avatar_url || "./avatar.png"} alt="User Avatar" />
        {/* Display the user's username */}
        <h2>{currentUser.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="More options" />
        <img src="./video.png" alt="Start video call" />
        <img src="./edit.png" alt="Edit" />
      </div>
    </div>
  );
};

export default Userinfo;
