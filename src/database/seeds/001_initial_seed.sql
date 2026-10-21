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
INSERT INTO job_postings (id, title, company, description, requirements, location, work_model, type, experience_level, sector, salary_min, salary_max, currency, application_url, contact_email, deadline, posted_by, is_active, view_count)
VALUES
    (1, 'Junior Backend Developer', 'Tech Global Solutions', 'Node.js, Express ve PostgreSQL deneyimli çalışma arkadaşı aranıyor.', 'Node.js & Express temelleri, PostgreSQL/SQL bilgisi, REST API geliştirme tecrübesi, Git kullanımı.', 'İstanbul (Maslak)', 'HYBRID', 'FULL_TIME', 'JUNIOR', 'Yazılım & Bilişim', 45000.00, 65000.00, 'TRY', 'https://techglobal.com/careers/jr-backend', 'kariyer@techglobal.com', '2026-12-31 23:59:59+03', 1, TRUE, 142),
    (2, 'Stajyer Yazılım Geliştirici', 'Cyber Security Corp', 'Web programlama temellerine hakim, öğrenmeye açık stajyer.', 'Üniversitelerin ilgili mühendislik/bilişim bölümlerinde 3. veya 4. sınıf öğrencisi olmak, temel JavaScript/Python bilgisi.', 'Ankara / Uzaktan', 'REMOTE', 'INTERNSHIP', 'INTERN', 'Siber Güvenlik', 18500.00, 22000.00, 'TRY', 'https://cybercorp.io/internship-2026', 'hr@cybercorp.io', '2026-11-30 23:59:59+03', 3, TRUE, 89),
    (3, 'Frontend Developer (React & TypeScript)', 'Trendyol Tech', 'Milyonlarca kullanıcıya hizmet veren e-ticaret platformumuzun web arayüzlerini geliştirecek, performans odaklı Frontend Mühendisi arıyoruz.', '• En az 2 yıl React & TypeScript tecrübesi\n• Modern CSS (Tailwind CSS, Styled Components)\n• State yönetimi (Redux Toolkit, Zustand)\n• Web Performans Optimizasyonu ve SEO standartları', 'İstanbul (Maslak)', 'HYBRID', 'FULL_TIME', 'MID', 'E-Ticaret & Yazılım', 65000.00, 90000.00, 'TRY', 'https://careers.trendyol.com/frontend-dev', 'tech-talent@trendyol.com', '2026-12-15 23:59:59+03', 3, TRUE, 310),
    (4, 'Yapay Zeka & Veri Bilimi Stajyeri', 'Insider Dynamics', 'Makine öğrenimi, büyük veri analitiği ve tavsiye motorları üzerinde çalışacak dinamik stajyerler aranıyor.', '• Üniversitelerin 3. veya 4. sınıf öğrencisi olmak\n• Python (NumPy, Pandas, Scikit-learn) yetkinliği\n• SQL veri analizi temelleri\n• Meraklı ve analitik bakış açısı', 'Uzaktan / Remote', 'REMOTE', 'INTERNSHIP', 'INTERN', 'Yapay Zeka & Büyük Veri', 22000.00, 26000.00, 'TRY', 'https://useinsider.com/careers/ai-intern-2026', 'campus@useinsider.com', '2026-11-20 23:59:59+03', 3, TRUE, 245),
    (5, 'DevOps & Bulut Altyapı Mühendisi', 'Havelsan', 'Savunma ve kamu projelerinde güvenli CI/CD boru hatları, Kubernetes küme yönetimi ve Linux sistem mimarisi sorumlusu.', '• Docker ve Kubernetes orkestrasyonu\n• CI/CD (GitLab CI, GitHub Actions, Jenkins)\n• Linux sunucu yönetimi ve Bash/Python betikleme\n• Ağ güvenliği ve izleme (Prometheus, Grafana)', 'Ankara (ODTÜ Teknokent)', 'ONSITE', 'FULL_TIME', 'MID', 'Savunma Sanayii & Bilişim', 80000.00, 115000.00, 'TRY', 'https://kariyer.havelsan.com.tr/ilan/devops-muhendisi', 'ik@havelsan.com.tr', '2027-01-15 23:59:59+03', 3, TRUE, 178),
    (6, 'Mobile Developer (Flutter / React Native)', 'Getir Tech', 'Hızlı teslimat ekosistemimizde iOS ve Android uygulamalarımızın geliştirilmesinde aktif rol alacak mobil yazılımcı.', '• Flutter veya React Native ile en az 1 yıl uygulama geliştirme\n• RESTful API ve WebSocket entegrasyonları\n• App Store ve Google Play yayınlama süreçleri\n• Temel Clean Architecture ve UI/UX duyarlılığı', 'İstanbul (Levent)', 'HYBRID', 'FULL_TIME', 'JUNIOR', 'E-Ticaret & Mobil', 52000.00, 72000.00, 'TRY', 'https://getir.com/careers/mobile-dev', 'mobile-jobs@getir.com', '2026-12-25 23:59:59+03', 3, TRUE, 195)
ON CONFLICT (id) DO NOTHING;

SELECT setval('job_postings_id_seq', (SELECT COALESCE(MAX(id), 1) FROM job_postings));

-- 5. SEED EVENTS
INSERT INTO events (id, title, description, event_date, location, capacity, created_by)
VALUES
    (1, 'Mezunlar ve Öğrenciler Buluşması 2026', 'Farklı sektörlerdeki mezunlarımızın katılımıyla kariyer paneli ve networking resepsiyonu.', '2026-11-15 14:00:00+03', 'Rektörlük Mavi Salon', 200, 3)
ON CONFLICT (id) DO NOTHING;

SELECT setval('events_id_seq', (SELECT COALESCE(MAX(id), 1) FROM events));

-- 6. SEED APPLICATIONS (N:M Action Table)
INSERT INTO applications (id, job_id, user_id, cover_letter, resume_url, portfolio_url, expected_salary, status, notes)
VALUES
    (1, 2, 2, 'Staj programınıza katılmayı ve kendimi web teknolojilerinde geliştirmeyi çok istiyorum.', 'https://storage.alumni.edu/resumes/ahmet-cv.pdf', 'https://github.com/ahmetyilmaz', 20000.00, 'PENDING', 'Ön elemeden geçti, teknik mülakat planlanabilir.'),
    (2, 3, 1, 'Yönetim Bilişim Sistemleri mezunuyum. React ve modern web teknolojilerindeki portfolyo projelerimle ekibinize değer katmak istiyorum.', 'https://storage.alumni.edu/resumes/rumeysa_cv.pdf', 'https://github.com/rumeysa478', 75000.00, 'INTERVIEW', 'Teknik mülakat 28 Ekim saat 11:00 olarak belirlendi.'),
    (3, 5, 3, 'DevOps ve bulut altyapıları üzerine çalışmalarımı sunmaktan memnuniyet duyarım.', 'https://storage.alumni.edu/resumes/zeynep_cv.pdf', 'https://github.com/zeynepkaya', 90000.00, 'OFFERED', 'Adaya resmi teklif mektubu iletildi.')
ON CONFLICT (id) DO NOTHING;

SELECT setval('applications_id_seq', (SELECT COALESCE(MAX(id), 1) FROM applications));

