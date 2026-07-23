import type { KpiMetric } from "../types/financial";
import { formatMetric, translateKpiLabel, translateTrend } from "../utils/format";

interface KpiTableProps {
  metrics: KpiMetric[];
  year: number;
  comparisonYear: number;
}

export default function KpiTable({ metrics, year, comparisonYear }: KpiTableProps) {
  return (
    <section className="panel table-panel">
      <div className="panel-heading">
        <div>
          <p className="section-kicker">Chi tiết KPI</p>
          <h2>Bảng chỉ số tài chính</h2>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Chỉ số</th>
              <th>{year}</th>
              <th>{comparisonYear}</th>
              <th>Xu hướng</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric.key}>
                <td>{translateKpiLabel(metric.label)}</td>
                <td>{formatMetric(metric.value, metric.unit)}</td>
                <td>{formatMetric(metric.previousValue, metric.unit)}</td>
                <td><span className={`trend ${metric.trend}`}>{translateTrend(metric.trend)}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
