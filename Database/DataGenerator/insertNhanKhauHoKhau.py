import random
with open("./insertNhanKhauHoKhauSQL.sql", "w", encoding="utf-8") as f, open("./CCCD/cccd.txt", "r", encoding="utf-8") as g, open("./HoTen/hoTen.txt", "r", encoding="utf-8") as t, \
    open("./gioiTinh/gioiTinh.txt", "r", encoding="utf-8") as gt, open("./ngaySinh/ngaySinh.txt", "r", encoding="utf-8") as ns,\
        open("./queQuan/queQuan.txt", "r", encoding="utf-8") as qq:
    id = 1
    for i in range(10): #chỉnh dòng này thành in range(11, 20) (21, 30) tùy vào số lượng hộ hiện tại 
        sql = f"INSERT INTO ho_khau VALUES ({i+1}, 'Số {random.randint(1, 20)} ngách {random.randint(1, 50)} Ngõ {random.randint(355,359)} Minh Khai, Phường Vĩnh Tuy', null);\n"
        f.write(sql)
        for j in range(5):
            cccd = g.readline().strip()
            cccd = cccd.replace('\n', '')
            id_ho_khau = i + 1
            hoTen = t.readline()
            hoTen = hoTen.replace('\n', '')
            gioiTinh = gt.readline()
            gioiTinh = gioiTinh.replace('\n', '')
            if(gioiTinh == 'nam'): gioiTinh = 'Nam'
            else: gioiTinh = 'Nữ'
            ngaySinh = ns.readline().strip()
            ngaySinh = ngaySinh.replace('\n', '')
            que = qq.readline()
            que = que.replace('\n', '')
            quanhe = ""
            if (j == 0):
                quanhe = 'Chủ hộ'
            if (j == 1):
                quanhe = 'Vợ'
            if (j > 1):
                quanhe = 'Con ruột'
            sql = f"INSERT INTO cong_dan VALUES ({id},'{cccd}', '{hoTen}' , 'Không có' ,  '{gioiTinh}' , '{ngaySinh}' , '{que}' , '{que}' , 'Kinh' , null , null , '{que}' , '2025-10-31', '{cccd}');\n"
            f.write(sql)
            sql = f"INSERT INTO nhan_khau VALUES ({id}, {i+1},'{quanhe}', '{ngaySinh}' , null );\n"
            f.write(sql)
            id += 1
            print(id)