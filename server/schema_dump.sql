PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  language_pref TEXT DEFAULT 'en',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')), crops_grown TEXT, available_quantity INTEGER, location TEXT, expected_price TEXT,
  FOREIGN KEY(id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO profiles VALUES(1,'Devanshu Singh','devanshusingh854@gmail.com','1234567890','en','2025-11-30 07:16:52','2025-11-30 07:16:52','Tomato, Onion','1200 kg','Nashik, Maharashtra','Γé╣30-Γé╣45/kg');
INSERT INTO profiles VALUES(2,'Vishesh ','visheshsavani@gmail.com','0987654321','en','2025-11-30 07:18:00','2025-11-30 07:18:00','Wheat, Barley','2500 kg','Akola, Maharashtra','Γé╣62-Γé╣78/kg');
INSERT INTO profiles VALUES(3,'Test Farmer','testfarmer@example.com','9999999999','en','2025-11-30 14:07:30','2025-11-30 14:07:30','Sugarcane, Cotton','5000 kg','Pune, Maharashtra','Γé╣1000-Γé╣1500/quintal');
INSERT INTO profiles VALUES(4,'Omkar Patil','omkarpatil@gmail.com','8888888888','en','2025-11-30 14:42:31','2025-11-30 14:42:31',NULL,NULL,NULL,NULL);
INSERT INTO profiles VALUES(5,'Sumeet pandey','sumeetpandey@gmail.com','9999999999','en','2025-11-30 14:42:47','2025-11-30 14:42:47',NULL,NULL,NULL,NULL);
INSERT INTO profiles VALUES(6,'Sushant Satelkar','sushantsatelkar@gmail.com','2222222222','en','2025-12-04 05:14:49','2025-12-04 05:14:49','Wheat',100,'Thane','50/kg');
INSERT INTO profiles VALUES(7,'samruddhi naralkar','samruddhinaralkar@gmail.com','4444444444','en','2025-12-04 05:16:34','2025-12-04 05:16:34','','','Kanjurmarg','');
CREATE TABLE IF NOT EXISTS "users" (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'farmer',
  phone TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
INSERT INTO users VALUES(1,'devanshusingh854@gmail.com','$2a$10$EZChQbHM/0r/L0x7vtYVWu4eXeYoRzynatQULhKN/5QQqLhdUg27C','farmer','1234567890','2025-11-30 07:16:52','2025-11-30 07:16:52');
INSERT INTO users VALUES(2,'visheshsavani@gmail.com','$2a$10$j9xeMPYY/E2is2DUtoPntORSXIXNy.EnNSTlucDu4P5wdvEd2KJaS','farmer','0987654321','2025-11-30 07:18:00','2025-12-03 20:16:09');
INSERT INTO users VALUES(3,'testfarmer@example.com','$2a$10$ScyJKP/Yl9GfwNI4JHiFpOj9pOWprKOPbtO6FQo5nRa4ePucW9TEy','farmer','9999999999','2025-11-30 14:07:30','2025-12-04 05:47:24');
INSERT INTO users VALUES(4,'omkarpatil@gmail.com','$2a$10$mVUA8/oj1e.hIqIIPeD1kerqTCCsRH3yVGHkIgFrVEFkPCFq8cu7i','vendor','8888888888','2025-11-30 14:42:31','2025-11-30 14:42:31');
INSERT INTO users VALUES(5,'sumeetpandey@gmail.com','$2a$10$KbXZSNiyn73F9kBYezVXq.6q2O1Uall7kCRN4mQcB5AUHr3BnQ1MG','admin','9999999999','2025-11-30 14:42:47','2025-11-30 14:42:47');
INSERT INTO users VALUES(6,'sushantsatelkar@gmail.com','$2a$10$H0O0NR37BUGPrv6e9nkyTOVzWBNvdncxeo9zTriyzISKWj1stoHim','farmer','2222222222','2025-12-04 05:14:49','2025-12-04 05:14:49');
INSERT INTO users VALUES(7,'samruddhinaralkar@gmail.com','$2a$10$yfkNHtmGvheXrhuKpkBI9ONAx9YGzDtKG4Eqaf6zhqVp2eHM0uDwa','vendor','4444444444','2025-12-04 05:16:34','2025-12-04 05:16:34');
CREATE TABLE ngo_schemes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  ministry TEXT,
  deadline TEXT,
  location TEXT,
  contact_number TEXT,
  no_of_docs_required INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  benefit_text TEXT,
  eligibility_text TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
, scheme_type TEXT DEFAULT 'government', required_state TEXT, min_land REAL, max_land REAL, required_category TEXT, age_min INTEGER, age_max INTEGER, official_link TEXT);
INSERT INTO ngo_schemes VALUES(1,'PM-KISAN','Ministry of Agriculture','2025-12-31','Pan India','1800-180-1551',3,'active','Direct income support of Rs.6000 per year','All landholding farmers','2025-11-30 12:38:29','2025-11-30 12:38:29','government',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO ngo_schemes VALUES(2,'Kisan Credit Card','Ministry of Finance','2025-06-30','All States','1800-180-1234',5,'active','Short-term credit for cultivation and farming needs','Farmers with land ownership or tenancy','2025-11-30 12:38:33','2025-11-30 12:38:33','government',NULL,NULL,NULL,NULL,NULL,NULL,NULL);
INSERT INTO ngo_schemes VALUES(3,'PM-KISAN','Ministry of Agriculture & Farmers Welfare','2026-12-31','All India','1800-180-1551',3,'active','Direct income support of ???6000/year in 3 equal installments to all landholding farmer families','Must own cultivable land. No minimum or maximum land requirement.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','ALL',NULL,NULL,'ALL',NULL,NULL,'https://pmkisan.gov.in');
INSERT INTO ngo_schemes VALUES(4,'PMFBY - Crop Insurance','Ministry of Agriculture & Farmers Welfare','2026-12-31','All India','1800-180-1551',4,'active','Comprehensive crop insurance against natural calamities, pests and diseases','Open to all farmers growing notified crops in notified areas. Age 18+','2025-12-02 02:52:29','2025-12-02 02:52:29','government','ALL',NULL,NULL,'ALL',18,NULL,'https://pmfby.gov.in');
INSERT INTO ngo_schemes VALUES(5,'PM-KMY Pension Scheme','Ministry of Agriculture & Farmers Welfare','2026-12-31','All India','1800-180-1551',4,'active','Assured monthly pension of ???3000 after attaining age of 60 years','Small and marginal farmers (up to 2 hectares). Entry age 18-40 years.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','ALL',NULL,2.0,'ALL',18,40,'https://maandhan.in');
INSERT INTO ngo_schemes VALUES(6,'PMKSY - Irrigation Support','Ministry of Jal Shakti','2026-12-31','All India','1800-180-6790',3,'active','Subsidy for micro-irrigation systems (drip, sprinkler). Water conservation support.','All farmers with irrigation needs. Priority to water-stressed areas.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','ALL',NULL,NULL,'ALL',NULL,NULL,'https://pmksy.gov.in');
INSERT INTO ngo_schemes VALUES(7,'Soil Health Card Scheme','Ministry of Agriculture & Farmers Welfare','2026-12-31','All India','1800-180-1551',2,'active','Free soil testing and customized fertilizer recommendations for optimal crop health','All farmers. No land size restriction.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','ALL',NULL,NULL,'ALL',NULL,NULL,'https://soilhealth.dac.gov.in');
INSERT INTO ngo_schemes VALUES(8,'SMAM - Machinery Subsidy','Ministry of Agriculture & Farmers Welfare','2026-12-31','All India','1800-180-1551',5,'active','Subsidy on tractors, harvesters and farm implements. 40-50% for SC/ST/Small farmers.','All farmers. Higher subsidy for SC/ST and small/marginal farmers.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','ALL',NULL,NULL,'ALL',NULL,NULL,'https://agrimachinery.nic.in');
INSERT INTO ngo_schemes VALUES(9,'PKVY - Organic Farming','Ministry of Agriculture & Farmers Welfare','2026-12-31','All India','1800-180-1551',4,'active','Financial assistance of ???50,000/hectare for organic farming adoption. Cluster-based approach.','Farmers willing to adopt organic farming. Cluster formation required (min 20 farmers).','2025-12-02 02:52:29','2025-12-02 02:52:29','government','ALL',NULL,NULL,'ALL',NULL,NULL,'https://pgsindia-ncof.gov.in');
INSERT INTO ngo_schemes VALUES(10,'Agriculture Infrastructure Fund','Ministry of Agriculture & Farmers Welfare','2026-12-31','All India','1800-180-1551',6,'active','Low-interest loans (3% interest subvention) for post-harvest storage, processing infrastructure','Farmers, FPOs, Agri-entrepreneurs. For building storage, warehouses, cold chains.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','ALL',NULL,NULL,'ALL',18,NULL,'https://agriinfra.dac.gov.in');
INSERT INTO ngo_schemes VALUES(11,'Kisan Credit Card','Ministry of Agriculture & Farmers Welfare','2026-12-31','All India','1800-180-1551',5,'active','Low-interest credit (7% interest, 4% with timely repayment) for crop production and allied activities','All farmers owning land. Age 18-75 years.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','ALL',NULL,NULL,'ALL',18,75,'https://pmkisan.gov.in/kcc.aspx');
INSERT INTO ngo_schemes VALUES(12,'Oilseeds & Oil Palm Mission','Ministry of Agriculture & Farmers Welfare','2026-12-31','Participating States','1800-180-1551',4,'active','Financial assistance for oil palm cultivation, oilseeds production. ???12,000/hectare assistance.','Farmers with land suitable for oilseeds/oil palm cultivation.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','ALL',NULL,NULL,'ALL',NULL,NULL,'https://nmoop.gov.in');
INSERT INTO ngo_schemes VALUES(13,'Punjab Free Power Scheme','Punjab State Power Corporation Limited','2026-12-31','Punjab','1912',3,'active','Free electricity for agricultural tube-wells and pumps','All farmers in Punjab with agricultural connections.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','Punjab',NULL,NULL,'ALL',NULL,NULL,'https://pspcl.in');
INSERT INTO ngo_schemes VALUES(14,'Super Seeder Subsidy (Punjab)','Punjab Agriculture Department','2026-12-31','Punjab','0172-2970000',4,'active','Subsidy of 50-80% on super seeder machines for stubble management','Punjab farmers. For wheat sowing without stubble burning.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','Punjab',NULL,NULL,'ALL',NULL,NULL,'https://agricoop.punjab.gov.in');
INSERT INTO ngo_schemes VALUES(15,'Happy Seeder Scheme (Punjab)','Punjab Agriculture Department','2026-12-31','Punjab','0172-2970000',4,'active','Subsidy on happy seeder machines for eco-friendly wheat sowing','Punjab farmers cultivating wheat. Helps reduce air pollution.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','Punjab',NULL,NULL,'ALL',NULL,NULL,'https://agricoop.punjab.gov.in');
INSERT INTO ngo_schemes VALUES(16,'Crop Diversification Programme','Punjab Agriculture Department','2026-12-31','Punjab','0172-2970000',3,'active','Financial incentive for shifting from rice to maize, pulses, oilseeds. ???1500/acre support.','Punjab farmers. Incentive for water conservation through crop diversification.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','Punjab',NULL,NULL,'ALL',NULL,NULL,'https://agricoop.punjab.gov.in');
INSERT INTO ngo_schemes VALUES(17,'Canal Water Improvement Scheme','Punjab Irrigation Department','2026-12-31','Punjab','0172-2740100',2,'active','Improved canal water supply and distribution for better irrigation','All Punjab farmers in canal-irrigated areas.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','Punjab',NULL,NULL,'ALL',NULL,NULL,'https://waterresources.punjab.gov.in');
INSERT INTO ngo_schemes VALUES(18,'Bhai Ghanhya Sehat Sewa','Punjab Health Department','2026-12-31','Punjab','104',3,'active','Free health insurance up to ???5 lakh for farmers and rural families','Punjab residents. Primarily benefits farmer families.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','Punjab',NULL,NULL,'ALL',NULL,NULL,'https://health.punjab.gov.in');
INSERT INTO ngo_schemes VALUES(19,'Agriculture Debt Waiver','Punjab Finance Department','2024-12-31','Punjab','0172-2740100',5,'closed','Loan waiver for small and marginal farmers (past scheme)','Small and marginal farmers with land up to 2 hectares.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','Punjab',NULL,2.0,'ALL',NULL,NULL,'https://punjab.gov.in');
INSERT INTO ngo_schemes VALUES(20,'Seed Village Programme','Punjab Agriculture Department','2026-12-31','Punjab','0172-2970000',3,'active','High quality certified seeds for wheat, paddy, pulses. Village-level seed production.','Punjab farmers in selected seed villages.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','Punjab',NULL,NULL,'ALL',NULL,NULL,'https://agricoop.punjab.gov.in');
INSERT INTO ngo_schemes VALUES(21,'Organic Farming Promotion','Punjab Agriculture Department','2026-12-31','Punjab','0172-2970000',4,'active','Subsidy for organic farming conversion, certification support. ???20,000/hectare support.','Punjab farmers willing to adopt organic farming.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','Punjab',NULL,NULL,'ALL',NULL,NULL,'https://agricoop.punjab.gov.in');
INSERT INTO ngo_schemes VALUES(22,'Custom Hiring Centers','Punjab Agriculture Department','2026-12-31','Punjab','0172-2970000',3,'active','Farmers can rent machinery (tractors, harvesters, etc.) at subsidized rates','All Punjab farmers. No land size restriction.','2025-12-02 02:52:29','2025-12-02 02:52:29','government','Punjab',NULL,NULL,'ALL',NULL,NULL,'https://agricoop.punjab.gov.in');
CREATE TABLE soil_lab (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT,
  contact_number TEXT,
  price REAL,
  rating REAL,
  tag TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);
INSERT INTO soil_lab VALUES(1,'Punjab Soil Testing Lab','Chandigarh','+91-172-2700100',250.0,4.5,'Government Certified','2025-11-30 12:38:39','2025-11-30 12:38:39');
INSERT INTO soil_lab VALUES(2,'AgriTech Soil Analysis Center','Delhi','+91-11-26701234',350.0,4.799999999999999823,'Fast Service','2025-11-30 12:38:43','2025-11-30 12:38:43');
CREATE TABLE crop_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  crop_name TEXT NOT NULL,
  crop_price REAL,
  selling_price REAL,
  crop_produced_kg REAL,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO crop_history VALUES(1,1,'Wheat',20.0,25.0,2500.0,'2025-11-30 13:21:17','2025-11-30 13:21:17');
INSERT INTO crop_history VALUES(2,1,'Rice',30.0,38.0,3000.0,'2025-11-30 13:21:20','2025-11-30 13:21:20');
INSERT INTO crop_history VALUES(3,3,'Test Wheat',1500.0,1800.0,2500.0,'2025-11-30 14:12:48','2025-11-30 14:12:48');
INSERT INTO crop_history VALUES(4,1,'Rice',8273.0,4736.0,9475.0,'2025-11-30 14:20:16','2025-11-30 14:20:16');
INSERT INTO crop_history VALUES(5,2,'wheat',45.0,72.0,28.0,'2025-11-30 14:41:25','2025-11-30 14:41:25');
INSERT INTO crop_history VALUES(6,1,'Rice',1500.0,2000.0,2500.0,'2025-12-02 11:12:52','2025-12-02 11:12:52');
CREATE TABLE iot_reading (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,                     -- foreign key reference to users.id
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  location TEXT,                                -- free text location (GPS coords or address)
  state TEXT,
  district TEXT,
  preferred_visit_date TEXT,                    -- ISO date string (YYYY-MM-DD)
  status TEXT DEFAULT 'pending',                -- status: pending / acknowledged / completed / cancelled
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO iot_reading VALUES(1,1,'Devanshu Singh','09969484767','','Maharashtra','thane','2025-12-02','active','2025-12-02 15:13:43','2025-12-03 17:17:50');
INSERT INTO iot_reading VALUES(2,2,'vishesh savani','1234567890','','Maharashtra','thane','2025-12-03','pending','2025-12-03 17:25:14','2025-12-03 17:25:14');
CREATE TABLE iot_status (
  user_id INTEGER PRIMARY KEY,                  -- user id (same as users.id)
  status TEXT NOT NULL DEFAULT 'inactive',      -- allowed values: 'inactive', 'active', 'booked'
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
INSERT INTO iot_status VALUES(1,'active','2025-12-03 18:15:02');
INSERT INTO iot_status VALUES(2,'inactive','2025-12-02 15:15:16');
INSERT INTO iot_status VALUES(3,'inactive','2025-12-04 05:47:47');
INSERT INTO iot_status VALUES(6,'inactive','2025-12-04 05:15:36');
CREATE TABLE experts_info (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, experience_years INTEGER NOT NULL DEFAULT 0, specializations TEXT, rating REAL DEFAULT 0.0, consultation_count INTEGER DEFAULT 0, phone_number TEXT, created_at TEXT DEFAULT (datetime('now')), updated_at TEXT DEFAULT (datetime('now')));
INSERT INTO experts_info VALUES(1,'Test Expert',5,'[]',4.5,100,'1234567890','2025-12-03 14:29:09','2025-12-03 14:29:09');
INSERT INTO experts_info VALUES(2,'Dr. Meera Joshi',12,'["Crop Diseases","Pest Management"]',4.900000000000000355,1200,'+91-9876500011','2025-12-03 14:30:22','2025-12-03 14:30:22');
INSERT INTO experts_info VALUES(3,'Rahul Deshmukh',8,'["Soil Health","Organic Farming"]',4.700000000000000177,900,'+91-9876500012','2025-12-03 14:30:22','2025-12-03 14:30:22');
INSERT INTO experts_info VALUES(4,'Dr. Kavita Sharma',15,'["Agri-Economics","Market Trends"]',4.799999999999999823,1500,'+91-9876500013','2025-12-03 14:30:22','2025-12-03 14:30:22');
INSERT INTO experts_info VALUES(5,'Vikram Patil',6,'["Irrigation Systems","Water Management"]',4.599999999999999644,700,'+91-9876500014','2025-12-03 14:30:22','2025-12-03 14:30:22');
INSERT INTO experts_info VALUES(6,'Dr. Neha Kulkarni',10,'["Plant Nutrition","Fertilizers"]',4.900000000000000355,1100,'+91-9876500015','2025-12-03 14:30:22','2025-12-03 14:30:22');
INSERT INTO experts_info VALUES(7,'Aman Singh',5,'["Pest Management","Crop Diseases"]',4.400000000000000356,450,'+91-9876500016','2025-12-03 14:30:22','2025-12-03 14:30:22');
CREATE TABLE farmer_forum (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT NOT NULL, highlighted_keywords TEXT, community TEXT NOT NULL, answer TEXT NOT NULL, expert_name TEXT NOT NULL, expert_role TEXT NOT NULL, upvotes INTEGER DEFAULT 0, replies INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP);
INSERT INTO farmer_forum VALUES(1,'What is the best fertilizer for wheat crop during winter season?','fertilizer, wheat, winter','Fertilizers','For wheat during winter, use NPK fertilizer (Nitrogen-Phosphorus-Potassium) in a 120:60:40 kg/ha ratio. Apply urea at tillering stage and top-dress with potassium. Ensure soil testing before application for best results.','Dr. Ramesh Sharma','Expert',12,3,'2025-11-30T15:22:03.309Z');
INSERT INTO farmer_forum VALUES(2,'How to identify and control early blight disease in tomatoes?','early blight, disease, tomatoes','Disease & Pests','Early blight shows dark brown spots with concentric rings on lower leaves. Control: Remove infected leaves, spray copper oxychloride 50% WP @ 3g/liter or Mancozeb 75% WP @ 2.5g/liter every 7-10 days. Ensure proper spacing and avoid overhead irrigation.','Agriculture Officer Priya Singh','Verified',24,5,'2025-11-28T15:22:03.309Z');
INSERT INTO farmer_forum VALUES(3,'What are the current market rates for basmati rice in Delhi?','market rates, basmati rice, Delhi','Market','Current basmati rice rates in Delhi APMC: Pusa Basmati Γé╣3,800-4,200/quintal, 1121 Basmati Γé╣4,500-5,000/quintal. Prices vary by quality grade. Check daily rates on eNAM portal for real-time updates.','Market Analyst Suresh Kumar','Expert',8,2,'2025-12-02T15:22:03.309Z');
INSERT INTO farmer_forum VALUES(4,'How can I improve soil pH level for potato cultivation?','soil pH, potato, cultivation','Soil','Potatoes prefer slightly acidic soil (pH 5.5-6.5). To lower pH: Add sulfur @ 200-300 kg/ha or organic compost. To raise pH: Apply lime @ 2-3 tons/ha. Test soil 3 months before planting. Split application is recommended for better results.','Soil Scientist Dr. Anjali Verma','Verified',15,4,'2025-11-26T15:22:03.309Z');
INSERT INTO farmer_forum VALUES(5,'Which crops are most suitable for drip irrigation in semi-arid regions?','drip irrigation, semi-arid, crops','Crop','Best crops for drip irrigation in semi-arid areas: Pomegranate, grapes, cotton, vegetables (tomato, capsicum, cucumber), and sugarcane. Drip irrigation saves 30-50% water and increases yield by 20-40%. Government subsidies available under PMKSY scheme.','Irrigation Expert Vikram Patel','Expert',18,6,'2025-11-23T15:22:03.309Z');
CREATE TABLE forum_posts (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, category TEXT NOT NULL, question TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')), community TEXT, status TEXT DEFAULT 'Answered', extracted_keywords TEXT, upvotes INTEGER DEFAULT 0, reply_count INTEGER DEFAULT 0, FOREIGN KEY (user_id) REFERENCES users(id));
INSERT INTO forum_posts VALUES(1,1,'Market','What are the suggestions about selling tomatoes in the next two days?','2025-02-01 10:00:00','Market','Answered','tomatoes,market,price,selling,two days',4,1);
INSERT INTO forum_posts VALUES(2,2,'Disease & Pests','How can I control early blight disease in tomatoes?','2025-02-01 09:00:00','Disease & Pests','Answered','tomatoes,early blight,fungus,disease,control',10,1);
INSERT INTO forum_posts VALUES(3,3,'Soil','My soil organic carbon is low. What should I add to improve it?','2025-01-31 18:30:00','Soil','Answered','soil,organic carbon,FYM,compost,improve',7,1);
INSERT INTO forum_posts VALUES(4,4,'Weather','Heavy rain is forecast this week. How do I protect my standing paddy crop?','2025-01-31 15:20:00','Weather','Answered','paddy,heavy rain,flooding,protection,drainage',6,2);
INSERT INTO forum_posts VALUES(5,5,'Fertilizers','What is the recommended urea and DAP dose for wheat per acre?','2025-01-30 11:45:00','Fertilizers','Answered','wheat,urea,DAP,fertilizer dose,acre',8,1);
INSERT INTO forum_posts VALUES(6,6,'Crop','Which crop is best to grow in rabi season in Maharashtra with less water?','2025-01-29 17:10:00','Crop','Answered','rabi,maharashtra,less water,chickpea,gram',5,1);
INSERT INTO forum_posts VALUES(7,7,'General Queries','How can I get subsidy information for drip irrigation?','2025-01-28 14:00:00','General Queries','Answered','subsidy,drip irrigation,government scheme',3,1);
INSERT INTO forum_posts VALUES(8,8,'Disease & Pests','My cotton crop has whitefly infestation. What should I spray?','2025-01-27 08:30:00','Disease & Pests','Answered','cotton,whitefly,insecticide,spray,infestation',9,1);
INSERT INTO forum_posts VALUES(9,9,'Market','Will onion prices increase next month according to current trend?','2025-01-26 12:10:00','Market','Answered','onion,price,increase,market trend,next month',6,1);
INSERT INTO forum_posts VALUES(10,10,'Soil','Is it safe to use saline borewell water for irrigation in my farm?','2025-01-25 16:55:00','Soil','Answered','saline water,EC,irrigation,safe,soil health',4,1);
INSERT INTO forum_posts VALUES(11,1,'Crop','what are the current market rates for wheat in punjab?','2025-12-03 15:27:24','Crop','Unanswered','market, wheat, heat',0,0);
INSERT INTO forum_posts VALUES(12,1,'Weather','what is the weather in punjab ','2025-12-03 15:28:01','Weather','Unanswered','weather, punjab',0,1);
INSERT INTO forum_posts VALUES(13,1,'General Queries','How to use IoT, I have just installed it in my farm','2025-12-03 19:28:30','General Queries','Answered','installed, use, iot',0,3);
CREATE TABLE forum_replies (id INTEGER PRIMARY KEY AUTOINCREMENT, post_id INTEGER NOT NULL, reply_text TEXT NOT NULL, replied_by TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')), upvotes INTEGER DEFAULT 0, FOREIGN KEY (post_id) REFERENCES forum_posts(id));
INSERT INTO forum_replies VALUES(1,1,'Market is expected to stay stable for the next two days. Focus on grading and selling only ripe tomatoes. Avoid distress selling at night and check nearby APMC rates before finalizing.','Expert Advisor ΓÇô Market','2025-02-01 11:00:00',3);
INSERT INTO forum_replies VALUES(2,2,'For early blight in tomatoes, spray a fungicide containing Mancozeb or Chlorothalonil at 10ΓÇô15 day intervals. Remove and destroy heavily infected leaves and avoid overhead irrigation.','Agriculture Officer ΓÇô Plant Protection','2025-02-01 10:00:00',7);
INSERT INTO forum_replies VALUES(3,3,'To improve soil organic carbon, regularly add well decomposed FYM or compost (2ΓÇô3 tons/acre) and practice crop rotation with legumes. Reduce excessive tillage.','Soil Scientist','2025-01-31 19:00:00',5);
INSERT INTO forum_replies VALUES(4,4,'For heavy rain forecast, clean field drains, make side channels to remove standing water quickly and strengthen bunds around paddy fields. Avoid applying urea just before the rain.','Senior Farmer Mentor','2025-01-31 16:00:00',4);
INSERT INTO forum_replies VALUES(5,4,'If waterlogging risk is very high, consider opening gaps in bunds at one side to drain excess water. Keep seedlings anchored by light earthing up.','Agriculture Officer ΓÇô Irrigation','2025-01-31 16:30:00',3);
INSERT INTO forum_replies VALUES(6,5,'For wheat, a common recommendation is around 40ΓÇô50 kg urea and 25ΓÇô30 kg DAP per acre, applied in split doses depending on soil test. Always follow local soil test based recommendation.','Fertilizer Consultant','2025-01-30 12:30:00',6);
INSERT INTO forum_replies VALUES(7,6,'In low water conditions in Maharashtra rabi season, chickpea (gram) or lentil are good options. They require less irrigation compared to wheat or vegetables.','Crop Planning Expert','2025-01-29 18:00:00',4);
INSERT INTO forum_replies VALUES(8,7,'For drip irrigation subsidy, visit your local agriculture department office or MAHA DBT portal. Keep land ownership documents, Aadhar and bank details ready.','Government Scheme Advisor','2025-01-28 15:00:00',2);
INSERT INTO forum_replies VALUES(9,8,'For whitefly in cotton, use yellow sticky traps and spray recommended insecticides like Buprofezin or Imidacloprid as per label dose. Do not overuse one molecule to avoid resistance.','Plant Protection Expert','2025-01-27 09:30:00',8);
INSERT INTO forum_replies VALUES(10,9,'Onion prices may rise if arrivals decrease due to storage losses or export demand. Keep some stock in ventilated storage but avoid hoarding beyond your capacity.','Market Analyst','2025-01-26 13:00:00',5);
INSERT INTO forum_replies VALUES(11,10,'Saline water with very high EC is not safe. Get a water test done. If EC is borderline, you can use it with gypsum application and good drainage, but avoid for sensitive crops.','Soil & Water Scientist','2025-01-25 17:30:00',3);
INSERT INTO forum_replies VALUES(12,12,'good','Devanshu Singh','2025-12-03 18:51:12',0);
INSERT INTO forum_replies VALUES(13,13,'For general agricultural queries and government schemes, visit your local agriculture department office or Krishi Vigyan Kendra (KVK). They provide free advisory services, training programs, and information about subsidies. You can also call the Kisan Call Centre at 1800-180-1551 for expert advice.','FarmIQ Expert Advisor','2025-12-03 19:28:30',0);
INSERT INTO forum_replies VALUES(14,13,'you will get live readings in that page every 20 seconds','Vishesh ','2025-12-03 19:29:08',0);
INSERT INTO forum_replies VALUES(15,13,'Okay, got it','Devanshu Singh','2025-12-03 19:29:22',0);
DELETE FROM sqlite_sequence;
INSERT INTO sqlite_sequence VALUES('users',7);
INSERT INTO sqlite_sequence VALUES('ngo_schemes',22);
INSERT INTO sqlite_sequence VALUES('soil_lab',2);
INSERT INTO sqlite_sequence VALUES('crop_history',6);
INSERT INTO sqlite_sequence VALUES('iot_reading',2);
INSERT INTO sqlite_sequence VALUES('experts_info',7);
INSERT INTO sqlite_sequence VALUES('farmer_forum',5);
INSERT INTO sqlite_sequence VALUES('forum_posts',13);
INSERT INTO sqlite_sequence VALUES('forum_replies',15);
CREATE INDEX idx_users_email 
        ON users (email)
      ;
CREATE INDEX idx_ngo_name ON ngo_schemes(name);
CREATE INDEX idx_ngo_status ON ngo_schemes(status);
CREATE INDEX idx_soil_name ON soil_lab(name);
CREATE INDEX idx_soil_location ON soil_lab(location);
CREATE INDEX idx_crop_history_user ON crop_history(user_id);
CREATE INDEX idx_ngo_scheme_type ON ngo_schemes(scheme_type);
CREATE INDEX idx_ngo_required_state ON ngo_schemes(required_state);
CREATE INDEX idx_iot_reading_user_id ON iot_reading(user_id);
COMMIT;
