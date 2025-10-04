import { supabase } from './supabaseClient'

// Check if Supabase is configured
const isSupabaseConfigured = !!supabase;

/**
 * Save user data to either Supabase or localStorage
 * @param {string} userId - Unique identifier for the user
 * @param {string} key - Data key (e.g., 'day', 'attempts', 'history')
 * @param {any} value - Data value to store
 * @returns {Promise<boolean>} - Success status
 */
export async function saveUserData(userId, key, value) {
  if (isSupabaseConfigured && userId !== 'local-user') {
    try {
      // For Supabase, we'll store user data in a 'user_data' table
      const { data, error } = await supabase
        .from('user_data')
        .upsert({ 
          user_id: userId, 
          data_key: key, 
          data_value: JSON.stringify(value),
          updated_at: new Date()
        }, {
          onConflict: 'user_id,data_key'
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      // Fallback to localStorage for local user
      if (userId === 'local-user') {
        return saveToLocalStorage(key, value);
      }
      return false;
    }
  } else {
    // Fallback to localStorage
    return saveToLocalStorage(key, value);
  }
}

/**
 * Load user data from either Supabase or localStorage
 * @param {string} userId - Unique identifier for the user
 * @param {string} key - Data key to retrieve
 * @returns {Promise<any>} - Retrieved data
 */
export async function loadUserData(userId, key) {
  if (isSupabaseConfigured && userId !== 'local-user') {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('data_value')
        .eq('user_id', userId)
        .eq('data_key', key)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw error;
      }
      
      if (data) {
        return JSON.parse(data.data_value);
      }
      // If no data found, return null
      return null;
    } catch (error) {
      console.error('Error loading from Supabase:', error);
      return null;
    }
  } else {
    // Fallback to localStorage
    return loadFromLocalStorage(key);
  }
}

/**
 * Save data to localStorage
 * @param {string} key - Data key
 * @param {any} value - Data value
 * @returns {boolean} - Success status
 */
function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Error saving to localStorage:', error);
    return false;
  }
}

/**
 * Load data from localStorage
 * @param {string} key - Data key
 * @returns {any} - Retrieved data
 */
function loadFromLocalStorage(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
}

/**
 * Load all user data
 * @param {string} userId - Unique identifier for the user
 * @returns {Promise<object>} - All user data
 */
export async function loadAllUserData(userId) {
  if (isSupabaseConfigured && userId !== 'local-user') {
    try {
      const { data, error } = await supabase
        .from('user_data')
        .select('data_key, data_value')
        .eq('user_id', userId);

      if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
        throw error;
      }

      const userData = {};
      if (data) {
        data.forEach(item => {
          userData[item.data_key] = JSON.parse(item.data_value);
        });
      }
      
      return userData;
    } catch (error) {
      console.error('Error loading all data from Supabase:', error);
      return {};
    }
  } else {
    // Fallback to localStorage
    return loadAllFromLocalStorage();
  }
}

/**
 * Load all data from localStorage
 * @returns {object} - All user data from localStorage
 */
function loadAllFromLocalStorage() {
  try {
    return {
      username: localStorage.getItem('username') || null,
      day: localStorage.getItem('day') ? JSON.parse(localStorage.getItem('day')) : null,
      attempts: localStorage.getItem('attempts') ? parseInt(localStorage.getItem('attempts')) : 0,
      history: localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : {}
    };
  } catch (error) {
    console.error('Error loading all data from localStorage:', error);
    return {
      username: null,
      day: null,
      attempts: 0,
      history: {}
    };
  }
}