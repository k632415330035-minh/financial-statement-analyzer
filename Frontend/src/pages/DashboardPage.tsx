import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AiInsight from "../components/AiInsight";
import FinancialChart from "../components/FinancialChart";
import KpiCard from "../components/KpiCard";
import KpiTable from "../components/KpiTable";
import PdfUploader from "../components/PdfUploader";
import ProcessingStatus from "../components/ProcessingStatus";
import {
  getAiInsight,
  getKpiData,
  getReportHistory,
  uploadPdf
} from "../services/financialApi";
import type { FinancialReport, KpiData, ProcessingStep } from "../types/financial";

const defaultYear = 2026;

export default function DashboardPage() {
  const navigate = useNavigate();
  const [selectedYear, setSelectedYear] = useState(defaultYear);
  const [kpiData, setKpiData] = useState<KpiData | null>(null);
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [insight, setInsight] = useState("");
  const [isInsightLoading, setIsInsightLoading] = useState(true);
  const [processingStep, setProcessingStep] = useState<ProcessingStep | null>(null);

  const years = useMemo(() => {
    const knownYears = reports.map((report) => report.year);
    return Array.from(new Set([2026, 2025, 2024, 2023, ...knownYears])).sort((a, b) => b - a);
  }, [reports]);

  useEffect(() => {
    void loadYear(selectedYear);
  }, [selectedYear]);

  useEffect(() => {
    getReportHistory().then(setReports).catch(() => setReports([]));
  }, []);

  async function loadYear(year: number) {
    setIsInsightLoading(true);
    const [nextKpiData, nextInsight] = await Promise.all([
      getKpiData(year),
      getAiInsight(year)
    ]);

    setKpiData(nextKpiData);
    setInsight(nextInsight);
    setIsInsightLoading(false);
  }

  async function handleUpload(file: File, year: number) {
    const result = await uploadPdf(file, year, setProcessingStep);
    setKpiData(result.kpiData);
    setSelectedYear(year);
    setReports(await getReportHistory());
    setInsight(await getAiInsight(year));
  }

  function handleLogout() {
    localStorage.removeItem("loginUser");
    navigate("/");
  }

  if (!kpiData) {
    return <main className="dashboard-page loading-page">Đang tải dashboard...</main>;
  }

  const overviewMetrics = kpiData.metrics.slice(0, 6);
  const currentUser = localStorage.getItem("loginUser") ?? "Người dùng";

  return (
    <main className="dashboard-page">
      <header className="app-header">
        <div className="app-brand">
          <span className="app-logo">FA</span>
          <strong>Financial Analytics</strong>
        </div>
        <nav className="app-nav" aria-label="Điều hướng chính">
          <a href="#tong-quan">Tổng quan</a>
          <a href="#bao-cao">Báo cáo</a>
          <a href="#phan-tich">Phân tích</a>
        </nav>
        <div className="user-menu">
          <span>{currentUser}</span>
          <button className="icon-action" type="button" onClick={handleLogout} aria-label="Đăng xuất">
            ⎋
          </button>
        </div>
      </header>

      <section className="dashboard-title-bar">
        <div>
          <p className="section-kicker">Tổng quan</p>
          <h1>Phân tích báo cáo tài chính</h1>
          <span>Tải lên báo cáo tài chính và theo dõi các chỉ số doanh nghiệp theo từng năm</span>
        </div>
        <label className="year-filter">
          Năm báo cáo
          <select value={selectedYear} onChange={(event) => setSelectedYear(Number(event.target.value))}>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="report-workspace" id="bao-cao">
        <div className="report-main-column">
          <PdfUploader
            years={years}
            selectedYear={selectedYear}
            isProcessing={processingStep !== null && processingStep !== "completed"}
            onYearChange={setSelectedYear}
            onUpload={handleUpload}
          />
          <ProcessingStatus activeStep={processingStep} />
        </div>
      </section>

      <section className="kpi-grid" id="tong-quan">
        {overviewMetrics.map((metric) => (
          <KpiCard key={metric.key} metric={metric} />
        ))}
      </section>

      <section className="dashboard-grid content-grid" id="phan-tich">
        <FinancialChart
          data={kpiData.chart}
          year={kpiData.year}
          comparisonYear={kpiData.comparisonYear}
        />
        <AiInsight insight={insight} isLoading={isInsightLoading} />
      </section>

      <KpiTable
        metrics={kpiData.metrics}
        year={kpiData.year}
        comparisonYear={kpiData.comparisonYear}
      />
    </main>
  );
}
