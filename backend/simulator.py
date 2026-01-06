import math
from typing import List
from schemas import SimulationInput, YearlyResult, SimulationOutput

def calculate_monthly_mortgage(principal: float, annual_rate_percent: float, years: int) -> float:
    if principal <= 0:
        return 0
    if annual_rate_percent <= 0:
        return principal / (years * 12)
    
    monthly_rate = (annual_rate_percent / 100) / 12
    num_payments = years * 12
    
    return principal * (monthly_rate * (1 + monthly_rate)**num_payments) / ((1 + monthly_rate)**num_payments - 1)

def run_simulation(data: SimulationInput) -> SimulationOutput:
    # Initial setup
    rent_monthly = data.monthly_rent
    
    home_value = data.home_price
    down_payment = data.home_price * (data.down_payment_percent / 100)
    loan_amount = data.home_price - down_payment
    monthly_mortgage = calculate_monthly_mortgage(loan_amount, data.mortgage_interest_rate_percent, data.loan_term_years)
    
    # Trackers
    cum_rent_cost = 0.0
    cum_buy_out_of_pocket = down_payment + (data.home_price * (data.buying_closing_costs_percent / 100))
    
    remaining_loan = loan_amount
    results: List[YearlyResult] = []
    
    break_even_year = None
    
    for year in range(1, data.years_to_simulate + 1):
        # --- RENT CALC ---
        annual_rent = rent_monthly * 12 + (data.rent_insurance_monthly * 12)
        cum_rent_cost += annual_rent
        
        # Increase rent for next year
        rent_monthly *= (1 + data.annual_rent_increase_percent / 100)
        
        # --- BUY CALC ---
        # Mortgage payments
        annual_mortgage_payment = 0.0
        principal_paid_this_year = 0.0
        
        # Simple loop for monthly amortization within the year
        # This is slightly less efficient than formula but accurate for year-by-year principal tracking
        for _ in range(12):
            if remaining_loan > 0:
                interest_payment = remaining_loan * ((data.mortgage_interest_rate_percent / 100) / 12)
                principal_payment = monthly_mortgage - interest_payment
                if principal_payment > remaining_loan:
                    principal_payment = remaining_loan
                    monthly_mortgage_actual = principal_payment + interest_payment # adjustment for last payment
                else:
                    monthly_mortgage_actual = monthly_mortgage
                
                remaining_loan -= principal_payment
                principal_paid_this_year += principal_payment
                annual_mortgage_payment += monthly_mortgage_actual
            else:
                annual_mortgage_payment += 0

        # Property Tax & Maintenance
        property_tax = home_value * (data.property_tax_rate_percent / 100)
        maintenance = home_value * (data.maintenance_cost_percent / 100)
        
        annual_buy_cost = annual_mortgage_payment + property_tax + maintenance
        cum_buy_out_of_pocket += annual_buy_cost
        
        # Appreciation
        home_value *= (1 + data.home_appreciation_rate_percent / 100)
        
        # Equity
        equity = home_value - remaining_loan
        
        # Net Cost if sold this year
        # Sell price = home_value
        # Closing costs = home_value * selling_closing_costs
        # Net proceeds = home_value - closing_costs - remaining_loan
        # Net Buy Cost = Cumulative Out of Pocket - Net Proceeds
        
        sell_closing_costs = home_value * (data.selling_closing_costs_percent / 100)
        net_proceeds = home_value - sell_closing_costs - remaining_loan
        buy_net_cost = cum_buy_out_of_pocket - net_proceeds
        
        results.append(YearlyResult(
            year=year,
            rent_annual_cost=annual_rent,
            rent_cumulative_cost=cum_rent_cost,
            buy_annual_out_of_pocket=annual_buy_cost,
            buy_cumulative_out_of_pocket=cum_buy_out_of_pocket,
            buy_equity=equity,
            buy_home_value=home_value,
            buy_remaining_mortgage=remaining_loan,
            buy_net_cost=buy_net_cost
        ))
        
        # Check break even
        # Break even is when Buy Net Cost becomes less than Rent Cumulative Cost
        if break_even_year is None and buy_net_cost < cum_rent_cost:
            break_even_year = year

    # Final Summary
    final_rent_cost = cum_rent_cost
    final_buy_net_cost = results[-1].buy_net_cost
    
    diff = final_rent_cost - final_buy_net_cost
    if diff > 0:
        recommendation = f"Buying is financially better by ${diff:,.2f} over {data.years_to_simulate} years."
    else:
        recommendation = f"Renting is financially better by ${-diff:,.2f} over {data.years_to_simulate} years."

    return SimulationOutput(
        results=results,
        total_rent_cost=final_rent_cost,
        total_buy_cost_net=final_buy_net_cost,
        break_even_year=break_even_year,
        recommendation=recommendation
    )
