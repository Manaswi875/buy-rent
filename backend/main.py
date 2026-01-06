from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import SimulationInput, SimulationOutput
from simulator import run_simulation

app = FastAPI(title="Rent vs Buy Simulator API")

# Configure CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For minimal setup, allow all. In production specific origins.
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
