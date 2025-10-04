import { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChange, getCurrentUser, getUserProfile, createUserProfile, handleEmailVerification } from '../utils/authService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [userData, setUserData] = useState({
    day: 1,
    datetime: null,
    history: {},
    attempts: 0
  });
  const [loading, setLoading] = useState(true);
  const [initError, setInitError] = useState(null);
  const [emailVerified, setEmailVerified] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    console.log('AuthProvider: Initializing...');
    
    const unsubscribe = onAuthStateChange(async (event, session) => {
      console.log('AuthProvider: Auth state changed', event, session?.user?.id);
      
      if (!isMounted) return;
      
      if (session?.user) {
        const user = session.user;
        console.log('AuthProvider: User signed in', user.id);
        setCurrentUser(user);
        
        // Check if this is an email verification event
        if (event === 'USER_UPDATED' && user.email_confirmed_at) {
          // Show alert for email verification
          if (!emailVerified) {
            window.alert('Your email has been verified successfully! Redirecting to dashboard...');
            setEmailVerified(true);
          }
        }
        
        try {
          // Ensure profile exists
          let profile = await getUserProfile(user.id);
          console.log('AuthProvider: Profile fetch result', profile);
          
          if (!profile.data) {
            console.log('AuthProvider: Creating profile for user', user.id);
            // Create profile if it doesn't exist
            await createUserProfile(
              user.id, 
              user.user_metadata?.full_name || '', 
              user.email
            );
            // Fetch the newly created profile
            profile = await getUserProfile(user.id);
            console.log('AuthProvider: Created and fetched profile', profile);
          }
          
          setUserProfile(profile.data);
          await loadUserProgressData(user.id);
        } catch (error) {
          console.error('AuthProvider: Error handling user profile', error);
          setInitError(error.message);
        }
      } else {
        console.log('AuthProvider: No user session');
        setCurrentUser(null);
        setUserProfile(null);
        setUserData({
          day: 1,
          datetime: null,
          history: {},
          attempts: 0
        });
        setEmailVerified(false);
      }
      
      if (isMounted) {
        console.log('AuthProvider: Setting loading to false');
        setLoading(false);
      }
    });

    // Check for email verification when the app loads
    checkEmailVerificationOnLoad();

    // Check active session on initial load
    checkUserSession();

    return () => {
      console.log('AuthProvider: Cleaning up');
      isMounted = false;
      unsubscribe();
    };
  }, [emailVerified]);

  // Check if email was just verified (when user clicks verification link)
  async function checkEmailVerificationOnLoad() {
    // Check if we're on a page that might be the result of email verification
    if (window.location.search.includes('type=signup')) {
      try {
        const { verified, error } = await handleEmailVerification();
        if (verified && !emailVerified) {
          window.alert('Your email has been verified successfully! Redirecting to dashboard...');
          setEmailVerified(true);
        }
      } catch (error) {
        console.error('Error checking email verification:', error);
      }
    }
  }

  async function checkUserSession() {
    console.log('AuthProvider: Checking user session');
    
    try {
      const { user, error } = await getCurrentUser();
      
      if (error) {
        console.error('AuthProvider: Error checking user session', error);
        setInitError(error.message);
      }
      
      if (user) {
        console.log('AuthProvider: Found user session', user.id);
        setCurrentUser(user);
        
        try {
          // Ensure profile exists
          let profile = await getUserProfile(user.id);
          console.log('AuthProvider: Profile fetch result', profile);
          
          if (!profile.data) {
            console.log('AuthProvider: Creating profile for user', user.id);
            // Create profile if it doesn't exist
            await createUserProfile(
              user.id, 
              user.user_metadata?.full_name || '', 
              user.email
            );
            // Fetch the newly created profile
            profile = await getUserProfile(user.id);
            console.log('AuthProvider: Created and fetched profile', profile);
          }
          
          setUserProfile(profile.data);
          await loadUserProgressData(user.id);
        } catch (error) {
          console.error('AuthProvider: Error handling user profile', error);
          setInitError(error.message);
        }
      } else {
        console.log('AuthProvider: No user session found');
      }
    } catch (error) {
      console.error('AuthProvider: Error checking user session', error);
      setInitError(error.message);
    } finally {
      console.log('AuthProvider: Session check complete');
      setLoading(false);
    }
  }

  async function loadUserProgressData(userId) {
    console.log('AuthProvider: Loading user progress data for', userId);
    
    try {
      // This would be implemented to load user data from your storage
      // For now, we'll just initialize with default values
      setUserData({
        day: 1,
        datetime: null,
        history: {},
        attempts: 0
      });
    } catch (error) {
      console.error('AuthProvider: Error loading user progress data', error);
    }
  }

  const value = {
    currentUser,
    userProfile,
    userData,
    setUserData,
    loading,
    initError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}