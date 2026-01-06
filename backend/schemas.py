from pydantic import BaseModel, Field, field_validator
from typing import List

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
