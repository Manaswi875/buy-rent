# 🏡 Home Buying Decision Toolkit

A full-stack web app for deciding whether to rent or buy — not with a single deterministic guess, but by analyzing one scenario through four different lenses: a classic side-by-side comparison, a Monte Carlo risk simulation, a break-even sensitivity heatmap, and a cash-flow stress test.

**Live app**: https://buy-rent-ode9.vercel.app
**API**: https://buy-rent.onrender.com (docs at `/docs`)

## How it works

You enter your scenario once (rent, home price, mortgage rate, appreciation assumptions, etc.) and it's reused across four analysis tabs:

- **Overview** — the classic deterministic comparison: cumulative rent cost vs. net cost of buying, with a break-even year.
- **Risk Simulation** — runs hundreds of randomized futures (varying appreciation and rent growth year-to-year) and reports the probability that buying actually wins, plus a percentile fan chart, instead of one falsely-precise line.
- **Sensitivity** — a heatmap of break-even year across a grid of nearby appreciation-rate and mortgage-rate assumptions, so you can see how fragile or robust your conclusion really is.
- **Stress Test** — simulates a mortgage rate shock, income loss, or one-time emergency expense hitting partway through, and tracks monthly cash reserves for both paths to show which one runs out of cash first (and when).

## Tech Stack

- **Backend**: Python, FastAPI, Pydantic — one route per analysis lens (`/simulate`, `/simulate/monte-carlo`, `/simulate/sensitivity`, `/simulate/stress-test`), all built on a single shared amortization/appreciation simulation engine.
- **Frontend**: React, TypeScript, Vite, React Router, Recharts
- **Deployment**: Vercel (frontend) + Render (backend)

## Financial Assumptions

- **Renting**: Rent increases annually by the specified rate; renters insurance is included in monthly costs.
- **Buying**: Fixed-rate amortizing mortgage; property tax and maintenance are a percentage of home value (which appreciates annually); net cost accounts for buying/selling closing costs and remaining mortgage balance if sold.
- **Risk Simulation**: Mortgage rate itself is not randomized — only appreciation and rent growth vary year-to-year, drawn independently from a normal distribution around your point estimates.
- **Stress Test**: A renter's reserves start higher than a buyer's by exactly the down payment + buying closing costs the renter never spent — this liquidity gap is intentional, not a bug. A one-time emergency expense only hits the buyer's reserves (capital repairs are the owner's responsibility; a renter's landlord absorbs them).

## Running Locally

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1. Start the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000` (interactive docs at `/docs`).

### 2. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser to `http://localhost:5173`. By default it talks to the local backend on `:8000`; set `VITE_API_URL` (see `.env.example`) to point elsewhere.

## Deployment

- **Backend** deploys to Render via `render.yaml` (root dir `backend`, `ALLOWED_ORIGINS` env var controls CORS).
- **Frontend** deploys to Vercel (root dir `frontend`, `VITE_API_URL` env var points at the Render backend, `vercel.json` adds the SPA rewrite needed for client-side routing).

## Disclaimer

This tool is for educational purposes only and does not constitute financial advice. Market conditions, tax laws, and personal financial situations vary.
