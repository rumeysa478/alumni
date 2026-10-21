-- ============================================================================
-- Migration: 003_create_or_update_applications_table.sql
-- Description: Create or update applications action table based on ddd.md (Section 3.5)
-- Author: Rumeysa Aydın
-- ============================================================================

-- 1. APPLICATIONS AKSİYON TABLOSUNUN OLUŞTURULMASI (N:M ACTION TABLE)
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    expected_salary NUMERIC(12, 2),
    status VARCHAR(50) DEFAULT 'PENDING',
    notes TEXT,
    rejection_reason TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_job_user_application UNIQUE (job_id, user_id)
);

-- 2. MEVCUT TABLO İÇİN SÜTUNLARIN GÜVENLİ EKLENMESİ (IDEMPOTENT ALTER)
ALTER TABLE applications
    ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(255),
    ADD COLUMN IF NOT EXISTS expected_salary NUMERIC(12, 2),
    ADD COLUMN IF NOT EXISTS notes TEXT,
    ADD COLUMN IF NOT EXISTS rejection_reason TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- 3. KONTROL KISITLARININ (CHECK CONSTRAINTS) TANIMLANMASI
ALTER TABLE applications DROP CONSTRAINT IF EXISTS chk_application_expected_salary;
ALTER TABLE applications 
    ADD CONSTRAINT chk_application_expected_salary 
    CHECK (expected_salary IS NULL OR expected_salary >= 0);

ALTER TABLE applications DROP CONSTRAINT IF EXISTS chk_application_status;
ALTER TABLE applications 
    ADD CONSTRAINT chk_application_status 
    CHECK (status IN ('PENDING', 'REVIEWING', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'));

-- 4. ESKİ job_applications TABLOSUNDAKİ VERİLERİN GÖÇÜ (DATA MIGRATION)
DO $$
BEGIN
    IF EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'job_applications'
    ) THEN
        INSERT INTO applications (job_id, user_id, cover_letter, resume_url, status, applied_at, updated_at)
        SELECT 
            job_id, 
            user_id, 
            cover_letter, 
            resume_url, 
            CASE 
                WHEN status = 'REVIEWED' THEN 'REVIEWING'
                WHEN status IN ('PENDING', 'REVIEWING', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') THEN status
                ELSE 'PENDING'
            END,
            applied_at, 
            applied_at
        FROM job_applications
        ON CONFLICT (job_id, user_id) DO NOTHING;
    END IF;
END $$;

-- 5. B-TREE PERFORMANS İNDEKSLERİNİN OLUŞTURULMASI
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON applications(applied_at);
