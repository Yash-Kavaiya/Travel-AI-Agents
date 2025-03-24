import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlannerFormState, 
  FormErrors, 
  TravelPlanRequest,
  TravelJob
} from '../types';
import apiService from '../apiService';

interface PlannerPageProps {
  setCurrentJob: (job: TravelJob) => void;
}

const PlannerPage: React.FC<PlannerPageProps> = ({ setCurrentJob }) => {
  const navigate = useNavigate();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const [formState, setFormState] = useState<PlannerFormState>({
    destination: '',
    startDate: '',
    endDate: '',
    travelers: 1,
    budget: '',
    preferences: [],
    additionalNotes: ''
  });
  
  // Preference options
  const preferenceOptions = [
    'Cultural experiences',
    'Historical sites',
    'Nature and outdoors',
    'Food and dining',
    'Shopping',
    'Relaxation',
    'Adventure activities',
    'Family-friendly',
    'Luxury',
    'Budget-friendly',
    'Off the beaten path',
    'Local experiences'
  ];
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value
    });
  };
  
  // Handle numeric input changes
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: parseInt(value) || 0
    });
  };
  
  // Handle preference checkbox changes
  const handlePreferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormState({
        ...formState,
        preferences: [...formState.preferences, value]
      });
    } else {
      setFormState({
        ...formState,
        preferences: formState.preferences.filter(pref => pref !== value)
      });
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formState.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!formState.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formState.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formState.startDate && formState.endDate) {
      const start = new Date(formState.startDate);
      const end = new Date(formState.endDate);
      
      if (start > end) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    
    if (!formState.budget.trim()) {
      newErrors.budget = 'Budget is required';
    }
    
    if (formState.preferences.length === 0) {
      newErrors.preferences = 'Select at least one preference';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Calculate trip duration in days
  const calculateDuration = (): number => {
    if (!formState.startDate || !formState.endDate) return 1;
    
    const start = new Date(formState.startDate);
    const end = new Date(formState.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays || 1;
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the travel plan request
      const travelRequest: TravelPlanRequest = {
        destination: formState.destination,
        days: calculateDuration(),
        preferences: [...formState.preferences, formState.additionalNotes].filter(Boolean).join(', '),
        budget: formState.budget,
        dates: `${formState.startDate} to ${formState.endDate}`
      };
      
      // Submit the request
      const response = await apiService.createTravelPlan(travelRequest);
      
      // Create a job object to track this request
      const newJob: TravelJob = {
        ...response,
        request: travelRequest
      };
      
      // Update the current job in parent component
      setCurrentJob(newJob);
      
      // Redirect to the loading page
      navigate(`/loading/${response.job_id}`);
      
    } catch (error) {
      console.error('Error submitting travel plan:', error);
      setErrors({
        submit: 'Failed to submit travel plan. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="planner-page">
      <h1>Create Your Perfect Travel Plan</h1>
      <p className="subtitle">Tell us about your dream trip and our AI agents will create a personalized itinerary</p>
      
      <form onSubmit={handleSubmit} className="planner-form">
        <div className="form-section">
          <h2>Destination Details</h2>
          
          <div className="form-group">
            <label htmlFor="destination">Where do you want to go?</label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formState.destination}
              onChange={handleInputChange}
              placeholder="City, Country or Region"
              className={errors.destination ? 'error' : ''}
            />
            {errors.destination && <div className="error-message">{errors.destination}</div>}
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formState.startDate}
                onChange={handleInputChange}
                className={errors.startDate ? 'error' : ''}
              />
              {errors.startDate && <div className="error-message">{errors.startDate}</div>}
            </div>
            
            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formState.endDate}
                onChange={handleInputChange}
                className={errors.endDate ? 'error' : ''}
              />
              {errors.endDate && <div className="error-message">{errors.endDate}</div>}
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="travelers">Number of Travelers</label>
              <input
                type="number"
                id="travelers"
                name="travelers"
                min="1"
                max="20"
                value={formState.travelers}
                onChange={handleNumberChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="budget">Budget</label>
              <input
                type="text"
                id="budget"
                name="budget"
                value={formState.budget}
                onChange={handleInputChange}
                placeholder="e.g. $1000 total, $200 per night"
                className={errors.budget ? 'error' : ''}
              />
              {errors.budget && <div className="error-message">{errors.budget}</div>}
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <h2>Travel Preferences</h2>
          
          <div className="preferences-grid">
            {preferenceOptions.map(preference => (
              <div key={preference} className="preference-option">
                <input
                  type="checkbox"
                  id={`pref-${preference}`}
                  name="preferences"
                  value={preference}
                  checked={formState.preferences.includes(preference)}
                  onChange={handlePreferenceChange}
                />
                <label htmlFor={`pref-${preference}`}>{preference}</label>
              </div>
            ))}
          </div>
          {errors.preferences && <div className="error-message">{errors.preferences}</div>}
          
          <div className="form-group">
            <label htmlFor="additionalNotes">Additional Notes or Requirements</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formState.additionalNotes}
              onChange={handleInputChange}
              placeholder="Any specific requirements, interests, or things to avoid..."
              rows={4}
            />
          </div>
        </div>
        
        {errors.submit && <div className="error-banner">{errors.submit}</div>}
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Creating Travel Plan...' : 'Create My Travel Plan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlannerPage;