import type {
  FinancialReport,
  KpiData,
  KpiMetric,
  ProcessingStep,
  UploadResult,
  YearlyComparison
} from "../types/financial";

const delay = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

const labels: Record<KpiMetric["key"], string> = {
  revenue: "Revenue",
  revenueGrowth: "Revenue Growth",
  netIncome: "Net Income",
  netProfitMargin: "Net Profit Margin",
  roe: "ROE",
  roa: "ROA",
  currentRatio: "Current Ratio",
  debtEquity: "Debt/Equity",
  assetTurnover: "Asset Turnover",
  operatingCashFlow: "Operating Cash Flow",
  freeCashFlow: "Free Cash Flow",
  eps: "EPS"
};

const kpiByYear: Record<number, KpiData> = {
  2026: createKpiData(2026, 2025, {
    revenue: [184000000, 159000000, "currency"],
    revenueGrowth: [15.7, 9.3, "percent"],
    netIncome: [27600000, 22200000, "currency"],
    netProfitMargin: [15.0, 14.0, "percent"],
    roe: [18.8, 16.2, "percent"],
    roa: [9.7, 8.4, "percent"],
    currentRatio: [1.86, 1.72, "ratio"],
    debtEquity: [0.58, 0.66, "ratio"],
    assetTurnover: [0.91, 0.87, "ratio"],
    operatingCashFlow: [34200000, 29100000, "currency"],
    freeCashFlow: [22600000, 18100000, "currency"],
    eps: [4.82, 3.91, "number"]
  }),
  2025: createKpiData(2025, 2024, {
    revenue: [159000000, 145500000, "currency"],
    revenueGrowth: [9.3, 7.8, "percent"],
    netIncome: [22200000, 19800000, "currency"],
    netProfitMargin: [14.0, 13.6, "percent"],
    roe: [16.2, 15.1, "percent"],
    roa: [8.4, 7.9, "percent"],
    currentRatio: [1.72, 1.58, "ratio"],
    debtEquity: [0.66, 0.73, "ratio"],
    assetTurnover: [0.87, 0.84, "ratio"],
    operatingCashFlow: [29100000, 25200000, "currency"],
    freeCashFlow: [18100000, 15400000, "currency"],
    eps: [3.91, 3.42, "number"]
  }),
  2024: createKpiData(2024, 2023, {
    revenue: [145500000, 135000000, "currency"],
    revenueGrowth: [7.8, 6.1, "percent"],
    netIncome: [19800000, 17400000, "currency"],
    netProfitMargin: [13.6, 12.9, "percent"],
    roe: [15.1, 13.9, "percent"],
    roa: [7.9, 7.2, "percent"],
    currentRatio: [1.58, 1.49, "ratio"],
    debtEquity: [0.73, 0.8, "ratio"],
    assetTurnover: [0.84, 0.81, "ratio"],
    operatingCashFlow: [25200000, 23100000, "currency"],
    freeCashFlow: [15400000, 13900000, "currency"],
    eps: [3.42, 3.02, "number"]
  })
};

let reportHistory: FinancialReport[] = [
  {
    id: "report-2026",
    year: 2026,
    fileName: "financial-report-2026.pdf",
    uploadedAt: "2026-07-12T09:30:00.000Z",
    status: "completed"
  },
  {
    id: "report-2025",
    year: 2025,
    fileName: "annual-statement-2025.pdf",
    uploadedAt: "2026-01-19T14:10:00.000Z",
    status: "completed"
  },
  {
    id: "report-2024",
    year: 2024,
    fileName: "audited-report-2024.pdf",
    uploadedAt: "2025-01-21T08:45:00.000Z",
    status: "completed"
  }
];

export async function uploadPdf(
  file: File,
  year: number,
  onStepChange?: (step: ProcessingStep) => void
): Promise<UploadResult> {
  const steps: ProcessingStep[] = [
    "uploading",
    "reading_pdf",
    "extracting_financials",
    "calculating_kpis",
    "completed"
  ];

  for (const step of steps) {
    onStepChange?.(step);
    await delay(step === "completed" ? 250 : 650);
  }

  const report: FinancialReport = {
    id: `report-${year}-${Date.now()}`,
    year,
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
    status: "completed"
  };

  reportHistory = [report, ...reportHistory.filter((item) => item.year !== year)];

  return {
    report,
    kpiData: kpiByYear[year] ?? createSyntheticKpiData(year)
  };
}

