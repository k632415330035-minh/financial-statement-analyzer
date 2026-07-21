from fastapi import FastAPI, UploadFile, File
import shutil
import os

from parser import read_pdf
from financials import extract_financials
from kpi import calculate_kpi
from dashboard import create_dashboard

app = FastAPI(
    title="Financial Statement Analyzer",
    version="1.0"
)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {
        "message": "Financial Statement Analyzer API"
    }


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    # Kiểm tra định dạng
    if not file.filename.lower().endswith(".pdf"):
        return {
            "error": "Please upload a PDF file."
        }

    # Lưu PDF
    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Đọc PDF
    pdf_data = read_pdf(file_path)

    # Trích xuất báo cáo tài chính
    financial_data = extract_financials(pdf_data)

    # Tính KPI
    kpi_data = calculate_kpi(financial_data)

    # Trả JSON
    result = create_dashboard(kpi_data)

    return result