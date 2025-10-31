import subprocess
import sys

# Danh sách các file cần chạy theo thứ tự (bao gồm .py và .exe)
# Lưu ý: Cung cấp đường dẫn đầy đủ (absolute path) hoặc đường dẫn tương đối (relative path)
files_to_run = [
    "./CCCD/cccd_gen.exe",
    "./gioiTinh/gioiTinh_gen.py",
    "./HoTen/hoTen_gen.py",
    "./ngaySinh/ngaySinh_gen.py",
    "./queQuan/queQuan_gen.py"
]

for file_path in files_to_run:
    print(f"--- Đang chạy: {file_path} ---")

    # Xác định lệnh cần chạy
    if file_path.lower().endswith(".py"):
        # Đối với file Python, cần gọi trình thông dịch Python
        # sys.executable là đường dẫn tới trình thông dịch Python hiện tại
        command = [sys.executable, file_path]
    elif file_path.lower().endswith(".exe"):
        # Đối với file EXE, chỉ cần gọi trực tiếp file đó
        command = [file_path]
    else:
        print(f"Bỏ qua file không phải .py hoặc .exe: {file_path}")
        continue
    
    try:
        # Chạy lệnh. 'check=True' sẽ ném ngoại lệ nếu lệnh trả về mã lỗi khác 0.
        # 'capture_output=True' sẽ thu thập stdout và stderr
        result = subprocess.run(
            command, 
            check=True, 
            capture_output=True, 
            text=True  # Sử dụng text mode
        )
        print("Đã hoàn thành thành công.")
        # print("Output:\n", result.stdout) # Bỏ comment nếu muốn in output của file con
        
    except subprocess.CalledProcessError as e:
        print(f"Lỗi khi chạy {file_path}. Dừng chuỗi thực thi.")
        print(f"Mã lỗi: {e.returncode}")
        # print("Standard Error:\n", e.stderr) # Bỏ comment nếu muốn in lỗi
        break # Dừng lại khi có lỗi
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file {file_path}. Dừng chuỗi thực thi.")
        break
    
print("--- Kết thúc chuỗi thực thi ---")