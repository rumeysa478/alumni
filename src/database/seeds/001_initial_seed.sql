-- Initial Seed Data for Alumni Tracking System
-- Matches initial in-memory data and ddd.md specifications

-- 1. SEED USERS
INSERT INTO users (id, email, password_hash, first_name, last_name, role, department, graduation_year, is_verified)
VALUES
    (1, 'rumeysa.aydin@alumni.edu', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Rumeysa', 'Aydın', 'ALUMNI', 'Yönetim Bilişim Sistemleri', 2024, TRUE),
    (2, 'ahmet.yilmaz@alumni.edu', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Ahmet', 'Yılmaz', 'STUDENT', 'Bilgisayar Mühendisliği', 2026, TRUE),
    (3, 'zeynep.kaya@alumni.edu', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Zeynep', 'Kaya', 'ADMIN', 'Yazılım Mühendisliği', 2022, TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 1) FROM users));

-- 2. SEED ALUMNI PROFILES
INSERT INTO alumni_profiles (user_id, current_company, current_title, city, country, linkedin_url, github_url)
VALUES
    (1, 'Tech Global Solutions', 'Full Stack Developer', 'İstanbul', 'Türkiye', 'https://linkedin.com/in/rumeysaaydin', 'https://github.com/rumeysa478'),
    (3, 'Cyber Security Corp', 'DevOps & Cloud Engineer', 'Ankara', 'Türkiye', 'https://linkedin.com/in/zeynepkaya', 'https://github.com/zeynepkaya')
ON CONFLICT (user_id) DO NOTHING;

-- 3. SEED ANNOUNCEMENTS
INSERT INTO announcements (id, title, content, category, author, target_audience, is_active)
VALUES
    (1, '🎓 2026 Mezunlar Günü ve Geleneksel Buluşma', 'Tüm mezunlarımızı ve son sınıf öğrencilerimizi kampüsümüzde gerçekleşecek geleneksel mezunlar günü etkinliğimize bekliyoruz. Kariyer deneyimleri, mentorluk oturumları ve müzik dinletisi yer alacaktır.', 'EVENT', 'Mezunlar Koordinatörlüğü', 'ALL', TRUE),
    (2, '💼 Partner Teknoloji Şirketinde Yeni Mezun & Staj Programı', 'Alumni ağımızın kurucu ve yöneticilerinin bulunduğu teknoloji firmalarında Yazılım Mühendisliği ve Veri Analitiği pozisyonları için başvurular açılmıştır.', 'CAREER', 'Kariyer ve Staj Merkezi', 'STUDENT', TRUE),
    (3, '📢 2026 Bahar Dönemi Mezuniyet Töreni Takvimi', 'Bahar dönemi diploma teslimleri, kep atma töreni ve mezuniyet balosu tarihleri kesinleşmiştir. Detaylar fakülte sekreterliklerinden öğrenilebilir.', 'ACADEMIC', 'Öğrenci İşleri Daire Başkanlığı', 'ALUMNI', TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval('announcements_id_seq', (SELECT COALESCE(MAX(id), 1) FROM announcements));

-- 4. SEED JOB POSTINGS
INSERT INTO job_postings (id, title, company, description, location, type, deadline, posted_by, is_active)
VALUES
    (1, 'Junior Backend Developer', 'Tech Global Solutions', 'Node.js, Express ve PostgreSQL deneyimli çalışma arkadaşı aranıyor.', 'İstanbul (Hibrit)', 'FULL_TIME', '2026-12-31', 1, TRUE),
    (2, 'Stajyer Yazılım Geliştirici', 'Cyber Security Corp', 'Web programlama temellerine hakim, öğrenmeye açık stajyer.', 'Ankara / Uzaktan', 'INTERNSHIP', '2026-11-30', 3, TRUE)
ON CONFLICT (id) DO NOTHING;

SELECT setval('job_postings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM job_postings));

-- 5. SEED EVENTS
INSERT INTO events (id, title, description, event_date, location, capacity, created_by)
VALUES
    (1, 'Mezunlar ve Öğrenciler Buluşması 2026', 'Farklı sektörlerdeki mezunlarımızın katılımıyla kariyer paneli ve networking resepsiyonu.', '2026-11-15 14:00:00+03', 'Rektörlük Mavi Salon', 200, 3)
ON CONFLICT (id) DO NOTHING;

SELECT setval('events_id_seq', (SELECT COALESCE(MAX(id), 1) FROM events));
