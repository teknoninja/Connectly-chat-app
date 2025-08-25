import React, { useState } from 'react';
import "./login.css";
import { toast } from 'react-toastify';
import { supabase } from "../lib/supabase.js";
import upload from "../lib/upload.js";

const Login = () => {
  const [avatar, setAvatar] = useState({
    file: null,
    url: "",
  });
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);

    try {
      if (isRegistering) {
        // --- REGISTRATION LOGIC ---
        if (password.length < 6) {
          toast.error("Password should be at least 6 characters.");
          return;
        }
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (authError) throw authError;

        const imgUrl = await upload(avatar.file);

        const { error: insertError } = await supabase.from('users').insert({
          id: authData.user.id,
          username,
          email,
          avatar_url: imgUrl,
        });
        if (insertError) throw insertError;

        toast.success("Account created! Please check your email to verify.");
      } else {
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Logged in successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      {isRegistering ? (
        // --- REGISTRATION FORM ---
        <div className="item">
          <h2>Create an Account</h2>
          <form onSubmit={handleAuth}>
            <label htmlFor="file">
              <img src={avatar.url || "./avatar.png"} alt="Avatar Preview" />
              Upload Profile image
            </label>
            <input type="file" id='file' style={{ display: "none" }} onChange={handleAvatar} />
            <input type="text" placeholder='Username' name='username' required />
            <input type="email" placeholder='Email' name='email' required />
            <input type="password" placeholder='Password' name='password' required />
            <button className="btn liquid" disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
          </form>
          <p>
            Already have an account?{" "}
            <a href="#" onClick={() => setIsRegistering(false)}>
              Login
            </a>
          </p>
        </div>
      ) : (
        // --- LOGIN FORM ---
        <div className="item">
          <h1>CONNECTly  💬 </h1>
          <form onSubmit={handleAuth}>
            <input type="email" placeholder='Email' name='email' required />
            <input type="password" placeholder='Password' name='password' required />
            <button className="btn liquid" disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
          </form>
          <p>
            Don't have an account?{" "}
            <a href="#" onClick={() => setIsRegistering(true)}>
              Register
            </a>
          </p>
        </div>
      )}
    </div>
  );
};

export default Login;
