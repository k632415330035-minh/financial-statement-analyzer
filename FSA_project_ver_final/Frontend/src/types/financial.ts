export type ProcessingStep =
  | "uploading"
  | "reading_pdf"
  | "extracting_financials"
  | "calculating_kpis"
  | "completed";

export type KpiKey =
  | "revenue"
  | "revenueGrowth"
  | "netIncome"
  | "netProfitMargin"
  | "roe"
  | "roa"
  | "currentRatio"
  | "debtEquity"
  | "assetTurnover"
  | "operatingCashFlow"
  | "freeCashFlow"
  | "eps";

export interface KpiMetric {
  key: KpiKey;
  label: string;
  value: number;
  previousValue: number;
  unit: "currency" | "percent" | "ratio" | "number";
  trend: "up" | "down" | "flat";
}

export interface YearlyComparison {
  label: string;
  current: number;
  previous: number;
}

export interface FinancialReport {
  id: string;
  year: number;
  fileName: string;
  uploadedAt: string;
  status: "completed" | "processing";
}

export interface KpiData {
  year: number;
  comparisonYear: number;
  metrics: KpiMetric[];
  chart: YearlyComparison[];
}

export interface UploadResult {
  report: FinancialReport;
  kpiData: KpiData;
}
