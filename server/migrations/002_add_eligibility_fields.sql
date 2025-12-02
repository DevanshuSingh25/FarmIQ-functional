-- Migration to add eligibility fields to ngo_schemes table and insert government schemes

PRAGMA foreign_keys = OFF;
BEGIN TRANSACTION;

-- Add new eligibility fields to ngo_schemes table
ALTER TABLE ngo_schemes ADD COLUMN scheme_type TEXT DEFAULT 'government';
ALTER TABLE ngo_schemes ADD COLUMN required_state TEXT;
ALTER TABLE ngo_schemes ADD COLUMN min_land REAL;
ALTER TABLE ngo_schemes ADD COLUMN max_land REAL;
ALTER TABLE ngo_schemes ADD COLUMN required_category TEXT;
ALTER TABLE ngo_schemes ADD COLUMN age_min INTEGER;
ALTER TABLE ngo_schemes ADD COLUMN age_max INTEGER;
ALTER TABLE ngo_schemes ADD COLUMN official_link TEXT;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_ngo_scheme_type ON ngo_schemes(scheme_type);
CREATE INDEX IF NOT EXISTS idx_ngo_required_state ON ngo_schemes(required_state);

-- ========== INSERT 10 CENTRAL GOVERNMENT SCHEMES ==========

-- 1. PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'PM-KISAN',
  'Ministry of Agriculture & Farmers Welfare',
  '2026-12-31',
  'All India',
  '1800-180-1551',
  3,
  'active',
  'Direct income support of ₹6000/year in 3 equal installments to all landholding farmer families',
  'Must own cultivable land. No minimum or maximum land requirement.',
  'government',
  'ALL',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://pmkisan.gov.in'
);

-- 2. PMFBY (Pradhan Mantri Fasal Bima Yojana)
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'PMFBY - Crop Insurance',
  'Ministry of Agriculture & Farmers Welfare',
  '2026-12-31',
  'All India',
  '1800-180-1551',
  4,
  'active',
  'Comprehensive crop insurance against natural calamities, pests and diseases',
  'Open to all farmers growing notified crops in notified areas. Age 18+',
  'government',
  'ALL',
  NULL,
  NULL,
  'ALL',
  18,
  NULL,
  'https://pmfby.gov.in'
);

-- 3. PM-KMY (Pradhan Mantri Kisan Maandhan Yojana)
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'PM-KMY Pension Scheme',
  'Ministry of Agriculture & Farmers Welfare',
  '2026-12-31',
  'All India',
  '1800-180-1551',
  4,
  'active',
  'Assured monthly pension of ₹3000 after attaining age of 60 years',
  'Small and marginal farmers (up to 2 hectares). Entry age 18-40 years.',
  'government',
  'ALL',
  NULL,
  2.0,
  'ALL',
  18,
  40,
  'https://maandhan.in'
);

-- 4. PMKSY (Pradhan Mantri Krishi Sinchai Yojana)
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'PMKSY - Irrigation Support',
  'Ministry of Jal Shakti',
  '2026-12-31',
  'All India',
  '1800-180-6790',
  3,
  'active',
  'Subsidy for micro-irrigation systems (drip, sprinkler). Water conservation support.',
  'All farmers with irrigation needs. Priority to water-stressed areas.',
  'government',
  'ALL',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://pmksy.gov.in'
);

-- 5. Soil Health Card Scheme
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Soil Health Card Scheme',
  'Ministry of Agriculture & Farmers Welfare',
  '2026-12-31',
  'All India',
  '1800-180-1551',
  2,
  'active',
  'Free soil testing and customized fertilizer recommendations for optimal crop health',
  'All farmers. No land size restriction.',
  'government',
  'ALL',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://soilhealth.dac.gov.in'
);

-- 6. SMAM (Sub-Mission on Agricultural Mechanization)
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'SMAM - Machinery Subsidy',
  'Ministry of Agriculture & Farmers Welfare',
  '2026-12-31',
  'All India',
  '1800-180-1551',
  5,
  'active',
  'Subsidy on tractors, harvesters and farm implements. 40-50% for SC/ST/Small farmers.',
  'All farmers. Higher subsidy for SC/ST and small/marginal farmers.',
  'government',
  'ALL',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://agrimachinery.nic.in'
);

-- 7. PKVY (Paramparagat Krishi Vikas Yojana - Organic Farming)
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'PKVY - Organic Farming',
  'Ministry of Agriculture & Farmers Welfare',
  '2026-12-31',
  'All India',
  '1800-180-1551',
  4,
  'active',
  'Financial assistance of ₹50,000/hectare for organic farming adoption. Cluster-based approach.',
  'Farmers willing to adopt organic farming. Cluster formation required (min 20 farmers).',
  'government',
  'ALL',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://pgsindia-ncof.gov.in'
);

-- 8. AIF (Agri Infrastructure Fund)
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Agriculture Infrastructure Fund',
  'Ministry of Agriculture & Farmers Welfare',
  '2026-12-31',
  'All India',
  '1800-180-1551',
  6,
  'active',
  'Low-interest loans (3% interest subvention) for post-harvest storage, processing infrastructure',
  'Farmers, FPOs, Agri-entrepreneurs. For building storage, warehouses, cold chains.',
  'government',
  'ALL',
  NULL,
  NULL,
  'ALL',
  18,
  NULL,
  'https://agriinfra.dac.gov.in'
);

-- 9. KCC (Kisan Credit Card)
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Kisan Credit Card',
  'Ministry of Agriculture & Farmers Welfare',
  '2026-12-31',
  'All India',
  '1800-180-1551',
  5,
  'active',
  'Low-interest credit (7% interest, 4% with timely repayment) for crop production and allied activities',
  'All farmers owning land. Age 18-75 years.',
  'government',
  'ALL',
  NULL,
  NULL,
  'ALL',
  18,
  75,
  'https://pmkisan.gov.in/kcc.aspx'
);

