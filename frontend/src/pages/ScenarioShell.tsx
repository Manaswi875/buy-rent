import { Navigate, Outlet } from 'react-router-dom';
import { useScenario } from '../context/ScenarioContext';
import { ScenarioSummaryStrip } from '../components/ScenarioSummaryStrip';
import { SubNavTabs } from '../components/SubNavTabs';

export function ScenarioShell() {
    const { scenario } = useScenario();

    if (!scenario) {
        return <Navigate to="/scenario" replace />;
    }

    return (
        <div className="app-container">
            <ScenarioSummaryStrip scenario={scenario} />
            <SubNavTabs />
            <Outlet />
        </div>
    );
}
