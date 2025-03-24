// Travel plan request types
export interface TravelPlanRequest {
  destination: string;
  days: number;
  preferences: string;
  budget: string;
  dates: string;
  userId?: string;
}

// API response types
export interface TravelJobResponse {
  job_id: string;
  status: string;
  created_at: string;
  error?: string;
}

export interface TravelPlanResult {
  destination_research: string;
  itinerary: string;
  accommodations?: string;
}

// Application state types
export interface TravelJob extends TravelJobResponse {
  request: TravelPlanRequest;
}

// Form state types
export interface PlannerFormState {
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: string;
  preferences: string[];
  additionalNotes: string;
}

export interface FormErrors {
  [key: string]: string;
}

// API service types
export type ApiResponseStatus = 'idle' | 'loading' | 'success' | 'error';

export interface ApiState<T> {
  data: T | null;
  status: ApiResponseStatus;
  error: string | null;
}