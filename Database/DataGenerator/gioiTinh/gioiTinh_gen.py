import random
import time
import os
print(os.getcwd())

def random_num(a):
    return random.randint(0, a - 1)

def random_num_in_range(a, b):
    return random.randint(a, b)

with open("./gioiTinh/gioiTinh.txt", "w", encoding="utf-8") as f, open("./CCCD/cccd.txt", "r", encoding="utf-8") as g:
    for _ in range(50):
        temp = g.readline().strip()
        if len(temp) < 4:
            continue
        k = temp[3]
        if k in ['0', '2']:
            name = "nam"
        elif k in ['1', '3']:
            name = "nu"
        else:
            name = "chua xac dinh"
        if(_ != 49): 
            f.write(name + "\n")
        else: 
            f.write(name)
        time.sleep(random_num(10) / 1000.0)
