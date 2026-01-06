import { useState } from 'react';
import { INITIAL_INPUT } from './types';
import type { SimulationInput, SimulationOutput } from './types';
import { simulate } from './api';
import { InputForm } from './components/InputForm';
import { ResultsDashboard } from './components/ResultsDashboard';
import './index.css';

function App() {
  const [inputData, setInputData] = useState<SimulationInput>(INITIAL_INPUT);
  const [results, setResults] = useState<SimulationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await simulate(inputData);
      setResults(data);
    } catch (err) {
      console.error(err);
      setError('Failed to run simulation. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🏡 Rent vs Buy Simulator</h1>
        <p>Compare the long-term financial impact of renting versus buying a home.</p>
      </header>

      <main className="main-content">
        <aside className="sidebar">
          <InputForm data={inputData} onChange={setInputData} />
          <button
            className="simulate-btn"
            onClick={handleSimulate}
            disabled={loading}
          >
            {loading ? 'Simulating...' : 'Run Simulation'}
          </button>
          {error && <div className="error-msg">{error}</div>}
        </aside>

        <section className="results-area">
          <ResultsDashboard results={results} />
        </section>
      </main>
    </div>
  );
}

export default App;
