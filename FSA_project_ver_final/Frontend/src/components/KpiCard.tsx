import type { KpiMetric } from "../types/financial";
import { formatMetric, translateKpiLabel } from "../utils/format";

interface KpiCardProps {
  metric: KpiMetric;
}

export default function KpiCard({ metric }: KpiCardProps) {
  const delta = metric.value - metric.previousValue;
  const direction = delta === 0 ? "flat" : delta > 0 ? "up" : "down";

  return (
    <article className="kpi-card">
      <div>
        <p>{translateKpiLabel(metric.label)}</p>
        <strong>{formatMetric(metric.value, metric.unit)}</strong>
      </div>
      <span className={`trend ${metric.trend}`}>
        {direction === "up" ? "+" : ""}
        {formatMetric(delta, metric.unit)}
      </span>
    </article>
  );
}
