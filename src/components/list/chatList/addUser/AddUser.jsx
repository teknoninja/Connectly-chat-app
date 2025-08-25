import "./addUser.css";
import { supabase } from "../../../lib/supabase"; // Import supabase client
import { useState } from "react";
import { useUserStore } from "../../../lib/userStore";
import { toast } from "react-toastify";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    if (!username) return;

    try {
      // --- FIX IS HERE ---
      // Changed the column name back to "username"
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("username", username)
        .single();

      if (error) {
        // Handle case where no user is found, which is not an actual error
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
      setUser(null); // Clear the user after adding
      console.log(newChat.id)

    } catch (err) {
      console.log(err);
      toast.error("Failed to add user.");
    }
  };

  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" placeholder="Username" name="username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            {/* Also updated this to user.username */}
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
