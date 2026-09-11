import { useState } from 'react';
import type { MonteCarloResponse } from '../types';
import { INITIAL_MONTE_CARLO_PARAMS } from '../types';
import { simulateMonteCarlo } from '../api';
import { FanChart } from '../components/FanChart';
import { useScenario } from '../context/ScenarioContext';

export function RiskPage() {
    const { scenario } = useScenario();
    const [params, setParams] = useState(INITIAL_MONTE_CARLO_PARAMS);
    const [result, setResult] = useState<MonteCarloResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value);
        setParams({ ...params, [name]: isNaN(numValue) ? 0 : numValue });
    };

    const handleRun = async () => {
        if (!scenario) return;
        setLoading(true);
        setError(null);
        try {
            const data = await simulateMonteCarlo({ scenario, ...params });
            setResult(data);
        } catch (err) {
            console.error(err);
            setError('Failed to run risk simulation.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-header">
                <h2>Risk Simulation</h2>
                <p>Home appreciation and rent growth aren't fixed numbers — they wobble year to year. This runs hundreds of randomized futures around your estimates to see how often buying actually wins.</p>
            </div>
            <main className="main-content">
                <aside className="sidebar">
                    <div className="input-form">
                        <h3>Simulation Parameters</h3>
                        <div className="section">
                            <div className="input-group">
                                <label htmlFor="num_simulations">Number of Simulations</label>
                                <input type="number" id="num_simulations" name="num_simulations" value={params.num_simulations} onChange={handleChange} step="10" min="10" max="500" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="appreciation_volatility_pp">Appreciation Volatility (± pp/yr)</label>
                                <input type="number" id="appreciation_volatility_pp" name="appreciation_volatility_pp" value={params.appreciation_volatility_pp} onChange={handleChange} step="0.5" min="0" max="20" />
                            </div>
                            <div className="input-group">
                                <label htmlFor="rent_growth_volatility_pp">Rent Growth Volatility (± pp/yr)</label>
                                <input type="number" id="rent_growth_volatility_pp" name="rent_growth_volatility_pp" value={params.rent_growth_volatility_pp} onChange={handleChange} step="0.5" min="0" max="10" />
                            </div>
                        </div>
                    </div>
                    <button className="simulate-btn" onClick={handleRun} disabled={loading}>
                        {loading ? 'Running...' : 'Run Risk Simulation'}
                    </button>
                    {error && <div className="error-msg">{error}</div>}
                </aside>
                <section className="results-area">
                    {!result && !loading && (
                        <div className="placeholder">Run the simulation to see the probability buying beats renting.</div>
                    )}
                    {result && (
                        <div className="results-dashboard">
                            <div className="summary-card main-recommendation">
                                <h2>Buying wins in {(result.probability_buy_wins * 100).toFixed(0)}% of simulated futures</h2>
                                <p>Based on {result.num_simulations} randomized simulations of appreciation and rent growth.</p>
                            </div>
                            <FanChart bands={result.bands} />
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}
