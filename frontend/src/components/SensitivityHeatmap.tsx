import { Fragment } from 'react';
import type { SensitivityResponse } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
    data: SensitivityResponse;
}

export function SensitivityHeatmap({ data }: Props) {
    const { appreciation_values, rate_values, cells, base_appreciation_percent, base_rate_percent } = data;
    const gridSize = appreciation_values.length;
    const maxAbs = Math.max(1, ...cells.map(c => Math.abs(c.net_advantage)));

    const cellAt = (appreciationIdx: number, rateIdx: number) => cells[appreciationIdx * rate_values.length + rateIdx];

    const colorFor = (netAdvantage: number) => {
        const intensity = Math.min(1, Math.abs(netAdvantage) / maxAbs);
        return netAdvantage >= 0
            ? `rgba(56, 121, 8, ${0.12 + intensity * 0.6})`
            : `rgba(255, 115, 0, ${0.12 + intensity * 0.6})`;
    };

    return (
        <div className="chart-container">
            <h3>Break-Even Sensitivity Heatmap</h3>
            <p className="chart-note">
                Each cell re-runs the full simulation with that appreciation rate and mortgage rate. Green = buying
                wins financially, orange = renting wins. The highlighted cell is your actual scenario.
            </p>
            <div className="heatmap-wrapper">
                <div className="heatmap-axis-label heatmap-y-label">Home Appreciation (%/yr)</div>
                <div className="heatmap-grid-area">
                    <div
                        className="heatmap-grid"
                        style={{ gridTemplateColumns: `auto repeat(${gridSize}, 1fr)` }}
                    >
                        <div />
                        {rate_values.map(rate => (
                            <div key={rate} className="heatmap-col-label">{rate}%</div>
                        ))}
                        {appreciation_values.map((appreciation, i) => (
                            <Fragment key={`row-${appreciation}`}>
                                <div className="heatmap-row-label">{appreciation}%</div>
                                {rate_values.map((rate, j) => {
                                    const cell = cellAt(i, j);
                                    const isCurrent = appreciation === base_appreciation_percent && rate === base_rate_percent;
                                    return (
                                        <div
                                            key={`${appreciation}-${rate}`}
                                            className={isCurrent ? 'heatmap-cell heatmap-cell--current' : 'heatmap-cell'}
                                            style={{ backgroundColor: colorFor(cell.net_advantage) }}
                                            title={`Appreciation ${appreciation}%, Rate ${rate}%\nBreak-even: ${cell.break_even_year ? `Year ${cell.break_even_year}` : 'Never'}\nNet advantage: ${formatCurrency(cell.net_advantage)}`}
                                        >
                                            {cell.break_even_year ?? '—'}
                                        </div>
                                    );
                                })}
                            </Fragment>
                        ))}
                    </div>
                    <div className="heatmap-axis-label heatmap-x-label">Mortgage Rate (%/yr)</div>
                </div>
            </div>
            <p className="chart-note">Numbers inside cells are the break-even year (year buying starts winning); “—” means renting never loses.</p>
        </div>
    );
}
