import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="about-page">
      <div className="about-header">
        <h1>About Travel AI</h1>
        <p className="subtitle">
          Using artificial intelligence to create unforgettable travel experiences
        </p>
      </div>
      
      <div className="about-section">
        <h2>Our Mission</h2>
        <p>
          At Travel AI, we believe that planning a trip should be as enjoyable as the journey itself. 
          Our mission is to harness the power of artificial intelligence to create personalized, 
          comprehensive travel plans that help you discover the world in a way that suits your unique preferences.
        </p>
        <p>
          Whether you're a solo adventurer seeking hidden gems, a family looking for kid-friendly activities, 
          or a couple planning a romantic getaway, our AI travel agents are designed to understand your needs 
          and create the perfect itinerary just for you.
        </p>
      </div>
      
      <div className="about-section">
        <h2>How Our AI Works</h2>
        <div className="ai-explainer">
          <div className="ai-step">
            <h3>Research Agent</h3>
            <p>
              Our Research Agent scours the web for up-to-date information about your chosen destination, 
              including attractions, local customs, seasonal considerations, and safety information.
            </p>
          </div>
          
          <div className="ai-step">
            <h3>Itinerary Planner</h3>
            <p>
              The Itinerary Planner takes your preferences and the research data to craft a day-by-day 
              schedule that maximizes your time while respecting your desired pace of travel.
            </p>
          </div>
          
          <div className="ai-step">
            <h3>Accommodation Specialist</h3>
            <p>
              Our Accommodation Agent finds the best places to stay based on your budget, preferred location, 
              and specific amenities you require, ensuring you'll feel at home wherever you go.
            </p>
          </div>
        </div>
      </div>
      
      <div className="about-section">
        <h2>Our Technology</h2>
        <p>
          Travel AI is built using a cutting-edge AI framework called CrewAI that allows multiple specialized 
          AI agents to collaborate on creating your perfect travel plan. Each agent brings expertise in a specific 
          aspect of travel planning, working together to create comprehensive recommendations.
        </p>
        <p>
          Our system continuously learns from traveler feedback to improve recommendations and keep 
          information current. Unlike static travel guides or generic planning tools, our AI adapts to 
          emerging trends, seasonal changes, and your personal preferences.
        </p>
      </div>
      
      <div className="about-section">
        <h2>Privacy & Data</h2>
        <p>
          We value your privacy. The information you provide is used solely to create your travel plans 
          and is never sold to third parties. Our AI needs your preferences to create personalized 
          recommendations, but we're committed to protecting your data.
        </p>
      </div>
      
      <div className="cta-container">
        <h2>Ready to experience the future of travel planning?</h2>
        <button 
          className="btn btn-primary btn-lg"
          onClick={() => navigate('/planner')}
        >
          Plan Your Trip Now
        </button>
      </div>
    </div>
  );
};

export default AboutPage;