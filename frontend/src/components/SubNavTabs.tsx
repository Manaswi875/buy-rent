import { NavLink } from 'react-router-dom';

const TABS = [
    { to: '/scenario/overview', label: 'Overview' },
    { to: '/scenario/risk', label: 'Risk Simulation' },
    { to: '/scenario/sensitivity', label: 'Sensitivity' },
    { to: '/scenario/stress-test', label: 'Stress Test' },
];

export function SubNavTabs() {
    return (
        <nav className="sub-nav">
            {TABS.map(tab => (
                <NavLink
                    key={tab.to}
                    to={tab.to}
                    className={({ isActive }) => isActive ? 'sub-nav-tab active' : 'sub-nav-tab'}
                >
                    {tab.label}
                </NavLink>
            ))}
        </nav>
    );
}
