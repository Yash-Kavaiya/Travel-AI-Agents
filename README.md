# Travel AI Agent Full Stack Application

A full-stack application that uses AI agents to create personalized travel plans. Built with TypeScript (React) frontend and Python (CrewAI) backend.

## Features

- AI-powered travel destination research
- Personalized itinerary creation
- Accommodation recommendations
- Interactive travel planning experience
- Real-time job status updates

## Project Structure

```
travel-ai-agent/
├── backend/
│   ├── api.py                 # FastAPI server
│   ├── travel_agents.py       # CrewAI agent definitions
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables (create this)
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/        # UI components
    │   ├── pages/             # Page components
    │   ├── App.tsx            # Main application component
    │   ├── apiService.ts      # API service for backend communication
    │   ├── types.ts           # TypeScript type definitions
    │   └── index.tsx          # Application entry point
    ├── package.json           # Frontend dependencies
    └── tsconfig.json          # TypeScript configuration
```

## Prerequisites

- Python 3.11+
- Node.js 14+
- npm or yarn
- OpenAI API key
- Serper Dev API key (for web search capabilities)

## Setup Instructions

### Backend Setup

1. Create a Python virtual environment:
   ```bash
   cd backend
   conda create -n travelai python=3.11 -y
   conda activate travelai
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory:
   ```
   OPENAI_API_KEY=your_openai_api_key
   SERPER_API_KEY=your_serper_api_key
   ```

4. Start the FastAPI server:
   ```bash
   uvicorn api:app --reload --host 0.0.0.0 --port 8000
   ```

### Frontend Setup

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file in the frontend directory:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `POST /api/travel/plan` - Create a new travel plan
- `GET /api/travel/status/{job_id}` - Check the status of a travel plan job
- `GET /api/travel/result/{job_id}` - Get the results of a completed travel plan
- `GET /api/health` - Health check endpoint

## Environment Variables

### Backend
- `OPENAI_API_KEY` - Your OpenAI API key
- `SERPER_API_KEY` - Your Serper Dev API key (get one at https://serper.dev/api-key)

### Frontend
- `REACT_APP_API_URL` - URL of the backend API

## Deploying to Production

For production deployment, consider:

1. Containerizing the application with Docker
2. Implementing proper authentication
3. Adding rate limiting
4. Setting up a production database (instead of in-memory storage)
5. Using environment-specific configurations

## Extending the Application

Some ideas for extending this application:

1. Add user authentication and saved trips
2. Implement real-time collaboration features
3. Add trip cost estimation capabilities
4. Integrate with external booking APIs
5. Add map visualizations for itineraries
6. Implement offline mode and PWA capabilities

## License

MIT