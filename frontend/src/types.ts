export interface SimulationInput {
    years_to_simulate: number;
    monthly_rent: number;
    annual_rent_increase_percent: number;
    rent_insurance_monthly: number;
    home_price: number;
    down_payment_percent: number;
    mortgage_interest_rate_percent: number;
    loan_term_years: number;
    property_tax_rate_percent: number;
    maintenance_cost_percent: number;
    home_appreciation_rate_percent: number;
    buying_closing_costs_percent: number;
    selling_closing_costs_percent: number;
}

export interface YearlyResult {
    year: number;
    rent_annual_cost: number;
    rent_cumulative_cost: number;
    buy_annual_out_of_pocket: number;
    buy_cumulative_out_of_pocket: number;
    buy_equity: number;
    buy_home_value: number;
    buy_remaining_mortgage: number;
    buy_net_cost: number;
}

export interface SimulationOutput {
    results: YearlyResult[];
    total_rent_cost: number;
    total_buy_cost_net: number;
    break_even_year: number | null;
    recommendation: string;
}

export const INITIAL_INPUT: SimulationInput = {
    years_to_simulate: 30,
    monthly_rent: 2000,
    annual_rent_increase_percent: 3.0,
    rent_insurance_monthly: 20,
    home_price: 500000,
    down_payment_percent: 20.0,
    mortgage_interest_rate_percent: 6.5,
    loan_term_years: 30,
    property_tax_rate_percent: 1.2,
    maintenance_cost_percent: 1.0,
    home_appreciation_rate_percent: 3.5,
    buying_closing_costs_percent: 2.0,
    selling_closing_costs_percent: 6.0,
};
