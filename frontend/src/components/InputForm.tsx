import React from 'react';
import type { SimulationInput } from '../types';

interface Props {
    data: SimulationInput;
    onChange: (newData: SimulationInput) => void;
}

export const InputForm: React.FC<Props> = ({ data, onChange }) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        // Handle number conversion safely
        const numValue = parseFloat(value);
        onChange({
            ...data,
            [name]: isNaN(numValue) ? 0 : numValue,
        });
    };

    const InputGroup = (label: string, name: keyof SimulationInput, step = "0.01", min = "0") => (
        <div className="input-group">
            <label htmlFor={name}>{label}</label>
            <input
                type="number"
                id={name}
                name={name}
                value={data[name]}
                onChange={handleChange}
                step={step}
                min={min}
            />
        </div>
    );

    return (
        <div className="input-form">
            <h3>Simulation Parameters</h3>

            <div className="section">
                <h4>General</h4>
                {InputGroup("Years to Simulate", "years_to_simulate", "1", "1")}
            </div>

            <div className="section">
                <h4>Rent Parameters</h4>
                {InputGroup("Monthly Rent ($)", "monthly_rent", "10")}
                {InputGroup("Annual Rent Increase (%)", "annual_rent_increase_percent", "0.1")}
                {InputGroup("Rent Insurance ($/mo)", "rent_insurance_monthly", "1")}
            </div>

            <div className="section">
                <h4>Buy Parameters</h4>
                {InputGroup("Home Price ($)", "home_price", "1000")}
                {InputGroup("Down Payment (%)", "down_payment_percent", "0.1")}
                {InputGroup("Interest Rate (%)", "mortgage_interest_rate_percent", "0.01")}
                {InputGroup("Loan Term (Years)", "loan_term_years", "1")}
                {InputGroup("Property Tax (%)", "property_tax_rate_percent", "0.01")}
                {InputGroup("Maintenance (%)", "maintenance_cost_percent", "0.01")}
                {InputGroup("Appreciation (%)", "home_appreciation_rate_percent", "0.1")}
                {InputGroup("Buy Closing Costs (%)", "buying_closing_costs_percent", "0.1")}
                {InputGroup("Sell Closing Costs (%)", "selling_closing_costs_percent", "0.1")}
            </div>
        </div>
    );
};
