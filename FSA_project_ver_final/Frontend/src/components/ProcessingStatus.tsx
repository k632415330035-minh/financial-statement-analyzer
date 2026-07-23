import type { ProcessingStep } from "../types/financial";

const steps: Array<{ key: ProcessingStep; label: string }> = [
  { key: "uploading", label: "Tải file" },
  { key: "reading_pdf", label: "Đọc PDF" },
  { key: "extracting_financials", label: "Trích xuất dữ liệu" },
  { key: "calculating_kpis", label: "Tính toán KPI" },
  { key: "completed", label: "Hoàn thành" }
];

interface ProcessingStatusProps {
  activeStep: ProcessingStep | null;
}

export default function ProcessingStatus({ activeStep }: ProcessingStatusProps) {
  const activeIndex = activeStep ? steps.findIndex((step) => step.key === activeStep) : -1;
  const progress = activeStep ? Math.round(((activeIndex + 1) / steps.length) * 100) : 0;

  return (
    <section className="panel processing">
      <div className="panel-heading compact-heading">
        <div>
          <p className="section-kicker">Tiến trình xử lý</p>
          <h2>Trạng thái phân tích</h2>
        </div>
        <strong className="progress-percent">{progress}%</strong>
      </div>

      <div className="progress-track" aria-label="Tiến trình xử lý">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="status-stepper">
        {steps.map((step, index) => {
          const state = index < activeIndex ? "done" : index === activeIndex ? "active" : "pending";

          return (
            <div className={`status-item ${state}`} key={step.key}>
              <span className="status-dot">{state === "done" ? "✓" : index + 1}</span>
              <span>{step.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
