import { useEffect } from "react";
import Chat from "./components/chat/Chats";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { useUserStore } from "./components/lib/userStore";
import { useChatStore } from "./components/lib/chatStore";
import { supabase } from "./components/lib/supabase"; // Import the Supabase client
import Background from "./background";


const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = useChatStore();

  useEffect(() => {
    // Fetch user info on initial load
    fetchUserInfo();

    // Listen for authentication state changes (login, logout)
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // When the auth state changes, re-fetch the user info
        fetchUserInfo();
      }
    );

    // Cleanup the listener when the component unmounts
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [fetchUserInfo]);

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <>
    <Background/>
    <div className="container">
      {currentUser ? (
        <>
          <List />
          {chatId && <Chat />}
          {chatId && <Detail />}
        </>
      ) : (
        <Login />
        )}
      <Notification />
    </div>
        </>
  );
};

export default App;
