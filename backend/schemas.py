from pydantic import BaseModel, Field, field_validator, model_validator
from typing import List, Literal

class SimulationInput(BaseModel):
    # Common
    years_to_simulate: int = Field(..., gt=0, le=50, description="Number of years to simulate")

    # Renting
    monthly_rent: float = Field(..., gt=0, description="Current monthly rent")
    annual_rent_increase_percent: float = Field(..., ge=0, description="Annual rent increase in percentage")
    rent_insurance_monthly: float = Field(0, ge=0, description="Monthly renters insurance")

    # Buying
    home_price: float = Field(..., gt=0, description="Price of the home")
    down_payment_percent: float = Field(..., ge=0, le=100, description="Down payment percentage")
    mortgage_interest_rate_percent: float = Field(..., ge=0, description="Annual mortgage interest rate percentage")
    loan_term_years: int = Field(30, gt=0, description="Loan term in years")
    property_tax_rate_percent: float = Field(..., ge=0, description="Annual property tax rate percentage")
    maintenance_cost_percent: float = Field(..., ge=0, description="Annual maintenance cost percentage of home value")
    home_appreciation_rate_percent: float = Field(..., description="Annual home appreciation rate percentage")
    buying_closing_costs_percent: float = Field(2.0, ge=0, description="Closing costs percentage when buying")
    selling_closing_costs_percent: float = Field(6.0, ge=0, description="Closing costs percentage when selling")

    @field_validator('down_payment_percent')
    def validate_down_payment(cls, v):
        if v > 100:
            raise ValueError('Down payment cannot be more than 100%')
        return v

class YearlyResult(BaseModel):
    year: int
    rent_annual_cost: float
    rent_cumulative_cost: float
    
    buy_annual_out_of_pocket: float # Mortgage + Tax + Maint
    buy_cumulative_out_of_pocket: float
    buy_equity: float
    buy_home_value: float
    buy_remaining_mortgage: float
    
    # Net comparison: (Rent Cumulative) vs (Buy Cumulative - Equity)
    # If Buy Net Cost < Rent Net Cost, Buying is winning.
    buy_net_cost: float 

class SimulationOutput(BaseModel):
    results: List[YearlyResult]
    total_rent_cost: float
    total_buy_cost_net: float # After selling and paying off mortgage
    break_even_year: int | None
    recommendation: str


# --- Monte Carlo Risk Simulator ---

class MonteCarloRequest(BaseModel):
    scenario: SimulationInput
    num_simulations: int = Field(200, gt=0, le=500)
    appreciation_volatility_pp: float = Field(
        3.0, ge=0, le=20,
        description="Std dev, in percentage points, applied to home appreciation each simulated year",
    )
    rent_growth_volatility_pp: float = Field(
        1.5, ge=0, le=10,
        description="Std dev, in percentage points, applied to rent growth each simulated year",
    )

class YearlyPercentileBand(BaseModel):
    year: int
    buy_p10: float
    buy_p50: float
    buy_p90: float
    rent_p10: float
    rent_p50: float
    rent_p90: float

class MonteCarloResponse(BaseModel):
    bands: List[YearlyPercentileBand]
    probability_buy_wins: float
    num_simulations: int


# --- Break-Even Sensitivity Heatmap ---

class SensitivityRequest(BaseModel):
    scenario: SimulationInput
    appreciation_step_pp: float = Field(1.0, gt=0, le=5)
    rate_step_pp: float = Field(0.5, gt=0, le=2)
    grid_size: int = Field(9, ge=3, le=15)

    @field_validator('grid_size')
    def grid_size_must_be_odd(cls, v):
        if v % 2 == 0:
            raise ValueError('grid_size must be odd so the base scenario sits at the exact center cell')
        return v

class SensitivityCell(BaseModel):
    appreciation_percent: float
    rate_percent: float
    break_even_year: int | None
    net_advantage: float  # total_rent_cost - final buy_net_cost; positive => buying wins

class SensitivityResponse(BaseModel):
    appreciation_values: List[float]
    rate_values: List[float]
    cells: List[SensitivityCell]  # row-major: outer loop appreciation, inner loop rate
    base_appreciation_percent: float
    base_rate_percent: float


# --- Rate-Shock / Job-Loss Stress Test ---

class StressTestRequest(BaseModel):
    scenario: SimulationInput
    monthly_gross_income: float = Field(..., gt=0)
    cash_reserves_available: float = Field(..., ge=0)
    monthly_non_housing_expenses: float = Field(
        0, ge=0,
        description="Optional: non-housing living costs, subtracted equally from both paths",
    )
    shock_type: Literal["rate_increase", "income_loss", "emergency_expense"]
    shock_year: int = Field(..., gt=0)
    shock_magnitude_percent: float = Field(
        ..., ge=0,
        description=(
            "rate_increase: +percentage points added to mortgage rate; "
            "income_loss: % reduction in income; "
            "emergency_expense: expense = monthly_gross_income * magnitude/100, one-time"
        ),
    )
    shock_duration_months: int = Field(
        12, gt=0, le=360,
        description="Ignored for emergency_expense (always a one-time hit in the first shock month)",
    )

    @model_validator(mode='after')
    def shock_year_within_horizon(self):
        if self.shock_year > self.scenario.years_to_simulate:
            raise ValueError('shock_year cannot exceed scenario.years_to_simulate')
        return self

class MonthlyCashFlowPoint(BaseModel):
    month: int
    year: int
    buy_reserve_balance: float
    rent_reserve_balance: float
    buy_net_cash_flow: float
    rent_net_cash_flow: float
    is_shock_active: bool

class StressTestResponse(BaseModel):
    timeline: List[MonthlyCashFlowPoint]
    buy_goes_negative_month: int | None
    rent_goes_negative_month: int | None
    summary: str
