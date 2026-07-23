from vnstock import Vnstock
import pandas as pd


# =====================================
# Chuẩn hóa tên chỉ tiêu
# =====================================

STANDARD_NAMES = {

    # Balance Sheet
    "TỔNG CỘNG TÀI SẢN": "Tổng tài sản",
    "Tổng cộng tài sản": "Tổng tài sản",

    "NỢ PHẢI TRẢ": "Nợ phải trả",

    "TÀI SẢN NGẮN HẠN": "Tài sản ngắn hạn",
    "TÀI SẢN DÀI HẠN": "Tài sản dài hạn",

    "Tổng cộng nguồn vốn": "Tổng nguồn vốn",

    "Vốn chủ sở hữu": "Vốn chủ sở hữu",


    # Income Statement

    "Doanh thu thuần": "Doanh thu thuần",

    "Lợi nhuận sau thuế thu nhập doanh nghiệp":
        "Lợi nhuận sau thuế",

    "Lãi/(lỗ) thuần sau thuế": "Lợi nhuận sau thuế",

    "Lợi nhuận của Cổ đông của Công ty mẹ": "Lợi nhuận sau thuế",

    "Lãi/(lỗ) trước thuế": "Lợi nhuận trước thuế",

    "Lợi nhuận trước thuế":
        "Lợi nhuận trước thuế",

    "Giá vốn hàng bán":
        "Giá vốn",

    "Lợi nhuận gộp":
        "Lợi nhuận gộp",


    # Cash Flow

    "Lưu chuyển tiền thuần từ hoạt động kinh doanh":
        "Dòng tiền HĐKD",

    "Lưu chuyển tiền thuần từ hoạt động đầu tư":
        "Dòng tiền HĐĐT",

    "Lưu chuyển tiền thuần từ hoạt động tài chính":
        "Dòng tiền HĐTC",

    "Lưu chuyển tiền tệ ròng từ các hoạt động sản xuất kinh doanh": "Dòng tiền HĐKD",
    "Lợi nhuận/(lỗ) trước thuế": "Lợi nhuận trước thuế",
}



class FinancialData:


    def __init__(
        self,
        symbol: str,
        source="VCI"
    ):

        self.symbol = symbol.upper()

        self.stock = Vnstock().stock(
            symbol=self.symbol,
            source=source
        )


    # =====================================
    # Normalize báo cáo tài chính
    # =====================================

    @staticmethod
    def normalize_statement(df):

        df = df.copy()


        # đổi tên cột đầu tiên

        if df.columns[0] != "item":

            df.rename(
                columns={
                    df.columns[0]: "item"
                },
                inplace=True
            )


        # bỏ cột không cần

        remove_cols = [
            "item_en",
            "item_id"
        ]


        for col in remove_cols:

            if col in df.columns:

                df.drop(
                    columns=col,
                    inplace=True
                )


        # chuẩn hóa tên

        df["item"] = (
            df["item"]
            .astype(str)
            .str.strip()
            .replace(STANDARD_NAMES)
        )


        # bỏ trùng

        df = df.drop_duplicates(
            subset="item",
            keep="first"
        )


        # item thành index

        df.set_index(
            "item",
            inplace=True
        )


        # năm thành string

        df.columns = (
            df.columns
            .astype(str)
        )


        # sắp xếp năm giảm dần

        years = sorted(
            df.columns,
            reverse=True
        )

        df = df[years]


        return df



    # =====================================
    # Normalize Financial Ratio
    # =====================================

    @staticmethod
    def normalize_ratio(df):

        df = df.copy()


        # đổi tên cột đầu

        if df.columns[0] != "item":

            df.rename(
                columns={
                    df.columns[0]: "item"
                },
                inplace=True
            )


        # bỏ metadata

        remove_cols = [

            "item_en",
            "item_id",
            "ratio_id",
            "ratio_type"

        ]


        for col in remove_cols:

            if col in df.columns:

                df.drop(
                    columns=col,
                    inplace=True
                )


        # bỏ dòng metadata

        remove_items = [

            "Năm",
            "Quý",
            "Mã TTM",
            "Loại tỷ lệ"

        ]


        df = df[
            ~df["item"].isin(remove_items)
        ]


        # chuẩn hóa

        df["item"] = (
            df["item"]
            .astype(str)
            .str.strip()
        )


        # bỏ trùng

        df = df.drop_duplicates(
            subset="item",
            keep="first"
        )


        # index

        df.set_index(
            "item",
            inplace=True
        )


        df.columns = (
            df.columns
            .astype(str)
        )


        return df



    # =====================================
    # Lấy Balance Sheet
    # =====================================

    def get_balance_sheet(self):

        df = self.stock.finance.balance_sheet(
            period="year"
        )

        return self.normalize_statement(df)



    # =====================================
    # Lấy Income Statement
    # =====================================

    def get_income_statement(self):

        df = self.stock.finance.income_statement(
            period="year"
        )

        return self.normalize_statement(df)



    # =====================================
    # Lấy Cash Flow
    # =====================================

    def get_cash_flow(self):

        df = self.stock.finance.cash_flow(
            period="year"
        )

        return self.normalize_statement(df)



    # =====================================
    # Lấy Financial Ratio
    # =====================================

    def get_financial_ratio(self):

        df = self.stock.finance.ratio(
            period="year"
        )

        return self.normalize_ratio(df)



    # =====================================
    # Lấy toàn bộ dữ liệu
    # =====================================

    def get_all(self):

        return {

            "symbol": self.symbol,

            "balance_sheet":
                self.get_balance_sheet(),


            "income_statement":
                self.get_income_statement(),


            "cash_flow":
                self.get_cash_flow(),


            "financial_ratio":
                self.get_financial_ratio()

        }




# =====================================
# TEST
# =====================================


if __name__ == "__main__":


    financial = FinancialData("VNM")


    data = financial.get_all()



    print("="*80)
    print("BALANCE SHEET")

    print(
        data["balance_sheet"].head()
    )


    print("="*80)
    print("INCOME STATEMENT")

    print(
        data["income_statement"].head()
    )


    print("="*80)
    print("CASH FLOW")

    print(
        data["cash_flow"].head()
    )


    print("="*80)
    print("FINANCIAL RATIO")

    print(
        data["financial_ratio"].head(20)
    )



    # Test lấy dữ liệu

    bs = data["balance_sheet"]


    print("="*80)
    print("Tổng tài sản 2025")

    print(
        bs.loc[
            "Tổng tài sản",
            "2025"
        ]
    )