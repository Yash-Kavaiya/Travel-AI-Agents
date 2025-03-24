import os
from dotenv import load_dotenv
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool
from langchain_openai import ChatOpenAI

# Load environment variables
load_dotenv()

SERPER_API_KEY = os.getenv("SERPER_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

os.environ["SERPER_API_KEY"] = SERPER_API_KEY
os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
os.environ["OPENAI_MODEL"] = "gpt-4-32k"  # You can adjust the model as needed

# Initialize search tool
search_tool = SerperDevTool()

def create_travel_research_agent():
    """Create a destination research agent"""
    return Agent(
        role='Travel Researcher',
        goal='Find detailed information about travel destinations',
        verbose=True,
        memory=True,
        backstory=(
            """You are an expert travel researcher with extensive knowledge of global 
            destinations. You stay up-to-date with the latest travel trends, 
            local customs, and hidden gems at each location."""
        ),
        tools=[search_tool],
        allow_delegation=True
    )

def create_itinerary_planner_agent():
    """Create an itinerary planning agent"""
    return Agent(
        role='Itinerary Planner',
        goal='Create optimal travel itineraries based on preferences and constraints',
        verbose=True,
        memory=True,
        backstory=(
            """You are a master travel planner who can create the perfect itinerary
            balancing sightseeing, relaxation, and local experiences. You excel at
            optimizing for time constraints, budgets, and traveler preferences."""
        ),
        tools=[search_tool],
        allow_delegation=False
    )

def create_accommodation_agent():
    """Create an accommodation recommendation agent"""
    return Agent(
        role='Accommodation Specialist',
        goal='Find ideal accommodations based on traveler preferences',
        verbose=True,
        memory=True,
        backstory=(
            """You specialize in finding the perfect places to stay, from luxury hotels
            to unique local stays. You consider location, amenities, budget, and
            traveler preferences to make ideal recommendations."""
        ),
        tools=[search_tool],
        allow_delegation=False
    )

def create_research_task(agent, destination, preferences):
    """Create a research task for the given destination"""
    return Task(
        description=(
            f"Research {destination} as a travel destination. "
            f"Consider the following preferences: {preferences}. "
            f"Identify key attractions, best times to visit, local customs, "
            f"transportation options, and safety considerations. "
            f"Focus on both popular attractions and hidden gems."
        ),
        expected_output="A comprehensive report on the destination with key travel insights.",
        tools=[search_tool],
        agent=agent
    )

def create_itinerary_task(agent, destination, days, preferences, research_result):
    """Create an itinerary planning task"""
    return Task(
        description=(
            f"Create a detailed {days}-day itinerary for {destination}. "
            f"Consider these traveler preferences: {preferences}. "
            f"Use the research information provided: {research_result}. "
            f"Include day-by-day activities, recommended times, transportation between sites, "
            f"meal suggestions, and estimated costs. Balance sightseeing with relaxation time."
        ),
        expected_output="A detailed day-by-day travel itinerary in markdown format.",
        tools=[search_tool],
        agent=agent
    )

def create_accommodation_task(agent, destination, preferences, budget, dates):
    """Create an accommodation recommendation task"""
    return Task(
        description=(
            f"Find ideal accommodations in {destination} for these dates: {dates}. "
            f"Traveler preferences: {preferences}. Budget: {budget}. "
            f"Recommend 3-5 options with pros and cons for each. Consider location, "
            f"amenities, reviews, and value for money."
        ),
        expected_output="A list of 3-5 accommodation recommendations with details and reasoning.",
        tools=[search_tool],
        agent=agent
    )

def generate_travel_plan(destination, days, preferences, budget, dates):
    """Generate a complete travel plan using multiple agents"""
    # Create agents
    research_agent = create_travel_research_agent()
    itinerary_agent = create_itinerary_planner_agent()
    accommodation_agent = create_accommodation_agent()
    
    # Create tasks
    research_task = create_research_task(research_agent, destination, preferences)
    
    # First-phase crew just for research
    research_crew = Crew(
        agents=[research_agent],
        tasks=[research_task],
        process=Process.sequential
    )
    
    # Execute research
    research_result = research_crew.kickoff()
    
    # Create dependent tasks with research results
    itinerary_task = create_itinerary_task(
        itinerary_agent, destination, days, preferences, research_result
    )
    accommodation_task = create_accommodation_task(
        accommodation_agent, destination, preferences, budget, dates
    )
    
    # Second-phase crew for planning
    planning_crew = Crew(
        agents=[itinerary_agent, accommodation_agent],
        tasks=[itinerary_task, accommodation_task],
        process=Process.sequential
    )
    
    # Execute planning
    planning_result = planning_crew.kickoff()
    
    # Combine results into complete travel package
    return {
        "destination_research": research_result,
        "itinerary": planning_result[0] if isinstance(planning_result, list) else planning_result,
        "accommodations": planning_result[1] if isinstance(planning_result, list) else None
    }

if __name__ == "__main__":
    # Example usage
    plan = generate_travel_plan(
        destination="Kyoto, Japan",
        days=5,
        preferences="Cultural experiences, local cuisine, moderate walking",
        budget="$200 per night for accommodation",
        dates="April 15-20, 2025"
    )
    
    print("===== DESTINATION RESEARCH =====")
    print(plan["destination_research"])
    print("\n===== ITINERARY =====")
    print(plan["itinerary"])
    print("\n===== ACCOMMODATIONS =====")
    print(plan["accommodations"])