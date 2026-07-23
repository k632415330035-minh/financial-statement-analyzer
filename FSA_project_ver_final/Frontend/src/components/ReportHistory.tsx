import { useMemo, useState } from "react";
import type { FinancialReport } from "../types/financial";
import { formatDate } from "../utils/format";

interface ReportHistoryProps {
  reports: FinancialReport[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export default function ReportHistory({ reports, selectedYear, onSelectYear }: ReportHistoryProps) {
  const [query, setQuery] = useState("");
  const filteredReports = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return reports;

    return reports.filter((report) => (
      String(report.year).includes(normalizedQuery)
      || report.fileName.toLowerCase().includes(normalizedQuery)
    ));
  }, [query, reports]);

  return (
    <section className="panel history-panel">
      <div className="panel-heading compact-heading">
        <div>
          <p className="section-kicker">Lịch sử báo cáo</p>
          <h2>Báo cáo đã tải lên</h2>
        </div>
      </div>

      <label className="history-search">
        <span>Tìm kiếm</span>
        <input
          type="search"
          placeholder="Tìm theo năm hoặc tên file"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="history-list">
        {filteredReports.map((report) => (
          <button
            className={`history-item ${report.year === selectedYear ? "active" : ""}`}
            key={report.id}
            type="button"
            onClick={() => onSelectYear(report.year)}
          >
            <span>
              <strong>Báo cáo năm {report.year}</strong>
              <small>{report.fileName}</small>
              <small>{formatDate(report.uploadedAt)}</small>
            </span>
            <span className="history-meta">
              <em>{report.status === "completed" ? "Hoàn thành" : "Đang xử lý"}</em>
              <i aria-hidden="true">...</i>
            </span>
          </button>
        ))}
        {filteredReports.length === 0 && <p className="empty-history">Không tìm thấy báo cáo phù hợp.</p>}
      </div>
    </section>
  );
}
