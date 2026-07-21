import { ChangeEvent, FormEvent, useState } from "react";

interface PdfUploaderProps {
  years: number[];
  selectedYear: number;
  isProcessing: boolean;
  onYearChange: (year: number) => void;
  onUpload: (file: File, year: number) => void;
}

export default function PdfUploader({
  years,
  selectedYear,
  isProcessing,
  onYearChange,
  onUpload
}: PdfUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const fileSize = file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "";

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    setError("");

    if (nextFile && nextFile.type !== "application/pdf") {
      setFile(null);
      setError("Chỉ hỗ trợ file PDF.");
      return;
    }

    setFile(nextFile);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Vui lòng chọn file PDF.");
      return;
    }

    onUpload(file, selectedYear);
  }

  return (
    <section className="panel uploader">
      <div className="panel-heading uploader-heading">
        <div>
          <p className="section-kicker">Báo cáo PDF</p>
          <h2>Tải báo cáo tài chính</h2>
        </div>
        <label className="compact-select">
          Năm báo cáo
          <select value={selectedYear} onChange={(event) => onYearChange(Number(event.target.value))}>
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </label>
      </div>

      <form className="upload-form" onSubmit={handleSubmit}>
        <label className="file-drop">
          <input type="file" accept="application/pdf" onChange={handleFileChange} />
          <span className="file-icon" aria-hidden="true">PDF</span>
          <span className="file-main">
            <strong>{file ? file.name : "Kéo thả hoặc chọn báo cáo PDF"}</strong>
            <small>{file ? fileSize : "Hỗ trợ báo cáo tài chính định dạng PDF"}</small>
          </span>
        </label>

        <div className="upload-actions">
          {file && (
            <button className="text-action" type="button" onClick={() => setFile(null)}>
              Xóa file
            </button>
          )}
          <button className="primary-action" type="submit" disabled={isProcessing}>
            {isProcessing ? "Đang phân tích..." : "Tải lên và phân tích"}
          </button>
        </div>

        {error && <p className="form-error">{error}</p>}
      </form>
    </section>
  );
}
