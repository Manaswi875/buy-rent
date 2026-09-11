import React, { createContext, useContext, useEffect, useState } from 'react';
import type { SimulationInput } from '../types';

const STORAGE_KEY = 'buy-rent:scenario';

interface ScenarioContextValue {
    scenario: SimulationInput | null;
    setScenario: (s: SimulationInput) => void;
    clearScenario: () => void;
}

const ScenarioContext = createContext<ScenarioContextValue | undefined>(undefined);

export const ScenarioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [scenario, setScenarioState] = useState<SimulationInput | null>(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    });

    useEffect(() => {
        try {
            if (scenario) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(scenario));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch {
            // localStorage unavailable (e.g. private browsing) - scenario still works for this session
        }
    }, [scenario]);

    const setScenario = (s: SimulationInput) => setScenarioState(s);
    const clearScenario = () => setScenarioState(null);

    return (
        <ScenarioContext.Provider value={{ scenario, setScenario, clearScenario }}>
            {children}
        </ScenarioContext.Provider>
    );
};

export function useScenario() {
    const ctx = useContext(ScenarioContext);
    if (!ctx) {
        throw new Error('useScenario must be used within a ScenarioProvider');
    }
    return ctx;
}
