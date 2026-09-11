import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import SimulationInput, SimulationOutput
from simulator import run_simulation

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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
