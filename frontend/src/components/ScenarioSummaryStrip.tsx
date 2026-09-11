import { Link } from 'react-router-dom';
import type { SimulationInput } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
    scenario: SimulationInput;
}

export function ScenarioSummaryStrip({ scenario }: Props) {
    return (
        <div className="scenario-summary-strip">
            <div className="scenario-summary-chips">
                <span className="scenario-chip">🏡 {formatCurrency(scenario.home_price)}</span>
                <span className="scenario-chip">🏠 {formatCurrency(scenario.monthly_rent)}/mo rent</span>
                <span className="scenario-chip">📅 {scenario.years_to_simulate} years</span>
                <span className="scenario-chip">📈 {scenario.home_appreciation_rate_percent}% appreciation</span>
                <span className="scenario-chip">🏦 {scenario.mortgage_interest_rate_percent}% rate</span>
            </div>
            <Link to="/scenario" className="edit-inputs-link">Edit inputs</Link>
        </div>
    );
}
