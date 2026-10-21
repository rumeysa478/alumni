-- Alumni Tracking System (Mezun Takip Sistemi)
-- PostgreSQL Database Initialization Schema & Seed Data

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ALUMNI' CHECK (role IN ('STUDENT', 'ALUMNI', 'ADMIN')),
    department VARCHAR(150),
    graduation_year INT CHECK (graduation_year >= 1950 AND graduation_year <= 2100),
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ALUMNI PROFILES TABLE (1:1 with users)
CREATE TABLE IF NOT EXISTS alumni_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_company VARCHAR(150),
    current_title VARCHAR(150),
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Türkiye',
    bio TEXT,
    linkedin_url VARCHAR(255),
    github_url VARCHAR(255),
    phone VARCHAR(30),
    resume_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'GENERAL' CHECK (category IN ('EVENT', 'CAREER', 'ACADEMIC', 'GENERAL')),
    author VARCHAR(100) NOT NULL DEFAULT 'Sistem Yöneticisi',
    target_audience VARCHAR(20) NOT NULL DEFAULT 'ALL' CHECK (target_audience IN ('ALL', 'ALUMNI', 'STUDENT')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. JOB POSTINGS TABLE
CREATE TABLE IF NOT EXISTS job_postings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    company VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT,
    location VARCHAR(100),
    work_model VARCHAR(50) DEFAULT 'HYBRID' CHECK (work_model IN ('ONSITE', 'HYBRID', 'REMOTE')),
    type VARCHAR(50) DEFAULT 'FULL_TIME' CHECK (type IN ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT', 'FREELANCE')),
    experience_level VARCHAR(50) DEFAULT 'MID' CHECK (experience_level IN ('INTERN', 'ENTRY_LEVEL', 'JUNIOR', 'MID', 'SENIOR', 'LEAD')),
    sector VARCHAR(100),
    salary_min NUMERIC(12, 2) CHECK (salary_min >= 0),
    salary_max NUMERIC(12, 2) CHECK (salary_max >= 0),
    currency VARCHAR(10) DEFAULT 'TRY',
    application_url VARCHAR(255),
    contact_email VARCHAR(255),
    deadline TIMESTAMP WITH TIME ZONE,
    posted_by INT REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    view_count INT DEFAULT 0 CHECK (view_count >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_job_salary_range CHECK (salary_min IS NULL OR salary_max IS NULL OR salary_min <= salary_max)
);

-- 6. APPLICATIONS TABLE (N:M Action Table between users and job_postings)
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url VARCHAR(255),
    portfolio_url VARCHAR(255),
    expected_salary NUMERIC(12, 2) CHECK (expected_salary >= 0),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWING', 'INTERVIEW', 'OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')),
    notes TEXT,
    rejection_reason TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_job_user_application UNIQUE (job_id, user_id)
);

-- Legacy compatibility table for job_applications
CREATE TABLE IF NOT EXISTS job_applications (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_legacy_job_user_application UNIQUE (job_id, user_id)
);

-- 7. EVENTS TABLE
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    event_date TIMESTAMP WITH TIME ZONE NOT NULL,
    location VARCHAR(200),
    capacity INT DEFAULT 100,
    created_by INT REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. EVENT ATTENDEES TABLE (N:M bridge between users and events)
CREATE TABLE IF NOT EXISTS event_attendees (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) DEFAULT 'REGISTERED' CHECK (status IN ('REGISTERED', 'ATTENDED', 'CANCELLED')),
    CONSTRAINT unique_event_user_attendee UNIQUE (event_id, user_id)
);

-- 9. MENTORSHIPS TABLE
CREATE TABLE IF NOT EXISTS mentorships (
    id SERIAL PRIMARY KEY,
    mentor_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mentee_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'REQUESTED' CHECK (status IN ('REQUESTED', 'ACTIVE', 'COMPLETED', 'DECLINED')),
    notes TEXT,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_mentor_not_mentee CHECK (mentor_id <> mentee_id)
);

-- 10. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_graduation_year ON users(graduation_year);

CREATE INDEX IF NOT EXISTS idx_announcements_category ON announcements(category);
CREATE INDEX IF NOT EXISTS idx_announcements_is_active ON announcements(is_active);

CREATE INDEX IF NOT EXISTS idx_job_postings_posted_by ON job_postings(posted_by);
CREATE INDEX IF NOT EXISTS idx_job_postings_type ON job_postings(type);
CREATE INDEX IF NOT EXISTS idx_job_postings_work_model ON job_postings(work_model);
CREATE INDEX IF NOT EXISTS idx_job_postings_experience_level ON job_postings(experience_level);
CREATE INDEX IF NOT EXISTS idx_job_postings_sector ON job_postings(sector);
CREATE INDEX IF NOT EXISTS idx_job_postings_is_active ON job_postings(is_active);
CREATE INDEX IF NOT EXISTS idx_job_postings_deadline ON job_postings(deadline);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_applied_at ON applications(applied_at);

