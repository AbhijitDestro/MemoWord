import { supabase } from './supabaseClient';

// Check if Supabase is configured
const isSupabaseConfigured = !!supabase;

/**
 * Sign up a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @param {string} name - User's full name
 * @returns {Promise<{user: any, error: any}>}
 */
export async function signUp(email, password, name) {
  if (!isSupabaseConfigured) {
    return { 
      user: null, 
      error: { 
        message: 'Authentication is not configured. To enable authentication, please set up Supabase and add your credentials to the .env file.' 
      } 
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        }
      }
    });

    if (error) throw error;
    
    // If sign up is successful, also create a user profile
    if (data.user) {
      await createUserProfile(data.user.id, name, email);
    }

    return { user: data.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { user: null, error };
  }
}

/**
 * Sign in an existing user
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<{data: any, error: any}>}
 */
export async function signIn(email, password) {
  if (!isSupabaseConfigured) {
    return { 
      data: null,
      error: { 
        message: 'Authentication is not configured. To enable authentication, please set up Supabase and add your credentials to the .env file.' 
      } 
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Sign in error:', error);
    return { data: null, error };
  }
}

/**
 * Sign out the current user
 * @returns {Promise<{error: any}>}
 */
export async function signOut() {
  if (!isSupabaseConfigured) {
    return { 
      error: { 
        message: 'Authentication is not configured.' 
      } 
    };
  }

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Sign out error:', error);
    return { error };
  }
}

/**
 * Request password reset
 * @param {string} email - User's email
 * @returns {Promise<{error: any}>}
 */
export async function resetPassword(email) {
  if (!isSupabaseConfigured) {
    return { 
      error: { 
        message: 'Authentication is not configured. To enable authentication, please set up Supabase and add your credentials to the .env file.' 
      } 
    };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    if (error) throw error;
    return { error: null };
  } catch (error) {
    console.error('Password reset error:', error);
    return { error };
  }
}

/**
 * Get the current authenticated user
 * @returns {Promise<{user: any, error: any}>}
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured) {
    return { 
      user: null, 
      error: { 
        message: 'Authentication is not configured.' 
      } 
    };
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { user, error: null };
  } catch (error) {
    console.error('Get current user error:', error);
    return { user: null, error };
  }
}

/**
 * Listen for auth state changes
 * @param {function} callback - Function to call when auth state changes
 * @returns {function} - Unsubscribe function
 */
export function onAuthStateChange(callback) {
  if (!isSupabaseConfigured) {
    // Simulate auth state change for local user
    setTimeout(() => callback('SIGNED_OUT', null), 0);
    return () => {};
  }

  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      callback(event, session);
    }
  );

  return () => {
    subscription.unsubscribe();
  };
}

/**
 * Create a user profile in the database
 * @param {string} userId - Supabase user ID
 * @param {string} name - User's full name
 * @param {string} email - User's email
 * @returns {Promise<{data: any, error: any}>}
 */
export async function createUserProfile(userId, name, email) {
  if (!isSupabaseConfigured) {
    return { 
      data: null, 
      error: { 
        message: 'Authentication is not configured.' 
      } 
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: name,
        email: email,
        updated_at: new Date(),
      }, {
        onConflict: 'id'
      });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error creating user profile:', error);
    return { data: null, error };
  }
}

/**
 * Get user profile data
 * @param {string} userId - Supabase user ID
 * @returns {Promise<{data: any, error: any}>}
 */
export async function getUserProfile(userId) {
  if (!isSupabaseConfigured) {
    return { 
      data: null, 
      error: { 
        message: 'Authentication is not configured.' 
      } 
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { data: null, error };
  }
}

/**
 * Update user profile data
 * @param {string} userId - Supabase user ID
 * @param {object} updates - Profile updates
 * @returns {Promise<{data: any, error: any}>}
 */
export async function updateUserProfile(userId, updates) {
  if (!isSupabaseConfigured) {
    return { 
      data: null, 
      error: { 
        message: 'Authentication is not configured.' 
      } 
    };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date() })
      .eq('id', userId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return { data: null, error };
  }
}

/**
 * Handle email verification callback
 * @returns {Promise<{verified: boolean, error: any}>}
 */
export async function handleEmailVerification() {
  if (!isSupabaseConfigured) {
    return { 
      verified: false, 
      error: { 
        message: 'Authentication is not configured.' 
      } 
    };
  }

  try {
    // Get the current user to check if email is confirmed
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    if (user && user.email_confirmed_at) {
      // Email is confirmed
      return { verified: true, error: null };
    } else {
      // Email not confirmed yet
      return { verified: false, error: null };
    }
  } catch (error) {
    console.error('Email verification error:', error);
    return { verified: false, error };
  }
}