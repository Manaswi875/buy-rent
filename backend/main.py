import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import (
    SimulationInput, SimulationOutput,
    MonteCarloRequest, MonteCarloResponse,
    SensitivityRequest, SensitivityResponse,
    StressTestRequest, StressTestResponse,
)
from simulator import run_simulation
from monte_carlo import run_monte_carlo
from sensitivity import run_sensitivity
from stress_test import run_stress_test

app = FastAPI(title="Rent vs Buy Simulator API")

# Comma-separated list of allowed origins, e.g. "https://buy-rent.vercel.app".
# Defaults to "*" for local development.
allowed_origins = os.environ.get("ALLOWED_ORIGINS", "*").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Rent vs Buy Simulator API is running"}

@app.post("/simulate", response_model=SimulationOutput)
def simulate(data: SimulationInput):
    result = run_simulation(data)
    return result

@app.post("/simulate/monte-carlo", response_model=MonteCarloResponse)
def simulate_monte_carlo(data: MonteCarloRequest):
    return run_monte_carlo(data)

@app.post("/simulate/sensitivity", response_model=SensitivityResponse)
def simulate_sensitivity(data: SensitivityRequest):
    return run_sensitivity(data)

@app.post("/simulate/stress-test", response_model=StressTestResponse)
def simulate_stress_test(data: StressTestRequest):
    return run_stress_test(data)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
