from simulator import calculate_monthly_mortgage
from schemas import StressTestRequest, StressTestResponse, MonthlyCashFlowPoint


def _build_summary(buy_negative_month: int | None, rent_negative_month: int | None, shock_type: str) -> str:
    shock_label = shock_type.replace("_", " ")
    if buy_negative_month is not None and rent_negative_month is None:
        return (
            f"Under this {shock_label} scenario, buying runs out of reserves in month {buy_negative_month}, "
            f"while renting stays cash-positive throughout. Buying is the financially fragile choice here."
        )
    if rent_negative_month is not None and buy_negative_month is None:
        return (
            f"Under this {shock_label} scenario, renting runs out of reserves in month {rent_negative_month}, "
            f"while buying stays cash-positive throughout."
        )
    if buy_negative_month is not None and rent_negative_month is not None:
        earlier = "Buying" if buy_negative_month < rent_negative_month else "Renting"
        return (
            f"Both paths run out of reserves under this {shock_label} scenario "
            f"(buy: month {buy_negative_month}, rent: month {rent_negative_month}). "
            f"{earlier} runs out first."
        )
    return f"Both buying and renting stay cash-positive throughout this {shock_label} scenario."


def run_stress_test(request: StressTestRequest) -> StressTestResponse:
    s = request.scenario
    total_months = s.years_to_simulate * 12
    shock_start = (request.shock_year - 1) * 12 + 1
    shock_end = shock_start + request.shock_duration_months  # exclusive; unused for emergency_expense

    down_payment = s.home_price * (s.down_payment_percent / 100)
    buying_closing_costs = s.home_price * (s.buying_closing_costs_percent / 100)
    loan_amount = s.home_price - down_payment

    buy_reserve = request.cash_reserves_available
    rent_reserve = request.cash_reserves_available + down_payment + buying_closing_costs
    remaining_loan = loan_amount
    current_rate = s.mortgage_interest_rate_percent
    current_payment = calculate_monthly_mortgage(loan_amount, current_rate, s.loan_term_years)
    home_value = s.home_price
    rent_monthly = s.monthly_rent

    timeline: list[MonthlyCashFlowPoint] = []
    buy_negative_month = None
    rent_negative_month = None

    for month in range(1, total_months + 1):
        year = (month - 1) // 12 + 1

        if request.shock_type == "emergency_expense":
            is_active = month == shock_start
        else:
            is_active = shock_start <= month < shock_end

        income = request.monthly_gross_income
        if request.shock_type == "income_loss" and is_active:
            income *= (1 - request.shock_magnitude_percent / 100)

        if request.shock_type == "rate_increase" and month in (shock_start, shock_end):
            if month == shock_start:
                current_rate = s.mortgage_interest_rate_percent + request.shock_magnitude_percent
            else:
                current_rate = s.mortgage_interest_rate_percent
            remaining_term_years = max(1, s.loan_term_years - (year - 1))
            current_payment = calculate_monthly_mortgage(remaining_loan, current_rate, remaining_term_years)

        if remaining_loan > 0:
            interest_payment = remaining_loan * (current_rate / 100 / 12)
            principal_payment = current_payment - interest_payment
            if principal_payment > remaining_loan:
                principal_payment = remaining_loan
                mortgage_actual = principal_payment + interest_payment
            else:
                mortgage_actual = current_payment
            remaining_loan -= principal_payment
        else:
            mortgage_actual = 0.0

        tax_monthly = (home_value * s.property_tax_rate_percent / 100) / 12
        maintenance_monthly = (home_value * s.maintenance_cost_percent / 100) / 12
        buy_housing_cost = mortgage_actual + tax_monthly + maintenance_monthly
        rent_housing_cost = rent_monthly + s.rent_insurance_monthly

        buy_flow = income - buy_housing_cost - request.monthly_non_housing_expenses
        rent_flow = income - rent_housing_cost - request.monthly_non_housing_expenses
        buy_reserve += buy_flow
        rent_reserve += rent_flow

        if request.shock_type == "emergency_expense" and month == shock_start:
            # Capital expenses (roof, HVAC, etc.) fall on the owner; a renter's landlord absorbs them.
            buy_reserve -= request.monthly_gross_income * request.shock_magnitude_percent / 100

        if buy_negative_month is None and buy_reserve < 0:
            buy_negative_month = month
        if rent_negative_month is None and rent_reserve < 0:
            rent_negative_month = month

        timeline.append(MonthlyCashFlowPoint(
            month=month,
            year=year,
            buy_reserve_balance=round(buy_reserve, 2),
            rent_reserve_balance=round(rent_reserve, 2),
            buy_net_cash_flow=round(buy_flow, 2),
            rent_net_cash_flow=round(rent_flow, 2),
            is_shock_active=is_active,
        ))

        if month % 12 == 0:
            rent_monthly *= (1 + s.annual_rent_increase_percent / 100)
            home_value *= (1 + s.home_appreciation_rate_percent / 100)

    summary = _build_summary(buy_negative_month, rent_negative_month, request.shock_type)

    return StressTestResponse(
        timeline=timeline,
        buy_goes_negative_month=buy_negative_month,
        rent_goes_negative_month=rent_negative_month,
        summary=summary,
    )
