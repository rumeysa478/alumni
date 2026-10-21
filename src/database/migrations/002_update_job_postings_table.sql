-- ============================================================================
-- Migration: 002_update_job_postings_table.sql
-- Description: Modernize job_postings table schema based on ddd.md (Section 3.4)
-- Author: Rumeysa Aydın
-- ============================================================================

-- 1. YENİ SÜTUNLARIN GÜVENLİ ŞEKİLDE EKLENMESİ
ALTER TABLE job_postings 
    ADD COLUMN IF NOT EXISTS requirements TEXT,
    ADD COLUMN IF NOT EXISTS work_model VARCHAR(50) DEFAULT 'HYBRID',
    ADD COLUMN IF NOT EXISTS experience_level VARCHAR(50) DEFAULT 'MID',
    ADD COLUMN IF NOT EXISTS sector VARCHAR(100),
    ADD COLUMN IF NOT EXISTS salary_min NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS salary_max NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'TRY',
    ADD COLUMN IF NOT EXISTS application_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS contact_email VARCHAR(255),
    ADD COLUMN IF NOT EXISTS view_count INT DEFAULT 0;

-- 2. KONTROL KISITLARININ (CHECK CONSTRAINTS) GÜNCELLENMESİ VE EKLENMESİ
ALTER TABLE job_postings DROP CONSTRAINT IF EXISTS job_postings_type_check;
ALTER TABLE job_postings DROP CONSTRAINT IF EXISTS chk_job_type;
ALTER TABLE job_postings 
    ADD CONSTRAINT chk_job_type 
    CHECK (type IN ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE', 'REMOTE'));

ALTER TABLE job_postings DROP CONSTRAINT IF EXISTS chk_job_work_model;
ALTER TABLE job_postings 
    ADD CONSTRAINT chk_job_work_model 
    CHECK (work_model IN ('ONSITE', 'HYBRID', 'REMOTE'));

ALTER TABLE job_postings DROP CONSTRAINT IF EXISTS chk_job_experience_level;
ALTER TABLE job_postings 
    ADD CONSTRAINT chk_job_experience_level 
    CHECK (experience_level IN ('INTERN', 'ENTRY_LEVEL', 'JUNIOR', 'MID', 'SENIOR', 'LEAD'));

ALTER TABLE job_postings DROP CONSTRAINT IF EXISTS chk_job_salary_range;
ALTER TABLE job_postings 
    ADD CONSTRAINT chk_job_salary_range 
    CHECK (
        (salary_min IS NULL OR salary_min >= 0) AND 
        (salary_max IS NULL OR salary_max >= 0) AND 
        (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max)
    );

ALTER TABLE job_postings DROP CONSTRAINT IF EXISTS chk_job_view_count;
ALTER TABLE job_postings 
    ADD CONSTRAINT chk_job_view_count 
    CHECK (view_count >= 0);

-- 3. PERFORMANS İNDEKSLERİNİN OLUŞTURULMASI (B-TREE)
CREATE INDEX IF NOT EXISTS idx_job_postings_work_model ON job_postings(work_model);
CREATE INDEX IF NOT EXISTS idx_job_postings_experience_level ON job_postings(experience_level);
CREATE INDEX IF NOT EXISTS idx_job_postings_sector ON job_postings(sector);
CREATE INDEX IF NOT EXISTS idx_job_postings_is_active ON job_postings(is_active);
CREATE INDEX IF NOT EXISTS idx_job_postings_deadline ON job_postings(deadline);
