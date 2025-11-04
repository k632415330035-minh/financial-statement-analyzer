CREATE TABLE historyLog(
	logID int auto_increment primary key,
	date_time timestamp not null default current_timestamp,
    table_name varchar(50) not null,
    record_id varchar(50) not null,
    column_name varchar(50) not null,
    old_value varchar(50) not null,
    new_value varchar(50) not null
);
select * from nhan_khau;

DELIMITER $$

CREATE TRIGGER nhan_khau_after_update
AFTER UPDATE ON nhan_khau
FOR EACH ROW
BEGIN
    INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
    
    -- Bắt đầu khối SELECT đầu tiên
    SELECT 'nhan_khau', OLD.cccd, 'ho_ten', OLD.ho_ten, NEW.ho_ten 
    WHERE NOT (OLD.ho_ten <=> NEW.ho_ten)
    
    UNION ALL

    SELECT 'nhan_khau', OLD.cccd, 'bi_danh', OLD.bi_danh, NEW.bi_danh 
    WHERE NOT (OLD.bi_danh <=> NEW.bi_danh)
    
    UNION ALL

    SELECT 'nhan_khau', OLD.cccd, 'gioi_tinh', OLD.gioi_tinh, NEW.gioi_tinh 
    WHERE NOT (OLD.gioi_tinh <=> NEW.gioi_tinh)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.cccd, 'ngay_sinh', OLD.ngay_sinh, NEW.ngay_sinh 
    WHERE NOT (OLD.ngay_sinh <=> NEW.ngay_sinh)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.cccd, 'noi_sinh', OLD.noi_sinh, NEW.noi_sinh 
    WHERE NOT (OLD.noi_sinh <=> NEW.noi_sinh)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.cccd, 'que_quan', OLD.que_quan, NEW.que_quan 
    WHERE NOT (OLD.que_quan <=> NEW.que_quan)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.cccd, 'dan_toc', OLD.dan_toc, NEW.dan_toc 
    WHERE NOT (OLD.dan_toc <=> NEW.dan_toc)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.cccd, 'nghe_nghiep', OLD.nghe_nghiep, NEW.nghe_nghiep 
    WHERE NOT (OLD.nghe_nghiep <=> NEW.nghe_nghiep)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.cccd, 'quan_he_voi_chu_ho', OLD.quan_he_voi_chu_ho, NEW.quan_he_voi_chu_ho 
    WHERE NOT(OLD.quan_he_voi_chu_ho <=> NEW.quan_he_voi_chu_ho)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.cccd, 'noi_lam_viec', OLD.noi_lam_viec, NEW.noi_lam_viec 
    WHERE NOT(OLD.noi_lam_viec <=> NEW.noi_lam_viec)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.cccd, 'noi_cap', OLD.noi_cap, NEW.noi_cap 
    WHERE NOT(OLD.noi_cap <=> NEW.noi_cap)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.cccd, 'ngay_cap', OLD.ngay_cap, NEW.ngay_cap 
    WHERE NOT(OLD.ngay_cap <=> NEW.ngay_cap)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.cccd, 'ngay_dang_ki_thuong_tru', OLD.ngay_dang_ki_thuong_tru, NEW.ngay_dang_ki_thuong_tru 
    WHERE NOT(OLD.ngay_dang_ki_thuong_tru <=> NEW.ngay_dang_ki_thuong_tru)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.cccd, 'thuong_tru_truoc_day', OLD.thuong_tru_truoc_day, NEW.thuong_tru_truoc_day 
    WHERE NOT(OLD.thuong_tru_truoc_day <=> NEW.thuong_tru_truoc_day); -- CHỈ THIẾU DẤU CHẤM PHẨY Ở ĐÂY
    
END$$ 
DELIMITER ;

SELECT * FROM ho_khau;
DELIMITER $$

CREATE TRIGGER ho_khau_after_update
AFTER UPDATE ON ho_khau
FOR EACH ROW
BEGIN
    INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
    
    -- Bắt đầu khối SELECT đầu tiên
    SELECT 'ho_khau', OLD.id_ho_khau, 'address', OLD.address, NEW.address 
    WHERE NOT (OLD.address <=> NEW.address)
    
    UNION ALL

    SELECT 'ho_khau', OLD.id_ho_khau, 'id_tt', OLD.id_tt, NEW.id_tt 
    WHERE NOT (OLD.id_tt <=> NEW.id_tt);
END$$
DELIMITER ;


