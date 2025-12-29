CREATE DATABASE  IF NOT EXISTS `todanpho` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `todanpho`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: todanpho
-- ------------------------------------------------------
-- Server version	8.0.44

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
INSERT INTO `accounts` VALUES ('001079023664','123456','cu dan'),('002182005067','123456','cu dan'),('006205016356','123456','cu dan'),('008171023365','123456','cu dan'),('012097008038','123456','cu dan'),('012345678912','123456','quan ly'),('014184016247','123456','cu dan'),('015210029700','123456','cu dan'),('015219022550','123456','cu dan'),('017093013983','123456','cu dan'),('023081017260','123456','cu dan'),('023082000064','123456','cu dan'),('023218008760','123456','cu dan'),('025095031388','123456','cu dan'),('025176014707','123456','cu dan'),('025197026243','123456','cu dan'),('025214014006','123456','cu dan'),('026225032391','123456','cu dan'),('027310021996','123456','cu dan'),('037092025749','123456','cu dan'),('037186000354','123456','cu dan'),('037191009161','123456','cu dan'),('038211022449','123456','cu dan'),('042179022503','123456','cu dan'),('042314006243','123456','cu dan'),('044205003741','123456','cu dan'),('044223000785','123456','cu dan'),('045306022984','123456','cu dan'),('046074017254','123456','cu dan'),('049099007779','123456','cu dan'),('052196028259','123456','cu dan'),('056221003382','123456','cu dan'),('060214030588','123456','cu dan'),('066300028737','123456','cu dan'),('068073031124','123456','cu dan'),('070080015596','123456','cu dan'),('070193005762','123456','cu dan'),('074307029488','123456','cu dan'),('077180007735','123456','cu dan'),('079173011516','123456','cu dan'),('082219022726','123456','cu dan'),('084083003461','123456','cu dan'),('084302013839','123456','cu dan'),('091302000789','123456','cu dan'),('092189012462','123456','cu dan'),('093306018589','123456','cu dan'),('094181002195','123456','cu dan'),('094214032241','123456','cu dan'),('095181022615','123456','cu dan'),('111111111111','123456','cu dan'),('111111111112','123456','cu dan'),('222222222222','123456','cu dan'),('222222222223','123456','cu dan');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `chi_tiet_don`
--

