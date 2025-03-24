import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { TravelJob, TravelPlanResult } from '../types';
import apiService from '../apiService';

interface ResultsPageProps {
  currentJob: TravelJob | null;
}

const ResultsPage: React.FC<ResultsPageProps> = ({ currentJob }) => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [results, setResults] = useState<TravelPlanResult | null>(null);
  const [activeTab, setActiveTab] = useState<string>('itinerary');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!jobId) {
      setError('No job ID provided');
      setLoading(false);
      return;
    }
    
    const fetchResults = async () => {
      try {
        const data = await apiService.getTravelPlanResult(jobId);
        setResults(data);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('Failed to load travel plan results');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [jobId]);
  
  // Handle tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  
  // Handle creating a new travel plan
  const handleNewPlan = () => {
    navigate('/planner');
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="results-page loading">
        <h1>Loading Your Travel Plan</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }
  
  // Render error state
  if (error || !results) {
    return (
      <div className="results-page error">
        <h1>Oops! Something went wrong</h1>
        <p>{error || 'Unable to load travel plan results'}</p>
        <button className="btn btn-primary" onClick={handleNewPlan}>
          Create a New Travel Plan
        </button>
      </div>
    );
  }
  
  return (
    <div className="results-page">
      <header className="results-header">
        <h1>Your Travel Plan</h1>
        {currentJob && (
          <div className="trip-overview">
            <h2>{currentJob.request.destination}</h2>
            <div className="trip-details">
              <span className="trip-dates">{currentJob.request.dates}</span>
              <span className="trip-duration">{currentJob.request.days} days</span>
            </div>
          </div>
        )}
        
        <div className="action-buttons">
          <button 
            className="btn btn-secondary"
            onClick={() => window.print()}
          >
            Print / Save PDF
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleNewPlan}
          >
            Plan Another Trip
          </button>
        </div>
      </header>
      
      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'itinerary' ? 'active' : ''}`}
            onClick={() => handleTabChange('itinerary')}
          >
            Itinerary
          </button>
          <button 
            className={`tab ${activeTab === 'accommodations' ? 'active' : ''}`}
            onClick={() => handleTabChange('accommodations')}
          >
            Accommodations
          </button>
          <button 
            className={`tab ${activeTab === 'research' ? 'active' : ''}`}
            onClick={() => handleTabChange('research')}
          >
            Destination Info
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'itinerary' && (
            <div className="itinerary-tab">
              <ReactMarkdown>
                {results.itinerary}
              </ReactMarkdown>
            </div>
          )}
          
          {activeTab === 'accommodations' && (
            <div className="accommodations-tab">
              {results.accommodations ? (
                <ReactMarkdown>
                  {results.accommodations}
                </ReactMarkdown>
              ) : (
                <div className="no-content">
                  <p>No accommodation recommendations available.</p>
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'research' && (
            <div className="research-tab">
              <ReactMarkdown>
                {results.destination_research}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      
      <div className="share-container">
        <h3>Share Your Travel Plan</h3>
        <div className="share-buttons">
          <button className="share-btn email">Email</button>
          <button className="share-btn twitter">Twitter</button>
          <button className="share-btn facebook">Facebook</button>
          <button className="share-btn whatsapp">WhatsApp</button>
        </div>
      </div>
      
      <div className="feedback-container">
        <h3>How was your experience?</h3>
        <div className="rating-stars">
          {[1, 2, 3, 4, 5].map(star => (
            <span key={star} className="star">★</span>
          ))}
        </div>
        <textarea 
          placeholder="Tell us what you think about your travel plan..."
          rows={3}
        ></textarea>
        <button className="btn btn-secondary">Submit Feedback</button>
      </div>
    </div>
  );
};

export default ResultsPage;