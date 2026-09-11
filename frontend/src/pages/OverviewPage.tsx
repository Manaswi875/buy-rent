import { useEffect, useState } from 'react';
import type { SimulationOutput } from '../types';
import { simulate } from '../api';
import { ResultsDashboard } from '../components/ResultsDashboard';
import { useScenario } from '../context/ScenarioContext';

export function OverviewPage() {
    const { scenario } = useScenario();
    const [results, setResults] = useState<SimulationOutput | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!scenario) return;
        setLoading(true);
        setError(null);
        simulate(scenario)
            .then(setResults)
            .catch((err) => {
                console.error(err);
                setError('Failed to run simulation. Ensure backend is running.');
            })
            .finally(() => setLoading(false));
    }, [scenario]);

    return (
        <>
            <div className="page-header">
                <h2>Overview</h2>
                <p>The deterministic comparison: cumulative rent cost vs. net cost of buying, based on your scenario's exact numbers.</p>
            </div>
            {loading && <div className="placeholder">Simulating...</div>}
            {error && <div className="error-msg">{error}</div>}
            {!loading && !error && <ResultsDashboard results={results} />}
        </>
    );
}
