import type { KpiMetric } from "../types/financial";

export function formatMetric(value: number, unit: KpiMetric["unit"]): string {
  if (unit === "currency") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      notation: "compact",
      maximumFractionDigits: 1
    }).format(value);
  }

  if (unit === "percent") {
    return `${value.toFixed(1)}%`;
  }

  if (unit === "ratio") {
    return value.toFixed(2);
  }

  return value.toFixed(2);
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "short",
    day: "2-digit"
  }).format(new Date(value));
}

export function translateKpiLabel(label: string): string {
  const labels: Record<string, string> = {
    "Revenue": "Doanh thu",
    "Revenue Growth": "Tăng trưởng doanh thu",
    "Net Income": "Lợi nhuận sau thuế",
    "Net Profit Margin": "Biên lợi nhuận ròng",
    "ROE": "ROE",
    "ROA": "ROA",
    "Current Ratio": "Tỷ số thanh toán hiện hành",
    "Debt/Equity": "Nợ/Vốn chủ sở hữu",
    "Asset Turnover": "Vòng quay tài sản",
    "Operating Cash Flow": "Dòng tiền hoạt động",
    "Free Cash Flow": "Dòng tiền tự do",
    "EPS": "EPS"
  };

  return labels[label] ?? label;
}

export function translateTrend(trend: KpiMetric["trend"]): string {
  const trends: Record<KpiMetric["trend"], string> = {
    up: "Tăng",
    down: "Giảm",
    flat: "Ổn định"
  };

  return trends[trend];
}
