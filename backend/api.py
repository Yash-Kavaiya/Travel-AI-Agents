from fastapi import FastAPI, BackgroundTasks, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any, List
import uuid
import logging
import travel_agents
from datetime import datetime

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Travel AI API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory store for tasks (replace with database in production)
travel_jobs = {}
results_store = {}

class TravelRequest(BaseModel):
    destination: str
    days: int
    preferences: str
    budget: str
    dates: str
    user_id: Optional[str] = None

class TravelResponse(BaseModel):
    job_id: str
    status: str
    created_at: str
    
class TravelResult(BaseModel):
    destination_research: str
    itinerary: str
    accommodations: Optional[str] = None

def generate_id():
    return str(uuid.uuid4())

async def process_travel_plan(job_id: str, request: TravelRequest):
    """Background task to process travel planning requests"""
    try:
        logger.info(f"Starting travel planning job {job_id} for {request.destination}")
        travel_jobs[job_id]["status"] = "processing"
        
        # Generate travel plan using our agents
        result = travel_agents.generate_travel_plan(
            destination=request.destination,
            days=request.days,
            preferences=request.preferences,
            budget=request.budget,
            dates=request.dates
        )
        
        # Store the result
        results_store[job_id] = result
        travel_jobs[job_id]["status"] = "completed"
        logger.info(f"Completed travel planning job {job_id}")
        
    except Exception as e:
        logger.error(f"Error processing job {job_id}: {str(e)}")
        travel_jobs[job_id]["status"] = "failed"
        travel_jobs[job_id]["error"] = str(e)

@app.post("/api/travel/plan", response_model=TravelResponse)
async def create_travel_plan(request: TravelRequest, background_tasks: BackgroundTasks):
    """Endpoint to start a travel planning job"""
    job_id = generate_id()
    timestamp = datetime.now().isoformat()
    
    # Register the job
    travel_jobs[job_id] = {
        "request": request.dict(),
        "status": "queued",
        "created_at": timestamp
    }
    
    # Start the background process
    background_tasks.add_task(process_travel_plan, job_id, request)
    
    return TravelResponse(
        job_id=job_id,
        status="queued",
        created_at=timestamp
    )

@app.get("/api/travel/status/{job_id}")
async def get_job_status(job_id: str):
    """Check the status of a travel planning job"""
    if job_id not in travel_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job = travel_jobs[job_id]
    return {
        "job_id": job_id,
        "status": job["status"],
        "created_at": job["created_at"],
        "error": job.get("error")
    }

@app.get("/api/travel/result/{job_id}", response_model=TravelResult)
async def get_travel_plan(job_id: str):
    """Get the results of a completed travel planning job"""
    if job_id not in travel_jobs:
        raise HTTPException(status_code=404, detail="Job not found")
        
    job = travel_jobs[job_id]
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail=f"Job is not completed. Current status: {job['status']}")
        
    if job_id not in results_store:
        raise HTTPException(status_code=404, detail="Results not found")
        
    return results_store[job_id]

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)