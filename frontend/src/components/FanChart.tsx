import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { YearlyPercentileBand } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
    bands: YearlyPercentileBand[];
}

export function FanChart({ bands }: Props) {
    const chartData = bands.map(b => ({
        year: b.year,
        buyRange: [Math.round(b.buy_p10), Math.round(b.buy_p90)],
        buyMedian: Math.round(b.buy_p50),
        rentRange: [Math.round(b.rent_p10), Math.round(b.rent_p90)],
        rentMedian: Math.round(b.rent_p50),
    }));

    return (
        <div className="chart-container">
            <h3>Simulated Range of Outcomes (10th–90th percentile)</h3>
            <p className="chart-note">Shaded bands show the spread across simulated futures. Solid lines are the median outcome.</p>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottomRight', offset: -10 }} />
                        <YAxis tickFormatter={(value) => `$${value / 1000}k`} />
                        <Tooltip formatter={(value: number | number[] | undefined) =>
                            Array.isArray(value) ? `${formatCurrency(value[0])} – ${formatCurrency(value[1])}` : formatCurrency(value)
                        } />
                        <Legend />
                        <Area dataKey="buyRange" stroke="none" fill="#387908" fillOpacity={0.15} name="Buy (10th–90th pct)" />
                        <Line type="monotone" dataKey="buyMedian" stroke="#387908" strokeWidth={2} name="Buy (Median)" dot={false} />
                        <Area dataKey="rentRange" stroke="none" fill="#ff7300" fillOpacity={0.15} name="Rent (10th–90th pct)" />
                        <Line type="monotone" dataKey="rentMedian" stroke="#ff7300" strokeWidth={2} name="Rent (Median)" dot={false} />
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
