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
INSERT INTO `accounts` VALUES ('001079023664','123456','cu dan'),('001205030702','123456','cu dan'),('002182005067','123456','cu dan'),('006205016356','123456','cu dan'),('008171023365','123456','cu dan'),('012097008038','123456','cu dan'),('012345678912','123456','quan ly'),('014184016247','123456','cu dan'),('015210029700','123456','cu dan'),('015219022550','123456','cu dan'),('017093013983','123456','cu dan'),('020305006891','123456','cu dan'),('023081017260','123456','cu dan'),('023082000064','123456','cu dan'),('023218008760','123456','cu dan'),('025095031388','123456','cu dan'),('025176014707','123456','cu dan'),('025197026243','123456','cu dan'),('025214014006','123456','cu dan'),('026225032391','123456','cu dan'),('027310021996','123456','cu dan'),('037092025749','123456','cu dan'),('037186000354','123456','cu dan'),('037191009161','123456','cu dan'),('038211022449','123456','cu dan'),('042179022503','123456','cu dan'),('042314006243','123456','cu dan'),('044205003741','123456','cu dan'),('044223000785','123456','cu dan'),('045306022984','123456','cu dan'),('046074017254','123456','cu dan'),('049099007779','123456','cu dan'),('052196028259','123456','cu dan'),('054085029356','123456','cu dan'),('056221003382','123456','cu dan'),('060214030588','123456','cu dan'),('066300028737','123456','cu dan'),('068073031124','123456','cu dan'),('070080015596','123456','cu dan'),('070193005762','123456','cu dan'),('074307029488','123456','cu dan'),('077180007735','123456','cu dan'),('079173011516','123456','cu dan'),('082219022726','123456','cu dan'),('084083003461','123456','cu dan'),('084302013839','123456','cu dan'),('091302000789','123456','cu dan'),('092189012462','123456','cu dan'),('093306018589','123456','cu dan'),('094181002195','123456','cu dan'),('094214032241','123456','cu dan'),('095181022615','123456','cu dan');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `can_bo`
--

