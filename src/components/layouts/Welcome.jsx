import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { updateUserProfile } from '../../utils/authService';

export default function Welcome() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { currentUser, userProfile, setUserProfile } = useAuth(); // Added setUserProfile
  const navigate = useNavigate();

  // Redirect to dashboard if user already has a name
  useEffect(() => {
    if (userProfile && userProfile.full_name) {
      navigate('/dashboard');
    }
  }, [userProfile, navigate]);

  const handleCreateAccount = async () => {
    if (!name.trim()) {
      setError('Please enter your first name');
      return;
    }

    if (!currentUser) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Update user profile with first name
      const { data, error } = await updateUserProfile(currentUser.id, {
        full_name: name.trim()
      });

      if (error) {
        setError('Failed to save your name. Please try again.');
        console.error('Error updating profile:', error);
      } else {
        // Update the userProfile state in AuthContext
        setUserProfile(prev => ({
          ...prev,
          full_name: name.trim()
        }));
        
        // Successfully saved, redirect to dashboard
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Error saving name:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="welcome">
      <h3 className="text-large special-shadow">
        365 days.<br />365 words.
      </h3>
      <h6>
        Scribble your way to fluency.  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="rgb(219 234 254)" className="size-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"></path></svg>
        <br />Start the challenge today!
      </h6>
      <div>
        <input 
          value={name} 
          onChange={(evt) => {
            setName(evt.target.value);
            if (error) setError(''); // Clear error when user types
          }} 
          type="text" 
          placeholder="Enter your first name..." 
          disabled={loading}
        />
        {error && <div className="error-message" style={{ marginTop: '0.5rem' }}>{error}</div>}
        <button 
          disabled={!name.trim() || loading} 
          onClick={handleCreateAccount}
          style={{ marginTop: '1rem' }}
        >
          {loading ? 'Saving...' : <h6>Start &rarr;</h6>}
        </button>
      </div>
    </section>
  );
}