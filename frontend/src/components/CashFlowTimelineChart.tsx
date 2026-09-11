import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import type { MonthlyCashFlowPoint } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
    timeline: MonthlyCashFlowPoint[];
}

export function CashFlowTimelineChart({ timeline }: Props) {
    const chartData = timeline.map(p => ({
        month: p.month,
        Buy: Math.round(p.buy_reserve_balance),
        Rent: Math.round(p.rent_reserve_balance),
    }));

    const shockMonths = timeline.filter(p => p.is_shock_active).map(p => p.month);
    const shockStart = shockMonths.length ? Math.min(...shockMonths) : undefined;
    const shockEnd = shockMonths.length ? Math.max(...shockMonths) : undefined;

    return (
        <div className="chart-container">
            <h3>Reserve Balance Over Time</h3>
            <p className="chart-note">Shaded region marks the shock window. Below the red line means that path has run out of cash.</p>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip formatter={(value: number | undefined) => formatCurrency(value)} />
                        <Legend />
                        {shockStart !== undefined && shockEnd !== undefined && (
                            <ReferenceArea x1={shockStart} x2={shockEnd} fill="#ef4444" fillOpacity={0.08} />
                        )}
                        <ReferenceLine y={0} stroke="#ef4444" strokeDasharray="4 4" />
                        <Line type="monotone" dataKey="Buy" stroke="#387908" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="Rent" stroke="#ff7300" strokeWidth={2} dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
