import { useEffect, useState } from 'react';
import type { SensitivityResponse } from '../types';
import { simulateSensitivity } from '../api';
import { SensitivityHeatmap } from '../components/SensitivityHeatmap';
import { useScenario } from '../context/ScenarioContext';

export function SensitivityPage() {
    const { scenario } = useScenario();
    const [result, setResult] = useState<SensitivityResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!scenario) return;
        setLoading(true);
        setError(null);
        simulateSensitivity({ scenario, appreciation_step_pp: 1.0, rate_step_pp: 0.5, grid_size: 9 })
            .then(setResult)
            .catch((err) => {
                console.error(err);
                setError('Failed to run sensitivity analysis.');
            })
            .finally(() => setLoading(false));
    }, [scenario]);

    return (
        <>
            <div className="page-header">
                <h2>Sensitivity Analysis</h2>
                <p>Your appreciation and rate assumptions are guesses. This shows how the break-even year shifts across a whole grid of nearby assumptions, not just your one guess.</p>
            </div>
            {loading && <div className="placeholder">Computing sensitivity grid...</div>}
            {error && <div className="error-msg">{error}</div>}
            {!loading && !error && result && <SensitivityHeatmap data={result} />}
        </>
    );
}
