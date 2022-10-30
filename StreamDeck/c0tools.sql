-- --------------------------------------------------------
-- Hôte:                         127.0.0.1
-- Version du serveur:           5.7.33 - MySQL Community Server (GPL)
-- SE du serveur:                Win64
-- HeidiSQL Version:             11.2.0.6213
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Listage de la structure de la table axytools. accountings
CREATE TABLE IF NOT EXISTS `accountings` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `subscribe_id` bigint(20) unsigned NOT NULL,
  `order_id` bigint(20) unsigned NOT NULL,
  `description` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` enum('addiction','deduction') COLLATE utf8mb4_unicode_ci NOT NULL,
  `amount` int(11) NOT NULL,
  `tax` int(10) unsigned NOT NULL,
  `total` int(11) NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `accountings_user_id_foreign` (`user_id`),
  KEY `accountings_subscribe_id_foreign` (`subscribe_id`),
  KEY `accountings_order_id_foreign` (`order_id`),
  CONSTRAINT `accountings_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `accountings_subscribe_id_foreign` FOREIGN KEY (`subscribe_id`) REFERENCES `subscribes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `accountings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.accountings : ~0 rows (environ)
/*!40000 ALTER TABLE `accountings` DISABLE KEYS */;
/*!40000 ALTER TABLE `accountings` ENABLE KEYS */;

