import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, resetPassword } from '../utils/authService';
import { useAuth } from '../contexts/AuthContext';

export default function SignIn({ onSignInSuccess, switchToSignUp }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  // Redirect to dashboard if user is already signed in
  useEffect(() => {
    if (currentUser) {
      onSignInSuccess(currentUser);
    }
  }, [currentUser, onSignInSuccess]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
        setLoading(false);
      } else if (data) {
        // User signed in successfully, redirect to dashboard
        onSignInSuccess(data.user);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign in error:', err);
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetSuccess(false);

    try {
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        setError(error.message);
      } else {
        setResetSuccess(true);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (showResetForm) {
    return (
      <div className="auth-page">
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            MemoWord
          </h1>
          <p style={{ marginTop: '0.5rem', color: 'var(--color-primary)', opacity: 0.9 }}>
            Reset your password
          </p>
        </div>
        <div className="auth-form">
          <h2 className="text-gradient">Reset Password</h2>
          {error && <div className="error-message">{error}</div>}
          {resetSuccess && (
            <div className="success-message">
              Password reset instructions have been sent to your email.
            </div>
          )}
          <form onSubmit={handleResetPassword}>
            <div className="form-group">
              <label htmlFor="reset-email">Email</label>
              <input
                id="reset-email"
                type="email"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>
            <button 
              type="submit" 
              className="card-button-primary" 
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </form>
          <div className="auth-switch">
            <p>
              <button 
                onClick={() => {
                  setShowResetForm(false);
                  setError('');
                  setResetSuccess(false);
                }} 
                className="link-button"
              >
                Back to Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Welcome back to Memoword
        </h1>
        <p style={{ marginTop: '0.5rem', color: 'var(--color-primary)', opacity: 0.9, textAlign: 'center', width: '100%' }}>
          Keep your vocabulary journey going — one word at a time.
        </p>
      </div>
      <div className="auth-form">
        <h2 className="text-gradient">Sign In</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="card-button-primary" 
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        <div className="auth-switch">
          <p>
            <button 
              onClick={() => setShowResetForm(true)} 
              className="link-button"
              style={{ fontSize: '0.9rem', marginBottom: '1rem', display: 'block' }}
            >
              Forgot Password?
            </button>
          </p>
          <p>Don't have an account? <button onClick={() => navigate('/signup')} className="link-button">Sign Up</button></p>
        </div>
      </div>
    </div>
  );
}