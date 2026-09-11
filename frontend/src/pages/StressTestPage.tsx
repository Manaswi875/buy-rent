import { useState } from 'react';
import type { ShockType, StressTestResponse } from '../types';
import { INITIAL_STRESS_TEST_PARAMS } from '../types';
import { simulateStressTest } from '../api';
import { CashFlowTimelineChart } from '../components/CashFlowTimelineChart';
import { useScenario } from '../context/ScenarioContext';

const SHOCK_LABELS: Record<ShockType, string> = {
    rate_increase: 'Mortgage Rate Increase',
    income_loss: 'Income Loss / Job Change',
    emergency_expense: 'One-Time Emergency Expense',
};

export function StressTestPage() {
    const { scenario } = useScenario();
    const [params, setParams] = useState(INITIAL_STRESS_TEST_PARAMS);
    const [result, setResult] = useState<StressTestResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);
        setParams({ ...params, [name]: isNaN(numValue) ? 0 : numValue });
    };

    const handleShockTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setParams({ ...params, shock_type: e.target.value as ShockType });
    };

    const handleRun = async () => {
        if (!scenario) return;
        setLoading(true);
        setError(null);
        try {
            const data = await simulateStressTest({ scenario, ...params });
            setResult(data);
        } catch (err) {
            console.error(err);
            setError('Failed to run stress test. Check that the shock year fits within your scenario\'s simulated years.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h2>Stress Test</h2>
                <p>Life doesn't go according to plan. See what happens to your cash reserves if a rate reset, income loss, or surprise expense hits partway through — and which path (buying or renting) is more financially fragile.</p>
            </div>
            <main className="main-content">
                <aside className="sidebar">
                    <div className="input-form">
                        <h3>Shock Parameters</h3>
                        <div className="section">
                            <h4>Your Finances</h4>
                            <div className="input-group">
                                <label htmlFor="monthly_gross_income">Monthly Gross Income ($)</label>
                                <input type="number" id="monthly_gross_income" name="monthly_gross_income" value={params.monthly_gross_income} onChange={handleNumberChange} step="100" min="0" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="cash_reserves_available">Cash Reserves Available ($)</label>
                                <input type="number" id="cash_reserves_available" name="cash_reserves_available" value={params.cash_reserves_available} onChange={handleNumberChange} step="500" min="0" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="monthly_non_housing_expenses">Other Monthly Expenses ($)</label>
                                <input type="number" id="monthly_non_housing_expenses" name="monthly_non_housing_expenses" value={params.monthly_non_housing_expenses} onChange={handleNumberChange} step="100" min="0" />
                            </div>
                        </div>
                        <div className="section">
                            <h4>The Shock</h4>
                            <div className="input-group">
                                <label htmlFor="shock_type">Shock Type</label>
                                <select id="shock_type" name="shock_type" value={params.shock_type} onChange={handleShockTypeChange}>
                                    {Object.entries(SHOCK_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="input-group">
                                <label htmlFor="shock_year">Shock Hits in Year</label>
                                <input type="number" id="shock_year" name="shock_year" value={params.shock_year} onChange={handleNumberChange} step="1" min="1" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="shock_magnitude_percent">
                                    {params.shock_type === 'rate_increase' ? 'Rate Increase (+ percentage points)' : 'Magnitude (%)'}
                                </label>
                                <input type="number" id="shock_magnitude_percent" name="shock_magnitude_percent" value={params.shock_magnitude_percent} onChange={handleNumberChange} step="1" min="0" />
                            </div>
                            {params.shock_type !== 'emergency_expense' && (
                                <div className="input-group">
                                    <label htmlFor="shock_duration_months">Duration (months)</label>
                                    <input type="number" id="shock_duration_months" name="shock_duration_months" value={params.shock_duration_months} onChange={handleNumberChange} step="1" min="1" />
                                </div>
                            )}
                        </div>
                    </div>
                    <button className="simulate-btn" onClick={handleRun} disabled={loading}>
                        {loading ? 'Running...' : 'Run Stress Test'}
                    </button>
                    {error && <div className="error-msg">{error}</div>}
                </aside>
                <section className="results-area">
                    {!result && !loading && (
                        <div className="placeholder">Run the stress test to see how each path holds up under pressure.</div>
                    )}
                    {result && (
                        <div className="results-dashboard">
                            <div className="summary-card main-recommendation">
                                <h2>{result.summary}</h2>
                            </div>
                            <div className="stats-grid">
                                <div className="stat-card">
                                    <h4>Buy: Reserves Run Out</h4>
                                    <p className="value">{result.buy_goes_negative_month ? `Month ${result.buy_goes_negative_month}` : 'Never'}</p>
                                </div>
                                <div className="stat-card">
                                    <h4>Rent: Reserves Run Out</h4>
                                    <p className="value">{result.rent_goes_negative_month ? `Month ${result.rent_goes_negative_month}` : 'Never'}</p>
                                </div>
                            </div>
                            <CashFlowTimelineChart timeline={result.timeline} />
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
