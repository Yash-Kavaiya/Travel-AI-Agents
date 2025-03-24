import { TravelPlanRequest, TravelJobResponse, TravelPlanResult } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

class ApiService {
  /**
   * Submit a new travel plan request
   */
  async createTravelPlan(request: TravelPlanRequest): Promise<TravelJobResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/plan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create travel plan');
      }

      return await response.json();
    } catch (error) {
      console.error('API error creating travel plan:', error);
      throw error;
    }
  }

  /**
   * Check the status of a travel plan job
   */
  async getTravelPlanStatus(jobId: string): Promise<TravelJobResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/status/${jobId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get job status');
      }

      return await response.json();
    } catch (error) {
      console.error('API error checking job status:', error);
      throw error;
    }
  }

  /**
   * Get the results of a completed travel plan
   */
  async getTravelPlanResult(jobId: string): Promise<TravelPlanResult> {
    try {
      const response = await fetch(`${API_BASE_URL}/travel/result/${jobId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to get travel plan results');
      }

      return await response.json();
    } catch (error) {
      console.error('API error getting results:', error);
      throw error;
    }
  }

  /**
   * Poll for job status until completion or failure
   */
  async pollJobStatus(
    jobId: string, 
    onStatusChange: (status: string) => void,
    interval = 3000,
    timeout = 300000
  ): Promise<void> {
    const startTime = Date.now();
    
    const checkStatus = async () => {
      if (Date.now() - startTime > timeout) {
        throw new Error('Job polling timed out');
      }
      
      const jobStatus = await this.getTravelPlanStatus(jobId);
      onStatusChange(jobStatus.status);
      
      if (jobStatus.status === 'completed') {
        return;
      } else if (jobStatus.status === 'failed') {
        throw new Error(jobStatus.error || 'Job failed');
      } else {
        // Continue polling
        await new Promise(resolve => setTimeout(resolve, interval));
        return checkStatus();
      }
    };
    
    return checkStatus();
  }
}

export default new ApiService();