DROP TABLE IF EXISTS `can_bo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `can_bo` (
  `id_cb` int NOT NULL AUTO_INCREMENT,
  `cccd` varchar(20) NOT NULL,
  `chuc_vu` varchar(20) NOT NULL,
  `sdt` varchar(12) NOT NULL,
  `email` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_cb`),
  KEY `cccd` (`cccd`),
  CONSTRAINT `can_bo_ibfk_1` FOREIGN KEY (`cccd`) REFERENCES `nhan_khau` (`cccd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `can_bo`
--

LOCK TABLES `can_bo` WRITE;
/*!40000 ALTER TABLE `can_bo` DISABLE KEYS */;
/*!40000 ALTER TABLE `can_bo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `debug_log`
--

DROP TABLE IF EXISTS `debug_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `debug_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `message` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `debug_log`
--

LOCK TABLES `debug_log` WRITE;
/*!40000 ALTER TABLE `debug_log` DISABLE KEYS */;
INSERT INTO `debug_log` VALUES (11,NULL,'2025-11-07 07:49:28'),(12,'-> Khong vao nhanh IF','2025-11-07 07:49:28'),(13,NULL,'2025-11-07 07:54:18'),(14,'-> Khong vao nhanh IF','2025-11-07 07:54:18'),(15,NULL,'2025-11-07 07:54:59'),(16,'-> Khong vao nhanh IF','2025-11-07 07:54:59'),(17,NULL,'2025-11-07 07:58:07'),(18,'-> Khong vao nhanh IF','2025-11-07 07:58:07');
/*!40000 ALTER TABLE `debug_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `do_tuoi`
--

DROP TABLE IF EXISTS `do_tuoi`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `do_tuoi` (
  `name_age` varchar(20) NOT NULL,
  `_from` int NOT NULL,
  `_to` int NOT NULL,
  PRIMARY KEY (`name_age`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `do_tuoi`
--

LOCK TABLES `do_tuoi` WRITE;
/*!40000 ALTER TABLE `do_tuoi` DISABLE KEYS */;
/*!40000 ALTER TABLE `do_tuoi` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historylog`
--

DROP TABLE IF EXISTS `historylog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historylog` (
  `logID` int NOT NULL AUTO_INCREMENT,
  `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `table_name` varchar(50) NOT NULL,
  `record_id` varchar(50) NOT NULL,
  `column_name` varchar(50) NOT NULL,
  `old_value` varchar(50) NOT NULL,
  `new_value` varchar(50) NOT NULL,
  PRIMARY KEY (`logID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historylog`
--

LOCK TABLES `historylog` WRITE;
/*!40000 ALTER TABLE `historylog` DISABLE KEYS */;
INSERT INTO `historylog` VALUES (1,'2025-11-04 08:36:45','ho_khau','2','address','14 ngach 46','62 ngo 359');
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
  UNIQUE KEY `id_tt_UNIQUE` (`id_tt`),
  CONSTRAINT `ho_khau_ibfk_1` FOREIGN KEY (`id_tt`) REFERENCES `tam_thuong_tru` (`id_tt`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ho_khau`
--

LOCK TABLES `ho_khau` WRITE;
/*!40000 ALTER TABLE `ho_khau` DISABLE KEYS */;
INSERT INTO `ho_khau` VALUES (1,'16 ngach 4',NULL),(2,'62 ngo 359',NULL),(3,'4 ngach 45',NULL),(4,'11 ngach 38',NULL),(5,'17 ngach 31',NULL),(6,'6 ngach 5',NULL),(7,'10 ngach 4',NULL),(8,'11 ngach 12',NULL),(9,'9 ngach 31',NULL),(10,'5 ngach 28',NULL);
/*!40000 ALTER TABLE `ho_khau` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
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
  `cccd` varchar(20) NOT NULL,
  `id_ho_khau` int NOT NULL,
  `ho_ten` varchar(50) NOT NULL,
  `bi_danh` varchar(50) DEFAULT NULL,
  `gioi_tinh` enum('nam','nu','chua xac dinh') NOT NULL DEFAULT 'chua xac dinh',
  `ngay_sinh` date NOT NULL,
  `noi_sinh` varchar(50) NOT NULL,
  `que_quan` varchar(50) NOT NULL,
  `dan_toc` varchar(50) NOT NULL,
  `nghe_nghiep` varchar(50) DEFAULT NULL,
  `quan_he_voi_chu_ho` enum('chu ho','vo','bo ruot','me ruot','con ruot','ong noi','ba noi','ong ngoai','ba ngoai','bo chong','me chong','bo vo','me vo','ban be','anh trai','em trai','chi gai','em gai','anh em ho','anh vo','em vo','chi dau','anh re','chau noi','chau ngoai') DEFAULT NULL,
  `noi_lam_viec` varchar(50) DEFAULT NULL,
  `noi_cap` varchar(50) NOT NULL,
  `ngay_cap` date NOT NULL,
  `ngay_dang_ki_thuong_tru` date NOT NULL,
  `thuong_tru_truoc_day` varchar(50) DEFAULT NULL,
  `userID` varchar(20) NOT NULL,
  PRIMARY KEY (`cccd`),
  KEY `userID` (`userID`),
  CONSTRAINT `nhan_khau_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `accounts` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_khau`
--

LOCK TABLES `nhan_khau` WRITE;
/*!40000 ALTER TABLE `nhan_khau` DISABLE KEYS */;
INSERT INTO `nhan_khau` VALUES ('001079023664',10,'Đặng Đức Thành',NULL,'nam','1979-08-19','Hà Nội','Hà Nội','kinh',NULL,'con ruot',NULL,'Hà Nội','2025-10-31','2025-10-31',NULL,'001079023664'),('002182005067',4,'Võ Khánh Ngọc',NULL,'nu','1982-01-19','Hà Giang','Hà Giang','kinh',NULL,'con ruot',NULL,'Hà Giang','2025-10-31','2025-10-31',NULL,'002182005067'),('006205016356',2,'Phạm Trang Bình',NULL,'nam','2005-09-05','Bắc Kạn','Bắc Kạn','kinh',NULL,'vo',NULL,'Bắc Kạn','2025-10-31','2025-10-31',NULL,'006205016356'),('008171023365',9,'Nguyễn Diễm Mai',NULL,'nu','1971-12-22','Tuyên Quang','Tuyên Quang','kinh',NULL,'con ruot',NULL,'Tuyên Quang','2025-10-31','2025-10-31',NULL,'008171023365'),('012097008038',5,'Phan Khánh Minh',NULL,'nam','1997-10-09','Lai Châu','Lai Châu','kinh',NULL,'con ruot',NULL,'Lai Châu','2025-10-31','2025-10-31',NULL,'012097008038'),('014184016247',7,'Trần An Bình',NULL,'nu','1984-07-16','Sơn La','Sơn La','kinh',NULL,'con ruot',NULL,'Sơn La','2025-10-31','2025-10-31',NULL,'014184016247'),('015210029700',2,'Đỗ Phúc Tài',NULL,'nam','2010-08-18','Yên Bái','Yên Bái','kinh',NULL,'chu ho',NULL,'Yên Bái','2025-10-31','2025-10-31',NULL,'015210029700'),('015219022550',1,'Võ Văn Thiện',NULL,'nam','2019-09-20','Yên Bái','Yên Bái','kinh',NULL,'chu ho',NULL,'Yên Bái','2025-10-31','2025-10-31',NULL,'015219022550'),('017093013983',8,'Huỳnh Quang Khoa',NULL,'nam','1993-06-08','Hòa Bình','Hòa Bình','kinh',NULL,'con ruot',NULL,'Hòa Bình','2025-10-31','2025-10-31',NULL,'017093013983'),('020305006891',1,'Lý Thu An',NULL,'nu','2005-11-30','Lạng Sơn','Lạng Sơn','kinh',NULL,'vo',NULL,'Lạng Sơn','2025-10-31','2025-10-31',NULL,'020305006891'),('023081017260',9,'Phan Đức Sơn',NULL,'nam','1981-05-25','Bắc Giang','Bắc Giang','kinh',NULL,'chu ho',NULL,'Bắc Giang','2025-10-31','2025-10-31',NULL,'023081017260'),('023082000064',4,'Đặng Trang Sơn',NULL,'nam','1982-05-25','Bắc Giang','Bắc Giang','kinh',NULL,'vo',NULL,'Bắc Giang','2025-10-31','2025-10-31',NULL,'023082000064'),('023218008760',10,'Bùi Quang Phúc',NULL,'nam','2018-05-25','Bắc Giang','Bắc Giang','kinh',NULL,'con ruot',NULL,'Bắc Giang','2025-10-31','2025-10-31',NULL,'023218008760'),('025095031388',9,'Phan Bảo An',NULL,'nam','1995-09-29','Phú Thọ','Phú Thọ','kinh',NULL,'con ruot',NULL,'Phú Thọ','2025-10-31','2025-10-31',NULL,'025095031388'),('025176014707',8,'Ngô Kim Ngọc',NULL,'nu','1976-02-07','Phú Thọ','Phú Thọ','kinh',NULL,'vo',NULL,'Phú Thọ','2025-10-31','2025-10-31',NULL,'025176014707'),('025197026243',5,'Đặng Mỹ Ngọc',NULL,'nu','1997-12-31','Phú Thọ','Phú Thọ','kinh',NULL,'con ruot',NULL,'Phú Thọ','2025-10-31','2025-10-31',NULL,'025197026243'),('025214014006',8,'Võ Khánh Hiếu',NULL,'nam','2014-01-11','Phú Thọ','Phú Thọ','kinh',NULL,'con ruot',NULL,'Phú Thọ','2025-10-31','2025-10-31',NULL,'025214014006'),('026225032391',6,'Võ Khánh Minh',NULL,'nam','2025-10-29','Vĩnh Phúc','Vĩnh Phúc','kinh',NULL,'con ruot',NULL,'Vĩnh Phúc','2025-10-31','2025-10-31',NULL,'026225032391'),('027310021996',2,'Nguyễn Thùy Minh',NULL,'nu','2010-03-03','Bắc Ninh','Bắc Ninh','kinh',NULL,'con ruot',NULL,'Bắc Ninh','2025-10-31','2025-10-31',NULL,'027310021996'),('037092025749',8,'Bùi Khánh Hoàng',NULL,'nam','1992-10-20','Ninh Bình','Ninh Bình','kinh',NULL,'con ruot',NULL,'Ninh Bình','2025-10-31','2025-10-31',NULL,'037092025749'),('037186000354',9,'Đặng Ánh Giang',NULL,'nu','1986-06-25','Ninh Bình','Ninh Bình','kinh',NULL,'vo',NULL,'Ninh Bình','2025-10-31','2025-10-31',NULL,'037186000354'),('037191009161',3,'Đặng An Hiền',NULL,'nu','1991-01-23','Ninh Bình','Ninh Bình','kinh',NULL,'con ruot',NULL,'Ninh Bình','2025-10-31','2025-10-31',NULL,'037191009161'),('038211022449',6,'Lý Quang Trung',NULL,'nam','2011-10-28','Thanh Hóa','Thanh Hóa','kinh',NULL,'con ruot',NULL,'Thanh Hóa','2025-10-31','2025-10-31',NULL,'038211022449'),('042179022503',6,'Huỳnh Mỹ Hiền',NULL,'nu','1979-01-10','Hà Tĩnh','Hà Tĩnh','kinh',NULL,'vo',NULL,'Hà Tĩnh','2025-10-31','2025-10-31',NULL,'042179022503'),('042314006243',3,'Võ Thùy Thảo',NULL,'nu','2014-02-24','Hà Tĩnh','Hà Tĩnh','kinh',NULL,'vo',NULL,'Hà Tĩnh','2025-10-31','2025-10-31',NULL,'042314006243'),('044205003741',4,'Phan An Khải',NULL,'nam','2005-04-13','Quảng Bình','Quảng Bình','kinh',NULL,'con ruot',NULL,'Quảng Bình','2025-10-31','2025-10-31',NULL,'044205003741'),('044223000785',7,'Hồ Văn Tài',NULL,'nam','2023-06-04','Quảng Bình','Quảng Bình','kinh',NULL,'chu ho',NULL,'Quảng Bình','2025-10-31','2025-10-31',NULL,'044223000785'),('045306022984',5,'Lý Diễm Lan',NULL,'nu','2006-11-27','Quảng Trị','Quảng Trị','kinh',NULL,'con ruot',NULL,'Quảng Trị','2025-10-31','2025-10-31',NULL,'045306022984'),('046074017254',5,'Lý Văn Toàn',NULL,'nam','1974-05-13','Thừa Thiên Huế','Thừa Thiên Huế','kinh',NULL,'vo',NULL,'Thừa Thiên Huế','2025-10-31','2025-10-31',NULL,'046074017254'),('049099007779',6,'Đặng Khánh Tài',NULL,'nam','1999-10-11','Quảng Nam','Quảng Nam','kinh',NULL,'con ruot',NULL,'Quảng Nam','2025-10-31','2025-10-31',NULL,'049099007779'),('052196028259',3,'Võ Ánh Hạnh',NULL,'nu','1996-02-17','Bình Định','Bình Định','kinh',NULL,'con ruot',NULL,'Bình Định','2025-10-31','2025-10-31',NULL,'052196028259'),('054085029356',3,'Hoàng Bảo Tài',NULL,'nam','1985-09-11','Phú Yên','Phú Yên','kinh',NULL,'con ruot',NULL,'Phú Yên','2025-10-31','2025-10-31',NULL,'054085029356'),('056221003382',7,'Lê Văn An',NULL,'nam','2021-08-15','Khánh Hòa','Khánh Hòa','kinh',NULL,'con ruot',NULL,'Khánh Hòa','2025-10-31','2025-10-31',NULL,'056221003382'),('060214030588',1,'Lý Hoàng Thắng',NULL,'nam','2014-06-24','Bình Thuận','Bình Thuận','kinh',NULL,'con ruot',NULL,'Bình Thuận','2025-10-31','2025-10-31',NULL,'060214030588'),('066300028737',10,'Phạm Thùy Lan',NULL,'nu','2000-06-25','Đắk Lắk','Đắk Lắk','kinh',NULL,'chu ho',NULL,'Đắk Lắk','2025-10-31','2025-10-31',NULL,'066300028737'),('068073031124',2,'Ngô Đức Quân',NULL,'nam','1973-09-17','Lâm Đồng','Lâm Đồng','kinh',NULL,'con ruot',NULL,'Lâm Đồng','2025-10-31','2025-10-31',NULL,'068073031124'),('070080015596',7,'Bùi Minh Dũng',NULL,'nam','1980-11-13','Bình Phước','Bình Phước','kinh',NULL,'con ruot',NULL,'Bình Phước','2025-10-31','2025-10-31',NULL,'070080015596'),('070193005762',1,'Lý An Uyên',NULL,'nu','1993-01-10','Bình Phước','Bình Phước','kinh',NULL,'con ruot',NULL,'Bình Phước','2025-10-31','2025-10-31',NULL,'070193005762'),('074307029488',1,'Phạm Khánh Diễm',NULL,'nu','2007-02-12','Bình Dương','Bình Dương','kinh',NULL,'con ruot',NULL,'Bình Dương','2025-10-31','2025-10-31',NULL,'074307029488'),('077180007735',7,'Lý Thùy Hương',NULL,'nu','1980-10-30','Bà Rịa - Vũng Tàu','Bà Rịa - Vũng Tàu','kinh',NULL,'vo',NULL,'Bà Rịa - Vũng Tàu','2025-10-31','2025-10-31',NULL,'077180007735'),('079173011516',4,'Vũ An Khánh',NULL,'nu','1973-04-11','Hồ Chí Minh','Hồ Chí Minh','kinh',NULL,'con ruot',NULL,'Hồ Chí Minh','2025-10-31','2025-10-31',NULL,'079173011516'),('082219022726',8,'Phan Bảo Cường',NULL,'nam','2019-07-03','Tiền Giang','Tiền Giang','kinh',NULL,'chu ho',NULL,'Tiền Giang','2025-10-31','2025-10-31',NULL,'082219022726'),('084083003461',6,'Võ Trang Vinh',NULL,'nam','1983-06-16','Trà Vinh','Trà Vinh','kinh',NULL,'chu ho',NULL,'Trà Vinh','2025-10-31','2025-10-31',NULL,'084083003461'),('084302013839',5,'Dương Diễm Vân',NULL,'nu','2002-03-13','Trà Vinh','Trà Vinh','kinh',NULL,'chu ho',NULL,'Trà Vinh','2025-10-31','2025-10-31',NULL,'084302013839'),('091302000789',10,'Huỳnh Khánh Linh',NULL,'nu','2002-08-18','Kiên Giang','Kiên Giang','kinh',NULL,'vo',NULL,'Kiên Giang','2025-10-31','2025-10-31',NULL,'091302000789'),('092189012462',9,'Lý Thị Hiền',NULL,'nu','1989-03-30','Cần Thơ','Cần Thơ','kinh',NULL,'con ruot',NULL,'Cần Thơ','2025-10-31','2025-10-31',NULL,'092189012462'),('093306018589',10,'Lý An Uyên',NULL,'nu','2006-01-12','Hậu Giang','Hậu Giang','kinh',NULL,'con ruot',NULL,'Hậu Giang','2025-10-31','2025-10-31',NULL,'093306018589'),('094181002195',3,'Bùi Thu Khánh',NULL,'nu','1981-10-07','Sóc Trăng','Sóc Trăng','kinh',NULL,'chu ho',NULL,'Sóc Trăng','2025-10-31','2025-10-31',NULL,'094181002195'),('094214032241',4,'Dương Minh Khoa',NULL,'nam','2014-03-21','Sóc Trăng','Sóc Trăng','kinh',NULL,'chu ho',NULL,'Sóc Trăng','2025-10-31','2025-10-31',NULL,'094214032241'),('095181022615',2,'Phạm Khánh Trang',NULL,'nu','1981-11-05','Bạc Liêu','Bạc Liêu','kinh',NULL,'con ruot',NULL,'Bạc Liêu','2025-10-31','2025-10-31',NULL,'095181022615');
/*!40000 ALTER TABLE `nhan_khau` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `nhan_khau_after_update` AFTER UPDATE ON `nhan_khau` FOR EACH ROW BEGIN
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
  `loai_phan_anh` enum('thoat nuoc','trat tu','an ninh','pccc','nha van hoa','co so vat chat','khac') NOT NULL,
  `noi_dung` varchar(1000) DEFAULT NULL,
  `trang_thai` enum('chua xem','da xem','dang cho xu ly','dang xu ly','da xu ly') DEFAULT 'chua xem',
  `cccd` varchar(20) NOT NULL,
  `id_cb` int NOT NULL,
  PRIMARY KEY (`id_pa`),
  KEY `cccd` (`cccd`),
  KEY `id_cb` (`id_cb`),
  CONSTRAINT `phan_anh_ibfk_1` FOREIGN KEY (`cccd`) REFERENCES `nhan_khau` (`cccd`),
  CONSTRAINT `phan_anh_ibfk_2` FOREIGN KEY (`id_cb`) REFERENCES `can_bo` (`id_cb`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phan_anh`
--

LOCK TABLES `phan_anh` WRITE;
/*!40000 ALTER TABLE `phan_anh` DISABLE KEYS */;
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
  `state` enum('chua duyet','da duyet','bi tu choi') NOT NULL DEFAULT 'chua duyet',
  `_type` enum('tam tru','thuong tru') DEFAULT NULL,
  `userID` varchar(20) NOT NULL,
  PRIMARY KEY (`id_tt`),
  KEY `userID` (`userID`),
  CONSTRAINT `tam_thuong_tru_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `accounts` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tam_thuong_tru`
--

LOCK TABLES `tam_thuong_tru` WRITE;
/*!40000 ALTER TABLE `tam_thuong_tru` DISABLE KEYS */;
INSERT INTO `tam_thuong_tru` VALUES (4,'2025-11-04 07:56:59','2025-11-04','2027-11-04','chua duyet','tam tru','001079023664'),(5,'2025-11-04 07:56:59','2025-11-06','2027-11-07','chua duyet','tam tru','001079023664'),(8,'2025-11-07 07:08:39','2025-11-07','2027-11-07','da duyet','tam tru','001205030702');
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
  `noi_tam_tru` varchar(50) DEFAULT NULL,
  `noi_o_hien_tai` varchar(50) DEFAULT NULL,
  `cccd` varchar(20) NOT NULL,
  PRIMARY KEY (`id_tv`),
  KEY `cccd` (`cccd`),
  CONSTRAINT `tam_vang_ibfk_1` FOREIGN KEY (`cccd`) REFERENCES `nhan_khau` (`cccd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tam_vang`
--

LOCK TABLES `tam_vang` WRITE;
/*!40000 ALTER TABLE `tam_vang` DISABLE KEYS */;
/*!40000 ALTER TABLE `tam_vang` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'todanpho'
--

--
-- Dumping routines for database 'todanpho'
--
/*!50003 DROP PROCEDURE IF EXISTS `delete_account` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `delete_account`(IN id int)
BEGIN
	DECLARE uID varchar(50) default null;
	DELETE FROM nhan_khau WHERE id_ho_khau = (SELECT id_ho_khau FROM ho_khau WHERE id_tt = id);  
	DELETE FROM ho_khau WHERE id_tt = id;
	SELECT userID INTO uID FROM tam_thuong_tru WHERE id_tt = id;
    DELETE FROM tam_thuong_tru WHERE id_tt = id;
    DELETE FROM accounts WHERE userID = uID;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-14 18:33:22
