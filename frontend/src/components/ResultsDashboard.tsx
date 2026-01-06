import React from 'react';
import type { SimulationOutput } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
    results: SimulationOutput | null;
}

export const ResultsDashboard: React.FC<Props> = ({ results }) => {
    if (!results) {
        return <div className="placeholder">Enter parameters and run simulation to see results.</div>;
    }

    // Prepare chart data
    const chartData = results.results.map(r => ({
        year: r.year,
        Rent: Math.round(r.rent_cumulative_cost),
        Buy: Math.round(r.buy_net_cost), // Net cost (Expenses - Equity gain basically, but simplified as defined in backend)
        Equity: Math.round(r.buy_equity)
    }));

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
    };

    return (
        <div className="results-dashboard">
            <div className="summary-card main-recommendation">
                <h2>{results.recommendation}</h2>
                {results.break_even_year && <p>Break-even year: Year {results.break_even_year}</p>}
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h4>Total Rent Cost</h4>
                    <p className="value">{formatCurrency(results.total_rent_cost)}</p>
                </div>
                <div className="stat-card">
                    <h4>Total Buy Cost (Net)</h4>
                    <p className="value">{formatCurrency(results.total_buy_cost_net)}</p>
                    <small>Includes equity value at end</small>
                </div>
                <div className="stat-card">
                    <h4>Final Home Equity</h4>
                    <p className="value">{formatCurrency(results.results[results.results.length - 1].buy_equity)}</p>
                </div>
            </div>

            <div className="chart-container">
                <h3>Cumulative Cost Comparison (Net) & Equity</h3>
                <p className="chart-note">"Buy" line is Net Cost (Total Out-of-pocket minus Home Equity if sold).</p>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
                            <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                            <Legend />
                            <Line type="monotone" dataKey="Rent" stroke="#ff7300" strokeWidth={2} />
                            <Line type="monotone" dataKey="Buy" stroke="#387908" strokeWidth={2} name="Buy (Net Cost)" />
                            <Line type="monotone" dataKey="Equity" stroke="#8884d8" strokeWidth={2} strokeDasharray="5 5" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};
