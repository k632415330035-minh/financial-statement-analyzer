import random
import time

def random_num(a):
    return random.randint(0, a - 1)

def random_num_in_range(a, b):
    return random.randint(a, b)

ho = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"]
male_middle_names = ["Văn", "Duy", "Đức", "Minh", "Hữu", "Quang", "Bảo", "Hoàng", "Thế", "Phúc", "An", "Khánh", "Trang"]
female_middle_names = ["Thị", "Ngọc", "Mỹ", "Thu", "Mai", "Huyền", "Thùy", "Kim", "Ánh", "Diễm", "An", "Khánh", "Trang"]
male_names = ["Dũng", "Cường", "Thắng", "Long", "Hải", "Sơn", "Thành", "Việt", "Trung", "Hiếu", "Tài", "Khoa", "Phúc", "Khải", "Quân", "Toàn", "Thiện", "Minh", "Hoàng", "Hùng", "An", "Thanh", "Bình", "Minh", "Khánh", "Vinh"]
female_names = ["Hương", "Mai", "Lan", "Ngọc", "Trang", "Linh", "Phương", "Hạnh", "Thảo", "Yến", "Nhi", "Anh", "Vân", "Diễm", "Hiền", "Thúy", "Quyên", "Giang", "Hòa", "Uyên", "An", "Thanh", "Bình", "Minh", "Khánh", "Vinh"]

with open("./HoTen/hoTen.txt", "w", encoding="utf-8") as f, open("./CCCD/cccd.txt", "r", encoding="utf-8") as g:
    for _ in range(50):
        temp = g.readline().strip()
        if len(temp) < 4:
            continue
        k = temp[3]
        if k in ['0', '2']:
            name = f"{random.choice(ho)} {random.choice(male_middle_names)} {random.choice(male_names)}"
        elif k in ['1', '3']:
            name = f"{random.choice(ho)} {random.choice(female_middle_names)} {random.choice(female_names)}"
        else:
            continue
        if(_ != 49): 
            f.write(name + "\n")
        else: 
            f.write(name)
        time.sleep(random_num(10) / 1000.0)
