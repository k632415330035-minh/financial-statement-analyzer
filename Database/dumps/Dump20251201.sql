CREATE DATABASE  IF NOT EXISTS `todanpho` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `todanpho`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: todanpho
-- ------------------------------------------------------
-- Server version	8.0.43
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `userID` varchar(20) NOT NULL,
  `_password` varchar(50) NOT NULL,
  `_type` enum('cu dan','quan ly','tam thoi') NOT NULL DEFAULT 'tam thoi',
  PRIMARY KEY (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES ('001079023664','123456','cu dan'),('002182005067','123456','cu dan'),('006205016356','123456','cu dan'),('008171023365','123456','cu dan'),('012097008038','123456','cu dan'),('014184016247','123456','cu dan'),('015210029700','123456','cu dan'),('015219022550','123456','cu dan'),('017093013983','123456','cu dan'),('020305006891','123456','cu dan'),('023081017260','123456','cu dan'),('023082000064','123456','cu dan'),('023218008760','123456','cu dan'),('025095031388','123456','cu dan'),('025176014707','123456','cu dan'),('025197026243','123456','cu dan'),('025214014006','123456','cu dan'),('026225032391','123456','cu dan'),('027310021996','123456','cu dan'),('037092025749','123456','cu dan'),('037186000354','123456','cu dan'),('037191009161','123456','cu dan'),('038211022449','123456','cu dan'),('042179022503','123456','cu dan'),('042314006243','123456','cu dan'),('044205003741','123456','cu dan'),('044223000785','123456','cu dan'),('045306022984','123456','cu dan'),('046074017254','123456','cu dan'),('049099007779','123456','cu dan'),('052196028259','123456','cu dan'),('054085029356','123456','cu dan'),('056221003382','123456','cu dan'),('060214030588','123456','cu dan'),('066300028737','123456','cu dan'),('068073031124','123456','cu dan'),('070080015596','123456','cu dan'),('070193005762','123456','cu dan'),('074307029488','123456','cu dan'),('077180007735','123456','cu dan'),('079173011516','123456','cu dan'),('082219022726','123456','cu dan'),('084083003461','123456','cu dan'),('084302013839','123456','cu dan'),('091302000789','123456','cu dan'),('092189012462','123456','cu dan'),('093306018589','123456','cu dan'),('094181002195','123456','cu dan'),('094214032241','123456','cu dan'),('095181022615','123456','cu dan');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chuyen_di`
--

DROP TABLE IF EXISTS `chuyen_di`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chuyen_di` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_cd` int NOT NULL,
  `old_id_hk` int NOT NULL,
  `ngay_chuyen` date NOT NULL,
  `chuyen_den` varchar(100) DEFAULT NULL,
  `ghi_chu` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_cd` (`id_cd`),
  KEY `old_id_hk` (`old_id_hk`),
  CONSTRAINT `chuyen_di_ibfk_1` FOREIGN KEY (`id_cd`) REFERENCES `cong_dan` (`id_cd`),
  CONSTRAINT `chuyen_di_ibfk_2` FOREIGN KEY (`old_id_hk`) REFERENCES `ho_khau` (`id_ho_khau`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuyen_di`
--

LOCK TABLES `chuyen_di` WRITE;
/*!40000 ALTER TABLE `chuyen_di` DISABLE KEYS */;
INSERT INTO `chuyen_di` VALUES (1,46,10,'2025-11-11',NULL,'Đã qua đời');
/*!40000 ALTER TABLE `chuyen_di` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cong_dan`
--

DROP TABLE IF EXISTS `cong_dan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cong_dan` (
  `id_cd` int NOT NULL AUTO_INCREMENT,
  `cccd` varchar(20) NOT NULL,
  `ho_ten` varchar(50) NOT NULL,
  `bi_danh` varchar(50) DEFAULT NULL,
  `gioi_tinh` enum('Nam','Nữ','Chưa xác định') NOT NULL DEFAULT 'Chưa xác định',
  `ngay_sinh` date NOT NULL,
  `noi_sinh` varchar(50) NOT NULL,
  `que_quan` varchar(50) NOT NULL,
  `dan_toc` varchar(50) NOT NULL,
  `nghe_nghiep` varchar(50) DEFAULT NULL,
  `noi_lam_viec` varchar(50) DEFAULT NULL,
  `noi_cap` varchar(50) DEFAULT NULL,
  `ngay_cap` date DEFAULT NULL,
  `userID` varchar(20),
  PRIMARY KEY (`id_cd`),
  UNIQUE KEY `cccd` (`cccd`),
  KEY `userID` (`userID`),
  CONSTRAINT `cong_dan_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `accounts` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cong_dan`
--

LOCK TABLES `cong_dan` WRITE;
/*!40000 ALTER TABLE `cong_dan` DISABLE KEYS */;
INSERT INTO `cong_dan` VALUES (1,'015219022550','Võ Văn Thiện','Không có','Nam','2019-09-20','Yên Bái','Yên Bái','Kinh','Công nhân','Công trường ABB cơ sở Vĩnh Tuy','Yên Bái','2025-10-31','015219022550'),(2,'020305006891','Lý Thu An','Không có','Nữ','2005-11-30','Lạng Sơn','Lạng Sơn','Kinh','Giáo viên','Trường mầm non Phường Vĩnh Tuy','Lạng Sơn','2025-10-31','020305006891'),(3,'060214030588','Lý Hoàng Thắng','Không có','Nam','2014-06-24','Bình Thuận','Bình Thuận','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bình Thuận','2025-10-31','060214030588'),(4,'074307029488','Phạm Khánh Diễm','Không có','Nữ','2007-02-12','Bình Dương','Bình Dương','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bình Dương','2025-10-31','074307029488'),(5,'070193005762','Lý An Uyên','Không có','Nữ','1993-01-10','Bình Phước','Bình Phước','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bình Phước','2025-10-31','070193005762'),(6,'015210029700','Đỗ Phúc Tài','Không có','Nam','2010-08-18','Yên Bái','Yên Bái','Kinh','Công nhân','Công trường ABB cơ sở Vĩnh Tuy','Yên Bái','2025-10-31','015210029700'),(7,'006205016356','Phạm Trang Bình','Không có','Nam','2005-09-05','Bắc Kạn','Bắc Kạn','Kinh','Giáo viên','Trường mầm non Phường Vĩnh Tuy','Bắc Kạn','2025-10-31','006205016356'),(8,'068073031124','Ngô Đức Quân','Không có','Nam','1973-09-17','Lâm Đồng','Lâm Đồng','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Lâm Đồng','2025-10-31','068073031124'),(9,'095181022615','Phạm Khánh Trang','Không có','Nữ','1981-11-05','Bạc Liêu','Bạc Liêu','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bạc Liêu','2025-10-31','095181022615'),(10,'027310021996','Nguyễn Thùy Minh','Không có','Nữ','2010-03-03','Bắc Ninh','Bắc Ninh','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bắc Ninh','2025-10-31','027310021996'),(11,'094181002195','Bùi Thu Khánh','Không có','Nữ','1981-10-07','Sóc Trăng','Sóc Trăng','Kinh','Công nhân','Công trường ABB cơ sở Vĩnh Tuy','Sóc Trăng','2025-10-31','094181002195'),(12,'042314006243','Võ Thùy Thảo','Không có','Nữ','2014-02-24','Hà Tĩnh','Hà Tĩnh','Kinh','Giáo viên','Trường mầm non Phường Vĩnh Tuy','Hà Tĩnh','2025-10-31','042314006243'),(13,'037191009161','Đặng An Hiền','Không có','Nữ','1991-01-23','Ninh Bình','Ninh Bình','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Ninh Bình','2025-10-31','037191009161'),(14,'052196028259','Võ Ánh Hạnh','Không có','Nữ','1996-02-17','Bình Định','Bình Định','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bình Định','2025-10-31','052196028259'),(15,'054085029356','Hoàng Bảo Tài','Không có','Nam','1985-09-11','Phú Yên','Phú Yên','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Phú Yên','2025-10-31','054085029356'),(16,'094214032241','Dương Minh Khoa','Không có','Nam','2014-03-21','Sóc Trăng','Sóc Trăng','Kinh','Công nhân','Công trường ABB cơ sở Vĩnh Tuy','Sóc Trăng','2025-10-31','094214032241'),(17,'023082000064','Đặng Trang Sơn','Không có','Nam','1982-05-25','Bắc Giang','Bắc Giang','Kinh','Giáo viên','Trường mầm non Phường Vĩnh Tuy','Bắc Giang','2025-10-31','023082000064'),(18,'044205003741','Phan An Khải','Không có','Nam','2005-04-13','Quảng Bình','Quảng Bình','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Quảng Bình','2025-10-31','044205003741'),(19,'079173011516','Vũ An Khánh','Không có','Nữ','1973-04-11','Hồ Chí Minh','Hồ Chí Minh','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Hồ Chí Minh','2025-10-31','079173011516'),(20,'002182005067','Võ Khánh Ngọc','Không có','Nữ','1982-01-19','Hà Giang','Hà Giang','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Hà Giang','2025-10-31','002182005067'),(21,'084302013839','Dương Diễm Vân','Không có','Nữ','2002-03-13','Trà Vinh','Trà Vinh','Kinh','Công nhân','Công trường ABB cơ sở Vĩnh Tuy','Trà Vinh','2025-10-31','084302013839'),(22,'046074017254','Lý Văn Toàn','Không có','Nam','1974-05-13','Thừa Thiên Huế','Thừa Thiên Huế','Kinh','Giáo viên','Trường mầm non Phường Vĩnh Tuy','Thừa Thiên Huế','2025-10-31','046074017254'),(23,'045306022984','Lý Diễm Lan','Không có','Nữ','2006-11-27','Quảng Trị','Quảng Trị','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Quảng Trị','2025-10-31','045306022984'),(24,'025197026243','Đặng Mỹ Ngọc','Không có','Nữ','1997-12-31','Phú Thọ','Phú Thọ','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Phú Thọ','2025-10-31','025197026243'),(25,'012097008038','Phan Khánh Minh','Không có','Nam','1997-10-09','Lai Châu','Lai Châu','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Lai Châu','2025-10-31','012097008038'),(26,'084083003461','Võ Trang Vinh','Không có','Nam','1983-06-16','Trà Vinh','Trà Vinh','Kinh','Công nhân','Công trường ABB cơ sở Vĩnh Tuy','Trà Vinh','2025-10-31','084083003461'),(27,'042179022503','Huỳnh Mỹ Hiền','Không có','Nữ','1979-01-10','Hà Tĩnh','Hà Tĩnh','Kinh','Giáo viên','Trường mầm non Phường Vĩnh Tuy','Hà Tĩnh','2025-10-31','042179022503'),(28,'038211022449','Lý Quang Trung','Không có','Nam','2011-10-28','Thanh Hóa','Thanh Hóa','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Thanh Hóa','2025-10-31','038211022449'),(29,'026225032391','Võ Khánh Minh','Không có','Nam','2025-10-29','Vĩnh Phúc','Vĩnh Phúc','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Vĩnh Phúc','2025-10-31','026225032391'),(30,'049099007779','Đặng Khánh Tài','Không có','Nam','1999-10-11','Quảng Nam','Quảng Nam','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Quảng Nam','2025-10-31','049099007779'),(31,'044223000785','Hồ Văn Tài','Không có','Nam','2023-06-04','Quảng Bình','Quảng Bình','Kinh','Công nhân','Công trường ABB cơ sở Vĩnh Tuy','Quảng Bình','2025-10-31','044223000785'),(32,'077180007735','Lý Thùy Hương','Không có','Nữ','1980-10-30','Bà Rịa - Vũng Tàu','Bà Rịa - Vũng Tàu','Kinh','Giáo viên','Trường mầm non Phường Vĩnh Tuy','Bà Rịa - Vũng Tàu','2025-10-31','077180007735'),(33,'056221003382','Lê Văn An','Không có','Nam','2021-08-15','Khánh Hòa','Khánh Hòa','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Khánh Hòa','2025-10-31','056221003382'),(34,'070080015596','Bùi Minh Dũng','Không có','Nam','1980-11-13','Bình Phước','Bình Phước','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bình Phước','2025-10-31','070080015596'),(35,'014184016247','Trần An Bình','Không có','Nữ','1984-07-16','Sơn La','Sơn La','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Sơn La','2025-10-31','014184016247'),(36,'082219022726','Phan Bảo Cường','Không có','Nam','2019-07-03','Tiền Giang','Tiền Giang','Kinh','Công nhân','Công trường ABB cơ sở Vĩnh Tuy','Tiền Giang','2025-10-31','082219022726'),(37,'025176014707','Ngô Kim Ngọc','Không có','Nữ','1976-02-07','Phú Thọ','Phú Thọ','Kinh','Giáo viên','Trường mầm non Phường Vĩnh Tuy','Phú Thọ','2025-10-31','025176014707'),(38,'025214014006','Võ Khánh Hiếu','Không có','Nam','2014-01-11','Phú Thọ','Phú Thọ','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Phú Thọ','2025-10-31','025214014006'),(39,'037092025749','Bùi Khánh Hoàng','Không có','Nam','1992-10-20','Ninh Bình','Ninh Bình','Kinh','Công nhân','Công trường ABB cơ sở Vĩnh Tuy','Ninh Bình','2025-10-31','037092025749'),(40,'017093013983','Huỳnh Quang Khoa','Không có','Nam','1993-06-08','Hòa Bình','Hòa Bình','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Hòa Bình','2025-10-31','017093013983'),(41,'023081017260','Phan Đức Sơn','Không có','Nam','1981-05-25','Bắc Giang','Bắc Giang','Kinh','Công nhân','Công trường ABB cơ sở Vĩnh Tuy','Bắc Giang','2025-10-31','023081017260'),(42,'037186000354','Đặng Ánh Giang','Không có','Nữ','1986-06-25','Ninh Bình','Ninh Bình','Kinh','Giáo viên','Trường mầm non Phường Vĩnh Tuy','Ninh Bình','2025-10-31','037186000354'),(43,'008171023365','Nguyễn Diễm Mai','Không có','Nữ','1971-12-22','Tuyên Quang','Tuyên Quang','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Tuyên Quang','2025-10-31','008171023365'),(44,'025095031388','Phan Bảo An','Không có','Nam','1995-09-29','Phú Thọ','Phú Thọ','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Phú Thọ','2025-10-31','025095031388'),(45,'092189012462','Lý Thị Hiền','Không có','Nữ','1989-03-30','Cần Thơ','Cần Thơ','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Cần Thơ','2025-10-31','092189012462'),(46,'066300028737','Phạm Thùy Lan','Không có','Nữ','2000-06-25','Đắk Lắk','Đắk Lắk','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Đắk Lắk','2025-10-31','066300028737'),(47,'091302000789','Huỳnh Khánh Linh','Không có','Nữ','2002-08-18','Kiên Giang','Kiên Giang','Kinh','Công nhân','Công trường ABB cơ sở Vĩnh Tuy','Kiên Giang','2025-10-31','091302000789'),(48,'001079023664','Đặng Đức Thành','Không có','Nam','1979-08-19','Hà Nội','Hà Nội','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Hà Nội','2025-10-31','001079023664'),(49,'093306018589','Lý An Uyên','Không có','Nữ','2006-01-12','Hậu Giang','Hậu Giang','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Hậu Giang','2025-10-31','093306018589'),(50,'023218008760','Bùi Quang Phúc','Không có','Nam','2018-05-25','Bắc Giang','Bắc Giang','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bắc Giang','2025-10-31','023218008760');
/*!40000 ALTER TABLE `cong_dan` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `cong_dan_after_update` AFTER UPDATE ON `cong_dan` FOR EACH ROW BEGIN
    INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
    
    -- Bắt đầu khối SELECT đầu tiên
    SELECT 'cong_dan', OLD.id_cd, 'ho_ten', OLD.ho_ten, NEW.ho_ten 
    WHERE NOT (OLD.ho_ten <=> NEW.ho_ten)
    
    UNION ALL

    SELECT 'cong_dan', OLD.id_cd, 'bi_danh', OLD.bi_danh, NEW.bi_danh 
    WHERE NOT (OLD.bi_danh <=> NEW.bi_danh)
    
    UNION ALL

    SELECT 'cong_dan', OLD.id_cd, 'gioi_tinh', OLD.gioi_tinh, NEW.gioi_tinh 
    WHERE NOT (OLD.gioi_tinh <=> NEW.gioi_tinh)
    
    UNION ALL
    SELECT 'cong_dan', OLD.id_cd, 'ngay_sinh', OLD.ngay_sinh, NEW.ngay_sinh 
    WHERE NOT (OLD.ngay_sinh <=> NEW.ngay_sinh)
    
    UNION ALL
    SELECT 'cong_dan', OLD.id_cd, 'noi_sinh', OLD.noi_sinh, NEW.noi_sinh 
    WHERE NOT (OLD.noi_sinh <=> NEW.noi_sinh)
    
    UNION ALL
    SELECT 'cong_dan', OLD.id_cd, 'que_quan', OLD.que_quan, NEW.que_quan 
    WHERE NOT (OLD.que_quan <=> NEW.que_quan)
    
    UNION ALL
    SELECT 'cong_dan', OLD.id_cd, 'dan_toc', OLD.dan_toc, NEW.dan_toc 
    WHERE NOT (OLD.dan_toc <=> NEW.dan_toc)
    
    UNION ALL
    SELECT 'cong_dan', OLD.id_cd, 'nghe_nghiep', OLD.nghe_nghiep, NEW.nghe_nghiep 
    WHERE NOT (OLD.nghe_nghiep <=> NEW.nghe_nghiep)
    
    UNION ALL
    SELECT 'cong_dan', OLD.id_cd, 'noi_lam_viec', OLD.noi_lam_viec, NEW.noi_lam_viec 
    WHERE NOT(OLD.noi_lam_viec <=> NEW.noi_lam_viec)
    
    UNION ALL
    SELECT 'cong_dan', OLD.id_cd, 'noi_cap', OLD.noi_cap, NEW.noi_cap 
    WHERE NOT(OLD.noi_cap <=> NEW.noi_cap)
    
    UNION ALL
    SELECT 'cong_dan', OLD.id_cd, 'ngay_cap', OLD.ngay_cap, NEW.ngay_cap 
    WHERE NOT(OLD.ngay_cap <=> NEW.ngay_cap);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `historylog`
--

DROP TABLE IF EXISTS `historylog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historylog` (
  `logID` int NOT NULL AUTO_INCREMENT,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` varchar(50) DEFAULT NULL,
  `column_name` varchar(50) DEFAULT NULL,
  `old_value` varchar(50) DEFAULT NULL,
  `new_value` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`logID`)
) ENGINE=InnoDB AUTO_INCREMENT=102 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historylog`
--

LOCK TABLES `historylog` WRITE;
/*!40000 ALTER TABLE `historylog` DISABLE KEYS */;
INSERT INTO `historylog` VALUES (1,'nhan_khau','47','quan_he_voi_chu_ho','Vợ','Chủ hộ'),(2,'cong_dan','1','nghe_nghiep',NULL,'Công nhân'),(3,'cong_dan','6','nghe_nghiep',NULL,'Công nhân'),(4,'cong_dan','11','nghe_nghiep',NULL,'Công nhân'),(5,'cong_dan','16','nghe_nghiep',NULL,'Công nhân'),(6,'cong_dan','21','nghe_nghiep',NULL,'Công nhân'),(7,'cong_dan','26','nghe_nghiep',NULL,'Công nhân'),(8,'cong_dan','31','nghe_nghiep',NULL,'Công nhân'),(9,'cong_dan','36','nghe_nghiep',NULL,'Công nhân'),(10,'cong_dan','39','nghe_nghiep',NULL,'Công nhân'),(11,'cong_dan','41','nghe_nghiep',NULL,'Công nhân'),(12,'cong_dan','47','nghe_nghiep',NULL,'Công nhân'),(13,'cong_dan','1','noi_lam_viec',NULL,'Công trường ABB cơ sở Vĩnh Tuy'),(14,'cong_dan','6','noi_lam_viec',NULL,'Công trường ABB cơ sở Vĩnh Tuy'),(15,'cong_dan','11','noi_lam_viec',NULL,'Công trường ABB cơ sở Vĩnh Tuy'),(16,'cong_dan','16','noi_lam_viec',NULL,'Công trường ABB cơ sở Vĩnh Tuy'),(17,'cong_dan','21','noi_lam_viec',NULL,'Công trường ABB cơ sở Vĩnh Tuy'),(18,'cong_dan','26','noi_lam_viec',NULL,'Công trường ABB cơ sở Vĩnh Tuy'),(19,'cong_dan','31','noi_lam_viec',NULL,'Công trường ABB cơ sở Vĩnh Tuy'),(20,'cong_dan','36','noi_lam_viec',NULL,'Công trường ABB cơ sở Vĩnh Tuy'),(21,'cong_dan','39','noi_lam_viec',NULL,'Công trường ABB cơ sở Vĩnh Tuy'),(22,'cong_dan','41','noi_lam_viec',NULL,'Công trường ABB cơ sở Vĩnh Tuy'),(23,'cong_dan','47','noi_lam_viec',NULL,'Công trường ABB cơ sở Vĩnh Tuy'),(24,'cong_dan','2','noi_lam_viec',NULL,'Trường mầm non Phường Vĩnh Tuy'),(25,'cong_dan','7','noi_lam_viec',NULL,'Trường mầm non Phường Vĩnh Tuy'),(26,'cong_dan','12','noi_lam_viec',NULL,'Trường mầm non Phường Vĩnh Tuy'),(27,'cong_dan','17','noi_lam_viec',NULL,'Trường mầm non Phường Vĩnh Tuy'),(28,'cong_dan','22','noi_lam_viec',NULL,'Trường mầm non Phường Vĩnh Tuy'),(29,'cong_dan','27','noi_lam_viec',NULL,'Trường mầm non Phường Vĩnh Tuy'),(30,'cong_dan','32','noi_lam_viec',NULL,'Trường mầm non Phường Vĩnh Tuy'),(31,'cong_dan','37','noi_lam_viec',NULL,'Trường mầm non Phường Vĩnh Tuy'),(32,'cong_dan','42','noi_lam_viec',NULL,'Trường mầm non Phường Vĩnh Tuy'),(33,'cong_dan','2','nghe_nghiep',NULL,'Giáo viên'),(34,'cong_dan','7','nghe_nghiep',NULL,'Giáo viên'),(35,'cong_dan','12','nghe_nghiep',NULL,'Giáo viên'),(36,'cong_dan','17','nghe_nghiep',NULL,'Giáo viên'),(37,'cong_dan','22','nghe_nghiep',NULL,'Giáo viên'),(38,'cong_dan','27','nghe_nghiep',NULL,'Giáo viên'),(39,'cong_dan','32','nghe_nghiep',NULL,'Giáo viên'),(40,'cong_dan','37','nghe_nghiep',NULL,'Giáo viên'),(41,'cong_dan','42','nghe_nghiep',NULL,'Giáo viên'),(42,'cong_dan','3','nghe_nghiep',NULL,'Sinh viên'),(43,'cong_dan','4','nghe_nghiep',NULL,'Sinh viên'),(44,'cong_dan','5','nghe_nghiep',NULL,'Sinh viên'),(45,'cong_dan','8','nghe_nghiep',NULL,'Sinh viên'),(46,'cong_dan','9','nghe_nghiep',NULL,'Sinh viên'),(47,'cong_dan','10','nghe_nghiep',NULL,'Sinh viên'),(48,'cong_dan','13','nghe_nghiep',NULL,'Sinh viên'),(49,'cong_dan','14','nghe_nghiep',NULL,'Sinh viên'),(50,'cong_dan','15','nghe_nghiep',NULL,'Sinh viên'),(51,'cong_dan','18','nghe_nghiep',NULL,'Sinh viên'),(52,'cong_dan','19','nghe_nghiep',NULL,'Sinh viên'),(53,'cong_dan','20','nghe_nghiep',NULL,'Sinh viên'),(54,'cong_dan','23','nghe_nghiep',NULL,'Sinh viên'),(55,'cong_dan','24','nghe_nghiep',NULL,'Sinh viên'),(56,'cong_dan','25','nghe_nghiep',NULL,'Sinh viên'),(57,'cong_dan','28','nghe_nghiep',NULL,'Sinh viên'),(58,'cong_dan','29','nghe_nghiep',NULL,'Sinh viên'),(59,'cong_dan','30','nghe_nghiep',NULL,'Sinh viên'),(60,'cong_dan','33','nghe_nghiep',NULL,'Sinh viên'),(61,'cong_dan','34','nghe_nghiep',NULL,'Sinh viên'),(62,'cong_dan','35','nghe_nghiep',NULL,'Sinh viên'),(63,'cong_dan','40','nghe_nghiep',NULL,'Sinh viên'),(64,'cong_dan','43','nghe_nghiep',NULL,'Sinh viên'),(65,'cong_dan','44','nghe_nghiep',NULL,'Sinh viên'),(66,'cong_dan','45','nghe_nghiep',NULL,'Sinh viên'),(67,'cong_dan','48','nghe_nghiep',NULL,'Sinh viên'),(68,'cong_dan','49','nghe_nghiep',NULL,'Sinh viên'),(69,'cong_dan','50','nghe_nghiep',NULL,'Sinh viên'),(70,'cong_dan','3','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(71,'cong_dan','4','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(72,'cong_dan','5','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(73,'cong_dan','8','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(74,'cong_dan','9','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(75,'cong_dan','10','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(76,'cong_dan','13','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(77,'cong_dan','14','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(78,'cong_dan','15','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(79,'cong_dan','18','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(80,'cong_dan','19','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(81,'cong_dan','20','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(82,'cong_dan','23','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(83,'cong_dan','24','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(84,'cong_dan','25','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(85,'cong_dan','28','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(86,'cong_dan','29','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(87,'cong_dan','30','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(88,'cong_dan','33','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(89,'cong_dan','34','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(90,'cong_dan','35','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(91,'cong_dan','40','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(92,'cong_dan','43','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(93,'cong_dan','44','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(94,'cong_dan','45','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(95,'cong_dan','48','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(96,'cong_dan','49','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(97,'cong_dan','50','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(98,'cong_dan','38','nghe_nghiep',NULL,'Sinh viên'),(99,'cong_dan','38','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội'),(100,'cong_dan','46','nghe_nghiep',NULL,'Sinh viên'),(101,'cong_dan','46','noi_lam_viec',NULL,'Đại học Bách Khoa Hà Nội');
/*!40000 ALTER TABLE `historylog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ho_khau`
--

DROP TABLE IF EXISTS `ho_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ho_khau` (
  `id_ho_khau` int NOT NULL AUTO_INCREMENT,
  `address` varchar(50) NOT NULL,
  `id_tt` int DEFAULT NULL,
  PRIMARY KEY (`id_ho_khau`),
  KEY `id_tt` (`id_tt`),
  CONSTRAINT `ho_khau_ibfk_1` FOREIGN KEY (`id_tt`) REFERENCES `tam_thuong_tru` (`id_tt`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ho_khau`
--

LOCK TABLES `ho_khau` WRITE;
/*!40000 ALTER TABLE `ho_khau` DISABLE KEYS */;
INSERT INTO `ho_khau` VALUES (1,'Số 18 ngách 1 Ngõ 357 Minh Khai, Phường Vĩnh Tuy',NULL),(2,'Số 10 ngách 19 Ngõ 355 Minh Khai, Phường Vĩnh Tuy',NULL),(3,'Số 9 ngách 10 Ngõ 358 Minh Khai, Phường Vĩnh Tuy',NULL),(4,'Số 6 ngách 29 Ngõ 356 Minh Khai, Phường Vĩnh Tuy',NULL),(5,'Số 10 ngách 4 Ngõ 359 Minh Khai, Phường Vĩnh Tuy',NULL),(6,'Số 7 ngách 41 Ngõ 359 Minh Khai, Phường Vĩnh Tuy',NULL),(7,'Số 6 ngách 31 Ngõ 359 Minh Khai, Phường Vĩnh Tuy',NULL),(8,'Số 19 ngách 33 Ngõ 355 Minh Khai, Phường Vĩnh Tuy',NULL),(9,'Số 10 ngách 9 Ngõ 359 Minh Khai, Phường Vĩnh Tuy',NULL),(10,'Số 12 ngách 13 Ngõ 358 Minh Khai, Phường Vĩnh Tuy',NULL),(11,'Số 12 Ngõ 355 Minh Khai, Phường Vĩnh Tuy',1);
/*!40000 ALTER TABLE `ho_khau` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `ho_khau_after_update` AFTER UPDATE ON `ho_khau` FOR EACH ROW BEGIN
    INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
    
    -- Bắt đầu khối SELECT đầu tiên
    SELECT 'ho_khau', OLD.id_ho_khau, 'address', OLD.address, NEW.address 
    WHERE NOT (OLD.address <=> NEW.address)
    
    UNION ALL

    SELECT 'ho_khau', OLD.id_ho_khau, 'id_tt', OLD.id_tt, NEW.id_tt 
    WHERE NOT (OLD.id_tt <=> NEW.id_tt);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `nhan_khau`
--

DROP TABLE IF EXISTS `nhan_khau`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nhan_khau` (
  `id_cd` int NOT NULL,
  `id_ho_khau` int NOT NULL,
  `quan_he_voi_chu_ho` enum('Chủ hộ','Vợ','Chồng','Bố ruột','Mẹ ruột','Con ruột','Ông nội','Bà nội','Ông ngoại','Bà ngoại','Bố chồng','Mẹ chồng','Bố vợ','Mẹ vợ','Bạn bè','Anh trai','Em trai','Chị gái','Em gái','Anh em họ','Anh vợ','Em vợ','Chị dâu','Anh rể','Cháu nội','Cháu ngoại','Khác') DEFAULT NULL,
  `ngay_dang_ki_thuong_tru` date NOT NULL,
  `thuong_tru_truoc_day` varchar(50) DEFAULT NULL,
  `chu_ho_identifier` varchar(50) GENERATED ALWAYS AS ((case when (`quan_he_voi_chu_ho` = _utf8mb4'Chủ hộ') then `id_ho_khau` else NULL end)) VIRTUAL,
  PRIMARY KEY (`id_cd`),
  UNIQUE KEY `uk_mot_chu_ho_tren_mot_so_hk` (`chu_ho_identifier`),
  KEY `id_ho_khau` (`id_ho_khau`),
  CONSTRAINT `nhan_khau_ibfk_1` FOREIGN KEY (`id_ho_khau`) REFERENCES `ho_khau` (`id_ho_khau`),
  CONSTRAINT `nhan_khau_ibfk_2` FOREIGN KEY (`id_cd`) REFERENCES `cong_dan` (`id_cd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_khau`
--

LOCK TABLES `nhan_khau` WRITE;
/*!40000 ALTER TABLE `nhan_khau` DISABLE KEYS */;
INSERT INTO `nhan_khau` (`id_cd`, `id_ho_khau`, `quan_he_voi_chu_ho`, `ngay_dang_ki_thuong_tru`, `thuong_tru_truoc_day`) VALUES (1,1,'Chủ hộ','2019-09-20',NULL),(2,1,'Vợ','2005-11-30',NULL),(3,1,'Con ruột','2014-06-24',NULL),(4,1,'Con ruột','2007-02-12',NULL),(5,1,'Con ruột','1993-01-10',NULL),(6,2,'Chủ hộ','2010-08-18',NULL),(7,2,'Vợ','2005-09-05',NULL),(8,2,'Con ruột','1973-09-17',NULL),(9,2,'Con ruột','1981-11-05',NULL),(10,2,'Con ruột','2010-03-03',NULL),(11,3,'Chủ hộ','1981-10-07',NULL),(12,3,'Vợ','2014-02-24',NULL),(13,3,'Con ruột','1991-01-23',NULL),(14,3,'Con ruột','1996-02-17',NULL),(15,3,'Con ruột','1985-09-11',NULL),(16,4,'Chủ hộ','2014-03-21',NULL),(17,4,'Vợ','1982-05-25',NULL),(18,4,'Con ruột','2005-04-13',NULL),(19,4,'Con ruột','1973-04-11',NULL),(20,4,'Con ruột','1982-01-19',NULL),(21,5,'Chủ hộ','2002-03-13',NULL),(22,5,'Vợ','1974-05-13',NULL),(23,5,'Con ruột','2006-11-27',NULL),(24,5,'Con ruột','1997-12-31',NULL),(25,5,'Con ruột','1997-10-09',NULL),(26,6,'Chủ hộ','1983-06-16',NULL),(27,6,'Vợ','1979-01-10',NULL),(28,6,'Con ruột','2011-10-28',NULL),(29,6,'Con ruột','2025-10-29',NULL),(30,6,'Con ruột','1999-10-11',NULL),(31,7,'Chủ hộ','2023-06-04',NULL),(32,7,'Vợ','1980-10-30',NULL),(33,7,'Con ruột','2021-08-15',NULL),(34,7,'Con ruột','1980-11-13',NULL),(35,7,'Con ruột','1984-07-16',NULL),(36,8,'Chủ hộ','2019-07-03',NULL),(37,8,'Vợ','1976-02-07',NULL),(39,11,'Chủ hộ','2025-12-01','Xã Phú Xuyên, TP.Hà Nội'),(40,8,'Con ruột','1993-06-08',NULL),(41,9,'Chủ hộ','1981-05-25',NULL),(42,9,'Vợ','1986-06-25',NULL),(43,9,'Con ruột','1971-12-22',NULL),(44,9,'Con ruột','1995-09-29',NULL),(45,9,'Con ruột','1989-03-30',NULL),(47,10,'Chủ hộ','2002-08-18',NULL),(48,10,'Con ruột','1979-08-19',NULL),(49,10,'Con ruột','2006-01-12',NULL),(50,10,'Con ruột','2018-05-25',NULL);
/*!40000 ALTER TABLE `nhan_khau` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb3_general_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'NO_AUTO_VALUE_ON_ZERO' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `nhan_khau_after_update` AFTER UPDATE ON `nhan_khau` FOR EACH ROW BEGIN
    INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
    
    -- Bắt đầu khối SELECT đầu tiên
    SELECT 'nhan_khau', OLD.id_cd, 'quan_he_voi_chu_ho', OLD.quan_he_voi_chu_ho, NEW.quan_he_voi_chu_ho 
    WHERE NOT(OLD.quan_he_voi_chu_ho <=> NEW.quan_he_voi_chu_ho)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.id_cd, 'ngay_dang_ki_thuong_tru', OLD.ngay_dang_ki_thuong_tru, NEW.ngay_dang_ki_thuong_tru 
    WHERE NOT(OLD.ngay_dang_ki_thuong_tru <=> NEW.ngay_dang_ki_thuong_tru)
    
    UNION ALL
    SELECT 'nhan_khau', OLD.id_cd, 'thuong_tru_truoc_day', OLD.thuong_tru_truoc_day, NEW.thuong_tru_truoc_day 
    WHERE NOT(OLD.thuong_tru_truoc_day <=> NEW.thuong_tru_truoc_day); -- CHỈ THIẾU DẤU CHẤM PHẨY Ở ĐÂY
    
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `phan_anh`
--

DROP TABLE IF EXISTS `phan_anh`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `phan_anh` (
  `id_pa` int NOT NULL AUTO_INCREMENT,
  `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `loai_phan_anh` varchar(50) NOT NULL,
  `noi_dung` varchar(1000) DEFAULT NULL,
  `trang_thai` enum('Đang xử lý','Đã xử lý') DEFAULT 'Đang xử lý',
  `phan_hoi` varchar(1000) DEFAULT NULL,
  `id_cd` int NOT NULL,
  PRIMARY KEY (`id_pa`),
  KEY `id_cd` (`id_cd`),
  CONSTRAINT `phan_anh_ibfk_1` FOREIGN KEY (`id_cd`) REFERENCES `nhan_khau` (`id_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phan_anh`
--

LOCK TABLES `phan_anh` WRITE;
/*!40000 ALTER TABLE `phan_anh` DISABLE KEYS */;
INSERT INTO `phan_anh` VALUES (1,'2025-12-01 01:54:31','Vệ sinh môi trường','Khu vực trước cổng nhà văn hóa thường xuyên xuất hiện tình trạng đổ rác bừa bãi, gây mùi hôi và mất mỹ quan đô thị.','Đã xử lý','Tôi tổ trưởng và một số lực lượng chức năng đã ghi nhận vụ việc, tổ chức cấm biển cấm đổ rác, đồng thời tuyên truyền với các hộ dân lân cận',1),(2,'2025-12-01 01:56:16','Vệ sinh môi trường','Một số hộ dân tại ngõ 355 xả rác không đúng giờ quy định, làm ảnh hưởng vệ sinh chung.','Đang xử lý',NULL,2),(3,'2025-12-01 01:56:57','Vệ sinh môi trường','Nhiều người vứt rác xuống lòng đường/ven hồ/ven sông tại … gây ô nhiễm môi trường nghiêm trọng.','Đang xử lý',NULL,10),(4,'2025-12-01 02:03:21','An ninh trật tự','Anh A và anh B là hàng xóm. Do mâu thuẫn thường xuyên chửi bới nhau, gây ồn ào cho hàng xóm','Đang xử lý',NULL,50),(5,'2025-12-01 02:06:18','An ninh trật tự','Nhà chị B hàng xóm của tôi thường xuyên hát karaoke lúc nửa khuya, ảnh hưởng giấc ngủ của làng xóm','Đang xử lý',NULL,50);
/*!40000 ALTER TABLE `phan_anh` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tam_thuong_tru`
--

DROP TABLE IF EXISTS `tam_thuong_tru`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tam_thuong_tru` (
  `id_tt` int NOT NULL AUTO_INCREMENT,
  `date_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `begin` date NOT NULL,
  `end` date NOT NULL,
  `state` enum('Chưa duyệt','Đã duyệt','Bị từ chối','Hết hạn') NOT NULL DEFAULT 'Chưa duyệt',
  `_type` enum('Thường trú','Tạm trú') DEFAULT 'Tạm trú',
  `id_cd` int NOT NULL,
  PRIMARY KEY (`id_tt`),
  KEY `id_cd` (`id_cd`),
  CONSTRAINT `tam_thuong_tru_ibfk_1` FOREIGN KEY (`id_cd`) REFERENCES `cong_dan` (`id_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tam_thuong_tru`
--

LOCK TABLES `tam_thuong_tru` WRITE;
/*!40000 ALTER TABLE `tam_thuong_tru` DISABLE KEYS */;
INSERT INTO `tam_thuong_tru` VALUES (1,'2025-12-01 02:24:29','2025-12-01','2027-12-01','Đã duyệt','Tạm trú',39),(2,'2025-12-01 02:32:06','2025-12-01','2027-12-01','Chưa duyệt','Tạm trú',38);
/*!40000 ALTER TABLE `tam_thuong_tru` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tam_vang`
--

DROP TABLE IF EXISTS `tam_vang`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tam_vang` (
  `id_tv` int NOT NULL AUTO_INCREMENT,
  `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `li_do` varchar(50) DEFAULT NULL,
  `thoi_gian_tam_vang_begin` date DEFAULT NULL,
  `thoi_gian_tam_vang_end` date DEFAULT NULL,
  `id_cd` int NOT NULL,
  PRIMARY KEY (`id_tv`),
  KEY `id_cd` (`id_cd`),
  CONSTRAINT `tam_vang_ibfk_1` FOREIGN KEY (`id_cd`) REFERENCES `nhan_khau` (`id_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tam_vang`
--

LOCK TABLES `tam_vang` WRITE;
/*!40000 ALTER TABLE `tam_vang` DISABLE KEYS */;
INSERT INTO `tam_vang` VALUES (1,'2025-12-01 02:16:33','Công tác','2025-12-01','2025-12-30',5),(2,'2025-12-01 02:16:53','Du học','2025-12-01','2025-12-30',10),(3,'2025-12-01 02:17:12','Du học','2025-12-01','2026-12-30',11);
/*!40000 ALTER TABLE `tam_vang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'todanpho'
--

--
-- Dumping routines for database 'todanpho'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-01  9:54:26
