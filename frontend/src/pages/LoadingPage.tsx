import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TravelJob } from '../types';
import apiService from '../apiService';

interface LoadingPageProps {
  currentJob: TravelJob | null;
}

const LoadingPage: React.FC<LoadingPageProps> = ({ currentJob }) => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [status, setStatus] = useState<string>('processing');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  
  // Random travel facts to display while loading
  const travelFacts = [
    "The shortest commercial flight in the world lasts only 1.7 minutes between the Scottish islands of Westray and Papa Westray.",
    "Japan's Shinjuku Station is the busiest train station in the world, serving over 3.5 million passengers daily.",
    "More than 80% of the world's island nations are in the Pacific Ocean.",
    "The Great Wall of China is not visible from space with the naked eye, contrary to popular belief.",
    "There are 195 recognized countries in the world today.",
    "France is the most visited country in the world, with over 89 million annual tourists.",
    "Singapore's Changi Airport has a butterfly garden with over 1,000 butterflies.",
    "The shortest international bridge is between Spain and Portugal, measuring only 10.5 feet in length.",
    "Antarctica is the only continent with no time zones.",
    "The word 'travel' comes from the French word 'travail', which means 'work' or 'labor'."
  ];
  
  const [factIndex, setFactIndex] = useState<number>(0);
  
  // Change the fact every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex(prevIndex => (prevIndex + 1) % travelFacts.length);
    }, 10000);
    
    return () => clearInterval(interval);
  }, [travelFacts.length]);
  
  // Simulate progress
  useEffect(() => {
    if (status === 'completed' || status === 'failed') {
      return;
    }
    
    // Increase progress gradually up to 95% (reserve the last 5% for completion)
    const interval = setInterval(() => {
      setProgress(prev => {
        const increment = Math.random() * 5;
        const newProgress = prev + increment;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, [status]);
  
  // Poll for job status
  useEffect(() => {
    if (!jobId) {
      setError('No job ID provided');
      return;
    }
    
    const pollStatus = async () => {
      try {
        await apiService.pollJobStatus(
          jobId,
          (newStatus) => {
            setStatus(newStatus);
            
            if (newStatus === 'completed') {
              setProgress(100);
              // Redirect to results page after a short delay
              setTimeout(() => {
                navigate(`/results/${jobId}`);
              }, 1500);
            }
          },
          3000,  // poll every 3 seconds
          900000 // timeout after 15 minutes
        );
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError('An unknown error occurred');
        }
      }
    };
    
    pollStatus();
  }, [jobId, navigate]);
  
  // Handle manual navigation to results page
  const handleViewResults = () => {
    if (jobId) {
      navigate(`/results/${jobId}`);
    }
  };
  
  return (
    <div className="loading-page">
      <h1>Creating Your Perfect Travel Plan</h1>
      
      {error ? (
        <div className="error-container">
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/planner')}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <div className="progress-container">
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="progress-text">
              {status === 'completed' ? 'Complete!' : `${Math.round(progress)}%`}
            </div>
          </div>
          
          <div className="loading-animation">
            <div className="globe"></div>
            <div className="plane"></div>
          </div>
          
          <div className="loading-info">
            <h2>Our AI agents are working on your travel plan</h2>
            <p className="status-message">
              {status === 'queued' && 'Your request is in the queue...'}
              {status === 'processing' && 'Researching destinations and creating your perfect itinerary...'}
              {status === 'completed' && 'Your travel plan is ready!'}
            </p>
            
            <div className="travel-fact">
              <h3>Did you know?</h3>
              <p>{travelFacts[factIndex]}</p>
            </div>
          </div>
          
          {status === 'completed' && (
            <button 
              className="btn btn-success"
              onClick={handleViewResults}
            >
              View My Travel Plan
            </button>
          )}
          
          {currentJob && (
            <div className="trip-summary">
              <h3>Trip Summary</h3>
              <p>Destination: {currentJob.request.destination}</p>
              <p>Dates: {currentJob.request.dates}</p>
              <p>Duration: {currentJob.request.days} days</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LoadingPage;