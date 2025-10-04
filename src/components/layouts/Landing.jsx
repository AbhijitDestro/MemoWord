import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../App.jsx';
import { getPublicUrl } from '../../utils/storage';

export default function Landing() {
  const { setSelectedPage, setAuthMode } = useContext(AppContext);
  const [testimonialAvatarUrl, setTestimonialAvatarUrl] = useState('');
  const [showSetupInfo, setShowSetupInfo] = useState(false);

  useEffect(() => {
    // In a real app, this would be dynamically fetched from Supabase
    // For now, we'll use the Pexels image as an example
    setTestimonialAvatarUrl('https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg');
  }, []);

  const features = [
    {
      title: "Vocabulary Building",
      description: "Expand your vocabulary with carefully curated words and definitions tailored to your learning level.",
      icon: "ri-book-open-line"
    },
    {
      title: "Daily Challenges",
      description: "Engage in daily word challenges to reinforce your learning and track your progress.",
      icon: "ri-calendar-check-line"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed statistics and achievement milestones.",
      icon: "ri-line-chart-line"
    },
    {
      title: "Spaced Repetition",
      description: "Optimize learning with scientifically-proven spaced repetition techniques for long-term retention.",
      icon: "ri-repeat-line"
    }
  ];

  const handleGetStarted = () => {
    setAuthMode('signup');
    setSelectedPage(4);
  };

  const handleSignIn = () => {
    setAuthMode('signin');
    setSelectedPage(4);
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title text-gradient">Master Vocabulary<br />The Smart Way</h1>
          <p className="hero-description">
            Transform your language skills with our scientifically-backed learning system. 
            MemoWord helps you learn, retain, and master new words efficiently.
          </p>
          <div className="hero-buttons">
            <button className="secondary-button card-button-secondary" onClick={handleGetStarted}>
              Get Started
            </button>
            <button className="secondary-button card-button-primary" onClick={handleSignIn}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>Powerful Features</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Everything you need to master vocabulary effectively</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div className="feature-card card" key={index}>
              <div className="feature-icon">
                <i className={`icon-placeholder ${feature.icon}`}></i>
              </div>
              <h3 className="feature-title" style={{ textAlign: 'center' }}>{feature.title}</h3>
              <p className="feature-description" style={{ textAlign: 'center' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>How It Works</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Simple steps to vocabulary mastery</p>
        </div>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3 className="step-title" style={{ textAlign: 'center' }}>Sign Up</h3>
            <p className="step-description" style={{ textAlign: 'center' }}>Create your account and set your learning preferences</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3 className="step-title" style={{ textAlign: 'center' }}>Learn Daily</h3>
            <p className="step-description" style={{ textAlign: 'center' }}>Complete daily challenges and exercises</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3 className="step-title" style={{ textAlign: 'center' }}>Track Progress</h3>
            <p className="step-description" style={{ textAlign: 'center' }}>Monitor your improvement with detailed analytics</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3 className="step-title" style={{ textAlign: 'center' }}>Master Words</h3>
            <p className="step-description" style={{ textAlign: 'center' }}>Achieve long-term retention with spaced repetition</p>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <h3 className="step-title" style={{ textAlign: 'center' }}>Review Concepts</h3>
            <p className="step-description" style={{ textAlign: 'center' }}>Reinforce learning with personalized review sessions</p>
          </div>
          <div className="step">
            <div className="step-number">6</div>
            <h3 className="step-title" style={{ textAlign: 'center' }}>Achieve Fluency</h3>
            <p className="step-description" style={{ textAlign: 'center' }}>Build confidence through progressive language challenges</p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="section-header" style={{ textAlign: 'center' }}>
          <h2 className="section-title" style={{ textAlign: 'center' }}>What Learners Say</h2>
          <p className="section-subtitle" style={{ textAlign: 'center' }}>Join thousands of satisfied users</p>
        </div>
        <div className="testimonials-container">
          <div className="testimonial-card card">
            <p className="testimonial-text" style={{ textAlign: 'center' }}>
              "MemoWord transformed my vocabulary learning. I've learned more words in 3 months than I did in years of traditional study."
            </p>
            <div className="testimonial-author">
              <img 
                src={testimonialAvatarUrl} 
                alt="Sarah Johnson" 
                className="author-avatar"
                onError={(e) => {
                  // Fallback to a default avatar if the image fails to load
                  e.target.src = 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg';
                }}
              />
              <div className="author-info">
                <p className="author-name">Sarah Johnson</p>
                <p className="author-title">Language Student</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2 className="cta-title" style={{ textAlign: 'center' }}>Start Your Vocabulary Journey Today</h2>
        <p className="cta-description" style={{ textAlign: 'center' }}>
          Join thousands of learners who have transformed their language skills with MemoWord
        </p>
        <button className="cta-button card-button-primary" onClick={handleGetStarted}>
          Get Started Now
        </button>
      </section>
    </div>
  );
}