import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './pages/LandingPage';
import { ScenarioInputPage } from './pages/ScenarioInputPage';
import { ScenarioShell } from './pages/ScenarioShell';
import { OverviewPage } from './pages/OverviewPage';
import { RiskPage } from './pages/RiskPage';
import { SensitivityPage } from './pages/SensitivityPage';
import { StressTestPage } from './pages/StressTestPage';
import './index.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/scenario" element={<ScenarioInputPage />} />
      <Route element={<ScenarioShell />}>
        <Route path="/scenario/overview" element={<OverviewPage />} />
        <Route path="/scenario/risk" element={<RiskPage />} />
        <Route path="/scenario/sensitivity" element={<SensitivityPage />} />
        <Route path="/scenario/stress-test" element={<StressTestPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
