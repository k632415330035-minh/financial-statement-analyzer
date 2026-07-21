import pdfplumber


def read_pdf(file_path):
    """
    Đọc toàn bộ nội dung PDF.

    Returns:
        {
            "pages": [...],
            "tables": [...]
        }
    """

    pages = []
    tables = []

    try:

        with pdfplumber.open(file_path) as pdf:

            total_pages = len(pdf.pages)

            for page_number, page in enumerate(pdf.pages, start=1):

                # ===== TEXT =====
                text = page.extract_text() or ""

                pages.append({
                    "page": page_number,
                    "text": text
                })

                # ===== TABLE =====
                for table in page.extract_tables():
                    tables.append({
                        "page": page_number,
                        "table": table
                    })

        return {
            "total_pages": total_pages,
            "pages": pages,
            "tables": tables
        }

    except Exception as e:

        print(f"PDF Parser Error: {e}")

        return {
            "total_pages": 0,
            "pages": [],
            "tables": []
        }


if __name__ == "__main__":

    pdf = read_pdf("uploads/test.pdf")

    print("=" * 60)
    print("Pages :", pdf["total_pages"])
    print("Tables:", len(pdf["tables"]))
    print("=" * 60)

    # In 10 trang đầu để kiểm tra
    for page in pdf["pages"][:10]:

        print(f"\n{'='*60}")
        print(f"PAGE {page['page']}")
        print(f"{'='*60}")

        print(page["text"][:1500])