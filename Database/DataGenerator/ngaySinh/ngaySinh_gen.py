from datetime import datetime
import random
import time
chuoi_date = "2025-10-31" 
dinh_dang = "%Y-%m-%d"

with open("./ngaySinh/ngaySinh.txt", "w", encoding="utf-8") as f, open("./CCCD/cccd.txt", "r", encoding="utf-8") as g:
    for i in range(50):
        temp = g.readline().strip()
        if len(temp) < 4:
            continue
        k = int(temp[4:6])
        mode = int(temp[3])    #xem thuoc the ki nao
        if mode in [0, 1]:
            chuoi_date = f"{1900 + k}-{random.randint(1,12)}-{random.randint(1,31)}"
        elif mode in [2, 3]:
            chuoi_date = f"{2000 + k}-{random.randint(1,12)}-{random.randint(1,31)}"
        try:
            # 2. Chuyển đổi thành đối tượng datetime
            dt_object = datetime.strptime(chuoi_date, dinh_dang)
            
            # 3. Trích xuất đối tượng date (vì YYYY-MM-DD không có giờ)
            date_object = dt_object.date()
            f.write(chuoi_date)
            if(i != 49):
                f.write("\n")
        except ValueError as e:
            # Lỗi chỉ xảy ra nếu ngày không hợp lệ (ví dụ: "2025-02-30")
            i -= 1
            continue
        time.sleep(random.randint(0,10) / 1000.0)
