# 🎓 Alumni Tracking System (Mezun Takip Sistemi)

[![Node.js](https://img.shields.io/badge/Node.js-v18+-68a063?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v4+-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Git](https://img.shields.io/badge/Git-Workflow-f05032?style=for-the-badge&logo=git&logoColor=white)](https://git-scm.com/)

> **Web Programlama Dersi Dönem Projesi**  
> Üniversite mezunları, öğrenciler ve akademik/idari birimler arasındaki bağı canlı tutan, mezun profillerini, kariyer fırsatlarını ve etkinlikleri tek bir çatı altında toplayan modern web tabanlı takip ve iletişim platformu.

---

## 📌 İçindekiler
- [Proje Hakkında](#-proje-hakkında)
- [Temel Özellikler ve Modüller](#-temel-özellikler-ve-modüller)
- [Teknoloji Yığını (Tech Stack)](#-teknoloji-yığını-tech-stack)
- [Sistem ve Veritabanı Mimarisi](#-sistem-ve-veritabanı-mimarisi)
- [Ön Koşullar (Prerequisites)](#-ön-koşullar-prerequisites)
- [Kurulum ve Çalıştırma](#-kurulum-ve-çalıştırma)
  - [Seçenek 1: Docker ile Hızlı Başlatma (Önerilen)](#seçenek-1-docker-ile-hızlı-başlatma-önerilen)
  - [Seçenek 2: Yerel Geliştirme Ortamı (Lokal Kurulum)](#seçenek-2-yerel-geliştirme-ortamı-lokal-kurulum)
- [Çevresel Değişkenler (.env)](#-çevresel-değişkenler-env)
- [Swagger & API Dokümantasyonu](#-swagger--api-dokümantasyonu)
- [Örnek API Endpoint'leri](#-örnek-api-endpointleri)
- [Git & GitHub Geliştirme Standartları](#-git--github-geliştirme-standartları)
- [Proje Ekibi ve İletişim](#-proje-ekibi-ve-iletişim)
- [Lisans](#-lisans)

---

## 📖 Proje Hakkında

Üniversite mezunlarının kariyer yollarını takip etmek, mezun-öğrenci iş birliğini artırmak ve üniversitenin kurumsal hafızasını güçlendirmek amacıyla geliştirilen **Alumni Tracking System (Mezun Takip Sistemi)**; kullanıcı dostu, ölçeklenebilir ve güvenli bir web uygulamasıdır.

### 🎯 Projenin Amaçları:
- Mezunların güncel iletişim, eğitim ve iş tecrübesi bilgilerini tek bir merkezde toplamak.
- Öğrenciler ile mezunlar arasında mentörlük ve networking köprüsü kurmak.
- Şirketler ve mezunlar tarafından paylaşılan iş/staj ilanlarını öğrencilere ulaştırmak.
- Mezunlar buluşması, seminerler ve kariyer günleri gibi etkinlikleri duyurmak ve katılımları yönetmek.

---

## ✨ Temel Özellikler ve Modüller

| Modül | Açıklama |
| :--- | :--- |
| 🔐 **Kimlik Doğrulama & Yetkilendirme (Auth & RBAC)** | JWT tabanlı oturum yönetimi, güvenli şifreleme (bcrypt), rol bazlı erişim kontrolü (Öğrenci, Mezun, Admin, Akademisyen). |
| 👤 **Profil Yönetimi** | Mezuniyet yılı, bölüm, unvan, şirket, lokasyon, LinkedIn/GitHub profilleri, CV yükleme ve iletişim tercihleri. |
| 🔍 **Mezun Dizini (Alumni Directory)** | Filtreleme ve arama motoru (Bölüm, mezuniyet dönemi, sektör, çalışılan şirket veya şehre göre dinamik arama). |
| 💼 **Kariyer & İlan Portalı** | İş ve staj ilanlarının yayınlanması, başvuru süreçleri ve başvuru takibi. |
| 📅 **Etkinlik & Duyuru Yönetimi** | Mezunlar günü, webinar ve seminer duyuruları, RSVP / etkinlik kayıt sistemi. |
| 🤝 **Mentörlük & Ağ Oluşturma** | Öğrencilerin mezunlardan mentörlük talep edebileceği veya iletişime geçebileceği etkileşim alanı. |
| 📊 **Yönetici (Admin) Paneli** | Kullanıcı onay/doğrulama mekanizması, ilan ve etkinlik moderasyonu, mezun istatistikleri ve raporlama. |

---

## 🛠 Teknoloji Yığını (Tech Stack)

### 🔹 Backend & API
- **Runtime:** [Node.js](https://nodejs.org/) (LTS v18 veya v20)
- **Framework:** [Express.js](https://expressjs.com/) (Hızlı, minimalist ve modüler web framework'ü)
- **Veritabanı Sürücüsü / ORM:** `pg` (node-postgres) veya [Prisma ORM](https://www.prisma.io/) / [Sequelize](https://sequelize.org/)
- **Güvenlik & Doğrulama:** `jsonwebtoken` (JWT), `bcryptjs`, `cors`, `helmet`, `joi` veya `zod`

### 🔹 Veritabanı
- **RDBMS:** [PostgreSQL](https://www.postgresql.org/) (İlişkisel veritabanı, güçlü indeksleme ve ACID desteği)

### 🔹 Frontend (Arayüz)
- **Yaklaşım Seçenekleri:** 
  - Server-Side Rendering (SSR): **EJS** veya **Handlebars**
  - Veya Single Page Application (SPA): **React.js** / **Vue.js**
  - **CSS / UI:** TailwindCSS veya Bootstrap 5

### 🔹 Konteynerizasyon & DevOps
- **Docker & Docker Compose:** Backend uygulaması ve PostgreSQL veritabanının ortam bağımsız tek komutla ayağa kaldırılması.

### 🔹 Takip & Sürüm Kontrolü
- **Versiyon Kontrol:** Git
- **İş Takibi:** GitHub Projects, Issues ve Pull Requests

---

## 🗄 Sistem ve Veritabanı Mimarisi

Sistem RESTful mimari prensiplerine uygun olarak servis katmanı ve veri erişim katmanı ayrılmış (Layered/MVC Architecture) şekilde kurgulanmıştır.

```mermaid
erDiagram
    USERS ||--o{ ALUMNI_PROFILES : "sahiptir"
    USERS ||--o{ JOB_POSTINGS : "yayınlar"
    USERS ||--o{ EVENT_ATTENDEES : "katılır"
    USERS ||--o{ MENTORSHIPS : "dahildir"
    JOB_POSTINGS ||--o{ JOB_APPLICATIONS : "alır"
    EVENTS ||--o{ EVENT_ATTENDEES : "içerir"

    USERS {
        int id PK
        string email
        string password_hash
        string role "ADMIN | ALUMNI | STUDENT"
        boolean is_verified
        timestamp created_at
    }

    ALUMNI_PROFILES {
        int id PK
        int user_id FK
        string first_name
        string last_name
        string department
        int graduation_year
        string current_company
        string current_title
        string city
        string linkedin_url
    }

    JOB_POSTINGS {
        int id PK
        int posted_by FK
        string title
        string company
        string description
        string location
        string type "FULL_TIME | INTERNSHIP"
        timestamp deadline
    }

    EVENTS {
        int id PK
        string title
        string description
        timestamp event_date
        string location
        int created_by FK
    }
```

---

## 📋 Ön Koşullar (Prerequisites)

Projeyi yerel makinenizde çalıştırmadan önce sisteminizde aşağıdaki yazılımların kurulu olduğundan emin olun:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) (v18.x veya üzeri) ve `npm`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Docker & Docker Compose ile çalıştırmak için)
- [PostgreSQL](https://www.postgresql.org/) (Lokalde Docker olmadan çalıştırılacaksa)

---

## 🚀 Kurulum ve Çalıştırma

Projeyi klonlayarak başlayın:
```bash
git clone https://github.com/rumeysa478/alumni.git
cd alumni
```

### Seçenek 1: Docker ile Hızlı Başlatma (Önerilen)

Docker kurulu ise, veritabanı veya Node ortamı kurulumuyla uğraşmadan tek komutla tüm sistemi ayağa kaldırabilirsiniz:

1. **Çevresel değişkenleri hazırlayın:**
   ```bash
   cp .env.example .env
   ```
2. **Konteynerleri derleyin ve başlatın:**
   ```bash
   docker compose up --build
   ```
3. Uygulama hazır!
   - Web / API: `http://localhost:5000`
   - PostgreSQL Portu: `5432`

Durdurmak için:
```bash
docker compose down
```

---

### Seçenek 2: Yerel Geliştirme Ortamı (Lokal Kurulum)

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Çevresel değişkenleri yapılandırın:**
   ```bash
   cp .env.example .env
   ```
   `.env` dosyasını açıp yerel PostgreSQL kullanıcı adı, şifre ve port bilgilerinizi girin.

3. **Veritabanı tablolarını ve tohum verileri oluşturun:**
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Uygulamayı geliştirici modunda başlatın:**
   ```bash
   npm run dev
   ```
   Uygulama `http://localhost:5000` adresinde çalışacaktır.

---

## ⚙️ Çevresel Değişkenler (.env)

Kök dizinde bir `.env` dosyası oluşturup aşağıdaki değişkenleri projenize göre düzenleyin:

```env
# Sunucu Ayarları
NODE_ENV=development
PORT=5000

# PostgreSQL Bağlantı Bilgileri
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=alumni_db

# Docker İçin Bağlantı URL'i (Opsiyonel)
DATABASE_URL=postgresql://postgres:your_secure_password@postgres_db:5432/alumni_db

# Güvenlik & JWT Ayarları
JWT_SECRET=super_secret_jwt_key_change_in_production
JWT_EXPIRES_IN=7d

# Dosya Yükleme (CV / Profil Fotoğrafı)
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=5242880 # 5 MB
```

---

## 📚 Swagger & API Dokümantasyonu

Projedeki tüm uç noktalar, parametreler ve şemalar **OpenAPI 3.0 / Swagger** ile interaktif olarak dokümante edilmiştir.

- **Swagger UI (İnteraktif Arayüz):** [http://localhost:5000/api/swagger](http://localhost:5000/api/swagger)
- **OpenAPI JSON Şeması:** [http://localhost:5000/api/swagger.json](http://localhost:5000/api/swagger.json)
- **Postman Koleksiyonu:** Proje kök dizinindeki [`alumni.postman_collection.json`](./alumni.postman_collection.json) dosyası tüm hazır istekleri ve otomatik test senaryolarını içerir.

> [!IMPORTANT]
> **Geliştirme Kuralı:** Projeye yeni bir rota (route) tanımlandığında veya mevcut bir rota güncellendiğinde, ilgili rota **`src/config/swagger.js`** dosyasına ve Postman koleksiyonuna mutlaka eklenmelidir.

---

## 🔌 API Endpoint'leri

| Metot | Uç Nokta (Endpoint) | Açıklama | Yetki / Format |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/swagger` | İnteraktif Swagger UI API dokümantasyonu | Herkese Açık (HTML) |
| `GET` | `/api/swagger.json` | OpenAPI 3.0 JSON formatında API şeması | Herkese Açık (JSON) |
| `GET` | `/api/health` | Sistem sağlık ve donanım metrikleri kontrolü | Herkese Açık (JSON) |
| `GET` | `/api/users` | Tüm kullanıcıları listeleme | Herkese Açık (In-Memory) |
| `POST` | `/api/users` | Yeni kullanıcı oluşturma | Form / JSON (`x-www-form-urlencoded`, `multipart/form-data`) |
| `GET` | `/api/users/:id` | ID ile tekil kullanıcı detayını getirme | Herkese Açık |
| `PUT` | `/api/users/:id` | ID ile kullanıcı kaydını tam güncelleme | Form / JSON |
| `PATCH` | `/api/users/:id` | ID ile kullanıcı kaydını kısmi güncelleme | Form / JSON |
| `DELETE` | `/api/users/:id` | ID ile kullanıcı kaydını silme | Herkese Açık |
| `POST` | `/api/auth/register` | Yeni kullanıcı kaydı (Öğrenci / Mezun) *(Planlanan)* | Herkese Açık |
| `POST` | `/api/auth/login` | Giriş yapma ve JWT token alma *(Planlanan)* | Herkese Açık |
| `GET` | `/api/auth/me` | Giriş yapan kullanıcının profil bilgisi *(Planlanan)* | Giriş Gerekli |
| `GET` | `/api/alumni` | Mezun listesi ve filtreleme (yıl, bölüm, şirket) *(Planlanan)* | Giriş Gerekli |
| `GET` | `/api/alumni/:id` | Belirli bir mezunun detaylı profili *(Planlanan)* | Giriş Gerekli |
| `GET` | `/api/jobs` | Aktif iş ve staj ilanlarını listeleme *(Planlanan)* | Giriş Gerekli |
| `POST` | `/api/jobs` | Yeni iş/staj ilanı oluşturma *(Planlanan)* | Mezun / Admin |
| `GET` | `/api/events` | Yaklaşan etkinlikleri listeleme *(Planlanan)* | Herkese Açık |
| `GET` | `/api/admin/stats` | Mezuniyet ve istihdam istatistikleri *(Planlanan)* | Sadece Admin |


---

## 🌿 Git & GitHub Geliştirme Standartları

Takım çalışmasını düzenli ve izlenebilir tutmak için aşağıdaki standartlar uygulanır:

### Dal (Branch) Stratejisi
- `main`: Canlıya/teslime hazır stabil kod tabanı.
- `develop`: Geliştirme aşamasındaki ana dal.
- `feature/<özellik-adı>`: Yeni eklenecek özellikler (örn: `feature/alumni-search-filter`).
- `bugfix/<hata-adı>`: Hata düzeltmeleri (örn: `bugfix/jwt-expiration-fix`).

### Commit Mesaj Standartları (Conventional Commits)
- `feat:` Yeni bir özellik eklendiğinde (örn: `feat: add postgres connection pool`)
- `fix:` Bir hata düzeltildiğinde (örn: `fix: resolve auth middleware token leak`)
- `docs:` Yalnızca dokümantasyon değişikliğinde (örn: `docs: update readme with docker instructions`)
- `refactor:` Kodun işlevini değiştirmeden yapılan düzenlemelerde (örn: `refactor: modularize routes`)
- `chore:` Yapılandırma veya bağımlılık güncellemelerinde (örn: `chore: add docker-compose file`)

### GitHub Proje Yönetimi
- **Issues:** Geliştirilecek her modül veya giderilecek hata bir Issue olarak açılır.
- **Pull Requests (PR):** Geliştirilen dallar `develop` dalına birleştirilmeden önce PR açılır ve kod incelemesi (Code Review) yapılır.
- **Projects / Kanban:** Görevler *Todo*, *In Progress*, *Done* sütunlarında takip edilir.

---

## 👥 Proje Ekibi ve İletişim

Bu proje, **Web Programlama** dersi kapsamında geliştirilmiştir.

| İsim Soyisim | Öğrenci Numarası | Rol / Görev | İletişim |
| :--- | :--- | :--- | :--- |
| **Rümeysa Aydın** | *(Öğrenci No)* | Backend & DevOps | [GitHub](https://github.com/rumeysa478) |
| *(Ekip Arkadaşı)* | *(Öğrenci No)* | Frontend / UI-UX | [GitHub](https://github.com) |

- **Ders:** Web Programlama / Web Programming
- **Dönem:** 2024 - 2025 Akademik Yılı
- **Danışman / Öğretim Görevlisi:** *(Hoca Adı Soyadı)*

---

## 📄 Lisans

Bu proje akademik ve eğitim amaçlı geliştirilmiş olup [MIT Lisansı](LICENSE) altında korunmaktadır.