-- Listage de la structure de la table axytools. accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `number` int(10) unsigned NOT NULL,
  `broker_name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('master','slave') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'slave',
  `broker_server` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `platform` enum('mt4','mt5') COLLATE utf8mb4_unicode_ci DEFAULT 'mt4',
  `currency` enum('EUR','USD','CAD','CHF','AUD','GBP','JPY') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'USD',
  `equity` int(11) DEFAULT '0',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `stats` longtext COLLATE utf8mb4_unicode_ci,
  `trades` longtext COLLATE utf8mb4_unicode_ci,
  `coord_x` int(11) DEFAULT NULL,
  `coord_y` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `accounts_slug_unique` (`slug`),
  KEY `accounts_user_id_foreign` (`user_id`),
  CONSTRAINT `accounts_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.accounts : ~4 rows (environ)
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` (`id`, `user_id`, `name`, `slug`, `number`, `broker_name`, `type`, `broker_server`, `key`, `platform`, `currency`, `equity`, `active`, `stats`, `trades`, `coord_x`, `coord_y`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(18, 1, 'Le compte de AxyHum', 'master_18', 890422041, 'VantageFX', 'master', 'VantageInternational-Demo', '42668165-b051-455a-acf0-6c5d0244c542', 'mt4', 'USD', 99557, 0, NULL, NULL, 20, 432, '2022-09-22 01:46:22', '2022-10-21 14:43:05', NULL),
	(20, 1, 'Compte de Paul', 'slave_20', 890424109, 'VantageFX', 'slave', 'VantageInternational-Demo', 'c741958a-f984-4a09-a852-a64396756825', 'mt4', 'USD', 0, 0, '{"absoluteGain":-3.40608,"lostTrades":17,"trades":19,"wonTrades":2,"averageLoss":-50.98117647058824,"averageWin":7.58,"averageLossPips":-82.45070588235293,"averageWinPips":1.7000000000000002,"balance":24148.48,"bestTrade":13.71,"bestTradeDate":"2022-09-26","worstTrade":-563.36,"worstTradeDate":"2022-09-26","bestTradePips":2.6,"bestTradeDatePips":"2022-09-26","worstTradePips":-1292,"worstTradeDatePips":"2022-09-24","averageTradeTime":1.2105263157894737,"commissions":-203.76,"weekdayProb":[],"volume":26.47,"dailyGrowth":{"totalVolumeDay":[[1663804800000,6.470000000000001],[1663891200000,3],[1663977600000,1],[1664150400000,15],[1664236800000,1]],"totalBalanceDay":[[1663804800000,24922.030000000002],[1663891200000,24900.920000000002],[1663977600000,24889.010000000002],[1664150400000,24159.94],[1664236800000,24148.48]],"totalGainDay":[[1663804800000,-0.3118799999999866],[1663891200000,-0.39631999999999445],[1663977600000,-0.4439599999999988],[1664150400000,-3.3602400000000143],[1664236800000,-3.40608]],"totalProfitDay":[[1663804800000,-77.97],[1663891200000,-99.08],[1663977600000,-110.99],[1664150400000,-840.06],[1664236800000,-851.52]],"profitDay":[[1663804800000,-77.97],[1663891200000,-21.11],[1663977600000,-11.91],[1664150400000,-729.0699999999999],[1664236800000,-11.46]]},"totalDepots":25000,"totalRetraits":0,"highBalance":25000,"highBalanceDate":"2022-09-22T16:12:52.000Z","longTrades":2,"longWonTrades":0,"longWonTradesPercent":"0.00","shortTrades":17,"shortWonTrades":2,"shortWonTradesPercent":"11.76","profitFactor":0.017492038584021784,"periods":[{},{},{},{"initBalance":25000,"gain":-3.40608,"gainDiff":null,"lots":26.47,"lotsDiff":null,"pips":-1398.262,"pipsDiff":null,"profit":-851.52,"profitDiff":null,"trades":19,"tradesDiff":null,"wonTrades":2,"wonTradesPercent":0.10526315789473684,"wonTradesPercentDiff":null}],"totalPips":-1398.262}', '[{"closeTime":"2022-09-22T16:12:52.000Z","profit":25000},{"_id":"c741958a-f984-4a09-a852-a64396756825+144041491","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":0.98372,"closeTime":"2022-09-22 21:05:25.000","gain":0,"openPrice":0.9837,"openTime":"2022-09-22 21:05:18.000","pips":0.056,"positionId":"144041491","profit":-0.6300000000000001,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":0.28,"commission":-1.12,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144041510","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":0.98369,"closeTime":"2022-09-22 21:05:30.000","gain":0,"openPrice":0.9837,"openTime":"2022-09-22 21:05:27.000","pips":0.028,"positionId":"144041510","profit":-0.8700000000000001,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_SELL","durationInMinutes":0,"volume":0.28,"commission":-1.12,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144041538","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":0.98363,"closeTime":"2022-09-22 21:06:01.000","gain":-0.01,"openPrice":0.98364,"openTime":"2022-09-22 21:05:36.000","pips":-0.028,"positionId":"144041538","profit":-1.37,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":0.28,"commission":-1.12,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144041604","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":0.98346,"closeTime":"2022-09-22 21:07:05.000","gain":-0.22,"openPrice":0.98363,"openTime":"2022-09-22 21:06:04.000","pips":-4.794,"positionId":"144041604","profit":-53.870000000000005,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":1,"volume":2.82,"commission":-11.28,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144044241","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":0.98309,"closeTime":"2022-09-22 21:27:30.000","gain":-0.09,"openPrice":0.98313,"openTime":"2022-09-22 21:27:28.000","pips":-1.124,"positionId":"144044241","profit":-21.23,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":2.81,"commission":-11.24,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144196607","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":0.97706,"closeTime":"2022-09-23 16:17:40.000","gain":-0.03,"openPrice":0.97709,"openTime":"2022-09-23 16:17:38.000","pips":-0.3,"positionId":"144196607","profit":-6.7,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":-4,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144230851","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":0.97176,"closeTime":"2022-09-23 18:08:34.000","gain":-0.03,"openPrice":0.97181,"openTime":"2022-09-23 18:08:31.000","pips":-0.5,"positionId":"144230851","profit":-8.57,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":-4,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144248787","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":0.97132,"closeTime":"2022-09-23 19:47:15.000","gain":-0.02,"openPrice":0.9713,"openTime":"2022-09-23 19:46:23.000","pips":-0.2,"positionId":"144248787","profit":-5.84,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_SELL","durationInMinutes":0,"volume":1,"commission":-4,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144282225","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":19102.49,"closeTime":"2022-09-24 20:07:34.000","gain":-0.05,"openPrice":19115.41,"openTime":"2022-09-24 20:07:31.000","pips":-1292,"positionId":"144282225","profit":-11.91,"success":"lost","symbol":"BTCUSD","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":0,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144514720","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":1.3786,"closeTime":"2022-09-26 19:34:23.000","gain":-0.1,"openPrice":1.37892,"openTime":"2022-09-26 19:33:25.000","pips":-3.2,"positionId":"144514720","profit":-25.79,"success":"lost","symbol":"USDCAD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":-4,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144514956","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":1.37793,"closeTime":"2022-09-26 19:35:58.000","gain":-0.22,"openPrice":1.37869,"openTime":"2022-09-26 19:34:24.000","pips":-7.6,"positionId":"144514956","profit":-55.72,"success":"lost","symbol":"USDCAD+","type":"DEAL_TYPE_BUY","durationInMinutes":1,"volume":1,"commission":-4,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144515494","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":1.37768,"closeTime":"2022-09-26 19:36:19.000","gain":-0.11,"openPrice":1.37801,"openTime":"2022-09-26 19:36:06.000","pips":-3.3,"positionId":"144515494","profit":-26.45,"success":"lost","symbol":"USDCAD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":-4,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144515557","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":1.37779,"closeTime":"2022-09-26 19:38:42.000","gain":0.01,"openPrice":1.37771,"openTime":"2022-09-26 19:36:20.000","pips":0.8,"positionId":"144515557","profit":1.4500000000000002,"success":"won","symbol":"USDCAD+","type":"DEAL_TYPE_BUY","durationInMinutes":2,"volume":1,"commission":-4,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144516052","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":1.37808,"closeTime":"2022-09-26 19:38:55.000","gain":0.06,"openPrice":1.37782,"openTime":"2022-09-26 19:38:42.000","pips":2.6,"positionId":"144516052","profit":13.71,"success":"won","symbol":"USDCAD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":-4,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144516143","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":1.37806,"closeTime":"2022-09-26 19:39:27.000","gain":-0.02,"openPrice":1.37809,"openTime":"2022-09-26 19:39:04.000","pips":-0.3,"positionId":"144516143","profit":-6.05,"success":"lost","symbol":"USDCAD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":-4,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144516174","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":1.37801,"closeTime":"2022-09-26 19:40:08.000","gain":-0.06,"openPrice":1.37802,"openTime":"2022-09-26 19:39:31.000","pips":-0.3,"positionId":"144516174","profit":-14.04,"success":"lost","symbol":"USDCAD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":3,"commission":-12,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144516369","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":1.37779,"closeTime":"2022-09-26 19:41:10.000","gain":-0.21,"openPrice":1.37799,"openTime":"2022-09-26 19:40:09.000","pips":-6,"positionId":"144516369","profit":-52.82,"success":"lost","symbol":"USDCAD+","type":"DEAL_TYPE_BUY","durationInMinutes":1,"volume":3,"commission":-12,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144516506","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":1.37515,"closeTime":"2022-09-26 19:59:20.000","gain":-2.28,"openPrice":1.37785,"openTime":"2022-09-26 19:41:10.000","pips":-81,"positionId":"144516506","profit":-563.36,"success":"lost","symbol":"USDCAD+","type":"DEAL_TYPE_BUY","durationInMinutes":18,"volume":3,"commission":-12,"swap":0},{"_id":"c741958a-f984-4a09-a852-a64396756825+144691825","accountId":"c741958a-f984-4a09-a852-a64396756825","closePrice":1.36898,"closeTime":"2022-09-27 16:56:00.000","gain":-0.05,"openPrice":1.36909,"openTime":"2022-09-27 16:55:57.000","pips":-1.1,"positionId":"144691825","profit":-11.46,"success":"lost","symbol":"USDCAD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":-4,"swap":0}]', 587, 483, '2022-09-22 18:13:54', '2022-10-21 14:43:05', NULL),
	(21, 1, 'Master Test', 'master_21', 890424528, 'VantageFX', 'master', 'VantageInternational-Demo', '31268472-8c2c-4105-9e6e-06f159bcb58d', 'mt4', 'USD', 49273, 0, '{"absoluteGain":-1.320800000000022,"lostTrades":7,"trades":9,"wonTrades":2,"averageLoss":-158.08714285714288,"averageWin":223.10500000000002,"averageLossPips":-11.828571428571427,"averageWinPips":28.1,"balance":49339.59999999999,"bestTrade":440.95000000000005,"bestTradeDate":"2022-10-17","worstTrade":-949.23,"worstTradeDate":"2022-10-17","bestTradePips":55.2,"bestTradeDatePips":"2022-10-17","worstTradePips":-81.6,"worstTradeDatePips":"2022-10-17","averageTradeTime":0.5555555555555556,"commissions":-780,"weekdayProb":[],"volume":78,"dailyGrowth":{"totalVolumeDay":[[1665964800000,78]],"totalBalanceDay":[[1665964800000,49339.59999999999]],"totalGainDay":[[1665964800000,-1.320800000000022]],"totalProfitDay":[[1665964800000,-660.3999999999999]],"profitDay":[[1665964800000,-660.3999999999999]]},"totalDepots":50000,"totalRetraits":0,"highBalance":50000,"highBalanceDate":"2022-09-22T20:41:40.000Z","longTrades":6,"longWonTrades":2,"longWonTradesPercent":"33.33","shortTrades":3,"shortWonTrades":0,"shortWonTradesPercent":"0.00","profitFactor":0.40322245416180946,"periods":[{"initBalance":50000,"gain":-2.2027000000000116,"gainDiff":0,"lots":77,"lotsDiff":0,"pips":-26.499999999999986,"pipsDiff":0,"profit":-654.3699999999999,"profitDiff":0,"trades":8,"tradesDiff":0,"wonTrades":2,"wonTradesPercent":0.25,"wonTradesPercentDiff":0},{"initBalance":50000,"gain":-2.2027000000000116,"gainDiff":0,"lots":77,"lotsDiff":0,"pips":-26.499999999999986,"pipsDiff":0,"profit":-654.3699999999999,"profitDiff":0,"trades":8,"tradesDiff":0,"wonTrades":2,"wonTradesPercent":0.25,"wonTradesPercentDiff":0},{"initBalance":50000,"gain":-2.2027000000000116,"gainDiff":0,"lots":77,"lotsDiff":0,"pips":-26.499999999999986,"pipsDiff":0,"profit":-654.3699999999999,"profitDiff":0,"trades":8,"tradesDiff":0,"wonTrades":2,"wonTradesPercent":0.25,"wonTradesPercentDiff":0},{"initBalance":50000,"gain":-1.3207999999999998,"gainDiff":null,"lots":78,"lotsDiff":null,"pips":-26.599999999999994,"pipsDiff":null,"profit":-660.3999999999999,"profitDiff":null,"trades":9,"tradesDiff":null,"wonTrades":2,"wonTradesPercent":0.2222222222222222,"wonTradesPercentDiff":null}],"totalPips":-26.599999999999994}', '[{"closeTime":"2022-09-22T20:41:40.000Z","profit":50000},{"_id":"31268472-8c2c-4105-9e6e-06f159bcb58d+147710109","accountId":"31268472-8c2c-4105-9e6e-06f159bcb58d","closePrice":0.97387,"closeTime":"2022-10-17 12:01:52.000","gain":-0.01,"openPrice":0.97388,"openTime":"2022-10-17 12:01:45.000","pips":-0.1,"positionId":"147710109","profit":-6.03,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":-5,"swap":0},{"_id":"31268472-8c2c-4105-9e6e-06f159bcb58d+147710327","accountId":"31268472-8c2c-4105-9e6e-06f159bcb58d","closePrice":0.97399,"closeTime":"2022-10-17 12:03:58.000","gain":-0.01,"openPrice":0.97399,"openTime":"2022-10-17 12:03:54.000","pips":0,"positionId":"147710327","profit":-5,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":-5,"swap":0},{"_id":"31268472-8c2c-4105-9e6e-06f159bcb58d+147711573","accountId":"31268472-8c2c-4105-9e6e-06f159bcb58d","closePrice":0.97502,"closeTime":"2022-10-17 12:14:44.000","gain":0.01,"openPrice":0.97492,"openTime":"2022-10-17 12:12:38.000","pips":1,"positionId":"147711573","profit":5.26,"success":"won","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":2,"volume":1,"commission":-5,"swap":0},{"_id":"31268472-8c2c-4105-9e6e-06f159bcb58d+147711596","accountId":"31268472-8c2c-4105-9e6e-06f159bcb58d","closePrice":0.9752,"closeTime":"2022-10-17 12:15:03.000","gain":-0.07,"openPrice":0.9749,"openTime":"2022-10-17 12:12:54.000","pips":-3,"positionId":"147711596","profit":-35.760000000000005,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_SELL","durationInMinutes":2,"volume":1,"commission":-5,"swap":0},{"_id":"31268472-8c2c-4105-9e6e-06f159bcb58d+147715774","accountId":"31268472-8c2c-4105-9e6e-06f159bcb58d","closePrice":0.97543,"closeTime":"2022-10-17 12:39:11.000","gain":-0.01,"openPrice":0.97543,"openTime":"2022-10-17 12:39:07.000","pips":0,"positionId":"147715774","profit":-5,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":-5,"swap":0},{"_id":"31268472-8c2c-4105-9e6e-06f159bcb58d+147764057","accountId":"31268472-8c2c-4105-9e6e-06f159bcb58d","closePrice":0.97897,"closeTime":"2022-10-17 16:44:13.000","gain":-0.02,"openPrice":0.97902,"openTime":"2022-10-17 16:43:49.000","pips":-0.5,"positionId":"147764057","profit":-10.11,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":1,"commission":-5,"swap":0},{"_id":"31268472-8c2c-4105-9e6e-06f159bcb58d+147764082","accountId":"31268472-8c2c-4105-9e6e-06f159bcb58d","closePrice":0.97899,"closeTime":"2022-10-17 16:44:13.000","gain":-0.19,"openPrice":0.979,"openTime":"2022-10-17 16:43:56.000","pips":2.4,"positionId":"147764082","profit":-95.48,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_SELL","durationInMinutes":0,"volume":24,"commission":-120,"swap":0},{"_id":"31268472-8c2c-4105-9e6e-06f159bcb58d+147789411","accountId":"31268472-8c2c-4105-9e6e-06f159bcb58d","closePrice":0.98404,"closeTime":"2022-10-17 18:51:57.000","gain":-1.9,"openPrice":0.9837,"openTime":"2022-10-17 18:50:39.000","pips":-81.6,"positionId":"147789411","profit":-949.23,"success":"lost","symbol":"EURUSD+","type":"DEAL_TYPE_SELL","durationInMinutes":1,"volume":24,"commission":-120,"swap":0},{"_id":"31268472-8c2c-4105-9e6e-06f159bcb58d+147789474","accountId":"31268472-8c2c-4105-9e6e-06f159bcb58d","closePrice":0.98405,"closeTime":"2022-10-17 18:51:57.000","gain":0.9,"openPrice":0.98382,"openTime":"2022-10-17 18:51:16.000","pips":55.2,"positionId":"147789474","profit":440.95000000000005,"success":"won","symbol":"EURUSD+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":24,"commission":-120,"swap":0}]', 54, 54, '2022-09-22 22:50:54', '2022-10-21 14:43:05', NULL),
	(22, 1, 'Compte de Michel', 'master_22', 890466110, 'VantageFX', 'master', 'VantageInternational-Demo', '00ee9b93-bbad-4880-96a9-55c097abbf06', 'mt4', 'USD', 99862, 0, '{"absoluteGain":-0.13757000000002018,"lostTrades":7,"trades":9,"wonTrades":2,"averageLoss":-128.01000000000002,"averageWin":379.25,"averageLossPips":-52.92857142857143,"averageWinPips":50.625,"balance":99862.42999999998,"bestTrade":755.71,"bestTradeDate":"2022-10-18","worstTrade":-364.71,"worstTradeDate":"2022-10-18","bestTradePips":99.75,"bestTradeDatePips":"2022-10-18","worstTradePips":-109,"worstTradeDatePips":"2022-10-18","averageTradeTime":16,"commissions":-620,"weekdayProb":[],"volume":65,"dailyGrowth":{"totalVolumeDay":[[1666051200000,65]],"totalBalanceDay":[[1666051200000,99862.42999999998]],"totalGainDay":[[1666051200000,-0.13757000000002018]],"totalProfitDay":[[1666051200000,-137.5699999999999]],"profitDay":[[1666051200000,-137.5699999999999]]},"totalDepots":100000,"totalRetraits":0,"highBalance":100567.41,"highBalanceDate":"2022-10-18","longTrades":8,"longWonTrades":1,"longWonTradesPercent":"12.50","shortTrades":1,"shortWonTrades":1,"shortWonTradesPercent":"100.00","profitFactor":0.8464740477864452,"periods":[{"initBalance":100000,"gain":-0.0348300000000163,"gainDiff":0,"lots":62.5,"lotsDiff":0,"pips":-270.75,"pipsDiff":0,"profit":-140.35999999999999,"profitDiff":0,"trades":8,"tradesDiff":0,"wonTrades":1,"wonTradesPercent":0.125,"wonTradesPercentDiff":0},{"initBalance":100000,"gain":-0.0348300000000163,"gainDiff":0,"lots":62.5,"lotsDiff":0,"pips":-270.75,"pipsDiff":0,"profit":-140.35999999999999,"profitDiff":0,"trades":8,"tradesDiff":0,"wonTrades":1,"wonTradesPercent":0.125,"wonTradesPercentDiff":0},{"initBalance":100000,"gain":-0.0348300000000163,"gainDiff":0,"lots":62.5,"lotsDiff":0,"pips":-270.75,"pipsDiff":0,"profit":-140.35999999999999,"profitDiff":0,"trades":8,"tradesDiff":0,"wonTrades":1,"wonTradesPercent":0.125,"wonTradesPercentDiff":0},{"initBalance":100000,"gain":-0.13756999999999991,"gainDiff":null,"lots":65,"lotsDiff":null,"pips":-269.25,"pipsDiff":null,"profit":-137.5699999999999,"profitDiff":null,"trades":9,"tradesDiff":null,"wonTrades":2,"wonTradesPercent":0.2222222222222222,"wonTradesPercentDiff":null}],"totalPips":-269.25}', '[{"closeTime":"2022-10-18T13:46:32.000Z","profit":100000},{"_id":"00ee9b93-bbad-4880-96a9-55c097abbf06+147958641","accountId":"00ee9b93-bbad-4880-96a9-55c097abbf06","closePrice":0.72535,"closeTime":"2022-10-18 16:51:09.000","gain":0,"openPrice":0.72529,"openTime":"2022-10-18 16:51:03.000","pips":1.5,"positionId":"147958641","profit":2.789999999999999,"success":"won","symbol":"CADCHF+","type":"DEAL_TYPE_BUY","durationInMinutes":0,"volume":2.5,"commission":-12.5,"swap":0},{"_id":"00ee9b93-bbad-4880-96a9-55c097abbf06+147958649","accountId":"00ee9b93-bbad-4880-96a9-55c097abbf06","closePrice":0.72461,"closeTime":"2022-10-18 17:18:54.000","gain":-0.19,"openPrice":0.72531,"openTime":"2022-10-18 16:51:17.000","pips":-17.5,"positionId":"147958649","profit":-191.09,"success":"lost","symbol":"CADCHF+","type":"DEAL_TYPE_BUY","durationInMinutes":27,"volume":2.5,"commission":-12.5,"swap":0},{"_id":"00ee9b93-bbad-4880-96a9-55c097abbf06+147976205","accountId":"00ee9b93-bbad-4880-96a9-55c097abbf06","closePrice":0.72348,"closeTime":"2022-10-18 18:07:10.000","gain":0.76,"openPrice":0.72367,"openTime":"2022-10-18 18:05:31.000","pips":99.75,"positionId":"147976205","profit":755.71,"success":"won","symbol":"CADCHF+","type":"DEAL_TYPE_SELL","durationInMinutes":1,"volume":52.5,"commission":-262.5,"swap":0},{"_id":"00ee9b93-bbad-4880-96a9-55c097abbf06+147976216","accountId":"00ee9b93-bbad-4880-96a9-55c097abbf06","closePrice":50.79,"closeTime":"2022-10-18 18:16:16.000","gain":-0.11,"openPrice":51.87,"openTime":"2022-10-18 18:05:40.000","pips":-108,"positionId":"147976216","profit":-109.85,"success":"lost","symbol":"LTCUSD","type":"DEAL_TYPE_BUY","durationInMinutes":10,"volume":1,"commission":0,"swap":0},{"_id":"00ee9b93-bbad-4880-96a9-55c097abbf06+147965979","accountId":"00ee9b93-bbad-4880-96a9-55c097abbf06","closePrice":0.72342,"closeTime":"2022-10-18 18:17:35.000","gain":-0.36,"openPrice":0.7248,"openTime":"2022-10-18 17:20:30.000","pips":-34.5,"positionId":"147965979","profit":-364.71,"success":"lost","symbol":"CADCHF+","type":"DEAL_TYPE_BUY","durationInMinutes":57,"volume":2.5,"commission":-12.5,"swap":0},{"_id":"00ee9b93-bbad-4880-96a9-55c097abbf06+147976220","accountId":"00ee9b93-bbad-4880-96a9-55c097abbf06","closePrice":50.78,"closeTime":"2022-10-18 18:17:35.000","gain":-0.11,"openPrice":51.87,"openTime":"2022-10-18 18:05:40.000","pips":-109,"positionId":"147976220","profit":-110.88,"success":"lost","symbol":"LTCUSD","type":"DEAL_TYPE_BUY","durationInMinutes":11,"volume":1,"commission":0,"swap":0},{"_id":"00ee9b93-bbad-4880-96a9-55c097abbf06+147976247","accountId":"00ee9b93-bbad-4880-96a9-55c097abbf06","closePrice":0.72349,"closeTime":"2022-10-18 18:19:00.000","gain":-0.02,"openPrice":0.7236,"openTime":"2022-10-18 18:06:00.000","pips":-1.1,"positionId":"147976247","profit":-16.23,"success":"lost","symbol":"CADCHF+","type":"DEAL_TYPE_BUY","durationInMinutes":13,"volume":1,"commission":-5,"swap":0},{"_id":"00ee9b93-bbad-4880-96a9-55c097abbf06+147976289","accountId":"00ee9b93-bbad-4880-96a9-55c097abbf06","closePrice":1.354,"closeTime":"2022-10-18 18:19:00.000","gain":0,"openPrice":1.35394,"openTime":"2022-10-18 18:06:02.000","pips":0.6,"positionId":"147976289","profit":-0.5700000000000003,"success":"lost","symbol":"EURCAD+","type":"DEAL_TYPE_BUY","durationInMinutes":12,"volume":1,"commission":-5,"swap":0},{"_id":"00ee9b93-bbad-4880-96a9-55c097abbf06+147976222","accountId":"00ee9b93-bbad-4880-96a9-55c097abbf06","closePrice":50.86,"closeTime":"2022-10-18 18:19:01.000","gain":-0.1,"openPrice":51.87,"openTime":"2022-10-18 18:05:43.000","pips":-101,"positionId":"147976222","profit":-102.74,"success":"lost","symbol":"LTCUSD","type":"DEAL_TYPE_BUY","durationInMinutes":13,"volume":1,"commission":0,"swap":0}]', 452, -14, '2022-10-18 15:49:18', '2022-10-21 14:43:05', NULL);
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;

-- Listage de la structure de la table axytools. account_links
CREATE TABLE IF NOT EXISTS `account_links` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `master_id` bigint(20) unsigned NOT NULL,
  `slave_id` bigint(20) unsigned NOT NULL,
  `active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `account_links_master_id_foreign` (`master_id`),
  KEY `account_links_slave_id_foreign` (`slave_id`),
  CONSTRAINT `account_links_master_id_foreign` FOREIGN KEY (`master_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `account_links_slave_id_foreign` FOREIGN KEY (`slave_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.account_links : ~0 rows (environ)
/*!40000 ALTER TABLE `account_links` DISABLE KEYS */;
INSERT INTO `account_links` (`id`, `master_id`, `slave_id`, `active`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(31, 21, 20, 1, '2022-10-21 14:37:22', '2022-10-21 14:37:24', NULL);
/*!40000 ALTER TABLE `account_links` ENABLE KEYS */;

-- Listage de la structure de la table axytools. brokers
CREATE TABLE IF NOT EXISTS `brokers` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `server` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.brokers : ~0 rows (environ)
/*!40000 ALTER TABLE `brokers` DISABLE KEYS */;
/*!40000 ALTER TABLE `brokers` ENABLE KEYS */;

-- Listage de la structure de la table axytools. calculators
CREATE TABLE IF NOT EXISTS `calculators` (
  `user_id` bigint(20) unsigned NOT NULL,
  `symbol` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sl` double(8,2) NOT NULL,
  `tp` double(8,2) NOT NULL,
  `risk` double(8,2) NOT NULL,
  PRIMARY KEY (`user_id`),
  KEY `calculators_symbol_foreign` (`symbol`),
  CONSTRAINT `calculators_symbol_foreign` FOREIGN KEY (`symbol`) REFERENCES `symbols` (`name`) ON DELETE CASCADE,
  CONSTRAINT `calculators_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.calculators : ~0 rows (environ)
/*!40000 ALTER TABLE `calculators` DISABLE KEYS */;
/*!40000 ALTER TABLE `calculators` ENABLE KEYS */;

-- Listage de la structure de la table axytools. calculator_settings
CREATE TABLE IF NOT EXISTS `calculator_settings` (
  `user_id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `account_type` enum('VSTP','VECN','ASTP','AECN','ICSTP','ICECN','FTMOSTP','MFFSTP','VPECN','VPECNE') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'VSTP',
  `smcmode` tinyint(1) NOT NULL DEFAULT '0',
  `copymode` tinyint(1) NOT NULL DEFAULT '0',
  `leverage` enum('1','2','10','30','50','100','200','300','400','500') COLLATE utf8mb4_unicode_ci NOT NULL,
  `capital` int(10) unsigned NOT NULL,
  `currency` enum('EUR','USD','CAD','CHF','AUD','GBP','JPY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `count` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  CONSTRAINT `calculator_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.calculator_settings : ~0 rows (environ)
/*!40000 ALTER TABLE `calculator_settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `calculator_settings` ENABLE KEYS */;

-- Listage de la structure de la table axytools. calculs
CREATE TABLE IF NOT EXISTS `calculs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `symbol` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sl` double(8,2) NOT NULL,
  `tp` double(8,2) NOT NULL,
  `risk` double(8,2) NOT NULL,
  `capital` int(10) unsigned NOT NULL,
  `com` double(8,2) NOT NULL,
  `lots` double(8,2) NOT NULL,
  `profit` double(8,2) NOT NULL,
  `currency` enum('EUR','USD','CAD','CHF','AUD','GBP','JPY') COLLATE utf8mb4_unicode_ci NOT NULL,
  `rr_reel` double(8,2) NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `calculs_symbol_foreign` (`symbol`),
  CONSTRAINT `calculs_symbol_foreign` FOREIGN KEY (`symbol`) REFERENCES `symbols` (`name`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.calculs : ~0 rows (environ)
/*!40000 ALTER TABLE `calculs` DISABLE KEYS */;
/*!40000 ALTER TABLE `calculs` ENABLE KEYS */;

-- Listage de la structure de la table axytools. devices
CREATE TABLE IF NOT EXISTS `devices` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `browser` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Google',
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '/images/icons/google-chrome.png',
  `platform` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Windows',
  `device` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT 'Xiaomi Redmi Note 8',
  `ip` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `location` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'France',
  `recent_activity` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `devices_user_id_foreign` (`user_id`),
  CONSTRAINT `devices_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.devices : ~2 rows (environ)
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` (`id`, `user_id`, `browser`, `image`, `platform`, `device`, `ip`, `location`, `recent_activity`) VALUES
	(2, 1, 'Chrome', '/images/icons/google-chrome.png', 'Windows', 'Desktop', '127.0.0.1', 'Unknown', '2022-10-30 11:45:44'),
	(4, 14, 'Chrome', '/images/icons/google-chrome.png', 'Windows', 'Desktop', '127.0.0.1', 'Unknown', '2022-10-18 13:48:19'),
	(6, 17, 'Chrome', '/images/icons/google-chrome.png', 'Windows', 'Desktop', '127.0.0.1', 'Unknown', '2022-10-27 17:54:15');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;

-- Listage de la structure de la table axytools. discounts
CREATE TABLE IF NOT EXISTS `discounts` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_type` enum('fixed','precent') COLLATE utf8mb4_unicode_ci NOT NULL,
  `percent` int(10) unsigned DEFAULT NULL,
  `amount` int(10) unsigned DEFAULT NULL,
  `max_amount` int(10) unsigned DEFAULT NULL,
  `min_amount` int(10) unsigned DEFAULT NULL,
  `count` int(10) unsigned DEFAULT NULL,
  `for_first_purchase` tinyint(1) NOT NULL DEFAULT '0',
  `status` tinyint(1) NOT NULL DEFAULT '0',
  `expired_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.discounts : ~0 rows (environ)
/*!40000 ALTER TABLE `discounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `discounts` ENABLE KEYS */;

-- Listage de la structure de la table axytools. migrations
CREATE TABLE IF NOT EXISTS `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.migrations : ~40 rows (environ)
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
	(1, '2014_10_12_000000_create_users_table', 1),
	(2, '2014_10_12_100000_create_password_resets_table', 1),
	(3, '2014_10_12_200000_add_two_factor_columns_to_users_table', 1),
	(4, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(5, '2022_07_07_092732_create_subscribes_table', 1),
	(6, '2022_07_07_122909_create_subscriptions_table', 1),
	(7, '2022_07_07_124627_create_orders_table', 1),
	(8, '2022_07_07_125639_create_accountings_table', 1),
	(9, '2022_07_07_130231_create_sales_table', 1),
	(10, '2022_07_07_130517_create_payment_channels_table', 1),
	(11, '2022_07_07_130923_create_discounts_table', 1),
	(12, '2022_07_07_132625_create_calculator_settings_table', 1),
	(13, '2022_07_07_133935_create_symbols_table', 1),
	(14, '2022_07_07_140000_create_calculs_table', 1),
	(15, '2022_07_07_140641_create_calculators_table', 1),
	(16, '2022_07_07_141116_create_brokers_table', 1),
	(17, '2022_07_27_182611_create_devices_table', 1),
	(18, '2022_07_31_005734_create_accounts_table', 1),
	(19, '2022_08_03_101101_create_account_links_table', 1),
	(20, '2022_09_08_011901_create_roles_table', 2),
	(41, '2014_10_12_000000_create_users_table', 1),
	(42, '2014_10_12_100000_create_password_resets_table', 1),
	(43, '2014_10_12_200000_add_two_factor_columns_to_users_table', 1),
	(44, '2019_12_14_000001_create_personal_access_tokens_table', 1),
	(45, '2022_07_07_092732_create_subscribes_table', 1),
	(46, '2022_07_07_122909_create_subscriptions_table', 1),
	(47, '2022_07_07_124627_create_orders_table', 1),
	(48, '2022_07_07_125639_create_accountings_table', 1),
	(49, '2022_07_07_130231_create_sales_table', 1),
	(50, '2022_07_07_130517_create_payment_channels_table', 1),
	(51, '2022_07_07_130923_create_discounts_table', 1),
	(52, '2022_07_07_132625_create_calculator_settings_table', 1),
	(53, '2022_07_07_133935_create_symbols_table', 1),
	(54, '2022_07_07_140000_create_calculs_table', 1),
	(55, '2022_07_07_140641_create_calculators_table', 1),
	(56, '2022_07_07_141116_create_brokers_table', 1),
	(57, '2022_07_27_182611_create_devices_table', 1),
	(58, '2022_07_31_005734_create_accounts_table', 1),
	(59, '2022_08_03_101101_create_account_links_table', 1),
	(60, '2022_09_08_011901_create_roles_table', 1),
	(62, '2022_10_30_112422_create_tradings_table', 3);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;

-- Listage de la structure de la table axytools. orders
CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `status` enum('pending','paying','paid','fail') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `payment_method` enum('stripe','paypal','crypto') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'stripe',
  `amount` int(10) unsigned NOT NULL,
  `tax` int(10) unsigned NOT NULL,
  `discount` int(11) NOT NULL,
  `total` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_user_id_foreign` (`user_id`),
  CONSTRAINT `orders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.orders : ~0 rows (environ)
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;

-- Listage de la structure de la table axytools. password_resets
CREATE TABLE IF NOT EXISTS `password_resets` (
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.password_resets : ~0 rows (environ)
/*!40000 ALTER TABLE `password_resets` DISABLE KEYS */;
INSERT INTO `password_resets` (`email`, `token`, `created_at`) VALUES
	('alexis.bataillon@gmail.com', '$2y$10$1Z2G7sqL.zdrq1jJ/kOk1e6cvIabwg/nJJiRumyQAzt9SrvTtdBfW', '2022-09-23 10:39:21');
/*!40000 ALTER TABLE `password_resets` ENABLE KEYS */;

-- Listage de la structure de la table axytools. payment_channels
CREATE TABLE IF NOT EXISTS `payment_channels` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `class_name` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '0',
  `image` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `settings` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.payment_channels : ~0 rows (environ)
/*!40000 ALTER TABLE `payment_channels` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_channels` ENABLE KEYS */;

-- Listage de la structure de la table axytools. personal_access_tokens
CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint(20) unsigned NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.personal_access_tokens : ~0 rows (environ)
/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;

-- Listage de la structure de la table axytools. roles
CREATE TABLE IF NOT EXISTS `roles` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `caption` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `users_count` int(10) unsigned NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.roles : ~0 rows (environ)
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;

-- Listage de la structure de la table axytools. sales
CREATE TABLE IF NOT EXISTS `sales` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `subscribe_id` bigint(20) unsigned NOT NULL,
  `order_id` bigint(20) unsigned NOT NULL,
  `amount` int(10) unsigned NOT NULL,
  `tax` int(10) unsigned NOT NULL,
  `discount` int(11) NOT NULL,
  `total` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_user_id_foreign` (`user_id`),
  KEY `sales_subscribe_id_foreign` (`subscribe_id`),
  KEY `sales_order_id_foreign` (`order_id`),
  CONSTRAINT `sales_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_subscribe_id_foreign` FOREIGN KEY (`subscribe_id`) REFERENCES `subscribes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `sales_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.sales : ~0 rows (environ)
/*!40000 ALTER TABLE `sales` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales` ENABLE KEYS */;

-- Listage de la structure de la table axytools. subscribes
CREATE TABLE IF NOT EXISTS `subscribes` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int(10) unsigned NOT NULL,
  `stripe_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.subscribes : ~0 rows (environ)
/*!40000 ALTER TABLE `subscribes` DISABLE KEYS */;
INSERT INTO `subscribes` (`id`, `name`, `price`, `stripe_id`) VALUES
	(1, 'Test', 150, 'gçsiudhgdhn');
/*!40000 ALTER TABLE `subscribes` ENABLE KEYS */;

-- Listage de la structure de la table axytools. subscriptions
CREATE TABLE IF NOT EXISTS `subscriptions` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) unsigned NOT NULL,
  `subscribe_id` bigint(20) unsigned NOT NULL,
  `stripe_id` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) DEFAULT '0',
  `cancel_reason` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `subscriptions_user_id_foreign` (`user_id`),
  KEY `subscriptions_subscribe_id_foreign` (`subscribe_id`),
  CONSTRAINT `subscriptions_subscribe_id_foreign` FOREIGN KEY (`subscribe_id`) REFERENCES `subscribes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `subscriptions_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.subscriptions : ~0 rows (environ)
/*!40000 ALTER TABLE `subscriptions` DISABLE KEYS */;
INSERT INTO `subscriptions` (`id`, `user_id`, `subscribe_id`, `stripe_id`, `active`, `cancel_reason`) VALUES
	(1, 1, 1, 'dsffdfse', 1, NULL);
/*!40000 ALTER TABLE `subscriptions` ENABLE KEYS */;

-- Listage de la structure de la table axytools. symbols
CREATE TABLE IF NOT EXISTS `symbols` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(12) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `symbols_name_unique` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.symbols : ~0 rows (environ)
/*!40000 ALTER TABLE `symbols` DISABLE KEYS */;
/*!40000 ALTER TABLE `symbols` ENABLE KEYS */;

-- Listage de la structure de la table axytools. tradings
CREATE TABLE IF NOT EXISTS `tradings` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `symbol` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'EURUSD',
  `type` enum('BUY','SELL') COLLATE utf8mb4_unicode_ci DEFAULT 'BUY',
  `SL` bigint(20) unsigned NOT NULL DEFAULT '10',
  `TP` bigint(20) unsigned NOT NULL DEFAULT '10',
  `RR` bigint(20) unsigned NOT NULL DEFAULT '2',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.tradings : ~0 rows (environ)
/*!40000 ALTER TABLE `tradings` DISABLE KEYS */;
INSERT INTO `tradings` (`id`, `symbol`, `type`, `SL`, `TP`, `RR`, `created_at`, `updated_at`) VALUES
	('f4d5b460-5842-11ed-9b6a-0242ac120002', 'EURUSD', 'BUY', 52, 10, 2, '2022-10-30 12:05:41', '2022-10-30 14:27:55');
/*!40000 ALTER TABLE `tradings` ENABLE KEYS */;

-- Listage de la structure de la table axytools. users
CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `first_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci DEFAULT 'user',
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zip_code` int(10) unsigned DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timezone` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `currency` enum('EUR','USD','GBP','AUD','CHF') COLLATE utf8mb4_unicode_ci DEFAULT 'USD',
  `lang` enum('en','fr') COLLATE utf8mb4_unicode_ci DEFAULT 'en',
  `darkmode` tinyint(1) DEFAULT '1',
  `discord_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `google_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `facebook_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cus_stripe_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `two_factor_secret` text COLLATE utf8mb4_unicode_ci,
  `two_factor_recovery_codes` text COLLATE utf8mb4_unicode_ci,
  `two_factor_confirmed_at` timestamp NULL DEFAULT NULL,
  `trades_copied` int(10) unsigned NOT NULL DEFAULT '0',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `avatar` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Listage des données de la table axytools.users : ~3 rows (environ)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `first_name`, `last_name`, `role`, `email`, `phone`, `address`, `state`, `city`, `zip_code`, `country`, `timezone`, `currency`, `lang`, `darkmode`, `discord_id`, `google_id`, `facebook_id`, `cus_stripe_id`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `trades_copied`, `email_verified_at`, `remember_token`, `avatar`, `created_at`, `updated_at`, `deleted_at`) VALUES
	(1, 'Admin', 'Alexis', 'Bataillon', 'admin', 'alexisbis.bataillon@gmail.com', NULL, '2 Rue René Cassin', 'Loire', 'Saint-Chamond', 42400, 'France', NULL, 'USD', 'fr', 1, NULL, NULL, NULL, NULL, '$2y$10$zxsd9X0sG37iOcjhnSv1VeuOTS59RBcwsaYc5ud7Me0h0DQ7JSE8u', 'eyJpdiI6InhGQ0dCcm5SSTJkZXladUtxTDh0WXc9PSIsInZhbHVlIjoicjhIRWNwZ1hGMnkzSWEzOGxKcXF0ek9XbStCallvaUdKZGNRNVlmWmpCbz0iLCJtYWMiOiI5MTcxZTVlYzA5OWQ2Njc5YTYzN2YyOTRlN2IzMThlYWY1ZTcwZDhkZjM1MTExYWM1NmJiMTE4M2Y4NmU2M2ZhIiwidGFnIjoiIn0=', 'eyJpdiI6IjRkRmVIMEpXTUdWR1NFb0k5QThjSmc9PSIsInZhbHVlIjoiaUtqdWpkTW80aHBaZGduak5xMGJ4Rm1CS0REbkxqWmliUi9kTlBMKzBlY3JuVVNKVVY3TXZSN0lWdmk1OTFQdTlubzlMcW95NW9WVlVTRDR6cmJuSGV6cnBvdjF3emRYN0ZNVFp2c21SdDFRai96UDE1TDR0R1I1VTRUS1MzdmVRbmtaTW53M3NPbnAxMlREZXJyYkNPVVJxeklndFhvMVpxVnduTkNNNVFzTzZYaEFxZjRpTUp6aWtWd3BseHpPcW1GR0I2TmtjQ0REWHkzQU1CSVgrVTN2eG9WNW4rSFo5dVl1ZE5mdDRKTmUxZWVwODRPa0xSTlo2VVUyellrVkxjT2g0ejcvSFloTk5EeCt5TDQ3bkE9PSIsIm1hYyI6IjQ2YWQyZjk5MThmMGY3NjlmMmY5OTQ0YmY3OGE4M2RkMGZkMjg5ZGUzNTMyZDU3OTZhZGM4ODYzZjc4ZDU2MjEiLCJ0YWciOiIifQ==', '2022-10-27 15:13:20', 0, NULL, NULL, NULL, '2022-08-04 11:06:53', '2022-10-27 15:21:04', NULL),
	(13, 'Admin2', NULL, NULL, 'admin', 'alexisbisbis.bataillon@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'USD', 'fr', 1, NULL, NULL, NULL, NULL, '$2y$10$zxsd9X0sG37iOcjhnSv1VeuOTS59RBcwsaYc5ud7Me0h0DQ7JSE8u', 'eyJpdiI6IlZvRWFzNjJ2S1RqT1FacVFCcFF4MkE9PSIsInZhbHVlIjoickRmci9kcnU4NzYrOS93S0Q4MXdPdlFja3dxT2R1V2czNTNiRU5EMENWND0iLCJtYWMiOiI2YzQxNTYwNDNlN2Q2ZjJhNzBkNWY4Njg1MmU5YTI2MDRjMzBlNDE2MTdiODg3NTU0MGM0MjBmMDkwZjBhNmRiIiwidGFnIjoiIn0=', 'eyJpdiI6IlRnQVN0YmZpVjdwV2hLcmFuQnJQSHc9PSIsInZhbHVlIjoiNGVSbk9sYVJ5SDF0K3Y4eFZFenArMlJmMnV4bnhHaU5FS1JLUUhLU2g1NE1aeWFzVEc0L1krd0JUbUVqcWNNOW5EbEdGYzRvYnNZNXVuVlJoeE01cEJ2a3h5a3B6Z1RDK050NFdvRE84ZHpQZmVYci9QM0NDRUJTS3BpOWt0ZjkySzNENUlnM0JPVUVqMzRVOHh2amxDczlJbk1XSzhnZ0FrblZVekR3ZTQ0K2RLOVdlWXdaYmtMaFE4elF0d01jQU01SE9OZE5kZzZPc0xmOWpQTnZvdmJ5TFhUcDEyK3VkRi9xNmRLdU4xc1dTbGkvR1BaSHYxWHFrV1haMjlNNXNKVDc0eVY3Y2ZaN2lDVHQrd3Z5U1E9PSIsIm1hYyI6ImYzNjY5MWIwNWE4MDE5MDM0MTkyZWEwNGVjZTFlNDJmNzliNGNlZmJmMzYyMzQ4MWVhNTUxZWEzNzMxMmEwMWUiLCJ0YWciOiIifQ==', NULL, 0, NULL, NULL, NULL, '2022-08-04 11:06:53', '2022-09-21 11:30:00', NULL),
	(14, 'Alexis', NULL, NULL, 'user', 'Alexgo42400@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'USD', 'fr', 1, NULL, NULL, NULL, NULL, '$2y$10$rctKmCtHV8c5Bl5cCY1oxeEyiqovpRule53sPJFzPPGpYVDjJgg4y', NULL, NULL, NULL, 20, NULL, NULL, NULL, '2022-10-10 11:35:02', '2022-10-18 14:48:34', NULL),
	(17, 'Test', NULL, NULL, 'user', 'test@usertest.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'USD', 'fr', 1, NULL, NULL, NULL, NULL, '$2y$10$A09S1acWghDONVMUjW.hK.gAVPK/Qybxlu9DZNn1SLJPVXXUugA0y', NULL, NULL, NULL, 0, NULL, NULL, NULL, '2022-10-27 17:49:33', '2022-10-27 18:03:10', NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