-- 11. INITIAL SEED DATA
-- Users seed
INSERT INTO users (id, email, password_hash, first_name, last_name, role, department, graduation_year, is_verified)
VALUES
    (1, 'rumeysa.aydin@alumni.edu', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Rumeysa', 'Aydın', 'ALUMNI', 'Yönetim Bilişim Sistemleri', 2024, TRUE),
    (2, 'ahmet.yilmaz@alumni.edu', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Ahmet', 'Yılmaz', 'STUDENT', 'Bilgisayar Mühendisliği', 2026, TRUE),
    (3, 'zeynep.kaya@alumni.edu', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Zeynep', 'Kaya', 'ADMIN', 'Yazılım Mühendisliği', 2022, TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

-- Alumni Profiles seed
INSERT INTO alumni_profiles (user_id, current_company, current_title, city, country, linkedin_url, github_url)
VALUES
    (1, 'Tech Global Solutions', 'Full Stack Developer', 'İstanbul', 'Türkiye', 'https://linkedin.com/in/rumeysaaydin', 'https://github.com/rumeysa478'),
    (3, 'Cyber Security Corp', 'DevOps & Cloud Engineer', 'Ankara', 'Türkiye', 'https://linkedin.com/in/zeynepkaya', 'https://github.com/zeynepkaya')
ON CONFLICT (user_id) DO NOTHING;

-- Announcements seed
INSERT INTO announcements (id, title, content, category, author, target_audience, is_active)
VALUES
    (1, '🎓 2026 Mezunlar Günü ve Geleneksel Buluşma', 'Tüm mezunlarımızı ve son sınıf öğrencilerimizi kampüsümüzde gerçekleşecek geleneksel mezunlar günü etkinliğimize bekliyoruz. Kariyer deneyimleri, mentorluk oturumları ve müzik dinletisi yer alacaktır.', 'EVENT', 'Mezunlar Koordinatörlüğü', 'ALL', TRUE),
    (2, '💼 Partner Teknoloji Şirketinde Yeni Mezun & Staj Programı', 'Alumni ağımızın kurucu ve yöneticilerinin bulunduğu teknoloji firmalarında Yazılım Mühendisliği ve Veri Analitiği pozisyonları için başvurular açılmıştır.', 'CAREER', 'Kariyer ve Staj Merkezi', 'STUDENT', TRUE),
    (3, '📢 2026 Bahar Dönemi Mezuniyet Töreni Takvimi', 'Bahar dönemi diploma teslimleri, kep atma töreni ve mezuniyet balosu tarihleri kesinleşmiştir. Detaylar fakülte sekreterliklerinden öğrenilebilir.', 'ACADEMIC', 'Öğrenci İşleri Daire Başkanlığı', 'ALUMNI', TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval('announcements_id_seq', (SELECT MAX(id) FROM announcements));

-- Job Postings seed
INSERT INTO job_postings (id, title, company, description, requirements, location, work_model, type, experience_level, sector, salary_min, salary_max, currency, application_url, contact_email, deadline, posted_by, is_active, view_count)
VALUES
    (1, 'Junior Backend Developer', 'Tech Global Solutions', 'Node.js, Express ve PostgreSQL deneyimli çalışma arkadaşı aranıyor.', 'Node.js & Express temelleri, PostgreSQL/SQL bilgisi, REST API geliştirme tecrübesi, Git kullanımı.', 'İstanbul (Maslak)', 'HYBRID', 'FULL_TIME', 'JUNIOR', 'Yazılım & Bilişim', 45000.00, 65000.00, 'TRY', 'https://techglobal.com/careers/jr-backend', 'kariyer@techglobal.com', '2026-12-31 23:59:59+03', 1, TRUE, 142),
    (2, 'Stajyer Yazılım Geliştirici', 'Cyber Security Corp', 'Web programlama temellerine hakim, öğrenmeye açık stajyer.', 'Üniversitelerin ilgili mühendislik/bilişim bölümlerinde 3. veya 4. sınıf öğrencisi olmak, temel JavaScript/Python bilgisi.', 'Ankara / Uzaktan', 'REMOTE', 'INTERNSHIP', 'INTERN', 'Siber Güvenlik', 18500.00, 22000.00, 'TRY', 'https://cybercorp.io/internship-2026', 'hr@cybercorp.io', '2026-11-30 23:59:59+03', 3, TRUE, 89),
    (3, 'Frontend Developer (React & TypeScript)', 'Trendyol Tech', 'Milyonlarca kullanıcıya hizmet veren e-ticaret platformumuzun web arayüzlerini geliştirecek, performans odaklı Frontend Mühendisi arıyoruz.', '• En az 2 yıl React & TypeScript tecrübesi\n• Modern CSS (Tailwind CSS, Styled Components)\n• State yönetimi (Redux Toolkit, Zustand)\n• Web Performans Optimizasyonu ve SEO standartları', 'İstanbul (Maslak)', 'HYBRID', 'FULL_TIME', 'MID', 'E-Ticaret & Yazılım', 65000.00, 90000.00, 'TRY', 'https://careers.trendyol.com/frontend-dev', 'tech-talent@trendyol.com', '2026-12-15 23:59:59+03', 3, TRUE, 310),
    (4, 'Yapay Zeka & Veri Bilimi Stajyeri', 'Insider Dynamics', 'Makine öğrenimi, büyük veri analitiği ve tavsiye motorları üzerinde çalışacak dinamik stajyerler aranıyor.', '• Üniversitelerin 3. veya 4. sınıf öğrencisi olmak\n• Python (NumPy, Pandas, Scikit-learn) yetkinliği\n• SQL veri analizi temelleri\n• Meraklı ve analitik bakış açısı', 'Uzaktan / Remote', 'REMOTE', 'INTERNSHIP', 'INTERN', 'Yapay Zeka & Büyük Veri', 22000.00, 26000.00, 'TRY', 'https://useinsider.com/careers/ai-intern-2026', 'campus@useinsider.com', '2026-11-20 23:59:59+03', 3, TRUE, 245),
    (5, 'DevOps & Bulut Altyapı Mühendisi', 'Havelsan', 'Savunma ve kamu projelerinde güvenli CI/CD boru hatları, Kubernetes küme yönetimi ve Linux sistem mimarisi sorumlusu.', '• Docker ve Kubernetes orkestrasyonu\n• CI/CD (GitLab CI, GitHub Actions, Jenkins)\n• Linux sunucu yönetimi ve Bash/Python betikleme\n• Ağ güvenliği ve izleme (Prometheus, Grafana)', 'Ankara (ODTÜ Teknokent)', 'ONSITE', 'FULL_TIME', 'MID', 'Savunma Sanayii & Bilişim', 80000.00, 115000.00, 'TRY', 'https://kariyer.havelsan.com.tr/ilan/devops-muhendisi', 'ik@havelsan.com.tr', '2027-01-15 23:59:59+03', 3, TRUE, 178),
    (6, 'Mobile Developer (Flutter / React Native)', 'Getir Tech', 'Hızlı teslimat ekosistemimizde iOS ve Android uygulamalarımızın geliştirilmesinde aktif rol alacak mobil yazılımcı.', '• Flutter veya React Native ile en az 1 yıl uygulama geliştirme\n• RESTful API ve WebSocket entegrasyonları\n• App Store ve Google Play yayınlama süreçleri\n• Temel Clean Architecture ve UI/UX duyarlılığı', 'İstanbul (Levent)', 'HYBRID', 'FULL_TIME', 'JUNIOR', 'E-Ticaret & Mobil', 52000.00, 72000.00, 'TRY', 'https://getir.com/careers/mobile-dev', 'mobile-jobs@getir.com', '2026-12-25 23:59:59+03', 3, TRUE, 195)
ON CONFLICT (id) DO NOTHING;

SELECT setval('job_postings_id_seq', (SELECT MAX(id) FROM job_postings));

-- Applications seed (N:M Action Table)
INSERT INTO applications (id, job_id, user_id, cover_letter, resume_url, portfolio_url, expected_salary, status, notes)
VALUES
    (1, 2, 2, 'Staj programınıza katılmayı ve kendimi web teknolojilerinde geliştirmeyi çok istiyorum.', 'https://storage.alumni.edu/resumes/ahmet-cv.pdf', 'https://github.com/ahmetyilmaz', 20000.00, 'PENDING', 'Ön elemeden geçti, teknik mülakat planlanabilir.'),
    (2, 3, 1, 'Yönetim Bilişim Sistemleri mezunuyum. React ve modern web teknolojilerindeki portfolyo projelerimle ekibinize değer katmak istiyorum.', 'https://storage.alumni.edu/resumes/rumeysa_cv.pdf', 'https://github.com/rumeysa478', 75000.00, 'INTERVIEW', 'Teknik mülakat 28 Ekim saat 11:00 olarak belirlendi.'),
    (3, 5, 3, 'DevOps ve bulut altyapıları üzerine çalışmalarımı sunmaktan memnuniyet duyarım.', 'https://storage.alumni.edu/resumes/zeynep_cv.pdf', 'https://github.com/zeynepkaya', 90000.00, 'OFFERED', 'Adaya resmi teklif mektubu iletildi.')
ON CONFLICT (id) DO NOTHING;

SELECT setval('applications_id_seq', (SELECT COALESCE(MAX(id), 1) FROM applications));

