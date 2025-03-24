import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  const handleGetStarted = () => {
    navigate('/planner');
  };
  
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Plan Your Perfect Trip with AI</h1>
        <p className="hero-subtitle">
          Let our AI travel agents create personalized itineraries, find hidden gems, 
          and recommend the best accommodations for your next adventure.
        </p>
        
        <button 
          className="btn btn-primary btn-lg"
          onClick={handleGetStarted}
        >
          Plan My Trip
        </button>
      </div>
      
      <div className="features-section">
        <h2>How It Works</h2>
        
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Tell Us Your Preferences</h3>
            <p>
              Share your destination, dates, budget, and travel style 
              to help our AI understand your needs.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Creates Your Plan</h3>
            <p>
              Our specialized AI agents research and build a 
              personalized travel plan just for you.
            </p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">✈️</div>
            <h3>Enjoy Your Journey</h3>
            <p>
              Receive a detailed day-by-day itinerary with 
              activities, accommodations, and local insights.
            </p>
          </div>
        </div>
      </div>
      
      <div className="testimonials-section">
        <h2>What Travelers Say</h2>
        
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <div className="testimonial-text">
              "The AI created the perfect itinerary for our family trip to Japan. 
              It balanced cultural experiences with kid-friendly activities!"
            </div>
            <div className="testimonial-author">- Sarah M., Family Traveler</div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              "I was amazed at how the travel plan included hidden local spots 
              that weren't on any of the typical tourist guides."
            </div>
            <div className="testimonial-author">- David L., Adventure Seeker</div>
          </div>
          
          <div className="testimonial-card">
            <div className="testimonial-text">
              "As a solo traveler on a budget, this tool helped me maximize my 
              experience while keeping costs down. Highly recommend!"
            </div>
            <div className="testimonial-author">- Emma R., Budget Explorer</div>
          </div>
        </div>
      </div>
      
      <div className="cta-section">
        <h2>Ready to plan your dream vacation?</h2>
        <p>
          Our AI travel agents are available 24/7 to create your perfect 
          personalized travel experience.
        </p>
        <button 
          className="btn btn-primary btn-lg"
          onClick={handleGetStarted}
        >
          Start Planning Now
        </button>
      </div>
    </div>
  );
};

export default HomePage;