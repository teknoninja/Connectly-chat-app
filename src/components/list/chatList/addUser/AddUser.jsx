import "./addUser.css";
import { supabase } from "../../../lib/supabase";
// 1. Import useRef and useEffect
import { useState, useRef, useEffect } from "react"; 
import { useUserStore } from "../../../lib/userStore";
import { toast } from "react-toastify";

const AddUser = ({ onClose }) => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  // 2. Create a ref for the component's main div
  const addUserRef = useRef(null);

  // 3. Add useEffect to handle "click outside"
  useEffect(() => {
    // Function to call when a click is detected
    const handleClickOutside = (event) => {
      // If the ref is set and the click was *outside* the ref's element
      if (addUserRef.current && !addUserRef.current.contains(event.target)) {
        onClose(); // Call the onClose prop
      }
    };

    // Add the event listener to the whole document
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup function: remove the listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]); // Re-run if onClose function changes

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    if (!username) return;

    try {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("username", username)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
            setUser(null);
            toast.info("No user found with that username.");
            return;
        }
        throw error;
      }
      
      if (data) {
        setUser(data);
      }
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while searching.");
    }
  };

  const handleAdd = async () => {
    try {
      // 1. Create a new chat
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({})
        .select()
        .single();

      if (chatError) throw chatError;

      // 2. Add the chat entry for the receiver
      const { error: receiverChatError } = await supabase.from('user_chats').insert({
        chat_id: newChat.id,
        user_id: user.id,
        receiver_id: currentUser.id,
      });

      if (receiverChatError) throw receiverChatError;

      // 3. Add the chat entry for the current user
      const { error: currentUserChatError } = await supabase.from('user_chats').insert({
        chat_id: newChat.id,
        user_id: currentUser.id,
        receiver_id: user.id,
      });
      
      if (currentUserChatError) throw currentUserChatError;

      toast.success("User added and chat started!");
      setUser(null); 
      console.log(newChat.id)

      // This part (from our last conversation) is still here
      if (onClose) {
        onClose();
      }

    } catch (err) {
      console.log(err);
      toast.error("Failed to add user.");
    }
  };

  return (
    // 4. Attach the ref to the main div
    <div className="addUser" ref={addUserRef}>
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar_url || "./avatar.png"} alt="" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;