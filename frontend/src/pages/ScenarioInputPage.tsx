import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { INITIAL_INPUT } from '../types';
import type { SimulationInput } from '../types';
import { InputForm } from '../components/InputForm';
import { useScenario } from '../context/ScenarioContext';

export function ScenarioInputPage() {
    const { scenario, setScenario } = useScenario();
    const [formData, setFormData] = useState<SimulationInput>(scenario ?? INITIAL_INPUT);
    const navigate = useNavigate();

    const handleSubmit = () => {
        setScenario(formData);
        navigate('/scenario/overview');
    };

    return (
        <div className="app-container">
            <div className="page-header">
                <h1>🏡 Build Your Scenario</h1>
                <p>Enter your numbers once — every analysis lens below reuses this same scenario.</p>
            </div>
            <main className="main-content">
                <aside className="sidebar">
                    <InputForm data={formData} onChange={setFormData} />
                    <button className="simulate-btn" onClick={handleSubmit}>
                        {scenario ? 'Update Scenario & Continue' : 'Save Scenario & Continue'}
                    </button>
                </aside>
                <section className="results-area">
                    <div className="placeholder">
                        Fill in your rent, home price, and loan details, then continue to see the Overview,
                        Risk Simulation, Sensitivity, and Stress Test analyses — all built on these same numbers.
                    </div>
                </section>
            </main>
        </div>
    );
}
