import random
with open("./insertNhanKhauHoKhauSQL.sql", "w", encoding="utf-8") as f, open("./CCCD/cccd.txt", "r", encoding="utf-8") as g, open("./HoTen/hoTen.txt", "r", encoding="utf-8") as t, \
    open("./gioiTinh/gioiTinh.txt", "r", encoding="utf-8") as gt, open("./ngaySinh/ngaySinh.txt", "r", encoding="utf-8") as ns,\
        open("./queQuan/queQuan.txt", "r", encoding="utf-8") as qq:
    for i in range(10):
        sql = f"INSERT INTO ho_khau VALUES ({i+1}, '{random.randint(1, 20)} ngach {random.randint(1, 50)}', null);\n"
        f.write(sql)
        for j in range(5):
            cccd = g.readline().strip()
            cccd = cccd.replace('\n', '')
            id_ho_khau = i + 1
            hoTen = t.readline()
            hoTen = hoTen.replace('\n', '')
            gioiTinh = gt.readline()
            gioiTinh = gioiTinh.replace('\n', '')
            ngaySinh = ns.readline().strip()
            ngaySinh = ngaySinh.replace('\n', '')
            que = qq.readline()
            que = que.replace('\n', '')
            quanhe = ""
            if (j == 0):
                quanhe = 'chu ho'
            if (j == 1):
                quanhe = 'vo'
            if (j > 1):
                quanhe = 'con ruot'
            sql = f"INSERT INTO nhan_khau VALUES ('{cccd}' , '{id_ho_khau}' , '{hoTen}' , null ,  '{gioiTinh}' , '{ngaySinh}' , '{que}' , '{que}' , 'kinh' , null , '{quanhe}' , null , '{que}' , '2025-10-31', '2025-10-31' , null , {cccd});\n"
            f.write(sql)
