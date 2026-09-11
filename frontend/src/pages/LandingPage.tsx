import { Link } from 'react-router-dom';

const LENSES = [
    { icon: '🏡', title: 'Overview', desc: 'The classic side-by-side: cumulative rent cost vs. net cost of buying, with a break-even year.' },
    { icon: '🎲', title: 'Risk Simulation', desc: 'Run hundreds of randomized futures. See the probability buying actually wins, not just one guess.' },
    { icon: '🌡️', title: 'Sensitivity', desc: 'A heatmap of outcomes across appreciation and rate assumptions, so you see how fragile the call really is.' },
    { icon: '⚡', title: 'Stress Test', desc: 'Simulate a rate shock, income loss, or emergency expense, and see which path runs out of cash first.' },
];

export function LandingPage() {
    return (
        <div className="app-container">
            <div className="landing-hero">
                <h1>🏡 Home Buying Decision Toolkit</h1>
                <p>Enter your scenario once. Stress-test it four ways.</p>
                <Link to="/scenario" className="landing-cta">Build Your Scenario →</Link>
            </div>

            <div className="landing-features">
                {LENSES.map(lens => (
                    <div key={lens.title} className="landing-feature-card">
                        <span className="landing-feature-icon">{lens.icon}</span>
                        <h3>{lens.title}</h3>
                        <p>{lens.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