export async function getKpiData(year: number): Promise<KpiData> {
  await delay(250);
  return kpiByYear[year] ?? createSyntheticKpiData(year);
}

export async function getReportHistory(): Promise<FinancialReport[]> {
  await delay(220);
  return reportHistory;
}

export async function getAiInsight(year: number): Promise<string> {
  await delay(300);
  const data = kpiByYear[year] ?? createSyntheticKpiData(year);
  const revenueGrowth = data.metrics.find((metric) => metric.key === "revenueGrowth")?.value ?? 0;
  const margin = data.metrics.find((metric) => metric.key === "netProfitMargin")?.value ?? 0;
  const leverage = data.metrics.find((metric) => metric.key === "debtEquity")?.value ?? 0;

  return `Tình hình tài chính năm ${year} nhìn chung tích cực. Doanh thu tăng ${revenueGrowth.toFixed(
    1
  )}% trong khi biên lợi nhuận ròng đạt ${margin.toFixed(
    1
  )}%, cho thấy tăng trưởng vẫn đi kèm hiệu quả sinh lời. Tỷ lệ Nợ/Vốn chủ sở hữu ở mức ${leverage.toFixed(
    2
  )}, phản ánh đòn bẩy tài chính được kiểm soát và doanh nghiệp vẫn còn dư địa đầu tư.`;
}

function createKpiData(
  year: number,
  comparisonYear: number,
  values: Record<KpiMetric["key"], [number, number, KpiMetric["unit"]]>
): KpiData {
  const metrics = (Object.keys(values) as KpiMetric["key"][]).map((key) => {
    const [value, previousValue, unit] = values[key];
    return {
      key,
      label: labels[key],
      value,
      previousValue,
      unit,
      trend: getTrend(value, previousValue, key)
    };
  });

  const chart: YearlyComparison[] = [
    chartItem("Revenue", values.revenue),
    chartItem("Net Income", values.netIncome),
    chartItem("Operating Cash Flow", values.operatingCashFlow),
    chartItem("Free Cash Flow", values.freeCashFlow)
  ];

  return { year, comparisonYear, metrics, chart };
}

function createSyntheticKpiData(year: number): KpiData {
  const offset = year - 2024;
  return createKpiData(year, year - 1, {
    revenue: [145500000 + offset * 11800000, 135000000 + offset * 10200000, "currency"],
    revenueGrowth: [8.2 + offset * 1.1, 7.4 + offset * 0.8, "percent"],
    netIncome: [19800000 + offset * 2100000, 17400000 + offset * 1700000, "currency"],
    netProfitMargin: [13.4 + offset * 0.4, 12.9 + offset * 0.3, "percent"],
    roe: [15.1 + offset * 0.8, 13.9 + offset * 0.7, "percent"],
    roa: [7.9 + offset * 0.5, 7.2 + offset * 0.4, "percent"],
    currentRatio: [1.58 + offset * 0.07, 1.49 + offset * 0.06, "ratio"],
    debtEquity: [0.73 - offset * 0.04, 0.8 - offset * 0.03, "ratio"],
    assetTurnover: [0.84 + offset * 0.03, 0.81 + offset * 0.02, "ratio"],
    operatingCashFlow: [25200000 + offset * 2500000, 23100000 + offset * 2100000, "currency"],
    freeCashFlow: [15400000 + offset * 1800000, 13900000 + offset * 1500000, "currency"],
    eps: [3.42 + offset * 0.38, 3.02 + offset * 0.31, "number"]
  });
}

function chartItem(label: string, value: [number, number, KpiMetric["unit"]]): YearlyComparison {
  return {
    label,
    current: value[0],
    previous: value[1]
  };
}

function getTrend(
  value: number,
  previousValue: number,
  key: KpiMetric["key"]
): KpiMetric["trend"] {
  if (Math.abs(value - previousValue) < 0.01) return "flat";
  const lowerIsBetter: KpiMetric["key"][] = ["debtEquity"];
  const improved = lowerIsBetter.includes(key) ? value < previousValue : value > previousValue;
  return improved ? "up" : "down";
}
