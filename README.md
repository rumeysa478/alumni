# 🎓 Alumni Tracking System (Mezun Takip Sistemi)

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![GitHub](https://img.shields.io/badge/GitHub-Workflow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/rumeysa478/alumni)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

> **3. Sınıf Web Programlama Dersi Kapsamında Geliştirilen Mezun Bilgi ve Takip Sistemi Projesi**

---

## 📌 Proje Hakkında

**Alumni Tracking System (Mezun Takip Sistemi)**, üniversite mezunlarının birbirleriyle, mevcut öğrencilerle ve üniversite yönetimiyle olan iletişim ve etkileşimini sürdürülebilir kılmak amacıyla geliştirilmektedir. 

Sistem; mezunların kariyer yolculuklarını güncellemelerine, iş/staj fırsatları paylaşmalarına, üniversite etkinliklerinden haberdar olmalarına ve mezun ağını (network) güçlendirmelerine olanak tanır. Proje sürecinde modern web standartları, mikroservis/konteyner mimarisi ve ekip içi çevik geliştirme prensipleri benimsenmiştir.

---

## 🚀 Temel Özellikler

- **👤 Mezun Profili & Portfolyo Yönetimi:**
  - Eğitim bilgileri (fakülte, bölüm, mezuniyet yılı, derece).
  - Güncel kariyer durumu (şirket, pozisyon, sektör, lokasyon, LinkedIn/GitHub bağlantıları).
  - Yetenekler, sertifikalar ve kişisel özet.
- **💼 Kariyer & Fırsat Merkezi:**
  - Mezunlar ve işverenler tarafından iş/staj ilanlarının yayımlanması.
  - İlanlara başvuru ve başvuru takibi.
- **🔍 Gelişmiş Arama ve Filtreleme:**
  - Mezuniyet yılı, bölüm, sektör, çalışılan kurum ve şehre göre mezun filtreleme.
  - İsim veya anahtar kelimeye göre arama.
- **📅 Etkinlikler ve Duyurular:**
  - Mezun buluşmaları, seminerler, kariyer günleri ve üniversite duyuruları.
  - Etkinliklere katılım bildirimi (RSVP).
- **🔒 Güvenli Kimlik Doğrulama & Yetkilendirme:**
  - JWT (JSON Web Token) tabanlı oturum yönetimi ve şifreleme (bcrypt).
  - Rol Tabanlı Yetkilendirme (Admin, Mezun, Öğrenci).
- **🛡️ Yönetici (Admin) Paneli:**
  - Sisteme kaydolan mezunların öğrenci işleri/üniversite verileriyle doğrulanması ve onaylanması.
  - İlan ve etkinlik içerik denetimi.
  - İstatistiksel raporlar (mezun istihdam oranları, sektör dağılım grafikleri vb.).

---

## 🛠️ Teknoloji Yığını (Tech Stack)

| Alan | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Backend** | [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/) | RESTful API mimarisi, asenkron ve modüler servis yapısı |
| **Veritabanı** | [PostgreSQL](https://www.postgresql.org/) | Güçlü ilişkisel veri modeli, ACID desteği ve indeksleme |
| **ORM / Query Builder** | Prisma / Sequelize / pg | Veritabanı modellemesi ve migration yönetimi |
| **Konteynerizasyon** | [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) | İzole geliştirme ve prodüksiyon ortamları, taşınabilirlik |
| **Versiyon Kontrol & CI/CD** | [Git](https://git-scm.com/) & [GitHub](https://github.com/) | Branch stratejisi, Pull Request yönetimi ve GitHub Actions otomasyonu |
| **Kimlik Doğrulama** | JWT & Bcrypt | Güvenli kimlik doğrulama ve parola hashleme |
| **Frontend** | HTML5, CSS3 / Tailwind CSS, JavaScript | Responsive, kullanıcı dostu ve erişilebilir arayüz |

---

## 📂 Örnek Proje Mimarisi

```plaintext
alumni/
├── .github/                  # GitHub Actions CI/CD iş akışları ve şablonlar
│   └── workflows/
├── docker/                   # Docker konfigürasyonları
│   └── Dockerfile
├── src/
│   ├── config/               # Veritabanı ve ortam konfigürasyonları
│   ├── controllers/          # İstek kontrolcüleri (Business logic yönlendirme)
│   ├── middleware/           # Auth, error handling ve validation ara yazılımları
│   ├── models/               # Veritabanı modelleri / şemaları
│   ├── routes/               # API endpoint tanımları
│   ├── services/             # İş mantığı (Business logic)
│   ├── utils/                # Yardımcı fonksiyonlar ve loglayıcılar
│   └── app.js (veya server.js) # Ana uygulama giriş noktası
├── .env.example              # Örnek ortam değişkenleri şablonu
├── .gitignore                # Git dışı bırakılacak dosyalar
├── docker-compose.yml        # Docker servis tanımları (App + PostgreSQL)
├── package.json              # Bağımlılıklar ve npm betikleri
└── README.md                 # Proje dokümantasyonu
```

---

## ⚡ Kurulum ve Çalıştırma

Projeyi yerel ortamınızda iki farklı şekilde çalıştırabilirsiniz:

### 1. Docker ile Hızlı Başlatma (Önerilen) 🐳

Sisteminizde [Docker](https://www.docker.com/) ve [Docker Compose](https://docs.docker.com/compose/) kurulu olmalıdır.

1. **Repoyu klonlayın:**
   ```bash
   git clone https://github.com/rumeysa478/alumni.git
   cd alumni
   ```

2. **Ortam değişkenlerini hazırlayın:**
   ```bash
   cp .env.example .env
   ```

3. **Konteynerleri derleyin ve ayağa kaldırın:**
   ```bash
   docker compose up --build
   ```
   *Uygulama ve PostgreSQL veritabanı otomatik olarak yapılandırılıp çalıştırılacaktır.*

4. **Uygulamaya erişin:**
   - Web API / Uygulama: `http://localhost:3000`
   - PostgreSQL Veritabanı: `localhost:5432`

---

### 2. Yerel Ortamda Manuel Çalıştırma 💻

Sisteminizde **Node.js** (v18+) ve **PostgreSQL** kurulu olmalıdır.

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **`.env` dosyasını oluşturun ve veritabanı bağlantı bilgilerinizi girin:**
   ```env
   PORT=3000
   NODE_ENV=development
   DATABASE_URL=postgresql://postgres:password@localhost:5432/alumni_db
   JWT_SECRET=super_secret_jwt_key
   JWT_EXPIRES_IN=7d
   ```

3. **Veritabanı migration işlemlerini tamamlayın:**
   ```bash
   npx prisma migrate dev  # veya kullanılan ORM'e göre migration komutu
   ```

4. **Geliştirme sunucusunu başlatın:**
   ```bash
   npm run dev
   ```

---

## 🌿 GitHub ve Ekip Çalışma Kuralları

Projeyi geliştirirken temiz bir sürüm geçmişi ve düzenli iş akışı için aşağıdaki kurallar uygulanır:

### Dal (Branch) Stratejisi
- `main`: Yalnızca test edilmiş, stabil ve canlıya hazır sürümler yer alır. Doğrudan commit atılmaz.
- `develop`: Geliştirme ana dalı.
- `feature/<ozellik-adi>`: Yeni bir özellik eklerken (örneğin: `feature/auth-system`, `feature/job-board`).
- `bugfix/<hata-adi>`: Hata düzeltmeleri için (örneğin: `bugfix/login-redirect`).

### Commit Mesaj Standartları (Conventional Commits)
- `feat:` Yeni bir özellik eklendiğinde (örn: `feat: add alumni profile filtering`)
- `fix:` Bir hata düzeltildiğinde (örn: `fix: resolve jwt expiration bug`)
- `docs:` Yalnızca dokümantasyon değişikliklerinde (örn: `docs: update setup instructions in readme`)
- `refactor:` Kodun davranışını değiştirmeyen yapısal düzenlemelerde (örn: `refactor: modularize db connection`)
- `style:` Kod formatı, noktalı virgül eksikliği vb. (işlevsel olmayan) değişikliklerde
- `chore:` Paket güncellemeleri veya build konfigürasyonlarında (örn: `chore: update dependencies`)

---

## 🗺️ Proje Yol Haritası (Roadmap)

- [x] **Aşama 1:** Proje gereksinimlerinin belirlenmesi ve mimari planlama
- [ ] **Aşama 2:** Veritabanı E-R diyagramının çıkarılması ve PostgreSQL şemasının oluşturulması
- [ ] **Aşama 3:** Docker & Docker Compose altyapısının kurulması
- [ ] **Aşama 4:** Node.js/Express.js REST API çekirdek mimarisinin ve JWT kimlik doğrulamasının yazılması
- [ ] **Aşama 5:** Mezun profilleri, arama/filtreleme ve ilan modüllerinin tamamlanması
- [ ] **Aşama 6:** Yönetici paneli ve onay mekanizması
- [ ] **Aşama 7:** Frontend entegrasyonu ve arayüz testleri
- [ ] **Aşama 8:** Proje sunumu ve final teslimi

---

## 👥 Katkıda Bulunanlar

- **Rumeysa Aydın** - *Geliştirici / Proje Sahibi* - [GitHub](https://github.com/rumeysa478)

---

## 📄 Lisans

Bu proje akademik ve eğitim amaçlı geliştirilmiş olup [MIT Lisansı](LICENSE) kapsamında lisanslanmıştır.