-- 10. National Mission on Oilseeds & Oil Palm
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Oilseeds & Oil Palm Mission',
  'Ministry of Agriculture & Farmers Welfare',
  '2026-12-31',
  'Participating States',
  '1800-180-1551',
  4,
  'active',
  'Financial assistance for oil palm cultivation, oilseeds production. ₹12,000/hectare assistance.',
  'Farmers with land suitable for oilseeds/oil palm cultivation.',
  'government',
  'ALL',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://nmoop.gov.in'
);

-- ========== INSERT 10 PUNJAB STATE SCHEMES ==========

-- 1. Punjab Free Power to Farmers
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Punjab Free Power Scheme',
  'Punjab State Power Corporation Limited',
  '2026-12-31',
  'Punjab',
  '1912',
  3,
  'active',
  'Free electricity for agricultural tube-wells and pumps',
  'All farmers in Punjab with agricultural connections.',
  'government',
  'Punjab',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://pspcl.in'
);

-- 2. Punjab Super Seeder Subsidy Scheme
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Super Seeder Subsidy (Punjab)',
  'Punjab Agriculture Department',
  '2026-12-31',
  'Punjab',
  '0172-2970000',
  4,
  'active',
  'Subsidy of 50-80% on super seeder machines for stubble management',
  'Punjab farmers. For wheat sowing without stubble burning.',
  'government',
  'Punjab',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://agricoop.punjab.gov.in'
);

-- 3. Punjab Happy Seeder Scheme
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Happy Seeder Scheme (Punjab)',
  'Punjab Agriculture Department',
  '2026-12-31',
  'Punjab',
  '0172-2970000',
  4,
  'active',
  'Subsidy on happy seeder machines for eco-friendly wheat sowing',
  'Punjab farmers cultivating wheat. Helps reduce air pollution.',
  'government',
  'Punjab',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://agricoop.punjab.gov.in'
);

-- 4. Punjab Crop Diversification Programme
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Crop Diversification Programme',
  'Punjab Agriculture Department',
  '2026-12-31',
  'Punjab',
  '0172-2970000',
  3,
  'active',
  'Financial incentive for shifting from rice to maize, pulses, oilseeds. ₹1500/acre support.',
  'Punjab farmers. Incentive for water conservation through crop diversification.',
  'government',
  'Punjab',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://agricoop.punjab.gov.in'
);

-- 5. Punjab Canal Water Improvement Scheme
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Canal Water Improvement Scheme',
  'Punjab Irrigation Department',
  '2026-12-31',
  'Punjab',
  '0172-2740100',
  2,
  'active',
  'Improved canal water supply and distribution for better irrigation',
  'All Punjab farmers in canal-irrigated areas.',
  'government',
  'Punjab',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://waterresources.punjab.gov.in'
);

-- 6. Bhai Ghanhya Sehat Sewa Scheme
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Bhai Ghanhya Sehat Sewa',
  'Punjab Health Department',
  '2026-12-31',
  'Punjab',
  '104',
  3,
  'active',
  'Free health insurance up to ₹5 lakh for farmers and rural families',
  'Punjab residents. Primarily benefits farmer families.',
  'government',
  'Punjab',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://health.punjab.gov.in'
);

-- 7. Punjab Agriculture Debt Waiver (Completed scheme for reference)
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Agriculture Debt Waiver',
  'Punjab Finance Department',
  '2024-12-31',
  'Punjab',
  '0172-2740100',
  5,
  'closed',
  'Loan waiver for small and marginal farmers (past scheme)',
  'Small and marginal farmers with land up to 2 hectares.',
  'government',
  'Punjab',
  NULL,
  2.0,
  'ALL',
  NULL,
  NULL,
  'https://punjab.gov.in'
);

-- 8. Seed Village Programme (Punjab)
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Seed Village Programme',
  'Punjab Agriculture Department',
  '2026-12-31',
  'Punjab',
  '0172-2970000',
  3,
  'active',
  'High quality certified seeds for wheat, paddy, pulses. Village-level seed production.',
  'Punjab farmers in selected seed villages.',
  'government',
  'Punjab',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://agricoop.punjab.gov.in'
);

-- 9. Organic Farming Promotion (Punjab)
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Organic Farming Promotion',
  'Punjab Agriculture Department',
  '2026-12-31',
  'Punjab',
  '0172-2970000',
  4,
  'active',
  'Subsidy for organic farming conversion, certification support. ₹20,000/hectare support.',
  'Punjab farmers willing to adopt organic farming.',
  'government',
  'Punjab',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://agricoop.punjab.gov.in'
);

-- 10. Custom Hiring Centers Scheme
INSERT INTO ngo_schemes (
  name, ministry, deadline, location, contact_number, no_of_docs_required,
  status, benefit_text, eligibility_text, scheme_type, required_state,
  min_land, max_land, required_category, age_min, age_max, official_link
) VALUES (
  'Custom Hiring Centers',
  'Punjab Agriculture Department',
  '2026-12-31',
  'Punjab',
  '0172-2970000',
  3,
  'active',
  'Farmers can rent machinery (tractors, harvesters, etc.) at subsidized rates',
  'All Punjab farmers. No land size restriction.',
  'government',
  'Punjab',
  NULL,
  NULL,
  'ALL',
  NULL,
  NULL,
  'https://agricoop.punjab.gov.in'
);

COMMIT;
PRAGMA foreign_keys = ON;
