from fastapi import FastAPI, HTTPException

from financials import FinancialData
from kpi import calculate_kpi
from dashboard import create_dashboard


app = FastAPI(
    title="Stock Financial Analyzer",
    version="2.0"
)


@app.get("/")
def home():

    return {
        "message": "Stock Financial Analyzer API"
    }



@app.get("/analyze/{symbol}")
def analyze_stock(symbol: str):

    try:

        # Lấy dữ liệu từ VNStock
        financial = FinancialData(symbol)


        financial_data = financial.get_all()


        # Tính KPI
        kpi_data = calculate_kpi(
            financial_data
        )


        # Format dashboard
        result = create_dashboard(
            kpi_data
        )


        return {

            "symbol": symbol.upper(),

            "analysis": result

        }


    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )