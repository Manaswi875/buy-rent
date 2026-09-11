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

// --- Monte Carlo Risk Simulator ---

export interface MonteCarloRequest {
    scenario: SimulationInput;
    num_simulations: number;
    appreciation_volatility_pp: number;
    rent_growth_volatility_pp: number;
}

export interface YearlyPercentileBand {
    year: number;
    buy_p10: number;
    buy_p50: number;
    buy_p90: number;
    rent_p10: number;
    rent_p50: number;
    rent_p90: number;
}

export interface MonteCarloResponse {
    bands: YearlyPercentileBand[];
    probability_buy_wins: number;
    num_simulations: number;
}

export const INITIAL_MONTE_CARLO_PARAMS = {
    num_simulations: 200,
    appreciation_volatility_pp: 3.0,
    rent_growth_volatility_pp: 1.5,
};

// --- Break-Even Sensitivity Heatmap ---

export interface SensitivityRequest {
    scenario: SimulationInput;
    appreciation_step_pp: number;
    rate_step_pp: number;
    grid_size: number;
}

export interface SensitivityCell {
    appreciation_percent: number;
    rate_percent: number;
    break_even_year: number | null;
    net_advantage: number;
}

export interface SensitivityResponse {
    appreciation_values: number[];
    rate_values: number[];
    cells: SensitivityCell[];
    base_appreciation_percent: number;
    base_rate_percent: number;
}

export const INITIAL_SENSITIVITY_PARAMS = {
    appreciation_step_pp: 1.0,
    rate_step_pp: 0.5,
    grid_size: 9,
};

// --- Rate-Shock / Job-Loss Stress Test ---

export type ShockType = 'rate_increase' | 'income_loss' | 'emergency_expense';

export interface StressTestRequest {
    scenario: SimulationInput;
    monthly_gross_income: number;
    cash_reserves_available: number;
    monthly_non_housing_expenses: number;
    shock_type: ShockType;
    shock_year: number;
    shock_magnitude_percent: number;
    shock_duration_months: number;
}

export interface MonthlyCashFlowPoint {
    month: number;
    year: number;
    buy_reserve_balance: number;
    rent_reserve_balance: number;
    buy_net_cash_flow: number;
    rent_net_cash_flow: number;
    is_shock_active: boolean;
}

export interface StressTestResponse {
    timeline: MonthlyCashFlowPoint[];
    buy_goes_negative_month: number | null;
    rent_goes_negative_month: number | null;
    summary: string;
}

export const INITIAL_STRESS_TEST_PARAMS = {
    monthly_gross_income: 8000,
    cash_reserves_available: 15000,
    monthly_non_housing_expenses: 1500,
    shock_type: 'income_loss' as ShockType,
    shock_year: 2,
    shock_magnitude_percent: 50,
    shock_duration_months: 6,
};
