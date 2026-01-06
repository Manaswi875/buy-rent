# Rent vs Buy Simulator

A full-stack web application to compare the long-term financial cost of renting versus buying a home. This tool helps users make informed financial decisions by simulating costs, equity buildup, and net value over time.

![Rent vs Buy Simulator](./frontend/public/vite.svg) 
*(Note: Replace with actual screenshot in production)*

## Features

- **Financial Modeling**: Detailed calculation of rent (with inflation) vs buy (mortgage, tax, maintenance, appreciation, closing costs).
- **Interactive Simulation**: Adjust 13+ parameters including home price, interest rates, and investment horizons.
- **Visualizations**: Dynamic charts comparing cumulative net costs and equity over time.
- **Recommendations**: clear financial summary and break-even analysis.

## Tech Stack

- **Backend**: Python, FastAPI, Pydantic
- **Frontend**: React, TypeScript, Vite, Recharts
- **Styling**: Vanilla CSS (Responsive Design)

## Financial Assumptions

- **Renting**:
    - Rent increases annually by the specified "Annual Rent Increase (%)".
    - Renters insurance is included in monthly costs.
    - **Note**: Opportunity cost of investing the down payment difference is *not* currently modeled (pure cash-flow/net-worth comparison).

- **Buying**:
    - Mortgage is a standard fixed-rate amortizing loan.
    - Property tax and maintenance are calculated as a percentage of the home value (which appreciates annually).
    - **Net Cost** for buying is calculated as: `Cumulative Out-of-Pocket Expenses - (Home Value - Remaining Mortgage - Selling Closing Costs)`.
    - Expenses include: Mortgage Interest, Principal (equity), Property Tax, Maintenance, Buying/Selling Closing Costs.

## Project Structure

```
rent-vs-buy/
├── backend/        # FastAPI application
│   ├── main.py     # API Entry point
│   ├── simulator.py# Financial logic
│   └── schemas.py  # Pydantic models
├── frontend/       # React application
│   ├── src/        # Source code
│   └── ...
└── README.md
```

## How to Run Locally

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

The API will be available at `http://localhost:8000` (Docs at `/docs`).

### 2. Start the Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open your browser to `http://localhost:5173`.

## Disclaimer

This tool is for educational purposes only and does not constitute financial advice. Market conditions, tax laws, and personal financial situations vary.
