from schemas import SensitivityRequest, SensitivityResponse, SensitivityCell
from simulator import run_simulation


def run_sensitivity(request: SensitivityRequest) -> SensitivityResponse:
    base = request.scenario
    half = request.grid_size // 2

    appreciation_values = [
        round(base.home_appreciation_rate_percent + (i - half) * request.appreciation_step_pp, 4)
        for i in range(request.grid_size)
    ]
    rate_values = [
        max(0.0, round(base.mortgage_interest_rate_percent + (j - half) * request.rate_step_pp, 4))
        for j in range(request.grid_size)
    ]

    cells = []
    for appreciation in appreciation_values:
        for rate in rate_values:
            variant = base.model_copy(update={
                "home_appreciation_rate_percent": appreciation,
                "mortgage_interest_rate_percent": rate,
            })
            output = run_simulation(variant)
            final = output.results[-1]
            cells.append(SensitivityCell(
                appreciation_percent=appreciation,
                rate_percent=rate,
                break_even_year=output.break_even_year,
                net_advantage=round(output.total_rent_cost - final.buy_net_cost, 2),
            ))

    return SensitivityResponse(
        appreciation_values=appreciation_values,
        rate_values=rate_values,
        cells=cells,
        base_appreciation_percent=base.home_appreciation_rate_percent,
        base_rate_percent=base.mortgage_interest_rate_percent,
    )
