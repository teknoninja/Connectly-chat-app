import { create } from 'zustand';
import { supabase } from './supabase';

// Create the Zustand store
export const useUserStore = create((set) => ({
  currentUser: null,
  isLoading: true, // Start with loading state true
  
  // Action to fetch user data based on the current session
  fetchUserInfo: async () => {
    try {
      // Get the current user session from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // If a user is logged in, fetch their profile from the 'users' table
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (error) throw error;
        set({ currentUser: data, isLoading: false });
      } else {
        // If no user is logged in, set state to null
        set({ currentUser: null, isLoading: false });
      }
    } catch (error) {
      console.error("Error fetching user info:", error.message);
      set({ currentUser: null, isLoading: false });
    }
  },

  // Action to handle user logout
  logout: async () => {
    await supabase.auth.signOut();
    set({ currentUser: null });
  }
}));