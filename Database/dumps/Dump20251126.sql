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
INSERT INTO `accounts` VALUES ('001079023664','123456','cu dan'),('001202021868','123456','cu dan'),('001205030702','123456','cu dan'),('002182005067','123456','cu dan'),('002184029329','123456','cu dan'),('002218027098','123456','cu dan'),('004099005526','123456','cu dan'),('006202014951','123456','cu dan'),('006205016356','123456','cu dan'),('008171023365','123456','cu dan'),('012097008038','123456','cu dan'),('012345678912','123456','quan ly'),('014184016247','123456','cu dan'),('015210029700','123456','cu dan'),('015219022550','123456','cu dan'),('017093013983','123456','cu dan'),('017199010000','123456','cu dan'),('020305006891','123456','cu dan'),('022179024895','123456','cu dan'),('023081017260','123456','cu dan'),('023082000064','123456','cu dan'),('023218008760','123456','cu dan'),('025077004290','123456','cu dan'),('025095031388','123456','cu dan'),('025099021064','123456','cu dan'),('025176014707','123456','cu dan'),('025197026243','123456','cu dan'),('025214014006','123456','cu dan'),('026171029491','123456','cu dan'),('026191003344','123456','cu dan'),('026215001080','123456','cu dan'),('026225032391','123456','cu dan'),('026304005052','123456','cu dan'),('027310021996','123456','cu dan'),('030089030616','123456','cu dan'),('030099027498','123456','cu dan'),('030193031884','123456','cu dan'),('031072026598','123456','cu dan'),('031315017493','123456','cu dan'),('035184029529','123456','cu dan'),('036098014611','123456','cu dan'),('037092025749','123456','cu dan'),('037186000354','123456','cu dan'),('037191009161','123456','cu dan'),('038080009955','123456','cu dan'),('038211022449','123456','cu dan'),('040171029381','123456','cu dan'),('040206008099','123456','cu dan'),('040223023985','123456','cu dan'),('042179022503','123456','cu dan'),('042314006243','123456','cu dan'),('044205003741','123456','cu dan'),('044223000785','123456','cu dan'),('045096031503','123456','cu dan'),('045306022984','123456','cu dan'),('046074017254','123456','cu dan'),('048203001504','123456','cu dan'),('049099007779','123456','cu dan'),('049325025606','123456','cu dan'),('052087031324','123456','cu dan'),('052196028259','123456','cu dan'),('054085029356','123456','cu dan'),('054302029330','123456','cu dan'),('056221003382','123456','cu dan'),('056306025399','123456','cu dan'),('056315011212','123456','cu dan'),('060214030588','123456','cu dan'),('066300028737','123456','cu dan'),('067081021249','123456','cu dan'),('068073031124','123456','cu dan'),('068187030176','123456','cu dan'),('070080015596','123456','cu dan'),('070193005762','123456','cu dan'),('074191005517','123456','cu dan'),('074215026855','123456','cu dan'),('074307029488','123456','cu dan'),('075203025587','123456','cu dan'),('077180007735','123456','cu dan'),('079173011516','123456','cu dan'),('080225023163','123456','cu dan'),('082219022726','123456','cu dan'),('083210011115','123456','cu dan'),('083219000784','123456','cu dan'),('084083003461','123456','cu dan'),('084177000902','123456','cu dan'),('084302013839','123456','cu dan'),('086093021965','123456','cu dan'),('086180030434','123456','cu dan'),('086317005393','123456','cu dan'),('087206028711','123456','cu dan'),('089325024538','123456','cu dan'),('091302000789','123456','cu dan'),('092176003369','123456','cu dan'),('092189012462','123456','cu dan'),('093206019451','123456','cu dan'),('093306013260','123456','cu dan'),('093306018589','123456','cu dan'),('094073016314','123456','cu dan'),('094181002195','123456','cu dan'),('094214032241','123456','cu dan'),('094314017452','123456','cu dan'),('095181022615','123456','cu dan');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cong_dan`
--

DROP TABLE IF EXISTS `cong_dan`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cong_dan` (
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
  `noi_cap` varchar(50) NOT NULL,
  `ngay_cap` date NOT NULL,
  `userID` varchar(20) NOT NULL,
  PRIMARY KEY (`cccd`),
  KEY `userID` (`userID`),
  CONSTRAINT `cong_dan_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `accounts` (`userID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cong_dan`
--

LOCK TABLES `cong_dan` WRITE;
/*!40000 ALTER TABLE `cong_dan` DISABLE KEYS */;
INSERT INTO `cong_dan` VALUES ('001202021868','Hồ Duy Minh',NULL,'Nam','1981-08-16','Hà Nội','Hà Nội','Kinh',NULL,NULL,'Hà Nội','2025-10-31','001202021868'),('002184029329','Phan Huyền Hương',NULL,'Nữ','1977-06-19','Hà Giang','Hà Giang','Kinh',NULL,NULL,'Hà Giang','2025-10-31','002184029329'),('002218027098','Hồ Bảo Sơn',NULL,'Nam','1999-07-12','Hà Giang','Hà Giang','Kinh',NULL,NULL,'Hà Giang','2025-10-31','002218027098'),('004099005526','Nguyễn Duy Dũng',NULL,'Nam','1977-03-17','Cao Bằng','Cao Bằng','Kinh',NULL,NULL,'Cao Bằng','2025-10-31','004099005526'),('006202014951','Dương Bảo Hiếu',NULL,'Nam','2025-08-12','Bắc Kạn','Bắc Kạn','Kinh',NULL,NULL,'Bắc Kạn','2025-10-31','006202014951'),('017199010000','Lê Thu Thảo',NULL,'Nữ','1976-11-23','Hòa Bình','Hòa Bình','Kinh',NULL,NULL,'Hòa Bình','2025-10-31','017199010000'),('022179024895','Nguyễn An Uyên',NULL,'Nữ','2023-06-20','Quảng Ninh','Quảng Ninh','Kinh',NULL,NULL,'Quảng Ninh','2025-10-31','022179024895'),('025077004290','Phan Phúc Thanh',NULL,'Nam','2010-03-01','Phú Thọ','Phú Thọ','Kinh',NULL,NULL,'Phú Thọ','2025-10-31','025077004290'),('025099021064','Dương Trang Vinh',NULL,'Nam','2015-06-30','Phú Thọ','Phú Thọ','Kinh',NULL,NULL,'Phú Thọ','2025-10-31','025099021064'),('026171029491','Hoàng Trang Lan',NULL,'Nữ','2006-01-25','Vĩnh Phúc','Vĩnh Phúc','Kinh',NULL,NULL,'Vĩnh Phúc','2025-10-31','026171029491'),('026191003344','Lê Huyền Mai',NULL,'Nữ','2006-08-04','Vĩnh Phúc','Vĩnh Phúc','Kinh',NULL,NULL,'Vĩnh Phúc','2025-10-31','026191003344'),('026215001080','Võ Hoàng Cường',NULL,'Nam','1973-06-09','Vĩnh Phúc','Vĩnh Phúc','Kinh',NULL,NULL,'Vĩnh Phúc','2025-10-31','026215001080'),('026304005052','Bùi Kim Hiền',NULL,'Nữ','1989-10-04','Vĩnh Phúc','Vĩnh Phúc','Kinh',NULL,NULL,'Vĩnh Phúc','2025-10-31','026304005052'),('030089030616','Hồ An Toàn',NULL,'Nam','2015-11-29','Hải Dương','Hải Dương','Kinh',NULL,NULL,'Hải Dương','2025-10-31','030089030616'),('030099027498','Dương Phúc Hoàng',NULL,'Nam','1996-04-18','Hải Dương','Hải Dương','Kinh',NULL,NULL,'Hải Dương','2025-10-31','030099027498'),('030193031884','Vũ Thu An',NULL,'Nữ','1979-10-31','Hải Dương','Hải Dương','Kinh',NULL,NULL,'Hải Dương','2025-10-31','030193031884'),('031072026598','Đặng Đức Hoàng',NULL,'Nam','2019-05-30','Hải Phòng','Hải Phòng','Kinh',NULL,NULL,'Hải Phòng','2025-10-31','031072026598'),('031315017493','Nguyễn Ngọc Uyên',NULL,'Nữ','1999-12-24','Hải Phòng','Hải Phòng','Kinh',NULL,NULL,'Hải Phòng','2025-10-31','031315017493'),('035184029529','Hoàng Ngọc Mai',NULL,'Nữ','1971-12-17','Hà Nam','Hà Nam','Kinh',NULL,NULL,'Hà Nam','2025-10-31','035184029529'),('036098014611','Võ Hoàng Toàn',NULL,'Nam','2006-11-07','Nam Định','Nam Định','Kinh',NULL,NULL,'Nam Định','2025-10-31','036098014611'),('038080009955','Nguyễn Hoàng Vinh',NULL,'Nam','2002-11-08','Thanh Hóa','Thanh Hóa','Kinh',NULL,NULL,'Thanh Hóa','2025-10-31','038080009955'),('040171029381','Lê Diễm Ngọc',NULL,'Nữ','1993-04-12','Nghệ An','Nghệ An','Kinh',NULL,NULL,'Nghệ An','2025-10-31','040171029381'),('040206008099','Lê Khánh Minh',NULL,'Nam','1993-01-24','Nghệ An','Nghệ An','Kinh',NULL,NULL,'Nghệ An','2025-10-31','040206008099'),('040223023985','Đặng Minh Hoàng',NULL,'Nam','1987-02-10','Nghệ An','Nghệ An','Kinh',NULL,NULL,'Nghệ An','2025-10-31','040223023985'),('045096031503','Trần Phúc Thanh',NULL,'Nam','1971-02-11','Quảng Trị','Quảng Trị','Kinh',NULL,NULL,'Quảng Trị','2025-10-31','045096031503'),('048203001504','Bùi Quang Toàn',NULL,'Nam','2015-01-22','Đà Nẵng','Đà Nẵng','Kinh',NULL,NULL,'Đà Nẵng','2025-10-31','048203001504'),('049325025606','Võ Ngọc Giang',NULL,'Nữ','2025-06-23','Quảng Nam','Quảng Nam','Kinh',NULL,NULL,'Quảng Nam','2025-10-31','049325025606'),('052087031324','Đặng Trang Thiện',NULL,'Nam','1999-08-27','Bình Định','Bình Định','Kinh',NULL,NULL,'Bình Định','2025-10-31','052087031324'),('054302029330','Bùi Khánh Hương',NULL,'Nữ','2002-11-17','Phú Yên','Phú Yên','Kinh',NULL,NULL,'Phú Yên','2025-10-31','054302029330'),('056306025399','Dương Mai Vân',NULL,'Nữ','1980-10-06','Khánh Hòa','Khánh Hòa','Kinh',NULL,NULL,'Khánh Hòa','2025-10-31','056306025399'),('056315011212','Vũ Huyền Lan',NULL,'Nữ','2017-04-13','Khánh Hòa','Khánh Hòa','Kinh',NULL,NULL,'Khánh Hòa','2025-10-31','056315011212'),('067081021249','Lý Quang Thanh',NULL,'Nam','2003-07-22','Đắk Nông','Đắk Nông','Kinh',NULL,NULL,'Đắk Nông','2025-10-31','067081021249'),('068187030176','Hoàng An Giang',NULL,'Nữ','2014-06-26','Lâm Đồng','Lâm Đồng','Kinh',NULL,NULL,'Lâm Đồng','2025-10-31','068187030176'),('074191005517','Trần Khánh Giang',NULL,'Nữ','2015-07-02','Bình Dương','Bình Dương','Kinh',NULL,NULL,'Bình Dương','2025-10-31','074191005517'),('074215026855','Ngô Minh Thắng',NULL,'Nam','1998-12-11','Bình Dương','Bình Dương','Kinh',NULL,NULL,'Bình Dương','2025-10-31','074215026855'),('075203025587','Huỳnh Quang Thiện',NULL,'Nam','2002-04-11','Đồng Nai','Đồng Nai','Kinh',NULL,NULL,'Đồng Nai','2025-10-31','075203025587'),('080225023163','Hồ Phúc Khánh',NULL,'Nam','2018-09-24','Long An','Long An','Kinh',NULL,NULL,'Long An','2025-10-31','080225023163'),('083210011115','Hồ Hoàng Khải',NULL,'Nam','1999-04-04','Bến Tre','Bến Tre','Kinh',NULL,NULL,'Bến Tre','2025-10-31','083210011115'),('083219000784','Nguyễn An Thành',NULL,'Nam','1984-01-25','Bến Tre','Bến Tre','Kinh',NULL,NULL,'Bến Tre','2025-10-31','083219000784'),('084177000902','Phan Mỹ Diễm',NULL,'Nữ','1980-12-26','Trà Vinh','Trà Vinh','Kinh',NULL,NULL,'Trà Vinh','2025-10-31','084177000902'),('086093021965','Phan An Quân',NULL,'Nam','2003-11-11','Vĩnh Long','Vĩnh Long','Kinh',NULL,NULL,'Vĩnh Long','2025-10-31','086093021965'),('086180030434','Lê Diễm Bình',NULL,'Nữ','1984-12-07','Vĩnh Long','Vĩnh Long','Kinh',NULL,NULL,'Vĩnh Long','2025-10-31','086180030434'),('086317005393','Vũ Thị Mai',NULL,'Nữ','2004-08-07','Vĩnh Long','Vĩnh Long','Kinh',NULL,NULL,'Vĩnh Long','2025-10-31','086317005393'),('087206028711','Lê Bảo Hiếu',NULL,'Nam','1991-12-11','Đồng Tháp','Đồng Tháp','Kinh',NULL,NULL,'Đồng Tháp','2025-10-31','087206028711'),('089325024538','Huỳnh An Bình',NULL,'Nữ','2025-08-11','An Giang','An Giang','Kinh',NULL,NULL,'An Giang','2025-10-31','089325024538'),('092176003369','Phạm Trang Thảo',NULL,'Nữ','1972-04-18','Cần Thơ','Cần Thơ','Kinh',NULL,NULL,'Cần Thơ','2025-10-31','092176003369'),('093206019451','Võ Khánh Thiện',NULL,'Nam','1987-04-27','Hậu Giang','Hậu Giang','Kinh',NULL,NULL,'Hậu Giang','2025-10-31','093206019451'),('093306013260','Vũ Thị Hương',NULL,'Nữ','2006-10-20','Hậu Giang','Hậu Giang','Kinh',NULL,NULL,'Hậu Giang','2025-10-31','093306013260'),('094073016314','Ngô Thế Thắng',NULL,'Nam','2006-07-16','Sóc Trăng','Sóc Trăng','Kinh',NULL,NULL,'Sóc Trăng','2025-10-31','094073016314'),('094314017452','Dương Huyền Hòa',NULL,'Nữ','2006-02-15','Sóc Trăng','Sóc Trăng','Kinh',NULL,NULL,'Sóc Trăng','2025-10-31','094314017452');
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
    INSERT INTO historyLog (table_name, record_id, column_name, old_value, new_value)
    
    -- Bắt đầu khối SELECT đầu tiên
    SELECT 'cong_dan', OLD.cccd, 'ho_ten', OLD.ho_ten, NEW.ho_ten 
    WHERE NOT (OLD.ho_ten <=> NEW.ho_ten)
    
    UNION ALL

    SELECT 'cong_dan', OLD.cccd, 'bi_danh', OLD.bi_danh, NEW.bi_danh 
    WHERE NOT (OLD.bi_danh <=> NEW.bi_danh)
    
    UNION ALL

    SELECT 'cong_dan', OLD.cccd, 'gioi_tinh', OLD.gioi_tinh, NEW.gioi_tinh 
    WHERE NOT (OLD.gioi_tinh <=> NEW.gioi_tinh)
    
    UNION ALL
    SELECT 'cong_dan', OLD.cccd, 'ngay_sinh', OLD.ngay_sinh, NEW.ngay_sinh 
    WHERE NOT (OLD.ngay_sinh <=> NEW.ngay_sinh)
    
    UNION ALL
    SELECT 'cong_dan', OLD.cccd, 'noi_sinh', OLD.noi_sinh, NEW.noi_sinh 
    WHERE NOT (OLD.noi_sinh <=> NEW.noi_sinh)
    
    UNION ALL
    SELECT 'cong_dan', OLD.cccd, 'que_quan', OLD.que_quan, NEW.que_quan 
    WHERE NOT (OLD.que_quan <=> NEW.que_quan)
    
    UNION ALL
    SELECT 'cong_dan', OLD.cccd, 'dan_toc', OLD.dan_toc, NEW.dan_toc 
    WHERE NOT (OLD.dan_toc <=> NEW.dan_toc)
    
    UNION ALL
    SELECT 'cong_dan', OLD.cccd, 'nghe_nghiep', OLD.nghe_nghiep, NEW.nghe_nghiep 
    WHERE NOT (OLD.nghe_nghiep <=> NEW.nghe_nghiep)
    
    UNION ALL
    SELECT 'cong_dan', OLD.cccd, 'noi_lam_viec', OLD.noi_lam_viec, NEW.noi_lam_viec 
    WHERE NOT(OLD.noi_lam_viec <=> NEW.noi_lam_viec)
    
    UNION ALL
    SELECT 'cong_dan', OLD.cccd, 'noi_cap', OLD.noi_cap, NEW.noi_cap 
    WHERE NOT(OLD.noi_cap <=> NEW.noi_cap)
    
    UNION ALL
    SELECT 'cong_dan', OLD.cccd, 'ngay_cap', OLD.ngay_cap, NEW.ngay_cap 
    WHERE NOT(OLD.ngay_cap <=> NEW.ngay_cap);
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

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
  KEY `id_tt` (`id_tt`),
  CONSTRAINT `ho_khau_ibfk_1` FOREIGN KEY (`id_tt`) REFERENCES `tam_thuong_tru` (`id_tt`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ho_khau`
--

LOCK TABLES `ho_khau` WRITE;
/*!40000 ALTER TABLE `ho_khau` DISABLE KEYS */;
INSERT INTO `ho_khau` VALUES (1,'2 ngach 46',NULL),(2,'16 ngach 19',NULL),(3,'16 ngach 9',NULL),(4,'7 ngach 10',NULL),(5,'16 ngach 31',NULL),(6,'14 ngach 24',NULL),(7,'14 ngach 8',NULL),(8,'10 ngach 22',NULL),(9,'5 ngach 14',NULL),(10,'10 ngach 29',NULL);
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
  `quan_he_voi_chu_ho` enum('Chủ hộ','Vợ','Chồng','Bố ruột','Mẹ ruột','Con ruột','Ông nội','Bà nội','Ông ngoại','Bà ngoại','Bố chồng','Mẹ chồng','Bố vợ','Mẹ vợ','Bạn bè','Anh trai','Em trai','Chị gái','Em gái','Anh em họ','Anh vợ','Em vợ','Chị dâu','Anh rể','Cháu nội','Cháu ngoại') DEFAULT NULL,
  `ngay_dang_ki_thuong_tru` date NOT NULL,
  `thuong_tru_truoc_day` varchar(50) DEFAULT NULL,
  `chu_ho_identifier` varchar(50) GENERATED ALWAYS AS ((case when (`quan_he_voi_chu_ho` = _utf8mb4'Chủ hộ') then `id_ho_khau` else NULL end)) VIRTUAL,
  PRIMARY KEY (`cccd`,`id_ho_khau`),
  UNIQUE KEY `uk_mot_chu_ho_tren_mot_so_hk` (`chu_ho_identifier`),
  KEY `id_ho_khau` (`id_ho_khau`),
  CONSTRAINT `nhan_khau_ibfk_1` FOREIGN KEY (`id_ho_khau`) REFERENCES `ho_khau` (`id_ho_khau`),
  CONSTRAINT `nhan_khau_ibfk_2` FOREIGN KEY (`cccd`) REFERENCES `cong_dan` (`cccd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nhan_khau`
--

LOCK TABLES `nhan_khau` WRITE;
/*!40000 ALTER TABLE `nhan_khau` DISABLE KEYS */;
INSERT INTO `nhan_khau` (`cccd`, `id_ho_khau`, `quan_he_voi_chu_ho`, `ngay_dang_ki_thuong_tru`, `thuong_tru_truoc_day`) VALUES ('001202021868',3,'Chủ hộ','2025-10-31',NULL),('002184029329',7,'Con ruột','2025-10-31',NULL),('002218027098',6,'Con ruột','2025-10-31',NULL),('004099005526',2,'Vợ','2025-10-31',NULL),('006202014951',6,'Chủ hộ','2025-10-31',NULL),('017199010000',7,'Chủ hộ','2025-10-31',NULL),('022179024895',10,'Chủ hộ','2025-10-31',NULL),('025077004290',8,'Chủ hộ','2025-10-31',NULL),('025099021064',8,'Con ruột','2025-10-31',NULL),('026171029491',4,'Con ruột','2025-10-31',NULL),('026191003344',5,'Vợ','2025-10-31',NULL),('026215001080',3,'Con ruột','2025-10-31',NULL),('026304005052',1,'Con ruột','2025-10-31',NULL),('030089030616',1,'Con ruột','2025-10-31',NULL),('030099027498',4,'Con ruột','2025-10-31',NULL),('030193031884',9,'Con ruột','2025-10-31',NULL),('031072026598',7,'Con ruột','2025-10-31',NULL),('031315017493',2,'Chủ hộ','2025-10-31',NULL),('035184029529',9,'Con ruột','2025-10-31',NULL),('036098014611',8,'Con ruột','2025-10-31',NULL),('038080009955',2,'Con ruột','2025-10-31',NULL),('040171029381',9,'Con ruột','2025-10-31',NULL),('040206008099',5,'Con ruột','2025-10-31',NULL),('040223023985',10,'Vợ','2025-10-31',NULL),('045096031503',4,'Con ruột','2025-10-31',NULL),('048203001504',3,'Con ruột','2025-10-31',NULL),('049325025606',6,'Con ruột','2025-10-31',NULL),('052087031324',4,'Vợ','2025-10-31',NULL),('054302029330',2,'Con ruột','2025-10-31',NULL),('056306025399',9,'Chủ hộ','2025-10-31',NULL),('056315011212',1,'Vợ','2025-10-31',NULL),('067081021249',3,'Vợ','2025-10-31',NULL),('068187030176',10,'Con ruột','2025-10-31',NULL),('074191005517',1,'Chủ hộ','2025-10-31',NULL),('074215026855',8,'Con ruột','2025-10-31',NULL),('075203025587',5,'Con ruột','2025-10-31',NULL),('080225023163',6,'Con ruột','2025-10-31',NULL),('083210011115',8,'Vợ','2025-10-31',NULL),('083219000784',7,'Con ruột','2025-10-31',NULL),('084177000902',2,'Con ruột','2025-10-31',NULL),('086093021965',5,'Con ruột','2025-10-31',NULL),('086180030434',9,'Vợ','2025-10-31',NULL),('086317005393',1,'Con ruột','2025-10-31',NULL),('087206028711',5,'Chủ hộ','2025-10-31',NULL),('089325024538',6,'Vợ','2025-10-31',NULL),('092176003369',7,'Vợ','2025-10-31',NULL),('093206019451',4,'Chủ hộ','2025-10-31',NULL),('093306013260',10,'Con ruột','2025-10-31',NULL),('094073016314',3,'Con ruột','2025-10-31',NULL),('094314017452',10,'Con ruột','2025-10-31',NULL);
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
    SELECT 'nhan_khau', OLD.cccd, 'quan_he_voi_chu_ho', OLD.quan_he_voi_chu_ho, NEW.quan_he_voi_chu_ho 
    WHERE NOT(OLD.quan_he_voi_chu_ho <=> NEW.quan_he_voi_chu_ho)
    
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
  `loai_phan_anh` varchar(50) NOT NULL,
  `noi_dung` varchar(1000) DEFAULT NULL,
  `trang_thai` enum('Chưa xem','Đã xem','Đang chờ xử lý','Đang xử lý','Đã xử lý') DEFAULT 'Chưa xem',
  `cccd` varchar(20) NOT NULL,
  PRIMARY KEY (`id_pa`),
  KEY `cccd` (`cccd`),
  CONSTRAINT `phan_anh_ibfk_1` FOREIGN KEY (`cccd`) REFERENCES `nhan_khau` (`cccd`)
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
  `state` enum('Chưa duyệt','Đã duyệt','Bị từ chối','Hết hạn') NOT NULL DEFAULT 'Chưa duyệt',
  `_type` enum('Thường trú','Tạm trú') DEFAULT NULL,
  `cccd` varchar(20) NOT NULL,
  PRIMARY KEY (`id_tt`),
  KEY `cccd` (`cccd`),
  CONSTRAINT `tam_thuong_tru_ibfk_1` FOREIGN KEY (`cccd`) REFERENCES `cong_dan` (`cccd`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tam_thuong_tru`
--

LOCK TABLES `tam_thuong_tru` WRITE;
/*!40000 ALTER TABLE `tam_thuong_tru` DISABLE KEYS */;
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

-- Dump completed on 2025-11-26  8:17:51
