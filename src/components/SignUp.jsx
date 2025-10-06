import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signUp } from '../utils/authService';

export default function SignUp({ onSignUpSuccess, switchToSignIn }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [signUpComplete, setSignUpComplete] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Pass an empty string for name since we're not collecting it here anymore
      const { user, error } = await signUp(email, password, '');
      
      if (error) {
        setError(error.message);
        setLoading(false);
      } else if (user) {
        // Show alert to inform user about email verification
        window.alert(`Account created successfully! Please check your email (${email}) to verify your account. After verification, sign in to access your dashboard.`);
        
        // Mark sign up as complete
        setSignUpComplete(true);
        setLoading(false);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Sign up error:', err);
      setLoading(false);
    }
  };

  // If sign up is complete, show confirmation message
  if (signUpComplete) {
    return (
      <div className="auth-page">
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
            MemoWord
          </h1>
          <p style={{ marginTop: '0.5rem', color: 'var(--color-primary)', opacity: 0.9 }}>
            Check your email for verification
          </p>
        </div>
        <div className="auth-form">
          <h2 className="text-gradient">Check Your Email</h2>
          <div className="success-message">
            <p>We've sent a verification email to <strong>{email}</strong></p>
            <p>Please check your inbox and click the confirmation link to verify your account.</p>
            <p>After verification, you can sign in to access your dashboard.</p>
          </div>
          <div className="auth-switch">
            <p>Already verified? <button onClick={() => navigate('/signin')} className="link-button">Sign In</button></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 className="text-gradient" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
          Join Memoword today
        </h1>
        <p style={{ marginTop: '0.5rem', color: 'var(--color-primary)', opacity: 0.9, textAlign: 'center', width: '100%' }}>
         Build your word power, one memory at a time.
        </p>
      </div>
      <div className="auth-form">
        <h2 className="text-gradient" >Create Account</h2>
        
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
              placeholder="Create a password"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="card-button-primary" 
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-switch">
          <p>Already have an account? <button onClick={() => navigate('/signin')} className="link-button">Sign In</button></p>
        </div>
      </div>
    </div>
  );
}