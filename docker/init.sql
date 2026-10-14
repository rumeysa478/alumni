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
    location VARCHAR(100),
    type VARCHAR(50) DEFAULT 'FULL_TIME' CHECK (type IN ('FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'REMOTE', 'CONTRACT')),
    deadline TIMESTAMP WITH TIME ZONE,
    posted_by INT REFERENCES users(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. JOB APPLICATIONS TABLE (N:M bridge between users and job_postings)
CREATE TABLE IF NOT EXISTS job_applications (
    id SERIAL PRIMARY KEY,
    job_id INT NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT,
    resume_url VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED')),
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_job_user_application UNIQUE (job_id, user_id)
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

CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);

-- 11. INITIAL SEED DATA
-- Users seed
INSERT INTO users (id, email, password_hash, first_name, last_name, role, department, graduation_year, is_verified)
VALUES
    (1, 'rumeysa.aydin@alumni.edu', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Rümeysa', 'Aydın', 'ALUMNI', 'Yönetim Bilişim Sistemleri', 2024, TRUE),
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
INSERT INTO job_postings (id, title, company, description, location, type, deadline, posted_by, is_active)
VALUES
    (1, 'Junior Backend Developer', 'Tech Global Solutions', 'Node.js, Express ve PostgreSQL deneyimli çalışma arkadaşı aranıyor.', 'İstanbul (Hibrit)', 'FULL_TIME', '2026-12-31', 1, TRUE),
    (2, 'Stajyer Yazılım Geliştirici', 'Cyber Security Corp', 'Web programlama temellerine hakim, öğrenmeye açık stajyer.', 'Ankara / Uzaktan', 'INTERNSHIP', '2026-11-30', 3, TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval('job_postings_id_seq', (SELECT MAX(id) FROM job_postings));
