# Web Quản Lý Thông Tin Dân Cư & Phản Ánh Kiến Nghị

Hệ thống Website hỗ trợ quản lý nhân khẩu, hộ khẩu và xử lý các thủ tục hành chính cư trú trực tuyến, giúp tối ưu hóa công tác quản lý của ban quản lý và nâng cao tương tác của cư dân.

## Tổng Quan Dự Án
- **Mã lớp:** 161311
- **Nhóm:** 16
- **Giảng viên hướng dẫn:** Trần Nhật Hóa
- **Sản phẩm:** Hệ thống quản lý dân cư và phản ánh, kiến nghị

## Tính Năng Chính
### Vai Trò Quản Lý (Tổ trưởng/Tổ phó)
- **Thống kê:** Biểu đồ nhân khẩu theo độ tuổi, giới tính, tình trạng cư trú theo thời gian.
- **Quản lý hộ khẩu:** xXem, tìm kiếm thông tin chi tiết, thêm/tách hộ khẩu, quản lý nhân khẩu chi tiết như thêm, xóa nhân khẩu trong hộ.
- **Quản lý nhân khẩu:** Xem, tìm kiếm thông tin chi tiết, chỉnh sửa thông tin của nhân khẩu.
- **Xử lý đơn thường trú/tạm trú:** Xem và duyệt/từ chối đơn thường trú, tạm trú.
- **Tạm vắng:** Xem và theo dõi thông tin nhân khẩu đang tạm vắng và hiệu lực thời gian tạm vắng.
- **Phản hồi:** Tiếp nhận và xử lý các kiến nghị từ cư dân.

### Vai Trò Cư Dân
- **Thông tin chi tiết:** Xem chi tiết thông tin cá nhân, thông tin hộ khẩu và thông tin các thành viên trong gia đình.
- **Thủ tục:** Gửi đăng ký thường trú/tạm trú cho con/cháu chưa có CCCD.
- **Tạm vắng:** Khai báo tạm vắng với ban quản lý.
- **Lịch sử biến động:** Thông tin biến động của hộ như những ai gửi đơn thường trú/tạm trú, tạm vắng, những ai chuyển đi, đã mất.
- **Phản ánh:** Gửi phản ánh, kiến nghị với ban quản lý.
- **Gia hạn:** Đối với những hộ Tạm trú, có thể gia hạn thêm thời gian tạm trú.

### Vai Trò Người Mới
- **Đăng ký theo hộ:** Có thể đăng ký thường trú/tạm trú vào một hộ có sẵn hoặc tạo hộ mới. Nếu là hộ có sẵn, cần nhập CCCD của chủ hộ đó để kiểm tra thông tin.
- **Thường trú/Tạm trú:** Có thể đăng ký thông tin cho bản thân và đăng ký cùng cho thành viên cùng hộ gia đình.
  
## Công Nghệ Sử Dụng
- **Frontend:** HTML, CSS, JavaScript (Vanilla JS).
- **Backend:** Node.js, Express Framework.
- **Database:** MySQL.
- **Khác:** RESTful API, Nginx (Deploy), Promise2.

## Phụ thuộc chính

### Backend

| Thư viện            | Mô tả                         |
|---------------------|-------------------------------|
| express             | Web framework cho Node.js     |
| mysql2              | Kết nối cơ sở dữ liệu MySQL   |
| jsonwebtoken        | Xác thực JWT                  |
| cors                | Hỗ trợ CORS                   |
| bcryptjs            | Mã hóa mật khẩu               |


## Cấu trúc thư mục

```
.
├── Database/ 
├── Backend/               # Node.js + Express
|   ├── config/            # Connect MySQL
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   └── package.json
├── Frontend/              # HTML + CSS + JS 
│   ├── index.html
|   ├── Login
|   ├── Logout
|   ├── Manager
|   ├── Resident
|   ├── Newresident
└── CreateSecretKey.js
   

```

## Hướng dẫn cài đặt

### 1. Clone dự án về máy

```bash
git clone `https://github.com/tyn275/Population-and-Household-registration-management.git`
```

### 2. Cài đặt MySQL và MySQL Workbench

- Tải và cài đặt MySQL: [MySQL Download](https://dev.mysql.com/downloads/mysql/)
- Tải và cài đặt MySQL Workbench: [Workbench Download](https://dev.mysql.com/downloads/workbench/)

### 3. Tạo cơ sở dữ liệu `QLDT` và import dữ liệu

1. Mở MySQL Workbench
2. Kết nối đến server MySQL
3. Tạo DATABASE:

```sql
CREATE DATABASE `todanpho`;
```

4. Chạy file `Dump20251229%20(1).sql` trong thư mục `Database` để tạo bảng và dữ liệu mẫu

### 4. Cài đặt Node.js và npm

- Tải và cài đặt tại: [https://nodejs.org/](https://nodejs.org/)

Kiểm tra đã cài thành công:

```bash
node -v
npm -v
```

### 5. Cấu hình kết nối cơ sở dữ liệu

Xem chi tiết trong `Backend/config/dbMySQL.js`

### 6. Cài đặt các thư viện cần thiết

Di chuyển đến thư mục backend:

```bash
cd Backend
```

Cài đặt các package bằng `npm`:

```bash
npm install
```

> Danh sách thư viện cần thiết:
- `mysql2`
- `express`
- `cors`
- `dotenv` (nếu sử dụng biến môi trường .evn)

### 7. Chạy backend server

Chạy lệnh: 

```bash
npm run start
```

### 8. Tài khoản đăng nhập mẫu


| Vai trò     | Tài khoản | Mật khẩu  |
|-------------|-----------|-----------|
| Quản lý | 012345678912     | 123456    |
| Cư dân | 023081017260    | 123456   |
| Cư dân | 111111111112   | 123456   |

## Video demo
(https://youtu.be/PDskPL9W8Ys?si=86T2Z8BwtEq6nAaR)
