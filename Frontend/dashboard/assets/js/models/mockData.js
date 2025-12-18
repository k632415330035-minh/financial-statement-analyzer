// Mock Data Store

export const mockData = {
  kpis: { households: 765, residents: 2430, tempResidence: 125, tempAbsence: 78 },
  monthlyChangesByYear: {
    2024: [12, 18, 22, 30, 38, 40, 52, 61, 43, 28, 20, 16],
    2025: [15, 20, 24, 36, 44, 48, 55, 70, 50, 35, 22, 18]
  },
  profile: {
    hoTen: 'Nguyễn Văn A',
    biDanh: 'CCCD',
    ngaySinh: '20/5/1998',
    gioiTinh: 'Nam',
    noiSinh: 'Hà Đông, Hà Nội',
    nguonQuan: 'La Khê, Hà Đông, Hà Nội',
    danToc: 'Kinh',
    ngayDangKy: '1/1/2010',
    diaChiThuongTru: 'Số 1 Ngõ 1, La Khê',
    soDienThoai: '0900000000',
    cccd: '0123•••902',
    ngayCapCCCD: '1/6/2016',
    noiCapCCCD: 'Cục CSQLHC về TTXH',
    coQuanCSQLHC: 'Cục CSQLHC về TTXH',
    kySu: 'Kỹ sư',
    congTy: 'Công ty TNHH ABC',
    con: 'Con',
    thuongTru: 'Thương trú'
  },
  households: [
    { soHK:'1234567890', chuHo:'Nguyễn Văn An', diaChi:'12 Đường A, Phường B', sl:4, history:[], members:[
      {hoTen:'Nguyễn Văn An',biDanh:'',namSinh:1975,ngaySinh:'15/3/1975',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Chủ hộ',cccd:'001075012345',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'1/1/2010',diaChiTruocDo:'',diaChiHienTai:'12 Đường A, Phường B',trangThaiCuTru:'Thường trú',sdt:'0912345678',nghePhuong:'Kỹ sư',noiLamViec:'Công ty TNHH ABC'},
      {hoTen:'Trần Thị Mai',biDanh:'',namSinh:1978,ngaySinh:'20/5/1978',gioiTinh:'Nữ',noiSinh:'Hà Đông',nguonQuan:'La Khê, Hà Đông',danToc:'Kinh',quanHe:'Vợ',cccd:'001078023456',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'1/1/2010',diaChiTruocDo:'',diaChiHienTai:'12 Đường A, Phường B',trangThaiCuTru:'Thường trú',sdt:'0987654321',nghePhuong:'Nội trợ',noiLamViec:''},
      {hoTen:'Nguyễn Văn Bình',biDanh:'',namSinh:2005,ngaySinh:'10/8/2005',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001005034567',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'1/1/2010',diaChiTruocDo:'',diaChiHienTai:'12 Đường A, Phường B',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''},
      {hoTen:'Nguyễn Thị Lan',biDanh:'',namSinh:2010,ngaySinh:'25/12/2010',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001010045678',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'1/1/2010',diaChiTruocDo:'',diaChiHienTai:'12 Đường A, Phường B',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''}
    ]},
    { soHK:'1234567881', chuHo:'Trần Thị Bình', diaChi:'45 Đường C, Phường D', sl:5, history:[], members:[
      {hoTen:'Trần Thị Bình',biDanh:'',namSinh:1980,ngaySinh:'12/6/1980',gioiTinh:'Nữ',noiSinh:'Hà Đông',nguonQuan:'La Khê',danToc:'Kinh',quanHe:'Chủ hộ',cccd:'001080012345',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'15/3/2005',diaChiTruocDo:'Xã X, Huyện Y',diaChiHienTai:'45 Đường C, Phường D',trangThaiCuTru:'Thường trú',sdt:'0934567890',nghePhuong:'Nhân viên bán hàng',noiLamViec:'Siêu thị ABC'},
      {hoTen:'Lê Văn Dũng',biDanh:'',namSinh:1978,ngaySinh:'8/4/1978',gioiTinh:'Nam',noiSinh:'Hải Phòng',nguonQuan:'Hải Phòng',danToc:'Kinh',quanHe:'Chồng',cccd:'001078023456',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'15/3/2005',diaChiTruocDo:'Hải Phòng',diaChiHienTai:'45 Đường C, Phường D',trangThaiCuTru:'Thường trú',sdt:'0945678901',nghePhuong:'Thợ cơ khí',noiLamViec:'Xưởng cơ khí ABC'},
      {hoTen:'Trần Văn Nam',biDanh:'',namSinh:2003,ngaySinh:'5/7/2003',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001003034567',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'15/3/2005',diaChiTruocDo:'',diaChiHienTai:'45 Đường C, Phường D',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Sinh viên',noiLamViec:''},
      {hoTen:'Trần Thị Hoa',biDanh:'',namSinh:2008,ngaySinh:'14/11/2008',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001008045678',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'15/3/2005',diaChiTruocDo:'',diaChiHienTai:'45 Đường C, Phường D',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''},
      {hoTen:'Trần Văn Tùng',biDanh:'',namSinh:2012,ngaySinh:'3/9/2012',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001012056789',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'15/3/2005',diaChiTruocDo:'',diaChiHienTai:'45 Đường C, Phường D',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''}
    ]},
    { soHK:'1234567872', chuHo:'Lê Văn Cường', diaChi:'78 Đường E, Phường F', sl:3, history:[], members:[
      {hoTen:'Lê Văn Cường',biDanh:'',namSinh:1985,ngaySinh:'22/7/1985',gioiTinh:'Nam',noiSinh:'Hà Nam',nguonQuan:'Hà Nam',danToc:'Kinh',quanHe:'Chủ hộ',cccd:'001085012345',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'10/5/2008',diaChiTruocDo:'Hà Nam',diaChiHienTai:'78 Đường E, Phường F',trangThaiCuTru:'Thường trú',sdt:'0956789012',nghePhuong:'Kỹ sư xây dựng',noiLamViec:'Công ty XYZ'},
      {hoTen:'Phạm Thị Hương',biDanh:'',namSinh:1987,ngaySinh:'18/2/1987',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Vợ',cccd:'001087023456',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'10/5/2008',diaChiTruocDo:'Hà Nội',diaChiHienTai:'78 Đường E, Phường F',trangThaiCuTru:'Thường trú',sdt:'0967890123',nghePhuong:'Bác sĩ',noiLamViec:'Bệnh viện ABC'},
      {hoTen:'Lê Minh Anh',biDanh:'',namSinh:2015,ngaySinh:'9/1/2015',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001015034567',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'10/5/2008',diaChiTruocDo:'',diaChiHienTai:'78 Đường E, Phường F',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''}
    ]},
    { soHK:'1234567863', chuHo:'Phạm Quỳnh', diaChi:'11 Đường G, Phường H', sl:6, history:[], members:[
      {hoTen:'Phạm Quỳnh',biDanh:'',namSinh:1972,ngaySinh:'7/11/1972',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Chủ hộ',cccd:'001072012345',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'20/1/2000',diaChiTruocDo:'Hà Nội cũ',diaChiHienTai:'11 Đường G, Phường H',trangThaiCuTru:'Thường trú',sdt:'0978901234',nghePhuong:'Hưu trí',noiLamViec:''},
      {hoTen:'Đỗ Văn Hùng',biDanh:'',namSinh:1970,ngaySinh:'15/8/1970',gioiTinh:'Nam',noiSinh:'Hải Dương',nguonQuan:'Hải Dương',danToc:'Kinh',quanHe:'Chồng',cccd:'001070023456',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'20/1/2000',diaChiTruocDo:'Hải Dương',diaChiHienTai:'11 Đường G, Phường H',trangThaiCuTru:'Thường trú',sdt:'0989012345',nghePhuong:'Hưu trí',noiLamViec:''},
      {hoTen:'Phạm Văn Toàn',biDanh:'',namSinh:2000,ngaySinh:'12/4/2000',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001000034567',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'20/1/2000',diaChiTruocDo:'',diaChiHienTai:'11 Đường G, Phường H',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Sinh viên',noiLamViec:''},
      {hoTen:'Phạm Thị Thảo',biDanh:'',namSinh:2002,ngaySinh:'28/6/2002',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001002045678',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'20/1/2000',diaChiTruocDo:'',diaChiHienTai:'11 Đường G, Phường H',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Sinh viên',noiLamViec:''},
      {hoTen:'Phạm Văn Long',biDanh:'',namSinh:2006,ngaySinh:'31/10/2006',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001006056789',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'20/1/2000',diaChiTruocDo:'',diaChiHienTai:'11 Đường G, Phường H',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''},
      {hoTen:'Đỗ Thị Nga',biDanh:'',namSinh:1945,ngaySinh:'5/3/1945',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Mẹ chồng',cccd:'001045067890',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'20/1/2000',diaChiTruocDo:'',diaChiHienTai:'11 Đường G, Phường H',trangThaiCuTru:'Thường trú',sdt:'0990123456',nghePhuong:'Hưu trí',noiLamViec:''}
    ]},
    { soHK:'1234567854', chuHo:'Bùi Minh Hải', diaChi:'22 Đường I, Phường J', sl:2, history:[], members:[
      {hoTen:'Bùi Minh Hải',biDanh:'',namSinh:1990,ngaySinh:'19/9/1990',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Chủ hộ',cccd:'001090012345',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'5/8/2015',diaChiTruocDo:'Hà Nội cũ',diaChiHienTai:'22 Đường I, Phường J',trangThaiCuTru:'Thường trú',sdt:'0901234567',nghePhuong:'Lập trình viên',noiLamViec:'Công ty CNTT DEF'},
      {hoTen:'Nguyễn Thị Linh',biDanh:'',namSinh:1992,ngaySinh:'14/5/1992',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Vợ',cccd:'001092023456',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'5/8/2015',diaChiTruocDo:'Hà Nội cũ',diaChiHienTai:'22 Đường I, Phường J',trangThaiCuTru:'Thường trú',sdt:'0912345670',nghePhuong:'Giáo viên',noiLamViec:'Trường THCS ABC'}
    ]},
    { soHK:'1234567845', chuHo:'Đỗ Hồng Sơn', diaChi:'33 Đường K, Phường L', sl:5, history:[], members:[
      {hoTen:'Đỗ Hồng Sơn',biDanh:'',namSinh:1982,ngaySinh:'26/12/1982',gioiTinh:'Nam',noiSinh:'Hải Dương',nguonQuan:'Hải Dương',danToc:'Kinh',quanHe:'Chủ hộ',cccd:'001082012345',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'12/3/2010',diaChiTruocDo:'Hải Dương',diaChiHienTai:'33 Đường K, Phường L',trangThaiCuTru:'Thường trú',sdt:'0923456781',nghePhuong:'Nhân viên kinh doanh',noiLamViec:'Công ty ABC'},
      {hoTen:'Vũ Thị Thanh',biDanh:'',namSinh:1984,ngaySinh:'17/7/1984',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Vợ',cccd:'001084023456',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'12/3/2010',diaChiTruocDo:'Hà Nội',diaChiHienTai:'33 Đường K, Phường L',trangThaiCuTru:'Thường trú',sdt:'0934567892',nghePhuong:'Kế toán',noiLamViec:'Công ty XYZ'},
      {hoTen:'Đỗ Văn Khoa',biDanh:'',namSinh:2007,ngaySinh:'8/11/2007',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001007034567',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'12/3/2010',diaChiTruocDo:'',diaChiHienTai:'33 Đường K, Phường L',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''},
      {hoTen:'Đỗ Thị Phương',biDanh:'',namSinh:2010,ngaySinh:'30/4/2010',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001010045678',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'12/3/2010',diaChiTruocDo:'',diaChiHienTai:'33 Đường K, Phường L',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''},
      {hoTen:'Đỗ Văn Minh',biDanh:'',namSinh:2014,ngaySinh:'11/6/2014',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001014056789',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'12/3/2010',diaChiTruocDo:'',diaChiHienTai:'33 Đường K, Phường L',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Mầm non',noiLamViec:''}
    ]},
    { soHK:'1234567836', chuHo:'Lý Thảo', diaChi:'44 Đường M, Phường N', sl:4, history:[], members:[
      {hoTen:'Lý Thảo',biDanh:'',namSinh:1988,ngaySinh:'3/9/1988',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Chủ hộ',cccd:'001088012345',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'8/7/2012',diaChiTruocDo:'Hà Nội cũ',diaChiHienTai:'44 Đường M, Phường N',trangThaiCuTru:'Thường trú',sdt:'0945678903',nghePhuong:'Quản lý dự án',noiLamViec:'Công ty GHI'},
      {hoTen:'Hoàng Văn Tâm',biDanh:'',namSinh:1986,ngaySinh:'22/10/1986',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Chồng',cccd:'001086023456',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'8/7/2012',diaChiTruocDo:'Hà Nội cũ',diaChiHienTai:'44 Đường M, Phường N',trangThaiCuTru:'Thường trú',sdt:'0956789014',nghePhuong:'Nhân viên bán hàng',noiLamViec:'Siêu thị JKL'},
      {hoTen:'Hoàng Minh Tuấn',biDanh:'',namSinh:2011,ngaySinh:'16/3/2011',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001011034567',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'8/7/2012',diaChiTruocDo:'',diaChiHienTai:'44 Đường M, Phường N',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''},
      {hoTen:'Hoàng Thị Mai',biDanh:'',namSinh:2016,ngaySinh:'27/11/2016',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001016045678',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'8/7/2012',diaChiTruocDo:'',diaChiHienTai:'44 Đường M, Phường N',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Mầm non',noiLamViec:''}
    ]},
    { soHK:'1234567827', chuHo:'Phan Gia Hưng', diaChi:'55 Đường O, Phường P', sl:3, history:[], members:[
      {hoTen:'Phan Gia Hưng',biDanh:'',namSinh:1995,ngaySinh:'13/2/1995',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Chủ hộ',cccd:'001095012345',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'20/9/2018',diaChiTruocDo:'Hà Nội cũ',diaChiHienTai:'55 Đường O, Phường P',trangThaiCuTru:'Thường trú',sdt:'0967890125',nghePhuong:'Lập trình viên',noiLamViec:'Công ty CNTT MNO'},
      {hoTen:'Đinh Thị Lan',biDanh:'',namSinh:1996,ngaySinh:'7/6/1996',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Vợ',cccd:'001096023456',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'20/9/2018',diaChiTruocDo:'Hà Nội cũ',diaChiHienTai:'55 Đường O, Phường P',trangThaiCuTru:'Thường trú',sdt:'0978901236',nghePhuong:'Thiết kế đồ họa',noiLamViec:'Công ty Creative PQR'},
      {hoTen:'Phan Gia Bảo',biDanh:'',namSinh:2020,ngaySinh:'15/8/2020',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001020034567',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'20/9/2018',diaChiTruocDo:'',diaChiHienTai:'55 Đường O, Phường P',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Mầm non',noiLamViec:''}
    ]},
    { soHK:'1234567818', chuHo:'Đặng Thu', diaChi:'66 Đường Q, Phường R', sl:5, history:[], members:[
      {hoTen:'Đặng Thu',biDanh:'',namSinh:1979,ngaySinh:'10/1/1979',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Chủ hộ',cccd:'001079012345',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'3/4/2008',diaChiTruocDo:'Hà Nội cũ',diaChiHienTai:'66 Đường Q, Phường R',trangThaiCuTru:'Thường trú',sdt:'0989012347',nghePhuong:'Kế toán trưởng',noiLamViec:'Công ty STU'},
      {hoTen:'Trương Văn Hải',biDanh:'',namSinh:1977,ngaySinh:'19/11/1977',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Chồng',cccd:'001077023456',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'3/4/2008',diaChiTruocDo:'Hà Nội cũ',diaChiHienTai:'66 Đường Q, Phường R',trangThaiCuTru:'Thường trú',sdt:'0990123458',nghePhuong:'Quản lý kho',noiLamViec:'Công ty Logistics VWX'},
      {hoTen:'Trương Văn Đức',biDanh:'',namSinh:2004,ngaySinh:'23/5/2004',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001004034567',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'3/4/2008',diaChiTruocDo:'',diaChiHienTai:'66 Đường Q, Phường R',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Sinh viên',noiLamViec:''},
      {hoTen:'Trương Thị Nga',biDanh:'',namSinh:2009,ngaySinh:'6/8/2009',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001009045678',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'3/4/2008',diaChiTruocDo:'',diaChiHienTai:'66 Đường Q, Phường R',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''},
      {hoTen:'Trương Văn Thắng',biDanh:'',namSinh:2013,ngaySinh:'29/12/2013',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001013056789',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'3/4/2008',diaChiTruocDo:'',diaChiHienTai:'66 Đường Q, Phường R',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''}
    ]},
    { soHK:'1234567809', chuHo:'Tạ Hoài Nam', diaChi:'77 Đường S, Phường T', sl:4, history:[], members:[
      {hoTen:'Tạ Hoài Nam',biDanh:'',namSinh:1983,ngaySinh:'11/4/1983',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Chủ hộ',cccd:'001083012345',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'14/6/2011',diaChiTruocDo:'Hà Nội cũ',diaChiHienTai:'77 Đường S, Phường T',trangThaiCuTru:'Thường trú',sdt:'0901234569',nghePhuong:'Nhân viên bán bảo hiểm',noiLamViec:'Công ty BH YZA'},
      {hoTen:'Cao Thị Kim',biDanh:'',namSinh:1985,ngaySinh:'24/9/1985',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Vợ',cccd:'001085023456',ngayCapCCCD:'1/6/2016',noiCapCCCD:'Cục CSQLHC về TTXH',ngayDangKy:'14/6/2011',diaChiTruocDo:'Hà Nội cũ',diaChiHienTai:'77 Đường S, Phường T',trangThaiCuTru:'Thường trú',sdt:'0912345671',nghePhuong:'Nhân viên hành chính',noiLamViec:'Công ty BCD'},
      {hoTen:'Tạ Văn Duy',biDanh:'',namSinh:2008,ngaySinh:'18/7/2008',gioiTinh:'Nam',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001008034567',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'14/6/2011',diaChiTruocDo:'',diaChiHienTai:'77 Đường S, Phường T',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Học sinh',noiLamViec:''},
      {hoTen:'Tạ Thị Nhung',biDanh:'',namSinh:2012,ngaySinh:'2/10/2012',gioiTinh:'Nữ',noiSinh:'Hà Nội',nguonQuan:'Hà Nội',danToc:'Kinh',quanHe:'Con',cccd:'001012045678',ngayCapCCCD:'',noiCapCCCD:'',ngayDangKy:'14/6/2011',diaChiTruocDo:'',diaChiHienTai:'77 Đường S, Phường T',trangThaiCuTru:'Thường trú',sdt:'',nghePhuong:'Mầm non',noiLamViec:''}
    ]}
  ],
  residenceShare: [
    { label: 'Thường trú', value: 2227, color: '#3b82f6' },
    { label: 'Tạm trú', value: 125, color: '#22c55e' },
    { label: 'Tạm vắng', value: 78, color: '#f59e0b' }
  ],
  genderCounts: { male: 1210, female: 1220, other: 0 },
  ageGroupCounts: { 
    mamNon: 120, mauGiao: 180, cap1: 350, cap2: 400, cap3: 300, laoDong: 900, nghiHuu: 180,
    children: 650, young: 950, middle: 650, senior: 180
  },
  eventMonthly: {
    2024: { tam_tru: [8, 9, 12, 10, 14, 13, 11, 12, 10, 9, 8, 7], tam_vang: [6, 5, 7, 8, 7, 9, 10, 11, 9, 8, 7, 6] },
    2025: { tam_tru: [10, 12, 14, 15, 16, 14, 13, 15, 12, 11, 10, 9], tam_vang: [7, 6, 8, 9, 8, 10, 11, 12, 10, 9, 8, 7] }
  }
};