DROP TABLE IF EXISTS `chi_tiet_don`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chi_tiet_don` (
  `id_ct` int NOT NULL AUTO_INCREMENT,
  `id_dk` int NOT NULL,
  `id_cd` int NOT NULL,
  `quan_he_voi_chu_ho` varchar(50) DEFAULT NULL,
  `thuong_tru_truoc_day` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id_ct`),
  KEY `id_dk` (`id_dk`),
  KEY `id_cd` (`id_cd`),
  CONSTRAINT `chi_tiet_don_ibfk_1` FOREIGN KEY (`id_dk`) REFERENCES `don_dang_ky` (`id_dk`),
  CONSTRAINT `chi_tiet_don_ibfk_2` FOREIGN KEY (`id_cd`) REFERENCES `cong_dan` (`id_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chi_tiet_don`
--

LOCK TABLES `chi_tiet_don` WRITE;
/*!40000 ALTER TABLE `chi_tiet_don` DISABLE KEYS */;
INSERT INTO `chi_tiet_don` VALUES (1,1,51,'Chủ hộ',NULL),(2,1,52,'Vợ',NULL),(4,2,54,'Chủ hộ','Đại Xuyên, Hà Nội'),(5,2,55,'Vợ','Đại Xuyên, Hà Nội');
/*!40000 ALTER TABLE `chi_tiet_don` ENABLE KEYS */;
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
  `old_id_hk` int DEFAULT NULL,
  `ngay_chuyen` date NOT NULL,
  `chuyen_den` varchar(100) DEFAULT NULL,
  `ghi_chu` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_cd` (`id_cd`),
  KEY `old_id_hk` (`old_id_hk`),
  CONSTRAINT `chuyen_di_ibfk_1` FOREIGN KEY (`id_cd`) REFERENCES `cong_dan` (`id_cd`),
  CONSTRAINT `chuyen_di_ibfk_2` FOREIGN KEY (`old_id_hk`) REFERENCES `ho_khau` (`id_ho_khau`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chuyen_di`
--

LOCK TABLES `chuyen_di` WRITE;
/*!40000 ALTER TABLE `chuyen_di` DISABLE KEYS */;
INSERT INTO `chuyen_di` VALUES (1,28,6,'2025-12-06','TP. Hồ Chí Minh','định cư nơi khác'),(2,2,1,'2025-12-28','Không rõ','Đã mất'),(3,15,3,'2025-12-29','Không rõ','Đã mất');
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
  `cccd` varchar(20) DEFAULT NULL,
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
  `userID` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id_cd`),
  UNIQUE KEY `cccd` (`cccd`),
  KEY `userID` (`userID`),
  CONSTRAINT `cong_dan_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `accounts` (`userID`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cong_dan`
--

LOCK TABLES `cong_dan` WRITE;
/*!40000 ALTER TABLE `cong_dan` DISABLE KEYS */;
INSERT INTO `cong_dan` VALUES (1,'015219022550','Võ Văn Thiện','Không có','Nam','2019-09-20','Yên Bái','Yên Bái','Kinh','Công nhân','Nhà máy sản xuất cơ khí Vĩnh Tuy','Yên Bái','2025-10-31','015219022550'),(2,'020305006891','Lý Thu An','Không có','Nữ','2005-11-30','Lạng Sơn','Lạng Sơn','Kinh','Thợ may','Nhà máy dệt chân cầu Vĩnh Tuy','Lạng Sơn','2025-10-31',NULL),(3,'060214030588','Lý Hoàng Thắng','Không có','Nam','2014-06-24','Bình Thuận','Bình Thuận','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bình Thuận','2025-10-31','060214030588'),(4,'074307029488','Phạm Khánh Diễm','Không có','Nữ','2007-02-12','Bình Dương','Bình Dương','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bình Dương','2025-10-31','074307029488'),(5,'070193005762','Lý An Uyên','Không có','Nữ','1993-01-10','Bình Phước','Bình Phước','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bình Phước','2025-10-31','070193005762'),(6,'015210029700','Đỗ Phúc Tài','Không có','Nam','2010-08-18','Yên Bái','Yên Bái','Kinh','Công nhân','Nhà máy sản xuất cơ khí Vĩnh Tuy','Yên Bái','2025-10-31','015210029700'),(7,'006205016356','Phạm Trang Bình','Không có','Nam','2005-09-05','Bắc Kạn','Bắc Kạn','Kinh','Thợ may','Nhà máy dệt chân cầu Vĩnh Tuy','Bắc Kạn','2025-10-31','006205016356'),(8,'068073031124','Ngô Đức Quân','Không có','Nam','1973-09-17','Lâm Đồng','Lâm Đồng','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Lâm Đồng','2025-10-31','068073031124'),(9,'095181022615','Phạm Khánh Trang','Không có','Nữ','1981-11-05','Bạc Liêu','Bạc Liêu','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bạc Liêu','2025-10-31','095181022615'),(10,'027310021996','Nguyễn Thùy Minh','Không có','Nữ','2010-03-03','Bắc Ninh','Bắc Ninh','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bắc Ninh','2025-10-31','027310021996'),(11,'094181002195','Bùi Thu Khánh','Không có','Nữ','1981-10-07','Sóc Trăng','Sóc Trăng','Kinh','Công nhân','Nhà máy sản xuất cơ khí Vĩnh Tuy','Sóc Trăng','2025-10-31','094181002195'),(12,'042314006243','Võ Thùy Thảo','Không có','Nữ','2014-02-24','Hà Tĩnh','Hà Tĩnh','Kinh','Thợ may','Nhà máy dệt chân cầu Vĩnh Tuy','Hà Tĩnh','2025-10-31','042314006243'),(13,'037191009161','Đặng An Hiền','Không có','Nữ','1991-01-23','Ninh Bình','Ninh Bình','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Ninh Bình','2025-10-31','037191009161'),(14,'052196028259','Võ Ánh Hạnh','Không có','Nữ','1996-02-17','Bình Định','Bình Định','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bình Định','2025-10-31','052196028259'),(15,'054085029356','Hoàng Bảo Tài','Không có','Nam','1985-09-11','Phú Yên','Phú Yên','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Phú Yên','2025-10-31',NULL),(16,'094214032241','Dương Minh Khoa','Không có','Nam','2014-03-21','Sóc Trăng','Sóc Trăng','Kinh','Công nhân','Nhà máy sản xuất cơ khí Vĩnh Tuy','Sóc Trăng','2025-10-31','094214032241'),(17,'023082000064','Đặng Trang Sơn','Không có','Nam','1982-05-25','Bắc Giang','Bắc Giang','Kinh','Thợ may','Nhà máy dệt chân cầu Vĩnh Tuy','Bắc Giang','2025-10-31','023082000064'),(18,'044205003741','Phan An Khải','Không có','Nam','2005-04-13','Quảng Bình','Quảng Bình','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Quảng Bình','2025-10-31','044205003741'),(19,'079173011516','Vũ An Khánh','Không có','Nữ','1973-04-11','Hồ Chí Minh','Hồ Chí Minh','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Hồ Chí Minh','2025-10-31','079173011516'),(20,'002182005067','Võ Khánh Ngọc','Không có','Nữ','1982-01-19','Hà Giang','Hà Giang','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Hà Giang','2025-10-31','002182005067'),(21,'084302013839','Dương Diễm Vân','Không có','Nữ','2002-03-13','Trà Vinh','Trà Vinh','Kinh','Công nhân','Nhà máy sản xuất cơ khí Vĩnh Tuy','Trà Vinh','2025-10-31','084302013839'),(22,'046074017254','Lý Văn Toàn','Không có','Nam','1974-05-13','Thừa Thiên Huế','Thừa Thiên Huế','Kinh','Thợ may','Nhà máy dệt chân cầu Vĩnh Tuy','Thừa Thiên Huế','2025-10-31','046074017254'),(23,'045306022984','Lý Diễm Lan','Không có','Nữ','2006-11-27','Quảng Trị','Quảng Trị','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Quảng Trị','2025-10-31','045306022984'),(24,'025197026243','Đặng Mỹ Ngọc','Không có','Nữ','1997-12-31','Phú Thọ','Phú Thọ','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Phú Thọ','2025-10-31','025197026243'),(25,'012097008038','Phan Khánh Minh','Không có','Nam','1997-10-09','Lai Châu','Lai Châu','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Lai Châu','2025-10-31','012097008038'),(26,'084083003461','Võ Trang Vinh','Không có','Nam','1983-06-16','Trà Vinh','Trà Vinh','Kinh','Công nhân','Nhà máy sản xuất cơ khí Vĩnh Tuy','Trà Vinh','2025-10-31','084083003461'),(27,'042179022503','Huỳnh Mỹ Hiền','Không có','Nữ','1979-01-10','Hà Tĩnh','Hà Tĩnh','Kinh','Thợ may','Nhà máy dệt chân cầu Vĩnh Tuy','Hà Tĩnh','2025-10-31','042179022503'),(28,'038211022449','Lý Quang Trung','Không có','Nam','2011-10-28','Thanh Hóa','Thanh Hóa','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Thanh Hóa','2025-10-31','038211022449'),(29,'026225032391','Võ Khánh Minh','Không có','Nam','2025-10-29','Vĩnh Phúc','Vĩnh Phúc','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Vĩnh Phúc','2025-10-31','026225032391'),(30,'049099007779','Đặng Khánh Tài','Không có','Nam','1999-10-11','Quảng Nam','Quảng Nam','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Quảng Nam','2025-10-31','049099007779'),(31,'044223000785','Hồ Văn Tài','Không có','Nam','2023-06-04','Quảng Bình','Quảng Bình','Kinh','Công nhân','Nhà máy sản xuất cơ khí Vĩnh Tuy','Quảng Bình','2025-10-31','044223000785'),(32,'077180007735','Lý Thùy Hương','Không có','Nữ','1980-10-30','Bà Rịa - Vũng Tàu','Bà Rịa - Vũng Tàu','Kinh','Thợ may','Nhà máy dệt chân cầu Vĩnh Tuy','Bà Rịa - Vũng Tàu','2025-10-31','077180007735'),(33,'056221003382','Lê Văn An','Không có','Nam','2021-08-15','Khánh Hòa','Khánh Hòa','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Khánh Hòa','2025-10-31','056221003382'),(34,'070080015596','Bùi Minh Dũng','Không có','Nam','1980-11-13','Bình Phước','Bình Phước','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bình Phước','2025-10-31','070080015596'),(35,'014184016247','Trần An Bình','Không có','Nữ','1984-07-16','Sơn La','Sơn La','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Sơn La','2025-10-31','014184016247'),(36,'082219022726','Phan Bảo Cường','Không có','Nam','2019-07-03','Tiền Giang','Tiền Giang','Kinh','Công nhân','Nhà máy sản xuất cơ khí Vĩnh Tuy','Tiền Giang','2025-10-31','082219022726'),(37,'025176014707','Ngô Kim Ngọc','Không có','Nữ','1976-02-07','Phú Thọ','Phú Thọ','Kinh','Thợ may','Nhà máy dệt chân cầu Vĩnh Tuy','Phú Thọ','2025-10-31','025176014707'),(38,'025214014006','Võ Khánh Hiếu','Không có','Nam','2014-01-11','Phú Thọ','Phú Thọ','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Phú Thọ','2025-10-31','025214014006'),(39,'037092025749','Bùi Khánh Hoàng','Không có','Nam','1992-10-20','Ninh Bình','Ninh Bình','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Ninh Bình','2025-10-31','037092025749'),(40,'017093013983','Huỳnh Quang Khoa','Không có','Nam','1993-06-08','Hòa Bình','Hòa Bình','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Hòa Bình','2025-10-31','017093013983'),(41,'023081017260','Phan Đức Sơn','Không có','Nam','1981-05-25','Bắc Giang','Bắc Giang','Kinh','Công nhân','Nhà máy sản xuất cơ khí Vĩnh Tuy','Bắc Giang','2025-10-31','023081017260'),(42,'037186000354','Đặng Ánh Giang','Không có','Nữ','1986-06-25','Ninh Bình','Ninh Bình','Kinh','Thợ may','Nhà máy dệt chân cầu Vĩnh Tuy','Ninh Bình','2025-10-31','037186000354'),(43,'008171023365','Nguyễn Diễm Mai','Không có','Nữ','1971-12-22','Tuyên Quang','Tuyên Quang','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Tuyên Quang','2025-10-31','008171023365'),(44,'025095031388','Phan Bảo An','Không có','Nam','1995-09-29','Phú Thọ','Phú Thọ','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Phú Thọ','2025-10-31','025095031388'),(45,'092189012462','Lý Thị Hiền','Không có','Nữ','1989-03-30','Cần Thơ','Cần Thơ','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Cần Thơ','2025-10-31','092189012462'),(46,'066300028737','Phạm Thùy Lan','Không có','Nữ','2000-06-25','Đắk Lắk','Đắk Lắk','Kinh','Công nhân','Nhà máy sản xuất cơ khí Vĩnh Tuy','Đắk Lắk','2025-10-31','066300028737'),(47,'091302000789','Huỳnh Khánh Linh','Không có','Nữ','2002-08-18','Kiên Giang','Kiên Giang','Kinh','Thợ may','Nhà máy dệt chân cầu Vĩnh Tuy','Kiên Giang','2025-10-31','091302000789'),(48,'001079023664','Đặng Đức Thành','Không có','Nam','1979-08-19','Hà Nội','Hà Nội','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Hà Nội','2025-10-31','001079023664'),(49,'093306018589','Lý An Uyên','Không có','Nữ','2006-01-12','Hậu Giang','Hậu Giang','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Hậu Giang','2025-10-31','093306018589'),(50,'023218008760','Bùi Quang Phúc','Không có','Nam','2018-05-25','Bắc Giang','Bắc Giang','Kinh','Sinh viên','Đại học Bách Khoa Hà Nội','Bắc Giang','2025-10-31','023218008760'),(51,'111111111111','Nguyễn Bình An','Không có','Nam','1956-05-04','Hà Tây','Hà Tây','Kinh','Sĩ quan','Sư đoàn 325','Hà Nội','2020-04-12','111111111111'),(52,'222222222222','Vũ Thị Thanh Mai','Không có','Nữ','1965-02-13','Hà Tây','Hà Tây','Kinh','Giáo viên','Tiểu học Tri Thủy','Hà Nội','2020-04-12','222222222222'),(53,'012345678912','Võ Tinh Anh','Trí','Nam','1999-12-11','Hà Nội','Hà Nội','Kinh','Cán bộ','UBND Xã Vĩnh Tuy','Hà Nội','2025-12-16','012345678912'),(54,'111111111112','Nguyễn Bình An','Không có','Nam','1956-05-04','Hà Tây','Hà Tây','Kinh','Sĩ quan','Sư đoàn 325','Hà Nội','2020-04-12','111111111111'),(55,'222222222223','Vũ Thị Thanh Mai','Không có','Nữ','1965-02-13','Hà Tây','Hà Tây','Kinh','Giáo viên','Tiểu học Tri Thủy','Hà Nội','2020-04-12','222222222222');
/*!40000 ALTER TABLE `cong_dan` ENABLE KEYS */;
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
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `cong_dan_after_update` AFTER UPDATE ON `cong_dan` FOR EACH ROW BEGIN
    -- 1. Kiểm tra Họ tên
    IF NOT (OLD.ho_ten <=> NEW.ho_ten) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('cong_dan', OLD.id_cd, 'ho_ten', OLD.ho_ten, NEW.ho_ten);
    END IF;

    -- 2. Kiểm tra Bí danh
    IF NOT (OLD.bi_danh <=> NEW.bi_danh) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('cong_dan', OLD.id_cd, 'bi_danh', OLD.bi_danh, NEW.bi_danh);
    END IF;

    -- 3. Kiểm tra Giới tính
    IF NOT (OLD.gioi_tinh <=> NEW.gioi_tinh) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('cong_dan', OLD.id_cd, 'gioi_tinh', OLD.gioi_tinh, NEW.gioi_tinh);
    END IF;

    -- 4. Kiểm tra Ngày sinh
    IF NOT (OLD.ngay_sinh <=> NEW.ngay_sinh) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('cong_dan', OLD.id_cd, 'ngay_sinh', OLD.ngay_sinh, NEW.ngay_sinh);
    END IF;

    -- 5. Kiểm tra Nơi sinh
    IF NOT (OLD.noi_sinh <=> NEW.noi_sinh) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('cong_dan', OLD.id_cd, 'noi_sinh', OLD.noi_sinh, NEW.noi_sinh);
    END IF;

    -- 6. Kiểm tra Quê quán
    IF NOT (OLD.que_quan <=> NEW.que_quan) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('cong_dan', OLD.id_cd, 'que_quan', OLD.que_quan, NEW.que_quan);
    END IF;

    -- 7. Kiểm tra Dân tộc
    IF NOT (OLD.dan_toc <=> NEW.dan_toc) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('cong_dan', OLD.id_cd, 'dan_toc', OLD.dan_toc, NEW.dan_toc);
    END IF;

    -- 8. Kiểm tra Nghề nghiệp
    IF NOT (OLD.nghe_nghiep <=> NEW.nghe_nghiep) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('cong_dan', OLD.id_cd, 'nghe_nghiep', OLD.nghe_nghiep, NEW.nghe_nghiep);
    END IF;

    -- 9. Kiểm tra Nơi làm việc
    IF NOT (OLD.noi_lam_viec <=> NEW.noi_lam_viec) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('cong_dan', OLD.id_cd, 'noi_lam_viec', OLD.noi_lam_viec, NEW.noi_lam_viec);
    END IF;

    -- 10. Kiểm tra Nơi cấp
    IF NOT (OLD.noi_cap <=> NEW.noi_cap) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('cong_dan', OLD.id_cd, 'noi_cap', OLD.noi_cap, NEW.noi_cap);
    END IF;

    -- 11. Kiểm tra Ngày cấp
    IF NOT (OLD.ngay_cap <=> NEW.ngay_cap) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('cong_dan', OLD.id_cd, 'ngay_cap', OLD.ngay_cap, NEW.ngay_cap);
    END IF;

END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `don_dang_ky`
--

DROP TABLE IF EXISTS `don_dang_ky`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `don_dang_ky` (
  `id_dk` int NOT NULL AUTO_INCREMENT,
  `date_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `begin` date NOT NULL,
  `end` date DEFAULT NULL,
  `_type` enum('Thường trú','Tạm trú','Nhập khẩu') NOT NULL DEFAULT 'Tạm trú',
  `address` varchar(100) NOT NULL,
  `state` enum('Chưa duyệt','Đã duyệt','Bị từ chối','Hết hạn') NOT NULL DEFAULT 'Chưa duyệt',
  `ngay_duyet` date DEFAULT NULL,
  `ly_do_tu_choi` varchar(500) DEFAULT NULL,
  `id_cd` int NOT NULL,
  `id_ho_khau` int DEFAULT NULL,
  PRIMARY KEY (`id_dk`),
  KEY `id_cd` (`id_cd`),
  KEY `id_ho_khau` (`id_ho_khau`),
  CONSTRAINT `don_dang_ky_ibfk_1` FOREIGN KEY (`id_cd`) REFERENCES `cong_dan` (`id_cd`),
  CONSTRAINT `don_dang_ky_ibfk_2` FOREIGN KEY (`id_ho_khau`) REFERENCES `ho_khau` (`id_ho_khau`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `don_dang_ky`
--

LOCK TABLES `don_dang_ky` WRITE;
/*!40000 ALTER TABLE `don_dang_ky` DISABLE KEYS */;
INSERT INTO `don_dang_ky` VALUES (1,'2025-12-16 13:11:41','1990-02-05',NULL,'Thường trú','Số 19 ngách 14 Ngõ 359 Minh Khai, Phường Vĩnh Tuy','Đã duyệt','2025-12-16',NULL,51,11),(2,'2025-12-16 13:16:31','2025-12-16','2026-12-05','Tạm trú','Số 21 ngách 27 Ngõ 359 Minh Khai, Phường Vĩnh Tuy','Đã duyệt','2025-12-16',NULL,54,12);
/*!40000 ALTER TABLE `don_dang_ky` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `historylog`
--

DROP TABLE IF EXISTS `historylog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `historylog` (
  `logID` int NOT NULL AUTO_INCREMENT,
  `date_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `table_name` varchar(50) DEFAULT NULL,
  `record_id` varchar(50) DEFAULT NULL,
  `column_name` varchar(50) DEFAULT NULL,
  `old_value` varchar(50) DEFAULT NULL,
  `new_value` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`logID`)
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `historylog`
--

LOCK TABLES `historylog` WRITE;
/*!40000 ALTER TABLE `historylog` DISABLE KEYS */;
INSERT INTO `historylog` VALUES (148,'2025-12-29 00:14:48','nhan_khau','9','quan_he_voi_chu_ho','Con','Chủ hộ'),(149,'2025-12-29 00:14:48','nhan_khau','9','id_ho_khau','2','15'),(150,'2025-12-29 00:14:48','nhan_khau','10','quan_he_voi_chu_ho','Con','Em'),(151,'2025-12-29 00:14:48','nhan_khau','10','id_ho_khau','2','15'),(152,'2025-12-29 00:27:11','nhan_khau','11','quan_he_voi_chu_ho','Chủ hộ','Em'),(153,'2025-12-29 00:27:11','nhan_khau','12','quan_he_voi_chu_ho','Vợ','Mẹ'),(154,'2025-12-29 00:27:11','nhan_khau','14','quan_he_voi_chu_ho','Con','Em'),(155,'2025-12-29 00:27:11','nhan_khau','15','quan_he_voi_chu_ho','Con','Em'),(156,'2025-12-29 00:27:11','nhan_khau','13','quan_he_voi_chu_ho','Con','Chủ hộ');
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
  `address` varchar(100) NOT NULL,
  `_type` enum('Thường trú','Tạm trú') NOT NULL DEFAULT 'Tạm trú',
  PRIMARY KEY (`id_ho_khau`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ho_khau`
--

LOCK TABLES `ho_khau` WRITE;
/*!40000 ALTER TABLE `ho_khau` DISABLE KEYS */;
INSERT INTO `ho_khau` VALUES (1,'Số 19 ngách 12 Ngõ 359 Minh Khai, Phường Vĩnh Tuy','Thường trú'),(2,'Số 16 ngách 10 Ngõ 356 Minh Khai, Phường Vĩnh Tuy','Thường trú'),(3,'Số 7 ngách 27 Ngõ 357 Minh Khai, Phường Vĩnh Tuy','Thường trú'),(4,'Số 80 Ngõ 358 Minh Khai, Phường Vĩnh Tuy','Thường trú'),(5,'Số 15 ngách 28 Ngõ 355 Minh Khai, Phường Vĩnh Tuy','Thường trú'),(6,'Số 16 ngách 41 Ngõ 356 Minh Khai, Phường Vĩnh Tuy','Thường trú'),(7,'Số 11 ngách 15 Ngõ 359 Minh Khai, Phường Vĩnh Tuy','Thường trú'),(8,'Số 15 ngách 7 Ngõ 355 Minh Khai, Phường Vĩnh Tuy','Thường trú'),(9,'Số 3 ngách 19 Ngõ 356 Minh Khai, Phường Vĩnh Tuy','Thường trú'),(10,'Số 5 ngách 42 Ngõ 358 Minh Khai, Phường Vĩnh Tuy','Thường trú'),(11,'Số 19 ngách 14 Ngõ 359 Minh Khai, Phường Vĩnh Tuy','Thường trú'),(12,'Số 21 ngách 27 Ngõ 359 Minh Khai, Phường Vĩnh Tuy','Tạm trú'),(13,'Số 17 ngõ 459 Minh Khai','Thường trú'),(14,'No1 DAI CO VIET','Thường trú'),(15,'Số 03 Ngõ 150 Minh Khai, Phường Vĩnh Tuy','Thường trú');
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
    -- 1. Kiểm tra Địa chỉ
    IF NOT (OLD.address <=> NEW.address) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('ho_khau', OLD.id_ho_khau, 'address', OLD.address, NEW.address);
    END IF;

    -- 2. Kiểm tra Loại hộ khẩu (_type)
    IF NOT (OLD._type <=> NEW._type) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('ho_khau', OLD.id_ho_khau, '_type', OLD._type, NEW._type);
    END IF;

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
  `id_cd` int NOT NULL AUTO_INCREMENT,
  `id_ho_khau` int NOT NULL,
  `quan_he_voi_chu_ho` varchar(50) DEFAULT NULL,
  `ngay_dang_ki_thuong_tru` date NOT NULL,
  `thuong_tru_truoc_day` varchar(50) DEFAULT NULL,
  `chu_ho_identifier` varchar(50) GENERATED ALWAYS AS ((case when (`quan_he_voi_chu_ho` = _utf8mb4'Chủ hộ') then `id_ho_khau` else NULL end)) VIRTUAL,
  PRIMARY KEY (`id_cd`),
  UNIQUE KEY `uk_mot_chu_ho_tren_mot_so_hk` (`chu_ho_identifier`),
  KEY `id_ho_khau` (`id_ho_khau`),
  CONSTRAINT `nhan_khau_ibfk_1` FOREIGN KEY (`id_ho_khau`) REFERENCES `ho_khau` (`id_ho_khau`),
  CONSTRAINT `nhan_khau_ibfk_2` FOREIGN KEY (`id_cd`) REFERENCES `cong_dan` (`id_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_khau`
--

LOCK TABLES `nhan_khau` WRITE;
/*!40000 ALTER TABLE `nhan_khau` DISABLE KEYS */;
INSERT INTO `nhan_khau` (`id_cd`, `id_ho_khau`, `quan_he_voi_chu_ho`, `ngay_dang_ki_thuong_tru`, `thuong_tru_truoc_day`) VALUES (1,1,'Chủ hộ','2019-09-20',NULL),(3,13,'Chủ hộ','2014-06-24',NULL),(4,13,'Em','2007-02-12',NULL),(5,13,'Em','1993-01-10',NULL),(6,2,'Chủ hộ','2010-08-18',NULL),(7,2,'Vợ','2005-09-05',NULL),(8,2,'Con','1973-09-17',NULL),(9,15,'Chủ hộ','1981-11-05',NULL),(10,15,'Em','2010-03-03',NULL),(11,3,'Em','1981-10-07',NULL),(12,3,'Mẹ','2014-02-24',NULL),(13,3,'Chủ hộ','1991-01-23',NULL),(14,3,'Em','1996-02-17',NULL),(16,14,'Chủ hộ','2014-03-21',NULL),(17,14,'Vợ','1982-05-25',NULL),(18,4,'Chủ hộ','2005-04-13',NULL),(19,14,'Cháu','1973-04-11',NULL),(20,14,'Cháu','1982-01-19',NULL),(21,5,'Chủ hộ','2002-03-13',NULL),(22,5,'Vợ','1974-05-13',NULL),(23,5,'Con','2006-11-27',NULL),(24,5,'Con','1997-12-31',NULL),(25,5,'Con','1997-10-09',NULL),(26,6,'Chủ hộ','1983-06-16',NULL),(27,6,'Vợ','1979-01-10',NULL),(29,6,'Con','2025-10-29',NULL),(30,6,'Con','1999-10-11',NULL),(31,7,'Chủ hộ','2023-06-04',NULL),(32,7,'Vợ','1980-10-30',NULL),(33,7,'Con','2021-08-15',NULL),(34,7,'Con','1980-11-13',NULL),(35,7,'Con','1984-07-16',NULL),(36,8,'Chủ hộ','2019-07-03',NULL),(37,8,'Vợ','1976-02-07',NULL),(38,8,'Con','2014-01-11',NULL),(39,8,'Con','1992-10-20',NULL),(40,8,'Con','1993-06-08',NULL),(41,9,'Chủ hộ','1981-05-25',NULL),(42,9,'Vợ','1986-06-25',NULL),(43,9,'Con','1971-12-22',NULL),(44,9,'Con','1995-09-29',NULL),(45,9,'Con','1989-03-30',NULL),(46,10,'Chủ hộ','2000-06-25',NULL),(47,10,'Vợ','2002-08-18',NULL),(48,10,'Con','1979-08-19',NULL),(49,10,'Con','2006-01-12',NULL),(50,10,'Con','2018-05-25',NULL),(51,11,'Chủ hộ','1990-02-05',NULL),(52,11,'Vợ','1990-02-05',NULL),(53,11,'Con','1999-12-11',NULL),(54,12,'Chủ hộ','2025-12-16','Đại Xuyên, Hà Nội'),(55,12,'Vợ','2025-12-16','Đại Xuyên, Hà Nội');
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
    -- 1. Kiểm tra Quan hệ với chủ hộ
    IF NOT (OLD.quan_he_voi_chu_ho <=> NEW.quan_he_voi_chu_ho) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('nhan_khau', OLD.id_cd, 'quan_he_voi_chu_ho', OLD.quan_he_voi_chu_ho, NEW.quan_he_voi_chu_ho);
    END IF;

    -- 2. Kiểm tra Ngày đăng ký thường trú
    IF NOT (OLD.ngay_dang_ki_thuong_tru <=> NEW.ngay_dang_ki_thuong_tru) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('nhan_khau', OLD.id_cd, 'ngay_dang_ki_thuong_tru', OLD.ngay_dang_ki_thuong_tru, NEW.ngay_dang_ki_thuong_tru);
    END IF;

    -- 3. Kiểm tra Thường trú trước đây
    IF NOT (OLD.thuong_tru_truoc_day <=> NEW.thuong_tru_truoc_day) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('nhan_khau', OLD.id_cd, 'thuong_tru_truoc_day', OLD.thuong_tru_truoc_day, NEW.thuong_tru_truoc_day);
    END IF;
    -- 4. Kiểm tra hộ khẩu
    IF NOT (OLD.id_ho_khau <=> NEW.id_ho_khau) THEN
        INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
        VALUES ('nhan_khau', OLD.id_cd, 'id_ho_khau', OLD.id_ho_khau, NEW.id_ho_khau);
    END IF;

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
  CONSTRAINT `phan_anh_ibfk_1` FOREIGN KEY (`id_cd`) REFERENCES `cong_dan` (`id_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `phan_anh`
--

LOCK TABLES `phan_anh` WRITE;
/*!40000 ALTER TABLE `phan_anh` DISABLE KEYS */;
INSERT INTO `phan_anh` VALUES (1,'2025-12-06 03:25:38','Vệ sinh môi trường','Rác thải sinh hoạt ùn ứ tại đầu ngõ 15 chưa được thu gom 2 ngày nay, bốc mùi hôi thối ảnh hưởng đến các hộ xung quanh.','Đang xử lý',NULL,5),(2,'2025-12-06 01:25:38','An ninh trật tự','Đề nghị công an phường kiểm tra nhóm thanh niên hay tụ tập gây ồn ào tại công viên khu dân cư sau 23h đêm.','Đang xử lý',NULL,12),(3,'2025-12-05 03:25:38','Cơ sở hạ tầng','Nắp cống thoát nước trước cửa nhà số 20 bị vỡ, rất nguy hiểm cho người đi đường và trẻ nhỏ.','Đã xử lý','Đã tiếp nhận thông tin, đang chuyển sang bộ phận quản lý đô thị để kiểm tra.',34),(4,'2025-12-03 03:25:38','Tiếng ồn','Hộ gia đình ông B thường xuyên hát Karaoke âm lượng lớn vào giờ nghỉ trưa (12h-13h30), đã nhắc nhở nhưng không khắc phục.','Đã xử lý','Tổ dân phố đang tiến hành xuống tận nơi để nhắc nhở và lập biên bản nếu tái phạm.',48),(5,'2025-12-01 03:25:38','Thủ tục hành chính','Tôi muốn phản ánh về thái độ phục vụ của cán bộ tại bộ phận một cửa sáng thứ 2 vừa rồi, hướng dẫn không rõ ràng.','Đã xử lý','Lãnh đạo phường đã làm việc với cán bộ liên quan để chấn chỉnh thái độ phục vụ. Xin lỗi công dân về sự bất tiện này.',7),(6,'2025-12-06 03:25:38','Trật tự xây dựng','Nhà số 88 đang sửa chữa nhưng để vật liệu cát sỏi tràn lan ra lòng đường cản trở giao thông.','Đang xử lý',NULL,22),(7,'2025-12-05 15:25:38','Phòng cháy chữa cháy','Hộp chữa cháy ở cầu thang bộ khu B bị hỏng khoá, đề nghị ban quản lý kiểm tra lại.','Đang xử lý',NULL,41),(8,'2025-12-04 03:25:38','Cây xanh','Cây phượng vĩ trước cửa nhà văn hóa có cành lớn bị sâu mục, nguy cơ gãy đổ khi mưa bão.','Đã xử lý','Đội cây xanh đang lên lịch cắt tỉa trong chiều nay.',15),(9,'2025-11-29 03:25:38','An ninh trật tự','Có hiện tượng mất trộm vặt (mũ bảo hiểm, chậu cây) tại khu vực để xe chung.','Đã xử lý','Đã tăng cường camera giám sát và cử bảo vệ tuần tra thường xuyên hơn.',30),(10,'2025-12-02 03:25:38','Y tế dự phòng','Khu vực cống rãnh sau dãy nhà C có nhiều muỗi, đề nghị phun thuốc diệt muỗi phòng sốt xuất huyết.','Đã xử lý','Đang tổng hợp danh sách các điểm nóng để lên lịch phun thuốc toàn phường.',3);
/*!40000 ALTER TABLE `phan_anh` ENABLE KEYS */;
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
  KEY `tam_vang_ibfk_1_idx` (`id_cd`),
  CONSTRAINT `tam_vang_ibfk_1` FOREIGN KEY (`id_cd`) REFERENCES `cong_dan` (`id_cd`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tam_vang`
--

LOCK TABLES `tam_vang` WRITE;
/*!40000 ALTER TABLE `tam_vang` DISABLE KEYS */;
INSERT INTO `tam_vang` VALUES (1,'2025-12-06 03:32:17','Thực hiện nghĩa vụ quân sự','2025-02-10','2027-02-10',5),(2,'2025-12-06 03:32:17','Đi học đại học tại TP.HCM','2024-09-05','2028-06-30',12),(4,'2025-12-06 03:32:17','Đi làm ăn kinh tế tại tỉnh Bình Dương','2025-03-01','2026-03-01',33),(5,'2025-12-06 03:32:17','Về quê chăm sóc bố mẹ già','2025-05-20','2025-11-20',45);
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

-- Dump completed on 2025-12-29 11:31:36
