import random

from schemas import MonteCarloRequest, MonteCarloResponse, YearlyPercentileBand
from simulator import run_simulation


def _percentile(values: list, pct: float) -> float:
    s = sorted(values)
    k = (len(s) - 1) * pct
    f, c = int(k), min(int(k) + 1, len(s) - 1)
    if f == c:
        return s[f]
    return s[f] + (s[c] - s[f]) * (k - f)


def run_monte_carlo(request: MonteCarloRequest) -> MonteCarloResponse:
    scenario = request.scenario
    years = scenario.years_to_simulate

    buy_by_year = [[] for _ in range(years)]
    rent_by_year = [[] for _ in range(years)]
    buy_wins = 0

    for _ in range(request.num_simulations):
        appreciation_path = [
            random.gauss(scenario.home_appreciation_rate_percent, request.appreciation_volatility_pp)
            for _ in range(years)
        ]
        rent_growth_path = [
            random.gauss(scenario.annual_rent_increase_percent, request.rent_growth_volatility_pp)
            for _ in range(years)
        ]
        output = run_simulation(scenario, appreciation_path, rent_growth_path)

        for i, yr in enumerate(output.results):
            buy_by_year[i].append(yr.buy_net_cost)
            rent_by_year[i].append(yr.rent_cumulative_cost)

        if output.results[-1].buy_net_cost < output.results[-1].rent_cumulative_cost:
            buy_wins += 1

    bands = [
        YearlyPercentileBand(
            year=i + 1,
            buy_p10=round(_percentile(buy_by_year[i], 0.10), 2),
            buy_p50=round(_percentile(buy_by_year[i], 0.50), 2),
            buy_p90=round(_percentile(buy_by_year[i], 0.90), 2),
            rent_p10=round(_percentile(rent_by_year[i], 0.10), 2),
            rent_p50=round(_percentile(rent_by_year[i], 0.50), 2),
            rent_p90=round(_percentile(rent_by_year[i], 0.90), 2),
        )
        for i in range(years)
    ]

    return MonteCarloResponse(
        bands=bands,
        probability_buy_wins=round(buy_wins / request.num_simulations, 4),
        num_simulations=request.num_simulations,
    )
