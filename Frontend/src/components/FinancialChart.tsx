import type { YearlyComparison } from "../types/financial";
import { formatMetric, translateKpiLabel } from "../utils/format";

interface FinancialChartProps {
  data: YearlyComparison[];
  year: number;
  comparisonYear: number;
}

export default function FinancialChart({ data, year, comparisonYear }: FinancialChartProps) {
  const maxValue = Math.max(...data.flatMap((item) => [item.current, item.previous]));

  return (
    <section className="panel chart-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">So sánh</p>
          <h2>{year} so với {comparisonYear}</h2>
        </div>
        <div className="legend">
          <span><i className="current-swatch" />{year}</span>
          <span><i className="previous-swatch" />{comparisonYear}</span>
        </div>
      </div>

      <div className="bar-chart">
        {data.map((item) => (
          <div className="bar-row" key={item.label}>
            <span className="bar-label">{translateKpiLabel(item.label)}</span>
            <div className="bar-pair">
              <div className="bar-track">
                <span
                  className="bar current"
                  style={{ width: `${(item.current / maxValue) * 100}%` }}
                />
              </div>
              <small>{formatMetric(item.current, "currency")}</small>
              <div className="bar-track">
                <span
                  className="bar previous"
                  style={{ width: `${(item.previous / maxValue) * 100}%` }}
                />
              </div>
              <small>{formatMetric(item.previous, "currency")}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
