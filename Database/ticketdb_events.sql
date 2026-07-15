-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: ticketdb
-- ------------------------------------------------------
-- Server version	8.0.46

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
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `capacity` int DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(4000) DEFAULT NULL,
  `event_date` datetime(6) DEFAULT NULL,
  `grad_class` varchar(255) DEFAULT NULL,
  `icon` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `price` double DEFAULT NULL,
  `rejection_reason` varchar(255) DEFAULT NULL,
  `status` enum('APPROVED','DRAFT','PENDING','REJECTED') DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `organizer_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs00ob1818elamuyp02fgo3hxf` (`organizer_id`),
  CONSTRAINT `FKs00ob1818elamuyp02fgo3hxf` FOREIGN KEY (`organizer_id`) REFERENCES `accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (3,2000,'Thể thao','2026-07-14 11:08:44.000000','Giải chạy marathon thường niên với các cự ly 5km, 10km, 21km và 42km.','2026-09-05 05:00:00.000000','grad-3','fa-person-running','Công viên Thống Nhất, Hà Nội',350000,NULL,'APPROVED','Giải chạy Marathon Thành Phố',NULL),(4,200,'Nghệ thuật','2026-07-14 11:08:44.000000','Trưng bày các tác phẩm hội họa, điêu khắc của nghệ sĩ trẻ Việt Nam.','2026-08-25 09:00:00.000000','grad-4','fa-palette','Bảo tàng Mỹ thuật, TP.HCM',100000,NULL,'APPROVED','Triển lãm Nghệ thuật Đương đại',NULL),(5,1000,'Ẩm thực','2026-07-14 11:08:44.000000','Hơn 50 gian hàng ẩm thực đường phố từ khắp mọi miền đất nước.','2026-09-12 16:00:00.000000','grad-5','fa-utensils','Phố đi bộ Nguyễn Huệ, TP.HCM',50000,NULL,'APPROVED','Food Festival - Lễ hội Ẩm thực',NULL),(6,80,'Giáo dục','2026-07-14 11:08:44.000000','Khóa học nâng cao kỹ năng thuyết trình chuyên nghiệp trong 1 ngày.','2026-08-30 08:00:00.000000','grad-1','fa-chalkboard-user','Toà nhà Innovation Hub, Đà Nẵng',500000,NULL,'APPROVED','Workshop Kỹ năng Thuyết trình',NULL),(7,5000,'Âm nhạc','2026-07-14 11:08:44.000000','Sự kiện âm nhạc lớn nhất mùa hè quy tụ nhiều nghệ sĩ nổi tiếng.','2026-09-20 18:00:00.000000','grad-2','fa-music','Sân vận động Mỹ Đình, Hà Nội',800000,NULL,'APPROVED','Đại nhạc hội Mùa Hè',NULL),(8,900,NULL,'2026-07-14 11:16:21.678087','','2026-07-23 02:16:00.000000',NULL,NULL,'Đà Nẵng',1000000,NULL,'APPROVED','Anh Trai Say Hi',3),(10,2000,NULL,'2026-07-14 18:26:12.403308','Sự kiện Hấp dẫn','2026-07-25 23:25:00.000000',NULL,NULL,'Vũng Tàu',NULL,NULL,'APPROVED','Vượt Ngàn Chông Gai',3),(11,2000,NULL,'2026-07-14 18:40:55.940112','','2026-07-14 08:41:00.000000',NULL,NULL,'Cà Mau',NULL,NULL,'APPROVED','Em Xinh Say Hi',3),(12,2000,NULL,'2026-07-15 09:12:02.498505','','2026-08-07 09:11:00.000000',NULL,NULL,'Mỹ',NULL,NULL,'APPROVED','WWE Raw',3),(13,2000,NULL,'2026-07-15 16:57:51.946997','ĐẤU VẬT','2026-07-29 14:01:00.000000',NULL,NULL,'CHICAGO,MỸ',NULL,NULL,'APPROVED','WWE SMACKDOWN',3),(14,2900,NULL,'2026-07-15 17:09:43.273944','nhóm nhạc kpop','2026-08-06 21:09:00.000000',NULL,NULL,'Hồ Chí Minh',NULL,NULL,'APPROVED','EXO Fan Meeting',3),(15,20000,NULL,'2026-07-15 17:33:00.034358','Nhóm Nhạc K-Pop','2026-07-13 21:36:00.000000',NULL,NULL,'Hà Nội',NULL,NULL,'APPROVED','Black Pink Fan Meeting',3);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-15 21:20:34
